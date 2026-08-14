import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CORSAIR_TUNNEL_ZONE } from './constants';
import { resolveFrpcBinary } from './frpc-binary';
import { buildFrpcConfig } from './frpc-config';
import { startPathGuard } from './path-guard';

// Bound every Hub request so a hung/silent Hub can't wedge startup with an
// open frpc child + path guard (and, on the auto path, a stuck activeTunnels key).
const HUB_REQUEST_TIMEOUT_MS = 15_000;

// frpc logs this once the server accepts the proxy; and this when it refuses one.
const READY_RE = /start proxy success/i;
const PROXY_ERROR_RE = /start error/i;

/** Fetches this dev environment's frp connection details from the Hub. */
export async function fetchTunnelConfig(opts: {
	apiUrl: string;
	apiKey: string;
}): Promise<{ serverAddr: string; serverPort: number; slug: string }> {
	const base = opts.apiUrl.replace(/\/$/, '');
	const res = await fetch(`${base}/api/dev/tunnel-config`, {
		headers: { authorization: `Bearer ${opts.apiKey}` },
		signal: AbortSignal.timeout(HUB_REQUEST_TIMEOUT_MS),
	});
	if (!res.ok) {
		throw new Error(`Hub tunnel-config failed (HTTP ${res.status})`);
	}
	const body = (await res.json()) as {
		serverAddr?: string;
		serverPort?: number;
		slug?: string;
	};
	// The slug becomes the frpc subdomain; the addr goes straight into frpc config.
	if (!body.slug || !/^[a-z0-9-]+$/.test(body.slug)) {
		throw new Error('Hub tunnel-config returned an invalid slug');
	}
	// A bare hostname only — reject anything (quotes, newlines, spaces) that could
	// break out of the frpc toml string literal, even from a compromised Hub.
	if (!body.serverAddr || !/^[a-z0-9.-]+$/i.test(body.serverAddr)) {
		throw new Error('Hub tunnel-config returned an invalid server address');
	}
	if (
		!Number.isInteger(body.serverPort) ||
		(body.serverPort as number) < 1 ||
		(body.serverPort as number) > 65535
	) {
		throw new Error('Hub tunnel-config returned an invalid server port');
	}
	return {
		serverAddr: body.serverAddr,
		serverPort: body.serverPort as number,
		slug: body.slug,
	};
}

/**
 * Spawns `frpc -c <tmp toml>` under the Hub-assigned slug, waits for the proxy
 * to register, then pings the Hub that the tunnel is live. The frpc binary is
 * resolved from the SDK's own install (no `brew install`); `shareHost` is only
 * used to derive the public URL — the Hub owns the slug.
 */
export async function runTunnel(opts: {
	port: number;
	apiUrl: string;
	apiKey: string;
	shareHost?: string;
	timeoutMs?: number;
	/** Called if the frpc child exits *after* the tunnel came up. */
	onClose?: () => void;
}): Promise<{ url: string; stop: () => void }> {
	const {
		port,
		apiUrl,
		apiKey,
		shareHost = CORSAIR_TUNNEL_ZONE,
		timeoutMs = 20_000,
		onClose,
	} = opts;

	const { serverAddr, serverPort, slug } = await fetchTunnelConfig({
		apiUrl,
		apiKey,
	});
	const bin = resolveFrpcBinary();

	// Share the path-guard, not the app: the public URL only ever reaches
	// /api/corsair, never the developer's other routes.
	const guard = await startPathGuard(port);

	// frpc reads config from a file — keeps the ck_dev_ key off argv/ps. The
	// temp dir (0600 file) is reaped on stop/exit so the key doesn't linger.
	const cfgDir = mkdtempSync(join(tmpdir(), 'corsair-frpc-'));
	const cfgPath = join(cfgDir, 'frpc.toml');
	writeFileSync(
		cfgPath,
		buildFrpcConfig({
			serverAddr,
			serverPort,
			apiKey,
			slug,
			localPort: guard.port,
		}),
		{ mode: 0o600 },
	);

	// The Hub owns the slug, so the URL is derived, never parsed from frpc output.
	const url = `https://${slug}.${shareHost}`;

	return new Promise((resolve, reject) => {
		let settled = false;
		let ready = false;
		let outputBuffer = '';

		const child = spawn(bin, ['-c', cfgPath], {
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		const cleanup = (): void => {
			void guard.close();
			rmSync(cfgDir, { recursive: true, force: true });
		};

		// Registered up front so an early exit still reaps the child + guard + cfg.
		const exitHandler = (): void => {
			if (!child.killed) child.kill();
			cleanup();
		};
		process.once('exit', exitHandler);

		const stop = (): void => {
			process.removeListener('exit', exitHandler);
			child.stdout.removeAllListeners('data');
			child.stderr.removeAllListeners('data');
			if (!child.killed) child.kill();
			cleanup();
		};

		const fail = (err: Error): void => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			stop();
			reject(err);
		};

		const onChunk = async (chunk: Buffer): Promise<void> => {
			if (ready) return;
			outputBuffer += chunk.toString();
			// A rejected proxy (bad slug/key) leaves frpc running but with no
			// tunnel — fail fast instead of waiting for the timeout.
			if (PROXY_ERROR_RE.test(outputBuffer)) {
				fail(
					new Error(
						`frpc rejected the tunnel: ${firstErrorLine(outputBuffer)}`,
					),
				);
				return;
			}
			if (!READY_RE.test(outputBuffer)) return;
			// Proxy is up, but stay unsettled until the ping succeeds — so a child
			// death mid-ping still routes through fail()/onClose, not a dead resolve.
			ready = true;
			clearTimeout(timer);
			try {
				await pingTunnelLive({ apiUrl, apiKey });
			} catch (err) {
				fail(err instanceof Error ? err : new Error(String(err)));
				return;
			}
			if (settled) return;
			settled = true;
			resolve({ url, stop });
		};

		child.stdout.on('data', (chunk: Buffer) => {
			void onChunk(chunk);
		});
		child.stderr.on('data', (chunk: Buffer) => {
			void onChunk(chunk);
		});

		child.on('error', (err) => {
			fail(new Error(`Failed to spawn frpc: ${err.message}`));
		});

		child.on('exit', (code) => {
			if (!settled) {
				fail(
					new Error(
						`frpc exited early (code ${code ?? 'null'}) before the tunnel came up`,
					),
				);
				return;
			}
			// Tunnel died after startup: reap the guard/cfg and let the caller restart.
			process.removeListener('exit', exitHandler);
			cleanup();
			onClose?.();
		});

		const timer = setTimeout(() => {
			fail(
				new Error(
					`Timed out after ${timeoutMs}ms waiting for frpc to establish the tunnel`,
				),
			);
		}, timeoutMs);
	});
}

function firstErrorLine(output: string): string {
	const line = output.split('\n').find((l) => PROXY_ERROR_RE.test(l));
	return (line ?? 'start error').trim();
}

/**
 * Tells the Hub the tunnel is live. No URL is sent — the Hub derives the
 * delivery URL from its own slug, so a dev can't point Hub delivery elsewhere.
 */
export async function pingTunnelLive(opts: {
	apiUrl: string;
	apiKey: string;
}): Promise<void> {
	const base = opts.apiUrl.replace(/\/$/, '');
	const res = await fetch(`${base}/api/dev/register`, {
		method: 'POST',
		headers: { authorization: `Bearer ${opts.apiKey}` },
		signal: AbortSignal.timeout(HUB_REQUEST_TIMEOUT_MS),
	});
	if (!res.ok) {
		throw new Error(`Hub tunnel-live ping failed (HTTP ${res.status})`);
	}
}

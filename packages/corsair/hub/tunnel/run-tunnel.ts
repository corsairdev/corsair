import { spawn } from 'node:child_process';
import { CORSAIR_TUNNEL_ZONE } from './constants';
import { startPathGuard } from './path-guard';

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts the public share URL from zrok's headless output.
 *
 * zrok emits the share endpoint as a bare host with no scheme (e.g.
 * `xs2opjru3i9f.shares.zrok.io`) inside a JSON log line. With `opts.host` set
 * we match `<label>.<host>` and return it as an https URL. Without a host we
 * fall back to the last full https URL that stands alone on a line.
 */
export function extractTunnelUrl(
	output: string,
	opts?: { host?: string },
): string | null {
	if (opts?.host) {
		const hostRe = new RegExp(
			`(?:https?:\\/\\/)?([a-z0-9-]+\\.${escapeRegExp(opts.host)})`,
			'i',
		);
		const match = output.match(hostRe);
		if (match) return `https://${match[1]}`;
	}

	let found: string | null = null;
	for (const rawLine of output.split('\n')) {
		const line = rawLine.trim().replace(/['".,;)]+$/, '');
		if (/^https:\/\/\S+$/.test(line)) {
			found = line;
		}
	}
	return found;
}

/** Fetches this dev environment's Hub-assigned tunnel slug. */
export async function fetchTunnelSlug(opts: {
	apiUrl: string;
	apiKey: string;
}): Promise<string> {
	const base = opts.apiUrl.replace(/\/$/, '');
	const res = await fetch(`${base}/api/dev/tunnel-config`, {
		headers: { authorization: `Bearer ${opts.apiKey}` },
	});
	if (!res.ok) {
		throw new Error(`Hub tunnel-config failed (HTTP ${res.status})`);
	}
	const body = (await res.json()) as { slug?: string };
	if (!body.slug) {
		throw new Error('Hub tunnel-config returned no slug');
	}
	return body.slug;
}

/**
 * Spawns `<bin> share public http://127.0.0.1:<guard> --headless` under the
 * Hub-assigned slug, waits for the public URL, then pings the Hub that the
 * tunnel is live. `bin` defaults to `zrok`; `shareHost` is the instance DNS
 * zone used to recognise the URL in zrok's output.
 */
export async function runTunnel(opts: {
	port: number;
	apiUrl: string;
	apiKey: string;
	bin?: string;
	shareHost?: string;
	timeoutMs?: number;
}): Promise<{ url: string; stop: () => void }> {
	const {
		port,
		apiUrl,
		apiKey,
		bin = 'zrok',
		shareHost = CORSAIR_TUNNEL_ZONE,
		timeoutMs = 20_000,
	} = opts;

	// The Hub owns the slug; the SDK just reserves + shares the assigned name.
	const shareName = await fetchTunnelSlug({ apiUrl, apiKey });

	// Share the path-guard, not the app: the public URL only ever reaches
	// /api/corsair, never the developer's other routes.
	const guard = await startPathGuard(port);
	const shareArgs = [
		'share',
		'public',
		`http://127.0.0.1:${guard.port}`,
		'--headless',
		'--name-selection',
		`public:${shareName}`,
	];

	// Idempotent: reserving a name we already own is a harmless no-op.
	await ensureReservedName(bin, shareName);

	return new Promise((resolve, reject) => {
		let settled = false;
		let outputBuffer = '';

		const child = spawn(bin, shareArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

		// Registered up front so an early exit still reaps the child + guard.
		const exitHandler = (): void => {
			if (!child.killed) child.kill();
			void guard.close();
		};
		process.once('exit', exitHandler);

		const stop = (): void => {
			process.removeListener('exit', exitHandler);
			child.stdout.removeAllListeners('data');
			child.stderr.removeAllListeners('data');
			if (!child.killed) child.kill();
			void guard.close();
		};

		const fail = (err: Error): void => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			stop();
			reject(err);
		};

		const onChunk = async (chunk: Buffer): Promise<void> => {
			if (settled) return;
			outputBuffer += chunk.toString();
			const url = extractTunnelUrl(outputBuffer, { host: shareHost });
			if (!url) return;
			settled = true;
			clearTimeout(timer);

			try {
				await pingTunnelLive({ apiUrl, apiKey });
			} catch (err) {
				stop();
				reject(err instanceof Error ? err : new Error(String(err)));
				return;
			}

			resolve({ url, stop });
		};

		child.stdout.on('data', (chunk: Buffer) => {
			void onChunk(chunk);
		});
		child.stderr.on('data', (chunk: Buffer) => {
			void onChunk(chunk);
		});

		child.on('error', (err) => {
			fail(
				new Error(
					`Failed to spawn ${bin}: ${err.message}. Is ${bin} installed and on PATH?`,
				),
			);
		});

		child.on('exit', (code) => {
			if (!settled) {
				fail(
					new Error(
						`${bin} exited early (code ${code ?? 'null'}) before a public URL appeared`,
					),
				);
			}
		});

		const timer = setTimeout(() => {
			fail(
				new Error(
					`Timed out after ${timeoutMs}ms waiting for zrok to emit a public URL`,
				),
			);
		}, timeoutMs);
	});
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
	});
	if (!res.ok) {
		throw new Error(`Hub tunnel-live ping failed (HTTP ${res.status})`);
	}
}

/**
 * Reserves the share name if it doesn't already exist. Best-effort and
 * idempotent — a name we already own is not an error; the share is the real
 * success signal. Bounded so a hung binary can't wedge startup.
 */
async function ensureReservedName(bin: string, name: string): Promise<void> {
	return new Promise((resolve) => {
		const child = spawn(bin, ['create', 'name', name], { stdio: 'ignore' });
		const timer = setTimeout(() => {
			if (!child.killed) child.kill();
			resolve();
		}, 5000);
		child.on('exit', () => {
			clearTimeout(timer);
			resolve();
		});
		child.on('error', () => {
			clearTimeout(timer);
			resolve();
		});
	});
}

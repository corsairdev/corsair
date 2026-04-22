import fs from 'node:fs';
import type { ServerResponse } from 'node:http';
import http from 'node:http';
import { findCorsairConfigPath } from '@corsair-dev/cli';
import { loadCorsair } from './load';
import { handleApi } from './router';
import { createStaticServer } from './serve-static';
import type { CorsairHandle } from './types';

export type StartStudioOptions = {
	/** Project root that contains the user's corsair.ts. Defaults to process.cwd(). */
	cwd?: string;
	/** Port to listen on. Defaults to 4317. */
	port?: number;
	/** Hostname to bind to. Defaults to 127.0.0.1. */
	host?: string;
	/** Open the studio URL in the default browser. Defaults to true. */
	open?: boolean;
	/**
	 * Optional path to built static assets. If not provided, assets are resolved
	 * relative to this module (dist/web when installed, dist/web when built locally).
	 */
	webRoot?: string;
};

export async function startStudio(options: StartStudioOptions = {}): Promise<{
	port: number;
	url: string;
	close: () => Promise<void>;
}> {
	const cwd = options.cwd ?? process.cwd();
	const port = options.port ?? 4317;
	const host = options.host ?? '127.0.0.1';
	const open = options.open ?? true;

	// Pre-load once so failures surface on startup instead of first request.
	let handle: CorsairHandle;
	try {
		handle = await loadCorsair(cwd);
	} catch (err) {
		console.error('[corsair:studio] Failed to load your corsair instance:');
		console.error(`  ${err instanceof Error ? err.message : String(err)}`);
		throw err;
	}

	const configPath = findCorsairConfigPath(cwd);
	let refreshTimer: ReturnType<typeof setTimeout> | null = null;
	let refreshing: Promise<void> | null = null;
	let refreshQueued = false;
	const uiEventClients = new Set<ServerResponse>();

	const notifyUiCorsairChanged = (): void => {
		const message = `event: corsair-changed\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`;
		for (const client of uiEventClients) {
			client.write(message);
		}
	};

	const refreshCorsair = async (): Promise<void> => {
		if (refreshing) {
			refreshQueued = true;
			return refreshing;
		}

		refreshing = (async () => {
			do {
				refreshQueued = false;
				try {
					const nextHandle = await loadCorsair(cwd, { force: true });
					handle = nextHandle;
					console.log(
						'[corsair:studio] Reloaded Corsair instance after change.',
					);
					console.log(
						`[corsair:studio]   plugins: ${handle.internal.plugins.length}`,
					);
					console.log(
						`[corsair:studio]   multiTenant: ${handle.internal.multiTenancy ? 'yes' : 'no'}`,
					);
					notifyUiCorsairChanged();
				} catch (err) {
					console.error(
						'[corsair:studio] Failed to reload Corsair instance after change:',
					);
					console.error(
						`  ${err instanceof Error ? err.message : String(err)}`,
					);
				}
			} while (refreshQueued);
		})().finally(() => {
			refreshing = null;
		});

		return refreshing;
	};

	const onConfigFileChange = (curr: fs.Stats, prev: fs.Stats): void => {
		if (curr.mtimeMs === prev.mtimeMs && curr.size === prev.size) return;
		if (refreshTimer) clearTimeout(refreshTimer);
		refreshTimer = setTimeout(() => {
			void refreshCorsair();
		}, 120);
	};

	if (configPath) {
		fs.watchFile(configPath, { interval: 250 }, onConfigFileChange);
		console.log(`[corsair:studio] watching: ${configPath}`);
	} else {
		console.log(
			'[corsair:studio] warning: could not find corsair config file.',
		);
	}

	const serveStatic = createStaticServer(options.webRoot);

	const server = http.createServer(async (req, res) => {
		res.setHeader('Cache-Control', 'no-store');
		const url = new URL(req.url ?? '/', `http://${host}:${port}`);

		if (url.pathname === '/api/events') {
			res.writeHead(200, {
				'content-type': 'text/event-stream',
				'cache-control': 'no-cache, no-transform',
				connection: 'keep-alive',
			});
			res.write(': connected\n\n');
			uiEventClients.add(res);
			req.on('close', () => {
				uiEventClients.delete(res);
			});
			return;
		}

		if (url.pathname.startsWith('/api/')) {
			await handleApi(req, res, {
				cwd,
				getCorsair: async () => handle,
			});
			return;
		}

		if (serveStatic(req, res)) return;
		res.writeHead(404).end('not found');
	});

	await new Promise<void>((resolve, reject) => {
		server.once('error', reject);
		server.listen(port, host, () => resolve());
	});

	const url = `http://${host}:${port}`;
	console.log(`[corsair:studio] → ${url}`);
	console.log(`[corsair:studio]   project: ${cwd}`);
	console.log(`[corsair:studio]   plugins: ${handle.internal.plugins.length}`);
	console.log(
		`[corsair:studio]   multiTenant: ${handle.internal.multiTenancy ? 'yes' : 'no'}`,
	);

	if (open) {
		openInBrowser(url).catch(() => {
			console.log('[corsair:studio] Could not open browser automatically.');
		});
	}

	return {
		port,
		url,
		close: async () => {
			if (refreshTimer) {
				clearTimeout(refreshTimer);
				refreshTimer = null;
			}
			if (configPath) {
				fs.unwatchFile(configPath, onConfigFileChange);
			}
			for (const client of uiEventClients) {
				client.end();
			}
			uiEventClients.clear();
			await new Promise<void>((resolve, reject) =>
				server.close((err) => (err ? reject(err) : resolve())),
			);
		},
	};
}

async function openInBrowser(url: string): Promise<void> {
	const { spawn } = await import('node:child_process');
	const platform = process.platform;
	const cmd =
		platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd' : 'xdg-open';
	const args = platform === 'win32' ? ['/c', 'start', '""', url] : [url];
	const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
	child.unref();
}

export { startStudio as start };

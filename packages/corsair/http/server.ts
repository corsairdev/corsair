import http from 'node:http';
import { URL } from 'node:url';
import ngrok from '@ngrok/ngrok';
import type { WebhookBody } from '../webhooks';
import { processWebhook } from '../webhooks';

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Server
// ─────────────────────────────────────────────────────────────────────────────

function send(
	res: http.ServerResponse,
	status: number,
	contentType: string,
	body: string,
): void {
	res.writeHead(status, { 'Content-Type': contentType });
	res.end(body);
}

function sendJson(
	res: http.ServerResponse,
	status: number,
	data: unknown,
): void {
	send(res, status, 'application/json', JSON.stringify(data));
}

/** Reads the full request body as a UTF-8 string. */
function readBody(req: http.IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		req.on('data', (chunk: Buffer) => chunks.push(chunk));
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
		req.on('error', reject);
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleWebhook(
	req: http.IncomingMessage,
	res: http.ServerResponse,
	pluginId: string,
	// The live corsair instance — unknown because Plugins generic isn't statically
	// available inside the HTTP layer; processWebhook accepts unknown and handles typing.
	corsairInstance: unknown,
): Promise<void> {
	const body = await readBody(req);

	// Normalise headers to Record<string, string>
	const headers: Record<string, string | string[] | undefined> = {};
	for (const [k, v] of Object.entries(req.headers)) {
		headers[k.toLowerCase()] = v;
	}

	let parsedBody: unknown;
	try {
		parsedBody = JSON.parse(body);
	} catch {
		parsedBody = body;
	}

	try {
		// processWebhook's first arg is typed CorsairInstance (a complex generic union) —
		// we cast to Parameters<...>[0] here because the exact Plugins generic isn't
		// statically available inside the HTTP layer. Runtime shape is always valid.
		const safeBody =
			parsedBody !== null && typeof parsedBody === 'object'
				? (parsedBody as WebhookBody)
				: String(parsedBody);
		const result = await processWebhook(
			corsairInstance as Parameters<typeof processWebhook>[0],
			headers,
			safeBody,
		);
		sendJson(res, 200, {
			ok: true,
			plugin: result?.plugin,
			action: result?.action,
		});
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Webhook processing failed';
		sendJson(res, 500, { ok: false, error: message });
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Request Router
// ─────────────────────────────────────────────────────────────────────────────

function createRequestHandler(
	corsairInstance: unknown,
	publicUrl: string,
) {
	return async (
		req: http.IncomingMessage,
		res: http.ServerResponse,
	): Promise<void> => {
		const rawUrl = req.url ?? '/';
		const urlObj = new URL(rawUrl, 'http://localhost');
		const pathname = urlObj.pathname;
		const method = req.method?.toUpperCase() ?? 'GET';

		try {
			// POST /webhooks/{pluginId}
			const webhookMatch = pathname.match(/^\/webhooks\/([^/]+)$/);
			if (webhookMatch && method === 'POST') {
				await handleWebhook(req, res, webhookMatch[1]!, corsairInstance);
				return;
			}

			// GET /corsair/health
			if (pathname === '/corsair/health' && method === 'GET') {
				sendJson(res, 200, { ok: true, publicUrl });
				return;
			}

			send(res, 404, 'text/plain', 'Not found');
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Internal server error';
			sendJson(res, 500, { error: message });
		}
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Server Lifecycle
// ─────────────────────────────────────────────────────────────────────────────

export type HttpServerResult = {
	publicUrl: string;
	close: () => void;
};

export type StartHttpServerOptions = {
	corsairInstance: unknown;
	ngrokAuthToken: string;
	/** Local port to bind. Defaults to a random available port in 3700–3799 range. */
	port?: number;
};

/**
 * Starts the Corsair HTTP server and establishes a ngrok tunnel.
 *
 * The server handles:
 * - `POST /webhooks/{pluginId}` — inbound webhooks from external services
 * - `GET  /corsair/health`      — health check
 */
export async function startHttpServer(
	opts: StartHttpServerOptions,
): Promise<HttpServerResult> {
	const { corsairInstance, ngrokAuthToken } = opts;

	const port = opts.port ?? 3700 + Math.floor(Math.random() * 100);

	// We need a mutable reference to publicUrl that the handler can read after ngrok starts.
	let resolvedPublicUrl = '';

	const server = http.createServer(async (req, res) => {
		const h = createRequestHandler(corsairInstance, resolvedPublicUrl);
		await h(req, res);
	});

	await new Promise<void>((resolve, reject) => {
		server.listen(port, () => resolve());
		server.once('error', reject);
	});

	// Start ngrok tunnel
	const listener = await ngrok.connect({
		addr: port,
		authtoken: ngrokAuthToken,
	});

	resolvedPublicUrl = listener.url() ?? '';

	return {
		publicUrl: resolvedPublicUrl,
		close: () => {
			server.close();
			listener.close();
		},
	};
}

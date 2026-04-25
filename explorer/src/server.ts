import express, { type Request, type Response } from 'express';
import type { Catalog } from './catalog';

export type CreateServerOptions = {
	catalog: Catalog;
	/**
	 * CORS origin header to send. Defaults to `*` so the catalog is usable from
	 * any browser client (it contains no secrets — just public plugin metadata).
	 */
	corsOrigin?: string;
};

/**
 * Builds the Express app. Exposed separately from the CLI entry so it can be
 * mounted in tests or composed with other middleware.
 */
export function createServer(options: CreateServerOptions): express.Express {
	const { catalog } = options;
	const corsOrigin = options.corsOrigin ?? '*';

	const app = express();

	app.set('json spaces', 2);

	app.use((_req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', corsOrigin);
		res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('X-Catalog-Generated-At', catalog.generatedAt);
		res.setHeader('X-Corsair-Version', catalog.corsairVersion);
		next();
	});

	app.options('*', (_req, res) => {
		res.sendStatus(204);
	});

	app.get('/', (_req, res) => {
		res.json({
			name: 'corsair-explorer',
			description:
				'Browse every Corsair plugin and every api / webhook / db operation it exposes.',
			endpoints: [
				'GET /health',
				'GET /v1/meta',
				'GET /v1/plugins',
				'GET /v1/plugins/:id',
				'GET /v1/plugins/:id/api',
				'GET /v1/plugins/:id/api/:shortPath',
				'GET /v1/plugins/:id/webhooks',
				'GET /v1/plugins/:id/webhooks/:shortPath',
				'GET /v1/plugins/:id/db',
				'GET /v1/plugins/:id/db/:entity',
				'GET /v1/search?q=<query>',
			],
		});
	});

	app.get('/health', (_req, res) => {
		res.json({ ok: true });
	});

	app.get('/v1/meta', (_req, res) => {
		res.json({
			generatedAt: catalog.generatedAt,
			corsairVersion: catalog.corsairVersion,
			catalogVersion: catalog.catalogVersion,
			pluginCount: catalog.listSummaries().length,
		});
	});

	app.get('/v1/plugins', (_req, res) => {
		res.json({ plugins: catalog.listSummaries() });
	});

	app.get('/v1/plugins/:id', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		res.json({ plugin });
	});

	app.get('/v1/plugins/:id/api', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		res.json({ pluginId: plugin.id, api: plugin.api });
	});

	// `shortPath` uses `*` so values like `messages.post` come through intact.
	app.get('/v1/plugins/:id/api/*', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		const shortPath = getWildcardParam(req);
		const endpoint = catalog.findApiEndpoint(plugin.id, shortPath);
		if (!endpoint) {
			res.status(404).json({
				error: 'endpoint_not_found',
				message: `No api endpoint "${shortPath}" on plugin "${plugin.id}".`,
				available: plugin.api.map((e) => e.shortPath),
			});
			return;
		}
		res.json({ pluginId: plugin.id, endpoint });
	});

	app.get('/v1/plugins/:id/webhooks', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		res.json({ pluginId: plugin.id, webhooks: plugin.webhooks });
	});

	app.get('/v1/plugins/:id/webhooks/*', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		const shortPath = getWildcardParam(req);
		const webhook = catalog.findWebhook(plugin.id, shortPath);
		if (!webhook) {
			res.status(404).json({
				error: 'webhook_not_found',
				message: `No webhook "${shortPath}" on plugin "${plugin.id}".`,
				available: plugin.webhooks.map((w) => w.shortPath),
			});
			return;
		}
		res.json({ pluginId: plugin.id, webhook });
	});

	app.get('/v1/plugins/:id/db', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		res.json({ pluginId: plugin.id, db: plugin.db });
	});

	app.get('/v1/plugins/:id/db/:entity', (req, res) => {
		const plugin = catalog.getPlugin(req.params.id);
		if (!plugin) {
			sendPluginNotFound(res, req.params.id);
			return;
		}
		const entity = catalog.findDbEntity(plugin.id, req.params.entity);
		if (!entity) {
			res.status(404).json({
				error: 'entity_not_found',
				message: `No db entity "${req.params.entity}" on plugin "${plugin.id}".`,
				available: plugin.db.map((d) => d.entityName),
			});
			return;
		}
		res.json({ pluginId: plugin.id, entity });
	});

	app.get('/v1/search', (req, res) => {
		const q = typeof req.query.q === 'string' ? req.query.q : '';
		if (q.trim().length === 0) {
			res.status(400).json({
				error: 'missing_query',
				message: 'Pass ?q=<query> to search.',
			});
			return;
		}
		res.json({ query: q, results: catalog.search(q) });
	});

	app.use((_req, res) => {
		res.status(404).json({ error: 'not_found' });
	});

	return app;
}

function sendPluginNotFound(res: Response, id: string): void {
	res.status(404).json({
		error: 'plugin_not_found',
		message: `No plugin "${id}" in the catalog.`,
	});
}

/**
 * Express puts wildcard matches on `req.params[0]` (and also `req.params['0']`
 * depending on version). Grab the first non-named param regardless.
 */
function getWildcardParam(req: Request): string {
	const params = req.params as Record<string, string>;
	return params['0'] ?? '';
}

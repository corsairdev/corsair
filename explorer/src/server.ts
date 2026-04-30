import express, { type Request, type Response } from 'express';
import type { Catalog } from './catalog';
import type { DocsApiEndpoint, DocsDbEntity, DocsWebhook } from './types';

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
		const plugins = catalog.listSummaries().map((p) => ({
			name: p.id,
			displayName: p.displayName,
			npmPackageName: p.npmPackageName,
			description: p.description,
		}));
		res.json({
			plugins,
			note: 'To install a plugin, run: pnpm install @corsair-dev/<plugin_name>',
		});
	});

	app.get('/health', (_req, res) => {
		res.json({ ok: true });
	});

	// GET /<plugin> or GET /<plugin>/api - List API endpoints
	app.get('/:plugin', (req, res) => {
		const plugin = catalog.getPlugin(req.params.plugin);
		if (!plugin) {
			sendPluginNotFound(res, req.params.plugin);
			return;
		}
		const endpoints = plugin.api.map(toApiEndpointSummary);
		res.json({ plugin: plugin.id, endpoints });
	});

	app.get('/:plugin/api', (req, res) => {
		const plugin = catalog.getPlugin(req.params.plugin);
		if (!plugin) {
			sendPluginNotFound(res, req.params.plugin);
			return;
		}
		const endpoints = plugin.api.map(toApiEndpointSummary);
		res.json({ plugin: plugin.id, endpoints });
	});

	// GET /<plugin>/db - List DB entities
	app.get('/:plugin/db', (req, res) => {
		const plugin = catalog.getPlugin(req.params.plugin);
		if (!plugin) {
			sendPluginNotFound(res, req.params.plugin);
			return;
		}
		const entities = plugin.db.map(toDbEntitySummary);
		res.json({ plugin: plugin.id, entities });
	});

	// GET /<plugin>/webhooks - List webhooks
	app.get('/:plugin/webhooks', (req, res) => {
		const plugin = catalog.getPlugin(req.params.plugin);
		if (!plugin) {
			sendPluginNotFound(res, req.params.plugin);
			return;
		}
		const webhooks = plugin.webhooks.map(toWebhookSummary);
		res.json({ plugin: plugin.id, webhooks });
	});

	// GET /schema/<endpoint> - Full schema for specific endpoint
	// Format: plugin.type.shortPath (e.g., slack.api.messages.post)
	app.get('/schema/*', (req, res) => {
		const endpointPath = getWildcardParam(req);
		const parts = endpointPath.split('.');
		
		if (parts.length < 2) {
			res.status(400).json({
				error: 'invalid_path',
				message: 'Schema path must be in format: plugin.type.shortPath (e.g., slack.api.messages.post)',
			});
			return;
		}

		const [pluginId, type, ...shortPathParts] = parts;
		const shortPath = shortPathParts.join('.');

		if (!['api', 'webhooks', 'db'].includes(type!)) {
			res.status(400).json({
				error: 'invalid_type',
				message: `Invalid endpoint type "${type}". Must be one of: api, webhooks, db`,
			});
			return;
		}

		const plugin = catalog.getPlugin(pluginId!);
		if (!plugin) {
			sendPluginNotFound(res, pluginId!);
			return;
		}

		if (type === 'api') {
			const endpoint = catalog.findApiEndpoint(pluginId!, shortPath);
			if (!endpoint) {
				res.status(404).json({
					error: 'endpoint_not_found',
					message: `No api endpoint "${shortPath}" on plugin "${pluginId}".`,
					available: plugin.api.map((e) => e.shortPath),
				});
				return;
			}
			res.json({ plugin: pluginId, type: 'api', shortPath, endpoint });
			return;
		}

		if (type === 'webhooks') {
			const webhook = catalog.findWebhook(pluginId!, shortPath);
			if (!webhook) {
				res.status(404).json({
					error: 'webhook_not_found',
					message: `No webhook "${shortPath}" on plugin "${pluginId}".`,
					available: plugin.webhooks.map((w) => w.shortPath),
				});
				return;
			}
			res.json({ plugin: pluginId, type: 'webhooks', shortPath, webhook });
			return;
		}

		if (type === 'db') {
			const entity = catalog.findDbEntity(pluginId!, shortPath);
			if (!entity) {
				res.status(404).json({
					error: 'entity_not_found',
					message: `No db entity "${shortPath}" on plugin "${pluginId}".`,
					available: plugin.db.map((d) => d.entityName),
				});
				return;
			}
			res.json({ plugin: pluginId, type: 'db', shortPath, entity });
			return;
		}
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

// ============================================================================
// SUMMARY FUNCTIONS - Lightweight responses for agent progressive discovery
// ============================================================================

/**
 * Summarize an API endpoint for list responses.
 * Excludes input/output schemas to reduce token usage.
 */
function toApiEndpointSummary(endpoint: DocsApiEndpoint) {
	const { path, shortPath, description, riskLevel, irreversible } = endpoint;
	return { path, shortPath, description, riskLevel, irreversible };
}

/**
 * Summarize a webhook for list responses.
 * Excludes payload schema to reduce token usage.
 */
function toWebhookSummary(webhook: DocsWebhook) {
	const { path, shortPath, description } = webhook;
	return { path, shortPath, description };
}

/**
 * Summarize a DB entity for list responses.
 * Excludes filter details to reduce token usage.
 */
function toDbEntitySummary(entity: DocsDbEntity) {
	const { path, entityName } = entity;
	return { path, entityName };
}

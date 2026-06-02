import { loadCatalog } from './catalog';
import { createServer } from './server';

const DEFAULT_PORT = 4319;

async function main(): Promise<void> {
	const port = Number.parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;
	const host = process.env.HOST ?? '0.0.0.0';
	const catalogPath = process.env.EXPLORER_CATALOG_PATH;
	const corsOrigin = process.env.EXPLORER_CORS_ORIGIN;

	const catalog = loadCatalog(catalogPath ? { path: catalogPath } : {});
	const app = createServer({
		catalog,
		...(corsOrigin ? { corsOrigin } : {}),
	});

	await new Promise<void>((resolve, reject) => {
		const server = app.listen(port, host, () => resolve());
		server.on('error', reject);
	});

	console.log(
		`[corsair:explorer] listening on http://${host}:${port} — ` +
			`${catalog.listSummaries().length} plugins, generated ${catalog.generatedAt}`,
	);
}

main().catch((err) => {
	console.error('[corsair:explorer] failed to start:', err);
	process.exit(1);
});

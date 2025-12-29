import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CorsairConfig } from '@corsair-ai/core/config';
import { getSchema } from '@corsair-ai/core/db';
import { createDrizzlePostgresSchemaFile } from '@corsair-ai/core/db/adapters/drizzle-postgres';

import { loadConfig } from './config.js';

export async function generateDbSchema(options?: { out?: string }) {
	const cfg = (await loadConfig()) as CorsairConfig<any> | undefined;
	if (!cfg) {
		console.error('No config found');
		process.exit(1);
	}

	if (!cfg.dbPlugins || cfg.dbPlugins.length === 0) {
		console.error(
			'No dbPlugins configured. Add dbPlugins to corsair.config.ts to generate a schema file.',
		);
		process.exit(1);
	}

	if (cfg.orm !== 'drizzle' || cfg.dbType !== 'postgres') {
		console.error(
			`db:schema currently supports only drizzle+postgres. Got orm=${cfg.orm}, dbType=${cfg.dbType}`,
		);
		process.exit(1);
	}

	const normalized = getSchema({ plugins: cfg.dbPlugins });
	const outPath = options?.out ?? 'corsair/db/schema.ts';

	const generated = createDrizzlePostgresSchemaFile({
		schema: normalized,
		path: outPath,
	});

	const absOut = path.resolve(process.cwd(), generated.path);
	await mkdir(path.dirname(absOut), { recursive: true });
	await writeFile(absOut, generated.code, 'utf8');

	console.log(`✅ Generated Drizzle schema at ${generated.path}`);
}

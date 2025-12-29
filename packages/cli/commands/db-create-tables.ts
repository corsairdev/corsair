import { exec } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { createDrizzlePostgresSchemaFile } from '@corsair-ai/core/db/adapters/drizzle-postgres';
import { loadCorsairConfig } from '../utils/load-corsair-config.js';
import { resolvePluginSchemas } from '../utils/resolve-plugin-schemas.js';
import { convertPluginSchemasToDBSchema } from '../utils/convert-plugin-schema.js';

const execAsync = promisify(exec);

export async function createDbTables(options: {
	config?: string;
	push?: boolean;
	out?: string;
}) {
	try {
		const config = await loadCorsairConfig({
			configPath: options.config,
		});

		const plugins = Array.isArray(config.plugins) ? config.plugins : [];
		if (plugins.length === 0) {
			console.error('No plugins configured in corsair.config.ts');
			process.exit(1);
		}

		if (config.orm !== 'drizzle' || config.dbType !== 'postgres') {
			console.error(
				`db:create-tables currently supports only drizzle+postgres. Got orm=${config.orm}, dbType=${config.dbType}`,
			);
			process.exit(1);
		}

		const resolvedSchemas = resolvePluginSchemas({ ...config, plugins } as any);
		const dbSchema = convertPluginSchemasToDBSchema(resolvedSchemas);

		const normalizedSchema: Record<
			string,
			{ fields: Record<string, any> }
		> = {};

		for (const [tableName, table] of Object.entries(dbSchema)) {
			normalizedSchema[table.modelName] = {
				fields: table.fields,
			};
		}

		const outPath = options.out ?? 'corsair/db/schema.ts';
		const generated = createDrizzlePostgresSchemaFile({
			schema: normalizedSchema,
			path: outPath,
		});

		const absOut = path.resolve(process.cwd(), generated.path);
		await mkdir(path.dirname(absOut), { recursive: true });
		await writeFile(absOut, generated.code, 'utf8');

		console.log(`✅ Generated Drizzle schema at ${generated.path}`);

		if (options.push) {
			if (!process.env.DATABASE_URL) {
				console.error(
					'DATABASE_URL environment variable is required when using --push',
				);
				process.exit(1);
			}

			console.log('Pushing schema to database...');

			try {
				const schemaPath = path.resolve(process.cwd(), generated.path);
				const command = `npx drizzle-kit push --schema=${schemaPath}`;

				await execAsync(command, {
					cwd: process.cwd(),
					env: {
						...process.env,
						DATABASE_URL: process.env.DATABASE_URL,
					},
				});

				console.log('✅ Successfully pushed schema to database');
			} catch (error: any) {
				console.error('❌ Failed to push schema to database:', error.message);
				process.exit(1);
			}
		}
	} catch (error: any) {
		console.error('❌ Error creating database tables:', error.message);
		process.exit(1);
	}
}


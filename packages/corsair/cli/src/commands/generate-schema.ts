import fs from 'node:fs/promises';
import path from 'node:path';
import type { CorsairOptions } from '../../../src/core/options';
import { logger } from '../logger';
import { generateSchema } from '../generators';
import { getConfig } from '../utils/get-config';

export async function generateSchemaCommand(args: {
	config?: string | undefined;
	out?: string | undefined;
	adapter?: string | undefined;
}) {
	const raw = (await getConfig({
		cwd: process.cwd(),
		configPath: args.config,
	})) as CorsairOptions;

	const db = raw?.db;
	if (!db) {
		logger.error(`No db adapter found in your corsair config.`);
		process.exit(1);
	}

	const adapter = args.adapter ? { ...db, id: args.adapter } : db;
	const result = await generateSchema({
		adapter,
		file: args.out,
		options: raw,
	});

	const outPath = path.resolve(process.cwd(), result.fileName);
	await fs.mkdir(path.dirname(outPath), { recursive: true });

	let shouldWrite = true;
	if (result.overwrite === false) {
		try {
			await fs.access(outPath);
			shouldWrite = false;
		} catch {
			shouldWrite = true;
		}
	}

	if (!shouldWrite) {
		logger.info(`Skipped (exists): ${outPath}`);
		return;
	}

	await fs.writeFile(outPath, result.code, 'utf8');
	logger.info(`Wrote: ${outPath}`);
}

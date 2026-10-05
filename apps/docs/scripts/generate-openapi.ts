import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '../lib/openapi';

const OUT = './content/docs/(api)/v1';

/** Landing on the reference tab should show endpoints, not nine shut folders. */
const OPEN_BY_DEFAULT = new Set(['project', 'instances', 'tenants']);

await generateFiles({
	input: openapi,
	output: OUT,
	per: 'operation',
	groupBy: 'tag',
	meta: true,
});

for (const entry of readdirSync(OUT, { withFileTypes: true })) {
	if (!entry.isDirectory() || !OPEN_BY_DEFAULT.has(entry.name)) continue;
	const path = join(OUT, entry.name, 'meta.json');
	const meta = JSON.parse(readFileSync(path, 'utf8'));
	writeFileSync(
		path,
		`${JSON.stringify({ ...meta, defaultOpen: true }, null, 2)}\n`,
	);
}

const rootMeta = join(OUT, 'meta.json');
const root = JSON.parse(readFileSync(rootMeta, 'utf8'));
writeFileSync(
	rootMeta,
	`${JSON.stringify({ ...root, defaultOpen: true }, null, 2)}\n`,
);

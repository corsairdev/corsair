// Copies the static files docs/ serves (Mintlify publishes them from the docs
// root) into public/, so both sites read one copy. Runs before dev and build.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = resolve(app, '../../docs');
const pub = join(app, 'public');

const entries = ['icons', 'images', 'favicon.ico', 'llms.txt'];
mkdirSync(pub, { recursive: true });
for (const entry of entries) {
	const from = join(docs, entry);
	if (!existsSync(from)) continue;
	cpSync(from, join(pub, entry), { recursive: true });
}
console.log(`sync-assets: copied ${entries.join(', ')} from docs/`);

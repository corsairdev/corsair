/**
 * Escape MDX-problematic `{...}` and `<placeholder>` in prose/table cells.
 * Run: bun apps/docs/scripts/fix-mdx-escapes.ts
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_ROOT = join(import.meta.dir, '../content/docs');

function escapeProse(text: string): string {
	let out = text;

	out = out.replace(/<([a-z][a-zA-Z0-9]*)>/g, '`<$1>`');

	out = out.replace(/\{([^{}]*)\}/g, (match, inner: string) => {
		if (match.startsWith('\\{')) return match;
		if (inner.includes('`')) return match;
		if (/['":]|^\s*\.\.\./.test(inner)) {
			return `\\{${inner}\\}`;
		}
		return match;
	});

	return out;
}

function processMdx(content: string): string {
	const parts = content.split(/(```[\s\S]*?```)/g);
	return parts
		.map((part, i) => {
			if (i % 2 === 1) return part;
			const lines = part.split('\n');
			return lines
				.map((line) => {
					if (line.trimStart().startsWith('<') && !line.trimStart().startsWith('<!--')) {
						return line;
					}
					if (line.trimStart().startsWith('import ')) return line;
					return escapeProse(line);
				})
				.join('\n');
		})
		.join('');
}

let files = 0;

function walk(dir: string): void {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) {
			walk(full);
			continue;
		}
		if (!name.endsWith('.mdx')) continue;
		const raw = readFileSync(full, 'utf8');
		const fixed = processMdx(raw);
		if (fixed !== raw) {
			writeFileSync(full, fixed);
			files++;
		}
	}
}

walk(CONTENT_ROOT);
console.log(`Updated ${files} MDX files`);

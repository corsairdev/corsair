import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCompiler } from '@fumadocs/mdx-remote';
import type { MDXComponents } from 'mdx/types';
import { remarkMintlify } from './remark-mintlify';

/**
 * The generated `plugins/<id>/api.mdx` pages (785 files, 46 MB) are compiled
 * when first requested instead of at build time, where they made the build
 * 17x slower (12 min, 6 GB). Same files and same plugins as every other page,
 * so the output matches what the generator wrote, examples and notes included.
 */

const PLUGINS_DIR = path.resolve(process.cwd(), '../../docs/plugins');

export interface ApiPageData {
	title: string;
	description?: string;
	sidebarTitle?: string;
}

function frontmatter(file: string): ApiPageData {
	const head =
		/^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'))?.[1] ?? '';
	const field = (name: string) => {
		const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(head)?.[1]?.trim();
		if (!m) return undefined;
		return m.startsWith('"') ? (JSON.parse(m) as string) : m;
	};
	return {
		title: field('title') ?? 'API',
		description: field('description'),
		sidebarTitle: field('sidebarTitle'),
	};
}

/** Every plugin's api.mdx, as loader files. */
export function apiPageFiles() {
	if (!existsSync(PLUGINS_DIR)) return [];
	return readdirSync(PLUGINS_DIR)
		.map((id) => path.join(PLUGINS_DIR, id, 'api.mdx'))
		.filter((file) => existsSync(file))
		.map((file) => ({
			type: 'page' as const,
			path: path.relative(path.dirname(PLUGINS_DIR), file),
			absolutePath: file,
			data: frontmatter(file),
		}));
}

const compiler = createCompiler({
	remarkPlugins: (plugins) => [remarkMintlify, ...plugins],
	rehypeCodeOptions: {
		themes: { light: 'github-light', dark: 'github-dark' },
		fallbackLanguage: 'text',
	},
});

export async function compileApiPage(file: string, components: MDXComponents) {
	const source = await readFile(file, 'utf8');
	return compiler.compile({ source, filePath: file, components });
}

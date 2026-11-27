import {
	closeSync,
	existsSync,
	openSync,
	readdirSync,
	readSync,
} from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCompiler } from '@fumadocs/mdx-remote';
import type { MDXComponents } from 'mdx/types';
import { remarkMintlify } from './remark-mintlify';

/**
 * The ~2,500 pages under docs/plugins (generated overview, API, database and
 * webhooks pages, 52 MB, plus the written get-credentials pages) are compiled
 * when first requested instead of at build time. Compiling the API pages at
 * build time made the build 17x slower (12 min, 6 GB); the rest pushed a
 * Vercel build machine (8 GB) out of memory. None of them imports anything,
 * which a runtime compile couldn't resolve. Same remark plugins as every
 * other page, so the output matches what the generator wrote.
 */

const PLUGINS_DIR = path.resolve(process.cwd(), '../../docs/plugins');

export interface PluginPageData {
	title: string;
	description?: string;
	sidebarTitle?: string;
}

/** The frontmatter, read from the first 4 KB rather than the whole file. */
function frontmatter(file: string): PluginPageData {
	const fd = openSync(file, 'r');
	const buf = Buffer.alloc(4096);
	const n = readSync(fd, buf, 0, buf.length, 0);
	closeSync(fd);
	const head =
		/^---\n([\s\S]*?)\n---/.exec(buf.subarray(0, n).toString('utf8'))?.[1] ??
		'';
	const field = (name: string) => {
		const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(head)?.[1]?.trim();
		if (!m) return undefined;
		if (m.length > 1 && m.startsWith("'") && m.endsWith("'"))
			return m.slice(1, -1).replace(/''/g, "'");
		return m.startsWith('"') ? (JSON.parse(m) as string) : m;
	};
	return {
		title: field('title') ?? path.basename(file, '.mdx'),
		description: field('description'),
		sidebarTitle: field('sidebarTitle'),
	};
}

/** Every page under docs/plugins, as loader files. */
export function pluginPageFiles() {
	if (!existsSync(PLUGINS_DIR)) return [];
	return readdirSync(PLUGINS_DIR, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.flatMap((d) =>
			readdirSync(path.join(PLUGINS_DIR, d.name))
				.filter((f) => f.endsWith('.mdx'))
				.map((f) => path.join(PLUGINS_DIR, d.name, f)),
		)
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

export async function compilePluginPage(
	file: string,
	components: MDXComponents,
) {
	const source = await readFile(file, 'utf8');
	return compiler.compile({ source, filePath: file, components });
}

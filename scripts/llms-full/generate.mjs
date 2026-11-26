// Generates docs/llms-full.txt: every written page of docs.corsair.dev as
// Markdown, in sidebar order. Mintlify serves a custom llms-full.txt in place
// of the one it generates, which is 53 MB because it inlines all ~2,500
// generated plugin pages; agents can't read that. Plugin pages are linked
// instead.
//
//   pnpm generate:llms-full          write docs/llms-full.txt
//   pnpm generate:llms-full --check  exit 1 if the file is out of date
//
// Its own pnpm project (outside the workspace), so these dependencies never
// touch the root lockfile.

import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { parse as parseYaml } from 'yaml';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(HERE, '../../docs');
const OUT = path.join(DOCS_DIR, 'llms-full.txt');
const SITE_URL = 'https://docs.corsair.dev';

const CALLOUTS = {
	Note: 'NOTE',
	Info: 'NOTE',
	Tip: 'TIP',
	Check: 'TIP',
	Warning: 'WARNING',
	Danger: 'CAUTION',
};

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);
const printer = unified()
	.use(remarkStringify, { bullet: '-', fences: true, rule: '-' })
	.use(remarkGfm);

const text = (value) => ({ type: 'text', value });
const strong = (value) => ({
	type: 'paragraph',
	children: [{ type: 'strong', children: [text(value)] }],
});

function attr(node, name) {
	for (const a of node.attributes) {
		if (a.type !== 'mdxJsxAttribute' || a.name !== name) continue;
		if (typeof a.value === 'string') return a.value;
		if (a.value === null) return 'true';
		return a.value?.value;
	}
	return undefined;
}

/**
 * Internal links become absolute links to the page's .md, as Mintlify serves
 * it. A same-page link (#errors) gets its page's URL: in the combined file it
 * would otherwise land on the first #errors of any earlier page.
 */
function absoluteUrl(url, slug) {
	if (url.startsWith('#')) return `${SITE_URL}/${slug}.md${url}`;
	if (!url.startsWith('/') || url.startsWith('//')) return url;
	const [pathPart, hash] = url.split('#');
	const withMd = /\.[a-z]+$/i.test(pathPart ?? '')
		? pathPart
		: `${pathPart}.md`;
	return `${SITE_URL}${withMd}${hash ? `#${hash}` : ''}`;
}

function powershellNote(body) {
	return [
		{
			type: 'blockquote',
			children: [
				{ type: 'paragraph', children: [{ type: 'html', value: '[!NOTE]' }] },
				{
					type: 'paragraph',
					children: [
						{ type: 'strong', children: [text('PowerShell syntax')] },
						text(`: ${body}`),
					],
				},
			],
		},
	];
}

// Snippets that are interactive widgets (docs/snippets/generate-kek.mdx,
// windows-shell.mdx), written out as what they show.
const WIDGETS = {
	GenerateKEK: () => [
		{
			type: 'code',
			lang: 'bash',
			meta: null,
			value: 'openssl rand -base64 32',
		},
	],
	WindowsMigrationNote: () =>
		powershellNote(
			'Bash redirection and $VAR env vars do not work in PowerShell. Use the Windows commands shown in this tab instead.',
		),
	WindowsEnvVarsNote: () =>
		powershellNote(
			'Use $env:VAR_NAME = "value" to set variables and $env:VAR_NAME wherever docs show $VAR.',
		),
};

/** A file's text with LF line endings, so a CRLF checkout parses the same. */
async function readText(file) {
	return (await readFile(file, 'utf8')).replace(/\r\n?/g, '\n');
}

async function snippetChildren(source) {
	const tree = parser.parse(await readText(path.join(DOCS_DIR, source)));
	return tree.children;
}

async function convert(nodes, ctx) {
	const out = [];
	for (const node of nodes) {
		if (node.type === 'mdxjsEsm') {
			const re =
				/import\s+(\w+|\{\s*(\w+)\s*\})\s+from\s+['"](\/snippets\/[^'"]+\.mdx)['"]/g;
			for (const m of node.value.matchAll(re)) {
				const name = m[2] ?? m[1];
				if (name && m[3]) ctx.snippets.set(name, m[3]);
			}
			continue;
		}
		if (
			node.type === 'mdxFlowExpression' ||
			node.type === 'mdxTextExpression'
		) {
			const value = node.value.trim();
			if (/^[A-Za-z_$][\w$.]*$/.test(value)) out.push(text(`{${value}}`));
			continue;
		}
		if (node.type === 'link') node.url = absoluteUrl(node.url, ctx.slug);
		// Fence metas stay as Mintlify writes them (```ts corsair.ts).
		if (node.type === 'code') {
			out.push(node);
			continue;
		}
		if (
			node.type === 'mdxJsxFlowElement' ||
			node.type === 'mdxJsxTextElement'
		) {
			out.push(...(await element(node, ctx)));
			continue;
		}
		if ('children' in node) node.children = await convert(node.children, ctx);
		out.push(node);
	}
	return out;
}

async function element(node, ctx) {
	const name = node.name ?? '';
	const inner = () => convert(node.children, ctx);

	// Widgets come in as snippet imports, so they're handled first.
	if (WIDGETS[name]) return WIDGETS[name]();

	const snippet = ctx.snippets.get(name);
	if (snippet)
		return convert(await snippetChildren(snippet), {
			...ctx,
			snippets: new Map(),
		});

	const callout = CALLOUTS[name];
	if (callout) {
		return [
			{
				type: 'blockquote',
				children: [
					// html, not text: remark-stringify escapes a leading "[" in text,
					// which breaks GitHub's alert syntax.
					{
						type: 'paragraph',
						children: [{ type: 'html', value: `[!${callout}]` }],
					},
					...(await inner()),
				],
			},
		];
	}

	switch (name) {
		case 'Steps': {
			const saved = ctx.step;
			ctx.step = 0;
			const body = await inner();
			ctx.step = saved;
			return body;
		}
		case 'Step': {
			ctx.step += 1;
			const title = attr(node, 'title');
			const heading = title
				? [{ type: 'heading', depth: 3, children: [text(title)] }]
				: [];
			return [strong(`Step ${ctx.step}`), ...heading, ...(await inner())];
		}
		case 'Tab':
		case 'Accordion': {
			const title = attr(node, 'title');
			return [...(title ? [strong(title)] : []), ...(await inner())];
		}
		case 'Card': {
			const title = attr(node, 'title') ?? '';
			const href = attr(node, 'href');
			const body = await inner();
			const label = href
				? {
						type: 'link',
						url: absoluteUrl(href, ctx.slug),
						children: [text(title)],
					}
				: { type: 'strong', children: [text(title)] };
			const first = body[0];
			const description =
				first?.type === 'paragraph' ? [text(': '), ...first.children] : [];
			return [
				{
					type: 'list',
					ordered: false,
					spread: false,
					children: [
						{
							type: 'listItem',
							spread: false,
							children: [
								{ type: 'paragraph', children: [label, ...description] },
							],
						},
					],
				},
				...(first?.type === 'paragraph' ? body.slice(1) : body),
			];
		}
		case 'ParamField':
		case 'ResponseField': {
			const field =
				attr(node, 'path') ??
				attr(node, 'body') ??
				attr(node, 'query') ??
				attr(node, 'header') ??
				attr(node, 'name') ??
				'';
			const type = attr(node, 'type');
			const required = attr(node, 'required') === 'true';
			const meta = [type && `\`${type}\``, required && 'required']
				.filter(Boolean)
				.join(', ');
			const body = await inner();
			const first = body[0];
			return [
				{
					type: 'paragraph',
					children: [
						{ type: 'inlineCode', value: field },
						...(meta ? [text(` (${meta})`)] : []),
						...(first?.type === 'paragraph'
							? [text(': '), ...first.children]
							: []),
					],
				},
				...(first?.type === 'paragraph' ? body.slice(1) : body),
			];
		}
		case 'Update': {
			const label = attr(node, 'label');
			const description = attr(node, 'description');
			return [
				...(label
					? [{ type: 'heading', depth: 2, children: [text(label)] }]
					: []),
				...(description
					? [
							{
								type: 'paragraph',
								children: [{ type: 'emphasis', children: [text(description)] }],
							},
						]
					: []),
				...(await inner()),
			];
		}
		default:
			// CardGroup, CodeGroup, Tabs, AccordionGroup, Frame and anything
			// unknown: keep what's inside.
			return inner();
	}
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;

async function pageMarkdown(slug) {
	const raw = await readText(path.join(DOCS_DIR, `${slug}.mdx`));
	const front = parseYaml(FRONTMATTER.exec(raw)?.[1] ?? '') ?? {};
	const tree = parser.parse(raw.replace(FRONTMATTER, ''));
	tree.children = await convert(tree.children, {
		slug,
		snippets: new Map(),
		step: 0,
	});
	const content = printer.stringify(tree).trim();
	return [
		`# ${front.title ?? slug}`,
		'',
		`Source: ${SITE_URL}/${slug}.md`,
		'',
		...(front.description ? [`> ${front.description}`, ''] : []),
		content,
		'',
	].join('\n');
}

// The changelog is left out too: the release bot rewrites it on every
// release, which would make every later docs PR fail the --check.
const isWritten = (slug) =>
	!slug.startsWith('plugins/') &&
	!slug.startsWith('snippets/') &&
	slug !== 'changelog';

/** docs.json order, then the written pages it doesn't list, sorted. */
async function pageOrder() {
	const docsJson = JSON.parse(
		await readFile(path.join(DOCS_DIR, 'docs.json'), 'utf8'),
	);
	const listed = [];
	const walk = (pages) => {
		for (const p of pages ?? []) {
			if (typeof p === 'string') listed.push(p);
			else walk(p.pages);
		}
	};
	for (const tab of docsJson.navigation.tabs) {
		for (const group of tab.groups ?? []) walk(group.pages);
		walk(tab.pages);
	}
	const inNav = [...new Set(listed)].filter(
		(slug) => isWritten(slug) && existsSync(path.join(DOCS_DIR, `${slug}.mdx`)),
	);
	const all = (await readdir(DOCS_DIR, { recursive: true }))
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => f.slice(0, -'.mdx'.length).split(path.sep).join('/'))
		.filter(isWritten);
	const seen = new Set(inNav);
	return [...inNav, ...all.filter((s) => !seen.has(s)).sort()];
}

async function generate() {
	const header = `# Corsair

> Every written page of ${SITE_URL}, as Markdown, in sidebar order. The ~2,500 per-plugin pages are left out: a plugin's pages are at ${SITE_URL}/plugins/<id>/overview.md, /api.md, /database.md, /webhooks.md and /get-credentials.md, and the plugin list is at ${SITE_URL}/guides/plugins.md. The changelog is at ${SITE_URL}/changelog.md. The index of every page is ${SITE_URL}/llms.txt.

Generated from docs/ by \`pnpm generate:llms-full\`; don't edit by hand.
`;
	const pages = [];
	for (const slug of await pageOrder()) pages.push(await pageMarkdown(slug));
	return `${[header, ...pages].join('\n---\n\n').trimEnd()}\n`;
}

const output = await generate();
if (process.argv.includes('--check')) {
	const current = existsSync(OUT) ? await readFile(OUT, 'utf8') : '';
	if (current !== output) {
		console.error(
			'docs/llms-full.txt is out of date with docs/. Run `pnpm generate:llms-full` and commit the result.',
		);
		process.exit(1);
	}
	console.log('docs/llms-full.txt is up to date.');
} else {
	await writeFile(OUT, output);
	console.log(
		`wrote docs/llms-full.txt (${(Buffer.byteLength(output) / 1024).toFixed(0)} KB)`,
	);
}

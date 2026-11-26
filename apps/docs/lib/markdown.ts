import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type {
	BlockContent,
	Heading,
	Link,
	Paragraph,
	Parent,
	PhrasingContent,
	Root,
	RootContent,
} from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { SITE_URL } from './site';

/**
 * The Markdown twin of a page (`/<page>.md`, llms-full.txt), the way the
 * Mintlify site served it: snippets inlined, components written out as plain
 * Markdown, internal links absolute and pointing at the .md pages. Agents
 * read these more than people read the HTML.
 */

const DOCS_DIR = path.resolve(process.cwd(), '../../docs');

const CALLOUTS: Record<string, string> = {
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

function attr(node: MdxJsxFlowElement, name: string): string | undefined {
	for (const a of node.attributes) {
		if (a.type !== 'mdxJsxAttribute' || a.name !== name) continue;
		if (typeof a.value === 'string') return a.value;
		if (a.value === null) return 'true';
		return a.value?.value;
	}
	return undefined;
}

function text(value: string): PhrasingContent {
	return { type: 'text', value };
}

function strong(value: string): Paragraph {
	return {
		type: 'paragraph',
		children: [{ type: 'strong', children: [text(value)] }],
	};
}

function absoluteUrl(url: string): string {
	if (!url.startsWith('/') || url.startsWith('//')) return url;
	const [pathPart, hash] = url.split('#');
	const withMd = /\.[a-z]+$/i.test(pathPart ?? '')
		? pathPart
		: `${pathPart}.md`;
	return `${SITE_URL}${withMd}${hash ? `#${hash}` : ''}`;
}

async function snippetChildren(source: string): Promise<RootContent[]> {
	const file = path.join(DOCS_DIR, source);
	const tree = parser.parse(await readFile(file, 'utf8')) as Root;
	return tree.children;
}

interface Ctx {
	/** local name → snippet path, for imports of /snippets/*.mdx */
	snippets: Map<string, string>;
	step: number;
}

async function convert(nodes: RootContent[], ctx: Ctx): Promise<RootContent[]> {
	const out: RootContent[] = [];
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
			if (/^[A-Za-z_$][\w$.]*$/.test(value))
				out.push(text(`{${value}}`) as RootContent);
			continue;
		}
		if (node.type === 'link') {
			(node as Link).url = absoluteUrl((node as Link).url);
		}
		// Fence metas stay as Mintlify writes them (```ts corsair.ts).
		if (node.type === 'code') {
			out.push(node);
			continue;
		}
		if (
			node.type === 'mdxJsxFlowElement' ||
			node.type === 'mdxJsxTextElement'
		) {
			out.push(...(await element(node as MdxJsxFlowElement, ctx)));
			continue;
		}
		if ('children' in node) {
			(node as Parent).children = (await convert(
				(node as Parent).children as RootContent[],
				ctx,
			)) as Parent['children'];
		}
		out.push(node);
	}
	return out;
}

async function element(
	node: MdxJsxFlowElement,
	ctx: Ctx,
): Promise<RootContent[]> {
	const name = node.name ?? '';
	const inner = () => convert(node.children as RootContent[], ctx);

	const snippet = ctx.snippets.get(name);
	if (snippet)
		return convert(await snippetChildren(snippet), {
			...ctx,
			snippets: new Map(),
		});

	const callout = CALLOUTS[name];
	if (callout) {
		const body = (await inner()) as BlockContent[];
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
					...body,
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
			const heading: Heading[] = title
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
			const label: PhrasingContent = href
				? { type: 'link', url: absoluteUrl(href), children: [text(title)] }
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
					? [{ type: 'heading', depth: 2, children: [text(label)] } as Heading]
					: []),
				...(description
					? [
							{
								type: 'paragraph',
								children: [{ type: 'emphasis', children: [text(description)] }],
							} as Paragraph,
						]
					: []),
				...(await inner()),
			];
		}
		// Interactive widgets have no Markdown form.
		case 'GenerateKEK':
		case 'WindowsMigrationNote':
		case 'WindowsEnvVarsNote':
			return [];
		default:
			// CardGroup, CodeGroup, Tabs, AccordionGroup, Frame and anything
			// unknown: keep what's inside.
			return inner();
	}
}

export interface MarkdownPage {
	title: string;
	description?: string;
	/** Absolute path of the .mdx file. */
	file: string;
}

const HEADER = `> ## Documentation Index
> Fetch the complete documentation index at: ${SITE_URL}/llms.txt
> Use this file to discover all available pages before exploring further.`;

export async function pageMarkdown(
	page: MarkdownPage,
	{ header = true } = {},
): Promise<string> {
	const raw = await readFile(page.file, 'utf8');
	const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
	const tree = parser.parse(body) as Root;
	tree.children = (await convert(tree.children, {
		snippets: new Map(),
		step: 0,
	})) as Root['children'];
	const content = printer.stringify(tree).trim();
	const lines = [
		...(header ? [HEADER, ''] : []),
		`# ${page.title}`,
		'',
		...(page.description ? [`> ${page.description}`, ''] : []),
		content,
		'',
	];
	return lines.join('\n');
}

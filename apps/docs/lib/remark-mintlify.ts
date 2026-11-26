import path from 'node:path';
import type {
	Code,
	Heading,
	Paragraph,
	Parent,
	Root,
	RootContent,
} from 'mdast';
import type {
	MdxJsxAttribute,
	MdxJsxFlowElement,
	MdxJsxTextElement,
} from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';

/**
 * Reads the Mintlify MDX in `docs/` as written, so the same files serve
 * Mintlify and this app until the cutover. Runs before Fumadocs' own remark
 * plugins (remarkCodeTab must see the `tab` metas this sets).
 *
 * - `/snippets/x.mdx` imports resolve to `docs/snippets/x.mdx`; the two
 *   snippets that hold React state point at client components instead.
 * - An imported snippet gets the page's MDX components, which Mintlify passes
 *   down implicitly and MDX does not.
 * - A bare fence meta (```ts corsair.ts) becomes `title="corsair.ts"`.
 * - Code blocks inside <CodeGroup> become one tab each (remarkCodeTab).
 * - ```mermaid fences become <Mermaid chart="..." />.
 * - A lone <Accordion> gets the <AccordionGroup> Fumadocs needs around it.
 * - <Update label> becomes a heading, so changelog entries land in the TOC.
 * - A bare `{name}` the file never defines (generated text like
 *   `POST /webhooks/{id}/test`) prints as written. Mintlify drops it silently;
 *   MDX would throw at render.
 */

export const DOCS_DIR = path.resolve(process.cwd(), '../../docs');
const APP_DIR = process.cwd();

const SNIPPET_COMPONENTS: Record<string, string> = {
	'/snippets/generate-kek.mdx': path.join(
		APP_DIR,
		'components/generate-kek.tsx',
	),
	'/snippets/windows-shell.mdx': path.join(
		APP_DIR,
		'components/windows-shell.tsx',
	),
};

const PACKAGE_MANAGERS = new Set(['npm', 'pnpm', 'yarn', 'bun']);

interface Context {
	fromDir: string;
	/** Names imported from MDX snippets in this file. */
	snippets: Set<string>;
	/** Names the file imports or exports, which `{name}` may refer to. */
	declared: Set<string>;
}

const IDENTIFIER = /^\s*([A-Za-z_$][\w$]*)(?:\.[A-Za-z_$][\w$]*)*\s*$/;

function collectDeclared(statement: EstreeNode, declared: Set<string>): void {
	if (statement.type === 'ImportDeclaration') {
		for (const spec of (statement.specifiers as {
			local: { name: string };
		}[]) ?? [])
			declared.add(spec.local.name);
		return;
	}
	if (
		statement.type !== 'ExportNamedDeclaration' &&
		statement.type !== 'ExportDefaultDeclaration'
	)
		return;
	const decl = statement.declaration as EstreeNode | null | undefined;
	if (!decl) return;
	if (decl.type === 'VariableDeclaration') {
		for (const d of decl.declarations as {
			id: { type: string; name?: string };
		}[])
			if (d.id.type === 'Identifier' && d.id.name) declared.add(d.id.name);
	} else if ((decl.id as { name?: string } | null)?.name) {
		declared.add((decl.id as { name: string }).name);
	}
}

type EstreeNode = { type: string; [key: string]: unknown };

function relativeTo(fromDir: string, target: string): string {
	// Relative to the importing file: Turbopack reads a leading "/" as the
	// project root, not the filesystem root.
	const rel = path.relative(fromDir, target).split(path.sep).join('/');
	return rel.startsWith('.') ? rel : `./${rel}`;
}

function rewriteEsm(node: MdxjsEsm, ctx: Context): void {
	const program = node.data?.estree as { body?: EstreeNode[] } | undefined;
	let value = node.value;
	for (const statement of program?.body ?? []) {
		collectDeclared(statement, ctx.declared);
		if (statement.type !== 'ImportDeclaration') continue;
		const source = statement.source as { value: string; raw?: string };
		const original = source.value;
		let target: string | undefined;
		if (SNIPPET_COMPONENTS[original]) {
			target = SNIPPET_COMPONENTS[original];
		} else if (original.startsWith('/snippets/')) {
			target = path.join(DOCS_DIR, original);
			for (const spec of (statement.specifiers as {
				local: { name: string };
			}[]) ?? [])
				ctx.snippets.add(spec.local.name);
		}
		if (!target) continue;
		const next = relativeTo(ctx.fromDir, target);
		value = value.split(original).join(next);
		source.value = next;
		source.raw = JSON.stringify(next);
	}
	node.value = value;
}

/** `components={props.components}`, with the estree MDX compiles from. */
function componentsAttribute(): MdxJsxAttribute {
	const expression = {
		type: 'MemberExpression',
		object: { type: 'Identifier', name: 'props' },
		property: { type: 'Identifier', name: 'components' },
		computed: false,
		optional: false,
	};
	return {
		type: 'mdxJsxAttribute',
		name: 'components',
		value: {
			type: 'mdxJsxAttributeValueExpression',
			value: 'props.components',
			data: {
				estree: {
					type: 'Program',
					sourceType: 'module',
					body: [{ type: 'ExpressionStatement', expression }],
				} as never,
			},
		},
	};
}

/** A Mintlify meta is a bare title (```ts corsair.ts); Fumadocs reads key="value". */
function bareTitle(meta: string | null | undefined): string | undefined {
	const trimmed = meta?.trim();
	if (!trimmed) return undefined;
	if (/[={}]/.test(trimmed)) return undefined;
	return trimmed;
}

function attr(name: string, value: string): MdxJsxAttribute {
	return { type: 'mdxJsxAttribute', name, value };
}

function readAttr(node: MdxJsxFlowElement, name: string): string | undefined {
	for (const a of node.attributes) {
		if (
			a.type === 'mdxJsxAttribute' &&
			a.name === name &&
			typeof a.value === 'string'
		)
			return a.value;
	}
	return undefined;
}

/** The flow element `node` is, when it has this name. */
function element(
	node: RootContent,
	name: string,
): MdxJsxFlowElement | undefined {
	return node.type === 'mdxJsxFlowElement' && node.name === name
		? node
		: undefined;
}

function isJsx(
	node: RootContent,
): node is MdxJsxFlowElement | MdxJsxTextElement {
	return node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';
}

function codeGroupTabs(group: MdxJsxFlowElement): void {
	const codes = group.children.filter((c): c is Code => c.type === 'code');
	const titles = codes.map(
		(code) => bareTitle(code.meta) ?? code.lang ?? 'Code',
	);
	const pm = titles.every((t) => PACKAGE_MANAGERS.has(t));
	codes.forEach((code, i) => {
		const tab = JSON.stringify(titles[i]);
		code.meta = pm ? `tab=${tab} tab-group="package-manager"` : `tab=${tab}`;
	});
}

function transformChildren(parent: Parent, ctx: Context): void {
	const out: RootContent[] = [];
	for (const child of parent.children as RootContent[]) {
		if (
			child.type === 'mdxTextExpression' ||
			child.type === 'mdxFlowExpression'
		) {
			const name = IDENTIFIER.exec(child.value)?.[1];
			if (name && name !== 'props' && !ctx.declared.has(name)) {
				const text = { type: 'text' as const, value: `{${child.value}}` };
				out.push(
					child.type === 'mdxTextExpression'
						? text
						: { type: 'paragraph', children: [text] },
				);
				continue;
			}
		}

		if (child.type === 'code') {
			if (child.lang === 'mermaid') {
				out.push({
					type: 'mdxJsxFlowElement',
					name: 'Mermaid',
					attributes: [attr('chart', child.value)],
					children: [],
				});
				continue;
			}
			const title = bareTitle(child.meta);
			if (title) child.meta = `title=${JSON.stringify(title)}`;
			out.push(child);
			continue;
		}

		if (isJsx(child) && child.name && ctx.snippets.has(child.name)) {
			const has = child.attributes.some(
				(a) => a.type === 'mdxJsxAttribute' && a.name === 'components',
			);
			if (!has) child.attributes.push(componentsAttribute());
		}

		const codeGroup = element(child, 'CodeGroup');
		if (codeGroup) {
			codeGroupTabs(codeGroup);
			transformChildren(codeGroup, ctx);
			out.push(codeGroup);
			continue;
		}

		const accordion = element(child, 'Accordion');
		if (accordion && !element(parent as RootContent, 'AccordionGroup')) {
			transformChildren(accordion, ctx);
			out.push({
				type: 'mdxJsxFlowElement',
				name: 'AccordionGroup',
				attributes: [],
				children: [accordion],
			});
			continue;
		}

		const update = element(child, 'Update');
		if (update) {
			const label = readAttr(update, 'label');
			const description = readAttr(update, 'description');
			if (label) {
				const heading: Heading = {
					type: 'heading',
					depth: 2,
					children: [{ type: 'text', value: label }],
				};
				out.push(heading);
			}
			if (description) {
				const p: Paragraph = {
					type: 'paragraph',
					children: [
						{
							type: 'emphasis',
							children: [{ type: 'text', value: description }],
						},
					],
				};
				out.push(p);
			}
			transformChildren(update, ctx);
			out.push(...(update.children as RootContent[]));
			continue;
		}

		if ('children' in child) transformChildren(child as Parent, ctx);
		out.push(child);
	}
	parent.children = out as Parent['children'];
}

export function remarkMintlify() {
	return (tree: Root, file: { path?: string }) => {
		const ctx: Context = {
			fromDir: file.path ? path.dirname(file.path) : DOCS_DIR,
			snippets: new Set(),
			declared: new Set(),
		};
		// Imports first, so every use of a snippet below is known.
		for (const node of tree.children as RootContent[])
			if (node.type === 'mdxjsEsm') rewriteEsm(node, ctx);
		transformChildren(tree, ctx);
	};
}

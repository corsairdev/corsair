/**
 * Writes plugin reference MDX under `docs/plugins/<pluginId>/` using
 * `introspectPluginForDocs` from `packages/corsair`. Uses `tsx` to resolve TS imports.
 *
 * Optional `packages/<plugin>/plugin-docs.yaml` can set `displayName`, `description`
 * (frontmatter), and `overviewNote` (markdown after the intro paragraph).
 *
 * CLI: `pnpm generate:docs -- --plugin=<id>` · `pnpm generate:docs -- --all` · `pnpm generate:docs:all`
 * (`--all` scans `packages/*` for `@corsair-dev/*` plugins with `index.ts`, excludes corsair/cli/mcp/ui.)
 */
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';
import type {
	DocSchemaShape,
	DocsApiEndpoint,
	DocsWebhook,
	PluginDocsIntrospection,
} from '../packages/corsair/core/inspect/index.ts';
import { introspectPluginForDocs } from '../packages/corsair/core/inspect/index.ts';
import type { CorsairPlugin } from '../packages/corsair/core/plugins/index.ts';

/** Optional per-plugin overrides for the doc generator (next to package.json). */
const PLUGIN_DOCS_FILE = 'plugin-docs.yaml';

type PluginDocsFile = {
	displayName?: string;
	/** Overrides Mintlify frontmatter `description` when set. */
	description?: string;
	/** Markdown inserted after the intro paragraph on the overview page. */
	overviewNote?: string;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

function docsRoot(repoRoot: string): string {
	return join(repoRoot, 'docs/plugins');
}

/** Workspace folders that are not Corsair integration plugins. */
const PLUGIN_DISCOVERY_SKIP_DIRS = new Set(['corsair', 'cli', 'mcp', 'ui']);

function parseArgs(argv: string[]): {
	pluginHint?: string;
	entry?: string;
	exportName?: string;
	title?: string;
	skipMain: boolean;
	all: boolean;
} {
	let pluginHint: string | undefined;
	let entry: string | undefined;
	let exportName: string | undefined;
	let title: string | undefined;
	let skipMain = false;
	let all = false;

	for (const a of argv) {
		if (a === '--') continue;
		if (a === '--all') {
			all = true;
			continue;
		}
		if (a === '--skip-main') {
			skipMain = true;
			continue;
		}
		if (a.startsWith('--plugin=')) {
			pluginHint = a.slice('--plugin='.length);
			continue;
		}
		if (a.startsWith('--entry=')) {
			entry = a.slice('--entry='.length);
			continue;
		}
		if (a.startsWith('--export=')) {
			exportName = a.slice('--export='.length);
			continue;
		}
		if (a.startsWith('--title=')) {
			title = a.slice('--title='.length);
			continue;
		}
		if (!a.startsWith('-') && a.length > 0) {
			pluginHint ??= a;
		}
	}
	return { pluginHint, entry, exportName, title, skipMain, all };
}

/**
 * `packages/<name>/` dirs that look like `@corsair-dev/*` plugins (entry `index.ts`).
 * Excludes core tooling packages (cli, mcp, ui, corsair).
 */
function discoverPluginPackageDirs(root: string): string[] {
	const packagesDir = join(root, 'packages');
	if (!existsSync(packagesDir)) {
		return [];
	}
	const names = readdirSync(packagesDir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.filter((name) => !PLUGIN_DISCOVERY_SKIP_DIRS.has(name));

	const out: string[] = [];
	for (const name of names) {
		const pkgPath = join(packagesDir, name, 'package.json');
		const idxPath = join(packagesDir, name, 'index.ts');
		if (!existsSync(pkgPath) || !existsSync(idxPath)) {
			continue;
		}
		try {
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
				name?: string;
			};
			const n = pkg.name;
			if (!n?.startsWith('@corsair-dev/')) {
				continue;
			}
			if (
				n === '@corsair-dev/cli' ||
				n === '@corsair-dev/mcp' ||
				n === '@corsair-dev/ui'
			) {
				continue;
			}
			out.push(name);
		} catch {
			continue;
		}
	}
	return out.sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' }),
	);
}

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

function defaultEntry(repo: string, pluginHint: string): string {
	return join(repo, 'packages', pluginHint, 'index.ts');
}

function inferExportName(
	entryPath: string,
	exportOverride: string | undefined,
): string {
	if (exportOverride) return exportOverride;
	return basename(dirname(entryPath));
}

function titleFromPackageDir(packageDir: string): string | undefined {
	const pkgPath = join(packageDir, 'package.json');
	if (!existsSync(pkgPath)) return undefined;
	try {
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
			description?: string;
		};
		const d = pkg.description?.trim();
		if (!d) return undefined;
		const lower = d.toLowerCase();
		const idx = lower.indexOf(' plugin');
		let raw = idx !== -1 ? d.slice(0, idx).trim() : d;
		// "outlook plugin" → title was literally "outlook"
		if (/^[a-z][a-z0-9]*$/.test(raw)) {
			raw = raw.charAt(0).toUpperCase() + raw.slice(1);
		}
		return raw;
	} catch {
		return undefined;
	}
}

function readPluginDocsConfig(packageDir: string): PluginDocsFile {
	const p = join(packageDir, PLUGIN_DOCS_FILE);
	if (!existsSync(p)) return {};
	try {
		const doc = parseYaml(readFileSync(p, 'utf8')) as unknown;
		if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
			return doc as PluginDocsFile;
		}
	} catch {
		// ignore invalid yaml
	}
	return {};
}

/** When package.json / yaml do not set a title, split camelCase-ish ids for display. */
function humanizePluginId(pluginId: string): string {
	const spaced = pluginId
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([0-9])([A-Za-z])/g, '$1 $2')
		.replace(/([A-Za-z])([0-9])/g, '$1 $2')
		.replace(/[_-]+/g, ' ');
	return spaced
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
		.join(' ');
}

const KNOWN_AUTH_TYPES = ['oauth_2', 'api_key', 'bot_token'] as const;

function readPackageMeta(packageDir: string): {
	npmName: string;
	description?: string;
} {
	const pkgPath = join(packageDir, 'package.json');
	if (!existsSync(pkgPath)) {
		return { npmName: `@corsair-dev/${basename(packageDir)}` };
	}
	try {
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
			name?: string;
			description?: string;
		};
		return {
			npmName: pkg.name ?? `@corsair-dev/${basename(packageDir)}`,
			description: pkg.description?.trim(),
		};
	} catch {
		return { npmName: `@corsair-dev/${basename(packageDir)}` };
	}
}

/**
 * Reads `PickAuth<'a' | 'b'>` (and similar) from the plugin entry source — same types authors use in `*PluginOptions`.
 */
function inferAuthTypesFromPluginSource(source: string): string[] {
	const re = /PickAuth<\s*([^>]+)\s*>/g;
	let best: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(source)) !== null) {
		const inner = m[1]!.replace(/\s+/g, ' ').trim();
		const types = inner
			.split('|')
			.map((s) => s.trim().replace(/['"]/g, ''))
			.filter((s): s is (typeof KNOWN_AUTH_TYPES)[number] =>
				(KNOWN_AUTH_TYPES as readonly string[]).includes(s),
			);
		if (types.length > best.length) {
			best = types;
		}
	}
	return best;
}

function inferDefaultAuthTypeFromSource(source: string): string | undefined {
	// Matches `const defaultAuthType = 'oauth_2'`, `const defaultAuthType: AuthTypes = 'oauth_2'`,
	// and `const defaultAuthType: AuthTypes = 'api_key' as const` (optional `as const`).
	const match = source.match(
		/const\s+defaultAuthType\b\s*[^=]*=\s*['"](oauth_2|api_key|bot_token)['"]\s*(?:as\s+const)?/,
	);
	return match?.[1];
}

function authTypeHumanLabel(authType: string): string {
	switch (authType) {
		case 'oauth_2':
			return 'OAuth 2.0';
		case 'api_key':
			return 'API Key';
		case 'bot_token':
			return 'Bot Token';
		default:
			return authType;
	}
}

function authConceptPath(authType: string): string {
	if (authType === 'oauth_2') return '/concepts/oauth';
	return '/concepts/api-key';
}

/** Mintlify/YAML frontmatter: plain `description: foo: bar` breaks on the second `:`. Use a double-quoted scalar. */
function yamlDoubleQuotedScalar(s: string): string {
	const oneLine = s.replace(/\r\n|\r|\n/g, ' ');
	return (
		'"' +
		oneLine.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\t/g, ' ') +
		'"'
	);
}

function sortAuthTypesForTabs(
	types: string[],
	defaultType: string | undefined,
): string[] {
	const rest = [...types].sort((a, b) => a.localeCompare(b));
	if (!defaultType || !rest.includes(defaultType)) {
		return rest;
	}
	return [defaultType, ...rest.filter((t) => t !== defaultType)];
}

/**
 * Scaffold plugins ship a single nested `example` / `example.example` webhook. Skip emitting
 * a Webhooks doc page and overview/nav hooks for that placeholder-only case.
 */
function isPlaceholderExampleWebhookOnly(
	webhooks: readonly DocsWebhook[],
	pluginId: string,
): boolean {
	if (webhooks.length !== 1) return false;
	const fullPath = webhooks[0]!.path;
	const needle = `${pluginId}.webhooks.`;
	if (!fullPath.startsWith(needle)) return false;
	const short = fullPath.slice(needle.length);
	return short === 'example' || short === 'example.example';
}

function pluginDocData(
	data: PluginDocsIntrospection,
	pluginId: string,
): PluginDocsIntrospection {
	if (!isPlaceholderExampleWebhookOnly(data.webhooks, pluginId)) {
		return data;
	}
	return { ...data, webhooks: [] };
}

function pickExampleEndpoints(api: DocsApiEndpoint[]): {
	read?: DocsApiEndpoint;
	write?: DocsApiEndpoint;
} {
	const read =
		api.find((e) => e.riskLevel === 'read') ??
		api.find((e) => /^(list|get|search)/i.test(e.shortPath));
	const write =
		api.find((e) => e.riskLevel === 'write' || e.riskLevel === 'destructive') ??
		api.find((e) => /^(create|post|update|delete|send)/i.test(e.shortPath));
	return { read, write };
}

function buildMainMdx(opts: {
	pluginId: string;
	title: string;
	exportKey: string;
	npmPackageName: string;
	frontmatterDescription: string;
	data: PluginDocsIntrospection;
	authTypes: string[];
	defaultAuthType: string | undefined;
	overviewNote?: string;
}): string {
	const {
		pluginId,
		title,
		exportKey,
		npmPackageName,
		frontmatterDescription,
		data,
		authTypes,
		defaultAuthType,
		overviewNote,
	} = opts;

	const base = `/plugins/${pluginId}`;
	const { read: exRead, write: exWrite } = pickExampleEndpoints(data.api);

	const bullets: string[] = [];
	if (data.api.length > 0) {
		bullets.push(`${data.api.length} typed API operations`);
	}
	if (data.db.length > 0) {
		bullets.push(
			`${data.db.length} database entit${data.db.length === 1 ? 'y' : 'ies'} synced for fast \`.search()\` / \`.list()\` queries`,
		);
	}
	if (data.webhooks.length > 0) {
		bullets.push(`${data.webhooks.length} incoming webhook event types`);
	}
	if (bullets.length === 0) {
		bullets.push('Typed integration through the Corsair client');
	}

	const authOrdered = sortAuthTypesForTabs(authTypes, defaultAuthType);

	const authSection =
		authOrdered.length === 0
			? `## Authentication

See [Get Credentials](${base}/get-credentials) for how to obtain and store secrets. Auth methods depend on how you configure \`${exportKey}({ ... })\` — check the plugin source \`*PluginOptions\` type for supported \`authType\` values.

- [API key authentication](/concepts/api-key)
- [OAuth 2.0](/concepts/oauth)
`
			: `## Authentication

Each tab shows how to register the plugin for that authentication method. The default \`authType\` from the plugin does not need to appear in the factory call.

<Tabs>
${authOrdered
	.map((t) => {
		const isDefaultTab =
			defaultAuthType !== undefined
				? t === defaultAuthType
				: authOrdered.length === 1;
		const label = `${authTypeHumanLabel(t)}${isDefaultTab ? ' (Default)' : ''}`;
		const callSnippet = isDefaultTab
			? `${exportKey}()`
			: `${exportKey}({\n    authType: '${t}',\n})`;
		return `<Tab title="${escapeAttr(label)}">

\`\`\`ts corsair.ts
${callSnippet}
\`\`\`

Store credentials with \`pnpm corsair setup --plugin=${pluginId}\` (see [Get Credentials](${base}/get-credentials) for field names). For OAuth, you typically store integration keys at the provider level and tokens per account or tenant.

More: [${authTypeHumanLabel(t)}](${authConceptPath(t)})

</Tab>`;
	})
	.join('\n')}
</Tabs>
`;

	const webhooksSection =
		data.webhooks.length === 0
			? ''
			: `## Webhooks

This plugin registers **${data.webhooks.length}** webhook handler(s). Configure your provider to POST events to your Corsair HTTP endpoint, then use \`webhookHooks\` in the plugin factory for custom logic.

See [Webhooks](${base}/webhooks) for every event path and payload shape, and [Webhooks concept](/concepts/webhooks) for how to set up routing.

`;

	const dbSection =
		data.db.length === 0
			? ''
			: `## Query synced data

Synced entities support \`corsair.${pluginId}.db.<entity>.search()\` and \`.list()\`. See [Database](${base}/database) for filters and operators.

`;

	const exampleRead = exRead
		? `\`\`\`ts
await corsair.${pluginId}.api.${exRead.shortPath}({});
\`\`\`
`
		: '_No read-style endpoint inferred; pick any operation from the reference below._\n';

	const exampleWrite = exWrite
		? `\`\`\`ts
await corsair.${pluginId}.api.${exWrite.shortPath}({});
\`\`\`
`
		: '_No write-style endpoint inferred; pick any operation from the reference below._\n';

	return `---
title: Overview
description: ${yamlDoubleQuotedScalar(frontmatterDescription)}
---

Use **${title}** through Corsair: one client, typed API calls, optional local DB sync${
		data.webhooks.length > 0 ? ', and incoming webhooks documented below.' : '.'
	}
${overviewNote ? `\n${overviewNote}\n` : ''}
**What you get:**

${bullets.map((b) => `- ${b}`).join('\n')}

## Setup

<Steps>

<Step title="Install">
\`\`\`bash
pnpm install ${npmPackageName}
\`\`\`

</Step>

<Step title="Add the plugin">
<Tabs>
<Tab title="Solo">
\`\`\`ts corsair.ts
import { createCorsair } from 'corsair';
import { ${exportKey} } from '${npmPackageName}';

export const corsair = createCorsair({
	// ... other config options,
	multiTenancy: false,
    plugins: [${exportKey}()],
});
\`\`\`
</Tab>
<Tab title="Multi-Tenant">
\`\`\`ts corsair.ts
import { createCorsair } from 'corsair';
import { ${exportKey} } from '${npmPackageName}';

export const corsair = createCorsair({
	// ... other config options,
    multiTenancy: true,
    plugins: [${exportKey}()],
});
\`\`\`

See [Multi-tenancy](/concepts/multi-tenancy) for account isolation.

</Tab>
</Tabs>

</Step>

<Step title="Get credentials">
Follow [Get Credentials](${base}/get-credentials) if you need help getting keys.

</Step>

<Step title="Store credentials">
<Tabs>
<Tab title="Solo">
\`\`\`bash
pnpm corsair setup --plugin=${pluginId}
\`\`\`

Use the key names documented in [Get Credentials](${base}/get-credentials) (for example \`api_key=\`, \`bot_token=\`, or OAuth client fields).
</Tab>
<Tab title="Multi-Tenant">
\`\`\`bash
pnpm corsair setup --plugin=${pluginId} --tenant=<tenantId>
\`\`\`

Store per-tenant secrets after you create the tenant record. See [Multi-tenancy](/concepts/multi-tenancy).
</Tab>
</Tabs>

</Step>

</Steps>

${authSection}
${webhooksSection}
${dbSection}
## Example API calls

**Read-style (${exRead?.riskLevel ?? 'read'}):** \`${exRead?.shortPath ?? '—'}\`

${exampleRead}

**Write-style (${exWrite?.riskLevel ?? 'write'}):** \`${exWrite?.shortPath ?? '—'}\`

${exampleWrite}

See the full list on the [API](${base}/api) page. Use \`pnpm corsair list --plugin=${pluginId}\` and \`pnpm corsair schema <path>\` locally to inspect schemas.

---

## Hooks

Use \`hooks\` on API calls and \`webhookHooks\` on incoming events to add logging, approvals, or side effects. ${
		data.webhooks.length > 0
			? `See [Hooks](/concepts/hooks) and the [Webhooks](${base}/webhooks) page for payload types.`
			: 'See [Hooks](/concepts/hooks) and [Webhooks](/concepts/webhooks) for routing and payload patterns.'
	}

---

## Reference

| Topic | Link |
|-------|------|
| API | [API](${base}/api) |
${data.db.length > 0 ? `| Database | [Database](${base}/database) |\n` : ''}${data.webhooks.length > 0 ? `| Webhooks | [Webhooks](${base}/webhooks) |\n` : ''}| Credentials | [Get credentials](${base}/get-credentials) |

`;
}

function escapeCell(s: string | undefined): string {
	if (!s) return '';
	return s
		.replace(/\\/g, '\\\\')
		.replace(/\|/g, '\\|')
		.replace(/\r?\n/g, '<br />');
}

/** Inline Zod→TS strings use `{ ... }` for objects; used to simplify table cells. */
function isObjectLikeType(type: string): boolean {
	return type.includes('{');
}

/** Table "Type" column: primitives stay literal; object shapes become `object` / `object[]`. */
function tableTypeDisplay(type: string): string {
	const t = type.trim();
	if (!isObjectLikeType(t)) return type;
	if (/\[\]\s*$/.test(t)) return 'object[]';
	return 'object';
}

function escapeAttr(s: string): string {
	return s.replace(/"/g, '&quot;');
}

function prettifyTypeBlock(type: string): string {
	const unit = '  ';
	let out = '';
	let depth = 0;
	let i = 0;
	const n = type.length;

	const appendIndent = () => {
		out += unit.repeat(depth);
	};

	while (i < n) {
		const ch = type[i]!;

		// Array suffix `[]` (e.g. `{ a: string }[]`) — keep on one line, not `}[\n]`
		if (ch === '[' && type[i + 1] === ']') {
			out += '[]';
			i += 2;
			while (i < n && /\s/.test(type[i]!)) i += 1;
			continue;
		}

		if (ch === '{' || ch === '[' || ch === '(') {
			out += ch;
			depth += 1;
			out += '\n';
			appendIndent();
			i += 1;
			while (i < n && /\s/.test(type[i]!)) i += 1;
			continue;
		}

		if (ch === '}' || ch === ']' || ch === ')') {
			depth = Math.max(0, depth - 1);
			out = out.replace(/[ \t]+$/g, '');
			if (!out.endsWith('\n')) out += '\n';
			appendIndent();
			out += ch;
			i += 1;
			while (i < n && /\s/.test(type[i]!)) i += 1;
			continue;
		}

		if (ch === ',') {
			out += ',';
			out += '\n';
			appendIndent();
			i += 1;
			while (i < n && /\s/.test(type[i]!)) i += 1;
			continue;
		}

		if (ch === '|') {
			out = out.replace(/[ \t]+$/g, '');
			out += ' | ';
			i += 1;
			while (i < n && /\s/.test(type[i]!)) i += 1;
			continue;
		}

		if (/\s/.test(ch)) {
			if (!out.endsWith(' ') && !out.endsWith('\n')) out += ' ';
			i += 1;
			continue;
		}

		out += ch;
		i += 1;
	}

	return out.trim();
}

function renderTypeAccordionItem(label: string, fullType: string): string {
	return `<Accordion title="${escapeAttr(`${label} full type`)}">

\`\`\`ts
${prettifyTypeBlock(fullType)}
\`\`\`
</Accordion>`;
}

function titleCaseSegment(s: string): string {
	if (s.length === 0) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function resourceTitle(resource: string): string {
	return resource
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.split(/[\s._]+/)
		.filter(Boolean)
		.map(titleCaseSegment)
		.join(' ');
}

function formatSchemaShape(
	shape: DocSchemaShape,
	kind: 'Input' | 'Output' | 'Payload',
): string {
	if (shape.kind === 'inline') {
		if (!isObjectLikeType(shape.type)) {
			return `**${kind}:** \`${escapeCell(shape.type)}\`\n\n`;
		}
		const display = tableTypeDisplay(shape.type);
		return `**${kind}:** \`${escapeCell(display)}\`

<AccordionGroup>
${renderTypeAccordionItem(kind, shape.type)}
</AccordionGroup>

`;
	}
	if (shape.fields.length === 0) {
		return `**${kind}:** _empty object_\n\n`;
	}
	const detailBlocks: string[] = [];
	const rows = shape.fields
		.map((f) => {
			if (isObjectLikeType(f.type)) {
				detailBlocks.push(renderTypeAccordionItem(f.key, f.type));
			}
			const cellType = tableTypeDisplay(f.type);
			return `| \`${escapeCell(f.key)}\` | \`${escapeCell(cellType)}\` | ${f.optional ? 'No' : 'Yes'} | ${escapeCell(f.description) || '—'} |`;
		})
		.join('\n');
	const detailsSection =
		detailBlocks.length > 0
			? `<AccordionGroup>
${detailBlocks.join('\n\n')}
</AccordionGroup>

`
			: '';
	return `**${kind}**

| Name | Type | Required | Description |
|------|------|----------|-------------|
${rows}

${detailsSection}
`;
}

function groupKey(shortPath: string): string {
	const i = shortPath.indexOf('.');
	return i === -1 ? shortPath : shortPath.slice(0, i);
}

function methodKey(shortPath: string): string {
	const i = shortPath.indexOf('.');
	return i === -1 ? shortPath : shortPath.slice(i + 1);
}

function buildApiMdx(
	pluginId: string,
	title: string,
	data: PluginDocsIntrospection,
): string {
	const byGroup = new Map<string, typeof data.api>();
	for (const ep of data.api) {
		const g = groupKey(ep.shortPath);
		if (!byGroup.has(g)) byGroup.set(g, []);
		byGroup.get(g)!.push(ep);
	}
	const groupNames = [...byGroup.keys()].sort((a, b) => a.localeCompare(b));

	const sections: string[] = [];
	for (const g of groupNames) {
		const endpoints = byGroup.get(g)!;
		endpoints.sort((a, b) => a.shortPath.localeCompare(b.shortPath));
		sections.push(`## ${resourceTitle(g)}`);
		sections.push('');
		for (const ep of endpoints) {
			const method = methodKey(ep.shortPath);
			const risk =
				ep.riskLevel !== undefined
					? `\n\n**Risk:** \`${ep.riskLevel}\`${ep.irreversible ? ' · **Irreversible**' : ''}`
					: '';
			const desc = ep.description ? `\n\n${ep.description}` : '';
			sections.push(`### ${method}`);
			sections.push('');
			sections.push(`\`${ep.shortPath}\`${desc}${risk}`);
			sections.push('');
			const [, ...pathParts] = ep.path.split('.');
			const callExpr = `corsair.${pluginId}.${pathParts.join('.')}`;
			sections.push('```ts');
			sections.push(`await ${callExpr}({});`);
			sections.push('```');
			sections.push('');
			sections.push(formatSchemaShape(ep.input, 'Input'));
			sections.push(formatSchemaShape(ep.output, 'Output'));
			sections.push('---');
			sections.push('');
		}
	}

	const apiDescription = `API reference for ${title}: every \`${pluginId}.api.*\` operation with input and output types.`;
	return `---
title: API
description: ${yamlDoubleQuotedScalar(apiDescription)}
---

Every \`${pluginId}.api.*\` operation is listed below with parameter shapes and return types from the plugin Zod schemas.

<Info>
**New to Corsair?** See [API access](/concepts/api), [authentication](/concepts/auth), and [error handling](/concepts/error-handling).
</Info>

${sections.join('\n')}
`;
}

function buildDbMdx(
	pluginId: string,
	title: string,
	data: PluginDocsIntrospection,
): string {
	const blocks: string[] = [];
	for (const ent of data.db) {
		const filterRows = ent.filters
			.map(
				(f) =>
					`| \`${escapeCell(f.field)}\` | \`${f.type}\` | ${escapeCell(f.operators.join(', '))} |`,
			)
			.join('\n');
		blocks.push(`## ${resourceTitle(ent.entityName)}`);
		blocks.push('');
		blocks.push(`Path: \`${ent.path}\``);
		blocks.push('');
		blocks.push(
			'```ts',
			`const rows = await corsair.${pluginId}.db.${ent.entityName}.search({`,
			`    data: { /* filters below */ },`,
			`    limit: 100,`,
			`    offset: 0,`,
			`});`,
			'```',
			'',
		);
		blocks.push('### Searchable filters');
		blocks.push('');
		blocks.push(
			'| Field | Type | Operators |',
			'|-------|------|-----------|',
			filterRows,
			'',
		);
		blocks.push(
			'_Every `.search()` also accepts `limit` and `offset` for pagination. `.list()` is available on the same path without the `.search` suffix in code — see [database operations](/concepts/database)._',
			'',
			'---',
			'',
		);
	}

	const dbDescription = `${title} local sync: searchable entities, \`.search()\` filters, and operators.`;
	return `---
title: Database
description: ${yamlDoubleQuotedScalar(dbDescription)}
---

The ${title} plugin syncs data locally. Use \`corsair.${pluginId}.db.<entity>.search({ data, limit?, offset? })\` with the filters listed per entity.

<Info>
**New to Corsair?** See [database operations](/concepts/database), [data synchronization](/concepts/integrations), and [multi-tenancy](/concepts/multi-tenancy).
</Info>

${blocks.join('\n')}
`;
}

function buildWebhooksMdx(
	pluginId: string,
	title: string,
	data: PluginDocsIntrospection,
): string {
	const entries = data.webhooks
		.map((wh) => {
			const shortPath = wh.path.replace(`${pluginId}.webhooks.`, '');
			const segments = shortPath.split('.').filter(Boolean);
			return { wh, shortPath, segments };
		})
		.sort((a, b) => a.shortPath.localeCompare(b.shortPath));

	const byGroup = new Map<string, typeof entries>();
	for (const entry of entries) {
		const group = entry.segments[0] ?? entry.shortPath;
		if (!byGroup.has(group)) byGroup.set(group, []);
		byGroup.get(group)!.push(entry);
	}

	type WebhookTreeNode = {
		children: Map<string, WebhookTreeNode>;
		shortPath?: string;
	};

	const treeRoot: WebhookTreeNode = { children: new Map() };
	for (const entry of entries) {
		let node = treeRoot;
		for (const segment of entry.segments) {
			if (!node.children.has(segment)) {
				node.children.set(segment, { children: new Map() });
			}
			node = node.children.get(segment)!;
		}
		node.shortPath = entry.shortPath;
	}

	const overviewLines: string[] = [];
	const renderTree = (node: WebhookTreeNode, depth: number): void => {
		const keys = [...node.children.keys()].sort((a, b) => a.localeCompare(b));
		for (const key of keys) {
			const child = node.children.get(key)!;
			const indent = '  '.repeat(depth);
			if (child.shortPath) {
				overviewLines.push(`${indent}- \`${key}\` (\`${child.shortPath}\`)`);
			} else {
				overviewLines.push(`${indent}- \`${key}\``);
			}
			renderTree(child, depth + 1);
		}
	};
	renderTree(treeRoot, 0);

	const blocks: string[] = [];
	for (const group of [...byGroup.keys()].sort((a, b) => a.localeCompare(b))) {
		const groupEntries = byGroup.get(group)!;
		blocks.push(`## ${resourceTitle(group)}`);
		blocks.push('');
		for (const entry of groupEntries) {
			const endpointLabel =
				entry.segments.length > 1
					? entry.segments.slice(1).map(resourceTitle).join(' · ')
					: resourceTitle(entry.shortPath);
			blocks.push(`### ${endpointLabel}`);
			blocks.push('');
			blocks.push(`\`${entry.shortPath}\``);
			blocks.push('');
			if (entry.wh.description) blocks.push(entry.wh.description, '');
			blocks.push(formatSchemaShape(entry.wh.payload, 'Payload'));
			if (entry.wh.responseType) {
				const rt = entry.wh.responseType;
				if (isObjectLikeType(rt)) {
					blocks.push('<AccordionGroup>');
					blocks.push(renderTypeAccordionItem('Response data', rt));
					blocks.push('</AccordionGroup>');
					blocks.push('');
				} else {
					blocks.push(`**Response \`data\`:** \`${escapeCell(rt)}\`\n\n`);
				}
			}
			blocks.push('**`webhookHooks` example**');
			blocks.push('');
			blocks.push('```ts');
			blocks.push(entry.wh.usageExample);
			blocks.push('```');
			blocks.push('');
			blocks.push('---');
			blocks.push('');
		}
	}

	const whDescription = `${title} incoming webhooks: event paths, payloads, and response data.`;
	return `---
title: Webhooks
description: ${yamlDoubleQuotedScalar(whDescription)}
---

The ${title} plugin handles incoming webhooks. Point your provider’s subscription URL at your Corsair HTTP handler (see [Overview](/plugins/${pluginId}/overview) for setup context and the exact URL shape).

<Info>
**New to Corsair?** See [webhooks](/concepts/webhooks) and [hooks](/concepts/hooks).
</Info>

## Webhook map

${overviewLines.join('\n')}

## HTTP handler setup

\`\`\`ts app/api/webhook/route.ts
import { processWebhook } from "corsair";
import { corsair } from "@/server/corsair";

export async function POST(request: Request) {
    const headers = Object.fromEntries(request.headers);
    const body = await request.json();
    const result = await processWebhook(corsair, headers, body);
    return result.response;
}
\`\`\`

## Events

${blocks.join('\n')}
`;
}

function pluginMdxExists(pluginDir: string, basename: string): boolean {
	return existsSync(join(pluginDir, `${basename}.mdx`));
}

/**
 * Ordered list of MDX basenames for docs.json / Mintlify sidebar (matches on-disk names,
 * including legacy `main` / `api-endpoints` until regenerated).
 */
function orderedPluginPageBasenames(pluginDir: string): string[] {
	const out: string[] = [];
	const push = (b: string) => {
		if (pluginMdxExists(pluginDir, b) && !out.includes(b)) out.push(b);
	};

	if (pluginMdxExists(pluginDir, 'overview')) push('overview');
	else if (pluginMdxExists(pluginDir, 'main')) push('main');

	push('get-credentials');

	if (pluginMdxExists(pluginDir, 'api')) push('api');
	else if (pluginMdxExists(pluginDir, 'api-endpoints')) push('api-endpoints');

	push('database');
	push('webhooks');

	const known = new Set([
		'overview',
		'main',
		'get-credentials',
		'api',
		'api-endpoints',
		'database',
		'webhooks',
	]);
	const rest = readdirSync(pluginDir)
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => f.replace(/\.mdx$/i, ''))
		.filter((b) => !known.has(b) && !out.includes(b))
		.sort((a, b) => a.localeCompare(b));
	out.push(...rest);
	return out;
}

type DocsNavEntry = string | { group: string; pages: string[] };

/** Sort key for plugin subgroups under navigation → Plugins → Plugins (display name). */
function pluginNavGroupSortKey(entry: DocsNavEntry): string {
	if (typeof entry === 'string') {
		const m = /^plugins\/([^/]+)\//.exec(entry);
		if (m) return titleCaseSegment(m[1]);
		return entry;
	}
	if (entry && typeof entry === 'object' && 'group' in entry) {
		return (entry as { group: string }).group;
	}
	return '';
}

function pluginNavEntryMatches(entry: unknown, pluginId: string): boolean {
	const prefix = `plugins/${pluginId}/`;
	if (typeof entry === 'string') {
		return entry.startsWith(prefix);
	}
	if (entry && typeof entry === 'object' && 'pages' in entry) {
		const pages = (entry as { pages: string[] }).pages;
		return Array.isArray(pages) && pages.some((p) => p.startsWith(prefix));
	}
	return false;
}

/**
 * Lists `plugins/<pluginId>/*.mdx` and updates `docs/docs.json` so the Mintlify sidebar
 * includes every page in Overview → Get credentials (if present) → API → Database → Webhooks → …
 * order, nested under the plugin display name. Re-sorts plugin groups alphabetically by display name.
 */
function syncPluginDocsJson(
	repoRoot: string,
	pluginId: string,
	displayGroupTitle: string,
): void {
	const pluginDir = join(repoRoot, 'docs/plugins', pluginId);
	if (!existsSync(pluginDir)) {
		return;
	}

	const ordered = orderedPluginPageBasenames(pluginDir);
	if (ordered.length === 0) {
		return;
	}

	const pagePaths = ordered.map((b) => `plugins/${pluginId}/${b}`);

	const docsJsonPath = join(repoRoot, 'docs/docs.json');
	if (!existsSync(docsJsonPath)) {
		console.warn(
			`docs.json not found at ${docsJsonPath}; skipping navigation update.`,
		);
		return;
	}

	const raw = readFileSync(docsJsonPath, 'utf8');
	const doc = JSON.parse(raw) as {
		navigation: {
			tabs: {
				tab: string;
				groups: { group: string; pages: DocsNavEntry[] }[];
			}[];
		};
	};

	const pluginsTab = doc.navigation.tabs.find((t) => t.tab === 'Plugins');
	const pluginsGroup = pluginsTab?.groups.find((g) => g.group === 'Plugins');
	if (!pluginsGroup?.pages) {
		console.warn(
			'Could not find navigation.tabs → Plugins → group "Plugins"; skipping docs.json.',
		);
		return;
	}

	const { pages } = pluginsGroup;
	const newEntry: DocsNavEntry =
		pagePaths.length === 1
			? pagePaths[0]!
			: { group: displayGroupTitle, pages: pagePaths };

	const idx = pages.findIndex((e) => pluginNavEntryMatches(e, pluginId));
	if (idx !== -1) {
		pages[idx] = newEntry;
	} else {
		pages.push(newEntry);
	}

	pages.sort((a, b) =>
		pluginNavGroupSortKey(a).localeCompare(
			pluginNavGroupSortKey(b),
			undefined,
			{
				sensitivity: 'base',
				numeric: true,
			},
		),
	);

	writeFileSync(docsJsonPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

type GeneratePluginDocsOpts = {
	exportName?: string;
	titleArg?: string;
	skipMain: boolean;
};

async function generatePluginDocsForEntry(
	root: string,
	entryPath: string,
	opts: GeneratePluginDocsOpts,
): Promise<{ ok: true; pluginId: string } | { ok: false; error: string }> {
	const { exportName, titleArg, skipMain } = opts;

	if (!existsSync(entryPath)) {
		return { ok: false, error: `Plugin entry not found: ${entryPath}` };
	}

	const exportKey = inferExportName(entryPath, exportName);
	let mod: Record<string, unknown>;
	try {
		mod = (await import(pathToFileURL(entryPath).href)) as Record<
			string,
			unknown
		>;
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return { ok: false, error: `Failed to import ${entryPath}: ${msg}` };
	}

	const factory = mod[exportKey];
	if (typeof factory !== 'function') {
		const available = Object.keys(mod)
			.filter((k) => typeof mod[k] === 'function')
			.join(', ');
		return {
			ok: false,
			error: `No export "${exportKey}" in ${entryPath}. Available: ${available || '(none)'}`,
		};
	}

	const plugin = (factory as () => CorsairPlugin)();
	const pluginId = plugin.id;
	const packageDir = dirname(entryPath);
	const docsConfig = readPluginDocsConfig(packageDir);
	const title =
		titleArg ??
		docsConfig.displayName?.trim() ??
		titleFromPackageDir(packageDir) ??
		humanizePluginId(pluginId);
	const entrySource = readFileSync(entryPath, 'utf8');
	const authTypes = inferAuthTypesFromPluginSource(entrySource);
	const defaultAuthType = inferDefaultAuthTypeFromSource(entrySource);
	const pkgMeta = readPackageMeta(packageDir);
	const frontmatterDescription =
		docsConfig.description?.trim() ??
		pkgMeta.description ??
		`${title} integration for Corsair.`;

	const result = introspectPluginForDocs([plugin], pluginId);
	if (!result.ok) {
		return { ok: false, error: result.error };
	}
	const { data } = result;
	const docData = pluginDocData(data, pluginId);

	const outDir = join(docsRoot(root), pluginId);
	mkdirSync(outDir, { recursive: true });

	const legacyMain = join(outDir, 'main.mdx');
	const legacyApi = join(outDir, 'api-endpoints.mdx');
	if (existsSync(legacyApi)) {
		unlinkSync(legacyApi);
	}

	if (!skipMain) {
		if (existsSync(legacyMain)) {
			unlinkSync(legacyMain);
		}
		writeFileSync(
			join(outDir, 'overview.mdx'),
			buildMainMdx({
				pluginId,
				title,
				exportKey,
				npmPackageName: pkgMeta.npmName,
				frontmatterDescription,
				data: docData,
				authTypes,
				defaultAuthType,
				overviewNote: docsConfig.overviewNote?.trim(),
			}),
			'utf8',
		);
	}

	writeFileSync(
		join(outDir, 'api.mdx'),
		buildApiMdx(pluginId, title, docData),
		'utf8',
	);
	writeFileSync(
		join(outDir, 'database.mdx'),
		buildDbMdx(pluginId, title, docData),
		'utf8',
	);

	const webhooksMdxPath = join(outDir, 'webhooks.mdx');
	if (docData.webhooks.length > 0) {
		writeFileSync(
			webhooksMdxPath,
			buildWebhooksMdx(pluginId, title, docData),
			'utf8',
		);
	} else if (existsSync(webhooksMdxPath)) {
		unlinkSync(webhooksMdxPath);
	}

	syncPluginDocsJson(root, pluginId, title);

	const logBits = [
		`${outDir}`,
		`${docData.api.length} API · ${docData.db.length} DB · ${docData.webhooks.length} webhooks`,
	];
	if (skipMain) logBits.push('overview.mdx not written (--skip-main)');
	console.log(logBits.join(' — '));

	return { ok: true, pluginId };
}

async function main() {
	const argv = process.argv.slice(2);
	const {
		pluginHint,
		entry: entryArg,
		exportName,
		title: titleArg,
		skipMain,
		all,
	} = parseArgs(argv);

	if (all) {
		if (entryArg || pluginHint || exportName || titleArg) {
			console.error(
				'Do not combine --all with --plugin, --entry, --export, or --title.',
			);
			process.exit(1);
		}
		const root = repoRoot();
		const dirs = discoverPluginPackageDirs(root);
		if (dirs.length === 0) {
			console.error('No plugin packages found under packages/.');
			process.exit(1);
		}
		let failed = 0;
		for (const dirName of dirs) {
			const entryPath = join(root, 'packages', dirName, 'index.ts');
			const r = await generatePluginDocsForEntry(root, entryPath, { skipMain });
			if (!r.ok) {
				console.error(`[${dirName}] ${r.error}`);
				failed++;
			}
		}
		console.log(
			`--all: ${dirs.length - failed}/${dirs.length} plugins ok, ${failed} failed.`,
		);
		process.exit(failed > 0 ? 1 : 0);
	}

	if (!pluginHint && !entryArg) {
		console.error(
			'Usage: pnpm generate:docs -- --plugin=<id>\n       pnpm generate:docs -- --entry=packages/<id>/index.ts [--export=factoryName] [--title="Display Name"] [--skip-main]\n       pnpm generate:docs -- --all [--skip-main]',
		);
		process.exit(1);
	}

	const root = repoRoot();
	const entryPath = entryArg
		? resolve(process.cwd(), entryArg)
		: defaultEntry(root, pluginHint!);

	const r = await generatePluginDocsForEntry(root, entryPath, {
		exportName,
		titleArg,
		skipMain,
	});
	if (!r.ok) {
		console.error(r.error);
		process.exit(1);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

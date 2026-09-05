/**
 * Fills publish-readiness gaps for `@corsair-dev/*` plugin packages: writes a
 * minimal README (only when missing) and backfills missing npm metadata
 * (`repository`, `homepage`, `keywords`, `author`, `license`). Content is
 * introspected from the plugin via `introspectPluginForDocs` — nothing invented.
 *
 * Mirrors `generate-plugin-docs.ts` for discovery and plugin loading, and runs
 * under `tsx --conditions=dev-source` for the same reason (resolve TS entries).
 *
 * CLI:
 *   pnpm generate:readmes --plugin=<id>
 *   pnpm generate:readmes:all            (--all)
 *   pnpm generate:readmes:all --check    (CI: non-zero if any gap remains)
 *   pnpm generate:readmes --plugin=<id> --force   (regenerate an existing README)
 *
 * Existing READMEs are never overwritten without --force. Existing metadata
 * values are never clobbered. A single changeset is written for touched packages.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { PluginDocsIntrospection } from '../packages/corsair/core/inspect/index.ts';
import { introspectPluginForDocs } from '../packages/corsair/core/inspect/index.ts';
import type { CorsairPlugin } from '../packages/corsair/core/plugins/index.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Workspace folders that are not Corsair integration plugins. */
const PLUGIN_DISCOVERY_SKIP_DIRS = new Set([
	'corsair',
	'cli',
	'mcp',
	'studio',
	'ui',
	'app',
]);

/** npm fields we consider required for publish-ready discovery. */
export const MISSING_METADATA_FIELDS = [
	'repository',
	'homepage',
	'keywords',
	'author',
	'license',
] as const;

const REPO_GIT_URL = 'git+https://github.com/corsairdev/corsair.git';
const AUTHOR = 'Corsair (https://corsair.dev)';

type PackageJson = Record<string, unknown> & {
	name?: string;
	description?: string;
};

// ── discovery (mirrors generate-plugin-docs.ts) ──────────────────────────────

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

function discoverPluginPackageDirs(root: string): string[] {
	const packagesDir = join(root, 'packages');
	if (!existsSync(packagesDir)) return [];
	const names = readdirSync(packagesDir, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.filter((name) => !PLUGIN_DISCOVERY_SKIP_DIRS.has(name));

	const out: string[] = [];
	for (const name of names) {
		const pkgPath = join(packagesDir, name, 'package.json');
		const idxPath = join(packagesDir, name, 'index.ts');
		if (!existsSync(pkgPath) || !existsSync(idxPath)) continue;
		try {
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
				name?: string;
			};
			if (!pkg.name?.startsWith('@corsair-dev/')) continue;
			out.push(name);
		} catch {
			continue;
		}
	}
	return out.sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' }),
	);
}

// ── auth metadata (mirrors generate-plugin-docs.ts inference) ────────────────

const KNOWN_AUTH_TYPES = [
	'managed',
	'oauth_2',
	'api_key',
	'bot_token',
] as const;

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
		if (types.length > best.length) best = types;
	}
	return best;
}

function inferDefaultAuthTypeFromSource(source: string): string | undefined {
	const match = source.match(
		/const\s+defaultAuthType\b\s*[^=]*=\s*['"](managed|oauth_2|api_key|bot_token)['"]\s*(?:as\s+const)?/,
	);
	return match?.[1];
}

function authTypeHumanLabel(authType: string): string {
	switch (authType) {
		case 'managed':
			return 'Managed OAuth';
		case 'oauth_2':
			return 'OAuth 2.0';
		case 'api_key':
			return 'API key';
		case 'bot_token':
			return 'Bot token';
		default:
			return authType;
	}
}

/** One honest sentence about how the plugin authenticates, from real metadata. */
function authLine(
	authTypes: string[],
	defaultAuthType: string | undefined,
): string {
	if (authTypes.length === 0) {
		return 'Authentication depends on how you configure the plugin factory. See the full reference for supported methods.';
	}
	const preferred =
		defaultAuthType && authTypes.includes(defaultAuthType)
			? defaultAuthType
			: authTypes[0]!;
	const labels = authTypes.map(authTypeHumanLabel);
	if (labels.length === 1) {
		return `Auth: ${labels[0]}. Corsair prompts your tenant for credentials on first use.`;
	}
	return `Auth: ${labels.join(', ')} (default ${authTypeHumanLabel(preferred)}). Set \`authType\` on the plugin factory to pick one.`;
}

// ── README template (unslopped house style) ──────────────────────────────────

function escapeCell(s: string | undefined): string {
	if (!s) return '';
	return s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

/** "Slack plugin for Corsair" → "Corsair plugin for Slack." style one-liner. */
function readmeTagline(
	pluginId: string,
	description: string | undefined,
): string {
	const d = description?.trim();
	if (d) return d.endsWith('.') ? d : `${d}.`;
	return `Corsair plugin for ${pluginId}.`;
}

export function renderPluginReadme(opts: {
	pluginId: string;
	npmName: string;
	description?: string;
	data: PluginDocsIntrospection;
	authTypes: string[];
	defaultAuthType: string | undefined;
}): string {
	const { pluginId, npmName, description, data, authTypes, defaultAuthType } =
		opts;

	const rows = data.api
		.map(
			(ep) =>
				`| \`${escapeCell(ep.shortPath)}\` | \`${escapeCell(ep.path)}\` | ${
					ep.riskLevel ? `\`${ep.riskLevel}\`` : '—'
				} | ${escapeCell(ep.description) || '—'} |`,
		)
		.join('\n');

	const table =
		data.api.length > 0
			? `## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
${rows}`
			: '## Endpoints\n\nThis plugin exposes no HTTP operations.';

	const webhookLine =
		data.webhooks.length > 0
			? `Handles ${data.webhooks.length} webhook event${data.webhooks.length === 1 ? '' : 's'}. See the reference for payloads and \`webhookHooks\`.`
			: 'No webhooks.';

	return `# ${npmName}

${readmeTagline(pluginId, description)}

## Install

\`\`\`bash
pnpm add ${npmName}
\`\`\`

${table}

## Auth

${authLine(authTypes, defaultAuthType)}

## Webhooks

${webhookLine}

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/${pluginId}

## License

Apache-2.0
`;
}

// ── metadata fill (fills missing only, never clobbers) ───────────────────────

function pluginKeywords(pluginId: string): string[] {
	const base = ['corsair', 'integration', 'oauth', 'ai-agents', 'mcp'];
	return pluginId && !base.includes(pluginId) ? [pluginId, ...base] : base;
}

function hasValue(v: unknown): boolean {
	if (v === undefined || v === null) return false;
	if (typeof v === 'string') return v.trim().length > 0;
	if (Array.isArray(v)) return v.length > 0;
	if (typeof v === 'object') return Object.keys(v).length > 0;
	return true;
}

/** npm metadata fields still missing on a package (empty values count as missing). */
export function missingMetadataFields(pkg: PackageJson): string[] {
	return MISSING_METADATA_FIELDS.filter((f) => !hasValue(pkg[f]));
}

/** Returns a new package object with missing metadata filled, plus the touched field names. */
export function fillPackageMetadata(
	pkg: PackageJson,
	pluginId: string,
): { pkg: PackageJson; changed: string[] } {
	const out: PackageJson = { ...pkg };
	const changed: string[] = [];

	if (!hasValue(out.repository)) {
		out.repository = {
			type: 'git',
			url: REPO_GIT_URL,
			directory: `packages/${pluginId}`,
		};
		changed.push('repository');
	}
	if (!hasValue(out.homepage)) {
		out.homepage = `https://docs.corsair.dev/plugins/${pluginId}`;
		changed.push('homepage');
	}
	if (!hasValue(out.keywords)) {
		out.keywords = pluginKeywords(pluginId);
		changed.push('keywords');
	}
	if (!hasValue(out.author)) {
		out.author = AUTHOR;
		changed.push('author');
	}
	if (!hasValue(out.license)) {
		out.license = 'Apache-2.0';
		changed.push('license');
	}

	return { pkg: out, changed };
}

// ── changeset ────────────────────────────────────────────────────────────────

export function buildChangesetContent(npmNames: string[]): string {
	const sorted = [...new Set(npmNames)].sort((a, b) => a.localeCompare(b));
	const lines = sorted.map((n) => `'${n}': patch`);
	return `---
${lines.join('\n')}
---

Add package README and npm metadata.
`;
}

// ── plugin loading + orchestration ───────────────────────────────────────────

/** Construct-time options for plugins whose factory cannot be called with `()`. */
const FACTORY_OPTIONS: Record<string, Record<string, unknown>> = {
	workday: { tenant: 'acme', host: 'wd2-impl-services1.workday.com' },
};

async function loadPlugin(
	entryPath: string,
): Promise<{ ok: true; plugin: CorsairPlugin } | { ok: false; error: string }> {
	const exportKey = basename(dirname(entryPath));
	let mod: Record<string, unknown>;
	try {
		mod = (await import(pathToFileURL(entryPath).href)) as Record<
			string,
			unknown
		>;
	} catch (e) {
		return { ok: false, error: `import failed: ${(e as Error).message}` };
	}
	const factory =
		mod[exportKey] ?? Object.values(mod).find((v) => typeof v === 'function');
	if (typeof factory !== 'function') {
		return { ok: false, error: `no factory export "${exportKey}"` };
	}
	const options = FACTORY_OPTIONS[exportKey];
	try {
		const plugin = options
			? (factory as (o: Record<string, unknown>) => CorsairPlugin)(options)
			: (factory as () => CorsairPlugin)();
		return { ok: true, plugin };
	} catch (e) {
		return { ok: false, error: `factory() threw: ${(e as Error).message}` };
	}
}

type PluginProcessResult = {
	dir: string;
	pluginId: string;
	npmName: string;
	readmeWritten: boolean;
	metadataFields: string[];
	/** true when introspection yielded zero operations (README skipped). */
	skippedNoOps: boolean;
	/** unresolved gaps for --check mode. */
	gaps: string[];
	error?: string;
};

async function processPlugin(
	root: string,
	dirName: string,
	mode: { check: boolean; force: boolean },
): Promise<PluginProcessResult> {
	const packageDir = join(root, 'packages', dirName);
	const entryPath = join(packageDir, 'index.ts');
	const pkgPath = join(packageDir, 'package.json');
	const readmePath = join(packageDir, 'README.md');

	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageJson;
	const npmName = pkg.name ?? `@corsair-dev/${dirName}`;

	const load = await loadPlugin(entryPath);
	if (!load.ok) {
		return {
			dir: dirName,
			pluginId: dirName,
			npmName,
			readmeWritten: false,
			metadataFields: [],
			skippedNoOps: false,
			gaps: [],
			error: load.error,
		};
	}
	const pluginId = load.plugin.id;
	const introspection = introspectPluginForDocs([load.plugin], pluginId);
	if (!introspection.ok) {
		return {
			dir: dirName,
			pluginId,
			npmName,
			readmeWritten: false,
			metadataFields: [],
			skippedNoOps: false,
			gaps: [],
			error: introspection.error,
		};
	}
	const data = introspection.data;
	const readmeExists = existsSync(readmePath);
	const metaGaps = missingMetadataFields(pkg);

	if (mode.check) {
		const gaps: string[] = [];
		if (!readmeExists) gaps.push('README.md');
		gaps.push(...metaGaps);
		return {
			dir: dirName,
			pluginId,
			npmName,
			readmeWritten: false,
			metadataFields: [],
			skippedNoOps: data.api.length === 0,
			gaps,
		};
	}

	// README: write only when missing (or --force), and only if there is content.
	let readmeWritten = false;
	const skippedNoOps = data.api.length === 0 && data.webhooks.length === 0;
	if ((!readmeExists || mode.force) && !skippedNoOps) {
		const source = readFileSync(entryPath, 'utf8');
		const authTypes = inferAuthTypesFromPluginSource(source);
		const defaultAuthType = inferDefaultAuthTypeFromSource(source);
		writeFileSync(
			readmePath,
			renderPluginReadme({
				pluginId,
				npmName,
				description: pkg.description,
				data,
				authTypes,
				defaultAuthType,
			}),
			'utf8',
		);
		readmeWritten = true;
	}

	// Metadata: fill missing fields, preserve ordering by appending.
	const { pkg: filled, changed } = fillPackageMetadata(pkg, pluginId);
	if (changed.length > 0) {
		writeFileSync(pkgPath, `${JSON.stringify(filled, null, 2)}\n`, 'utf8');
	}

	return {
		dir: dirName,
		pluginId,
		npmName,
		readmeWritten,
		metadataFields: changed,
		skippedNoOps,
		gaps: [],
	};
}

function parseArgs(argv: string[]): {
	pluginHint?: string;
	all: boolean;
	check: boolean;
	force: boolean;
} {
	let pluginHint: string | undefined;
	let all = false;
	let check = false;
	let force = false;
	for (const a of argv) {
		if (a === '--') continue;
		if (a === '--all') all = true;
		else if (a === '--check') check = true;
		else if (a === '--force') force = true;
		else if (a.startsWith('--plugin='))
			pluginHint = a.slice('--plugin='.length);
		else if (!a.startsWith('-') && a.length > 0) pluginHint ??= a;
	}
	return { pluginHint, all, check, force };
}

async function main() {
	const { pluginHint, all, check, force } = parseArgs(process.argv.slice(2));
	const root = repoRoot();

	if (!all && !pluginHint) {
		console.error(
			'Usage: pnpm generate:readmes --plugin=<id> [--force]\n       pnpm generate:readmes:all [--check]',
		);
		process.exit(1);
	}

	const dirs = all ? discoverPluginPackageDirs(root) : [pluginHint!];
	if (dirs.length === 0) {
		console.error('No plugin packages found under packages/.');
		process.exit(1);
	}

	const results: PluginProcessResult[] = [];
	for (const dir of dirs) {
		results.push(await processPlugin(root, dir, { check, force }));
	}

	const errored = results.filter((r) => r.error);
	for (const r of errored) {
		console.error(`[${r.dir}] ${r.error}`);
	}

	if (check) {
		const offenders = results.filter((r) => !r.error && r.gaps.length > 0);
		for (const r of offenders) {
			console.error(`[${r.dir}] missing: ${r.gaps.join(', ')}`);
		}
		const ok = offenders.length === 0 && errored.length === 0;
		console.log(
			`--check: ${results.length} plugins, ${offenders.length} with gaps, ${errored.length} failed to introspect.`,
		);
		process.exit(ok ? 0 : 1);
	}

	const readmesWritten = results.filter((r) => r.readmeWritten);
	const metadataPatched = results.filter((r) => r.metadataFields.length > 0);
	const skipped = results.filter((r) => r.skippedNoOps && !r.error);
	const touched = new Set<string>([
		...readmesWritten.map((r) => r.npmName),
		...metadataPatched.map((r) => r.npmName),
	]);

	// This repo releases via `bumpp` (bumps every package) + `publish-changed.mjs`,
	// not changesets. Write the changeset only if a `.changeset/` dir exists, so we
	// stay release-tool-native and never drop a dead artifact.
	let changesetWritten = false;
	if (all && touched.size > 0 && existsSync(join(root, '.changeset'))) {
		writeFileSync(
			join(root, '.changeset', 'plugin-readmes.md'),
			buildChangesetContent([...touched]),
			'utf8',
		);
		changesetWritten = true;
	}

	console.log(
		`READMEs written: ${readmesWritten.length} · metadata patched: ${metadataPatched.length} · skipped (no ops): ${skipped.length} · introspection failures: ${errored.length} · packages touched: ${touched.size}${changesetWritten ? ' · changeset written' : ' · no .changeset dir (bumpp handles versions)'}`,
	);
	process.exit(errored.length > 0 ? 1 : 0);
}

// Only run when invoked as a script, not when imported by the test.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	main().catch((e) => {
		console.error(e);
		process.exit(1);
	});
}

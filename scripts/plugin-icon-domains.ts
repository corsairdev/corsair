import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

import { pluginToDomain } from '../packages/corsair/client/react/plugin-icon.tsx';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PLUGIN_DOCS_FILE = 'plugin-docs.yaml';

/** Workspace folders under `packages/` that are not Corsair integration plugins. */
const PLUGIN_DISCOVERY_SKIP_DIRS = new Set([
	'corsair',
	'cli',
	'mcp',
	'ui',
	'studio',
]);

/** Hand-tuned domains for plugins where `<id>.com` is wrong and yaml is not set yet. */
const PLUGIN_DOMAIN_OVERRIDES: Record<string, string> = {
	ably: 'ably.io',
	abstract: 'abstractapi.com',
	anthropicadministrator: 'anthropic.com',
	apibible: 'api.bible',
	apininjas: 'api-ninjas.com',
	ascora: 'ascora.com',
	attio: 'attio.com',
	betterstack: 'betterstack.com',
	botbaba: 'botbaba.io',
	brevo: 'brevo.com',
	collegefootballdata: 'collegefootballdata.com',
	contentfulgraphql: 'contentful.com',
	customgpt: 'customgpt.ai',
	datarobot: 'datarobot.com',
	deepseek: 'deepseek.com',
	firecrawl: 'firecrawl.dev',
	groqcloud: 'groq.com',
	hackernews: 'news.ycombinator.com',
	heygen: 'heygen.com',
	huggingface: 'huggingface.co',
	jigsawstack: 'jigsawstack.com',
	merriamwebsterdict: 'merriam-webster.com',
	openrouter: 'openrouter.ai',
	perplexityai: 'perplexity.ai',
	posthog: 'posthog.com',
	removebg: 'remove.bg',
	scrapegraphai: 'scrapegraphai.com',
	serpapi: 'serpapi.com',
	stripe: 'stripe.com',
	studiobyai21labs: 'elevenlabs.io',
	synthflowai: 'synthflow.ai',
	tavilymcp: 'tavily.com',
	twitter: 'x.com',
	twitterapiio: 'twitter.com',
	witai: 'wit.ai',
	youcom: 'you.com',
	zohomail: 'zoho.com',
};

let yamlDomainsCache: Record<string, string> | null = null;

function repoRoot(): string {
	return resolve(join(__dirname, '..'));
}

/** Normalize `domain` from plugin-docs.yaml to a bare hostname. */
export function normalizePluginDomain(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) return trimmed;

	try {
		const withProtocol = trimmed.includes('://')
			? trimmed
			: `https://${trimmed}`;
		return new URL(withProtocol).hostname.replace(/^www\./, '');
	} catch {
		return trimmed.replace(/^www\./, '').replace(/\/+$/, '');
	}
}

function loadYamlDomains(): Record<string, string> {
	if (yamlDomainsCache) return yamlDomainsCache;

	const domains: Record<string, string> = {};
	const packagesDir = join(repoRoot(), 'packages');
	if (!existsSync(packagesDir)) {
		yamlDomainsCache = domains;
		return domains;
	}

	for (const name of readdirSync(packagesDir, { withFileTypes: true })) {
		if (!name.isDirectory() || PLUGIN_DISCOVERY_SKIP_DIRS.has(name.name)) {
			continue;
		}

		const docsPath = join(packagesDir, name.name, PLUGIN_DOCS_FILE);
		if (!existsSync(docsPath)) continue;

		try {
			const doc = parseYaml(readFileSync(docsPath, 'utf8')) as unknown;
			if (!doc || typeof doc !== 'object' || Array.isArray(doc)) continue;

			const rawDomain = (doc as { domain?: unknown }).domain;
			if (typeof rawDomain !== 'string' || !rawDomain.trim()) continue;

			domains[name.name] = normalizePluginDomain(rawDomain);
		} catch {
			// ignore invalid yaml
		}
	}

	yamlDomainsCache = domains;
	return domains;
}

/** Resolve the brand domain used to fetch an explorer plugin icon. */
export function resolvePluginDomain(pluginId: string): string {
	const yamlDomains = loadYamlDomains();
	return (
		yamlDomains[pluginId] ??
		PLUGIN_DOMAIN_OVERRIDES[pluginId] ??
		pluginToDomain(pluginId)
	);
}

export function buildPluginDomainMap(
	pluginIds: string[],
): Record<string, string> {
	const domains: Record<string, string> = {};
	for (const pluginId of pluginIds) {
		domains[pluginId] = resolvePluginDomain(pluginId);
	}
	return domains;
}

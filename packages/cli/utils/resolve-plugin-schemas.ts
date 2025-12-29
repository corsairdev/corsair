import type { CorsairConfig } from '@corsair-ai/core/config';
import {
	slackDefaultSchema,
	gmailDefaultSchema,
	linearDefaultSchema,
	githubDefaultSchema,
} from 'corsair/plugins';

type ResolvedSchema = Record<string, Record<string, string | boolean | number>>;

type SchemaOverride = Record<
	string,
	| boolean
	| ((dbSchema: Record<string, Record<string, string | boolean | number>>) => Record<string, string | boolean | number>)
>;

function resolveSlackSchema(
	override: SchemaOverride | undefined,
): ResolvedSchema {
	if (!override) {
		return slackDefaultSchema as ResolvedSchema;
	}

	const resolved: ResolvedSchema = {};

	for (const [tableName, tableOverride] of Object.entries(override)) {
		if (tableOverride === false) {
			continue;
		} else if (tableOverride === true) {
			resolved[tableName] = slackDefaultSchema[
				tableName as keyof typeof slackDefaultSchema
			] as Record<string, string | boolean>;
		} else if (typeof tableOverride === 'function') {
			resolved[tableName] = tableOverride(slackDefaultSchema);
		}
	}

	for (const [tableName, defaultSchema] of Object.entries(slackDefaultSchema)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<string, string | boolean>;
		}
	}

	return resolved;
}

function resolveGmailSchema(
	override: SchemaOverride | undefined,
): ResolvedSchema {
	if (!override) {
		return gmailDefaultSchema as ResolvedSchema;
	}

	const resolved: ResolvedSchema = {};

	for (const [tableName, tableOverride] of Object.entries(override)) {
		if (tableOverride === false) {
			continue;
		} else if (tableOverride === true) {
			resolved[tableName] = gmailDefaultSchema[
				tableName as keyof typeof gmailDefaultSchema
			] as Record<string, string | boolean>;
		} else if (typeof tableOverride === 'function') {
			resolved[tableName] = tableOverride(gmailDefaultSchema);
		}
	}

	for (const [tableName, defaultSchema] of Object.entries(gmailDefaultSchema)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<string, string | boolean>;
		}
	}

	return resolved;
}

function resolveLinearSchema(
	override: SchemaOverride | undefined,
): ResolvedSchema {
	if (!override) {
		return linearDefaultSchema as ResolvedSchema;
	}

	const resolved: ResolvedSchema = {};

	for (const [tableName, tableOverride] of Object.entries(override)) {
		if (tableOverride === false) {
			continue;
		} else if (tableOverride === true) {
			resolved[tableName] = linearDefaultSchema[
				tableName as keyof typeof linearDefaultSchema
			] as Record<string, string | boolean | number>;
		} else if (typeof tableOverride === 'function') {
			resolved[tableName] = tableOverride(linearDefaultSchema);
		}
	}

	for (const [tableName, defaultSchema] of Object.entries(linearDefaultSchema)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<
				string,
				string | boolean | number
			>;
		}
	}

	return resolved;
}

function resolveGitHubSchema(
	override: SchemaOverride | undefined,
): ResolvedSchema {
	if (!override) {
		return githubDefaultSchema as ResolvedSchema;
	}

	const resolved: ResolvedSchema = {};

	for (const [tableName, tableOverride] of Object.entries(override)) {
		if (tableOverride === false) {
			continue;
		} else if (tableOverride === true) {
			resolved[tableName] = githubDefaultSchema[
				tableName as keyof typeof githubDefaultSchema
			] as Record<string, string | boolean | number>;
		} else if (typeof tableOverride === 'function') {
			resolved[tableName] = tableOverride(githubDefaultSchema);
		}
	}

	for (const [tableName, defaultSchema] of Object.entries(githubDefaultSchema)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<
				string,
				string | boolean | number
			>;
		}
	}

	return resolved;
}

export function resolvePluginSchemas(
	config: CorsairConfig<any>,
): Record<string, ResolvedSchema> {
	const resolved: Record<string, ResolvedSchema> = {};

	if (!config.plugins || !Array.isArray(config.plugins)) {
		return resolved;
	}

	for (const plugin of config.plugins) {
		if (plugin.name === 'slack') {
			resolved.slack = resolveSlackSchema(plugin.schema);
		} else if (plugin.name === 'gmail') {
			resolved.gmail = resolveGmailSchema(plugin.schema);
		} else if (plugin.name === 'linear') {
			resolved.linear = resolveLinearSchema(plugin.schema);
		} else if (plugin.name === 'github') {
			resolved.github = resolveGitHubSchema(plugin.schema);
		}
	}

	return resolved;
}


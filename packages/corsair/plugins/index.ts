import type {
	BaseConfig,
	GitHubPluginConfig,
	GmailPluginConfig,
	LinearPluginConfig,
} from '../config';
import { createGitHubPlugin } from './github';
import type {
	GitHubSchemaOverride,
	ResolvedGitHubSchema,
} from './github/schema';
import { githubDefaultSchema } from './github/schema';
import type { GitHubPlugin } from './github/types';
import { createGmailPlugin } from './gmail';
import type { GmailSchemaOverride, ResolvedGmailSchema } from './gmail/schema';
import { gmailDefaultSchema } from './gmail/schema';
import type { GmailPlugin } from './gmail/types';
import { createLinearPlugin } from './linear';
import type {
	LinearSchemaOverride,
	ResolvedLinearSchema,
} from './linear/schema';
import { linearDefaultSchema } from './linear/schema';
import type { LinearPlugin } from './linear/types';
import { createSlackPlugin } from './slack';
import type { ResolvedSlackSchema, SlackSchemaOverride } from './slack/schema';
import { slackDefaultSchema } from './slack/schema';
import type { SlackPlugin } from './slack/types';

/**
 * Resolves the schema override for Slack plugin
 */
function resolveSlackSchema<T extends SlackSchemaOverride>(
	override: T | undefined,
): ResolvedSlackSchema<T> {
	if (!override) {
		return slackDefaultSchema as ResolvedSlackSchema<T>;
	}

	const resolved: Record<string, Record<string, string | boolean>> = {};

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

	return resolved as ResolvedSlackSchema<T>;
}

/**
 * Resolves the schema override for Gmail plugin
 */
function resolveGmailSchema<T extends GmailSchemaOverride>(
	override: T | undefined,
): ResolvedGmailSchema<T> {
	if (!override) {
		return gmailDefaultSchema as ResolvedGmailSchema<T>;
	}

	const resolved: Record<string, Record<string, string | boolean>> = {};

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

	return resolved as ResolvedGmailSchema<T>;
}

/**
 * Resolves the schema override for Linear plugin
 */
function resolveLinearSchema<T extends LinearSchemaOverride>(
	override: T | undefined,
): ResolvedLinearSchema<T> {
	if (!override) {
		return linearDefaultSchema as ResolvedLinearSchema<T>;
	}

	const resolved: Record<
		string,
		Record<string, string | boolean | number>
	> = {};

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

	for (const [tableName, defaultSchema] of Object.entries(
		linearDefaultSchema,
	)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<
				string,
				string | boolean | number
			>;
		}
	}

	return resolved as ResolvedLinearSchema<T>;
}

/**
 * Resolves the schema override for GitHub plugin
 */
function resolveGitHubSchema<T extends GitHubSchemaOverride>(
	override: T | undefined,
): ResolvedGitHubSchema<T> {
	if (!override) {
		return githubDefaultSchema as ResolvedGitHubSchema<T>;
	}

	const resolved: Record<
		string,
		Record<string, string | boolean | number>
	> = {};

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

	for (const [tableName, defaultSchema] of Object.entries(
		githubDefaultSchema,
	)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultSchema as Record<
				string,
				string | boolean | number
			>;
		}
	}

	return resolved as ResolvedGitHubSchema<T>;
}

/**
 * Creates a database context based on resolved schema
 * This provides typed access to database tables
 */
function createDatabaseContext<
	T extends Record<string, Record<string, string | boolean | number>>,
>(
	resolvedSchema: T,
	db: unknown,
): {
	[K in keyof T]: T[K] extends never
		? never
		: {
				insert: (data: Record<string, unknown>) => Promise<unknown>;
				select: () => Promise<Array<Record<string, unknown>>>;
				update: (data: Record<string, unknown>) => Promise<unknown>;
				delete: () => Promise<unknown>;
			};
} {
	const context: Record<
		string,
		{
			insert: (data: Record<string, unknown>) => Promise<unknown>;
			select: () => Promise<Array<Record<string, unknown>>>;
			update: (data: Record<string, unknown>) => Promise<unknown>;
			delete: () => Promise<unknown>;
		}
	> = {};

	for (const tableName of Object.keys(resolvedSchema)) {
		const table = (db as { _?: { schema?: Record<string, unknown> } })._
			?.schema?.[tableName] as
			| {
					insert: (data: Record<string, unknown>) => Promise<unknown>;
					select: () => Promise<Array<Record<string, unknown>>>;
					update: (data: Record<string, unknown>) => Promise<unknown>;
					delete: () => Promise<unknown>;
			  }
			| undefined;

		if (table) {
			context[tableName] = table;
		} else {
			context[tableName] = {
				async insert() {
					return Promise.resolve(undefined);
				},
				async select() {
					return Promise.resolve([]);
				},
				async update() {
					return Promise.resolve(undefined);
				},
				async delete() {
					return Promise.resolve(undefined);
				},
			};
		}
	}

	return context as {
		[K in keyof T]: T[K] extends never
			? never
			: {
					insert: (data: Record<string, unknown>) => Promise<unknown>;
					select: () => Promise<Array<Record<string, unknown>>>;
					update: (data: Record<string, unknown>) => Promise<unknown>;
					delete: () => Promise<unknown>;
				};
	};
}

export const createPlugins = <T extends BaseConfig>(config: T) => {
	const plugins: Record<string, unknown> = {};

	// Process each plugin in the config
	for (const pluginConfig of config.plugins || []) {
		if (pluginConfig.name === 'slack') {
			const slackConfig: SlackPlugin = {
				token: pluginConfig.token,
				channels: pluginConfig.channels,
				members: pluginConfig.members,
				schema: pluginConfig.schema,
			};

			const resolvedSchema = resolveSlackSchema(pluginConfig.schema);
			const dbContext = createDatabaseContext(
				resolvedSchema,
				(config as unknown as { db: unknown }).db,
			);

			plugins.slack = createSlackPlugin(slackConfig, dbContext);
		} else if (pluginConfig.name === 'gmail') {
			const gmailPluginConfig = pluginConfig as GmailPluginConfig;
			const gmailConfig: GmailPlugin = {
				accessToken: gmailPluginConfig.accessToken,
				refreshToken: gmailPluginConfig.refreshToken,
				userId: gmailPluginConfig.userId,
				schema: gmailPluginConfig.schema,
			};

			const resolvedSchema = resolveGmailSchema(gmailPluginConfig.schema);
			const dbContext = createDatabaseContext(
				resolvedSchema,
				(config as unknown as { db: unknown }).db,
			);

			plugins.gmail = createGmailPlugin(gmailConfig, dbContext);
		} else if (pluginConfig.name === 'linear') {
			const linearPluginConfig = pluginConfig as LinearPluginConfig;
			const linearConfig: LinearPlugin = {
				apiKey: linearPluginConfig.apiKey,
				teamId: linearPluginConfig.teamId,
				schema: linearPluginConfig.schema,
			};

			const resolvedSchema = resolveLinearSchema(linearPluginConfig.schema);
			const dbContext = createDatabaseContext(
				resolvedSchema,
				(config as unknown as { db: unknown }).db,
			);

			plugins.linear = createLinearPlugin(linearConfig, dbContext);
		} else if (pluginConfig.name === 'github') {
			const githubPluginConfig = pluginConfig as GitHubPluginConfig;
			const githubConfig: GitHubPlugin = {
				token: githubPluginConfig.token,
				schema: githubPluginConfig.schema,
			};

			const resolvedSchema = resolveGitHubSchema(githubPluginConfig.schema);
			const dbContext = createDatabaseContext(
				resolvedSchema,
				(config as unknown as { db: unknown }).db,
			);

			plugins.github = createGitHubPlugin(githubConfig, dbContext);
		}
	}

	return plugins as {
		slack?: ReturnType<typeof createSlackPlugin>;
		gmail?: ReturnType<typeof createGmailPlugin>;
		linear?: ReturnType<typeof createLinearPlugin>;
		github?: ReturnType<typeof createGitHubPlugin>;
	};
};

export type { SlackPlugin } from './slack/types';
export type { SlackSchemaOverride, SlackDefaultSchema } from './slack/schema';
export { slackDefaultSchema } from './slack/schema';
export type { GmailPlugin } from './gmail/types';
export type { GmailSchemaOverride } from './gmail/schema';
export { gmailDefaultSchema } from './gmail/schema';
export type { LinearPlugin } from './linear/types';
export type { LinearSchemaOverride } from './linear/schema';
export { linearDefaultSchema } from './linear/schema';
export type { GitHubPlugin } from './github/types';
export type { GitHubSchemaOverride } from './github/schema';
export { githubDefaultSchema } from './github/schema';
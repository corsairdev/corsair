import type {
	BaseConfig,
	GitHubPluginConfig,
	GmailPluginConfig,
	LinearPluginConfig,
} from '../config';
import { createDatabaseContext, resolveSchema } from './base';
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
 * Uses the generic resolveSchema from base
 */
function resolveSlackSchema<T extends SlackSchemaOverride>(
	override: T | undefined,
): ResolvedSlackSchema<T> {
	return resolveSchema(slackDefaultSchema, override) as ResolvedSlackSchema<T>;
}

/**
 * Resolves the schema override for Gmail plugin
 * Uses the generic resolveSchema from base
 */
function resolveGmailSchema<T extends GmailSchemaOverride>(
	override: T | undefined,
): ResolvedGmailSchema<T> {
	return resolveSchema(gmailDefaultSchema, override) as ResolvedGmailSchema<T>;
}

/**
 * Resolves the schema override for Linear plugin
 * Uses the generic resolveSchema from base
 */
function resolveLinearSchema<T extends LinearSchemaOverride>(
	override: T | undefined,
): ResolvedLinearSchema<T> {
	return resolveSchema(linearDefaultSchema, override);
}

/**
 * Resolves the schema override for GitHub plugin
 * Uses the generic resolveSchema from base
 */
function resolveGitHubSchema<T extends GitHubSchemaOverride>(
	override: T | undefined,
): ResolvedGitHubSchema<T> {
	return resolveSchema(githubDefaultSchema, override);
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

export type { GitHubSchemaOverride } from './github/schema';
export { githubDefaultSchema } from './github/schema';
export type { GitHubPlugin } from './github/types';
export type { GmailSchemaOverride } from './gmail/schema';
export { gmailDefaultSchema } from './gmail/schema';
export type { GmailPlugin } from './gmail/types';
export type { LinearSchemaOverride } from './linear/schema';
export { linearDefaultSchema } from './linear/schema';
export type { LinearPlugin } from './linear/types';
export type { SlackDefaultSchema, SlackSchemaOverride } from './slack/schema';
export { slackDefaultSchema } from './slack/schema';
export type { SlackPlugin } from './slack/types';

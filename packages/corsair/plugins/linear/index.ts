import { initializePlugin } from '../base';
import { createLinearClient } from './client';
import { createIssue } from './operations/create-issue';
import { getIssue } from './operations/get-issue';
import { listIssues } from './operations/list-issues';
import { listTeams } from './operations/list-teams';
import { updateIssue } from './operations/update-issue';
import { linearDefaultSchema } from './schema';
import type {
	LinearDatabaseContext,
	LinearPlugin,
	LinearPluginContext,
	LinearSchemaOverride,
} from './types';

/**
 * Creates a Linear plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createLinearPlugin<
	TSchemaOverride extends LinearSchemaOverride = LinearSchemaOverride,
	TDatabase extends
		LinearDatabaseContext<TSchemaOverride> = LinearDatabaseContext<TSchemaOverride>,
>(config: LinearPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		linearDefaultSchema,
		db,
		(config) => createLinearClient(config.apiKey),
	);
	const { config: pluginConfig, client, ctx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as LinearDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: LinearPlugin;
		client: ReturnType<typeof createLinearClient>;
		ctx: LinearPluginContext<TSchemaOverride>;
	};

	return {
		listIssues: async (params?: {
			teamId?: string;
			first?: number;
			after?: string;
		}): Promise<ReturnType<typeof listIssues>> => {
			return listIssues({
				config: pluginConfig,
				client,
				options: params,
				ctx,
			});
		},

		getIssue: async (params: {
			issueId: string;
		}): Promise<ReturnType<typeof getIssue>> => {
			return getIssue({
				config: pluginConfig,
				client,
				issueId: params.issueId,
				ctx,
			});
		},

		createIssue: async (params: {
			title: string;
			description?: string;
			teamId: string;
			priority?: number;
			stateId?: string;
			assigneeId?: string;
		}): Promise<ReturnType<typeof createIssue>> => {
			return createIssue({
				config: pluginConfig,
				client,
				title: params.title,
				description: params.description,
				teamId: params.teamId,
				priority: params.priority,
				stateId: params.stateId,
				assigneeId: params.assigneeId,
				ctx,
			});
		},

		updateIssue: async (params: {
			issueId: string;
			title?: string;
			description?: string;
			priority?: number;
			stateId?: string;
			assigneeId?: string;
		}): Promise<ReturnType<typeof updateIssue>> => {
			return updateIssue({
				config: pluginConfig,
				client,
				issueId: params.issueId,
				title: params.title,
				description: params.description,
				priority: params.priority,
				stateId: params.stateId,
				assigneeId: params.assigneeId,
				ctx,
			});
		},

		listTeams: async (): Promise<ReturnType<typeof listTeams>> => {
			return listTeams({
				config: pluginConfig,
				client,
				ctx,
			});
		},
	};
}

export type { LinearPlugin, LinearSchemaOverride, LinearPluginContext };

import { createLinearClient } from './client';
import type {
	LinearDatabaseContext,
	LinearPlugin,
	LinearPluginContext,
	LinearSchemaOverride,
} from './types';
import { listIssues } from './operations/list-issues';
import { getIssue } from './operations/get-issue';
import { createIssue } from './operations/create-issue';
import { updateIssue } from './operations/update-issue';
import { listTeams } from './operations/list-teams';

/**
 * Creates a Linear plugin instance with database access
 */
export function createLinearPlugin<
	TSchemaOverride extends LinearSchemaOverride = LinearSchemaOverride,
	TDatabase extends LinearDatabaseContext<TSchemaOverride> = LinearDatabaseContext<TSchemaOverride>,
>(config: LinearPlugin, db: TDatabase) {
	const client = createLinearClient(config.apiKey);

	return {
		listIssues: async (params?: {
			teamId?: string;
			first?: number;
			after?: string;
		}): Promise<ReturnType<typeof listIssues>> => {
			return listIssues({
				config,
				client,
				options: params,
				ctx: { db, userId: undefined },
			});
		},

		getIssue: async (params: {
			issueId: string;
		}): Promise<ReturnType<typeof getIssue>> => {
			return getIssue({
				config,
				client,
				issueId: params.issueId,
				ctx: { db, userId: undefined },
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
				config,
				client,
				title: params.title,
				description: params.description,
				teamId: params.teamId,
				priority: params.priority,
				stateId: params.stateId,
				assigneeId: params.assigneeId,
				ctx: { db, userId: undefined },
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
				config,
				client,
				issueId: params.issueId,
				title: params.title,
				description: params.description,
				priority: params.priority,
				stateId: params.stateId,
				assigneeId: params.assigneeId,
				ctx: { db, userId: undefined },
			});
		},

		listTeams: async (): Promise<ReturnType<typeof listTeams>> => {
			return listTeams({
				config,
				client,
				ctx: { db, userId: undefined },
			});
		},
	};
}

export type { LinearPlugin, LinearSchemaOverride, LinearPluginContext };


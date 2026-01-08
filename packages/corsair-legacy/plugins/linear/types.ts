import type {
	BasePluginConfig,
	BasePluginContext,
	BasePluginResponse,
	BaseDatabaseContext,
} from '../base';
import type { LinearSchemaOverride, ResolvedLinearSchema } from './schema';

export type LinearPlugin = BasePluginConfig<LinearSchemaOverride> & {
	/**
	 * Linear API key
	 */
	apiKey: string;
	/**
	 * Optional team ID to filter issues
	 */
	teamId?: string;
};

export type BaseLinearPluginResponse<T extends Record<string, unknown>> =
	BasePluginResponse<T>;

// Response type for listIssues operation
export type ListIssuesResponse = BaseLinearPluginResponse<{
	issues: Array<{
		id: string;
		title: string;
		description?: string;
		priority: number;
		number: number;
		url: string;
		state: { id: string; name: string; type: string };
		team: { id: string; name: string; key: string };
		assignee?: { id: string; name: string; email: string };
		creator: { id: string; name: string; email: string };
		createdAt: string;
		updatedAt: string;
	}>;
	hasNextPage: boolean;
	nextCursor?: string;
}>;

// Response type for getIssue operation
export type GetIssueResponse = BaseLinearPluginResponse<{
	id: string;
	title: string;
	description?: string;
	priority: number;
	number: number;
	url: string;
	state: { id: string; name: string; type: string };
	team: { id: string; name: string; key: string };
	assignee?: { id: string; name: string; email: string };
	creator: { id: string; name: string; email: string };
	createdAt: string;
	updatedAt: string;
}>;

// Response type for createIssue operation
export type CreateIssueResponse = BaseLinearPluginResponse<{
	id: string;
	title: string;
	description?: string;
	priority: number;
	number: number;
	url: string;
	state: { id: string; name: string };
	team: { id: string; name: string };
	createdAt: string;
}>;

// Response type for updateIssue operation
export type UpdateIssueResponse = BaseLinearPluginResponse<{
	id: string;
	title: string;
	description?: string;
	priority: number;
	updatedAt: string;
}>;

// Response type for listTeams operation
export type ListTeamsResponse = BaseLinearPluginResponse<{
	teams: Array<{
		id: string;
		name: string;
		key: string;
	}>;
}>;

/**
 * Database context type for plugin operations
 */
export type LinearDatabaseContext<
	TSchemaOverride extends LinearSchemaOverride = LinearSchemaOverride,
> = BaseDatabaseContext<ResolvedLinearSchema<TSchemaOverride>>;

/**
 * Plugin operation context
 */
export type LinearPluginContext<
	TSchemaOverride extends LinearSchemaOverride = LinearSchemaOverride,
> = BasePluginContext<ResolvedLinearSchema<TSchemaOverride>>;

/**
 * LinearClient type for operations
 */
export type { LinearClient } from './client';

export type { LinearSchemaOverride } from './schema';

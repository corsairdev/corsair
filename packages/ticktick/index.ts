import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getValidAccessToken } from './client';
import { OAuth, Projects, Tasks } from './endpoints';
import type {
	TickTickEndpointInputs,
	TickTickEndpointOutputs,
} from './endpoints/types';
import {
	TickTickEndpointInputSchemas,
	TickTickEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TickTickSchema } from './schema';

export type TickTickPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalTickTickPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tickTickEndpointsNested>;
};

export type TickTickContext = CorsairPluginContext<
	typeof TickTickSchema,
	TickTickPluginOptions
>;

export type TickTickKeyBuilderContext =
	KeyBuilderContext<TickTickPluginOptions>;

export type TickTickBoundEndpoints = BindEndpoints<
	typeof tickTickEndpointsNested
>;

type TickTickEndpoint<K extends keyof TickTickEndpointOutputs> =
	CorsairEndpoint<
		TickTickContext,
		TickTickEndpointInputs[K],
		TickTickEndpointOutputs[K]
	>;

export type TickTickEndpoints = {
	createProject: TickTickEndpoint<'createProject'>;
	deleteProject: TickTickEndpoint<'deleteProject'>;
	getProject: TickTickEndpoint<'getProject'>;
	getUserProjects: TickTickEndpoint<'getUserProjects'>;
	getProjectWithData: TickTickEndpoint<'getProjectWithData'>;
	updateProject: TickTickEndpoint<'updateProject'>;
	createTask: TickTickEndpoint<'createTask'>;
	completeTask: TickTickEndpoint<'completeTask'>;
	deleteTask: TickTickEndpoint<'deleteTask'>;
	getTask: TickTickEndpoint<'getTask'>;
	updateTask: TickTickEndpoint<'updateTask'>;
	listAllTasks: TickTickEndpoint<'listAllTasks'>;
	generateAuthUrl: TickTickEndpoint<'generateAuthUrl'>;
};

const tickTickEndpointsNested = {
	projects: {
		create: Projects.create,
		delete: Projects.deleteProject,
		get: Projects.get,
		getMany: Projects.getMany,
		getData: Projects.getData,
		update: Projects.update,
	},
	tasks: {
		complete: Tasks.complete,
		create: Tasks.create,
		delete: Tasks.deleteTask,
		get: Tasks.get,
		update: Tasks.update,
		listAll: Tasks.listAll,
	},
	oauth: {
		generateAuthUrl: OAuth.generateAuthUrl,
	},
} as const;

export const tickTickEndpointSchemas = {
	'projects.create': {
		input: TickTickEndpointInputSchemas.createProject,
		output: TickTickEndpointOutputSchemas.createProject,
	},
	'projects.delete': {
		input: TickTickEndpointInputSchemas.deleteProject,
		output: TickTickEndpointOutputSchemas.deleteProject,
	},
	'projects.get': {
		input: TickTickEndpointInputSchemas.getProject,
		output: TickTickEndpointOutputSchemas.getProject,
	},
	'projects.getMany': {
		input: TickTickEndpointInputSchemas.getUserProjects,
		output: TickTickEndpointOutputSchemas.getUserProjects,
	},
	'projects.getData': {
		input: TickTickEndpointInputSchemas.getProjectWithData,
		output: TickTickEndpointOutputSchemas.getProjectWithData,
	},
	'projects.update': {
		input: TickTickEndpointInputSchemas.updateProject,
		output: TickTickEndpointOutputSchemas.updateProject,
	},
	'tasks.complete': {
		input: TickTickEndpointInputSchemas.completeTask,
		output: TickTickEndpointOutputSchemas.completeTask,
	},
	'tasks.create': {
		input: TickTickEndpointInputSchemas.createTask,
		output: TickTickEndpointOutputSchemas.createTask,
	},
	'tasks.delete': {
		input: TickTickEndpointInputSchemas.deleteTask,
		output: TickTickEndpointOutputSchemas.deleteTask,
	},
	'tasks.get': {
		input: TickTickEndpointInputSchemas.getTask,
		output: TickTickEndpointOutputSchemas.getTask,
	},
	'tasks.update': {
		input: TickTickEndpointInputSchemas.updateTask,
		output: TickTickEndpointOutputSchemas.updateTask,
	},
	'tasks.listAll': {
		input: TickTickEndpointInputSchemas.listAllTasks,
		output: TickTickEndpointOutputSchemas.listAllTasks,
	},
	'oauth.generateAuthUrl': {
		input: TickTickEndpointInputSchemas.generateAuthUrl,
		output: TickTickEndpointOutputSchemas.generateAuthUrl,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tickTickEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const tickTickEndpointMeta = {
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a project and its tasks',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by ID',
	},
	'projects.getMany': {
		riskLevel: 'read',
		description: 'Get all user projects',
	},
	'projects.getData': {
		riskLevel: 'read',
		description: 'Get a project with its tasks',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update project details',
	},
	'tasks.complete': {
		riskLevel: 'write',
		description: 'Mark a task as complete',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a new task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a task',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task by project and ID',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update an existing task',
	},
	'tasks.listAll': {
		riskLevel: 'read',
		description: 'List all open tasks across all user projects',
	},
	'oauth.generateAuthUrl': {
		riskLevel: 'read',
		description: 'Generate TickTick OAuth2 authorization URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tickTickEndpointsNested>;

export const tickTickAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTickTickPlugin<T extends TickTickPluginOptions> = CorsairPlugin<
	'ticktick',
	typeof TickTickSchema,
	typeof tickTickEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTickTickPlugin = BaseTickTickPlugin<TickTickPluginOptions>;

export type ExternalTickTickPlugin<T extends TickTickPluginOptions> =
	BaseTickTickPlugin<T>;

export function ticktick<const T extends TickTickPluginOptions>(
	incomingOptions: TickTickPluginOptions & T = {} as TickTickPluginOptions & T,
): ExternalTickTickPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ticktick',
		authConfig: tickTickAuthConfig,
		oauthConfig: {
			providerName: 'TickTick',
			authUrl: 'https://ticktick.com/oauth/authorize',
			tokenUrl: 'https://ticktick.com/oauth/token',
			scopes: ['tasks:read', 'tasks:write'],
		},
		schema: TickTickSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tickTickEndpointsNested,
		webhooks: {},
		endpointMeta: tickTickEndpointMeta,
		endpointSchemas: tickTickEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TickTickKeyBuilderContext, source) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new AuthMissingError('ticktick', 'oauth_2');
				}

				const creds = await ctx.keys.get_integration_credentials();
				// Hoisted into narrowed locals so the guard below keeps them non-null
				// inside both async closures without non-null assertions
				const clientId = creds.client_id;
				const clientSecret = creds.client_secret;
				if (!clientId || !clientSecret) {
					throw new Error(
						'[auth-missing:ticktick:client_credentials]: TickTick client credentials are missing',
					);
				}

				// Tracked separately so a rotated refresh token returned by TickTick
				// replaces the original for every subsequent refresh
				let currentRefreshToken = refreshToken;

				let result: Awaited<ReturnType<typeof getValidAccessToken>>;
				try {
					result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken: currentRefreshToken,
						clientId,
						clientSecret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:ticktick] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await Promise.all([
							ctx.keys.set_access_token(result.accessToken),
							ctx.keys.set_expires_at(String(result.expiresAt)),
						]);
						if (result.newRefreshToken) {
							currentRefreshToken = result.newRefreshToken;
							await ctx.keys.set_refresh_token(currentRefreshToken);
						}
					} catch (error) {
						throw new Error(
							`[corsair:ticktick] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				// ctx's public type doesn't declare _refreshAuth; this side-channel
				// callback is how core forces a re-auth after a 401 (same pattern as
				// googlemeet/googlecalendar and other OAuth plugins)
				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidAccessToken({
						accessToken: null,
						expiresAt: null,
						refreshToken: currentRefreshToken,
						clientId,
						clientSecret,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					if (freshResult.newRefreshToken) {
						currentRefreshToken = freshResult.newRefreshToken;
						await ctx.keys.set_refresh_token(currentRefreshToken);
					}
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			throw new AuthMissingError('ticktick', 'oauth_2');
		},
	} satisfies InternalTickTickPlugin;
}

export type {
	TickTickEndpointInputs,
	TickTickEndpointOutputs,
} from './endpoints/types';

import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Projects, Tasks, TimeEntries, Workspaces } from './endpoints';
import type {
	ClockifyEndpointInputs,
	ClockifyEndpointOutputs,
} from './endpoints/types';
import {
	ClockifyEndpointInputSchemas,
	ClockifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClockifySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveClockifyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchClockifyTenantWebhook } from './webhooks/tenant-matcher';
import type { ClockifyWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ClockifyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalClockifyPlugin['hooks'];
	webhookHooks?: InternalClockifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clockifyEndpointsNested>;
};

export type ClockifyContext = CorsairPluginContext<
	typeof ClockifySchema,
	ClockifyPluginOptions
>;

export type ClockifyKeyBuilderContext =
	KeyBuilderContext<ClockifyPluginOptions>;

export type ClockifyBoundEndpoints = BindEndpoints<
	typeof clockifyEndpointsNested
>;

type ClockifyEndpoint<K extends keyof ClockifyEndpointOutputs> =
	CorsairEndpoint<
		ClockifyContext,
		ClockifyEndpointInputs[K],
		ClockifyEndpointOutputs[K]
	>;

export type ClockifyEndpoints = {
	workspacesList: ClockifyEndpoint<'workspacesList'>;
	projectsList: ClockifyEndpoint<'projectsList'>;
	tasksList: ClockifyEndpoint<'tasksList'>;
	timeEntriesCreate: ClockifyEndpoint<'timeEntriesCreate'>;
	timeEntriesList: ClockifyEndpoint<'timeEntriesList'>;
};

type ClockifyWebhook<
	K extends keyof ClockifyWebhookOutputs,
	TEvent,
> = CorsairWebhook<ClockifyContext, TEvent, ClockifyWebhookOutputs[K]>;

export type ClockifyWebhooks = {
	example: ClockifyWebhook<'example', ExampleEvent>;
};

export type ClockifyBoundWebhooks = BindWebhooks<ClockifyWebhooks>;

const clockifyEndpointsNested = {
	workspaces: {
		list: Workspaces.list,
	},
	projects: {
		list: Projects.list,
	},
	tasks: {
		list: Tasks.list,
	},
	timeEntries: {
		create: TimeEntries.create,
		list: TimeEntries.list,
	},
} as const;

const clockifyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const clockifyEndpointSchemas = {
	'workspaces.list': {
		input: ClockifyEndpointInputSchemas.workspacesList,
		output: ClockifyEndpointOutputSchemas.workspacesList,
	},
	'projects.list': {
		input: ClockifyEndpointInputSchemas.projectsList,
		output: ClockifyEndpointOutputSchemas.projectsList,
	},
	'tasks.list': {
		input: ClockifyEndpointInputSchemas.tasksList,
		output: ClockifyEndpointOutputSchemas.tasksList,
	},
	'timeEntries.create': {
		input: ClockifyEndpointInputSchemas.timeEntriesCreate,
		output: ClockifyEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.list': {
		input: ClockifyEndpointInputSchemas.timeEntriesList,
		output: ClockifyEndpointOutputSchemas.timeEntriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clockifyEndpointsNested
>;

const clockifyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof clockifyWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clockifyEndpointMeta = {
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List all workspaces',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in a workspace',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks for a project in a workspace',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Create a new time entry',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries in a workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof clockifyEndpointsNested>;

export const clockifyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClockifyPlugin<T extends ClockifyPluginOptions> = CorsairPlugin<
	'clockify',
	typeof ClockifySchema,
	typeof clockifyEndpointsNested,
	typeof clockifyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalClockifyPlugin = BaseClockifyPlugin<ClockifyPluginOptions>;

export type ExternalClockifyPlugin<T extends ClockifyPluginOptions> =
	BaseClockifyPlugin<T>;

export function clockify<const T extends ClockifyPluginOptions>(
	incomingOptions: ClockifyPluginOptions & T = {} as ClockifyPluginOptions & T,
): ExternalClockifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clockify',
		authConfig: clockifyAuthConfig,
		schema: ClockifySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: clockifyEndpointsNested,
		webhooks: clockifyWebhooksNested,
		endpointMeta: clockifyEndpointMeta,
		endpointSchemas: clockifyEndpointSchemas,
		webhookSchemas: clockifyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-clockify-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchClockifyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveClockifyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClockifyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalClockifyPlugin;
}

export type {
	ClockifyEndpointInputs,
	ClockifyEndpointOutputs,
	ProjectsListInput,
	ProjectsListOutput,
	TasksListInput,
	TasksListOutput,
	TimeEntriesCreateInput,
	TimeEntriesCreateOutput,
	TimeEntriesListInput,
	TimeEntriesListOutput,
	WorkspacesListInput,
	WorkspacesListOutput,
} from './endpoints/types';
export type {
	ClockifyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';

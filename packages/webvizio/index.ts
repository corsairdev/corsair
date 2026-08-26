import type {
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Projects, Webhooks } from './endpoints';
import type {
	WebvizioEndpointInputs,
	WebvizioEndpointOutputs,
} from './endpoints/types';
import {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WebvizioSchema } from './schema';
import {
	CommentWebhooks,
	matchWebvizioTenantWebhook,
	ProjectWebhooks,
	TaskWebhooks,
} from './webhooks';
import type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
	TaskCreatedEvent,
	TaskDeletedEvent,
	TaskUpdatedEvent,
	WebvizioWebhookOutputs,
} from './webhooks/types';
import { WebvizioWebhookSchemas } from './webhooks/types';

export type WebvizioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWebvizioPlugin['hooks'];
	webhookHooks?: InternalWebvizioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webvizioEndpointsNested>;
};

export type WebvizioContext = CorsairPluginContext<
	typeof WebvizioSchema,
	WebvizioPluginOptions
>;

export type WebvizioKeyBuilderContext =
	KeyBuilderContext<WebvizioPluginOptions>;

export type WebvizioBoundEndpoints = BindEndpoints<
	typeof webvizioEndpointsNested
>;

type WebvizioEndpoint<
	K extends keyof WebvizioEndpointOutputs,
	Input,
> = CorsairEndpoint<WebvizioContext, Input, WebvizioEndpointOutputs[K]>;

export type WebvizioEndpoints = {
	projectsList: WebvizioEndpoint<
		'projectsList',
		WebvizioEndpointInputs['projectsList']
	>;
	webhooksList: WebvizioEndpoint<
		'webhooksList',
		WebvizioEndpointInputs['webhooksList']
	>;
};

type WebvizioWebhook<
	K extends keyof WebvizioWebhookOutputs,
	TEvent,
> = CorsairWebhook<WebvizioContext, TEvent, WebvizioWebhookOutputs[K]>;

export type WebvizioWebhooks = {
	projectCreated: WebvizioWebhook<'projectCreated', ProjectCreatedEvent>;
	projectUpdated: WebvizioWebhook<'projectUpdated', ProjectUpdatedEvent>;
	projectDeleted: WebvizioWebhook<'projectDeleted', ProjectDeletedEvent>;
	taskCreated: WebvizioWebhook<'taskCreated', TaskCreatedEvent>;
	taskUpdated: WebvizioWebhook<'taskUpdated', TaskUpdatedEvent>;
	taskDeleted: WebvizioWebhook<'taskDeleted', TaskDeletedEvent>;
	commentCreated: WebvizioWebhook<'commentCreated', CommentCreatedEvent>;
	commentDeleted: WebvizioWebhook<'commentDeleted', CommentDeletedEvent>;
};

export type WebvizioBoundWebhooks = BindWebhooks<WebvizioWebhooks>;

const webvizioEndpointsNested = {
	projects: {
		list: Projects.list,
	},
	webhooks: {
		list: Webhooks.list,
	},
} as const;

const webvizioWebhooksNested = {
	projects: {
		projectCreated: ProjectWebhooks.projectCreated,
		projectUpdated: ProjectWebhooks.projectUpdated,
		projectDeleted: ProjectWebhooks.projectDeleted,
	},
	tasks: {
		taskCreated: TaskWebhooks.taskCreated,
		taskUpdated: TaskWebhooks.taskUpdated,
		taskDeleted: TaskWebhooks.taskDeleted,
	},
	comments: {
		commentCreated: CommentWebhooks.commentCreated,
		commentDeleted: CommentWebhooks.commentDeleted,
	},
} as const;

export const webvizioEndpointSchemas = {
	'projects.list': {
		input: WebvizioEndpointInputSchemas.projectsList,
		output: WebvizioEndpointOutputSchemas.projectsList,
	},
	'webhooks.list': {
		input: WebvizioEndpointInputSchemas.webhooksList,
		output: WebvizioEndpointOutputSchemas.webhooksList,
	},
} as const;

const webvizioEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all available Webvizio projects',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all configured Webvizio webhook subscriptions',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof webvizioEndpointsNested>;

export const webvizioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WebvizioPlugin = CorsairPlugin<
	'webvizio',
	typeof WebvizioSchema,
	typeof webvizioEndpointsNested,
	typeof webvizioWebhooksNested,
	WebvizioPluginOptions
>;

export type InternalWebvizioPlugin = CorsairPlugin<
	'webvizio',
	typeof WebvizioSchema,
	typeof webvizioEndpointsNested,
	typeof webvizioWebhooksNested,
	WebvizioPluginOptions
>;

export function webvizio(options: WebvizioPluginOptions = {}): WebvizioPlugin {
	const authType = options.authType || 'api_key';

	return {
		id: 'webvizio',
		authConfig: webvizioAuthConfig,
		schema: WebvizioSchema,
		options: {
			...options,
			authType,
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: webvizioEndpointsNested,
		webhooks: webvizioWebhooksNested,
		endpointMeta: webvizioEndpointMeta,
		endpointSchemas: webvizioEndpointSchemas,
		webhookSchemas: WebvizioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			if ('x-webvizio-signature' in headers || 'x-webvizio-event' in headers) {
				return true;
			}
			const body =
				typeof request.body === 'object' && request.body !== null
					? (request.body as Record<string, unknown>)
					: undefined;
			if (body && typeof body.event === 'string') {
				return (
					body.event.startsWith('project.') ||
					body.event.startsWith('task.') ||
					body.event.startsWith('comment.')
				);
			}
			return false;
		},
		pluginTenantWebhookMatcher: matchWebvizioTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WebvizioKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature?.();
				if (res) return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('webvizio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('webvizio', 'api_key');
		},
	} satisfies InternalWebvizioPlugin;
}

export {
	makeWebvizioRequest,
	WEBVIZIO_MCP_API_BASE,
	WEBVIZIO_WEBHOOK_API_BASE,
	WebvizioAPIError,
} from './client';
export type {
	ProjectsListInput,
	ProjectsListResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebvizioEndpointInputs,
	WebvizioEndpointOutputs,
	WebvizioProjectItem,
	WebvizioWebhookSubscription,
} from './endpoints/types';
export {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
	WebvizioProjectSchema,
	WebvizioWebhookSubscriptionSchema,
} from './endpoints/types';
export { WebvizioProject, WebvizioSchema, WebvizioWebhook } from './schema';
export type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
	TaskCreatedEvent,
	TaskDeletedEvent,
	TaskUpdatedEvent,
	WebvizioWebhookOutputs,
} from './webhooks/types';
export {
	CommentCreatedEventSchema,
	CommentDeletedEventSchema,
	ProjectCreatedEventSchema,
	ProjectDeletedEventSchema,
	ProjectUpdatedEventSchema,
	TaskCreatedEventSchema,
	TaskDeletedEventSchema,
	TaskUpdatedEventSchema,
	WebvizioWebhookSchemas,
} from './webhooks/types';

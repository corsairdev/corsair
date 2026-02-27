import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
	PluginEndpointMeta,
	PluginPermissionsConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { TodoistEndpointInputs, TodoistEndpointOutputs } from './endpoints/types';
import { todoistEndpointSchemas } from './endpoints/types';
import type {
	TodoistWebhookOutputs,
} from './webhooks/types';
import {
	Comments,
	Labels,
	Projects,
	Reminders,
	Sections,
	Tasks,
} from './endpoints';
import { TodoistSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

/**
 * Plugin options type - configure authentication and behavior
 * 
 * AUTH CONFIGURATION:
 * - authType: The authentication method to use. Options:
 *   - 'api_key': For API key authentication (most common)
 *   - 'oauth_2': For OAuth 2.0 authentication
 *   - 'bot_token': For bot token authentication
 *   Update PickAuth<'api_key'> to include all auth types your plugin supports.
 *   Example: PickAuth<'api_key' | 'oauth_2'> for plugins that support both.
 * 
 * - key: Optional API key to use directly (bypasses key manager)
 * - webhookSecret: Optional webhook secret for signature verification
 */
export type TodoistPluginOptions = {
	// TODO: Update authType to match your plugin's supported auth methods
	// Example: PickAuth<'api_key' | 'oauth_2'> if you support OAuth
	authType?: PickAuth<'api_key'>;
	// Optional: Direct API key (overrides key manager)
	key?: string;
	// Optional: Webhook secret for signature verification
	webhookSecret?: string;
	// Optional: Lifecycle hooks for endpoints
	hooks?: InternalTodoistPlugin['hooks'];
	// Optional: Lifecycle hooks for webhooks
	webhookHooks?: InternalTodoistPlugin['webhookHooks'];
	// Optional: Custom error handlers (merged with default error handlers)
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Todoist plugin.
	 * Controls what the AI agent is allowed to do via the MCP server.
	 * Overrides use dot-notation paths from the Todoist endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof todoistEndpointsNested>;
};

export type TodoistContext = CorsairPluginContext<
	typeof TodoistSchema,
	TodoistPluginOptions
>;

export type TodoistKeyBuilderContext = KeyBuilderContext<TodoistPluginOptions>;

export type TodoistBoundEndpoints = BindEndpoints<typeof todoistEndpointsNested>;

type TodoistEndpoint<
	K extends keyof TodoistEndpointOutputs,
> = CorsairEndpoint<
	TodoistContext,
	TodoistEndpointInputs[K],
	TodoistEndpointOutputs[K]
>;

export type TodoistEndpoints = {
	tasksClose: TodoistEndpoint<'tasksClose'>;
	tasksCreate: TodoistEndpoint<'tasksCreate'>;
	tasksDelete: TodoistEndpoint<'tasksDelete'>;
	tasksGet: TodoistEndpoint<'tasksGet'>;
	tasksGetMany: TodoistEndpoint<'tasksGetMany'>;
	tasksMove: TodoistEndpoint<'tasksMove'>;
	tasksQuickAdd: TodoistEndpoint<'tasksQuickAdd'>;
	tasksReopen: TodoistEndpoint<'tasksReopen'>;
	tasksUpdate: TodoistEndpoint<'tasksUpdate'>;
	projectsArchive: TodoistEndpoint<'projectsArchive'>;
	projectsCreate: TodoistEndpoint<'projectsCreate'>;
	projectsDelete: TodoistEndpoint<'projectsDelete'>;
	projectsGet: TodoistEndpoint<'projectsGet'>;
	projectsGetCollaborators: TodoistEndpoint<'projectsGetCollaborators'>;
	projectsGetMany: TodoistEndpoint<'projectsGetMany'>;
	projectsUnarchive: TodoistEndpoint<'projectsUnarchive'>;
	projectsUpdate: TodoistEndpoint<'projectsUpdate'>;
	sectionsCreate: TodoistEndpoint<'sectionsCreate'>;
	sectionsDelete: TodoistEndpoint<'sectionsDelete'>;
	sectionsGet: TodoistEndpoint<'sectionsGet'>;
	sectionsGetMany: TodoistEndpoint<'sectionsGetMany'>;
	sectionsUpdate: TodoistEndpoint<'sectionsUpdate'>;
	commentsCreate: TodoistEndpoint<'commentsCreate'>;
	commentsDelete: TodoistEndpoint<'commentsDelete'>;
	commentsGet: TodoistEndpoint<'commentsGet'>;
	commentsGetMany: TodoistEndpoint<'commentsGetMany'>;
	commentsUpdate: TodoistEndpoint<'commentsUpdate'>;
	labelsCreate: TodoistEndpoint<'labelsCreate'>;
	labelsDelete: TodoistEndpoint<'labelsDelete'>;
	labelsGet: TodoistEndpoint<'labelsGet'>;
	labelsGetMany: TodoistEndpoint<'labelsGetMany'>;
	labelsUpdate: TodoistEndpoint<'labelsUpdate'>;
	remindersCreate: TodoistEndpoint<'remindersCreate'>;
	remindersDelete: TodoistEndpoint<'remindersDelete'>;
	remindersGetMany: TodoistEndpoint<'remindersGetMany'>;
	remindersUpdate: TodoistEndpoint<'remindersUpdate'>;
};

type TodoistWebhook<
	K extends keyof TodoistWebhookOutputs,
	TEvent,
> = CorsairWebhook<TodoistContext, TEvent, TodoistWebhookOutputs[K]>;

export type TodoistWebhooks = {
	example: TodoistWebhook<'example', TodoistWebhookOutputs['example']>;
};

export type TodoistBoundWebhooks = BindWebhooks<TodoistWebhooks>;

const todoistEndpointsNested = {
	tasks: {
		close: Tasks.close,
		create: Tasks.create,
		delete: Tasks.delete,
		get: Tasks.get,
		getMany: Tasks.getMany,
		move: Tasks.move,
		quickAdd: Tasks.quickAdd,
		reopen: Tasks.reopen,
		update: Tasks.update,
	},
	projects: {
		archive: Projects.archive,
		create: Projects.create,
		delete: Projects.delete,
		get: Projects.get,
		getCollaborators: Projects.getCollaborators,
		getMany: Projects.getMany,
		unarchive: Projects.unarchive,
		update: Projects.update,
	},
	sections: {
		create: Sections.create,
		delete: Sections.delete,
		get: Sections.get,
		getMany: Sections.getMany,
		update: Sections.update,
	},
	comments: {
		create: Comments.create,
		delete: Comments.delete,
		get: Comments.get,
		getMany: Comments.getMany,
		update: Comments.update,
	},
	labels: {
		create: Labels.create,
		delete: Labels.delete,
		get: Labels.get,
		getMany: Labels.getMany,
		update: Labels.update,
	},
	reminders: {
		create: Reminders.create,
		delete: Reminders.delete,
		getMany: Reminders.getMany,
		update: Reminders.update,
	},
} as const;

const todoistWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

/**
 * Default authentication type for this plugin
 * 
 * AUTH CONFIGURATION:
 * Change this to match your plugin's default auth method:
 * - 'api_key': For API key authentication
 * - 'oauth_2': For OAuth 2.0 authentication  
 * - 'bot_token': For bot token authentication
 */
const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each endpoint.
 * Used by the MCP permission system and get_schema() for endpoint discovery.
 * Keys must be dot-paths matching the endpoint tree (e.g. 'example.get').
 * TODO: Add an entry for every endpoint you add, updating riskLevel and description.
 */
const todoistEndpointMeta = {
	'tasks.close': {
		riskLevel: 'write',
		description: 'Close a Todoist task',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a Todoist task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist task',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a Todoist task by ID',
	},
	'tasks.getMany': {
		riskLevel: 'read',
		description: 'List Todoist tasks with filters',
	},
	'tasks.move': {
		riskLevel: 'write',
		description: 'Move a Todoist task between project or section',
	},
	'tasks.quickAdd': {
		riskLevel: 'write',
		description: 'Quick add a Todoist task using natural language',
	},
	'tasks.reopen': {
		riskLevel: 'write',
		description: 'Reopen a completed Todoist task',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a Todoist task',
	},
	'projects.archive': {
		riskLevel: 'write',
		description: 'Archive a Todoist project',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a Todoist project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist project',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a Todoist project by ID',
	},
	'projects.getCollaborators': {
		riskLevel: 'read',
		description: 'List collaborators for a Todoist project',
	},
	'projects.getMany': {
		riskLevel: 'read',
		description: 'List Todoist projects',
	},
	'projects.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a Todoist project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a Todoist project',
	},
	'sections.create': {
		riskLevel: 'write',
		description: 'Create a Todoist section',
	},
	'sections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist section',
	},
	'sections.get': {
		riskLevel: 'read',
		description: 'Get a Todoist section by ID',
	},
	'sections.getMany': {
		riskLevel: 'read',
		description: 'List Todoist sections for a project',
	},
	'sections.update': {
		riskLevel: 'write',
		description: 'Update a Todoist section',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a Todoist comment',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist comment',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get a Todoist comment by ID',
	},
	'comments.getMany': {
		riskLevel: 'read',
		description: 'List Todoist comments for a task or project',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update a Todoist comment',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a Todoist label',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist label',
	},
	'labels.get': {
		riskLevel: 'read',
		description: 'Get a Todoist label by ID',
	},
	'labels.getMany': {
		riskLevel: 'read',
		description: 'List Todoist labels',
	},
	'labels.update': {
		riskLevel: 'write',
		description: 'Update a Todoist label',
	},
	'reminders.create': {
		riskLevel: 'write',
		description: 'Create a Todoist reminder',
	},
	'reminders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Todoist reminder',
	},
	'reminders.getMany': {
		riskLevel: 'read',
		description: 'List Todoist reminders',
	},
	'reminders.update': {
		riskLevel: 'write',
		description: 'Update a Todoist reminder',
	},
} satisfies PluginEndpointMeta<typeof todoistEndpointsNested>;

/**
 * Authentication configuration
 * 
 * AUTH CONFIGURATION:
 * This defines which auth types are supported and how accounts are structured.
 * 
 * For 'api_key' auth:
 *   - account: ['one'] means single account per plugin instance
 *   - account: ['many'] means multiple accounts per plugin instance
 * 
 * For 'oauth_2' auth:
 *   - account: ['one'] or ['many'] depending on your needs
 *   - You may also need to add 'scopes' configuration
 * 
 * Example for OAuth 2.0:
 * export const todoistAuthConfig = {
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 * 
 * Example for multiple auth types:
 * export const todoistAuthConfig = {
 *   api_key: {
 *     account: ['one'] as const,
 *   },
 *   oauth_2: {
 *     account: ['one'] as const,
 *     scopes: ['read', 'write'] as const,
 *   },
 * } as const satisfies PluginAuthConfig;
 */
export const todoistAuthConfig = {
	api_key: {
		// TODO: Change to ['many'] if you support multiple accounts per instance
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTodoistPlugin<T extends TodoistPluginOptions> = CorsairPlugin<
	'todoist',
	typeof TodoistSchema,
	typeof todoistEndpointsNested,
	typeof todoistWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalTodoistPlugin = BaseTodoistPlugin<TodoistPluginOptions>;

export type ExternalTodoistPlugin<T extends TodoistPluginOptions> =
	BaseTodoistPlugin<T>;

export function todoist<const T extends TodoistPluginOptions>(
	incomingOptions: TodoistPluginOptions & T = {} as TodoistPluginOptions & T,
): ExternalTodoistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'todoist',
		schema: TodoistSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: todoistEndpointsNested,
		webhooks: todoistWebhooksNested,
		endpointMeta: todoistEndpointMeta,
		endpointSchemas: todoistEndpointSchemas,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 * 
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-todoist-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 * 
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-todoist-signature' in headers && 'x-todoist-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update this to match your webhook signature headers
			const hasSignature = 'x-todoist-signature' in headers;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		/**
		 * Key builder function - retrieves the appropriate key/secret for API calls or webhook verification
		 * 
		 * AUTH CONFIGURATION:
		 * This function determines which key to use based on:
		 * - source: 'endpoint' (for API calls) or 'webhook' (for webhook verification)
		 * - ctx.authType: The authentication type being used
		 * 
		 * Priority order:
		 * 1. Direct options (options.key, options.webhookSecret)
		 * 2. Key manager (ctx.keys.get_api_key(), ctx.keys.get_access_token(), etc.)
		 * 
		 * For OAuth 2.0, you'll need to add:
		 * } else if (ctx.authType === 'oauth_2') {
		 *   const res = await ctx.keys.get_access_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 * 
		 * For bot_token, you'll need to add:
		 * } else if (ctx.authType === 'bot_token') {
		 *   const res = await ctx.keys.get_bot_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 */
		keyBuilder: async (ctx: TodoistKeyBuilderContext, source) => {
			// Webhook signature verification - check direct option first
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			// Webhook signature from key manager
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			// Endpoint API calls - check direct option first
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Endpoint API calls - get from key manager based on auth type
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			// TODO: Add support for other auth types if needed
			// Example for OAuth 2.0:
			// } else if (ctx.authType === 'oauth_2') {
			//   const res = await ctx.keys.get_access_token();
			//   if (!res) return '';
			//   return res;
			// }

			return '';
		},
	} satisfies InternalTodoistPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ExampleEvent,
	TodoistWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TodoistEndpointInputs,
	TodoistEndpointOutputs,
} from './endpoints/types';
export { todoistEndpointSchemas } from './endpoints/types';

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
	PluginEndpointMeta,
	PluginPermissionsConfig,
} from 'corsair/core';
import {
	Comments,
	Labels,
	Projects,
	Reminders,
	Sections,
	Tasks,
} from './endpoints';
import type {
	TodoistEndpointInputs,
	TodoistEndpointOutputs,
} from './endpoints/types';
import { todoistEndpointSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TodoistSchema } from './schema';
import { ItemWebhooks, NoteWebhooks, ProjectWebhooks } from './webhooks';
import type {
	ItemAddedEvent,
	ItemCompletedEvent,
	ItemDeletedEvent,
	ItemUncompletedEvent,
	ItemUpdatedEvent,
	NoteAddedEvent,
	NoteDeletedEvent,
	NoteUpdatedEvent,
	ProjectAddedEvent,
	ProjectArchivedEvent,
	ProjectDeletedEvent,
	ProjectUnarchivedEvent,
	ProjectUpdatedEvent,
	TodoistWebhookOutputs,
} from './webhooks/types';

export type TodoistPluginOptions = {
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

export type TodoistBoundEndpoints = BindEndpoints<
	typeof todoistEndpointsNested
>;

type TodoistEndpoint<K extends keyof TodoistEndpointOutputs> = CorsairEndpoint<
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
	itemAdded: TodoistWebhook<'itemAdded', ItemAddedEvent>;
	itemUpdated: TodoistWebhook<'itemUpdated', ItemUpdatedEvent>;
	itemDeleted: TodoistWebhook<'itemDeleted', ItemDeletedEvent>;
	itemCompleted: TodoistWebhook<'itemCompleted', ItemCompletedEvent>;
	itemUncompleted: TodoistWebhook<'itemUncompleted', ItemUncompletedEvent>;
	noteAdded: TodoistWebhook<'noteAdded', NoteAddedEvent>;
	noteUpdated: TodoistWebhook<'noteUpdated', NoteUpdatedEvent>;
	noteDeleted: TodoistWebhook<'noteDeleted', NoteDeletedEvent>;
	projectAdded: TodoistWebhook<'projectAdded', ProjectAddedEvent>;
	projectUpdated: TodoistWebhook<'projectUpdated', ProjectUpdatedEvent>;
	projectDeleted: TodoistWebhook<'projectDeleted', ProjectDeletedEvent>;
	projectArchived: TodoistWebhook<'projectArchived', ProjectArchivedEvent>;
	projectUnarchived: TodoistWebhook<
		'projectUnarchived',
		ProjectUnarchivedEvent
	>;
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
	items: {
		added: ItemWebhooks.added,
		updated: ItemWebhooks.updated,
		deleted: ItemWebhooks.deleted,
		completed: ItemWebhooks.completed,
		uncompleted: ItemWebhooks.uncompleted,
	},
	notes: {
		added: NoteWebhooks.added,
		updated: NoteWebhooks.updated,
		deleted: NoteWebhooks.deleted,
	},
	projects: {
		added: ProjectWebhooks.added,
		updated: ProjectWebhooks.updated,
		deleted: ProjectWebhooks.deleted,
		archived: ProjectWebhooks.archived,
		unarchived: ProjectWebhooks.unarchived,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

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

const todoistWebhookSchemas = {
	'items.added': {
		description: 'A new task was added',
	},
	'items.updated': {
		description: 'A task was updated',
	},
	'items.deleted': {
		description: 'A task was deleted',
	},
	'items.completed': {
		description: 'A task was completed',
	},
	'items.uncompleted': {
		description: 'A completed task was uncompleted',
	},
	'notes.added': {
		description: 'A new note/comment was added',
	},
	'notes.updated': {
		description: 'A note/comment was updated',
	},
	'notes.deleted': {
		description: 'A note/comment was deleted',
	},
	'projects.added': {
		description: 'A new project was created',
	},
	'projects.updated': {
		description: 'A project was updated',
	},
	'projects.deleted': {
		description: 'A project was deleted',
	},
	'projects.archived': {
		description: 'A project was archived',
	},
	'projects.unarchived': {
		description: 'A project was unarchived',
	},
} as const;

export const todoistAuthConfig = {
	api_key: {
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
		webhookSchemas: todoistWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasDeliveryId = 'x-todoist-delivery-id' in headers;
			return hasDeliveryId;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
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

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalTodoistPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ItemAddedEvent,
	ItemCompletedEvent,
	ItemDeletedEvent,
	ItemUncompletedEvent,
	ItemUpdatedEvent,
	NoteAddedEvent,
	NoteDeletedEvent,
	NoteUpdatedEvent,
	ProjectAddedEvent,
	ProjectArchivedEvent,
	ProjectDeletedEvent,
	ProjectUnarchivedEvent,
	ProjectUpdatedEvent,
	TodoistWebhookOutputs,
	TodoistWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TodoistEndpointInputs,
	TodoistEndpointOutputs,
} from './endpoints/types';
export { todoistEndpointSchemas } from './endpoints/types';

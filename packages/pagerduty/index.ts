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
import { IncidentNotes, Incidents, LogEntries, Users } from './endpoints';
import type {
	PagerdutyEndpointInputs,
	PagerdutyEndpointOutputs,
} from './endpoints/types';
import {
	PagerdutyEndpointInputSchemas,
	PagerdutyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PagerdutySchema } from './schema';
import { IncidentWebhooks } from './webhooks';
import type {
	IncidentAcknowledgedEvent,
	IncidentAssignedEvent,
	IncidentResolvedEvent,
	IncidentTriggeredEvent,
	PagerdutyWebhookOutputs,
	PagerdutyWebhookPayloadFor,
} from './webhooks/types';
import {
	IncidentAcknowledgedEventSchema,
	IncidentAssignedEventSchema,
	IncidentResolvedEventSchema,
	IncidentTriggeredEventSchema,
	PagerdutyWebhookPayloadSchema,
} from './webhooks/types';

export type PagerdutyEndpoints = {
	incidentsCreate: PagerdutyEndpoint<
		'incidentsCreate',
		PagerdutyEndpointInputs['incidentsCreate']
	>;
	incidentsGet: PagerdutyEndpoint<
		'incidentsGet',
		PagerdutyEndpointInputs['incidentsGet']
	>;
	incidentsList: PagerdutyEndpoint<
		'incidentsList',
		PagerdutyEndpointInputs['incidentsList']
	>;
	incidentsUpdate: PagerdutyEndpoint<
		'incidentsUpdate',
		PagerdutyEndpointInputs['incidentsUpdate']
	>;
	incidentNotesCreate: PagerdutyEndpoint<
		'incidentNotesCreate',
		PagerdutyEndpointInputs['incidentNotesCreate']
	>;
	incidentNotesList: PagerdutyEndpoint<
		'incidentNotesList',
		PagerdutyEndpointInputs['incidentNotesList']
	>;
	logEntriesGet: PagerdutyEndpoint<
		'logEntriesGet',
		PagerdutyEndpointInputs['logEntriesGet']
	>;
	logEntriesList: PagerdutyEndpoint<
		'logEntriesList',
		PagerdutyEndpointInputs['logEntriesList']
	>;
	usersGet: PagerdutyEndpoint<'usersGet', PagerdutyEndpointInputs['usersGet']>;
};

const pagerdutyEndpointsNested = {
	incidents: {
		create: Incidents.create,
		get: Incidents.get,
		list: Incidents.list,
		update: Incidents.update,
	},
	incidentNotes: {
		create: IncidentNotes.create,
		list: IncidentNotes.list,
	},
	logEntries: {
		get: LogEntries.get,
		list: LogEntries.list,
	},
	users: {
		get: Users.get,
	},
} as const;

export const pagerdutyEndpointSchemas = {
	'incidents.create': {
		input: PagerdutyEndpointInputSchemas.incidentsCreate,
		output: PagerdutyEndpointOutputSchemas.incidentsCreate,
	},
	'incidents.get': {
		input: PagerdutyEndpointInputSchemas.incidentsGet,
		output: PagerdutyEndpointOutputSchemas.incidentsGet,
	},
	'incidents.list': {
		input: PagerdutyEndpointInputSchemas.incidentsList,
		output: PagerdutyEndpointOutputSchemas.incidentsList,
	},
	'incidents.update': {
		input: PagerdutyEndpointInputSchemas.incidentsUpdate,
		output: PagerdutyEndpointOutputSchemas.incidentsUpdate,
	},
	'incidentNotes.create': {
		input: PagerdutyEndpointInputSchemas.incidentNotesCreate,
		output: PagerdutyEndpointOutputSchemas.incidentNotesCreate,
	},
	'incidentNotes.list': {
		input: PagerdutyEndpointInputSchemas.incidentNotesList,
		output: PagerdutyEndpointOutputSchemas.incidentNotesList,
	},
	'logEntries.get': {
		input: PagerdutyEndpointInputSchemas.logEntriesGet,
		output: PagerdutyEndpointOutputSchemas.logEntriesGet,
	},
	'logEntries.list': {
		input: PagerdutyEndpointInputSchemas.logEntriesList,
		output: PagerdutyEndpointOutputSchemas.logEntriesList,
	},
	'users.get': {
		input: PagerdutyEndpointInputSchemas.usersGet,
		output: PagerdutyEndpointOutputSchemas.usersGet,
	},
} as const;

export type PagerdutyWebhooks = {
	incidentTriggered: PagerdutyWebhook<
		'incidentTriggered',
		IncidentTriggeredEvent
	>;
	incidentAcknowledged: PagerdutyWebhook<
		'incidentAcknowledged',
		IncidentAcknowledgedEvent
	>;
	incidentResolved: PagerdutyWebhook<'incidentResolved', IncidentResolvedEvent>;
	incidentAssigned: PagerdutyWebhook<'incidentAssigned', IncidentAssignedEvent>;
};

const pagerdutyWebhooksNested = {
	incidents: {
		triggered: IncidentWebhooks.triggered,
		acknowledged: IncidentWebhooks.acknowledged,
		resolved: IncidentWebhooks.resolved,
		assigned: IncidentWebhooks.assigned,
	},
} as const;

const pagerdutyWebhookSchemas = {
	'incidents.triggered': {
		description: 'An incident was triggered (created)',
		payload: PagerdutyWebhookPayloadSchema,
		response: IncidentTriggeredEventSchema,
	},
	'incidents.acknowledged': {
		description: 'An incident was acknowledged',
		payload: PagerdutyWebhookPayloadSchema,
		response: IncidentAcknowledgedEventSchema,
	},
	'incidents.resolved': {
		description: 'An incident was resolved',
		payload: PagerdutyWebhookPayloadSchema,
		response: IncidentResolvedEventSchema,
	},
	'incidents.assigned': {
		description: 'An incident was assigned to a user or escalation policy',
		payload: PagerdutyWebhookPayloadSchema,
		response: IncidentAssignedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

const pagerdutyEndpointMeta = {
	'incidents.create': {
		riskLevel: 'write',
		description: 'Create a new incident',
	},
	'incidents.get': {
		riskLevel: 'read',
		description: 'Get a single incident by ID',
	},
	'incidents.list': {
		riskLevel: 'read',
		description: 'List incidents with optional filters',
	},
	'incidents.update': {
		riskLevel: 'write',
		description: 'Update an incident (acknowledge, resolve, reassign)',
	},
	'incidentNotes.create': {
		riskLevel: 'write',
		description: 'Add a note to an incident',
	},
	'incidentNotes.list': {
		riskLevel: 'read',
		description: 'List notes for an incident',
	},
	'logEntries.get': {
		riskLevel: 'read',
		description: 'Get a single log entry by ID',
	},
	'logEntries.list': {
		riskLevel: 'read',
		description: 'List log entries',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a user by ID',
	},
} satisfies RequiredPluginEndpointMeta<typeof pagerdutyEndpointsNested>;

export const pagerdutyAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

type PagerdutyEndpoint<
	K extends keyof PagerdutyEndpointOutputs,
	Input,
> = CorsairEndpoint<PagerdutyContext, Input, PagerdutyEndpointOutputs[K]>;

type PagerdutyWebhook<
	K extends keyof PagerdutyWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	PagerdutyContext,
	PagerdutyWebhookPayloadFor<TEvent>,
	PagerdutyWebhookOutputs[K]
>;

export type PagerdutyBoundEndpoints = BindEndpoints<
	typeof pagerdutyEndpointsNested
>;
export type PagerdutyBoundWebhooks = BindWebhooks<PagerdutyWebhooks>;

export type PagerdutyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPagerdutyPlugin['hooks'];
	webhookHooks?: InternalPagerdutyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pagerdutyEndpointsNested>;
};

export type PagerdutyContext = CorsairPluginContext<
	typeof PagerdutySchema,
	PagerdutyPluginOptions
>;

export type PagerdutyKeyBuilderContext =
	KeyBuilderContext<PagerdutyPluginOptions>;

export type BasePagerdutyPlugin<T extends PagerdutyPluginOptions> =
	CorsairPlugin<
		'pagerduty',
		typeof PagerdutySchema,
		typeof pagerdutyEndpointsNested,
		typeof pagerdutyWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPagerdutyPlugin =
	BasePagerdutyPlugin<PagerdutyPluginOptions>;

export type ExternalPagerdutyPlugin<T extends PagerdutyPluginOptions> =
	BasePagerdutyPlugin<T>;

export function pagerduty<const T extends PagerdutyPluginOptions>(
	incomingOptions: PagerdutyPluginOptions & T = {} as PagerdutyPluginOptions &
		T,
): ExternalPagerdutyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pagerduty',
		schema: PagerdutySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: pagerdutyEndpointsNested,
		webhooks: pagerdutyWebhooksNested,
		endpointMeta: pagerdutyEndpointMeta,
		endpointSchemas: pagerdutyEndpointSchemas,
		webhookSchemas: pagerdutyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-pagerduty-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PagerdutyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

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

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalPagerdutyPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	IncidentAcknowledgedEvent,
	IncidentAssignedEvent,
	IncidentResolvedEvent,
	IncidentTriggeredEvent,
	PagerdutyWebhookIncidentData,
	PagerdutyWebhookOutputs,
	PagerdutyWebhookPayload,
	PagerdutyWebhookPayloadFor,
	PagerdutyWebhookReference,
} from './webhooks/types';

export { createPagerdutyMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	IncidentNotesCreateInput,
	IncidentNotesCreateResponse,
	IncidentNotesListInput,
	IncidentNotesListResponse,
	IncidentsCreateInput,
	IncidentsCreateResponse,
	IncidentsGetInput,
	IncidentsGetResponse,
	IncidentsListInput,
	IncidentsListResponse,
	IncidentsUpdateInput,
	IncidentsUpdateResponse,
	LogEntriesGetInput,
	LogEntriesGetResponse,
	LogEntriesListInput,
	LogEntriesListResponse,
	PagerdutyEndpointInputs,
	PagerdutyEndpointOutputs,
	UsersGetInput,
	UsersGetResponse,
} from './endpoints/types';

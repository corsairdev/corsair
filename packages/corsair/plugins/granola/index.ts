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
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import type { GranolaEndpointInputs, GranolaEndpointOutputs } from './endpoints/types';
import { GranolaEndpointInputSchemas, GranolaEndpointOutputSchemas } from './endpoints/types';
import { Notes, People, Transcripts } from './endpoints';
import { GranolaSchema } from './schema';
import { NoteWebhooks, MeetingWebhooks, TranscriptWebhooks } from './webhooks';
import type {
	GranolaWebhookOutputs,
	NoteCreatedEvent,
	NoteUpdatedEvent,
	NoteDeletedEvent,
	TranscriptReadyEvent,
	MeetingStartedEvent,
	MeetingEndedEvent,
	GranolaWebhookPayload,
} from './webhooks/types';
import {
	NoteCreatedPayloadSchema,
	NoteCreatedEventSchema,
	NoteUpdatedPayloadSchema,
	NoteUpdatedEventSchema,
	NoteDeletedPayloadSchema,
	NoteDeletedEventSchema,
	TranscriptReadyPayloadSchema,
	TranscriptReadyEventSchema,
	MeetingStartedPayloadSchema,
	MeetingStartedEventSchema,
	MeetingEndedPayloadSchema,
	MeetingEndedEventSchema,
} from './webhooks/types';
import { errorHandlers } from './error-handlers';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint types
// ─────────────────────────────────────────────────────────────────────────────

type GranolaEndpoint<K extends keyof GranolaEndpointOutputs> = CorsairEndpoint<
	GranolaContext,
	GranolaEndpointInputs[K],
	GranolaEndpointOutputs[K]
>;

export type GranolaEndpoints = {
	notesGet: GranolaEndpoint<'notesGet'>;
	notesList: GranolaEndpoint<'notesList'>;
	notesCreate: GranolaEndpoint<'notesCreate'>;
	notesUpdate: GranolaEndpoint<'notesUpdate'>;
	notesDelete: GranolaEndpoint<'notesDelete'>;
	peopleGet: GranolaEndpoint<'peopleGet'>;
	peopleList: GranolaEndpoint<'peopleList'>;
	peopleCreate: GranolaEndpoint<'peopleCreate'>;
	peopleUpdate: GranolaEndpoint<'peopleUpdate'>;
	transcriptsGet: GranolaEndpoint<'transcriptsGet'>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook types
// ─────────────────────────────────────────────────────────────────────────────

type GranolaWebhook<
	K extends keyof GranolaWebhookOutputs,
	TEvent,
> = CorsairWebhook<GranolaContext, TEvent, GranolaWebhookOutputs[K]>;

export type GranolaWebhooks = {
	noteCreated: GranolaWebhook<'noteCreated', NoteCreatedEvent>;
	noteUpdated: GranolaWebhook<'noteUpdated', NoteUpdatedEvent>;
	noteDeleted: GranolaWebhook<'noteDeleted', NoteDeletedEvent>;
	transcriptReady: GranolaWebhook<'transcriptReady', TranscriptReadyEvent>;
	meetingStarted: GranolaWebhook<'meetingStarted', MeetingStartedEvent>;
	meetingEnded: GranolaWebhook<'meetingEnded', MeetingEndedEvent>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin options
// ─────────────────────────────────────────────────────────────────────────────

export type GranolaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGranolaPlugin['hooks'];
	webhookHooks?: InternalGranolaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Granola plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Granola endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof granolaEndpointsNested>;
};

export type GranolaContext = CorsairPluginContext<typeof GranolaSchema, GranolaPluginOptions>;

export type GranolaKeyBuilderContext = KeyBuilderContext<GranolaPluginOptions>;

export type GranolaBoundEndpoints = BindEndpoints<typeof granolaEndpointsNested>;
export type GranolaBoundWebhooks = BindWebhooks<GranolaWebhooks>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint tree
// ─────────────────────────────────────────────────────────────────────────────

const granolaEndpointsNested = {
	notes: {
		get: Notes.get,
		list: Notes.list,
		create: Notes.create,
		update: Notes.update,
		delete: Notes.deleteNote,
	},
	people: {
		get: People.get,
		list: People.list,
		create: People.create,
		update: People.update,
	},
	transcripts: {
		get: Transcripts.get,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook tree
// ─────────────────────────────────────────────────────────────────────────────

const granolaWebhooksNested = {
	notes: {
		created: NoteWebhooks.created,
		updated: NoteWebhooks.updated,
		deleted: NoteWebhooks.deleted,
	},
	transcripts: {
		ready: TranscriptWebhooks.ready,
	},
	meetings: {
		started: MeetingWebhooks.started,
		ended: MeetingWebhooks.ended,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schemas
// ─────────────────────────────────────────────────────────────────────────────

export const granolaEndpointSchemas = {
	'notes.get': {
		input: GranolaEndpointInputSchemas.notesGet,
		output: GranolaEndpointOutputSchemas.notesGet,
	},
	'notes.list': {
		input: GranolaEndpointInputSchemas.notesList,
		output: GranolaEndpointOutputSchemas.notesList,
	},
	'notes.create': {
		input: GranolaEndpointInputSchemas.notesCreate,
		output: GranolaEndpointOutputSchemas.notesCreate,
	},
	'notes.update': {
		input: GranolaEndpointInputSchemas.notesUpdate,
		output: GranolaEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: GranolaEndpointInputSchemas.notesDelete,
		output: GranolaEndpointOutputSchemas.notesDelete,
	},
	'people.get': {
		input: GranolaEndpointInputSchemas.peopleGet,
		output: GranolaEndpointOutputSchemas.peopleGet,
	},
	'people.list': {
		input: GranolaEndpointInputSchemas.peopleList,
		output: GranolaEndpointOutputSchemas.peopleList,
	},
	'people.create': {
		input: GranolaEndpointInputSchemas.peopleCreate,
		output: GranolaEndpointOutputSchemas.peopleCreate,
	},
	'people.update': {
		input: GranolaEndpointInputSchemas.peopleUpdate,
		output: GranolaEndpointOutputSchemas.peopleUpdate,
	},
	'transcripts.get': {
		input: GranolaEndpointInputSchemas.transcriptsGet,
		output: GranolaEndpointOutputSchemas.transcriptsGet,
	},
} satisfies RequiredPluginEndpointSchemas<typeof granolaEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint metadata (risk levels)
// ─────────────────────────────────────────────────────────────────────────────

const granolaEndpointMeta = {
	'notes.get': { riskLevel: 'read', description: 'Get a meeting note by ID' },
	'notes.list': { riskLevel: 'read', description: 'List all meeting notes' },
	'notes.create': { riskLevel: 'write', description: 'Create a new meeting note' },
	'notes.update': { riskLevel: 'write', description: 'Update an existing meeting note' },
	'notes.delete': { riskLevel: 'destructive', description: 'Delete a meeting note [DESTRUCTIVE]' },
	'people.get': { riskLevel: 'read', description: 'Get a person by ID' },
	'people.list': { riskLevel: 'read', description: 'List all people' },
	'people.create': { riskLevel: 'write', description: 'Create a new person record' },
	'people.update': { riskLevel: 'write', description: 'Update an existing person record' },
	'transcripts.get': { riskLevel: 'read', description: 'Get the transcript for a meeting note' },
} satisfies RequiredPluginEndpointMeta<typeof granolaEndpointsNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook schemas
// ─────────────────────────────────────────────────────────────────────────────

const granolaWebhookSchemas = {
	'notes.created': {
		description: 'A new meeting note was created',
		payload: NoteCreatedPayloadSchema,
		response: NoteCreatedEventSchema,
	},
	'notes.updated': {
		description: 'A meeting note was updated',
		payload: NoteUpdatedPayloadSchema,
		response: NoteUpdatedEventSchema,
	},
	'notes.deleted': {
		description: 'A meeting note was deleted',
		payload: NoteDeletedPayloadSchema,
		response: NoteDeletedEventSchema,
	},
	'transcripts.ready': {
		description: 'A meeting transcript is ready',
		payload: TranscriptReadyPayloadSchema,
		response: TranscriptReadyEventSchema,
	},
	'meetings.started': {
		description: 'A meeting has started',
		payload: MeetingStartedPayloadSchema,
		response: MeetingStartedEventSchema,
	},
	'meetings.ended': {
		description: 'A meeting has ended',
		payload: MeetingEndedPayloadSchema,
		response: MeetingEndedEventSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof granolaWebhooksNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth config
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'api_key' as const;

export const granolaAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin type definitions
// ─────────────────────────────────────────────────────────────────────────────

export type BaseGranolaPlugin<T extends GranolaPluginOptions> = CorsairPlugin<
	'granola',
	typeof GranolaSchema,
	typeof granolaEndpointsNested,
	typeof granolaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGranolaPlugin = BaseGranolaPlugin<GranolaPluginOptions>;

export type ExternalGranolaPlugin<T extends GranolaPluginOptions> = BaseGranolaPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin factory
// ─────────────────────────────────────────────────────────────────────────────

export function granola<const T extends GranolaPluginOptions>(
	incomingOptions: GranolaPluginOptions & T = {} as GranolaPluginOptions & T,
): ExternalGranolaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'granola',
		schema: GranolaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: granolaEndpointsNested,
		webhooks: granolaWebhooksNested,
		endpointMeta: granolaEndpointMeta,
		endpointSchemas: granolaEndpointSchemas,
		webhookSchemas: granolaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-granola-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GranolaKeyBuilderContext, source) => {
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
	} satisfies InternalGranolaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook type exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GranolaWebhookOutputs,
	GranolaWebhookPayload,
	NoteCreatedEvent,
	NoteUpdatedEvent,
	NoteDeletedEvent,
	TranscriptReadyEvent,
	MeetingStartedEvent,
	MeetingEndedEvent,
} from './webhooks/types';

export { createGranolaMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint type exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GranolaEndpointInputs,
	GranolaEndpointOutputs,
	NotesGetResponse,
	NotesListResponse,
	NotesCreateResponse,
	NotesUpdateResponse,
	NotesDeleteResponse,
	PeopleGetResponse,
	PeopleListResponse,
	PeopleCreateResponse,
	PeopleUpdateResponse,
	TranscriptsGetResponse,
} from './endpoints/types';

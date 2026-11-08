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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { FoldersEndpoints, MeetingsEndpoints } from './endpoints';
import type {
	TldvEndpointInputs,
	TldvEndpointOutputs,
} from './endpoints/types';
import {
	TldvEndpointInputSchemas,
	TldvEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TldvSchema } from './schema';
import { MeetingsWebhooks, TranscriptsWebhooks } from './webhooks';
import { matchTldvTenantWebhook } from './webhooks/tenant-matcher';
import type { TldvWebhookOutputs } from './webhooks/types';
import {
	MeetingReadyEventSchema,
	TranscriptReadyEventSchema,
} from './webhooks/types';

export type TldvPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Shared secret compared against the `x-corsair-webhook-secret` header on
	 * incoming deliveries. tl;dv does not sign webhooks, so without this the
	 * plugin refuses every delivery.
	 */
	webhookSecret?: string;
	hooks?: InternalTldvPlugin['hooks'];
	webhookHooks?: InternalTldvPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tldvEndpointsNested>;
};

export type TldvContext = CorsairPluginContext<
	typeof TldvSchema,
	TldvPluginOptions,
	undefined,
	typeof tldvAuthConfig
>;

export type TldvKeyBuilderContext = KeyBuilderContext<
	TldvPluginOptions,
	typeof tldvAuthConfig
>;

export type TldvBoundEndpoints = BindEndpoints<typeof tldvEndpointsNested>;

type TldvEndpoint<K extends keyof TldvEndpointOutputs> = CorsairEndpoint<
	TldvContext,
	TldvEndpointInputs[K],
	TldvEndpointOutputs[K]
>;

export type TldvEndpoints = {
	meetingsList: TldvEndpoint<'meetingsList'>;
	meetingsGet: TldvEndpoint<'meetingsGet'>;
	meetingsTranscript: TldvEndpoint<'meetingsTranscript'>;
	meetingsNotes: TldvEndpoint<'meetingsNotes'>;
	meetingsImport: TldvEndpoint<'meetingsImport'>;
	foldersList: TldvEndpoint<'foldersList'>;
};

type TldvWebhook<K extends keyof TldvWebhookOutputs, TEvent> = CorsairWebhook<
	TldvContext,
	TEvent,
	TldvWebhookOutputs[K]
>;

export type TldvWebhooks = {
	meetings: {
		meetingReady: TldvWebhook<
			'meetingReady',
			TldvWebhookOutputs['meetingReady']
		>;
	};
	transcripts: {
		transcriptReady: TldvWebhook<
			'transcriptReady',
			TldvWebhookOutputs['transcriptReady']
		>;
	};
};

export type TldvBoundWebhooks = BindWebhooks<TldvWebhooks>;

const tldvEndpointsNested = {
	meetings: MeetingsEndpoints,
	folders: FoldersEndpoints,
} as const;

const tldvWebhooksNested = {
	meetings: MeetingsWebhooks,
	transcripts: TranscriptsWebhooks,
} as const;

export const tldvEndpointSchemas = {
	'meetings.list': {
		input: TldvEndpointInputSchemas.meetingsList,
		output: TldvEndpointOutputSchemas.meetingsList,
	},
	'meetings.get': {
		input: TldvEndpointInputSchemas.meetingsGet,
		output: TldvEndpointOutputSchemas.meetingsGet,
	},
	'meetings.transcript': {
		input: TldvEndpointInputSchemas.meetingsTranscript,
		output: TldvEndpointOutputSchemas.meetingsTranscript,
	},
	'meetings.notes': {
		input: TldvEndpointInputSchemas.meetingsNotes,
		output: TldvEndpointOutputSchemas.meetingsNotes,
	},
	'meetings.import': {
		input: TldvEndpointInputSchemas.meetingsImport,
		output: TldvEndpointOutputSchemas.meetingsImport,
	},
	'folders.list': {
		input: TldvEndpointInputSchemas.foldersList,
		output: TldvEndpointOutputSchemas.foldersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tldvEndpointsNested>;

const tldvWebhookSchemas = {
	'meetings.meetingReady': {
		description:
			'A meeting finished processing and its transcript and notes exist',
		payload: MeetingReadyEventSchema,
		response: MeetingReadyEventSchema,
	},
	'transcripts.transcriptReady': {
		description: 'A meeting transcript has been generated',
		payload: TranscriptReadyEventSchema,
		response: TranscriptReadyEventSchema,
	},
} as const;

const defaultAuthType: 'api_key' = 'api_key';

export const tldvAuthConfig = {
	api_key: {
		account: ['webhook_signature'] as const,
	},
} as const satisfies PluginAuthConfig;

const tldvEndpointMeta = {
	'meetings.list': {
		riskLevel: 'read',
		description:
			'List meetings with paging, date bounds and folder or type filters',
	},
	'meetings.get': {
		riskLevel: 'read',
		description:
			'Get one meeting by id, including the phone number and metadata an import attached',
	},
	'meetings.transcript': {
		riskLevel: 'read',
		description: 'Get the transcript of one meeting, sentence by sentence',
	},
	'meetings.notes': {
		riskLevel: 'read',
		description: 'Get the AI notes and topics generated for one meeting',
	},
	'meetings.import': {
		riskLevel: 'write',
		description:
			'Import a meeting from a public media URL, which starts a processing job and spends recording minutes',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'Search the folders a user can see, with their meeting ids',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tldvEndpointsNested>;

export type BaseTldvPlugin<T extends TldvPluginOptions> = CorsairPlugin<
	'tldv',
	typeof TldvSchema,
	typeof tldvEndpointsNested,
	typeof tldvWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof tldvAuthConfig
>;

export type InternalTldvPlugin = BaseTldvPlugin<TldvPluginOptions>;

export type ExternalTldvPlugin<T extends TldvPluginOptions> = BaseTldvPlugin<T>;

export function tldv<const T extends TldvPluginOptions>(
	incomingOptions: TldvPluginOptions & T = {} as TldvPluginOptions & T,
): ExternalTldvPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as TldvPluginOptions & T;
	return {
		id: 'tldv',
		authConfig: tldvAuthConfig,
		schema: TldvSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: tldvEndpointsNested,
		webhooks: tldvWebhooksNested,
		endpointMeta: tldvEndpointMeta,
		endpointSchemas: tldvEndpointSchemas,
		webhookSchemas: tldvWebhookSchemas,
		// Both triggers arrive on the same route and are told apart by the
		// `event` field, which the per-webhook matchers already do.
		pluginWebhookMatcher: () => true,
		pluginTenantWebhookMatcher: matchTldvTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint') {
				const stored = await ctx.keys.get_api_key();
				if (stored) return stored;
				throw new AuthMissingError('tldv', 'api_key');
			}
			if (source === 'webhook') {
				// The secret verifies deliveries; it is never an API credential.
				if (options.webhookSecret) return options.webhookSecret;
				// An empty string when nothing is stored: the key builder must return
				// a string, and `verifyTldvWebhook` treats a falsy secret as unset, so
				// the delivery is refused rather than compared against ''.
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}
			throw new AuthMissingError('tldv', 'api_key');
		},
	} satisfies InternalTldvPlugin;
}

export type {
	TldvEndpointInputs,
	TldvEndpointOutputs,
	TldvFolder,
	TldvMeeting,
	TldvNote,
	TldvSentence,
	TldvTopic,
	TldvTranscript,
	TldvUser,
} from './endpoints/types';
export type {
	TldvMeetingReadyData,
	TldvMeetingReadyEvent,
	TldvTranscriptReadyEvent,
	TldvWebhookOutputs,
} from './webhooks/types';

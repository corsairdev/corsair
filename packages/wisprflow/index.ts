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
import { Tokens, Transcriptions } from './endpoints';
import type {
	WisprFlowEndpointInputs,
	WisprFlowEndpointOutputs,
} from './endpoints/types';
import {
	WisprFlowEndpointInputSchemas,
	WisprFlowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WisprFlowSchema } from './schema';

export type WisprFlowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWisprFlowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wisprFlowEndpointsNested>;
};

export type WisprFlowContext = CorsairPluginContext<
	typeof WisprFlowSchema,
	WisprFlowPluginOptions
>;

export type WisprFlowKeyBuilderContext =
	KeyBuilderContext<WisprFlowPluginOptions>;

export type WisprFlowBoundEndpoints = BindEndpoints<
	typeof wisprFlowEndpointsNested
>;

type WisprFlowEndpoint<K extends keyof WisprFlowEndpointOutputs> =
	CorsairEndpoint<
		WisprFlowContext,
		WisprFlowEndpointInputs[K],
		WisprFlowEndpointOutputs[K]
	>;

export type WisprFlowEndpoints = {
	transcriptionsCreate: WisprFlowEndpoint<'transcriptionsCreate'>;
	transcriptionsWarmup: WisprFlowEndpoint<'transcriptionsWarmup'>;
	tokensGenerate: WisprFlowEndpoint<'tokensGenerate'>;
	tokensRevoke: WisprFlowEndpoint<'tokensRevoke'>;
	tokensRevokeClient: WisprFlowEndpoint<'tokensRevokeClient'>;
};

const wisprFlowEndpointsNested = {
	transcriptions: {
		create: Transcriptions.create,
		warmup: Transcriptions.warmup,
	},
	tokens: {
		generate: Tokens.generate,
		revoke: Tokens.revoke,
		revokeClient: Tokens.revokeClient,
	},
} as const;

export const wisprFlowEndpointSchemas = {
	'transcriptions.create': {
		input: WisprFlowEndpointInputSchemas.transcriptionsCreate,
		output: WisprFlowEndpointOutputSchemas.transcriptionsCreate,
	},
	'transcriptions.warmup': {
		input: WisprFlowEndpointInputSchemas.transcriptionsWarmup,
		output: WisprFlowEndpointOutputSchemas.transcriptionsWarmup,
	},
	'tokens.generate': {
		input: WisprFlowEndpointInputSchemas.tokensGenerate,
		output: WisprFlowEndpointOutputSchemas.tokensGenerate,
	},
	'tokens.revoke': {
		input: WisprFlowEndpointInputSchemas.tokensRevoke,
		output: WisprFlowEndpointOutputSchemas.tokensRevoke,
	},
	'tokens.revokeClient': {
		input: WisprFlowEndpointInputSchemas.tokensRevokeClient,
		output: WisprFlowEndpointOutputSchemas.tokensRevokeClient,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof wisprFlowEndpointsNested
>;

const wisprFlowEndpointMeta = {
	'transcriptions.create': {
		riskLevel: 'write',
		description:
			'Transcribe base64 16kHz PCM16 WAV audio into formatted text. Billed per generated token',
	},
	'transcriptions.warmup': {
		riskLevel: 'read',
		description:
			'Warm the API connection before a dictation session to cut first-request latency',
	},
	'tokens.generate': {
		riskLevel: 'write',
		description:
			'Create a short-lived client JWT so a browser or app can call the client-side API without the org key',
	},
	'tokens.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke one client JWT so it stops working immediately',
	},
	'tokens.revokeClient': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke every client JWT issued to a client_id',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof wisprFlowEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const wisprFlowAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseWisprFlowPlugin<T extends WisprFlowPluginOptions> =
	CorsairPlugin<
		'wisprflow',
		typeof WisprFlowSchema,
		typeof wisprFlowEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalWisprFlowPlugin =
	BaseWisprFlowPlugin<WisprFlowPluginOptions>;

export type ExternalWisprFlowPlugin<T extends WisprFlowPluginOptions> =
	BaseWisprFlowPlugin<T>;

export function wisprflow<const T extends WisprFlowPluginOptions>(
	// Safe: every WisprFlowPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: WisprFlowPluginOptions & T = {} as WisprFlowPluginOptions &
		T,
): ExternalWisprFlowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wisprflow',
		authConfig: wisprFlowAuthConfig,
		schema: WisprFlowSchema,
		options,
		hooks: options.hooks,
		endpoints: wisprFlowEndpointsNested,
		webhooks: {},
		endpointMeta: wisprFlowEndpointMeta,
		endpointSchemas: wisprFlowEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WisprFlowKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			return (await ctx.keys.get_api_key()) ?? '';
		},
	} satisfies InternalWisprFlowPlugin;
}

export type {
	CreateTranscriptionInput,
	GenerateTokenInput,
	GenerateTokenResponse,
	RevokeClientTokensInput,
	RevokeResponse,
	RevokeTokenInput,
	Transcription,
	WarmupInput,
	WarmupResponse,
	WisprFlowEndpointInputs,
	WisprFlowEndpointOutputs,
} from './endpoints/types';

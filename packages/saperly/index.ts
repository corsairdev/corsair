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
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	Assistant,
	Calls,
	Connections,
	Consent,
	Health,
	Keys,
	Languages,
	Messages,
	Numbers,
	Pricing,
	Usage,
	Voices,
} from './endpoints';
import type {
	SaperlyEndpointInputs,
	SaperlyEndpointOutputs,
} from './endpoints/types';
import {
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SaperlySchema } from './schema';
import type { ConfirmedDelivery, DeliveryEnvelope } from './webhooks';
import {
	ConfirmedDeliverySchema,
	DeliveryEnvelopeSchema,
	SaperlyWebhooks as saperlyWebhookHandlers,
} from './webhooks';
import { matchSaperlyTenantWebhook } from './webhooks/tenant-matcher';

export type SaperlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	baseUrl?: string;
	hooks?: InternalSaperlyPlugin['hooks'];
	webhookHooks?: InternalSaperlyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof saperlyEndpointsNested>;
};

export const saperlyAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type SaperlyContext = CorsairPluginContext<
	typeof SaperlySchema,
	SaperlyPluginOptions,
	undefined,
	typeof saperlyAuthConfig
>;

export type SaperlyKeyBuilderContext = KeyBuilderContext<
	SaperlyPluginOptions,
	typeof saperlyAuthConfig
>;

export type SaperlyBoundEndpoints = BindEndpoints<
	typeof saperlyEndpointsNested
>;

type SaperlyEndpoint<K extends keyof SaperlyEndpointOutputs> = CorsairEndpoint<
	SaperlyContext,
	SaperlyEndpointInputs[K],
	SaperlyEndpointOutputs[K]
>;

export type SaperlyEndpoints = {
	listNumbers: SaperlyEndpoint<'listNumbers'>;
	provisionNumber: SaperlyEndpoint<'provisionNumber'>;
	getNumber: SaperlyEndpoint<'getNumber'>;
	releaseNumber: SaperlyEndpoint<'releaseNumber'>;
	assignConnection: SaperlyEndpoint<'assignConnection'>;
	setNumberWebhook: SaperlyEndpoint<'setNumberWebhook'>;
	setSmsSender: SaperlyEndpoint<'setSmsSender'>;
	setCallerId: SaperlyEndpoint<'setCallerId'>;
	listConnections: SaperlyEndpoint<'listConnections'>;
	createConnection: SaperlyEndpoint<'createConnection'>;
	getConnection: SaperlyEndpoint<'getConnection'>;
	updateConnection: SaperlyEndpoint<'updateConnection'>;
	deleteConnection: SaperlyEndpoint<'deleteConnection'>;
	sendMessage: SaperlyEndpoint<'sendMessage'>;
	listMessages: SaperlyEndpoint<'listMessages'>;
	placeCall: SaperlyEndpoint<'placeCall'>;
	listCalls: SaperlyEndpoint<'listCalls'>;
	getCall: SaperlyEndpoint<'getCall'>;
	endCall: SaperlyEndpoint<'endCall'>;
	transferCall: SaperlyEndpoint<'transferCall'>;
	getRecording: SaperlyEndpoint<'getRecording'>;
	getTranscript: SaperlyEndpoint<'getTranscript'>;
	listVoices: SaperlyEndpoint<'listVoices'>;
	listCustomVoices: SaperlyEndpoint<'listCustomVoices'>;
	createCustomVoice: SaperlyEndpoint<'createCustomVoice'>;
	getCustomVoice: SaperlyEndpoint<'getCustomVoice'>;
	deleteCustomVoice: SaperlyEndpoint<'deleteCustomVoice'>;
	listLanguages: SaperlyEndpoint<'listLanguages'>;
	getUsage: SaperlyEndpoint<'getUsage'>;
	listConsent: SaperlyEndpoint<'listConsent'>;
	recordConsent: SaperlyEndpoint<'recordConsent'>;
	revokeConsent: SaperlyEndpoint<'revokeConsent'>;
	checkConsent: SaperlyEndpoint<'checkConsent'>;
	quotePrice: SaperlyEndpoint<'quotePrice'>;
	listKeys: SaperlyEndpoint<'listKeys'>;
	mintKey: SaperlyEndpoint<'mintKey'>;
	revokeKey: SaperlyEndpoint<'revokeKey'>;
	checkHealth: SaperlyEndpoint<'checkHealth'>;
	askAssistant: SaperlyEndpoint<'askAssistant'>;
};

type SaperlyWebhook = CorsairWebhook<
	SaperlyContext,
	DeliveryEnvelope,
	ConfirmedDelivery
>;

export type SaperlyWebhooks = {
	delivery: SaperlyWebhook;
};

export type SaperlyBoundWebhooks = BindWebhooks<SaperlyWebhooks>;

const saperlyEndpointsNested = {
	numbers: {
		list: Numbers.list,
		provision: Numbers.provision,
		get: Numbers.get,
		release: Numbers.release,
		assignConnection: Numbers.assignConnection,
		setWebhook: Numbers.setWebhook,
		setSmsSender: Numbers.setSmsSender,
		setCallerId: Numbers.setCallerId,
	},
	connections: {
		list: Connections.list,
		create: Connections.create,
		get: Connections.get,
		update: Connections.update,
		delete: Connections.remove,
	},
	messages: {
		send: Messages.send,
		list: Messages.list,
	},
	calls: {
		place: Calls.place,
		list: Calls.list,
		get: Calls.get,
		end: Calls.end,
		transfer: Calls.transfer,
		recording: Calls.recording,
		transcript: Calls.transcript,
	},
	voices: {
		list: Voices.list,
	},
	customVoices: {
		list: Voices.listCustom,
		create: Voices.createCustom,
		get: Voices.getCustom,
		delete: Voices.deleteCustom,
	},
	languages: {
		list: Languages.list,
	},
	usage: {
		summary: Usage.summary,
	},
	consent: {
		list: Consent.list,
		record: Consent.record,
		revoke: Consent.revoke,
		check: Consent.check,
	},
	pricing: {
		quote: Pricing.quote,
	},
	keys: {
		list: Keys.list,
		mint: Keys.mint,
		revoke: Keys.revoke,
	},
	health: {
		check: Health.check,
	},
	assistant: {
		answer: Assistant.answer,
	},
} as const;

const saperlyWebhooksNested = {
	events: {
		delivery: saperlyWebhookHandlers.delivery,
	},
} as const;

export const saperlyEndpointSchemas = {
	'numbers.list': {
		input: SaperlyEndpointInputSchemas.listNumbers,
		output: SaperlyEndpointOutputSchemas.listNumbers,
	},
	'numbers.provision': {
		input: SaperlyEndpointInputSchemas.provisionNumber,
		output: SaperlyEndpointOutputSchemas.provisionNumber,
	},
	'numbers.get': {
		input: SaperlyEndpointInputSchemas.getNumber,
		output: SaperlyEndpointOutputSchemas.getNumber,
	},
	'numbers.release': {
		input: SaperlyEndpointInputSchemas.releaseNumber,
		output: SaperlyEndpointOutputSchemas.releaseNumber,
	},
	'numbers.assignConnection': {
		input: SaperlyEndpointInputSchemas.assignConnection,
		output: SaperlyEndpointOutputSchemas.assignConnection,
	},
	'numbers.setWebhook': {
		input: SaperlyEndpointInputSchemas.setNumberWebhook,
		output: SaperlyEndpointOutputSchemas.setNumberWebhook,
	},
	'numbers.setSmsSender': {
		input: SaperlyEndpointInputSchemas.setSmsSender,
		output: SaperlyEndpointOutputSchemas.setSmsSender,
	},
	'numbers.setCallerId': {
		input: SaperlyEndpointInputSchemas.setCallerId,
		output: SaperlyEndpointOutputSchemas.setCallerId,
	},
	'connections.list': {
		input: SaperlyEndpointInputSchemas.listConnections,
		output: SaperlyEndpointOutputSchemas.listConnections,
	},
	'connections.create': {
		input: SaperlyEndpointInputSchemas.createConnection,
		output: SaperlyEndpointOutputSchemas.createConnection,
	},
	'connections.get': {
		input: SaperlyEndpointInputSchemas.getConnection,
		output: SaperlyEndpointOutputSchemas.getConnection,
	},
	'connections.update': {
		input: SaperlyEndpointInputSchemas.updateConnection,
		output: SaperlyEndpointOutputSchemas.updateConnection,
	},
	'connections.delete': {
		input: SaperlyEndpointInputSchemas.deleteConnection,
		output: SaperlyEndpointOutputSchemas.deleteConnection,
	},
	'messages.send': {
		input: SaperlyEndpointInputSchemas.sendMessage,
		output: SaperlyEndpointOutputSchemas.sendMessage,
	},
	'messages.list': {
		input: SaperlyEndpointInputSchemas.listMessages,
		output: SaperlyEndpointOutputSchemas.listMessages,
	},
	'calls.place': {
		input: SaperlyEndpointInputSchemas.placeCall,
		output: SaperlyEndpointOutputSchemas.placeCall,
	},
	'calls.list': {
		input: SaperlyEndpointInputSchemas.listCalls,
		output: SaperlyEndpointOutputSchemas.listCalls,
	},
	'calls.get': {
		input: SaperlyEndpointInputSchemas.getCall,
		output: SaperlyEndpointOutputSchemas.getCall,
	},
	'calls.end': {
		input: SaperlyEndpointInputSchemas.endCall,
		output: SaperlyEndpointOutputSchemas.endCall,
	},
	'calls.transfer': {
		input: SaperlyEndpointInputSchemas.transferCall,
		output: SaperlyEndpointOutputSchemas.transferCall,
	},
	'calls.recording': {
		input: SaperlyEndpointInputSchemas.getRecording,
		output: SaperlyEndpointOutputSchemas.getRecording,
	},
	'calls.transcript': {
		input: SaperlyEndpointInputSchemas.getTranscript,
		output: SaperlyEndpointOutputSchemas.getTranscript,
	},
	'voices.list': {
		input: SaperlyEndpointInputSchemas.listVoices,
		output: SaperlyEndpointOutputSchemas.listVoices,
	},
	'customVoices.list': {
		input: SaperlyEndpointInputSchemas.listCustomVoices,
		output: SaperlyEndpointOutputSchemas.listCustomVoices,
	},
	'customVoices.create': {
		input: SaperlyEndpointInputSchemas.createCustomVoice,
		output: SaperlyEndpointOutputSchemas.createCustomVoice,
	},
	'customVoices.get': {
		input: SaperlyEndpointInputSchemas.getCustomVoice,
		output: SaperlyEndpointOutputSchemas.getCustomVoice,
	},
	'customVoices.delete': {
		input: SaperlyEndpointInputSchemas.deleteCustomVoice,
		output: SaperlyEndpointOutputSchemas.deleteCustomVoice,
	},
	'languages.list': {
		input: SaperlyEndpointInputSchemas.listLanguages,
		output: SaperlyEndpointOutputSchemas.listLanguages,
	},
	'usage.summary': {
		input: SaperlyEndpointInputSchemas.getUsage,
		output: SaperlyEndpointOutputSchemas.getUsage,
	},
	'consent.list': {
		input: SaperlyEndpointInputSchemas.listConsent,
		output: SaperlyEndpointOutputSchemas.listConsent,
	},
	'consent.record': {
		input: SaperlyEndpointInputSchemas.recordConsent,
		output: SaperlyEndpointOutputSchemas.recordConsent,
	},
	'consent.revoke': {
		input: SaperlyEndpointInputSchemas.revokeConsent,
		output: SaperlyEndpointOutputSchemas.revokeConsent,
	},
	'consent.check': {
		input: SaperlyEndpointInputSchemas.checkConsent,
		output: SaperlyEndpointOutputSchemas.checkConsent,
	},
	'pricing.quote': {
		input: SaperlyEndpointInputSchemas.quotePrice,
		output: SaperlyEndpointOutputSchemas.quotePrice,
	},
	'keys.list': {
		input: SaperlyEndpointInputSchemas.listKeys,
		output: SaperlyEndpointOutputSchemas.listKeys,
	},
	'keys.mint': {
		input: SaperlyEndpointInputSchemas.mintKey,
		output: SaperlyEndpointOutputSchemas.mintKey,
	},
	'keys.revoke': {
		input: SaperlyEndpointInputSchemas.revokeKey,
		output: SaperlyEndpointOutputSchemas.revokeKey,
	},
	'health.check': {
		input: SaperlyEndpointInputSchemas.checkHealth,
		output: SaperlyEndpointOutputSchemas.checkHealth,
	},
	'assistant.answer': {
		input: SaperlyEndpointInputSchemas.askAssistant,
		output: SaperlyEndpointOutputSchemas.askAssistant,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof saperlyEndpointsNested
>;

const saperlyWebhookSchemas = {
	'events.delivery': {
		description:
			'Signed call and SMS deliveries. The handler confirms the resource with the API before returning success.',
		payload: DeliveryEnvelopeSchema,
		response: ConfirmedDeliverySchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof saperlyWebhooksNested>;

const saperlyEndpointMeta = {
	'numbers.list': {
		riskLevel: 'read',
		description: 'List phone numbers in the workspace',
	},
	'numbers.provision': {
		riskLevel: 'write',
		description: 'Provision a phone number. Reserves prepaid balance',
	},
	'numbers.get': {
		riskLevel: 'read',
		description: 'Get a phone number by id',
	},
	'numbers.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Release a phone number',
	},
	'numbers.assignConnection': {
		riskLevel: 'write',
		description: 'Bind a connection to a phone number',
	},
	'numbers.setWebhook': {
		riskLevel: 'write',
		description: 'Set the per-number manual-mode brain URL',
	},
	'numbers.setSmsSender': {
		riskLevel: 'write',
		description: 'Set or clear the alphanumeric SMS sender id',
	},
	'numbers.setCallerId': {
		riskLevel: 'write',
		description: 'Set or clear the outbound caller ID name',
	},
	'connections.list': {
		riskLevel: 'read',
		description: 'List connections in the workspace',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a hosted or manual connection',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'Get a connection by id',
	},
	'connections.update': {
		riskLevel: 'write',
		description: 'Update a connection',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a connection',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send an SMS. Billed per segment',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List SMS messages, optionally for one number',
	},
	'calls.place': {
		riskLevel: 'write',
		description: 'Place an outbound call. Reserves prepaid balance',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List calls',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Get a call by id',
	},
	'calls.end': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Hang up a live call',
	},
	'calls.transfer': {
		riskLevel: 'write',
		description: 'Blind-transfer a live call',
	},
	'calls.recording': {
		riskLevel: 'read',
		description: 'Read the call recording download URL',
	},
	'calls.transcript': {
		riskLevel: 'read',
		description: 'Read a call transcript',
	},
	'voices.list': {
		riskLevel: 'read',
		description: 'List in-network voices',
	},
	'customVoices.list': {
		riskLevel: 'read',
		description: 'List custom voices',
	},
	'customVoices.create': {
		riskLevel: 'write',
		description: 'Upload a custom voice sample',
	},
	'customVoices.get': {
		riskLevel: 'read',
		description: 'Get a custom voice by id',
	},
	'customVoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom voice',
	},
	'languages.list': {
		riskLevel: 'read',
		description: 'List supported spoken languages',
	},
	'usage.summary': {
		riskLevel: 'read',
		description: 'Read usage and the prepaid balance',
	},
	'consent.list': {
		riskLevel: 'read',
		description: 'List consent records',
	},
	'consent.record': {
		riskLevel: 'write',
		description: 'Record consent for a contact',
	},
	'consent.revoke': {
		riskLevel: 'destructive',
		description: 'Revoke consent for a contact',
	},
	'consent.check': {
		riskLevel: 'read',
		description: 'Check whether a contact has active consent',
	},
	'pricing.quote': {
		riskLevel: 'read',
		description: 'Quote the monthly and upfront price of a number',
	},
	'keys.list': {
		riskLevel: 'read',
		description: 'List API keys. Requires the admin scope',
	},
	'keys.mint': {
		riskLevel: 'write',
		description: 'Mint a child API key. The plaintext token is returned once',
	},
	'keys.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke an API key',
	},
	'health.check': {
		riskLevel: 'read',
		description: 'Liveness probe',
	},
	'assistant.answer': {
		riskLevel: 'write',
		description: 'Ask the workspace assistant a question',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof saperlyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};
	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

export type BaseSaperlyPlugin<T extends SaperlyPluginOptions> = CorsairPlugin<
	'saperly',
	typeof SaperlySchema,
	typeof saperlyEndpointsNested,
	typeof saperlyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof saperlyAuthConfig
>;

export type InternalSaperlyPlugin = BaseSaperlyPlugin<SaperlyPluginOptions>;

export type ExternalSaperlyPlugin<T extends SaperlyPluginOptions> =
	BaseSaperlyPlugin<T>;

export function saperly<const T extends SaperlyPluginOptions>(
	// Empty options still have to satisfy the caller's T.
	incomingOptions: SaperlyPluginOptions & T = {} as SaperlyPluginOptions & T,
): ExternalSaperlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'saperly',
		schema: SaperlySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: saperlyEndpointsNested,
		webhooks: saperlyWebhooksNested,
		endpointMeta: saperlyEndpointMeta,
		endpointSchemas: saperlyEndpointSchemas,
		webhookSchemas: saperlyWebhookSchemas,
		authConfig: saperlyAuthConfig,
		pluginWebhookMatcher: (request) =>
			Object.keys(request.headers).some(
				(name) => name.toLowerCase() === 'x-saperly-signature',
			),
		pluginTenantWebhookMatcher: matchSaperlyTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SaperlyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys.get_webhook_signature(),
				);
				return secret ?? '';
			}

			if (options.key) return options.key;

			const key = await tryGetStoredKey(() => ctx.keys.get_api_key());
			if (!key) {
				throw new AuthMissingError('saperly', 'api_key');
			}
			return key;
		},
	} satisfies InternalSaperlyPlugin;
}

export { SaperlyAPIError } from './client';
export type {
	ApiToken,
	AssistantAnswer,
	AssistantInput,
	Call,
	Connection,
	Consent,
	ConsentCheck,
	CustomVoice,
	Health,
	Language,
	Message,
	MintedToken,
	PhoneNumber,
	Quote,
	Recording,
	SaperlyEndpointInputs,
	SaperlyEndpointOutputs,
	StatusResult,
	Transcript,
	Usage,
	Voice,
} from './endpoints/types';
export {
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
} from './endpoints/types';

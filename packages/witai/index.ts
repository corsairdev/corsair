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
import {
	Apps,
	Entities,
	Intents,
	Message,
	Traits,
	Utterances,
	Voices,
} from './endpoints';
import type {
	WitAiEndpointInputs,
	WitAiEndpointOutputs,
} from './endpoints/types';
import {
	WitAiEndpointInputSchemas,
	WitAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WitAiSchema } from './schema';

export type WitAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWitAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof witAiEndpointsNested>;
};

export type WitAiContext = CorsairPluginContext<
	typeof WitAiSchema,
	WitAiPluginOptions
>;

export type WitAiKeyBuilderContext = KeyBuilderContext<WitAiPluginOptions>;

export type WitAiBoundEndpoints = BindEndpoints<typeof witAiEndpointsNested>;

type WitAiEndpoint<K extends keyof WitAiEndpointOutputs> = CorsairEndpoint<
	WitAiContext,
	WitAiEndpointInputs[K],
	WitAiEndpointOutputs[K]
>;

export type WitAiEndpoints = {
	// Apps
	appsListApps: WitAiEndpoint<'appsListApps'>;
	appsGetApp: WitAiEndpoint<'appsGetApp'>;
	appsCreateApp: WitAiEndpoint<'appsCreateApp'>;
	appsUpdateApp: WitAiEndpoint<'appsUpdateApp'>;
	appsDeleteApp: WitAiEndpoint<'appsDeleteApp'>;
	appsExportApp: WitAiEndpoint<'appsExportApp'>;
	appsListTags: WitAiEndpoint<'appsListTags'>;
	// Message / Language
	messageGetMessage: WitAiEndpoint<'messageGetMessage'>;
	messageDetectLanguage: WitAiEndpoint<'messageDetectLanguage'>;
	// Intents
	intentsListIntents: WitAiEndpoint<'intentsListIntents'>;
	intentsGetIntent: WitAiEndpoint<'intentsGetIntent'>;
	intentsCreateIntent: WitAiEndpoint<'intentsCreateIntent'>;
	intentsDeleteIntent: WitAiEndpoint<'intentsDeleteIntent'>;
	// Entities
	entitiesListEntities: WitAiEndpoint<'entitiesListEntities'>;
	entitiesGetEntity: WitAiEndpoint<'entitiesGetEntity'>;
	entitiesCreateEntity: WitAiEndpoint<'entitiesCreateEntity'>;
	entitiesDeleteEntity: WitAiEndpoint<'entitiesDeleteEntity'>;
	entitiesAddKeyword: WitAiEndpoint<'entitiesAddKeyword'>;
	entitiesDeleteKeyword: WitAiEndpoint<'entitiesDeleteKeyword'>;
	entitiesAddSynonym: WitAiEndpoint<'entitiesAddSynonym'>;
	entitiesDeleteSynonym: WitAiEndpoint<'entitiesDeleteSynonym'>;
	entitiesDeleteRole: WitAiEndpoint<'entitiesDeleteRole'>;
	// Traits
	traitsListTraits: WitAiEndpoint<'traitsListTraits'>;
	traitsGetTrait: WitAiEndpoint<'traitsGetTrait'>;
	traitsCreateTrait: WitAiEndpoint<'traitsCreateTrait'>;
	traitsDeleteTrait: WitAiEndpoint<'traitsDeleteTrait'>;
	traitsAddValue: WitAiEndpoint<'traitsAddValue'>;
	// Utterances
	utterancesListUtterances: WitAiEndpoint<'utterancesListUtterances'>;
	utterancesCreateUtterances: WitAiEndpoint<'utterancesCreateUtterances'>;
	utterancesDeleteUtterances: WitAiEndpoint<'utterancesDeleteUtterances'>;
	// Voices
	voicesListVoices: WitAiEndpoint<'voicesListVoices'>;
	voicesGetVoice: WitAiEndpoint<'voicesGetVoice'>;
};

const witAiEndpointsNested = {
	apps: {
		listApps: Apps.listApps,
		getApp: Apps.getApp,
		createApp: Apps.createApp,
		updateApp: Apps.updateApp,
		deleteApp: Apps.deleteApp,
		exportApp: Apps.exportApp,
		listTags: Apps.listTags,
	},
	message: {
		getMessage: Message.getMessage,
		detectLanguage: Message.detectLanguage,
	},
	intents: {
		listIntents: Intents.listIntents,
		getIntent: Intents.getIntent,
		createIntent: Intents.createIntent,
		deleteIntent: Intents.deleteIntent,
	},
	entities: {
		listEntities: Entities.listEntities,
		getEntity: Entities.getEntity,
		createEntity: Entities.createEntity,
		deleteEntity: Entities.deleteEntity,
		addKeyword: Entities.addKeyword,
		deleteKeyword: Entities.deleteKeyword,
		addSynonym: Entities.addSynonym,
		deleteSynonym: Entities.deleteSynonym,
		deleteRole: Entities.deleteRole,
	},
	traits: {
		listTraits: Traits.listTraits,
		getTrait: Traits.getTrait,
		createTrait: Traits.createTrait,
		deleteTrait: Traits.deleteTrait,
		addValue: Traits.addValue,
	},
	utterances: {
		listUtterances: Utterances.listUtterances,
		createUtterances: Utterances.createUtterances,
		deleteUtterances: Utterances.deleteUtterances,
	},
	voices: {
		listVoices: Voices.listVoices,
		getVoice: Voices.getVoice,
	},
} as const;

type WitAiEndpointSchemas = RequiredPluginEndpointSchemas<
	typeof witAiEndpointsNested
>;

export const witAiEndpointSchemas: WitAiEndpointSchemas = {
	'apps.listApps': {
		input: WitAiEndpointInputSchemas.appsListApps,
		output: WitAiEndpointOutputSchemas.appsListApps,
	},
	'apps.getApp': {
		input: WitAiEndpointInputSchemas.appsGetApp,
		output: WitAiEndpointOutputSchemas.appsGetApp,
	},
	'apps.createApp': {
		input: WitAiEndpointInputSchemas.appsCreateApp,
		output: WitAiEndpointOutputSchemas.appsCreateApp,
	},
	'apps.updateApp': {
		input: WitAiEndpointInputSchemas.appsUpdateApp,
		output: WitAiEndpointOutputSchemas.appsUpdateApp,
	},
	'apps.deleteApp': {
		input: WitAiEndpointInputSchemas.appsDeleteApp,
		output: WitAiEndpointOutputSchemas.appsDeleteApp,
	},
	'apps.exportApp': {
		input: WitAiEndpointInputSchemas.appsExportApp,
		output: WitAiEndpointOutputSchemas.appsExportApp,
	},
	'apps.listTags': {
		input: WitAiEndpointInputSchemas.appsListTags,
		output: WitAiEndpointOutputSchemas.appsListTags,
	},
	'message.getMessage': {
		input: WitAiEndpointInputSchemas.messageGetMessage,
		output: WitAiEndpointOutputSchemas.messageGetMessage,
	},
	'message.detectLanguage': {
		input: WitAiEndpointInputSchemas.messageDetectLanguage,
		output: WitAiEndpointOutputSchemas.messageDetectLanguage,
	},
	'intents.listIntents': {
		input: WitAiEndpointInputSchemas.intentsListIntents,
		output: WitAiEndpointOutputSchemas.intentsListIntents,
	},
	'intents.getIntent': {
		input: WitAiEndpointInputSchemas.intentsGetIntent,
		output: WitAiEndpointOutputSchemas.intentsGetIntent,
	},
	'intents.createIntent': {
		input: WitAiEndpointInputSchemas.intentsCreateIntent,
		output: WitAiEndpointOutputSchemas.intentsCreateIntent,
	},
	'intents.deleteIntent': {
		input: WitAiEndpointInputSchemas.intentsDeleteIntent,
		output: WitAiEndpointOutputSchemas.intentsDeleteIntent,
	},
	'entities.listEntities': {
		input: WitAiEndpointInputSchemas.entitiesListEntities,
		output: WitAiEndpointOutputSchemas.entitiesListEntities,
	},
	'entities.getEntity': {
		input: WitAiEndpointInputSchemas.entitiesGetEntity,
		output: WitAiEndpointOutputSchemas.entitiesGetEntity,
	},
	'entities.createEntity': {
		input: WitAiEndpointInputSchemas.entitiesCreateEntity,
		output: WitAiEndpointOutputSchemas.entitiesCreateEntity,
	},
	'entities.deleteEntity': {
		input: WitAiEndpointInputSchemas.entitiesDeleteEntity,
		output: WitAiEndpointOutputSchemas.entitiesDeleteEntity,
	},
	'entities.addKeyword': {
		input: WitAiEndpointInputSchemas.entitiesAddKeyword,
		output: WitAiEndpointOutputSchemas.entitiesAddKeyword,
	},
	'entities.deleteKeyword': {
		input: WitAiEndpointInputSchemas.entitiesDeleteKeyword,
		output: WitAiEndpointOutputSchemas.entitiesDeleteKeyword,
	},
	'entities.addSynonym': {
		input: WitAiEndpointInputSchemas.entitiesAddSynonym,
		output: WitAiEndpointOutputSchemas.entitiesAddSynonym,
	},
	'entities.deleteSynonym': {
		input: WitAiEndpointInputSchemas.entitiesDeleteSynonym,
		output: WitAiEndpointOutputSchemas.entitiesDeleteSynonym,
	},
	'entities.deleteRole': {
		input: WitAiEndpointInputSchemas.entitiesDeleteRole,
		output: WitAiEndpointOutputSchemas.entitiesDeleteRole,
	},
	'traits.listTraits': {
		input: WitAiEndpointInputSchemas.traitsListTraits,
		output: WitAiEndpointOutputSchemas.traitsListTraits,
	},
	'traits.getTrait': {
		input: WitAiEndpointInputSchemas.traitsGetTrait,
		output: WitAiEndpointOutputSchemas.traitsGetTrait,
	},
	'traits.createTrait': {
		input: WitAiEndpointInputSchemas.traitsCreateTrait,
		output: WitAiEndpointOutputSchemas.traitsCreateTrait,
	},
	'traits.deleteTrait': {
		input: WitAiEndpointInputSchemas.traitsDeleteTrait,
		output: WitAiEndpointOutputSchemas.traitsDeleteTrait,
	},
	'traits.addValue': {
		input: WitAiEndpointInputSchemas.traitsAddValue,
		output: WitAiEndpointOutputSchemas.traitsAddValue,
	},
	'utterances.listUtterances': {
		input: WitAiEndpointInputSchemas.utterancesListUtterances,
		output: WitAiEndpointOutputSchemas.utterancesListUtterances,
	},
	'utterances.createUtterances': {
		input: WitAiEndpointInputSchemas.utterancesCreateUtterances,
		output: WitAiEndpointOutputSchemas.utterancesCreateUtterances,
	},
	'utterances.deleteUtterances': {
		input: WitAiEndpointInputSchemas.utterancesDeleteUtterances,
		output: WitAiEndpointOutputSchemas.utterancesDeleteUtterances,
	},
	'voices.listVoices': {
		input: WitAiEndpointInputSchemas.voicesListVoices,
		output: WitAiEndpointOutputSchemas.voicesListVoices,
	},
	'voices.getVoice': {
		input: WitAiEndpointInputSchemas.voicesGetVoice,
		output: WitAiEndpointOutputSchemas.voicesGetVoice,
	},
};

const defaultAuthType: AuthTypes = 'api_key' as const;

const witAiEndpointMeta = {
	'apps.listApps': {
		riskLevel: 'read',
		description: 'List all Wit.ai apps for the authenticated user',
	},
	'apps.getApp': {
		riskLevel: 'read',
		description: 'Retrieve metadata and settings of a Wit.ai app',
	},
	'apps.createApp': {
		riskLevel: 'write',
		description: 'Create a new Wit.ai app',
	},
	'apps.updateApp': {
		riskLevel: 'write',
		description: 'Update an existing Wit.ai app',
	},
	'apps.deleteApp': {
		riskLevel: 'destructive',
		description: 'Delete a specific Wit.ai app',
	},
	'apps.exportApp': {
		riskLevel: 'read',
		description: 'Export Wit.ai app data as a ZIP backup',
	},
	'apps.listTags': {
		riskLevel: 'read',
		description: 'List all tag groups (versions) for a Wit.ai app',
	},
	'message.getMessage': {
		riskLevel: 'read',
		description: 'Analyze text to extract intents, entities, and traits',
	},
	'message.detectLanguage': {
		riskLevel: 'read',
		description: 'Detect the language of a given text input',
	},
	'intents.listIntents': {
		riskLevel: 'read',
		description: 'List all intents in the Wit.ai app',
	},
	'intents.getIntent': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific intent',
	},
	'intents.createIntent': {
		riskLevel: 'write',
		description: 'Create a new intent in Wit.ai',
	},
	'intents.deleteIntent': {
		riskLevel: 'destructive',
		description: 'Permanently delete an intent by name',
	},
	'entities.listEntities': {
		riskLevel: 'read',
		description: 'List all entities in the Wit.ai app',
	},
	'entities.getEntity': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific entity',
	},
	'entities.createEntity': {
		riskLevel: 'write',
		description: 'Create a new entity in Wit.ai',
	},
	'entities.deleteEntity': {
		riskLevel: 'destructive',
		description: 'Permanently delete an entity by name',
	},
	'entities.addKeyword': {
		riskLevel: 'write',
		description: 'Add a keyword with optional synonyms to an entity',
	},
	'entities.deleteKeyword': {
		riskLevel: 'destructive',
		description: 'Delete a keyword from an entity',
	},
	'entities.addSynonym': {
		riskLevel: 'write',
		description: 'Add a synonym to a keyword in an entity',
	},
	'entities.deleteSynonym': {
		riskLevel: 'destructive',
		description: 'Delete a synonym from a keyword in an entity',
	},
	'entities.deleteRole': {
		riskLevel: 'destructive',
		description: 'Delete a specific role from an entity',
	},
	'traits.listTraits': {
		riskLevel: 'read',
		description: 'List all traits in the Wit.ai app',
	},
	'traits.getTrait': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific trait',
	},
	'traits.createTrait': {
		riskLevel: 'write',
		description: 'Create a new trait in Wit.ai',
	},
	'traits.deleteTrait': {
		riskLevel: 'destructive',
		description: 'Delete a trait by name',
	},
	'traits.addValue': {
		riskLevel: 'write',
		description: 'Add a new value to an existing trait',
	},
	'utterances.listUtterances': {
		riskLevel: 'read',
		description: 'List training utterances from the Wit.ai app',
	},
	'utterances.createUtterances': {
		riskLevel: 'write',
		description:
			'Add training utterances to the Wit.ai app (rate limit: 200/min)',
	},
	'utterances.deleteUtterances': {
		riskLevel: 'destructive',
		description: 'Delete validated utterances from the Wit.ai app',
	},
	'voices.listVoices': {
		riskLevel: 'read',
		description: 'List all available text-to-speech voices grouped by locale',
	},
	'voices.getVoice': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific text-to-speech voice',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof witAiEndpointsNested>;

export const witAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWitAiPlugin<T extends WitAiPluginOptions> = CorsairPlugin<
	'witai',
	typeof WitAiSchema,
	typeof witAiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalWitAiPlugin = BaseWitAiPlugin<WitAiPluginOptions>;

export type ExternalWitAiPlugin<T extends WitAiPluginOptions> =
	BaseWitAiPlugin<T>;

export function witai<const T extends WitAiPluginOptions>(
	incomingOptions: WitAiPluginOptions & T = {} as WitAiPluginOptions & T,
): ExternalWitAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'witai',
		authConfig: witAiAuthConfig,
		schema: WitAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: witAiEndpointsNested,
		webhooks: {},
		endpointMeta: witAiEndpointMeta,
		endpointSchemas: witAiEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WitAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWitAiPlugin;
}

export type {
	WitAiEndpointInputs,
	WitAiEndpointOutputs,
} from './endpoints/types';

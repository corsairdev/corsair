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
import { AuthMissingError } from 'corsair/core';
import {
	AgentsEndpoints,
	CallsEndpoints,
	ContactsEndpoints,
	KnowledgeBasesEndpoints,
} from './endpoints';
import type {
	SynthflowEndpointInputs,
	SynthflowEndpointOutputs,
} from './endpoints/types';
import {
	SynthflowEndpointInputSchemas,
	SynthflowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SynthflowSchema } from './schema';

export type SynthflowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSynthflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof synthflowEndpointsNested>;
};

export type SynthflowContext = CorsairPluginContext<
	typeof SynthflowSchema,
	SynthflowPluginOptions
>;

export type SynthflowKeyBuilderContext =
	KeyBuilderContext<SynthflowPluginOptions>;

export type SynthflowBoundEndpoints = BindEndpoints<
	typeof synthflowEndpointsNested
>;

type SynthflowEndpoint<K extends keyof SynthflowEndpointOutputs> =
	CorsairEndpoint<
		SynthflowContext,
		SynthflowEndpointInputs[K],
		SynthflowEndpointOutputs[K]
	>;

export type SynthflowEndpoints = {
	agentsCreate: SynthflowEndpoint<'agentsCreate'>;
	agentsList: SynthflowEndpoint<'agentsList'>;
	callsCreate: SynthflowEndpoint<'callsCreate'>;
	callsList: SynthflowEndpoint<'callsList'>;
	contactsCreate: SynthflowEndpoint<'contactsCreate'>;
	knowledgeBasesAttach: SynthflowEndpoint<'knowledgeBasesAttach'>;
};

const synthflowEndpointsNested = {
	agents: {
		create: AgentsEndpoints.create,
		list: AgentsEndpoints.list,
	},
	calls: {
		create: CallsEndpoints.create,
		list: CallsEndpoints.list,
	},
	contacts: {
		create: ContactsEndpoints.create,
	},
	knowledgeBases: {
		attach: KnowledgeBasesEndpoints.attach,
	},
} as const;

const synthflowWebhooksNested = {} as const;

export const synthflowEndpointSchemas = {
	'agents.create': {
		input: SynthflowEndpointInputSchemas.agentsCreate,
		output: SynthflowEndpointOutputSchemas.agentsCreate,
	},
	'agents.list': {
		input: SynthflowEndpointInputSchemas.agentsList,
		output: SynthflowEndpointOutputSchemas.agentsList,
	},
	'calls.create': {
		input: SynthflowEndpointInputSchemas.callsCreate,
		output: SynthflowEndpointOutputSchemas.callsCreate,
	},
	'calls.list': {
		input: SynthflowEndpointInputSchemas.callsList,
		output: SynthflowEndpointOutputSchemas.callsList,
	},
	'contacts.create': {
		input: SynthflowEndpointInputSchemas.contactsCreate,
		output: SynthflowEndpointOutputSchemas.contactsCreate,
	},
	'knowledgeBases.attach': {
		input: SynthflowEndpointInputSchemas.knowledgeBasesAttach,
		output: SynthflowEndpointOutputSchemas.knowledgeBasesAttach,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof synthflowEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const synthflowEndpointMeta = {
	'agents.create': {
		riskLevel: 'write',
		description: 'Create a new Synthflow agent / assistant',
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List Synthflow agents / assistants',
	},
	'calls.create': {
		riskLevel: 'write',
		description: 'Initiate a new phone call using a Synthflow agent',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List calls for a Synthflow agent',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact in Synthflow',
	},
	'knowledgeBases.attach': {
		riskLevel: 'write',
		description: 'Attach a knowledge base to a Synthflow agent model',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof synthflowEndpointsNested
>;

export const synthflowAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSynthflowPlugin<T extends SynthflowPluginOptions> =
	CorsairPlugin<
		'synthflow',
		typeof SynthflowSchema,
		typeof synthflowEndpointsNested,
		typeof synthflowWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSynthflowPlugin =
	BaseSynthflowPlugin<SynthflowPluginOptions>;

export type ExternalSynthflowPlugin<T extends SynthflowPluginOptions> =
	BaseSynthflowPlugin<T>;

export function synthflow<const T extends SynthflowPluginOptions>(
	incomingOptions: SynthflowPluginOptions & T = {} as SynthflowPluginOptions &
		T,
): ExternalSynthflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'synthflow',
		authConfig: synthflowAuthConfig,
		schema: SynthflowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: synthflowEndpointsNested,
		webhooks: synthflowWebhooksNested,
		endpointMeta: synthflowEndpointMeta,
		endpointSchemas: synthflowEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SynthflowKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('synthflow', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('synthflow', 'api_key');
		},
	} satisfies InternalSynthflowPlugin;
}

export type {
	AgentsCreateInput,
	AgentsCreateResponse,
	AgentsListInput,
	AgentsListResponse,
	CallsCreateInput,
	CallsCreateResponse,
	CallsListInput,
	CallsListResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	KnowledgeBasesAttachInput,
	KnowledgeBasesAttachResponse,
	SynthflowEndpointInputs,
	SynthflowEndpointOutputs,
} from './endpoints/types';

export {
	AgentsCreateInputSchema,
	AgentsCreateResponseSchema,
	AgentsListInputSchema,
	AgentsListResponseSchema,
	CallsCreateInputSchema,
	CallsCreateResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
	ContactsCreateInputSchema,
	ContactsCreateResponseSchema,
	KnowledgeBasesAttachInputSchema,
	KnowledgeBasesAttachResponseSchema,
	SynthflowEndpointInputSchemas,
	SynthflowEndpointOutputSchemas,
} from './endpoints/types';

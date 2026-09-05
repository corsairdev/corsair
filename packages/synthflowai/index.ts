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
	ActionsEndpoints,
	AssistantsEndpoints,
	CallsEndpoints,
	ContactsEndpoints,
	KnowledgeBasesEndpoints,
	MemoryStoresEndpoints,
	PhoneBooksEndpoints,
	VoicesEndpoints,
} from './endpoints';
import type {
	SynthflowAiEndpointInputs,
	SynthflowAiEndpointOutputs,
} from './endpoints/types';
import {
	SynthflowAiEndpointInputSchemas,
	SynthflowAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SynthflowAiSchema } from './schema';

export type SynthflowAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSynthflowAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof synthflowaiEndpointsNested>;
};

export type SynthflowAiContext = CorsairPluginContext<
	typeof SynthflowAiSchema,
	SynthflowAiPluginOptions
>;

export type SynthflowAiKeyBuilderContext =
	KeyBuilderContext<SynthflowAiPluginOptions>;

export type SynthflowAiBoundEndpoints = BindEndpoints<
	typeof synthflowaiEndpointsNested
>;

type SynthflowAiEndpoint<K extends keyof SynthflowAiEndpointOutputs> =
	CorsairEndpoint<
		SynthflowAiContext,
		SynthflowAiEndpointInputs[K],
		SynthflowAiEndpointOutputs[K]
	>;

export type SynthflowAiEndpoints = {
	assistantsCreate: SynthflowAiEndpoint<'assistantsCreate'>;
	assistantsList: SynthflowAiEndpoint<'assistantsList'>;
	assistantsGet: SynthflowAiEndpoint<'assistantsGet'>;
	assistantsUpdate: SynthflowAiEndpoint<'assistantsUpdate'>;
	assistantsDelete: SynthflowAiEndpoint<'assistantsDelete'>;
	callsCreate: SynthflowAiEndpoint<'callsCreate'>;
	callsList: SynthflowAiEndpoint<'callsList'>;
	callsGet: SynthflowAiEndpoint<'callsGet'>;
	contactsCreate: SynthflowAiEndpoint<'contactsCreate'>;
	contactsList: SynthflowAiEndpoint<'contactsList'>;
	contactsGet: SynthflowAiEndpoint<'contactsGet'>;
	contactsUpdate: SynthflowAiEndpoint<'contactsUpdate'>;
	contactsDelete: SynthflowAiEndpoint<'contactsDelete'>;
	knowledgeBasesCreate: SynthflowAiEndpoint<'knowledgeBasesCreate'>;
	knowledgeBasesGet: SynthflowAiEndpoint<'knowledgeBasesGet'>;
	knowledgeBasesUpdate: SynthflowAiEndpoint<'knowledgeBasesUpdate'>;
	knowledgeBasesDelete: SynthflowAiEndpoint<'knowledgeBasesDelete'>;
	knowledgeBasesAttach: SynthflowAiEndpoint<'knowledgeBasesAttach'>;
	knowledgeBasesDetach: SynthflowAiEndpoint<'knowledgeBasesDetach'>;
	memoryStoresCreate: SynthflowAiEndpoint<'memoryStoresCreate'>;
	memoryStoresGet: SynthflowAiEndpoint<'memoryStoresGet'>;
	memoryStoresList: SynthflowAiEndpoint<'memoryStoresList'>;
	memoryStoresUpdate: SynthflowAiEndpoint<'memoryStoresUpdate'>;
	memoryStoresDelete: SynthflowAiEndpoint<'memoryStoresDelete'>;
	memoryStoresAttachToAgent: SynthflowAiEndpoint<'memoryStoresAttachToAgent'>;
	memoryStoresDetachFromAgent: SynthflowAiEndpoint<'memoryStoresDetachFromAgent'>;
	phoneBooksCreate: SynthflowAiEndpoint<'phoneBooksCreate'>;
	phoneBooksList: SynthflowAiEndpoint<'phoneBooksList'>;
	phoneBooksDelete: SynthflowAiEndpoint<'phoneBooksDelete'>;
	actionsCreate: SynthflowAiEndpoint<'actionsCreate'>;
	actionsList: SynthflowAiEndpoint<'actionsList'>;
	actionsGet: SynthflowAiEndpoint<'actionsGet'>;
	actionsUpdate: SynthflowAiEndpoint<'actionsUpdate'>;
	actionsDelete: SynthflowAiEndpoint<'actionsDelete'>;
	actionsAttach: SynthflowAiEndpoint<'actionsAttach'>;
	actionsDetach: SynthflowAiEndpoint<'actionsDetach'>;
	voicesList: SynthflowAiEndpoint<'voicesList'>;
};

const synthflowaiEndpointsNested = {
	assistants: {
		create: AssistantsEndpoints.create,
		list: AssistantsEndpoints.list,
		get: AssistantsEndpoints.get,
		update: AssistantsEndpoints.update,
		delete: AssistantsEndpoints.delete,
	},
	calls: {
		create: CallsEndpoints.create,
		list: CallsEndpoints.list,
		get: CallsEndpoints.get,
	},
	contacts: {
		create: ContactsEndpoints.create,
		list: ContactsEndpoints.list,
		get: ContactsEndpoints.get,
		update: ContactsEndpoints.update,
		delete: ContactsEndpoints.delete,
	},
	knowledgeBases: {
		create: KnowledgeBasesEndpoints.create,
		get: KnowledgeBasesEndpoints.get,
		update: KnowledgeBasesEndpoints.update,
		delete: KnowledgeBasesEndpoints.delete,
		attach: KnowledgeBasesEndpoints.attach,
		detach: KnowledgeBasesEndpoints.detach,
	},
	memoryStores: {
		create: MemoryStoresEndpoints.create,
		get: MemoryStoresEndpoints.get,
		list: MemoryStoresEndpoints.list,
		update: MemoryStoresEndpoints.update,
		delete: MemoryStoresEndpoints.delete,
		attachToAgent: MemoryStoresEndpoints.attachToAgent,
		detachFromAgent: MemoryStoresEndpoints.detachFromAgent,
	},
	phoneBooks: {
		create: PhoneBooksEndpoints.create,
		list: PhoneBooksEndpoints.list,
		delete: PhoneBooksEndpoints.delete,
	},
	actions: {
		create: ActionsEndpoints.create,
		list: ActionsEndpoints.list,
		get: ActionsEndpoints.get,
		update: ActionsEndpoints.update,
		delete: ActionsEndpoints.delete,
		attach: ActionsEndpoints.attach,
		detach: ActionsEndpoints.detach,
	},
	voices: {
		list: VoicesEndpoints.list,
	},
} as const;

const synthflowaiWebhooksNested = {} as const;

export const synthflowaiEndpointSchemas = {
	'assistants.create': {
		input: SynthflowAiEndpointInputSchemas.assistantsCreate,
		output: SynthflowAiEndpointOutputSchemas.assistantsCreate,
	},
	'assistants.list': {
		input: SynthflowAiEndpointInputSchemas.assistantsList,
		output: SynthflowAiEndpointOutputSchemas.assistantsList,
	},
	'assistants.get': {
		input: SynthflowAiEndpointInputSchemas.assistantsGet,
		output: SynthflowAiEndpointOutputSchemas.assistantsGet,
	},
	'assistants.update': {
		input: SynthflowAiEndpointInputSchemas.assistantsUpdate,
		output: SynthflowAiEndpointOutputSchemas.assistantsUpdate,
	},
	'assistants.delete': {
		input: SynthflowAiEndpointInputSchemas.assistantsDelete,
		output: SynthflowAiEndpointOutputSchemas.assistantsDelete,
	},
	'calls.create': {
		input: SynthflowAiEndpointInputSchemas.callsCreate,
		output: SynthflowAiEndpointOutputSchemas.callsCreate,
	},
	'calls.list': {
		input: SynthflowAiEndpointInputSchemas.callsList,
		output: SynthflowAiEndpointOutputSchemas.callsList,
	},
	'calls.get': {
		input: SynthflowAiEndpointInputSchemas.callsGet,
		output: SynthflowAiEndpointOutputSchemas.callsGet,
	},
	'contacts.create': {
		input: SynthflowAiEndpointInputSchemas.contactsCreate,
		output: SynthflowAiEndpointOutputSchemas.contactsCreate,
	},
	'contacts.list': {
		input: SynthflowAiEndpointInputSchemas.contactsList,
		output: SynthflowAiEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: SynthflowAiEndpointInputSchemas.contactsGet,
		output: SynthflowAiEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: SynthflowAiEndpointInputSchemas.contactsUpdate,
		output: SynthflowAiEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: SynthflowAiEndpointInputSchemas.contactsDelete,
		output: SynthflowAiEndpointOutputSchemas.contactsDelete,
	},
	'knowledgeBases.create': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesCreate,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesCreate,
	},
	'knowledgeBases.get': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesGet,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesGet,
	},
	'knowledgeBases.update': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesUpdate,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesUpdate,
	},
	'knowledgeBases.delete': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesDelete,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesDelete,
	},
	'knowledgeBases.attach': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesAttach,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesAttach,
	},
	'knowledgeBases.detach': {
		input: SynthflowAiEndpointInputSchemas.knowledgeBasesDetach,
		output: SynthflowAiEndpointOutputSchemas.knowledgeBasesDetach,
	},
	'memoryStores.create': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresCreate,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresCreate,
	},
	'memoryStores.get': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresGet,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresGet,
	},
	'memoryStores.list': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresList,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresList,
	},
	'memoryStores.update': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresUpdate,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresUpdate,
	},
	'memoryStores.delete': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresDelete,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresDelete,
	},
	'memoryStores.attachToAgent': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresAttachToAgent,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresAttachToAgent,
	},
	'memoryStores.detachFromAgent': {
		input: SynthflowAiEndpointInputSchemas.memoryStoresDetachFromAgent,
		output: SynthflowAiEndpointOutputSchemas.memoryStoresDetachFromAgent,
	},
	'phoneBooks.create': {
		input: SynthflowAiEndpointInputSchemas.phoneBooksCreate,
		output: SynthflowAiEndpointOutputSchemas.phoneBooksCreate,
	},
	'phoneBooks.list': {
		input: SynthflowAiEndpointInputSchemas.phoneBooksList,
		output: SynthflowAiEndpointOutputSchemas.phoneBooksList,
	},
	'phoneBooks.delete': {
		input: SynthflowAiEndpointInputSchemas.phoneBooksDelete,
		output: SynthflowAiEndpointOutputSchemas.phoneBooksDelete,
	},
	'actions.create': {
		input: SynthflowAiEndpointInputSchemas.actionsCreate,
		output: SynthflowAiEndpointOutputSchemas.actionsCreate,
	},
	'actions.list': {
		input: SynthflowAiEndpointInputSchemas.actionsList,
		output: SynthflowAiEndpointOutputSchemas.actionsList,
	},
	'actions.get': {
		input: SynthflowAiEndpointInputSchemas.actionsGet,
		output: SynthflowAiEndpointOutputSchemas.actionsGet,
	},
	'actions.update': {
		input: SynthflowAiEndpointInputSchemas.actionsUpdate,
		output: SynthflowAiEndpointOutputSchemas.actionsUpdate,
	},
	'actions.delete': {
		input: SynthflowAiEndpointInputSchemas.actionsDelete,
		output: SynthflowAiEndpointOutputSchemas.actionsDelete,
	},
	'actions.attach': {
		input: SynthflowAiEndpointInputSchemas.actionsAttach,
		output: SynthflowAiEndpointOutputSchemas.actionsAttach,
	},
	'actions.detach': {
		input: SynthflowAiEndpointInputSchemas.actionsDetach,
		output: SynthflowAiEndpointOutputSchemas.actionsDetach,
	},
	'voices.list': {
		input: SynthflowAiEndpointInputSchemas.voicesList,
		output: SynthflowAiEndpointOutputSchemas.voicesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof synthflowaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const synthflowaiEndpointMeta = {
	'assistants.create': {
		riskLevel: 'write',
		description: 'Create a new Synthflow AI assistant',
	},
	'assistants.list': {
		riskLevel: 'read',
		description: 'List all Synthflow AI assistants',
	},
	'assistants.get': {
		riskLevel: 'read',
		description: 'Retrieve details of an existing Synthflow AI assistant',
	},
	'assistants.update': {
		riskLevel: 'write',
		description: "Update a Synthflow AI assistant's settings",
	},
	'assistants.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Synthflow AI assistant',
	},
	'calls.create': {
		riskLevel: 'write',
		description: 'Initiate an outbound voice call via Synthflow AI',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List call history logs for a Synthflow AI model',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Retrieve details and transcript of a phone call',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new contact in Synthflow AI',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts in Synthflow AI',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a contact by ID',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update contact details in Synthflow AI',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact in Synthflow AI',
	},
	'knowledgeBases.create': {
		riskLevel: 'write',
		description: 'Create a new knowledge base in Synthflow AI',
	},
	'knowledgeBases.get': {
		riskLevel: 'read',
		description: 'Get details of a knowledge base by ID',
	},
	'knowledgeBases.update': {
		riskLevel: 'write',
		description: 'Update a knowledge base name or usage conditions',
	},
	'knowledgeBases.delete': {
		riskLevel: 'destructive',
		description: 'Delete a knowledge base in Synthflow AI',
	},
	'knowledgeBases.attach': {
		riskLevel: 'write',
		description: 'Attach a knowledge base to an assistant model',
	},
	'knowledgeBases.detach': {
		riskLevel: 'write',
		description: 'Detach a knowledge base from an assistant model',
	},
	'memoryStores.create': {
		riskLevel: 'write',
		description: 'Create a new memory store in Synthflow AI',
	},
	'memoryStores.get': {
		riskLevel: 'read',
		description: 'Get details of a memory store by ID',
	},
	'memoryStores.list': {
		riskLevel: 'read',
		description: 'List memory stores in Synthflow AI',
	},
	'memoryStores.update': {
		riskLevel: 'write',
		description: "Update a memory store's title and description",
	},
	'memoryStores.delete': {
		riskLevel: 'destructive',
		description: 'Delete a memory store in Synthflow AI',
	},
	'memoryStores.attachToAgent': {
		riskLevel: 'write',
		description: 'Attach a memory store to an assistant agent',
	},
	'memoryStores.detachFromAgent': {
		riskLevel: 'write',
		description: 'Detach a memory store from an assistant agent',
	},
	'phoneBooks.create': {
		riskLevel: 'write',
		description: 'Create a new phone book in Synthflow AI',
	},
	'phoneBooks.list': {
		riskLevel: 'read',
		description: 'List all phone books in the workspace',
	},
	'phoneBooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a phone book in Synthflow AI',
	},
	'actions.create': {
		riskLevel: 'write',
		description: 'Create a new action in Synthflow AI',
	},
	'actions.list': {
		riskLevel: 'read',
		description: 'List all actions in the workspace',
	},
	'actions.get': {
		riskLevel: 'read',
		description: 'Retrieve metadata about a specific action by ID',
	},
	'actions.update': {
		riskLevel: 'write',
		description: 'Update an existing action in Synthflow AI',
	},
	'actions.delete': {
		riskLevel: 'destructive',
		description: 'Delete an action in Synthflow AI',
	},
	'actions.attach': {
		riskLevel: 'write',
		description: 'Attach actions to a Synthflow AI agent',
	},
	'actions.detach': {
		riskLevel: 'write',
		description: 'Detach actions from a Synthflow AI agent',
	},
	'voices.list': {
		riskLevel: 'read',
		description: 'List all text-to-speech voices available in the workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof synthflowaiEndpointsNested
>;

export const synthflowaiAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSynthflowAiPlugin<T extends SynthflowAiPluginOptions> =
	CorsairPlugin<
		'synthflowai',
		typeof SynthflowAiSchema,
		typeof synthflowaiEndpointsNested,
		typeof synthflowaiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSynthflowAiPlugin =
	BaseSynthflowAiPlugin<SynthflowAiPluginOptions>;

export type ExternalSynthflowAiPlugin<T extends SynthflowAiPluginOptions> =
	BaseSynthflowAiPlugin<T>;

export function synthflowai<const T extends SynthflowAiPluginOptions>(
	incomingOptions: SynthflowAiPluginOptions &
		T = {} as SynthflowAiPluginOptions & T,
): ExternalSynthflowAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'synthflowai',
		authConfig: synthflowaiAuthConfig,
		schema: SynthflowAiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: synthflowaiEndpointsNested,
		webhooks: synthflowaiWebhooksNested,
		endpointMeta: synthflowaiEndpointMeta,
		endpointSchemas: synthflowaiEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SynthflowAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('synthflowai', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('synthflowai', 'api_key');
		},
	} satisfies InternalSynthflowAiPlugin;
}

export type {
	ActionsAttachInput,
	ActionsAttachResponse,
	ActionsCreateInput,
	ActionsCreateResponse,
	ActionsDeleteInput,
	ActionsDeleteResponse,
	ActionsDetachInput,
	ActionsDetachResponse,
	ActionsGetInput,
	ActionsGetResponse,
	ActionsListInput,
	ActionsListResponse,
	ActionsUpdateInput,
	ActionsUpdateResponse,
	AssistantsCreateInput,
	AssistantsCreateResponse,
	AssistantsDeleteInput,
	AssistantsDeleteResponse,
	AssistantsGetInput,
	AssistantsGetResponse,
	AssistantsListInput,
	AssistantsListResponse,
	AssistantsUpdateInput,
	AssistantsUpdateResponse,
	CallsCreateInput,
	CallsCreateResponse,
	CallsGetInput,
	CallsGetResponse,
	CallsListInput,
	CallsListResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	KnowledgeBasesAttachInput,
	KnowledgeBasesAttachResponse,
	KnowledgeBasesCreateInput,
	KnowledgeBasesCreateResponse,
	KnowledgeBasesDeleteInput,
	KnowledgeBasesDeleteResponse,
	KnowledgeBasesDetachInput,
	KnowledgeBasesDetachResponse,
	KnowledgeBasesGetInput,
	KnowledgeBasesGetResponse,
	KnowledgeBasesUpdateInput,
	KnowledgeBasesUpdateResponse,
	MemoryStoresAttachToAgentInput,
	MemoryStoresAttachToAgentResponse,
	MemoryStoresCreateInput,
	MemoryStoresCreateResponse,
	MemoryStoresDeleteInput,
	MemoryStoresDeleteResponse,
	MemoryStoresDetachFromAgentInput,
	MemoryStoresDetachFromAgentResponse,
	MemoryStoresGetInput,
	MemoryStoresGetResponse,
	MemoryStoresListInput,
	MemoryStoresListResponse,
	MemoryStoresUpdateInput,
	MemoryStoresUpdateResponse,
	PhoneBooksCreateInput,
	PhoneBooksCreateResponse,
	PhoneBooksDeleteInput,
	PhoneBooksDeleteResponse,
	PhoneBooksListInput,
	PhoneBooksListResponse,
	SynthflowAiEndpointInputs,
	SynthflowAiEndpointOutputs,
	VoicesListInput,
	VoicesListResponse,
} from './endpoints/types';

export {
	ActionsAttachInputSchema,
	ActionsAttachResponseSchema,
	ActionsCreateInputSchema,
	ActionsCreateResponseSchema,
	ActionsDeleteInputSchema,
	ActionsDeleteResponseSchema,
	ActionsDetachInputSchema,
	ActionsDetachResponseSchema,
	ActionsGetInputSchema,
	ActionsGetResponseSchema,
	ActionsListInputSchema,
	ActionsListResponseSchema,
	ActionsUpdateInputSchema,
	ActionsUpdateResponseSchema,
	AssistantsCreateInputSchema,
	AssistantsCreateResponseSchema,
	AssistantsDeleteInputSchema,
	AssistantsDeleteResponseSchema,
	AssistantsGetInputSchema,
	AssistantsGetResponseSchema,
	AssistantsListInputSchema,
	AssistantsListResponseSchema,
	AssistantsUpdateInputSchema,
	AssistantsUpdateResponseSchema,
	CallsCreateInputSchema,
	CallsCreateResponseSchema,
	CallsGetInputSchema,
	CallsGetResponseSchema,
	CallsListInputSchema,
	CallsListResponseSchema,
	ContactsCreateInputSchema,
	ContactsCreateResponseSchema,
	ContactsDeleteInputSchema,
	ContactsDeleteResponseSchema,
	ContactsGetInputSchema,
	ContactsGetResponseSchema,
	ContactsListInputSchema,
	ContactsListResponseSchema,
	ContactsUpdateInputSchema,
	ContactsUpdateResponseSchema,
	KnowledgeBasesAttachInputSchema,
	KnowledgeBasesAttachResponseSchema,
	KnowledgeBasesCreateInputSchema,
	KnowledgeBasesCreateResponseSchema,
	KnowledgeBasesDeleteInputSchema,
	KnowledgeBasesDeleteResponseSchema,
	KnowledgeBasesDetachInputSchema,
	KnowledgeBasesDetachResponseSchema,
	KnowledgeBasesGetInputSchema,
	KnowledgeBasesGetResponseSchema,
	KnowledgeBasesUpdateInputSchema,
	KnowledgeBasesUpdateResponseSchema,
	MemoryStoresAttachToAgentInputSchema,
	MemoryStoresAttachToAgentResponseSchema,
	MemoryStoresCreateInputSchema,
	MemoryStoresCreateResponseSchema,
	MemoryStoresDeleteInputSchema,
	MemoryStoresDeleteResponseSchema,
	MemoryStoresDetachFromAgentInputSchema,
	MemoryStoresDetachFromAgentResponseSchema,
	MemoryStoresGetInputSchema,
	MemoryStoresGetResponseSchema,
	MemoryStoresListInputSchema,
	MemoryStoresListResponseSchema,
	MemoryStoresUpdateInputSchema,
	MemoryStoresUpdateResponseSchema,
	PhoneBooksCreateInputSchema,
	PhoneBooksCreateResponseSchema,
	PhoneBooksDeleteInputSchema,
	PhoneBooksDeleteResponseSchema,
	PhoneBooksListInputSchema,
	PhoneBooksListResponseSchema,
	SynthflowAiEndpointInputSchemas,
	SynthflowAiEndpointOutputSchemas,
	VoicesListInputSchema,
	VoicesListResponseSchema,
} from './endpoints/types';

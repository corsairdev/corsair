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
} from 'corsair/core';
import type { VapiEndpointInputs, VapiEndpointOutputs } from './endpoints/types';
import { VapiEndpointInputSchemas, VapiEndpointOutputSchemas } from './endpoints/types';
import type { VapiWebhookOutputs } from './webhooks/types';
import {
	VapiAssistantRequestEventSchema,
	VapiToolCallsEventSchema,
	VapiTransferDestinationRequestEventSchema,
	VapiEndOfCallReportEventSchema,
	VapiStatusUpdateEventSchema,
	VapiWorkflowNodeStartedEventSchema,
} from './webhooks/types';
import {
	Assistants,
	Calls,
	PhoneNumbers,
	Squads,
	Tools,
	Files,
	KnowledgeBases,
} from './endpoints';
import { VapiSchema } from './schema';
import { ServerMessageWebhooks, ClientMessageWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import type {
	VapiAssistantRequestEvent,
	VapiToolCallsEvent,
	VapiTransferDestinationRequestEvent,
	VapiEndOfCallReportEvent,
	VapiStatusUpdateEvent,
	VapiWorkflowNodeStartedEvent,
} from './webhooks/types';

export type VapiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalVapiPlugin['hooks'];
	webhookHooks?: InternalVapiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Vapi plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Vapi endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof vapiEndpointsNested>;
};

export type VapiContext = CorsairPluginContext<
	typeof VapiSchema,
	VapiPluginOptions
>;

export type VapiKeyBuilderContext = KeyBuilderContext<VapiPluginOptions>;

export type VapiBoundEndpoints = BindEndpoints<typeof vapiEndpointsNested>;

type VapiEndpoint<K extends keyof VapiEndpointOutputs> = CorsairEndpoint<
	VapiContext,
	VapiEndpointInputs[K],
	VapiEndpointOutputs[K]
>;

export type VapiEndpoints = {
	assistantsList: VapiEndpoint<'assistantsList'>;
	assistantsCreate: VapiEndpoint<'assistantsCreate'>;
	assistantsGet: VapiEndpoint<'assistantsGet'>;
	assistantsUpdate: VapiEndpoint<'assistantsUpdate'>;
	assistantsDelete: VapiEndpoint<'assistantsDelete'>;
	callsList: VapiEndpoint<'callsList'>;
	callsCreate: VapiEndpoint<'callsCreate'>;
	callsGet: VapiEndpoint<'callsGet'>;
	callsUpdate: VapiEndpoint<'callsUpdate'>;
	callsDelete: VapiEndpoint<'callsDelete'>;
	phoneNumbersList: VapiEndpoint<'phoneNumbersList'>;
	phoneNumbersCreate: VapiEndpoint<'phoneNumbersCreate'>;
	phoneNumbersGet: VapiEndpoint<'phoneNumbersGet'>;
	phoneNumbersUpdate: VapiEndpoint<'phoneNumbersUpdate'>;
	phoneNumbersDelete: VapiEndpoint<'phoneNumbersDelete'>;
	squadsList: VapiEndpoint<'squadsList'>;
	squadsCreate: VapiEndpoint<'squadsCreate'>;
	squadsGet: VapiEndpoint<'squadsGet'>;
	squadsUpdate: VapiEndpoint<'squadsUpdate'>;
	squadsDelete: VapiEndpoint<'squadsDelete'>;
	toolsList: VapiEndpoint<'toolsList'>;
	toolsCreate: VapiEndpoint<'toolsCreate'>;
	toolsGet: VapiEndpoint<'toolsGet'>;
	toolsUpdate: VapiEndpoint<'toolsUpdate'>;
	toolsDelete: VapiEndpoint<'toolsDelete'>;
	filesList: VapiEndpoint<'filesList'>;
	filesGet: VapiEndpoint<'filesGet'>;
	filesUpdate: VapiEndpoint<'filesUpdate'>;
	filesDelete: VapiEndpoint<'filesDelete'>;
	knowledgeBasesList: VapiEndpoint<'knowledgeBasesList'>;
	knowledgeBasesCreate: VapiEndpoint<'knowledgeBasesCreate'>;
	knowledgeBasesGet: VapiEndpoint<'knowledgeBasesGet'>;
	knowledgeBasesUpdate: VapiEndpoint<'knowledgeBasesUpdate'>;
	knowledgeBasesDelete: VapiEndpoint<'knowledgeBasesDelete'>;
};

type VapiWebhook<
	K extends keyof VapiWebhookOutputs,
	TEvent,
> = CorsairWebhook<VapiContext, TEvent, VapiWebhookOutputs[K]>;

export type VapiWebhooks = {
	assistantRequest: VapiWebhook<'assistantRequest', VapiAssistantRequestEvent>;
	toolCalls: VapiWebhook<'toolCalls', VapiToolCallsEvent>;
	transferDestinationRequest: VapiWebhook<
		'transferDestinationRequest',
		VapiTransferDestinationRequestEvent
	>;
	endOfCallReport: VapiWebhook<'endOfCallReport', VapiEndOfCallReportEvent>;
	statusUpdate: VapiWebhook<'statusUpdate', VapiStatusUpdateEvent>;
	workflowNodeStarted: VapiWebhook<
		'workflowNodeStarted',
		VapiWorkflowNodeStartedEvent
	>;
};

export type VapiBoundWebhooks = BindWebhooks<VapiWebhooks>;

const vapiEndpointsNested = {
	assistants: {
		list: Assistants.list,
		create: Assistants.create,
		get: Assistants.get,
		update: Assistants.update,
		delete: Assistants.delete,
	},
	calls: {
		list: Calls.list,
		create: Calls.create,
		get: Calls.get,
		update: Calls.update,
		delete: Calls.delete,
	},
	phoneNumbers: {
		list: PhoneNumbers.list,
		create: PhoneNumbers.create,
		get: PhoneNumbers.get,
		update: PhoneNumbers.update,
		delete: PhoneNumbers.delete,
	},
	squads: {
		list: Squads.list,
		create: Squads.create,
		get: Squads.get,
		update: Squads.update,
		delete: Squads.delete,
	},
	tools: {
		list: Tools.list,
		create: Tools.create,
		get: Tools.get,
		update: Tools.update,
		delete: Tools.delete,
	},
	files: {
		list: Files.list,
		get: Files.get,
		update: Files.update,
		delete: Files.delete,
	},
	knowledgeBases: {
		list: KnowledgeBases.list,
		create: KnowledgeBases.create,
		get: KnowledgeBases.get,
		update: KnowledgeBases.update,
		delete: KnowledgeBases.delete,
	},
} as const;

const vapiWebhooksNested = {
	server: {
		assistantRequest: ServerMessageWebhooks.assistantRequest,
		toolCalls: ServerMessageWebhooks.toolCalls,
		transferDestinationRequest: ServerMessageWebhooks.transferDestinationRequest,
		endOfCallReport: ServerMessageWebhooks.endOfCallReport,
		statusUpdate: ServerMessageWebhooks.statusUpdate,
	},
	client: {
		workflowNodeStarted: ClientMessageWebhooks.workflowNodeStarted,
	},
} as const;

export const vapiEndpointSchemas = {
	'assistants.list': {
		input: VapiEndpointInputSchemas.assistantsList,
		output: VapiEndpointOutputSchemas.assistantsList,
	},
	'assistants.create': {
		input: VapiEndpointInputSchemas.assistantsCreate,
		output: VapiEndpointOutputSchemas.assistantsCreate,
	},
	'assistants.get': {
		input: VapiEndpointInputSchemas.assistantsGet,
		output: VapiEndpointOutputSchemas.assistantsGet,
	},
	'assistants.update': {
		input: VapiEndpointInputSchemas.assistantsUpdate,
		output: VapiEndpointOutputSchemas.assistantsUpdate,
	},
	'assistants.delete': {
		input: VapiEndpointInputSchemas.assistantsDelete,
		output: VapiEndpointOutputSchemas.assistantsDelete,
	},
	'calls.list': {
		input: VapiEndpointInputSchemas.callsList,
		output: VapiEndpointOutputSchemas.callsList,
	},
	'calls.create': {
		input: VapiEndpointInputSchemas.callsCreate,
		output: VapiEndpointOutputSchemas.callsCreate,
	},
	'calls.get': {
		input: VapiEndpointInputSchemas.callsGet,
		output: VapiEndpointOutputSchemas.callsGet,
	},
	'calls.update': {
		input: VapiEndpointInputSchemas.callsUpdate,
		output: VapiEndpointOutputSchemas.callsUpdate,
	},
	'calls.delete': {
		input: VapiEndpointInputSchemas.callsDelete,
		output: VapiEndpointOutputSchemas.callsDelete,
	},
	'phoneNumbers.list': {
		input: VapiEndpointInputSchemas.phoneNumbersList,
		output: VapiEndpointOutputSchemas.phoneNumbersList,
	},
	'phoneNumbers.create': {
		input: VapiEndpointInputSchemas.phoneNumbersCreate,
		output: VapiEndpointOutputSchemas.phoneNumbersCreate,
	},
	'phoneNumbers.get': {
		input: VapiEndpointInputSchemas.phoneNumbersGet,
		output: VapiEndpointOutputSchemas.phoneNumbersGet,
	},
	'phoneNumbers.update': {
		input: VapiEndpointInputSchemas.phoneNumbersUpdate,
		output: VapiEndpointOutputSchemas.phoneNumbersUpdate,
	},
	'phoneNumbers.delete': {
		input: VapiEndpointInputSchemas.phoneNumbersDelete,
		output: VapiEndpointOutputSchemas.phoneNumbersDelete,
	},
	'squads.list': {
		input: VapiEndpointInputSchemas.squadsList,
		output: VapiEndpointOutputSchemas.squadsList,
	},
	'squads.create': {
		input: VapiEndpointInputSchemas.squadsCreate,
		output: VapiEndpointOutputSchemas.squadsCreate,
	},
	'squads.get': {
		input: VapiEndpointInputSchemas.squadsGet,
		output: VapiEndpointOutputSchemas.squadsGet,
	},
	'squads.update': {
		input: VapiEndpointInputSchemas.squadsUpdate,
		output: VapiEndpointOutputSchemas.squadsUpdate,
	},
	'squads.delete': {
		input: VapiEndpointInputSchemas.squadsDelete,
		output: VapiEndpointOutputSchemas.squadsDelete,
	},
	'tools.list': {
		input: VapiEndpointInputSchemas.toolsList,
		output: VapiEndpointOutputSchemas.toolsList,
	},
	'tools.create': {
		input: VapiEndpointInputSchemas.toolsCreate,
		output: VapiEndpointOutputSchemas.toolsCreate,
	},
	'tools.get': {
		input: VapiEndpointInputSchemas.toolsGet,
		output: VapiEndpointOutputSchemas.toolsGet,
	},
	'tools.update': {
		input: VapiEndpointInputSchemas.toolsUpdate,
		output: VapiEndpointOutputSchemas.toolsUpdate,
	},
	'tools.delete': {
		input: VapiEndpointInputSchemas.toolsDelete,
		output: VapiEndpointOutputSchemas.toolsDelete,
	},
	'files.list': {
		input: VapiEndpointInputSchemas.filesList,
		output: VapiEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: VapiEndpointInputSchemas.filesGet,
		output: VapiEndpointOutputSchemas.filesGet,
	},
	'files.update': {
		input: VapiEndpointInputSchemas.filesUpdate,
		output: VapiEndpointOutputSchemas.filesUpdate,
	},
	'files.delete': {
		input: VapiEndpointInputSchemas.filesDelete,
		output: VapiEndpointOutputSchemas.filesDelete,
	},
	'knowledgeBases.list': {
		input: VapiEndpointInputSchemas.knowledgeBasesList,
		output: VapiEndpointOutputSchemas.knowledgeBasesList,
	},
	'knowledgeBases.create': {
		input: VapiEndpointInputSchemas.knowledgeBasesCreate,
		output: VapiEndpointOutputSchemas.knowledgeBasesCreate,
	},
	'knowledgeBases.get': {
		input: VapiEndpointInputSchemas.knowledgeBasesGet,
		output: VapiEndpointOutputSchemas.knowledgeBasesGet,
	},
	'knowledgeBases.update': {
		input: VapiEndpointInputSchemas.knowledgeBasesUpdate,
		output: VapiEndpointOutputSchemas.knowledgeBasesUpdate,
	},
	'knowledgeBases.delete': {
		input: VapiEndpointInputSchemas.knowledgeBasesDelete,
		output: VapiEndpointOutputSchemas.knowledgeBasesDelete,
	},
} as const;

const vapiWebhookSchemas = {
	'server.assistantRequest': {
		description: 'Sent to fetch assistant configuration for an incoming call',
		payload: VapiAssistantRequestEventSchema,
		response: VapiAssistantRequestEventSchema,
	},
	'server.toolCalls': {
		description: 'Triggered when the assistant makes tool calls during a call',
		payload: VapiToolCallsEventSchema,
		response: VapiToolCallsEventSchema,
	},
	'server.transferDestinationRequest': {
		description: 'Triggered when processing a transfer destination request',
		payload: VapiTransferDestinationRequestEventSchema,
		response: VapiTransferDestinationRequestEventSchema,
	},
	'server.endOfCallReport': {
		description: 'Sent at the end of a call with transcript, summary, and analysis',
		payload: VapiEndOfCallReportEventSchema,
		response: VapiEndOfCallReportEventSchema,
	},
	'server.statusUpdate': {
		description: 'Sent when the call status changes',
		payload: VapiStatusUpdateEventSchema,
		response: VapiStatusUpdateEventSchema,
	},
	'client.workflowNodeStarted': {
		description: 'Sent when the active workflow node changes',
		payload: VapiWorkflowNodeStartedEventSchema,
		response: VapiWorkflowNodeStartedEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const vapiEndpointMeta = {
	'assistants.list': {
		riskLevel: 'read',
		description: 'List all Vapi assistants',
	},
	'assistants.create': {
		riskLevel: 'write',
		description: 'Create a new Vapi assistant',
	},
	'assistants.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi assistant by ID',
	},
	'assistants.update': {
		riskLevel: 'write',
		description: 'Update a Vapi assistant',
	},
	'assistants.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi assistant [DESTRUCTIVE]',
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List all Vapi calls with optional filters',
	},
	'calls.create': {
		riskLevel: 'write',
		description: 'Create (initiate) a new Vapi call',
	},
	'calls.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi call by ID',
	},
	'calls.update': {
		riskLevel: 'write',
		description: 'Update a Vapi call',
	},
	'calls.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi call [DESTRUCTIVE]',
	},
	'phoneNumbers.list': {
		riskLevel: 'read',
		description: 'List all Vapi phone numbers',
	},
	'phoneNumbers.create': {
		riskLevel: 'write',
		description: 'Create a new Vapi phone number',
	},
	'phoneNumbers.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi phone number by ID',
	},
	'phoneNumbers.update': {
		riskLevel: 'write',
		description: 'Update a Vapi phone number',
	},
	'phoneNumbers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi phone number [DESTRUCTIVE]',
	},
	'squads.list': {
		riskLevel: 'read',
		description: 'List all Vapi squads',
	},
	'squads.create': {
		riskLevel: 'write',
		description: 'Create a new Vapi squad',
	},
	'squads.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi squad by ID',
	},
	'squads.update': {
		riskLevel: 'write',
		description: 'Update a Vapi squad',
	},
	'squads.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi squad [DESTRUCTIVE]',
	},
	'tools.list': {
		riskLevel: 'read',
		description: 'List all Vapi tools',
	},
	'tools.create': {
		riskLevel: 'write',
		description: 'Create a new Vapi tool',
	},
	'tools.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi tool by ID',
	},
	'tools.update': {
		riskLevel: 'write',
		description: 'Update a Vapi tool',
	},
	'tools.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi tool [DESTRUCTIVE]',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List all Vapi files',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi file by ID',
	},
	'files.update': {
		riskLevel: 'write',
		description: 'Update a Vapi file',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi file [DESTRUCTIVE]',
	},
	'knowledgeBases.list': {
		riskLevel: 'read',
		description: 'List all Vapi knowledge bases',
	},
	'knowledgeBases.create': {
		riskLevel: 'write',
		description: 'Create a new Vapi knowledge base',
	},
	'knowledgeBases.get': {
		riskLevel: 'read',
		description: 'Retrieve a Vapi knowledge base by ID',
	},
	'knowledgeBases.update': {
		riskLevel: 'write',
		description: 'Update a Vapi knowledge base',
	},
	'knowledgeBases.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Vapi knowledge base [DESTRUCTIVE]',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof vapiEndpointsNested>;

export const vapiAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseVapiPlugin<T extends VapiPluginOptions> = CorsairPlugin<
	'vapi',
	typeof VapiSchema,
	typeof vapiEndpointsNested,
	typeof vapiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVapiPlugin = BaseVapiPlugin<VapiPluginOptions>;

export type ExternalVapiPlugin<T extends VapiPluginOptions> =
	BaseVapiPlugin<T>;

export function vapi<const T extends VapiPluginOptions>(
	incomingOptions: VapiPluginOptions & T = {} as VapiPluginOptions & T,
): ExternalVapiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vapi',
		schema: VapiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vapiEndpointsNested,
		webhooks: vapiWebhooksNested,
		endpointMeta: vapiEndpointMeta,
		endpointSchemas: vapiEndpointSchemas,
		webhookSchemas: vapiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return 'x-vapi-secret' in request.headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VapiKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalVapiPlugin;
}

// ── Webhook Type Exports ──────────────────────────────────────────────────────

export type {
	VapiAssistantRequestEvent,
	VapiToolCallsEvent,
	VapiTransferDestinationRequestEvent,
	VapiEndOfCallReportEvent,
	VapiStatusUpdateEvent,
	VapiWorkflowNodeStartedEvent,
	VapiWebhookOutputs,
} from './webhooks/types';

export { createVapiServerMessageMatch, createVapiClientMessageMatch } from './webhooks/types';

// ── Endpoint Type Exports ─────────────────────────────────────────────────────

export type {
	VapiEndpointInputs,
	VapiEndpointOutputs,
	AssistantsListInput,
	AssistantsListResponse,
	AssistantsCreateInput,
	AssistantsCreateResponse,
	AssistantsGetInput,
	AssistantsGetResponse,
	AssistantsUpdateInput,
	AssistantsUpdateResponse,
	AssistantsDeleteInput,
	AssistantsDeleteResponse,
	CallsListInput,
	CallsListResponse,
	CallsCreateInput,
	CallsCreateResponse,
	CallsGetInput,
	CallsGetResponse,
	CallsUpdateInput,
	CallsUpdateResponse,
	CallsDeleteInput,
	CallsDeleteResponse,
	PhoneNumbersListInput,
	PhoneNumbersListResponse,
	PhoneNumbersCreateInput,
	PhoneNumbersCreateResponse,
	PhoneNumbersGetInput,
	PhoneNumbersGetResponse,
	PhoneNumbersUpdateInput,
	PhoneNumbersUpdateResponse,
	PhoneNumbersDeleteInput,
	PhoneNumbersDeleteResponse,
	SquadsListInput,
	SquadsListResponse,
	SquadsCreateInput,
	SquadsCreateResponse,
	SquadsGetInput,
	SquadsGetResponse,
	SquadsUpdateInput,
	SquadsUpdateResponse,
	SquadsDeleteInput,
	SquadsDeleteResponse,
	ToolsListInput,
	ToolsListResponse,
	ToolsCreateInput,
	ToolsCreateResponse,
	ToolsGetInput,
	ToolsGetResponse,
	ToolsUpdateInput,
	ToolsUpdateResponse,
	ToolsDeleteInput,
	ToolsDeleteResponse,
	FilesListInput,
	FilesListResponse,
	FilesGetInput,
	FilesGetResponse,
	FilesUpdateInput,
	FilesUpdateResponse,
	FilesDeleteInput,
	FilesDeleteResponse,
	KnowledgeBasesListInput,
	KnowledgeBasesListResponse,
	KnowledgeBasesCreateInput,
	KnowledgeBasesCreateResponse,
	KnowledgeBasesGetInput,
	KnowledgeBasesGetResponse,
	KnowledgeBasesUpdateInput,
	KnowledgeBasesUpdateResponse,
	KnowledgeBasesDeleteInput,
	KnowledgeBasesDeleteResponse,
} from './endpoints/types';

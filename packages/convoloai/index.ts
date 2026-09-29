import type {
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
	Agent,
	Call,
	getCustomWidgetParams,
	getOpenApiDocument,
	Lead,
	Widget,
} from './endpoints';
import type {
	ConvoloAiEndpointInputs,
	ConvoloAiEndpointOutputs,
} from './endpoints/types';
import {
	ConvoloAiEndpointInputSchemas,
	ConvoloAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ConvoloAiSchema } from './schema';

export type ConvoloAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalConvoloAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof convoloAiEndpointsNested>;
};

export type ConvoloAiContext = CorsairPluginContext<
	typeof ConvoloAiSchema,
	ConvoloAiPluginOptions
>;

export type ConvoloAiKeyBuilderContext =
	KeyBuilderContext<ConvoloAiPluginOptions>;

export type ConvoloAiBoundEndpoints = BindEndpoints<
	typeof convoloAiEndpointsNested
>;

type ConvoloAiEndpoint<K extends keyof ConvoloAiEndpointOutputs> =
	CorsairEndpoint<
		ConvoloAiContext,
		ConvoloAiEndpointInputs[K],
		ConvoloAiEndpointOutputs[K]
	>;

export type ConvoloAiEndpoints = {
	agentList: ConvoloAiEndpoint<'agentList'>;
	agentListV2: ConvoloAiEndpoint<'agentListV2'>;
	agentGet: ConvoloAiEndpoint<'agentGet'>;
	agentCreate: ConvoloAiEndpoint<'agentCreate'>;
	agentUpdate: ConvoloAiEndpoint<'agentUpdate'>;
	agentDelete: ConvoloAiEndpoint<'agentDelete'>;
	agentUpdateSchedule: ConvoloAiEndpoint<'agentUpdateSchedule'>;
	callList: ConvoloAiEndpoint<'callList'>;
	callListV5: ConvoloAiEndpoint<'callListV5'>;
	callListWithTags: ConvoloAiEndpoint<'callListWithTags'>;
	callGetDetails: ConvoloAiEndpoint<'callGetDetails'>;
	callGetLog: ConvoloAiEndpoint<'callGetLog'>;
	callGetEndWebhookPayload: ConvoloAiEndpoint<'callGetEndWebhookPayload'>;
	callListPayloadData: ConvoloAiEndpoint<'callListPayloadData'>;
	callSetS2lTag: ConvoloAiEndpoint<'callSetS2lTag'>;
	callSetRating: ConvoloAiEndpoint<'callSetRating'>;
	callTrigger: ConvoloAiEndpoint<'callTrigger'>;
	leadList: ConvoloAiEndpoint<'leadList'>;
	leadListByPost: ConvoloAiEndpoint<'leadListByPost'>;
	leadGetOutcomeTags: ConvoloAiEndpoint<'leadGetOutcomeTags'>;
	widgetList: ConvoloAiEndpoint<'widgetList'>;
	widgetCreate: ConvoloAiEndpoint<'widgetCreate'>;
	widgetGet: ConvoloAiEndpoint<'widgetGet'>;
	widgetUpdate: ConvoloAiEndpoint<'widgetUpdate'>;
	widgetUpdateV2: ConvoloAiEndpoint<'widgetUpdateV2'>;
	widgetDelete: ConvoloAiEndpoint<'widgetDelete'>;
	widgetToggle: ConvoloAiEndpoint<'widgetToggle'>;
	widgetGetHtmlSiteCode: ConvoloAiEndpoint<'widgetGetHtmlSiteCode'>;
	widgetUpdateSettings: ConvoloAiEndpoint<'widgetUpdateSettings'>;
	getCustomWidgetParams: ConvoloAiEndpoint<'getCustomWidgetParams'>;
	getOpenApiDocument: ConvoloAiEndpoint<'getOpenApiDocument'>;
};

const convoloAiEndpointsNested = {
	agent: {
		list: Agent.list,
		listV2: Agent.listV2,
		get: Agent.get,
		create: Agent.create,
		update: Agent.update,
		delete: Agent.delete,
		updateSchedule: Agent.updateSchedule,
	},
	call: {
		list: Call.list,
		listV5: Call.listV5,
		listWithTags: Call.listWithTags,
		getDetails: Call.getDetails,
		getLog: Call.getLog,
		getEndWebhookPayload: Call.getEndWebhookPayload,
		listPayloadData: Call.listPayloadData,
		setS2lTag: Call.setS2lTag,
		setRating: Call.setRating,
		trigger: Call.trigger,
	},
	lead: {
		list: Lead.list,
		listByPost: Lead.listByPost,
		getOutcomeTags: Lead.getOutcomeTags,
	},
	widget: {
		list: Widget.list,
		create: Widget.create,
		get: Widget.get,
		update: Widget.update,
		updateV2: Widget.updateV2,
		delete: Widget.delete,
		toggle: Widget.toggle,
		getHtmlSiteCode: Widget.getHtmlSiteCode,
		updateSettings: Widget.updateSettings,
	},
	getCustomWidgetParams,
	getOpenApiDocument,
} as const;

const convoloAiWebhooksNested = {} as const;

export const convoloAiEndpointSchemas = {
	'agent.list': {
		input: ConvoloAiEndpointInputSchemas.agentList,
		output: ConvoloAiEndpointOutputSchemas.agentList,
	},
	'agent.listV2': {
		input: ConvoloAiEndpointInputSchemas.agentListV2,
		output: ConvoloAiEndpointOutputSchemas.agentListV2,
	},
	'agent.get': {
		input: ConvoloAiEndpointInputSchemas.agentGet,
		output: ConvoloAiEndpointOutputSchemas.agentGet,
	},
	'agent.create': {
		input: ConvoloAiEndpointInputSchemas.agentCreate,
		output: ConvoloAiEndpointOutputSchemas.agentCreate,
	},
	'agent.update': {
		input: ConvoloAiEndpointInputSchemas.agentUpdate,
		output: ConvoloAiEndpointOutputSchemas.agentUpdate,
	},
	'agent.delete': {
		input: ConvoloAiEndpointInputSchemas.agentDelete,
		output: ConvoloAiEndpointOutputSchemas.agentDelete,
	},
	'agent.updateSchedule': {
		input: ConvoloAiEndpointInputSchemas.agentUpdateSchedule,
		output: ConvoloAiEndpointOutputSchemas.agentUpdateSchedule,
	},
	'call.list': {
		input: ConvoloAiEndpointInputSchemas.callList,
		output: ConvoloAiEndpointOutputSchemas.callList,
	},
	'call.listV5': {
		input: ConvoloAiEndpointInputSchemas.callListV5,
		output: ConvoloAiEndpointOutputSchemas.callListV5,
	},
	'call.listWithTags': {
		input: ConvoloAiEndpointInputSchemas.callListWithTags,
		output: ConvoloAiEndpointOutputSchemas.callListWithTags,
	},
	'call.getDetails': {
		input: ConvoloAiEndpointInputSchemas.callGetDetails,
		output: ConvoloAiEndpointOutputSchemas.callGetDetails,
	},
	'call.getLog': {
		input: ConvoloAiEndpointInputSchemas.callGetLog,
		output: ConvoloAiEndpointOutputSchemas.callGetLog,
	},
	'call.getEndWebhookPayload': {
		input: ConvoloAiEndpointInputSchemas.callGetEndWebhookPayload,
		output: ConvoloAiEndpointOutputSchemas.callGetEndWebhookPayload,
	},
	'call.listPayloadData': {
		input: ConvoloAiEndpointInputSchemas.callListPayloadData,
		output: ConvoloAiEndpointOutputSchemas.callListPayloadData,
	},
	'call.setS2lTag': {
		input: ConvoloAiEndpointInputSchemas.callSetS2lTag,
		output: ConvoloAiEndpointOutputSchemas.callSetS2lTag,
	},
	'call.setRating': {
		input: ConvoloAiEndpointInputSchemas.callSetRating,
		output: ConvoloAiEndpointOutputSchemas.callSetRating,
	},
	'call.trigger': {
		input: ConvoloAiEndpointInputSchemas.callTrigger,
		output: ConvoloAiEndpointOutputSchemas.callTrigger,
	},
	'lead.list': {
		input: ConvoloAiEndpointInputSchemas.leadList,
		output: ConvoloAiEndpointOutputSchemas.leadList,
	},
	'lead.listByPost': {
		input: ConvoloAiEndpointInputSchemas.leadListByPost,
		output: ConvoloAiEndpointOutputSchemas.leadListByPost,
	},
	'lead.getOutcomeTags': {
		input: ConvoloAiEndpointInputSchemas.leadGetOutcomeTags,
		output: ConvoloAiEndpointOutputSchemas.leadGetOutcomeTags,
	},
	'widget.list': {
		input: ConvoloAiEndpointInputSchemas.widgetList,
		output: ConvoloAiEndpointOutputSchemas.widgetList,
	},
	'widget.create': {
		input: ConvoloAiEndpointInputSchemas.widgetCreate,
		output: ConvoloAiEndpointOutputSchemas.widgetCreate,
	},
	'widget.get': {
		input: ConvoloAiEndpointInputSchemas.widgetGet,
		output: ConvoloAiEndpointOutputSchemas.widgetGet,
	},
	'widget.update': {
		input: ConvoloAiEndpointInputSchemas.widgetUpdate,
		output: ConvoloAiEndpointOutputSchemas.widgetUpdate,
	},
	'widget.updateV2': {
		input: ConvoloAiEndpointInputSchemas.widgetUpdateV2,
		output: ConvoloAiEndpointOutputSchemas.widgetUpdateV2,
	},
	'widget.delete': {
		input: ConvoloAiEndpointInputSchemas.widgetDelete,
		output: ConvoloAiEndpointOutputSchemas.widgetDelete,
	},
	'widget.toggle': {
		input: ConvoloAiEndpointInputSchemas.widgetToggle,
		output: ConvoloAiEndpointOutputSchemas.widgetToggle,
	},
	'widget.getHtmlSiteCode': {
		input: ConvoloAiEndpointInputSchemas.widgetGetHtmlSiteCode,
		output: ConvoloAiEndpointOutputSchemas.widgetGetHtmlSiteCode,
	},
	'widget.updateSettings': {
		input: ConvoloAiEndpointInputSchemas.widgetUpdateSettings,
		output: ConvoloAiEndpointOutputSchemas.widgetUpdateSettings,
	},
	getCustomWidgetParams: {
		input: ConvoloAiEndpointInputSchemas.getCustomWidgetParams,
		output: ConvoloAiEndpointOutputSchemas.getCustomWidgetParams,
	},
	getOpenApiDocument: {
		input: ConvoloAiEndpointInputSchemas.getOpenApiDocument,
		output: ConvoloAiEndpointOutputSchemas.getOpenApiDocument,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof convoloAiEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const convoloAiEndpointMeta = {
	'agent.list': {
		riskLevel: 'read',
		description: 'List agents with filtering, sorting, and pagination',
	},
	'agent.listV2': {
		riskLevel: 'read',
		description: 'List agents via the v2 endpoint',
	},
	'agent.get': {
		riskLevel: 'read',
		description: 'Get one agent by id',
	},
	'agent.create': {
		riskLevel: 'write',
		description: 'Create a new agent',
	},
	'agent.update': {
		riskLevel: 'write',
		description: 'Update an agent',
	},
	'agent.delete': {
		riskLevel: 'destructive',
		description: 'Delete an agent',
	},
	'agent.updateSchedule': {
		riskLevel: 'write',
		description: 'Update the working schedule of an agent',
	},
	'call.list': {
		riskLevel: 'read',
		description: 'List calls with filters and pagination',
	},
	'call.listV5': {
		riskLevel: 'read',
		description: 'List calls via the v5 endpoint with fixed delegate logic',
	},
	'call.listWithTags': {
		riskLevel: 'read',
		description: 'List calls with S2L tag filters',
	},
	'call.getDetails': {
		riskLevel: 'read',
		description: 'Get detailed info for one call',
	},
	'call.getLog': {
		riskLevel: 'read',
		description: 'Get the log for one call',
	},
	'call.getEndWebhookPayload': {
		riskLevel: 'read',
		description: 'Get the end-call webhook payload for one call',
	},
	'call.listPayloadData': {
		riskLevel: 'read',
		description: 'List webhook payload data for calls',
	},
	'call.setS2lTag': {
		riskLevel: 'write',
		description: 'Set an S2L tag on a call from an external AI agent',
	},
	'call.setRating': {
		riskLevel: 'write',
		description: 'Set a rating on a call for an agent or supervisor',
	},
	'call.trigger': {
		riskLevel: 'write',
		description: 'Trigger a call through the external call API',
	},
	'lead.list': {
		riskLevel: 'read',
		description: 'List leads with filters and pagination',
	},
	'lead.listByPost': {
		riskLevel: 'read',
		description: 'List leads via a POST body query',
	},
	'lead.getOutcomeTags': {
		riskLevel: 'read',
		description: 'Get widget outcome tags by lead id',
	},
	'widget.list': {
		riskLevel: 'read',
		description: 'List widgets with filters and pagination',
	},
	'widget.create': {
		riskLevel: 'write',
		description: 'Create a new widget',
	},
	'widget.get': {
		riskLevel: 'read',
		description: 'Get one widget by id',
	},
	'widget.update': {
		riskLevel: 'write',
		description: 'Update a widget',
	},
	'widget.updateV2': {
		riskLevel: 'write',
		description: 'Update a widget via the v2 endpoint',
	},
	'widget.delete': {
		riskLevel: 'destructive',
		description: 'Delete a widget',
	},
	'widget.toggle': {
		riskLevel: 'write',
		description: 'Toggle a widget on or off',
	},
	'widget.getHtmlSiteCode': {
		riskLevel: 'read',
		description: 'Get the HTML site code for a widget',
	},
	'widget.updateSettings': {
		riskLevel: 'write',
		description: 'Update widget settings via the external API',
	},
	getCustomWidgetParams: {
		riskLevel: 'read',
		description: 'Get custom widget fields for integrations',
	},
	getOpenApiDocument: {
		riskLevel: 'read',
		description: 'Get the OpenAPI document this API key may call',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof convoloAiEndpointsNested
>;

export const convoloAiAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseConvoloAiPlugin<T extends ConvoloAiPluginOptions> =
	CorsairPlugin<
		'convoloai',
		typeof ConvoloAiSchema,
		typeof convoloAiEndpointsNested,
		typeof convoloAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalConvoloAiPlugin =
	BaseConvoloAiPlugin<ConvoloAiPluginOptions>;

export type ExternalConvoloAiPlugin<T extends ConvoloAiPluginOptions> =
	BaseConvoloAiPlugin<T>;

export function convoloai<const T extends ConvoloAiPluginOptions>(
	incomingOptions: ConvoloAiPluginOptions & T = {} as ConvoloAiPluginOptions &
		T,
): ExternalConvoloAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'convoloai',
		authConfig: convoloAiAuthConfig,
		schema: ConvoloAiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: convoloAiEndpointsNested,
		endpointMeta: convoloAiEndpointMeta,
		endpointSchemas: convoloAiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConvoloAiKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('convoloai', 'api_key');
			}
			if (options.key) {
				return options.key;
			}
			if (ctx.keys) {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('convoloai', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('convoloai', 'api_key');
		},
	} satisfies InternalConvoloAiPlugin;
}

export type {
	ConvoloAiEndpointInputs,
	ConvoloAiEndpointOutputs,
} from './endpoints/types';

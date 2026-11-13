import type {
	BindEndpoints,
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
import type { SvixRegion } from './client';
import { endpoint } from './endpoints';
import {
	SvixEndpointInputSchemas as inputs,
	SvixEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SvixSchema } from './schema';

const endpoints = {
	applications: {
		list: endpoint('applicationsList'),
		create: endpoint('applicationsCreate'),
		get: endpoint('applicationsGet'),
		upsert: endpoint('applicationsUpsert'),
		delete: endpoint('applicationsDelete'),
		patch: endpoint('applicationsPatch'),
	},
	endpoints: {
		list: endpoint('endpointsList'),
		create: endpoint('endpointsCreate'),
		get: endpoint('endpointsGet'),
		upsert: endpoint('endpointsUpsert'),
		delete: endpoint('endpointsDelete'),
		patch: endpoint('endpointsPatch'),
		mcpEventsSubscribe: endpoint('endpointsMcpEventsSubscribe'),
		mcpEventsUnsubscribe: endpoint('endpointsMcpEventsUnsubscribe'),
		getSecret: endpoint('endpointsGetSecret'),
		rotateSecret: endpoint('endpointsRotateSecret'),
		getHeaders: endpoint('endpointsGetHeaders'),
		setHeaders: endpoint('endpointsSetHeaders'),
		patchHeaders: endpoint('endpointsPatchHeaders'),
		transformationGet: endpoint('endpointsTransformationGet'),
		transformationPatch: endpoint('endpointsTransformationPatch'),
		replayMissing: endpoint('endpointsReplayMissing'),
		bulkReplay: endpoint('endpointsBulkReplay'),
		getStats: endpoint('endpointsGetStats'),
		getAttemptStats: endpoint('endpointsGetAttemptStats'),
		recover: endpoint('endpointsRecover'),
		sendExample: endpoint('endpointsSendExample'),
	},
	eventTypes: {
		list: endpoint('eventTypesList'),
		create: endpoint('eventTypesCreate'),
		importOpenapi: endpoint('eventTypesImportOpenapi'),
		get: endpoint('eventTypesGet'),
		upsert: endpoint('eventTypesUpsert'),
		delete: endpoint('eventTypesDelete'),
		patch: endpoint('eventTypesPatch'),
	},
	messages: {
		list: endpoint('messagesList'),
		create: endpoint('messagesCreate'),
		createBatch: endpoint('messagesCreateBatch'),
		precheck: endpoint('messagesPrecheck'),
		get: endpoint('messagesGet'),
		expungeContent: endpoint('messagesExpungeContent'),
		bulkExpungeContent: endpoint('messagesBulkExpungeContent'),
		expungeAllContents: endpoint('messagesExpungeAllContents'),
		pollerPoll: endpoint('messagesPollerPoll'),
		pollerConsumerSeek: endpoint('messagesPollerConsumerSeek'),
		pollerConsumerPoll: endpoint('messagesPollerConsumerPoll'),
	},
	attempts: {
		listByEndpoint: endpoint('attemptsListByEndpoint'),
		listByMsg: endpoint('attemptsListByMsg'),
		listAttemptedMessages: endpoint('attemptsListAttemptedMessages'),
		listAttemptedDestinations: endpoint('attemptsListAttemptedDestinations'),
		get: endpoint('attemptsGet'),
		expungeContent: endpoint('attemptsExpungeContent'),
		resend: endpoint('attemptsResend'),
	},
	operationalWebhooks: {
		list: endpoint('operationalWebhooksList'),
		create: endpoint('operationalWebhooksCreate'),
		get: endpoint('operationalWebhooksGet'),
		upsert: endpoint('operationalWebhooksUpsert'),
		delete: endpoint('operationalWebhooksDelete'),
		getSecret: endpoint('operationalWebhooksGetSecret'),
		rotateSecret: endpoint('operationalWebhooksRotateSecret'),
		getHeaders: endpoint('operationalWebhooksGetHeaders'),
		setHeaders: endpoint('operationalWebhooksSetHeaders'),
	},
} as const;

export type SvixPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	region?: SvixRegion;
	hooks?: InternalSvixPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type SvixContext = CorsairPluginContext<
	typeof SvixSchema,
	SvixPluginOptions
>;
export type SvixKeyBuilderContext = KeyBuilderContext<SvixPluginOptions>;
export type SvixBoundEndpoints = BindEndpoints<typeof endpoints>;

export const svixEndpointSchemas = {
	'applications.list': {
		input: inputs.applicationsList,
		output: outputs.applicationsList,
	},
	'applications.create': {
		input: inputs.applicationsCreate,
		output: outputs.applicationsCreate,
	},
	'applications.get': {
		input: inputs.applicationsGet,
		output: outputs.applicationsGet,
	},
	'applications.upsert': {
		input: inputs.applicationsUpsert,
		output: outputs.applicationsUpsert,
	},
	'applications.delete': {
		input: inputs.applicationsDelete,
		output: outputs.applicationsDelete,
	},
	'applications.patch': {
		input: inputs.applicationsPatch,
		output: outputs.applicationsPatch,
	},
	'endpoints.list': {
		input: inputs.endpointsList,
		output: outputs.endpointsList,
	},
	'endpoints.create': {
		input: inputs.endpointsCreate,
		output: outputs.endpointsCreate,
	},
	'endpoints.get': { input: inputs.endpointsGet, output: outputs.endpointsGet },
	'endpoints.upsert': {
		input: inputs.endpointsUpsert,
		output: outputs.endpointsUpsert,
	},
	'endpoints.delete': {
		input: inputs.endpointsDelete,
		output: outputs.endpointsDelete,
	},
	'endpoints.patch': {
		input: inputs.endpointsPatch,
		output: outputs.endpointsPatch,
	},
	'endpoints.mcpEventsSubscribe': {
		input: inputs.endpointsMcpEventsSubscribe,
		output: outputs.endpointsMcpEventsSubscribe,
	},
	'endpoints.mcpEventsUnsubscribe': {
		input: inputs.endpointsMcpEventsUnsubscribe,
		output: outputs.endpointsMcpEventsUnsubscribe,
	},
	'endpoints.getSecret': {
		input: inputs.endpointsGetSecret,
		output: outputs.endpointsGetSecret,
	},
	'endpoints.rotateSecret': {
		input: inputs.endpointsRotateSecret,
		output: outputs.endpointsRotateSecret,
	},
	'endpoints.getHeaders': {
		input: inputs.endpointsGetHeaders,
		output: outputs.endpointsGetHeaders,
	},
	'endpoints.setHeaders': {
		input: inputs.endpointsSetHeaders,
		output: outputs.endpointsSetHeaders,
	},
	'endpoints.patchHeaders': {
		input: inputs.endpointsPatchHeaders,
		output: outputs.endpointsPatchHeaders,
	},
	'endpoints.transformationGet': {
		input: inputs.endpointsTransformationGet,
		output: outputs.endpointsTransformationGet,
	},
	'endpoints.transformationPatch': {
		input: inputs.endpointsTransformationPatch,
		output: outputs.endpointsTransformationPatch,
	},
	'endpoints.replayMissing': {
		input: inputs.endpointsReplayMissing,
		output: outputs.endpointsReplayMissing,
	},
	'endpoints.bulkReplay': {
		input: inputs.endpointsBulkReplay,
		output: outputs.endpointsBulkReplay,
	},
	'endpoints.getStats': {
		input: inputs.endpointsGetStats,
		output: outputs.endpointsGetStats,
	},
	'endpoints.getAttemptStats': {
		input: inputs.endpointsGetAttemptStats,
		output: outputs.endpointsGetAttemptStats,
	},
	'endpoints.recover': {
		input: inputs.endpointsRecover,
		output: outputs.endpointsRecover,
	},
	'endpoints.sendExample': {
		input: inputs.endpointsSendExample,
		output: outputs.endpointsSendExample,
	},
	'eventTypes.list': {
		input: inputs.eventTypesList,
		output: outputs.eventTypesList,
	},
	'eventTypes.create': {
		input: inputs.eventTypesCreate,
		output: outputs.eventTypesCreate,
	},
	'eventTypes.importOpenapi': {
		input: inputs.eventTypesImportOpenapi,
		output: outputs.eventTypesImportOpenapi,
	},
	'eventTypes.get': {
		input: inputs.eventTypesGet,
		output: outputs.eventTypesGet,
	},
	'eventTypes.upsert': {
		input: inputs.eventTypesUpsert,
		output: outputs.eventTypesUpsert,
	},
	'eventTypes.delete': {
		input: inputs.eventTypesDelete,
		output: outputs.eventTypesDelete,
	},
	'eventTypes.patch': {
		input: inputs.eventTypesPatch,
		output: outputs.eventTypesPatch,
	},
	'messages.list': { input: inputs.messagesList, output: outputs.messagesList },
	'messages.create': {
		input: inputs.messagesCreate,
		output: outputs.messagesCreate,
	},
	'messages.createBatch': {
		input: inputs.messagesCreateBatch,
		output: outputs.messagesCreateBatch,
	},
	'messages.precheck': {
		input: inputs.messagesPrecheck,
		output: outputs.messagesPrecheck,
	},
	'messages.get': { input: inputs.messagesGet, output: outputs.messagesGet },
	'messages.expungeContent': {
		input: inputs.messagesExpungeContent,
		output: outputs.messagesExpungeContent,
	},
	'messages.bulkExpungeContent': {
		input: inputs.messagesBulkExpungeContent,
		output: outputs.messagesBulkExpungeContent,
	},
	'messages.expungeAllContents': {
		input: inputs.messagesExpungeAllContents,
		output: outputs.messagesExpungeAllContents,
	},
	'attempts.listByEndpoint': {
		input: inputs.attemptsListByEndpoint,
		output: outputs.attemptsListByEndpoint,
	},
	'attempts.listByMsg': {
		input: inputs.attemptsListByMsg,
		output: outputs.attemptsListByMsg,
	},
	'attempts.listAttemptedMessages': {
		input: inputs.attemptsListAttemptedMessages,
		output: outputs.attemptsListAttemptedMessages,
	},
	'attempts.listAttemptedDestinations': {
		input: inputs.attemptsListAttemptedDestinations,
		output: outputs.attemptsListAttemptedDestinations,
	},
	'attempts.get': { input: inputs.attemptsGet, output: outputs.attemptsGet },
	'attempts.expungeContent': {
		input: inputs.attemptsExpungeContent,
		output: outputs.attemptsExpungeContent,
	},
	'attempts.resend': {
		input: inputs.attemptsResend,
		output: outputs.attemptsResend,
	},
	'messages.pollerPoll': {
		input: inputs.messagesPollerPoll,
		output: outputs.messagesPollerPoll,
	},
	'messages.pollerConsumerSeek': {
		input: inputs.messagesPollerConsumerSeek,
		output: outputs.messagesPollerConsumerSeek,
	},
	'messages.pollerConsumerPoll': {
		input: inputs.messagesPollerConsumerPoll,
		output: outputs.messagesPollerConsumerPoll,
	},
	'operationalWebhooks.list': {
		input: inputs.operationalWebhooksList,
		output: outputs.operationalWebhooksList,
	},
	'operationalWebhooks.create': {
		input: inputs.operationalWebhooksCreate,
		output: outputs.operationalWebhooksCreate,
	},
	'operationalWebhooks.get': {
		input: inputs.operationalWebhooksGet,
		output: outputs.operationalWebhooksGet,
	},
	'operationalWebhooks.upsert': {
		input: inputs.operationalWebhooksUpsert,
		output: outputs.operationalWebhooksUpsert,
	},
	'operationalWebhooks.delete': {
		input: inputs.operationalWebhooksDelete,
		output: outputs.operationalWebhooksDelete,
	},
	'operationalWebhooks.getSecret': {
		input: inputs.operationalWebhooksGetSecret,
		output: outputs.operationalWebhooksGetSecret,
	},
	'operationalWebhooks.rotateSecret': {
		input: inputs.operationalWebhooksRotateSecret,
		output: outputs.operationalWebhooksRotateSecret,
	},
	'operationalWebhooks.getHeaders': {
		input: inputs.operationalWebhooksGetHeaders,
		output: outputs.operationalWebhooksGetHeaders,
	},
	'operationalWebhooks.setHeaders': {
		input: inputs.operationalWebhooksSetHeaders,
		output: outputs.operationalWebhooksSetHeaders,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

export const svixEndpointMeta = {
	'applications.list': { riskLevel: 'read', description: 'List Applications' },
	'applications.create': {
		riskLevel: 'write',
		description: 'Create Application',
	},
	'applications.get': { riskLevel: 'read', description: 'Get Application' },
	'applications.upsert': {
		riskLevel: 'write',
		description: 'Upsert Application',
	},
	'applications.delete': {
		riskLevel: 'destructive',
		description: 'Delete Application',
	},
	'applications.patch': {
		riskLevel: 'write',
		description: 'Patch Application',
	},
	'endpoints.list': { riskLevel: 'read', description: 'List Endpoints' },
	'endpoints.create': { riskLevel: 'write', description: 'Create Endpoint' },
	'endpoints.get': { riskLevel: 'read', description: 'Get Endpoint' },
	'endpoints.upsert': { riskLevel: 'write', description: 'Upsert Endpoint' },
	'endpoints.delete': {
		riskLevel: 'destructive',
		description: 'Delete Endpoint',
	},
	'endpoints.patch': { riskLevel: 'write', description: 'Patch Endpoint' },
	'endpoints.mcpEventsSubscribe': {
		riskLevel: 'write',
		description: 'Subscribe to MCP Events',
	},
	'endpoints.mcpEventsUnsubscribe': {
		riskLevel: 'destructive',
		description: 'Unsubscribe from MCP Events',
	},
	'endpoints.getSecret': {
		riskLevel: 'read',
		description: 'Get Endpoint Secret',
	},
	'endpoints.rotateSecret': {
		riskLevel: 'write',
		description: 'Rotate Endpoint Secret',
	},
	'endpoints.getHeaders': {
		riskLevel: 'read',
		description: 'Get Endpoint Headers',
	},
	'endpoints.setHeaders': {
		riskLevel: 'write',
		description: 'Set Endpoint Headers',
	},
	'endpoints.patchHeaders': {
		riskLevel: 'write',
		description: 'Patch Endpoint Headers',
	},
	'endpoints.transformationGet': {
		riskLevel: 'read',
		description: 'Get Endpoint Transformation',
	},
	'endpoints.transformationPatch': {
		riskLevel: 'write',
		description: 'Patch Endpoint Transformation',
	},
	'endpoints.replayMissing': {
		riskLevel: 'write',
		description: 'Replay Missing Webhooks',
	},
	'endpoints.bulkReplay': {
		riskLevel: 'write',
		description: 'Bulk Replay Messages',
	},
	'endpoints.getStats': { riskLevel: 'read', description: 'Endpoint Stats' },
	'endpoints.getAttemptStats': {
		riskLevel: 'read',
		description: 'Endpoint Attempt Stats',
	},
	'endpoints.recover': {
		riskLevel: 'write',
		description: 'Recover Failed Webhooks',
	},
	'endpoints.sendExample': {
		riskLevel: 'write',
		description: 'Send Event Type Example Message',
	},
	'eventTypes.list': { riskLevel: 'read', description: 'List Event Types' },
	'eventTypes.create': { riskLevel: 'write', description: 'Create Event Type' },
	'eventTypes.importOpenapi': {
		riskLevel: 'write',
		description: 'Event Type Import From Openapi',
	},
	'eventTypes.get': { riskLevel: 'read', description: 'Get Event Type' },
	'eventTypes.upsert': { riskLevel: 'write', description: 'Upsert Event Type' },
	'eventTypes.delete': {
		riskLevel: 'destructive',
		description: 'Delete Event Type',
	},
	'eventTypes.patch': { riskLevel: 'write', description: 'Patch Event Type' },
	'messages.list': { riskLevel: 'read', description: 'List Messages' },
	'messages.create': { riskLevel: 'write', description: 'Create Message' },
	'messages.createBatch': {
		riskLevel: 'write',
		description: 'Quickly Create a Batch of Messages',
	},
	'messages.precheck': {
		riskLevel: 'write',
		description: 'Create Message Precheck',
	},
	'messages.get': { riskLevel: 'read', description: 'Get Message' },
	'messages.expungeContent': {
		riskLevel: 'destructive',
		description: 'Expunge one message payload',
	},
	'messages.bulkExpungeContent': {
		riskLevel: 'destructive',
		description: 'Expunge a set of message payloads',
	},
	'messages.expungeAllContents': {
		riskLevel: 'destructive',
		description: 'Expunge all message contents for an application',
	},
	'attempts.listByEndpoint': {
		riskLevel: 'read',
		description: 'List Attempts By Endpoint',
	},
	'attempts.listByMsg': {
		riskLevel: 'read',
		description: 'List Attempts By Msg',
	},
	'attempts.listAttemptedMessages': {
		riskLevel: 'read',
		description: 'List Attempted Messages',
	},
	'attempts.listAttemptedDestinations': {
		riskLevel: 'read',
		description: 'List Attempted Destinations',
	},
	'attempts.get': { riskLevel: 'read', description: 'Get Attempt' },
	'attempts.expungeContent': {
		riskLevel: 'destructive',
		description: 'Delete attempt response body',
	},
	'attempts.resend': { riskLevel: 'write', description: 'Resend Webhook' },
	'messages.pollerPoll': { riskLevel: 'read', description: 'Poller Poll' },
	'messages.pollerConsumerSeek': {
		riskLevel: 'write',
		description: 'Poller Consumer Seek',
	},
	'messages.pollerConsumerPoll': {
		riskLevel: 'write',
		description: 'Poller Consumer Poll',
	},
	'operationalWebhooks.list': {
		riskLevel: 'read',
		description: 'List Operational Webhook Endpoints',
	},
	'operationalWebhooks.create': {
		riskLevel: 'write',
		description: 'Create Operational Webhook Endpoint',
	},
	'operationalWebhooks.get': {
		riskLevel: 'read',
		description: 'Get Operational Webhook Endpoint',
	},
	'operationalWebhooks.upsert': {
		riskLevel: 'write',
		description: 'Upsert Operational Webhook Endpoint',
	},
	'operationalWebhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete Operational Webhook Endpoint',
	},
	'operationalWebhooks.getSecret': {
		riskLevel: 'read',
		description: 'Get Operational Webhook Endpoint Secret',
	},
	'operationalWebhooks.rotateSecret': {
		riskLevel: 'write',
		description: 'Rotate Operational Webhook Endpoint Secret',
	},
	'operationalWebhooks.getHeaders': {
		riskLevel: 'read',
		description: 'Get Operational Webhook Endpoint Headers',
	},
	'operationalWebhooks.setHeaders': {
		riskLevel: 'write',
		description: 'Set Operational Webhook Endpoint Headers',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export const svixAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseSvixPlugin<T extends SvixPluginOptions> = CorsairPlugin<
	'svix',
	typeof SvixSchema,
	typeof endpoints,
	{},
	T,
	'api_key'
>;
export type InternalSvixPlugin = BaseSvixPlugin<SvixPluginOptions>;
export function svix<const T extends SvixPluginOptions>(
	incomingOptions: SvixPluginOptions & T = {} as SvixPluginOptions & T,
): BaseSvixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? 'api_key',
	};
	return {
		id: 'svix',
		authConfig: svixAuthConfig,
		schema: SvixSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: svixEndpointMeta,
		endpointSchemas: svixEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: SvixKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key')
				return (await ctx.keys.get_api_key()) ?? '';
			throw new AuthMissingError('svix', 'api_key');
		},
	} as BaseSvixPlugin<T>;
}
export type {
	SvixEndpointInputs,
	SvixEndpointOutputs,
	SvixOperationName,
} from './endpoints/types';

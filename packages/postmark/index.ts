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
import { Bounces, Email, Server, Templates } from './endpoints';
import type {
	PostmarkEndpointInputs,
	PostmarkEndpointOutputs,
} from './endpoints/types';
import {
	PostmarkEndpointInputSchemas,
	PostmarkEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PostmarkSchema } from './schema';

export const postmarkAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PostmarkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The server token. Overrides the stored `api_key`. */
	key?: string;
	hooks?: InternalPostmarkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postmarkEndpointsNested>;
};

export type PostmarkContext = CorsairPluginContext<
	typeof PostmarkSchema,
	PostmarkPluginOptions,
	undefined,
	typeof postmarkAuthConfig
>;

export type PostmarkKeyBuilderContext = KeyBuilderContext<
	PostmarkPluginOptions,
	typeof postmarkAuthConfig
>;

export type PostmarkBoundEndpoints = BindEndpoints<
	typeof postmarkEndpointsNested
>;

type PostmarkEndpoint<K extends keyof PostmarkEndpointOutputs> =
	CorsairEndpoint<
		PostmarkContext,
		PostmarkEndpointInputs[K],
		PostmarkEndpointOutputs[K]
	>;

export type PostmarkEndpoints = {
	emailSend: PostmarkEndpoint<'emailSend'>;
	emailSendBatch: PostmarkEndpoint<'emailSendBatch'>;
	templatesList: PostmarkEndpoint<'templatesList'>;
	templatesGet: PostmarkEndpoint<'templatesGet'>;
	templatesCreate: PostmarkEndpoint<'templatesCreate'>;
	templatesUpdate: PostmarkEndpoint<'templatesUpdate'>;
	templatesDelete: PostmarkEndpoint<'templatesDelete'>;
	templatesValidate: PostmarkEndpoint<'templatesValidate'>;
	serverGet: PostmarkEndpoint<'serverGet'>;
	serverUpdate: PostmarkEndpoint<'serverUpdate'>;
	streamsList: PostmarkEndpoint<'streamsList'>;
	streamsGet: PostmarkEndpoint<'streamsGet'>;
	streamsArchive: PostmarkEndpoint<'streamsArchive'>;
	bouncesList: PostmarkEndpoint<'bouncesList'>;
	bouncesGet: PostmarkEndpoint<'bouncesGet'>;
	bouncesActivate: PostmarkEndpoint<'bouncesActivate'>;
	statsDelivery: PostmarkEndpoint<'statsDelivery'>;
	statsOverview: PostmarkEndpoint<'statsOverview'>;
	statsSends: PostmarkEndpoint<'statsSends'>;
};

const postmarkEndpointsNested = {
	email: {
		send: Email.send,
		sendBatch: Email.sendBatch,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.remove,
		validate: Templates.validate,
	},
	server: {
		get: Server.get,
		update: Server.update,
	},
	streams: {
		list: Server.streams,
		get: Server.stream,
		archive: Server.archiveStream,
	},
	bounces: {
		list: Bounces.list,
		get: Bounces.get,
		activate: Bounces.activate,
		delivery: Bounces.delivery,
	},
	stats: {
		overview: Bounces.overview,
		sends: Bounces.sends,
	},
} as const;

export const postmarkEndpointSchemas = {
	'email.send': {
		input: PostmarkEndpointInputSchemas.emailSend,
		output: PostmarkEndpointOutputSchemas.emailSend,
	},
	'email.sendBatch': {
		input: PostmarkEndpointInputSchemas.emailSendBatch,
		output: PostmarkEndpointOutputSchemas.emailSendBatch,
	},
	'templates.list': {
		input: PostmarkEndpointInputSchemas.templatesList,
		output: PostmarkEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: PostmarkEndpointInputSchemas.templatesGet,
		output: PostmarkEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: PostmarkEndpointInputSchemas.templatesCreate,
		output: PostmarkEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: PostmarkEndpointInputSchemas.templatesUpdate,
		output: PostmarkEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: PostmarkEndpointInputSchemas.templatesDelete,
		output: PostmarkEndpointOutputSchemas.templatesDelete,
	},
	'templates.validate': {
		input: PostmarkEndpointInputSchemas.templatesValidate,
		output: PostmarkEndpointOutputSchemas.templatesValidate,
	},
	'server.get': {
		input: PostmarkEndpointInputSchemas.serverGet,
		output: PostmarkEndpointOutputSchemas.serverGet,
	},
	'server.update': {
		input: PostmarkEndpointInputSchemas.serverUpdate,
		output: PostmarkEndpointOutputSchemas.serverUpdate,
	},
	'streams.list': {
		input: PostmarkEndpointInputSchemas.streamsList,
		output: PostmarkEndpointOutputSchemas.streamsList,
	},
	'streams.get': {
		input: PostmarkEndpointInputSchemas.streamsGet,
		output: PostmarkEndpointOutputSchemas.streamsGet,
	},
	'streams.archive': {
		input: PostmarkEndpointInputSchemas.streamsArchive,
		output: PostmarkEndpointOutputSchemas.streamsArchive,
	},
	'bounces.list': {
		input: PostmarkEndpointInputSchemas.bouncesList,
		output: PostmarkEndpointOutputSchemas.bouncesList,
	},
	'bounces.get': {
		input: PostmarkEndpointInputSchemas.bouncesGet,
		output: PostmarkEndpointOutputSchemas.bouncesGet,
	},
	'bounces.activate': {
		input: PostmarkEndpointInputSchemas.bouncesActivate,
		output: PostmarkEndpointOutputSchemas.bouncesActivate,
	},
	'bounces.delivery': {
		input: PostmarkEndpointInputSchemas.statsDelivery,
		output: PostmarkEndpointOutputSchemas.statsDelivery,
	},
	'stats.overview': {
		input: PostmarkEndpointInputSchemas.statsOverview,
		output: PostmarkEndpointOutputSchemas.statsOverview,
	},
	'stats.sends': {
		input: PostmarkEndpointInputSchemas.statsSends,
		output: PostmarkEndpointOutputSchemas.statsSends,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postmarkEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const postmarkEndpointMeta = {
	'email.send': {
		riskLevel: 'destructive',
		description:
			'Send one transactional email. This delivers a real message and cannot be recalled once Postmark accepts it',
	},
	'email.sendBatch': {
		riskLevel: 'destructive',
		description:
			'Send up to 500 emails in one request. The response is a per-message result list, and a 200 does not mean every message was sent',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List the templates on this server, paged by `Count` and `Offset`',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template by id or alias',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a standard or layout template',
	},
	'templates.update': {
		riskLevel: 'write',
		description: "Change a template's name, subject, bodies or alias",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a template. Sends already made with it are unaffected, but it cannot be restored',
	},
	'templates.validate': {
		riskLevel: 'read',
		description:
			'Render a template against a model and report whether its subject and bodies are valid',
	},
	'server.get': {
		riskLevel: 'read',
		description:
			"Read this server's settings, including its delivery type and whether SMTP is on",
	},
	'server.update': {
		riskLevel: 'write',
		description:
			'Change server settings such as tracking, hook URLs and the inbound spam threshold',
	},
	'streams.list': {
		riskLevel: 'read',
		description: 'List the message streams on this server',
	},
	'streams.get': {
		riskLevel: 'read',
		description: 'Read one message stream',
	},
	'streams.archive': {
		riskLevel: 'destructive',
		description:
			'Archive a message stream, after which it can no longer send. The default transactional and inbound streams cannot be archived',
	},
	'bounces.list': {
		riskLevel: 'read',
		description:
			'List bounces filtered by type, address, tag, message or date window',
	},
	'bounces.get': {
		riskLevel: 'read',
		description: 'Read one bounce by its numeric id',
	},
	'bounces.activate': {
		riskLevel: 'write',
		description:
			'Reactivate an address Postmark deactivated after a bounce. A hard bounce that cannot be reactivated reports so',
	},
	'bounces.delivery': {
		riskLevel: 'read',
		description: 'Read delivery statistics broken down by bounce type',
	},
	'stats.overview': {
		riskLevel: 'read',
		description:
			'Read the outbound overview: sends, opens, clicks, bounces and spam complaints with their rates',
	},
	'stats.sends': {
		riskLevel: 'read',
		description: 'Read the daily sent count over a date window',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof postmarkEndpointsNested>;

export type BasePostmarkPlugin<T extends PostmarkPluginOptions> = CorsairPlugin<
	'postmark',
	typeof PostmarkSchema,
	typeof postmarkEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof postmarkAuthConfig
>;

export type InternalPostmarkPlugin = BasePostmarkPlugin<PostmarkPluginOptions>;

export type ExternalPostmarkPlugin<T extends PostmarkPluginOptions> =
	BasePostmarkPlugin<T>;

export function postmark<const T extends PostmarkPluginOptions>(
	incomingOptions: PostmarkPluginOptions & T = {} as PostmarkPluginOptions & T,
): ExternalPostmarkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postmark',
		authConfig: postmarkAuthConfig,
		schema: PostmarkSchema,
		options,
		hooks: options.hooks,
		endpoints: postmarkEndpointsNested,
		webhooks: {},
		endpointMeta: postmarkEndpointMeta,
		endpointSchemas: postmarkEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PostmarkKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('postmark', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPostmarkPlugin;
}

export { POSTMARK_SERVER_TOKEN_HEADER, PostmarkAPIError } from './client';
export type {
	BatchSendOutput,
	BounceActivatedOutput,
	BouncesGetInput,
	BouncesListInput,
	BouncesListOutput,
	DeliveryStatsInput,
	DeliveryStatsOutput,
	EmailBatchSendInput,
	EmailSendInput,
	PostmarkAttachment,
	PostmarkBounce,
	PostmarkEndpointInputs,
	PostmarkEndpointOutputs,
	PostmarkHeader,
	PostmarkMessageStream,
	PostmarkSendResult,
	PostmarkServer,
	PostmarkTemplate,
	SendOutput,
	ServerGetInput,
	ServerUpdateInput,
	StatsOverviewInput,
	StatsOverviewOutput,
	StatsSendsInput,
	StatsSendsOutput,
	StreamsActionOutput,
	StreamsArchiveInput,
	StreamsGetInput,
	StreamsListInput,
	StreamsListOutput,
	TemplatesCreateInput,
	TemplatesDeleteInput,
	TemplatesGetInput,
	TemplatesListInput,
	TemplatesListOutput,
	TemplatesUpdateInput,
	TemplatesValidateInput,
	TemplatesValidateOutput,
} from './endpoints/types';

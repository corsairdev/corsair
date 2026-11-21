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
	campaigns,
	fields,
	lists,
	members,
	reports,
	segments,
	webhooks,
} from './endpoints';
import type {
	LapostaEndpointInputs,
	LapostaEndpointOutputs,
} from './endpoints/types';
import {
	LapostaEndpointInputSchemas,
	LapostaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LapostaSchema } from './schema';

export type LapostaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLapostaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lapostaEndpointsNested>;
};

export type LapostaContext = CorsairPluginContext<
	typeof LapostaSchema,
	LapostaPluginOptions
>;

export type LapostaPluginContext = LapostaContext;

export type LapostaKeyBuilderContext = KeyBuilderContext<LapostaPluginOptions>;

export type LapostaBoundEndpoints = BindEndpoints<
	typeof lapostaEndpointsNested
>;

type LapostaEndpoint<K extends keyof LapostaEndpointOutputs> = CorsairEndpoint<
	LapostaContext,
	LapostaEndpointInputs[K],
	LapostaEndpointOutputs[K]
>;

export type LapostaEndpoints = {
	[K in keyof LapostaEndpointOutputs]: LapostaEndpoint<K>;
};

const lapostaEndpointsNested = {
	lists: {
		list: lists.list,
		get: lists.get,
		create: lists.create,
		update: lists.update,
		delete: lists.delete,
		purge_members: lists.purge_members,
		sync_members: lists.sync_members,
	},
	members: {
		list: members.list,
		get: members.get,
		create: members.create,
		update: members.update,
		delete: members.delete,
		history: members.history,
	},
	fields: {
		list: fields.list,
		get: fields.get,
		create: fields.create,
		update: fields.update,
		delete: fields.delete,
	},
	segments: {
		list: segments.list,
		get: segments.get,
		create: segments.create,
		update: segments.update,
		delete: segments.delete,
	},
	webhooks: {
		list: webhooks.list,
		get: webhooks.get,
		create: webhooks.create,
		update: webhooks.update,
		delete: webhooks.delete,
	},
	campaigns: {
		list: campaigns.list,
		create: campaigns.create,
		get: campaigns.get,
		update: campaigns.update,
		delete: campaigns.delete,
		history: campaigns.history,
		get_content: campaigns.get_content,
		update_content: campaigns.update_content,
		send: campaigns.send,
		schedule: campaigns.schedule,
		send_test: campaigns.send_test,
	},
	reports: {
		list: reports.list,
		get: reports.get,
	},
} as const;

export const lapostaEndpointSchemas = {
	'lists.list': {
		input: LapostaEndpointInputSchemas['lists.list'],
		output: LapostaEndpointOutputSchemas['lists.list'],
	},
	'lists.get': {
		input: LapostaEndpointInputSchemas['lists.get'],
		output: LapostaEndpointOutputSchemas['lists.get'],
	},
	'lists.create': {
		input: LapostaEndpointInputSchemas['lists.create'],
		output: LapostaEndpointOutputSchemas['lists.create'],
	},
	'lists.update': {
		input: LapostaEndpointInputSchemas['lists.update'],
		output: LapostaEndpointOutputSchemas['lists.update'],
	},
	'lists.delete': {
		input: LapostaEndpointInputSchemas['lists.delete'],
		output: LapostaEndpointOutputSchemas['lists.delete'],
	},
	'lists.purge_members': {
		input: LapostaEndpointInputSchemas['lists.purge_members'],
		output: LapostaEndpointOutputSchemas['lists.purge_members'],
	},
	'lists.sync_members': {
		input: LapostaEndpointInputSchemas['lists.sync_members'],
		output: LapostaEndpointOutputSchemas['lists.sync_members'],
	},
	'members.list': {
		input: LapostaEndpointInputSchemas['members.list'],
		output: LapostaEndpointOutputSchemas['members.list'],
	},
	'members.get': {
		input: LapostaEndpointInputSchemas['members.get'],
		output: LapostaEndpointOutputSchemas['members.get'],
	},
	'members.create': {
		input: LapostaEndpointInputSchemas['members.create'],
		output: LapostaEndpointOutputSchemas['members.create'],
	},
	'members.update': {
		input: LapostaEndpointInputSchemas['members.update'],
		output: LapostaEndpointOutputSchemas['members.update'],
	},
	'members.delete': {
		input: LapostaEndpointInputSchemas['members.delete'],
		output: LapostaEndpointOutputSchemas['members.delete'],
	},
	'members.history': {
		input: LapostaEndpointInputSchemas['members.history'],
		output: LapostaEndpointOutputSchemas['members.history'],
	},
	'fields.list': {
		input: LapostaEndpointInputSchemas['fields.list'],
		output: LapostaEndpointOutputSchemas['fields.list'],
	},
	'fields.get': {
		input: LapostaEndpointInputSchemas['fields.get'],
		output: LapostaEndpointOutputSchemas['fields.get'],
	},
	'fields.create': {
		input: LapostaEndpointInputSchemas['fields.create'],
		output: LapostaEndpointOutputSchemas['fields.create'],
	},
	'fields.update': {
		input: LapostaEndpointInputSchemas['fields.update'],
		output: LapostaEndpointOutputSchemas['fields.update'],
	},
	'fields.delete': {
		input: LapostaEndpointInputSchemas['fields.delete'],
		output: LapostaEndpointOutputSchemas['fields.delete'],
	},
	'segments.list': {
		input: LapostaEndpointInputSchemas['segments.list'],
		output: LapostaEndpointOutputSchemas['segments.list'],
	},
	'segments.get': {
		input: LapostaEndpointInputSchemas['segments.get'],
		output: LapostaEndpointOutputSchemas['segments.get'],
	},
	'segments.create': {
		input: LapostaEndpointInputSchemas['segments.create'],
		output: LapostaEndpointOutputSchemas['segments.create'],
	},
	'segments.update': {
		input: LapostaEndpointInputSchemas['segments.update'],
		output: LapostaEndpointOutputSchemas['segments.update'],
	},
	'segments.delete': {
		input: LapostaEndpointInputSchemas['segments.delete'],
		output: LapostaEndpointOutputSchemas['segments.delete'],
	},
	'webhooks.list': {
		input: LapostaEndpointInputSchemas['webhooks.list'],
		output: LapostaEndpointOutputSchemas['webhooks.list'],
	},
	'webhooks.get': {
		input: LapostaEndpointInputSchemas['webhooks.get'],
		output: LapostaEndpointOutputSchemas['webhooks.get'],
	},
	'webhooks.create': {
		input: LapostaEndpointInputSchemas['webhooks.create'],
		output: LapostaEndpointOutputSchemas['webhooks.create'],
	},
	'webhooks.update': {
		input: LapostaEndpointInputSchemas['webhooks.update'],
		output: LapostaEndpointOutputSchemas['webhooks.update'],
	},
	'webhooks.delete': {
		input: LapostaEndpointInputSchemas['webhooks.delete'],
		output: LapostaEndpointOutputSchemas['webhooks.delete'],
	},
	'campaigns.list': {
		input: LapostaEndpointInputSchemas['campaigns.list'],
		output: LapostaEndpointOutputSchemas['campaigns.list'],
	},
	'campaigns.create': {
		input: LapostaEndpointInputSchemas['campaigns.create'],
		output: LapostaEndpointOutputSchemas['campaigns.create'],
	},
	'campaigns.get': {
		input: LapostaEndpointInputSchemas['campaigns.get'],
		output: LapostaEndpointOutputSchemas['campaigns.get'],
	},
	'campaigns.update': {
		input: LapostaEndpointInputSchemas['campaigns.update'],
		output: LapostaEndpointOutputSchemas['campaigns.update'],
	},
	'campaigns.delete': {
		input: LapostaEndpointInputSchemas['campaigns.delete'],
		output: LapostaEndpointOutputSchemas['campaigns.delete'],
	},
	'campaigns.history': {
		input: LapostaEndpointInputSchemas['campaigns.history'],
		output: LapostaEndpointOutputSchemas['campaigns.history'],
	},
	'campaigns.get_content': {
		input: LapostaEndpointInputSchemas['campaigns.get_content'],
		output: LapostaEndpointOutputSchemas['campaigns.get_content'],
	},
	'campaigns.update_content': {
		input: LapostaEndpointInputSchemas['campaigns.update_content'],
		output: LapostaEndpointOutputSchemas['campaigns.update_content'],
	},
	'campaigns.send': {
		input: LapostaEndpointInputSchemas['campaigns.send'],
		output: LapostaEndpointOutputSchemas['campaigns.send'],
	},
	'campaigns.schedule': {
		input: LapostaEndpointInputSchemas['campaigns.schedule'],
		output: LapostaEndpointOutputSchemas['campaigns.schedule'],
	},
	'campaigns.send_test': {
		input: LapostaEndpointInputSchemas['campaigns.send_test'],
		output: LapostaEndpointOutputSchemas['campaigns.send_test'],
	},
	'reports.list': {
		input: LapostaEndpointInputSchemas['reports.list'],
		output: LapostaEndpointOutputSchemas['reports.list'],
	},
	'reports.get': {
		input: LapostaEndpointInputSchemas['reports.get'],
		output: LapostaEndpointOutputSchemas['reports.get'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof lapostaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const lapostaEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description: 'Retrieve all mailing lists',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific mailing list by ID',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new mailing list',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Update an existing mailing list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailing list',
	},
	'lists.purge_members': {
		riskLevel: 'destructive',
		description: 'Permanently remove every active member from a mailing list',
	},
	'lists.sync_members': {
		riskLevel: 'destructive',
		description: 'Add, update, or bulk-unsubscribe members in a mailing list',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'Retrieve subscribers for a mailing list',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific subscriber by ID',
	},
	'members.create': {
		riskLevel: 'destructive',
		description: 'Subscribe a member, which may send a confirmation email',
	},
	'members.update': {
		riskLevel: 'write',
		description: 'Update an existing subscriber',
	},
	'members.delete': {
		riskLevel: 'destructive',
		description: 'Unsubscribe or delete a member from a list',
	},
	'members.history': {
		riskLevel: 'read',
		description: 'Retrieve a member event history with cursor pagination',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'Retrieve custom fields for a mailing list',
	},
	'fields.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific custom field by ID',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a new custom field for a mailing list',
	},
	'fields.update': {
		riskLevel: 'destructive',
		description:
			'Update a custom field; changing its datatype removes stored values',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field from a mailing list',
	},
	'segments.list': {
		riskLevel: 'read',
		description: 'Retrieve all segments belonging to a mailing list',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Retrieve one mailing-list segment and its definition',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create a segment for a mailing list',
	},
	'segments.update': {
		riskLevel: 'write',
		description: 'Change a segment name or definition',
	},
	'segments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a mailing-list segment',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions configured for a mailing list',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Retrieve a webhook subscription and its signing secret',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for a mailing list',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Change a webhook subscription configuration',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a webhook subscription',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'Retrieve all email campaigns',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a regular email campaign',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific campaign by ID',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Update campaign metadata and recipients',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete an unsent or previously sent campaign',
	},
	'campaigns.history': {
		riskLevel: 'read',
		description: 'Retrieve paginated events for a campaign',
	},
	'campaigns.get_content': {
		riskLevel: 'read',
		description: 'Retrieve the HTML and plaintext campaign content',
	},
	'campaigns.update_content': {
		riskLevel: 'write',
		description: 'Set campaign content from HTML or an import URL',
	},
	'campaigns.send': {
		riskLevel: 'destructive',
		description: 'Send a campaign to its configured recipients',
	},
	'campaigns.schedule': {
		riskLevel: 'destructive',
		description: 'Schedule campaign delivery to its configured recipients',
	},
	'campaigns.send_test': {
		riskLevel: 'destructive',
		description: 'Send a campaign test email to the specified address',
	},
	'reports.list': {
		riskLevel: 'read',
		description: 'Retrieve paginated delivery reports for campaigns',
	},
	'reports.get': {
		riskLevel: 'read',
		description: 'Retrieve analytics and delivery report for a campaign',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lapostaEndpointsNested>;

export const lapostaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLapostaPlugin<T extends LapostaPluginOptions> = CorsairPlugin<
	'laposta',
	typeof LapostaSchema,
	typeof lapostaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalLapostaPlugin = BaseLapostaPlugin<LapostaPluginOptions>;

export type ExternalLapostaPlugin<T extends LapostaPluginOptions> =
	BaseLapostaPlugin<T>;

export function laposta<const T extends LapostaPluginOptions>(
	incomingOptions: LapostaPluginOptions & T = {} as LapostaPluginOptions & T,
): ExternalLapostaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'laposta',
		authConfig: lapostaAuthConfig,
		schema: LapostaSchema,
		options,
		hooks: options.hooks,
		endpoints: lapostaEndpointsNested,
		webhooks: {},
		endpointMeta: lapostaEndpointMeta,
		endpointSchemas: lapostaEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LapostaKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('laposta', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('laposta', 'api_key');
			return apiKey;
		},
	} satisfies InternalLapostaPlugin;
}

export type * from './endpoints/types';

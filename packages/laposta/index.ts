import { AuthMissingError } from 'corsair/core';
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
import { campaigns, fields, lists, members, reports } from './endpoints';
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

export type LapostaKeyBuilderContext =
	KeyBuilderContext<LapostaPluginOptions>;

export type LapostaBoundEndpoints = BindEndpoints<
	typeof lapostaEndpointsNested
>;

type LapostaEndpoint<K extends keyof LapostaEndpointOutputs> = CorsairEndpoint<
	LapostaContext,
	LapostaEndpointInputs[K],
	LapostaEndpointOutputs[K]
>;

export type LapostaEndpoints = {
	'lists.list': LapostaEndpoint<'lists.list'>;
	'lists.get': LapostaEndpoint<'lists.get'>;
	'lists.create': LapostaEndpoint<'lists.create'>;
	'lists.update': LapostaEndpoint<'lists.update'>;
	'lists.delete': LapostaEndpoint<'lists.delete'>;
	'members.list': LapostaEndpoint<'members.list'>;
	'members.get': LapostaEndpoint<'members.get'>;
	'members.create': LapostaEndpoint<'members.create'>;
	'members.update': LapostaEndpoint<'members.update'>;
	'members.delete': LapostaEndpoint<'members.delete'>;
	'fields.list': LapostaEndpoint<'fields.list'>;
	'fields.get': LapostaEndpoint<'fields.get'>;
	'fields.create': LapostaEndpoint<'fields.create'>;
	'fields.delete': LapostaEndpoint<'fields.delete'>;
	'campaigns.list': LapostaEndpoint<'campaigns.list'>;
	'campaigns.get': LapostaEndpoint<'campaigns.get'>;
	'reports.get': LapostaEndpoint<'reports.get'>;
};

const lapostaEndpointsNested = {
	lists: {
		list: lists.list,
		get: lists.get,
		create: lists.create,
		update: lists.update,
		delete: lists.delete,
	},
	members: {
		list: members.list,
		get: members.get,
		create: members.create,
		update: members.update,
		delete: members.delete,
	},
	fields: {
		list: fields.list,
		get: fields.get,
		create: fields.create,
		delete: fields.delete,
	},
	campaigns: {
		list: campaigns.list,
		get: campaigns.get,
	},
	reports: {
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
	'fields.delete': {
		input: LapostaEndpointInputSchemas['fields.delete'],
		output: LapostaEndpointOutputSchemas['fields.delete'],
	},
	'campaigns.list': {
		input: LapostaEndpointInputSchemas['campaigns.list'],
		output: LapostaEndpointOutputSchemas['campaigns.list'],
	},
	'campaigns.get': {
		input: LapostaEndpointInputSchemas['campaigns.get'],
		output: LapostaEndpointOutputSchemas['campaigns.get'],
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
	'members.list': {
		riskLevel: 'read',
		description: 'Retrieve subscribers for a mailing list',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific subscriber by ID',
	},
	'members.create': {
		riskLevel: 'write',
		description: 'Subscribe a new member to a mailing list',
	},
	'members.update': {
		riskLevel: 'write',
		description: 'Update an existing subscriber',
	},
	'members.delete': {
		riskLevel: 'destructive',
		description: 'Unsubscribe or delete a member from a list',
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
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field from a mailing list',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'Retrieve all email campaigns',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific campaign by ID',
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

export type {
	CreateFieldInput,
	CreateFieldOutput,
	CreateListInput,
	CreateListOutput,
	CreateMemberInput,
	CreateMemberOutput,
	DeleteFieldInput,
	DeleteFieldOutput,
	DeleteListInput,
	DeleteListOutput,
	DeleteMemberInput,
	DeleteMemberOutput,
	GetCampaignInput,
	GetCampaignOutput,
	GetCampaignsInput,
	GetCampaignsOutput,
	GetFieldInput,
	GetFieldOutput,
	GetFieldsInput,
	GetFieldsOutput,
	GetListInput,
	GetListOutput,
	GetListsInput,
	GetListsOutput,
	GetMemberInput,
	GetMemberOutput,
	GetMembersInput,
	GetMembersOutput,
	GetReportInput,
	GetReportOutput,
	LapostaEndpointInputs,
	LapostaEndpointOutputs,
	UpdateListInput,
	UpdateListOutput,
	UpdateMemberInput,
	UpdateMemberOutput,
} from './endpoints/types';

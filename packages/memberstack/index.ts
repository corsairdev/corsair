import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Api } from './endpoints';
import { inputs, outputs } from './endpoints/types';
import { mergeErrorHandlers } from './error-handlers';
import { MemberstackSchema } from './schema';

const endpoints = {
	members: {
		list: Api.membersList,
		get: Api.membersGet,
		create: Api.membersCreate,
		update: Api.membersUpdate,
		delete: Api.membersDelete,
		addPlan: Api.membersAddPlan,
		removePlan: Api.membersRemovePlan,
		verifyToken: Api.membersVerifyToken,
	},
	tables: { list: Api.tablesList, get: Api.tablesGet },
	records: {
		create: Api.recordsCreate,
		query: Api.recordsQuery,
		update: Api.recordsUpdate,
		delete: Api.recordsDelete,
	},
} as const;
export const memberstackEndpointSchemas = {
	'members.list': { input: inputs.membersList, output: outputs.membersList },
	'members.get': { input: inputs.membersGet, output: outputs.membersGet },
	'members.create': {
		input: inputs.membersCreate,
		output: outputs.membersCreate,
	},
	'members.update': {
		input: inputs.membersUpdate,
		output: outputs.membersUpdate,
	},
	'members.delete': {
		input: inputs.membersDelete,
		output: outputs.membersDelete,
	},
	'members.addPlan': {
		input: inputs.membersAddPlan,
		output: outputs.membersAddPlan,
	},
	'members.removePlan': {
		input: inputs.membersRemovePlan,
		output: outputs.membersRemovePlan,
	},
	'members.verifyToken': {
		input: inputs.membersVerifyToken,
		output: outputs.membersVerifyToken,
	},
	'tables.list': { input: inputs.tablesList, output: outputs.tablesList },
	'tables.get': { input: inputs.tablesGet, output: outputs.tablesGet },
	'records.create': {
		input: inputs.recordsCreate,
		output: outputs.recordsCreate,
	},
	'records.query': { input: inputs.recordsQuery, output: outputs.recordsQuery },
	'records.update': {
		input: inputs.recordsUpdate,
		output: outputs.recordsUpdate,
	},
	'records.delete': {
		input: inputs.recordsDelete,
		output: outputs.recordsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
const endpointMeta = {
	'members.list': {
		riskLevel: 'read',
		description: 'List members with cursor pagination',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get a member by ID or email; returns null when absent',
	},
	'members.create': {
		riskLevel: 'write',
		description: 'Create a member with optional free plans and custom data',
	},
	'members.update': {
		riskLevel: 'write',
		description: 'Update a member; JSON is replaced, not merged',
	},
	'members.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a member and optionally cancel subscriptions',
	},
	'members.addPlan': {
		riskLevel: 'write',
		description: 'Add a free plan to a member',
	},
	'members.removePlan': {
		riskLevel: 'write',
		description: 'Remove a free plan and revoke its access',
	},
	'members.verifyToken': {
		riskLevel: 'read',
		description: 'Verify a member JWT and return its decoded payload',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List data tables and their fields',
	},
	'tables.get': {
		riskLevel: 'read',
		description: 'Get a data table by key or ID',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a data table record',
	},
	'records.query': {
		riskLevel: 'read',
		description: 'Query data records with filters and pagination',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update fields on a data table record',
	},
	'records.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a data table record',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export type MemberstackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMemberstackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type MemberstackContext = CorsairPluginContext<
	typeof MemberstackSchema,
	MemberstackPluginOptions
>;
export type MemberstackBoundEndpoints = BindEndpoints<typeof endpoints>;
type BaseMemberstackPlugin<T extends MemberstackPluginOptions> = CorsairPlugin<
	'memberstack',
	typeof MemberstackSchema,
	typeof endpoints,
	{},
	T,
	'api_key'
>;
export type InternalMemberstackPlugin =
	BaseMemberstackPlugin<MemberstackPluginOptions>;
export type ExternalMemberstackPlugin<T extends MemberstackPluginOptions> =
	BaseMemberstackPlugin<T>;
export function memberstack<const T extends MemberstackPluginOptions>(
	incomingOptions: MemberstackPluginOptions &
		T = {} as MemberstackPluginOptions & T,
): ExternalMemberstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};
	return {
		id: 'memberstack',
		schema: MemberstackSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta,
		endpointSchemas: memberstackEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (
			ctx: KeyBuilderContext<MemberstackPluginOptions>,
			source,
		) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('memberstack', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMemberstackPlugin;
}
export type {
	MemberstackEndpointInputs,
	MemberstackEndpointOutputs,
} from './endpoints/types';

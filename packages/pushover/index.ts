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
	Apps,
	Glances,
	Groups,
	Licenses,
	Messages,
	Receipts,
	Sounds,
	Subscriptions,
	Teams,
	Users,
} from './endpoints';
import type {
	PushoverEndpointInputs,
	PushoverEndpointOutputs,
} from './endpoints/types';
import {
	PushoverEndpointInputSchemas as inputs,
	PushoverEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PushoverSchema } from './schema';

export type PushoverPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Application token, or a team token when calling team operations. */
	key?: string;
	hooks?: InternalPushoverPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type PushoverContext = CorsairPluginContext<
	typeof PushoverSchema,
	PushoverPluginOptions,
	undefined,
	typeof pushoverAuthConfig
>;
export type PushoverKeyBuilderContext = KeyBuilderContext<
	PushoverPluginOptions,
	typeof pushoverAuthConfig
>;
export type PushoverEndpoints = {
	[K in keyof PushoverEndpointOutputs]: CorsairEndpoint<
		PushoverContext,
		PushoverEndpointInputs[K],
		PushoverEndpointOutputs[K]
	>;
};
export type PushoverBoundEndpoints = BindEndpoints<typeof endpoints>;
const endpoints = {
	messages: Messages,
	users: Users,
	sounds: Sounds,
	apps: Apps,
	receipts: Receipts,
	groups: Groups,
	glances: Glances,
	subscriptions: Subscriptions,
	licenses: Licenses,
	teams: Teams,
} as const;
const webhooks = {} as const;

export const pushoverEndpointSchemas = {
	'messages.send': { input: inputs.messagesSend, output: outputs.messagesSend },
	'users.validate': {
		input: inputs.usersValidate,
		output: outputs.usersValidate,
	},
	'sounds.list': { input: inputs.soundsList, output: outputs.soundsList },
	'apps.limits': { input: inputs.appsLimits, output: outputs.appsLimits },
	'receipts.get': { input: inputs.receiptsGet, output: outputs.receiptsGet },
	'receipts.cancel': {
		input: inputs.receiptsCancel,
		output: outputs.receiptsCancel,
	},
	'receipts.cancelByTag': {
		input: inputs.receiptsCancelByTag,
		output: outputs.receiptsCancelByTag,
	},
	'groups.create': { input: inputs.groupsCreate, output: outputs.groupsCreate },
	'groups.list': { input: inputs.groupsList, output: outputs.groupsList },
	'groups.get': { input: inputs.groupsGet, output: outputs.groupsGet },
	'groups.addUser': {
		input: inputs.groupsAddUser,
		output: outputs.groupsAddUser,
	},
	'groups.removeUser': {
		input: inputs.groupsRemoveUser,
		output: outputs.groupsRemoveUser,
	},
	'groups.disableUser': {
		input: inputs.groupsDisableUser,
		output: outputs.groupsDisableUser,
	},
	'groups.enableUser': {
		input: inputs.groupsEnableUser,
		output: outputs.groupsEnableUser,
	},
	'groups.rename': { input: inputs.groupsRename, output: outputs.groupsRename },
	'glances.update': {
		input: inputs.glancesUpdate,
		output: outputs.glancesUpdate,
	},
	'subscriptions.migrate': {
		input: inputs.subscriptionsMigrate,
		output: outputs.subscriptionsMigrate,
	},
	'licenses.get': { input: inputs.licensesGet, output: outputs.licensesGet },
	'licenses.assign': {
		input: inputs.licensesAssign,
		output: outputs.licensesAssign,
	},
	'teams.get': { input: inputs.teamsGet, output: outputs.teamsGet },
	'teams.addUser': { input: inputs.teamsAddUser, output: outputs.teamsAddUser },
	'teams.revokeInvitation': {
		input: inputs.teamsRevokeInvitation,
		output: outputs.teamsRevokeInvitation,
	},
	'teams.removeUser': {
		input: inputs.teamsRemoveUser,
		output: outputs.teamsRemoveUser,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

const endpointMeta = {
	'messages.send': {
		riskLevel: 'destructive',
		description: 'Send a notification to a user or group',
	},
	'users.validate': {
		riskLevel: 'read',
		description: 'Validate a user or group and list its devices',
	},
	'sounds.list': {
		riskLevel: 'read',
		description: 'List available notification sounds',
	},
	'apps.limits': {
		riskLevel: 'read',
		description: 'Get the monthly message limit and remaining quota',
	},
	'receipts.get': {
		riskLevel: 'read',
		description: 'Get an emergency notification receipt',
	},
	'receipts.cancel': {
		riskLevel: 'write',
		description: 'Cancel retries for an emergency notification',
	},
	'receipts.cancelByTag': {
		riskLevel: 'write',
		description: 'Cancel emergency notification retries by tag',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a delivery group',
	},
	'groups.list': { riskLevel: 'read', description: 'List delivery groups' },
	'groups.get': {
		riskLevel: 'read',
		description: 'Get a delivery group and its users',
	},
	'groups.addUser': {
		riskLevel: 'write',
		description: 'Add a user to a delivery group',
	},
	'groups.removeUser': {
		riskLevel: 'destructive',
		description: 'Remove a user from a delivery group',
	},
	'groups.disableUser': {
		riskLevel: 'write',
		description: 'Disable a delivery group user',
	},
	'groups.enableUser': {
		riskLevel: 'write',
		description: 'Enable a delivery group user',
	},
	'groups.rename': {
		riskLevel: 'write',
		description: 'Rename a delivery group',
	},
	'glances.update': {
		riskLevel: 'write',
		description: 'Update a user widget glance',
	},
	'subscriptions.migrate': {
		riskLevel: 'write',
		description: 'Migrate a user key to a subscription key',
	},
	'licenses.get': {
		riskLevel: 'read',
		description: 'Get remaining license credits',
	},
	'licenses.assign': {
		riskLevel: 'destructive',
		description: 'Permanently assign a license credit',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get team details using a team token',
	},
	'teams.addUser': {
		riskLevel: 'destructive',
		description: 'Invite or add a team user using a team token',
	},
	'teams.revokeInvitation': {
		riskLevel: 'destructive',
		description: 'Revoke a team invitation using a team token',
	},
	'teams.removeUser': {
		riskLevel: 'destructive',
		description: 'Remove a team user using a team token',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

const defaultAuthType = 'api_key' as const;
export const pushoverAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
export type BasePushoverPlugin<T extends PushoverPluginOptions> = CorsairPlugin<
	'pushover',
	typeof PushoverSchema,
	typeof endpoints,
	typeof webhooks,
	T,
	typeof defaultAuthType,
	typeof pushoverAuthConfig
>;
export type InternalPushoverPlugin = BasePushoverPlugin<PushoverPluginOptions>;
export type ExternalPushoverPlugin<T extends PushoverPluginOptions> =
	BasePushoverPlugin<T>;
export function pushover<const T extends PushoverPluginOptions>(
	incomingOptions: PushoverPluginOptions & T = {} as PushoverPluginOptions & T,
): ExternalPushoverPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pushover',
		authConfig: pushoverAuthConfig,
		schema: PushoverSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints,
		webhooks,
		endpointMeta,
		endpointSchemas: pushoverEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: PushoverKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			const key = options.key ?? (await ctx.keys?.get_api_key());
			if (!key || !key.trim())
				throw new AuthMissingError('pushover', 'api_key');
			return key;
		},
	} satisfies InternalPushoverPlugin;
}
export {
	Apps,
	Glances,
	Groups,
	Licenses,
	Messages,
	Receipts,
	Sounds,
	Subscriptions,
	Teams,
	Users,
} from './endpoints';
export type {
	PushoverEndpointInputs,
	PushoverEndpointOutputs,
} from './endpoints/types';
export {
	PushoverEndpointInputSchemas,
	PushoverEndpointOutputSchemas,
} from './endpoints/types';
export { PushoverSchema } from './schema';

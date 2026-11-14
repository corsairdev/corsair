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
import type { JumpCloudRegion } from './client';
import { jumpCloudEndpointsNested } from './endpoints';
import type {
	JumpCloudEndpointInputs,
	JumpCloudEndpointOutputs,
} from './endpoints/types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JumpCloudSchema } from './schema';

export type JumpCloudPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The region the organization is hosted in: `us` (console.jumpcloud.com),
	 * `eu` (console.eu.jumpcloud.com) or `in` (console.in.jumpcloud.com). An API
	 * key only works on its own region's host. Overrides the `region` stored
	 * with the connected account; without either, requests go to `us`.
	 */
	region?: JumpCloudRegion;
	/**
	 * The organization ID a multi-tenant (MSP) administrator acts on, sent as
	 * the `x-org-id` header. Overrides the `org_id` stored with the connected
	 * account; single-organization keys leave both unset.
	 */
	orgId?: string;
	hooks?: InternalJumpCloudPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof jumpCloudEndpointsNested>;
};

/**
 * `region` and `org_id` are stored with the connected account next to the key.
 * Declaring them generates `ctx.keys.get_region()` and `ctx.keys.get_org_id()`,
 * which the client reads when the plugin options leave them unset. Both are
 * optional: no region means `us`, no organization ID means no `x-org-id`.
 */
export const jumpCloudAuthConfig = {
	api_key: {
		account: ['region', 'org_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type JumpCloudContext = CorsairPluginContext<
	typeof JumpCloudSchema,
	JumpCloudPluginOptions,
	undefined,
	typeof jumpCloudAuthConfig
>;

export type JumpCloudKeyBuilderContext = KeyBuilderContext<
	JumpCloudPluginOptions,
	typeof jumpCloudAuthConfig
>;

export type JumpCloudBoundEndpoints = BindEndpoints<
	typeof jumpCloudEndpointsNested
>;

type JumpCloudEndpoint<K extends keyof JumpCloudEndpointOutputs> =
	CorsairEndpoint<
		JumpCloudContext,
		JumpCloudEndpointInputs[K],
		JumpCloudEndpointOutputs[K]
	>;

export type JumpCloudEndpoints = {
	'users.list': JumpCloudEndpoint<'users.list'>;
	'users.create': JumpCloudEndpoint<'users.create'>;
	'users.get': JumpCloudEndpoint<'users.get'>;
	'users.update': JumpCloudEndpoint<'users.update'>;
	'users.delete': JumpCloudEndpoint<'users.delete'>;
	'users.setPassword': JumpCloudEndpoint<'users.setPassword'>;
	'users.unlock': JumpCloudEndpoint<'users.unlock'>;
	'users.expirePassword': JumpCloudEndpoint<'users.expirePassword'>;
	'users.resetMfa': JumpCloudEndpoint<'users.resetMfa'>;
	'users.enforceMfa': JumpCloudEndpoint<'users.enforceMfa'>;
	'users.syncMfa': JumpCloudEndpoint<'users.syncMfa'>;
	'users.listSshKeys': JumpCloudEndpoint<'users.listSshKeys'>;
	'systems.list': JumpCloudEndpoint<'systems.list'>;
	'systems.get': JumpCloudEndpoint<'systems.get'>;
	'systems.delete': JumpCloudEndpoint<'systems.delete'>;
	'search.systemUsers': JumpCloudEndpoint<'search.systemUsers'>;
	'search.systems': JumpCloudEndpoint<'search.systems'>;
	'commands.list': JumpCloudEndpoint<'commands.list'>;
	'commands.create': JumpCloudEndpoint<'commands.create'>;
	'commands.get': JumpCloudEndpoint<'commands.get'>;
	'commands.run': JumpCloudEndpoint<'commands.run'>;
	'applications.list': JumpCloudEndpoint<'applications.list'>;
	'applications.get': JumpCloudEndpoint<'applications.get'>;
	'organizations.list': JumpCloudEndpoint<'organizations.list'>;
	'organizations.get': JumpCloudEndpoint<'organizations.get'>;
	'userGroups.list': JumpCloudEndpoint<'userGroups.list'>;
	'userGroups.create': JumpCloudEndpoint<'userGroups.create'>;
	'userGroups.get': JumpCloudEndpoint<'userGroups.get'>;
	'userGroups.update': JumpCloudEndpoint<'userGroups.update'>;
	'userGroups.delete': JumpCloudEndpoint<'userGroups.delete'>;
	'userGroups.listMembers': JumpCloudEndpoint<'userGroups.listMembers'>;
	'userGroups.manageMembers': JumpCloudEndpoint<'userGroups.manageMembers'>;
	'userGroups.listMembership': JumpCloudEndpoint<'userGroups.listMembership'>;
	'systemGroups.list': JumpCloudEndpoint<'systemGroups.list'>;
	'systemGroups.create': JumpCloudEndpoint<'systemGroups.create'>;
	'systemGroups.get': JumpCloudEndpoint<'systemGroups.get'>;
	'systemGroups.update': JumpCloudEndpoint<'systemGroups.update'>;
	'systemGroups.delete': JumpCloudEndpoint<'systemGroups.delete'>;
	'systemGroups.manageMembers': JumpCloudEndpoint<'systemGroups.manageMembers'>;
	'policies.list': JumpCloudEndpoint<'policies.list'>;
	'policies.create': JumpCloudEndpoint<'policies.create'>;
	'policies.get': JumpCloudEndpoint<'policies.get'>;
	'policies.update': JumpCloudEndpoint<'policies.update'>;
	'policies.delete': JumpCloudEndpoint<'policies.delete'>;
	'policies.listStatuses': JumpCloudEndpoint<'policies.listStatuses'>;
	'systems.listUsers': JumpCloudEndpoint<'systems.listUsers'>;
	'systems.listPolicyStatuses': JumpCloudEndpoint<'systems.listPolicyStatuses'>;
	'systems.listAssociations': JumpCloudEndpoint<'systems.listAssociations'>;
};

export const jumpCloudEndpointSchemas = {
	'users.list': {
		input: JumpCloudEndpointInputSchemas['users.list'],
		output: JumpCloudEndpointOutputSchemas['users.list'],
	},
	'users.create': {
		input: JumpCloudEndpointInputSchemas['users.create'],
		output: JumpCloudEndpointOutputSchemas['users.create'],
	},
	'users.get': {
		input: JumpCloudEndpointInputSchemas['users.get'],
		output: JumpCloudEndpointOutputSchemas['users.get'],
	},
	'users.update': {
		input: JumpCloudEndpointInputSchemas['users.update'],
		output: JumpCloudEndpointOutputSchemas['users.update'],
	},
	'users.delete': {
		input: JumpCloudEndpointInputSchemas['users.delete'],
		output: JumpCloudEndpointOutputSchemas['users.delete'],
	},
	'users.setPassword': {
		input: JumpCloudEndpointInputSchemas['users.setPassword'],
		output: JumpCloudEndpointOutputSchemas['users.setPassword'],
	},
	'users.unlock': {
		input: JumpCloudEndpointInputSchemas['users.unlock'],
		output: JumpCloudEndpointOutputSchemas['users.unlock'],
	},
	'users.expirePassword': {
		input: JumpCloudEndpointInputSchemas['users.expirePassword'],
		output: JumpCloudEndpointOutputSchemas['users.expirePassword'],
	},
	'users.resetMfa': {
		input: JumpCloudEndpointInputSchemas['users.resetMfa'],
		output: JumpCloudEndpointOutputSchemas['users.resetMfa'],
	},
	'users.enforceMfa': {
		input: JumpCloudEndpointInputSchemas['users.enforceMfa'],
		output: JumpCloudEndpointOutputSchemas['users.enforceMfa'],
	},
	'users.syncMfa': {
		input: JumpCloudEndpointInputSchemas['users.syncMfa'],
		output: JumpCloudEndpointOutputSchemas['users.syncMfa'],
	},
	'users.listSshKeys': {
		input: JumpCloudEndpointInputSchemas['users.listSshKeys'],
		output: JumpCloudEndpointOutputSchemas['users.listSshKeys'],
	},
	'systems.list': {
		input: JumpCloudEndpointInputSchemas['systems.list'],
		output: JumpCloudEndpointOutputSchemas['systems.list'],
	},
	'systems.get': {
		input: JumpCloudEndpointInputSchemas['systems.get'],
		output: JumpCloudEndpointOutputSchemas['systems.get'],
	},
	'systems.delete': {
		input: JumpCloudEndpointInputSchemas['systems.delete'],
		output: JumpCloudEndpointOutputSchemas['systems.delete'],
	},
	'search.systemUsers': {
		input: JumpCloudEndpointInputSchemas['search.systemUsers'],
		output: JumpCloudEndpointOutputSchemas['search.systemUsers'],
	},
	'search.systems': {
		input: JumpCloudEndpointInputSchemas['search.systems'],
		output: JumpCloudEndpointOutputSchemas['search.systems'],
	},
	'commands.list': {
		input: JumpCloudEndpointInputSchemas['commands.list'],
		output: JumpCloudEndpointOutputSchemas['commands.list'],
	},
	'commands.create': {
		input: JumpCloudEndpointInputSchemas['commands.create'],
		output: JumpCloudEndpointOutputSchemas['commands.create'],
	},
	'commands.get': {
		input: JumpCloudEndpointInputSchemas['commands.get'],
		output: JumpCloudEndpointOutputSchemas['commands.get'],
	},
	'commands.run': {
		input: JumpCloudEndpointInputSchemas['commands.run'],
		output: JumpCloudEndpointOutputSchemas['commands.run'],
	},
	'applications.list': {
		input: JumpCloudEndpointInputSchemas['applications.list'],
		output: JumpCloudEndpointOutputSchemas['applications.list'],
	},
	'applications.get': {
		input: JumpCloudEndpointInputSchemas['applications.get'],
		output: JumpCloudEndpointOutputSchemas['applications.get'],
	},
	'organizations.list': {
		input: JumpCloudEndpointInputSchemas['organizations.list'],
		output: JumpCloudEndpointOutputSchemas['organizations.list'],
	},
	'organizations.get': {
		input: JumpCloudEndpointInputSchemas['organizations.get'],
		output: JumpCloudEndpointOutputSchemas['organizations.get'],
	},
	'userGroups.list': {
		input: JumpCloudEndpointInputSchemas['userGroups.list'],
		output: JumpCloudEndpointOutputSchemas['userGroups.list'],
	},
	'userGroups.create': {
		input: JumpCloudEndpointInputSchemas['userGroups.create'],
		output: JumpCloudEndpointOutputSchemas['userGroups.create'],
	},
	'userGroups.get': {
		input: JumpCloudEndpointInputSchemas['userGroups.get'],
		output: JumpCloudEndpointOutputSchemas['userGroups.get'],
	},
	'userGroups.update': {
		input: JumpCloudEndpointInputSchemas['userGroups.update'],
		output: JumpCloudEndpointOutputSchemas['userGroups.update'],
	},
	'userGroups.delete': {
		input: JumpCloudEndpointInputSchemas['userGroups.delete'],
		output: JumpCloudEndpointOutputSchemas['userGroups.delete'],
	},
	'userGroups.listMembers': {
		input: JumpCloudEndpointInputSchemas['userGroups.listMembers'],
		output: JumpCloudEndpointOutputSchemas['userGroups.listMembers'],
	},
	'userGroups.manageMembers': {
		input: JumpCloudEndpointInputSchemas['userGroups.manageMembers'],
		output: JumpCloudEndpointOutputSchemas['userGroups.manageMembers'],
	},
	'userGroups.listMembership': {
		input: JumpCloudEndpointInputSchemas['userGroups.listMembership'],
		output: JumpCloudEndpointOutputSchemas['userGroups.listMembership'],
	},
	'systemGroups.list': {
		input: JumpCloudEndpointInputSchemas['systemGroups.list'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.list'],
	},
	'systemGroups.create': {
		input: JumpCloudEndpointInputSchemas['systemGroups.create'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.create'],
	},
	'systemGroups.get': {
		input: JumpCloudEndpointInputSchemas['systemGroups.get'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.get'],
	},
	'systemGroups.update': {
		input: JumpCloudEndpointInputSchemas['systemGroups.update'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.update'],
	},
	'systemGroups.delete': {
		input: JumpCloudEndpointInputSchemas['systemGroups.delete'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.delete'],
	},
	'systemGroups.manageMembers': {
		input: JumpCloudEndpointInputSchemas['systemGroups.manageMembers'],
		output: JumpCloudEndpointOutputSchemas['systemGroups.manageMembers'],
	},
	'policies.list': {
		input: JumpCloudEndpointInputSchemas['policies.list'],
		output: JumpCloudEndpointOutputSchemas['policies.list'],
	},
	'policies.create': {
		input: JumpCloudEndpointInputSchemas['policies.create'],
		output: JumpCloudEndpointOutputSchemas['policies.create'],
	},
	'policies.get': {
		input: JumpCloudEndpointInputSchemas['policies.get'],
		output: JumpCloudEndpointOutputSchemas['policies.get'],
	},
	'policies.update': {
		input: JumpCloudEndpointInputSchemas['policies.update'],
		output: JumpCloudEndpointOutputSchemas['policies.update'],
	},
	'policies.delete': {
		input: JumpCloudEndpointInputSchemas['policies.delete'],
		output: JumpCloudEndpointOutputSchemas['policies.delete'],
	},
	'policies.listStatuses': {
		input: JumpCloudEndpointInputSchemas['policies.listStatuses'],
		output: JumpCloudEndpointOutputSchemas['policies.listStatuses'],
	},
	'systems.listUsers': {
		input: JumpCloudEndpointInputSchemas['systems.listUsers'],
		output: JumpCloudEndpointOutputSchemas['systems.listUsers'],
	},
	'systems.listPolicyStatuses': {
		input: JumpCloudEndpointInputSchemas['systems.listPolicyStatuses'],
		output: JumpCloudEndpointOutputSchemas['systems.listPolicyStatuses'],
	},
	'systems.listAssociations': {
		input: JumpCloudEndpointInputSchemas['systems.listAssociations'],
		output: JumpCloudEndpointOutputSchemas['systems.listAssociations'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof jumpCloudEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const jumpCloudEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description: 'List JumpCloud system users with limit/skip pagination',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a JumpCloud system user',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud system user by ID',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a JumpCloud system user',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a JumpCloud system user',
	},
	'users.setPassword': {
		riskLevel: 'destructive',
		description:
			"Force-set a system user's password, replacing the current one",
	},
	'users.unlock': {
		riskLevel: 'write',
		description: 'Unlock a locked system user',
	},
	'users.expirePassword': {
		riskLevel: 'destructive',
		description:
			"Expire a system user's password so they must reset it at next login",
	},
	'users.resetMfa': {
		riskLevel: 'destructive',
		description:
			"Reset a system user's MFA (TOTP key) and start a new enrollment period",
	},
	'users.enforceMfa': {
		riskLevel: 'destructive',
		description:
			"Update a system user's MFA requirement; an unenrolled user is locked out of MFA-protected resources once any exclusion ends",
	},
	'users.syncMfa': {
		riskLevel: 'write',
		description: 'Sync system user MFA',
	},
	'users.listSshKeys': {
		riskLevel: 'read',
		description: 'List SSH keys of a system user',
	},
	'systems.list': {
		riskLevel: 'read',
		description: 'List JumpCloud systems with pagination',
	},
	'systems.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud system by ID',
	},
	'systems.delete': {
		riskLevel: 'destructive',
		description: 'Delete a JumpCloud system',
	},
	'search.systemUsers': {
		riskLevel: 'read',
		description: 'Search JumpCloud system users (POST body search)',
	},
	'search.systems': {
		riskLevel: 'read',
		description: 'Search JumpCloud systems (POST body search)',
	},
	'commands.list': {
		riskLevel: 'read',
		description: 'List JumpCloud commands with pagination',
	},
	'commands.create': {
		riskLevel: 'write',
		description: 'Create a JumpCloud command',
	},
	'commands.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud command by ID',
	},
	'commands.run': {
		riskLevel: 'destructive',
		description: 'Run a command against target systems',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List JumpCloud applications with pagination',
	},
	'applications.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud application by ID',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List JumpCloud organizations',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud organization by ID',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description: 'List JumpCloud user groups with pagination',
	},
	'userGroups.create': {
		riskLevel: 'write',
		description: 'Create a JumpCloud user group',
	},
	'userGroups.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud user group by ID',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description: 'Update a JumpCloud user group',
	},
	'userGroups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a JumpCloud user group',
	},
	'userGroups.listMembers': {
		riskLevel: 'read',
		description: 'List members of a user group',
	},
	'userGroups.manageMembers': {
		riskLevel: 'write',
		description: 'Manage (add or remove) members of a user group',
	},
	'userGroups.listMembership': {
		riskLevel: 'read',
		description: "List a user group's membership graph",
	},
	'systemGroups.list': {
		riskLevel: 'read',
		description: 'List JumpCloud system groups with pagination',
	},
	'systemGroups.create': {
		riskLevel: 'write',
		description: 'Create a JumpCloud system group',
	},
	'systemGroups.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud system group by ID',
	},
	'systemGroups.update': {
		riskLevel: 'write',
		description: 'Update a JumpCloud system group',
	},
	'systemGroups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a JumpCloud system group',
	},
	'systemGroups.manageMembers': {
		riskLevel: 'write',
		description: 'Manage (add or remove) members of a system group',
	},
	'policies.list': {
		riskLevel: 'read',
		description: 'List JumpCloud policies with pagination',
	},
	'policies.create': {
		riskLevel: 'write',
		description: 'Create a JumpCloud policy',
	},
	'policies.get': {
		riskLevel: 'read',
		description: 'Get a JumpCloud policy by ID',
	},
	'policies.update': {
		riskLevel: 'write',
		description: 'Update a JumpCloud policy',
	},
	'policies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a JumpCloud policy',
	},
	'policies.listStatuses': {
		riskLevel: 'read',
		description: 'List policy statuses for a policy',
	},
	'systems.listUsers': {
		riskLevel: 'read',
		description: 'List users bound to a system',
	},
	'systems.listPolicyStatuses': {
		riskLevel: 'read',
		description: 'List policy statuses for a system',
	},
	'systems.listAssociations': {
		riskLevel: 'read',
		description: 'List associations for a system',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof jumpCloudEndpointsNested
>;

export type BaseJumpCloudPlugin<T extends JumpCloudPluginOptions> =
	CorsairPlugin<
		'jumpcloud',
		typeof JumpCloudSchema,
		typeof jumpCloudEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof jumpCloudAuthConfig
	>;

export type InternalJumpCloudPlugin =
	BaseJumpCloudPlugin<JumpCloudPluginOptions>;

export type ExternalJumpCloudPlugin<T extends JumpCloudPluginOptions> =
	BaseJumpCloudPlugin<T>;

export function jumpcloud<const T extends JumpCloudPluginOptions>(
	incomingOptions: JumpCloudPluginOptions & T = {} as JumpCloudPluginOptions &
		T,
): ExternalJumpCloudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'jumpcloud',
		authConfig: jumpCloudAuthConfig,
		schema: JumpCloudSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: jumpCloudEndpointsNested,
		webhooks: {} as const,
		endpointMeta: jumpCloudEndpointMeta,
		endpointSchemas: jumpCloudEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: JumpCloudKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('jumpcloud', 'api_key');
				}
				return apiKey;
			}
			throw new AuthMissingError('jumpcloud', 'api_key');
		},
	} satisfies InternalJumpCloudPlugin;
}

export type {
	JumpCloudEndpointInputs,
	JumpCloudEndpointOutputs,
} from './endpoints/types';

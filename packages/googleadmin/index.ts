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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	CustomersEndpoints,
	DomainsEndpoints,
	GroupAliasesEndpoints,
	GroupsEndpoints,
	MembersEndpoints,
	OrgUnitsEndpoints,
	UserAliasesEndpoints,
	UserPhotosEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	GoogleAdminEndpointInputs,
	GoogleAdminEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAdminEndpointInputSchemas,
	GoogleAdminEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleAdminSchema } from './schema';

export type GoogleAdminPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalGoogleAdminPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleAdminEndpointsNested>;
};

export type GoogleAdminContext = CorsairPluginContext<
	typeof GoogleAdminSchema,
	GoogleAdminPluginOptions
>;

export type GoogleAdminKeyBuilderContext = KeyBuilderContext<
	GoogleAdminPluginOptions,
	typeof googleAdminAuthConfig
>;

export type GoogleAdminBoundEndpoints = BindEndpoints<
	typeof googleAdminEndpointsNested
>;

type GoogleAdminEndpoint<K extends keyof GoogleAdminEndpointOutputs> =
	CorsairEndpoint<
		GoogleAdminContext,
		GoogleAdminEndpointInputs[K],
		GoogleAdminEndpointOutputs[K]
	>;

export type GoogleAdminEndpoints = {
	usersList: GoogleAdminEndpoint<'usersList'>;
	usersGet: GoogleAdminEndpoint<'usersGet'>;
	usersInsert: GoogleAdminEndpoint<'usersInsert'>;
	usersUpdate: GoogleAdminEndpoint<'usersUpdate'>;
	usersDelete: GoogleAdminEndpoint<'usersDelete'>;
	usersUndelete: GoogleAdminEndpoint<'usersUndelete'>;
	usersMakeAdmin: GoogleAdminEndpoint<'usersMakeAdmin'>;
	usersSignOut: GoogleAdminEndpoint<'usersSignOut'>;
	usersAliasesList: GoogleAdminEndpoint<'usersAliasesList'>;
	usersAliasesInsert: GoogleAdminEndpoint<'usersAliasesInsert'>;
	usersAliasesDelete: GoogleAdminEndpoint<'usersAliasesDelete'>;
	usersPhotosGet: GoogleAdminEndpoint<'usersPhotosGet'>;
	usersPhotosUpdate: GoogleAdminEndpoint<'usersPhotosUpdate'>;
	usersPhotosDelete: GoogleAdminEndpoint<'usersPhotosDelete'>;
	groupsList: GoogleAdminEndpoint<'groupsList'>;
	groupsGet: GoogleAdminEndpoint<'groupsGet'>;
	groupsInsert: GoogleAdminEndpoint<'groupsInsert'>;
	groupsUpdate: GoogleAdminEndpoint<'groupsUpdate'>;
	groupsDelete: GoogleAdminEndpoint<'groupsDelete'>;
	groupsAliasesList: GoogleAdminEndpoint<'groupsAliasesList'>;
	groupsAliasesInsert: GoogleAdminEndpoint<'groupsAliasesInsert'>;
	groupsAliasesDelete: GoogleAdminEndpoint<'groupsAliasesDelete'>;
	membersList: GoogleAdminEndpoint<'membersList'>;
	membersGet: GoogleAdminEndpoint<'membersGet'>;
	membersHasMember: GoogleAdminEndpoint<'membersHasMember'>;
	membersInsert: GoogleAdminEndpoint<'membersInsert'>;
	membersUpdate: GoogleAdminEndpoint<'membersUpdate'>;
	membersDelete: GoogleAdminEndpoint<'membersDelete'>;
	orgUnitsList: GoogleAdminEndpoint<'orgUnitsList'>;
	orgUnitsGet: GoogleAdminEndpoint<'orgUnitsGet'>;
	orgUnitsInsert: GoogleAdminEndpoint<'orgUnitsInsert'>;
	orgUnitsUpdate: GoogleAdminEndpoint<'orgUnitsUpdate'>;
	orgUnitsDelete: GoogleAdminEndpoint<'orgUnitsDelete'>;
	domainsList: GoogleAdminEndpoint<'domainsList'>;
	domainsGet: GoogleAdminEndpoint<'domainsGet'>;
	domainAliasesList: GoogleAdminEndpoint<'domainAliasesList'>;
	customersGet: GoogleAdminEndpoint<'customersGet'>;
};

const googleAdminEndpointsNested = {
	users: {
		list: UsersEndpoints.list,
		get: UsersEndpoints.get,
		insert: UsersEndpoints.insert,
		update: UsersEndpoints.update,
		delete: UsersEndpoints.delete,
		undelete: UsersEndpoints.undelete,
		makeAdmin: UsersEndpoints.makeAdmin,
		signOut: UsersEndpoints.signOut,
		aliases: UserAliasesEndpoints,
		photos: UserPhotosEndpoints,
	},
	groups: {
		list: GroupsEndpoints.list,
		get: GroupsEndpoints.get,
		insert: GroupsEndpoints.insert,
		update: GroupsEndpoints.update,
		delete: GroupsEndpoints.delete,
		aliases: GroupAliasesEndpoints,
	},
	members: MembersEndpoints,
	orgUnits: OrgUnitsEndpoints,
	domains: {
		list: DomainsEndpoints.list,
		get: DomainsEndpoints.get,
		aliases: { list: DomainsEndpoints.aliasesList },
	},
	customers: CustomersEndpoints,
} as const;

export const googleAdminEndpointSchemas = {
	'users.list': {
		input: GoogleAdminEndpointInputSchemas.usersList,
		output: GoogleAdminEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: GoogleAdminEndpointInputSchemas.usersGet,
		output: GoogleAdminEndpointOutputSchemas.usersGet,
	},
	'users.insert': {
		input: GoogleAdminEndpointInputSchemas.usersInsert,
		output: GoogleAdminEndpointOutputSchemas.usersInsert,
	},
	'users.update': {
		input: GoogleAdminEndpointInputSchemas.usersUpdate,
		output: GoogleAdminEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: GoogleAdminEndpointInputSchemas.usersDelete,
		output: GoogleAdminEndpointOutputSchemas.usersDelete,
	},
	'users.undelete': {
		input: GoogleAdminEndpointInputSchemas.usersUndelete,
		output: GoogleAdminEndpointOutputSchemas.usersUndelete,
	},
	'users.makeAdmin': {
		input: GoogleAdminEndpointInputSchemas.usersMakeAdmin,
		output: GoogleAdminEndpointOutputSchemas.usersMakeAdmin,
	},
	'users.signOut': {
		input: GoogleAdminEndpointInputSchemas.usersSignOut,
		output: GoogleAdminEndpointOutputSchemas.usersSignOut,
	},
	'users.aliases.list': {
		input: GoogleAdminEndpointInputSchemas.usersAliasesList,
		output: GoogleAdminEndpointOutputSchemas.usersAliasesList,
	},
	'users.aliases.insert': {
		input: GoogleAdminEndpointInputSchemas.usersAliasesInsert,
		output: GoogleAdminEndpointOutputSchemas.usersAliasesInsert,
	},
	'users.aliases.delete': {
		input: GoogleAdminEndpointInputSchemas.usersAliasesDelete,
		output: GoogleAdminEndpointOutputSchemas.usersAliasesDelete,
	},
	'users.photos.get': {
		input: GoogleAdminEndpointInputSchemas.usersPhotosGet,
		output: GoogleAdminEndpointOutputSchemas.usersPhotosGet,
	},
	'users.photos.update': {
		input: GoogleAdminEndpointInputSchemas.usersPhotosUpdate,
		output: GoogleAdminEndpointOutputSchemas.usersPhotosUpdate,
	},
	'users.photos.delete': {
		input: GoogleAdminEndpointInputSchemas.usersPhotosDelete,
		output: GoogleAdminEndpointOutputSchemas.usersPhotosDelete,
	},
	'groups.list': {
		input: GoogleAdminEndpointInputSchemas.groupsList,
		output: GoogleAdminEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: GoogleAdminEndpointInputSchemas.groupsGet,
		output: GoogleAdminEndpointOutputSchemas.groupsGet,
	},
	'groups.insert': {
		input: GoogleAdminEndpointInputSchemas.groupsInsert,
		output: GoogleAdminEndpointOutputSchemas.groupsInsert,
	},
	'groups.update': {
		input: GoogleAdminEndpointInputSchemas.groupsUpdate,
		output: GoogleAdminEndpointOutputSchemas.groupsUpdate,
	},
	'groups.delete': {
		input: GoogleAdminEndpointInputSchemas.groupsDelete,
		output: GoogleAdminEndpointOutputSchemas.groupsDelete,
	},
	'groups.aliases.list': {
		input: GoogleAdminEndpointInputSchemas.groupsAliasesList,
		output: GoogleAdminEndpointOutputSchemas.groupsAliasesList,
	},
	'groups.aliases.insert': {
		input: GoogleAdminEndpointInputSchemas.groupsAliasesInsert,
		output: GoogleAdminEndpointOutputSchemas.groupsAliasesInsert,
	},
	'groups.aliases.delete': {
		input: GoogleAdminEndpointInputSchemas.groupsAliasesDelete,
		output: GoogleAdminEndpointOutputSchemas.groupsAliasesDelete,
	},
	'members.list': {
		input: GoogleAdminEndpointInputSchemas.membersList,
		output: GoogleAdminEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: GoogleAdminEndpointInputSchemas.membersGet,
		output: GoogleAdminEndpointOutputSchemas.membersGet,
	},
	'members.hasMember': {
		input: GoogleAdminEndpointInputSchemas.membersHasMember,
		output: GoogleAdminEndpointOutputSchemas.membersHasMember,
	},
	'members.insert': {
		input: GoogleAdminEndpointInputSchemas.membersInsert,
		output: GoogleAdminEndpointOutputSchemas.membersInsert,
	},
	'members.update': {
		input: GoogleAdminEndpointInputSchemas.membersUpdate,
		output: GoogleAdminEndpointOutputSchemas.membersUpdate,
	},
	'members.delete': {
		input: GoogleAdminEndpointInputSchemas.membersDelete,
		output: GoogleAdminEndpointOutputSchemas.membersDelete,
	},
	'orgUnits.list': {
		input: GoogleAdminEndpointInputSchemas.orgUnitsList,
		output: GoogleAdminEndpointOutputSchemas.orgUnitsList,
	},
	'orgUnits.get': {
		input: GoogleAdminEndpointInputSchemas.orgUnitsGet,
		output: GoogleAdminEndpointOutputSchemas.orgUnitsGet,
	},
	'orgUnits.insert': {
		input: GoogleAdminEndpointInputSchemas.orgUnitsInsert,
		output: GoogleAdminEndpointOutputSchemas.orgUnitsInsert,
	},
	'orgUnits.update': {
		input: GoogleAdminEndpointInputSchemas.orgUnitsUpdate,
		output: GoogleAdminEndpointOutputSchemas.orgUnitsUpdate,
	},
	'orgUnits.delete': {
		input: GoogleAdminEndpointInputSchemas.orgUnitsDelete,
		output: GoogleAdminEndpointOutputSchemas.orgUnitsDelete,
	},
	'domains.list': {
		input: GoogleAdminEndpointInputSchemas.domainsList,
		output: GoogleAdminEndpointOutputSchemas.domainsList,
	},
	'domains.get': {
		input: GoogleAdminEndpointInputSchemas.domainsGet,
		output: GoogleAdminEndpointOutputSchemas.domainsGet,
	},
	'domains.aliases.list': {
		input: GoogleAdminEndpointInputSchemas.domainAliasesList,
		output: GoogleAdminEndpointOutputSchemas.domainAliasesList,
	},
	'customers.get': {
		input: GoogleAdminEndpointInputSchemas.customersGet,
		output: GoogleAdminEndpointOutputSchemas.customersGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAdminEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const googleAdminEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description:
			"List users in the account or one domain, with Google's search query and paging",
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user by email, alias or ID',
	},
	'users.insert': {
		riskLevel: 'write',
		description:
			'Create a user account with an initial password; a conflicting unmanaged account can be invited instead of created',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Update a user through the PUT that keeps the patch semantics Google documents for it: omitted fields are preserved, a field sent as null is cleared',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a user account. The account stays recoverable through users.undelete while it is in the trash',
	},
	'users.undelete': {
		riskLevel: 'write',
		description:
			'Restore a deleted user by ID and optionally set the organizational unit it returns to',
	},
	'users.makeAdmin': {
		riskLevel: 'destructive',
		description:
			'Grant or revoke super administrator on a user. The caller cannot revoke its own last admin right',
	},
	'users.signOut': {
		riskLevel: 'write',
		description:
			'Sign a user out of all web and device sessions, clearing their sign-in cookies',
	},
	'users.aliases.list': {
		riskLevel: 'read',
		description: "List a user's alias email addresses",
	},
	'users.aliases.insert': {
		riskLevel: 'write',
		description: 'Add an alias email address to a user',
	},
	'users.aliases.delete': {
		riskLevel: 'destructive',
		description:
			'Remove alias email addresses from a user; mail to a removed alias is no longer delivered',
	},
	'users.photos.get': {
		riskLevel: 'read',
		description: "Read a user's profile photo as base64 bytes",
	},
	'users.photos.update': {
		riskLevel: 'write',
		description: "Replace a user's profile photo",
	},
	'users.photos.delete': {
		riskLevel: 'destructive',
		description: "Remove a user's profile photo",
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List groups in the account, one domain, or the groups a user belongs to',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Read one group by email, alias or ID',
	},
	'groups.insert': {
		riskLevel: 'write',
		description: 'Create a group',
	},
	'groups.update': {
		riskLevel: 'write',
		description: "Update a group's email, display name or description",
	},
	'groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a group and its memberships',
	},
	'groups.aliases.list': {
		riskLevel: 'read',
		description: "List a group's aliases",
	},
	'groups.aliases.insert': {
		riskLevel: 'write',
		description: 'Add an alias email address to a group',
	},
	'groups.aliases.delete': {
		riskLevel: 'destructive',
		description: 'Remove an alias email address from a group',
	},
	'members.list': {
		riskLevel: 'read',
		description:
			"List a group's members, optionally including members inherited from nested groups and filtered by role",
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Read one group membership',
	},
	'members.hasMember': {
		riskLevel: 'read',
		description: 'Check whether a user is a direct or nested member of a group',
	},
	'members.insert': {
		riskLevel: 'write',
		description:
			'Add a user or group to a group with a role and a mail delivery preference',
	},
	'members.update': {
		riskLevel: 'write',
		description: "Change a member's role or mail delivery preference",
	},
	'members.delete': {
		riskLevel: 'destructive',
		description:
			"Remove a member from a group; the member loses the group's mail and access",
	},
	'orgUnits.list': {
		riskLevel: 'read',
		description:
			'List organizational units: immediate children, all descendants, or all descendants plus the unit itself',
	},
	'orgUnits.get': {
		riskLevel: 'read',
		description: 'Read one organizational unit',
	},
	'orgUnits.insert': {
		riskLevel: 'write',
		description: 'Create an organizational unit under a parent',
	},
	'orgUnits.update': {
		riskLevel: 'write',
		description:
			'Rename an organizational unit or move it under another parent, which changes the settings its users inherit',
	},
	'orgUnits.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an organizational unit. It must hold no users or child units first',
	},
	'domains.list': {
		riskLevel: 'read',
		description: "List the account's domains",
	},
	'domains.get': { riskLevel: 'read', description: 'Read one domain' },
	'domains.aliases.list': {
		riskLevel: 'read',
		description:
			"List the account's domain aliases, optionally for one parent domain",
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			"Read the account's customer record, including its primary domain",
	},
} satisfies RequiredPluginEndpointMeta<typeof googleAdminEndpointsNested>;

// The OAuth tokens are all this plugin needs on the account; an unfilled extra
// field would mark every connection as partial.
export const googleAdminAuthConfig = {
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleAdminPlugin<T extends GoogleAdminPluginOptions> =
	CorsairPlugin<
		'googleadmin',
		typeof GoogleAdminSchema,
		typeof googleAdminEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof googleAdminAuthConfig
	>;

export type InternalGoogleAdminPlugin =
	BaseGoogleAdminPlugin<GoogleAdminPluginOptions>;

export type ExternalGoogleAdminPlugin<T extends GoogleAdminPluginOptions> =
	BaseGoogleAdminPlugin<T>;

export function googleadmin<const T extends GoogleAdminPluginOptions>(
	incomingOptions: GoogleAdminPluginOptions &
		T = {} as GoogleAdminPluginOptions & T,
): ExternalGoogleAdminPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleadmin',
		authConfig: googleAdminAuthConfig,
		schema: GoogleAdminSchema,
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				// Reads and writes on users, their aliases and photos.
				'https://www.googleapis.com/auth/admin.directory.user',
				// users.signOut is only covered by the security scope.
				'https://www.googleapis.com/auth/admin.directory.user.security',
				// Groups, group aliases and memberships.
				'https://www.googleapis.com/auth/admin.directory.group',
				'https://www.googleapis.com/auth/admin.directory.orgunit',
				// Domains and domain aliases.
				'https://www.googleapis.com/auth/admin.directory.domain',
				'https://www.googleapis.com/auth/admin.directory.customer',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleAdminEndpointsNested,
		webhooks: {},
		endpointMeta: googleAdminEndpointMeta,
		endpointSchemas: googleAdminEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		// The token always comes from the stored OAuth connection. The Directory
		// API has no key auth: every call must be made as a signed-in
		// administrator, and a service account needs domain-wide delegation.
		keyBuilder: async (ctx: GoogleAdminKeyBuilderContext) => {
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('googleadmin', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'googleadmin',
				tokenUrl: 'https://oauth2.googleapis.com/token',
			});
		},
	} satisfies InternalGoogleAdminPlugin;
}

export type {
	GoogleAdminEndpointInputs,
	GoogleAdminEndpointOutputSchemas,
	GoogleAdminEndpointOutputs,
} from './endpoints/types';
export { GoogleAdminSchema } from './schema';

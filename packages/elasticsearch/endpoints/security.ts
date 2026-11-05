import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';

// Security-family path targets (usernames, role names, realms, key ids) are
// comma-separated multi-target expressions, so every path segment goes through
// the same per-segment encoder the cluster endpoints use.
const target = (value: string) => encodeIndexTarget(value);

// ── security.apiKeys ─────────────────────────────────────────────────────────

export const getApiKeys: ElasticsearchEndpoints['securityApiKeysGet'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysGet', 'security.apiKeys.get', input, {
		path: () => '/_security/api_key',
		query: (parsed) =>
			pickQuery(parsed, [
				'id',
				'name',
				'owner',
				'realm_name',
				'username',
				'with_limited_by',
				'active_only',
				'with_profile_uid',
			]),
	});

export const createApiKey: ElasticsearchEndpoints['securityApiKeysCreate'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysCreate', 'security.apiKeys.create', input, {
		method: 'POST',
		path: () => '/_security/api_key',
		query: (parsed) => pickQuery(parsed, ['refresh']),
		body: (parsed) =>
			pickBody(parsed, ['name', 'expiration', 'role_descriptors', 'metadata']),
	});

export const invalidateApiKeys: ElasticsearchEndpoints['securityApiKeysInvalidate'] =
	(ctx, input) =>
		call(
			ctx,
			'securityApiKeysInvalidate',
			'security.apiKeys.invalidate',
			input,
			{
				method: 'DELETE',
				path: () => '/_security/api_key',
				body: (parsed) =>
					pickBody(parsed, [
						'id',
						'ids',
						'name',
						'owner',
						'realm_name',
						'username',
					]),
			},
		);

export const bulkUpdateApiKeys: ElasticsearchEndpoints['securityApiKeysBulkUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			'securityApiKeysBulkUpdate',
			'security.apiKeys.bulkUpdate',
			input,
			{
				method: 'POST',
				path: () => '/_security/api_key/_bulk_update',
				body: (parsed) =>
					pickBody(parsed, [
						'ids',
						'expiration',
						'metadata',
						'role_descriptors',
					]),
			},
		);

export const cloneApiKey: ElasticsearchEndpoints['securityApiKeysClone'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysClone', 'security.apiKeys.clone', input, {
		method: 'PUT',
		path: () => '/_security/api_key/clone',
		query: (parsed) => pickQuery(parsed, ['refresh']),
		body: (parsed) =>
			pickBody(parsed, ['name', 'expiration', 'role_descriptors', 'metadata']),
	});

export const grantApiKey: ElasticsearchEndpoints['securityApiKeysGrant'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysGrant', 'security.apiKeys.grant', input, {
		method: 'POST',
		path: () => '/_security/api_key/grant',
		query: (parsed) => pickQuery(parsed, ['refresh']),
		body: (parsed) =>
			pickBody(parsed, [
				'api_key',
				'grant_type',
				'access_token',
				'client_authentication',
				'service_account_token',
				'username',
				'password',
				'run_as',
			]),
	});

export const clearApiKeyCache: ElasticsearchEndpoints['securityApiKeysClearCache'] =
	(ctx, input) =>
		call(
			ctx,
			'securityApiKeysClearCache',
			'security.apiKeys.clearCache',
			input,
			{
				method: 'POST',
				path: (parsed) =>
					`/_security/api_key/${target(parsed.ids)}/_clear_cache`,
			},
		);

export const updateApiKey: ElasticsearchEndpoints['securityApiKeysUpdate'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysUpdate', 'security.apiKeys.update', input, {
		method: 'PUT',
		path: (parsed) => `/_security/api_key/${target(parsed.id)}`,
		body: (parsed) =>
			pickBody(parsed, ['role_descriptors', 'metadata', 'expiration']),
	});

export const queryApiKeys: ElasticsearchEndpoints['securityApiKeysQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityApiKeysQuery', 'security.apiKeys.query', input, {
		method: 'POST',
		path: () => '/_security/_query/api_key',
		query: (parsed) =>
			pickQuery(parsed, ['with_limited_by', 'with_profile_uid', 'typed_keys']),
		body: (parsed) => pickBody(parsed, ['query', 'from', 'size']),
	});

// ── security.crossClusterApiKeys ─────────────────────────────────────────────

export const createCrossClusterApiKey: ElasticsearchEndpoints['securityCrossClusterApiKeysCreate'] =
	(ctx, input) =>
		call(
			ctx,
			'securityCrossClusterApiKeysCreate',
			'security.crossClusterApiKeys.create',
			input,
			{
				method: 'POST',
				path: () => '/_security/cross_cluster/api_key',
				query: (parsed) => pickQuery(parsed, ['refresh']),
				body: (parsed) =>
					pickBody(parsed, ['name', 'access', 'expiration', 'metadata']),
			},
		);

export const updateCrossClusterApiKey: ElasticsearchEndpoints['securityCrossClusterApiKeysUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			'securityCrossClusterApiKeysUpdate',
			'security.crossClusterApiKeys.update',
			input,
			{
				method: 'PUT',
				path: (parsed) =>
					`/_security/cross_cluster/api_key/${target(parsed.id)}`,
				query: (parsed) => pickQuery(parsed, ['refresh']),
				body: (parsed) =>
					pickBody(parsed, ['access', 'expiration', 'metadata']),
			},
		);

// ── security.authenticate ────────────────────────────────────────────────────

export const authenticate: ElasticsearchEndpoints['securityAuthenticate'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityAuthenticate', 'security.authenticate', input, {
		path: () => '/_security/_authenticate',
	});

// ── security.users ───────────────────────────────────────────────────────────

export const getUsers: ElasticsearchEndpoints['securityUsersGet'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersGet', 'security.users.get', input, {
		path: (parsed) => `/_security/user/${target(parsed.username)}`,
		query: (parsed) => pickQuery(parsed, ['with_profile_uid']),
	});

export const putUser: ElasticsearchEndpoints['securityUsersPut'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersPut', 'security.users.put', input, {
		method: 'POST',
		path: (parsed) => `/_security/user/${target(parsed.username)}`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
		body: (parsed) =>
			pickBody(parsed, [
				'password',
				'password_hash',
				'roles',
				'full_name',
				'email',
				'metadata',
				'enabled',
			]),
	});

export const deleteUser: ElasticsearchEndpoints['securityUsersDelete'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersDelete', 'security.users.delete', input, {
		method: 'DELETE',
		path: (parsed) => `/_security/user/${target(parsed.username)}`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
	});

export const disableUser: ElasticsearchEndpoints['securityUsersDisable'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersDisable', 'security.users.disable', input, {
		method: 'POST',
		path: (parsed) => `/_security/user/${target(parsed.username)}/_disable`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
	});

export const enableUser: ElasticsearchEndpoints['securityUsersEnable'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersEnable', 'security.users.enable', input, {
		method: 'POST',
		path: (parsed) => `/_security/user/${target(parsed.username)}/_enable`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
	});

export const changePassword: ElasticsearchEndpoints['securityUsersChangePassword'] =
	(ctx, input) =>
		call(
			ctx,
			'securityUsersChangePassword',
			'security.users.changePassword',
			input,
			{
				method: 'POST',
				path: (parsed) =>
					`/_security/user/${target(parsed.username)}/_password`,
				query: (parsed) => pickQuery(parsed, ['refresh']),
				body: (parsed) => pickBody(parsed, ['password', 'password_hash']),
			},
		);

export const queryUsers: ElasticsearchEndpoints['securityUsersQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityUsersQuery', 'security.users.query', input, {
		method: 'POST',
		path: () => '/_security/_query/user',
		query: (parsed) => pickQuery(parsed, ['with_profile_uid']),
		body: (parsed) => pickBody(parsed, ['query', 'from', 'size']),
	});

// ── security.hasPrivileges / getUserPrivileges ───────────────────────────────

export const hasPrivileges: ElasticsearchEndpoints['securityHasPrivileges'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityHasPrivileges', 'security.hasPrivileges', input, {
		method: 'POST',
		path: (parsed) => `/_security/user/${target(parsed.user)}/_has_privileges`,
		body: (parsed) => pickBody(parsed, ['cluster', 'index', 'application']),
	});

export const getUserPrivileges: ElasticsearchEndpoints['securityGetUserPrivileges'] =
	(ctx, input) =>
		call(
			ctx,
			'securityGetUserPrivileges',
			'security.getUserPrivileges',
			input,
			{
				path: () => '/_security/user/_privileges',
			},
		);

// ── security.roles ───────────────────────────────────────────────────────────

export const getRoles: ElasticsearchEndpoints['securityRolesGet'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityRolesGet', 'security.roles.get', input, {
		path: (parsed) => `/_security/role/${target(parsed.name)}`,
		query: (parsed) => pickQuery(parsed, ['include_implicit']),
	});

export const putRole: ElasticsearchEndpoints['securityRolesPut'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityRolesPut', 'security.roles.put', input, {
		method: 'POST',
		path: (parsed) => `/_security/role/${target(parsed.name)}`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
		// The wire body is the descriptor itself (POST /_security/role/{name}).
		body: (parsed) => parsed.role,
	});

export const deleteRole: ElasticsearchEndpoints['securityRolesDelete'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityRolesDelete', 'security.roles.delete', input, {
		method: 'DELETE',
		path: (parsed) => `/_security/role/${target(parsed.name)}`,
		query: (parsed) => pickQuery(parsed, ['refresh']),
	});

export const bulkPutRoles: ElasticsearchEndpoints['securityRolesBulkPut'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityRolesBulkPut', 'security.roles.bulkPut', input, {
		method: 'POST',
		path: () => '/_security/role',
		query: (parsed) => pickQuery(parsed, ['refresh']),
		body: (parsed) => pickBody(parsed, ['roles']),
	});

export const bulkDeleteRoles: ElasticsearchEndpoints['securityRolesBulkDelete'] =
	(ctx, input) =>
		call(ctx, 'securityRolesBulkDelete', 'security.roles.bulkDelete', input, {
			method: 'DELETE',
			path: () => '/_security/role',
			query: (parsed) => pickQuery(parsed, ['refresh']),
			body: (parsed) => pickBody(parsed, ['names']),
		});

export const clearRoleCache: ElasticsearchEndpoints['securityRolesClearCache'] =
	(ctx, input) =>
		call(ctx, 'securityRolesClearCache', 'security.roles.clearCache', input, {
			method: 'POST',
			path: (parsed) => `/_security/role/${target(parsed.name)}/_clear_cache`,
		});

export const queryRoles: ElasticsearchEndpoints['securityRolesQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityRolesQuery', 'security.roles.query', input, {
		method: 'POST',
		path: () => '/_security/_query/role',
		body: (parsed) => pickBody(parsed, ['query', 'from', 'size']),
	});

// ── security.roleMappings ────────────────────────────────────────────────────

export const getRoleMapping: ElasticsearchEndpoints['securityRoleMappingsGet'] =
	(ctx, input) =>
		call(ctx, 'securityRoleMappingsGet', 'security.roleMappings.get', input, {
			path: (parsed) => `/_security/role_mapping/${target(parsed.name)}`,
		});

export const putRoleMapping: ElasticsearchEndpoints['securityRoleMappingsPut'] =
	(ctx, input) =>
		call(ctx, 'securityRoleMappingsPut', 'security.roleMappings.put', input, {
			method: 'POST',
			path: (parsed) => `/_security/role_mapping/${target(parsed.name)}`,
			query: (parsed) => pickQuery(parsed, ['refresh']),
			// The wire body is the mapping itself (POST /_security/role_mapping/{name}).
			body: (parsed) => parsed.mapping,
		});

export const deleteRoleMapping: ElasticsearchEndpoints['securityRoleMappingsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			'securityRoleMappingsDelete',
			'security.roleMappings.delete',
			input,
			{
				method: 'DELETE',
				path: (parsed) => `/_security/role_mapping/${target(parsed.name)}`,
				query: (parsed) => pickQuery(parsed, ['refresh']),
			},
		);

// ── security.privileges ──────────────────────────────────────────────────────

export const putPrivileges: ElasticsearchEndpoints['securityPrivilegesPut'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityPrivilegesPut', 'security.privileges.put', input, {
		method: 'POST',
		path: () => '/_security/privilege',
		query: (parsed) => pickQuery(parsed, ['refresh']),
		// The wire body is the application-to-privilege map itself.
		body: (parsed) => parsed.privileges,
	});

export const getBuiltinPrivileges: ElasticsearchEndpoints['securityPrivilegesGetBuiltin'] =
	(ctx, input) =>
		call(
			ctx,
			'securityPrivilegesGetBuiltin',
			'security.privileges.getBuiltin',
			input,
			{
				path: () => '/_security/privilege/_builtin',
			},
		);

export const getPrivileges: ElasticsearchEndpoints['securityPrivilegesGet'] = (
	ctx,
	input,
) =>
	call(ctx, 'securityPrivilegesGet', 'security.privileges.get', input, {
		path: (parsed) =>
			`/_security/privilege/${target(parsed.application)}/${target(parsed.name)}`,
	});

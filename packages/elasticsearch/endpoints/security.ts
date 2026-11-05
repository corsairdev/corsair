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

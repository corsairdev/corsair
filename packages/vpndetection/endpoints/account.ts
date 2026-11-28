import { endpoint } from './call';
import {
	AccountIdentityInputSchema,
	AccountIdentityResponseSchema,
	ApiKeysCreateInputSchema,
	ApiKeysCreateResponseSchema,
	ApiKeysListInputSchema,
	ApiKeysListResponseSchema,
	ApiKeysRevealInputSchema,
	ApiKeysRevealResponseSchema,
	ApiKeysRevokeInputSchema,
	ApiKeysRevokeResponseSchema,
	ApiKeysRotateInputSchema,
	ApiKeysRotateResponseSchema,
	EntitlementGetInputSchema,
	EntitlementGetResponseSchema,
	OrganizationGetInputSchema,
	OrganizationGetResponseSchema,
	OrganizationListMembersInputSchema,
	OrganizationListMembersResponseSchema,
} from './types';

// Entitlement takes any key. The /api/v1/iam routes read `Authorization:
// Bearer` and need an OAuth scope (account.read, org.read, apikeys.*); an
// API key carries only ip.lookup and db.download, so with a plain key they
// answer 403 `{"rc":"FORBIDDEN"}` (live, 2026-11-28).

export const get = endpoint({
	event: 'vpndetection.entitlement.get',
	input: EntitlementGetInputSchema,
	output: EntitlementGetResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/entitlement' }),
	log: (_, result) => ({
		plan: result.plan.key,
		requests: result.usage.requests,
	}),
});

export const Entitlement = { get };

export const identity = endpoint({
	event: 'vpndetection.account.identity',
	input: AccountIdentityInputSchema,
	output: AccountIdentityResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/iam/identity' }),
});

export const Account = { identity };

export const organizationGet = endpoint({
	event: 'vpndetection.organization.get',
	input: OrganizationGetInputSchema,
	output: OrganizationGetResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/iam/org' }),
});

export const organizationListMembers = endpoint({
	event: 'vpndetection.organization.listMembers',
	input: OrganizationListMembersInputSchema,
	output: OrganizationListMembersResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/iam/org/members' }),
});

export const Organization = {
	get: organizationGet,
	listMembers: organizationListMembers,
};

export const apiKeysList = endpoint({
	event: 'vpndetection.apiKeys.list',
	input: ApiKeysListInputSchema,
	output: ApiKeysListResponseSchema,
	request: () => ({ method: 'GET', path: '/api/v1/iam/apikeys' }),
	log: (_, result) => ({ count: result.keys?.length ?? 0 }),
});

export const apiKeysCreate = endpoint({
	event: 'vpndetection.apiKeys.create',
	input: ApiKeysCreateInputSchema,
	output: ApiKeysCreateResponseSchema,
	request: ({ name, allowedScopes }) => ({
		method: 'POST',
		path: '/api/v1/iam/apikeys',
		body: { name, allowed_scopes: allowedScopes },
	}),
	// The ID only: the answer carries the new secret.
	log: (_, result) => ({ id: result.id }),
});

export const apiKeysRotate = endpoint({
	event: 'vpndetection.apiKeys.rotate',
	input: ApiKeysRotateInputSchema,
	output: ApiKeysRotateResponseSchema,
	request: ({ id }) => ({
		method: 'POST',
		path: '/api/v1/iam/apikeys/{id}/rotate',
		pathParams: { id },
	}),
	log: ({ id }) => ({ id }),
});

export const apiKeysRevoke = endpoint({
	event: 'vpndetection.apiKeys.revoke',
	input: ApiKeysRevokeInputSchema,
	output: ApiKeysRevokeResponseSchema,
	request: ({ id }) => ({
		method: 'POST',
		path: '/api/v1/iam/apikeys/{id}/revoke',
		pathParams: { id },
	}),
	log: ({ id }) => ({ id }),
});

export const apiKeysReveal = endpoint({
	event: 'vpndetection.apiKeys.reveal',
	input: ApiKeysRevealInputSchema,
	output: ApiKeysRevealResponseSchema,
	request: ({ id }) => ({
		method: 'POST',
		path: '/api/v1/iam/apikeys/{id}/reveal',
		pathParams: { id },
	}),
	log: ({ id }) => ({ id }),
});

export const ApiKeys = {
	list: apiKeysList,
	create: apiKeysCreate,
	rotate: apiKeysRotate,
	revoke: apiKeysRevoke,
	reveal: apiKeysReveal,
};

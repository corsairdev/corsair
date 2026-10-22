import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistPolicies } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List policies - GET /v1/policies
export const policiesList: DnsfilterEndpoints['policiesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesList']
	>('/v1/policies', ctx.key, {
		method: 'GET',
		query: {
			include_global_policies: input.include_global_policies,
			organization_id: input.organization_id,
			page: input.page,
		},
	});
	await persistPolicies(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a policy - POST /v1/policies
export const policiesCreate: DnsfilterEndpoints['policiesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesCreate']
	>('/v1/policies', ctx.key, {
		method: 'POST',
		body: {
			policy: input.policy,
			include_relationships: input.include_relationships,
			append_domains: input.append_domains,
		},
	});
	await persistPolicies(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.create',
		input ?? {},
		'completed',
	);
	return response;
};

// List all policies - GET /v1/policies/all
export const policiesListAll: DnsfilterEndpoints['policiesListAll'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesListAll']
	>('/v1/policies/all', ctx.key, {
		method: 'GET',
		query: {
			include_global_policies: input.include_global_policies,
			organization_id: input.organization_id,
			page: input.page,
		},
	});
	await persistPolicies(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.listAll',
		input ?? {},
		'completed',
	);
	return response;
};

// Get a policy - GET /v1/policies/{id}
export const policiesGet: DnsfilterEndpoints['policiesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesGet']
	>('/v1/policies/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
		query: {
			include_relationships: input.include_relationships,
		},
	});
	await persistPolicies(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a policy - PATCH /v1/policies/{id}
export const policiesUpdate: DnsfilterEndpoints['policiesUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesUpdate']
	>('/v1/policies/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: input.id,
		},
		body: {
			policy: input.policy,
			include_relationships: input.include_relationships,
			append_domains: input.append_domains,
		},
	});
	await persistPolicies(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.update',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete a policy - DELETE /v1/policies/{id}
export const policiesDelete: DnsfilterEndpoints['policiesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesDelete']
	>('/v1/policies/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.delete',
		input ?? {},
		'completed',
	);
	return response;
};

// Application for policies - GET /v1/policies/application
export const policiesApplication: DnsfilterEndpoints['policiesApplication'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesApplication']
		>('/v1/policies/application', ctx.key, {
			method: 'GET',
			query: {
				application_id: input.application_id,
				name: input.name,
				organization_id: input.organization_id,
				policy_ids: input.policy_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.application',
			input ?? {},
			'completed',
		);
		return response;
	};

// Application update for policies - POST /v1/policies/application_update
export const policiesApplicationUpdate: DnsfilterEndpoints['policiesApplicationUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesApplicationUpdate']
		>('/v1/policies/application_update', ctx.key, {
			method: 'POST',
			query: {
				allow_policies: input.allow_policies,
				application_id: input.application_id,
				block_policies: input.block_policies,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.applicationUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add blacklist domain for policies - POST /v1/policies/{id}/add_blacklist_domain
export const policiesAddBlacklistDomain: DnsfilterEndpoints['policiesAddBlacklistDomain'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlacklistDomain']
		>('/v1/policies/{id}/add_blacklist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				domain: input.domain,
				note: input.note,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlacklistDomain',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove blacklist domain for policies - POST /v1/policies/{id}/remove_blacklist_domain
export const policiesRemoveBlacklistDomain: DnsfilterEndpoints['policiesRemoveBlacklistDomain'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlacklistDomain']
		>('/v1/policies/{id}/remove_blacklist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				domain: input.domain,
				note: input.note,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlacklistDomain',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add whitelist domain for policies - POST /v1/policies/{id}/add_whitelist_domain
export const policiesAddWhitelistDomain: DnsfilterEndpoints['policiesAddWhitelistDomain'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddWhitelistDomain']
		>('/v1/policies/{id}/add_whitelist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				domain: input.domain,
				note: input.note,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addWhitelistDomain',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove whitelist domain for policies - POST /v1/policies/{id}/remove_whitelist_domain
export const policiesRemoveWhitelistDomain: DnsfilterEndpoints['policiesRemoveWhitelistDomain'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveWhitelistDomain']
		>('/v1/policies/{id}/remove_whitelist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				domain: input.domain,
				note: input.note,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeWhitelistDomain',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add blacklist category for policies - POST /v1/policies/{id}/add_blacklist_category
export const policiesAddBlacklistCategory: DnsfilterEndpoints['policiesAddBlacklistCategory'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlacklistCategory']
		>('/v1/policies/{id}/add_blacklist_category', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				category_id: input.category_id,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlacklistCategory',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove blacklist category for policies - POST /v1/policies/{id}/remove_blacklist_category
export const policiesRemoveBlacklistCategory: DnsfilterEndpoints['policiesRemoveBlacklistCategory'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlacklistCategory']
		>('/v1/policies/{id}/remove_blacklist_category', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				category_id: input.category_id,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlacklistCategory',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add allowed application for policies - POST /v1/policies/{id}/add_allowed_application
export const policiesAddAllowedApplication: DnsfilterEndpoints['policiesAddAllowedApplication'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddAllowedApplication']
		>('/v1/policies/{id}/add_allowed_application', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				name: input.name,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addAllowedApplication',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove allowed application for policies - POST /v1/policies/{id}/remove_allowed_application
export const policiesRemoveAllowedApplication: DnsfilterEndpoints['policiesRemoveAllowedApplication'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveAllowedApplication']
		>('/v1/policies/{id}/remove_allowed_application', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				name: input.name,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeAllowedApplication',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add blocked application for policies - POST /v1/policies/{id}/add_blocked_application
export const policiesAddBlockedApplication: DnsfilterEndpoints['policiesAddBlockedApplication'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlockedApplication']
		>('/v1/policies/{id}/add_blocked_application', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				name: input.name,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlockedApplication',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove blocked application for policies - POST /v1/policies/{id}/remove_blocked_application
export const policiesRemoveBlockedApplication: DnsfilterEndpoints['policiesRemoveBlockedApplication'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlockedApplication']
		>('/v1/policies/{id}/remove_blocked_application', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				name: input.name,
				include_relationships: input.include_relationships,
			},
		});
		await persistPolicies(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlockedApplication',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get permissive mode for policies - GET /v1/policies/{id}/permissive_mode
export const policiesGetPermissiveMode: DnsfilterEndpoints['policiesGetPermissiveMode'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesGetPermissiveMode']
		>('/v1/policies/{id}/permissive_mode', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.getPermissiveMode',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update permissive mode for policies - POST /v1/policies/{id}/permissive_mode
export const policiesUpdatePermissiveMode: DnsfilterEndpoints['policiesUpdatePermissiveMode'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesUpdatePermissiveMode']
		>('/v1/policies/{id}/permissive_mode', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			query: {
				permissive_mode: input.permissive_mode,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.updatePermissiveMode',
			input ?? {},
			'completed',
		);
		return response;
	};

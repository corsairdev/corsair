import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistPolicies } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List policies - GET /v1/policies
export const policiesList: DnsfilterEndpoints['policiesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesList']
	>('/v1/policies', ctx.key, {
		method: 'GET',
		query: {
			include_global_policies: values.include_global_policies,
			organization_id: values.organization_id,
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesList.parse(response);
	await persistPolicies(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a policy - POST /v1/policies
export const policiesCreate: DnsfilterEndpoints['policiesCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesCreate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesCreate']
	>('/v1/policies', ctx.key, {
		method: 'POST',
		body: {
			policy: values.policy,
			include_relationships: values.include_relationships,
			append_domains: values.append_domains,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesCreate.parse(response);
	await persistPolicies(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all policies - GET /v1/policies/all
export const policiesListAll: DnsfilterEndpoints['policiesListAll'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesListAll.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesListAll']
	>('/v1/policies/all', ctx.key, {
		method: 'GET',
		query: {
			include_global_policies: values.include_global_policies,
			organization_id: values.organization_id,
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesListAll.parse(response);
	await persistPolicies(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.listAll',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a policy - GET /v1/policies/{id}
export const policiesGet: DnsfilterEndpoints['policiesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesGet']
	>('/v1/policies/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
		query: {
			include_relationships: values.include_relationships,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesGet.parse(response);
	await persistPolicies(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a policy - PATCH /v1/policies/{id}
export const policiesUpdate: DnsfilterEndpoints['policiesUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesUpdate']
	>('/v1/policies/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			policy: values.policy,
			include_relationships: values.include_relationships,
			append_domains: values.append_domains,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesUpdate.parse(response);
	await persistPolicies(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a policy - DELETE /v1/policies/{id}
export const policiesDelete: DnsfilterEndpoints['policiesDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.policiesDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['policiesDelete']
	>('/v1/policies/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.policiesDelete.parse(response);
	try {
		await ctx.db.policies.deleteByEntityId(String(values.id));
	} catch (error) {
		console.warn('Failed to evict DNSFilter policies row:', error);
	}
	await logEventFromContext(
		ctx,
		'dnsfilter.policies.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Application for policies - GET /v1/policies/application
export const policiesApplication: DnsfilterEndpoints['policiesApplication'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.policiesApplication.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesApplication']
		>('/v1/policies/application', ctx.key, {
			method: 'GET',
			query: {
				application_id: values.application_id,
				name: values.name,
				organization_id: values.organization_id,
				policy_ids: values.policy_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesApplication.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.application',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Application update for policies - POST /v1/policies/application_update
export const policiesApplicationUpdate: DnsfilterEndpoints['policiesApplicationUpdate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesApplicationUpdate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesApplicationUpdate']
		>('/v1/policies/application_update', ctx.key, {
			method: 'POST',
			query: {
				allow_policies: values.allow_policies,
				application_id: values.application_id,
				block_policies: values.block_policies,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesApplicationUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.applicationUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add blacklist domain for policies - POST /v1/policies/{id}/add_blacklist_domain
export const policiesAddBlacklistDomain: DnsfilterEndpoints['policiesAddBlacklistDomain'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesAddBlacklistDomain.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlacklistDomain']
		>('/v1/policies/{id}/add_blacklist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				domain: values.domain,
				note: values.note,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesAddBlacklistDomain.parse(response);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlacklistDomain',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove blacklist domain for policies - POST /v1/policies/{id}/remove_blacklist_domain
export const policiesRemoveBlacklistDomain: DnsfilterEndpoints['policiesRemoveBlacklistDomain'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesRemoveBlacklistDomain.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlacklistDomain']
		>('/v1/policies/{id}/remove_blacklist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				domain: values.domain,
				note: values.note,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesRemoveBlacklistDomain.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlacklistDomain',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add whitelist domain for policies - POST /v1/policies/{id}/add_whitelist_domain
export const policiesAddWhitelistDomain: DnsfilterEndpoints['policiesAddWhitelistDomain'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesAddWhitelistDomain.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddWhitelistDomain']
		>('/v1/policies/{id}/add_whitelist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				domain: values.domain,
				note: values.note,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesAddWhitelistDomain.parse(response);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addWhitelistDomain',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove whitelist domain for policies - POST /v1/policies/{id}/remove_whitelist_domain
export const policiesRemoveWhitelistDomain: DnsfilterEndpoints['policiesRemoveWhitelistDomain'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesRemoveWhitelistDomain.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveWhitelistDomain']
		>('/v1/policies/{id}/remove_whitelist_domain', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				domain: values.domain,
				note: values.note,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesRemoveWhitelistDomain.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeWhitelistDomain',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add blacklist category for policies - POST /v1/policies/{id}/add_blacklist_category
export const policiesAddBlacklistCategory: DnsfilterEndpoints['policiesAddBlacklistCategory'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesAddBlacklistCategory.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlacklistCategory']
		>('/v1/policies/{id}/add_blacklist_category', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				category_id: values.category_id,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesAddBlacklistCategory.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlacklistCategory',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove blacklist category for policies - POST /v1/policies/{id}/remove_blacklist_category
export const policiesRemoveBlacklistCategory: DnsfilterEndpoints['policiesRemoveBlacklistCategory'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesRemoveBlacklistCategory.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlacklistCategory']
		>('/v1/policies/{id}/remove_blacklist_category', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				category_id: values.category_id,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesRemoveBlacklistCategory.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlacklistCategory',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add allowed application for policies - POST /v1/policies/{id}/add_allowed_application
export const policiesAddAllowedApplication: DnsfilterEndpoints['policiesAddAllowedApplication'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesAddAllowedApplication.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddAllowedApplication']
		>('/v1/policies/{id}/add_allowed_application', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				name: values.name,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesAddAllowedApplication.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addAllowedApplication',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove allowed application for policies - POST /v1/policies/{id}/remove_allowed_application
export const policiesRemoveAllowedApplication: DnsfilterEndpoints['policiesRemoveAllowedApplication'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesRemoveAllowedApplication.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveAllowedApplication']
		>('/v1/policies/{id}/remove_allowed_application', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				name: values.name,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesRemoveAllowedApplication.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeAllowedApplication',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add blocked application for policies - POST /v1/policies/{id}/add_blocked_application
export const policiesAddBlockedApplication: DnsfilterEndpoints['policiesAddBlockedApplication'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesAddBlockedApplication.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesAddBlockedApplication']
		>('/v1/policies/{id}/add_blocked_application', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				name: values.name,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesAddBlockedApplication.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.addBlockedApplication',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove blocked application for policies - POST /v1/policies/{id}/remove_blocked_application
export const policiesRemoveBlockedApplication: DnsfilterEndpoints['policiesRemoveBlockedApplication'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesRemoveBlockedApplication.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesRemoveBlockedApplication']
		>('/v1/policies/{id}/remove_blocked_application', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				name: values.name,
				include_relationships: values.include_relationships,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesRemoveBlockedApplication.parse(
				response,
			);
		await persistPolicies(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.removeBlockedApplication',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get permissive mode for policies - GET /v1/policies/{id}/permissive_mode
export const policiesGetPermissiveMode: DnsfilterEndpoints['policiesGetPermissiveMode'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesGetPermissiveMode.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesGetPermissiveMode']
		>('/v1/policies/{id}/permissive_mode', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesGetPermissiveMode.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.getPermissiveMode',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update permissive mode for policies - POST /v1/policies/{id}/permissive_mode
export const policiesUpdatePermissiveMode: DnsfilterEndpoints['policiesUpdatePermissiveMode'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesUpdatePermissiveMode.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesUpdatePermissiveMode']
		>('/v1/policies/{id}/permissive_mode', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			query: {
				permissive_mode: values.permissive_mode,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesUpdatePermissiveMode.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.policies.updatePermissiveMode',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

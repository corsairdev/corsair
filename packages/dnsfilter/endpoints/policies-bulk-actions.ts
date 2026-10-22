import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Add allowlist domains for policies bulk actions - POST /v1/policies/bulk/add_allowlist_domains
export const policiesBulkActionsAddAllowlistDomains: DnsfilterEndpoints['policiesBulkActionsAddAllowlistDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsAddAllowlistDomains']
		>('/v1/policies/bulk/add_allowlist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: input.domains,
				notes: input.notes,
				policy_ids: input.policy_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.addAllowlistDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove allowlist domains for policies bulk actions - POST /v1/policies/bulk/remove_allowlist_domains
export const policiesBulkActionsRemoveAllowlistDomains: DnsfilterEndpoints['policiesBulkActionsRemoveAllowlistDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsRemoveAllowlistDomains']
		>('/v1/policies/bulk/remove_allowlist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: input.domains,
				notes: input.notes,
				policy_ids: input.policy_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.removeAllowlistDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

// Add blocklist domains for policies bulk actions - POST /v1/policies/bulk/add_blocklist_domains
export const policiesBulkActionsAddBlocklistDomains: DnsfilterEndpoints['policiesBulkActionsAddBlocklistDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsAddBlocklistDomains']
		>('/v1/policies/bulk/add_blocklist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: input.domains,
				notes: input.notes,
				policy_ids: input.policy_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.addBlocklistDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

// Remove blocklist domains for policies bulk actions - POST /v1/policies/bulk/remove_blocklist_domains
export const policiesBulkActionsRemoveBlocklistDomains: DnsfilterEndpoints['policiesBulkActionsRemoveBlocklistDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsRemoveBlocklistDomains']
		>('/v1/policies/bulk/remove_blocklist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: input.domains,
				notes: input.notes,
				policy_ids: input.policy_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.removeBlocklistDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

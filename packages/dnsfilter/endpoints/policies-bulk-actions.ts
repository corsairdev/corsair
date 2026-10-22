import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Add allowlist domains for policies bulk actions - POST /v1/policies/bulk/add_allowlist_domains
export const policiesBulkActionsAddAllowlistDomains: DnsfilterEndpoints['policiesBulkActionsAddAllowlistDomains'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesBulkActionsAddAllowlistDomains.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsAddAllowlistDomains']
		>('/v1/policies/bulk/add_allowlist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: values.domains,
				notes: values.notes,
				policy_ids: values.policy_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesBulkActionsAddAllowlistDomains.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.addAllowlistDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove allowlist domains for policies bulk actions - POST /v1/policies/bulk/remove_allowlist_domains
export const policiesBulkActionsRemoveAllowlistDomains: DnsfilterEndpoints['policiesBulkActionsRemoveAllowlistDomains'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesBulkActionsRemoveAllowlistDomains.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsRemoveAllowlistDomains']
		>('/v1/policies/bulk/remove_allowlist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: values.domains,
				notes: values.notes,
				policy_ids: values.policy_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesBulkActionsRemoveAllowlistDomains.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.removeAllowlistDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Add blocklist domains for policies bulk actions - POST /v1/policies/bulk/add_blocklist_domains
export const policiesBulkActionsAddBlocklistDomains: DnsfilterEndpoints['policiesBulkActionsAddBlocklistDomains'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesBulkActionsAddBlocklistDomains.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsAddBlocklistDomains']
		>('/v1/policies/bulk/add_blocklist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: values.domains,
				notes: values.notes,
				policy_ids: values.policy_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesBulkActionsAddBlocklistDomains.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.addBlocklistDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Remove blocklist domains for policies bulk actions - POST /v1/policies/bulk/remove_blocklist_domains
export const policiesBulkActionsRemoveBlocklistDomains: DnsfilterEndpoints['policiesBulkActionsRemoveBlocklistDomains'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.policiesBulkActionsRemoveBlocklistDomains.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['policiesBulkActionsRemoveBlocklistDomains']
		>('/v1/policies/bulk/remove_blocklist_domains', ctx.key, {
			method: 'POST',
			body: {
				domains: values.domains,
				notes: values.notes,
				policy_ids: values.policy_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.policiesBulkActionsRemoveBlocklistDomains.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.policiesBulkActions.removeBlocklistDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

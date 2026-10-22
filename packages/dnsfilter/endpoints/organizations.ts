import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistOrganizations } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List organizations - GET /v1/organizations
export const organizationsList: DnsfilterEndpoints['organizationsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsList']
		>('/v1/organizations', ctx.key, {
			method: 'GET',
			query: {
				basic_info: input.basic_info,
				exclude_inherit_privacy_mode: input.exclude_inherit_privacy_mode,
				managed_by_msp_id: input.managed_by_msp_id,
				name: input.name,
				owned_msp_id: input.owned_msp_id,
				page: input.page,
				pii_grid_search: input.pii_grid_search,
				type: input.type,
			},
		});
		await persistOrganizations(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create an organization - POST /v1/organizations
export const organizationsCreate: DnsfilterEndpoints['organizationsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsCreate']
		>('/v1/organizations', ctx.key, {
			method: 'POST',
			body: {
				organization: input.organization,
			},
		});
		await persistOrganizations(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// List all organizations - GET /v1/organizations/all
export const organizationsListAll: DnsfilterEndpoints['organizationsListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsListAll']
		>('/v1/organizations/all', ctx.key, {
			method: 'GET',
			query: {
				basic_info: input.basic_info,
				managed_by_msp_id: input.managed_by_msp_id,
				name: input.name,
				owned_msp_id: input.owned_msp_id,
				page: input.page,
				type: input.type,
			},
		});
		await persistOrganizations(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an organization - GET /v1/organizations/{id}
export const organizationsGet: DnsfilterEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['organizationsGet']
	>('/v1/organizations/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
		query: {
			include_current_mrr: input.include_current_mrr,
		},
	});
	await persistOrganizations(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.organizations.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update an organization - PATCH /v1/organizations/{id}
export const organizationsUpdate: DnsfilterEndpoints['organizationsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsUpdate']
		>('/v1/organizations/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				organization: input.organization,
			},
		});
		await persistOrganizations(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete an organization - DELETE /v1/organizations/{id}
export const organizationsDelete: DnsfilterEndpoints['organizationsDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsDelete']
		>('/v1/organizations/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
			query: {
				clear_subscription_info: input.clear_subscription_info,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

// Settings for organizations - GET /v1/organizations/settings
export const organizationsSettings: DnsfilterEndpoints['organizationsSettings'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsSettings']
		>('/v1/organizations/settings', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				name: input.name,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
			},
		});
		await persistOrganizations(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.settings',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk update for organizations - PATCH /v1/organizations/bulk_update
export const organizationsBulkUpdate: DnsfilterEndpoints['organizationsBulkUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsBulkUpdate']
		>('/v1/organizations/bulk_update', ctx.key, {
			method: 'PATCH',
			body: {
				organization_ids: input.organization_ids,
				msp_id: input.msp_id,
				exclude_organization_ids: input.exclude_organization_ids,
				send_uninstall_notifications_to_admin_users:
					input.send_uninstall_notifications_to_admin_users,
				user_agent_uninstall_notification:
					input.user_agent_uninstall_notification,
				user_agent_uninstall_notification_recipient_emails:
					input.user_agent_uninstall_notification_recipient_emails,
				user_agents_auto_update: input.user_agents_auto_update,
				vpn_settings_organization_attributes:
					input.vpn_settings_organization_attributes,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.bulkUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Cancel an organization - POST /v1/organizations/{id}/cancel
export const organizationsCancel: DnsfilterEndpoints['organizationsCancel'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsCancel']
		>('/v1/organizations/{id}/cancel', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.cancel',
			input ?? {},
			'completed',
		);
		return response;
	};

// Promote to MSP for organizations - POST /v1/organizations/promote_to_msp
export const organizationsPromoteToMsp: DnsfilterEndpoints['organizationsPromoteToMsp'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsPromoteToMsp']
		>('/v1/organizations/promote_to_msp', ctx.key, {
			method: 'POST',
			query: {
				plan: input.plan,
				zapier_params: input.zapier_params,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.promoteToMsp',
			input ?? {},
			'completed',
		);
		return response;
	};

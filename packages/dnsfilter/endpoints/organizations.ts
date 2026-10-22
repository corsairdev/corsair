import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistOrganizations } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List organizations - GET /v1/organizations
export const organizationsList: DnsfilterEndpoints['organizationsList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsList']
		>('/v1/organizations', ctx.key, {
			method: 'GET',
			query: {
				basic_info: values.basic_info,
				exclude_inherit_privacy_mode: values.exclude_inherit_privacy_mode,
				managed_by_msp_id: values.managed_by_msp_id,
				name: values.name,
				owned_msp_id: values.owned_msp_id,
				page: values.page,
				pii_grid_search: values.pii_grid_search,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsList.parse(response);
		await persistOrganizations(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create an organization - POST /v1/organizations
export const organizationsCreate: DnsfilterEndpoints['organizationsCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsCreate']
		>('/v1/organizations', ctx.key, {
			method: 'POST',
			body: {
				organization: values.organization,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsCreate.parse(response);
		await persistOrganizations(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List all organizations - GET /v1/organizations/all
export const organizationsListAll: DnsfilterEndpoints['organizationsListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsListAll']
		>('/v1/organizations/all', ctx.key, {
			method: 'GET',
			query: {
				basic_info: values.basic_info,
				managed_by_msp_id: values.managed_by_msp_id,
				name: values.name,
				owned_msp_id: values.owned_msp_id,
				page: values.page,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsListAll.parse(response);
		await persistOrganizations(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an organization - GET /v1/organizations/{id}
export const organizationsGet: DnsfilterEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.organizationsGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['organizationsGet']
	>('/v1/organizations/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
		query: {
			include_current_mrr: values.include_current_mrr,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.organizationsGet.parse(response);
	await persistOrganizations(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.organizations.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update an organization - PATCH /v1/organizations/{id}
export const organizationsUpdate: DnsfilterEndpoints['organizationsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsUpdate']
		>('/v1/organizations/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				organization: values.organization,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsUpdate.parse(response);
		await persistOrganizations(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an organization - DELETE /v1/organizations/{id}
export const organizationsDelete: DnsfilterEndpoints['organizationsDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsDelete']
		>('/v1/organizations/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
			query: {
				clear_subscription_info: values.clear_subscription_info,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsDelete.parse(response);
		try {
			await ctx.db.organizations.deleteByEntityId(String(values.id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter organizations row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Settings for organizations - GET /v1/organizations/settings
export const organizationsSettings: DnsfilterEndpoints['organizationsSettings'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsSettings.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsSettings']
		>('/v1/organizations/settings', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				name: values.name,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsSettings.parse(response);
		await persistOrganizations(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.settings',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk update for organizations - PATCH /v1/organizations/bulk_update
export const organizationsBulkUpdate: DnsfilterEndpoints['organizationsBulkUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsBulkUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsBulkUpdate']
		>('/v1/organizations/bulk_update', ctx.key, {
			method: 'PATCH',
			body: {
				organization_ids: values.organization_ids,
				msp_id: values.msp_id,
				exclude_organization_ids: values.exclude_organization_ids,
				send_uninstall_notifications_to_admin_users:
					values.send_uninstall_notifications_to_admin_users,
				user_agent_uninstall_notification:
					values.user_agent_uninstall_notification,
				user_agent_uninstall_notification_recipient_emails:
					values.user_agent_uninstall_notification_recipient_emails,
				user_agents_auto_update: values.user_agents_auto_update,
				vpn_settings_organization_attributes:
					values.vpn_settings_organization_attributes,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsBulkUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.bulkUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Cancel an organization - POST /v1/organizations/{id}/cancel
export const organizationsCancel: DnsfilterEndpoints['organizationsCancel'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationsCancel.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsCancel']
		>('/v1/organizations/{id}/cancel', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsCancel.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.cancel',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Promote to MSP for organizations - POST /v1/organizations/promote_to_msp
export const organizationsPromoteToMsp: DnsfilterEndpoints['organizationsPromoteToMsp'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.organizationsPromoteToMsp.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationsPromoteToMsp']
		>('/v1/organizations/promote_to_msp', ctx.key, {
			method: 'POST',
			query: {
				plan: values.plan,
				zapier_params: values.zapier_params,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationsPromoteToMsp.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizations.promoteToMsp',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

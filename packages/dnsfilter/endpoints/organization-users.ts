import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List organization users - GET /v1/organizations/{organization_id}/users
export const organizationUsersList: DnsfilterEndpoints['organizationUsersList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersList']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'GET',
			path: {
				organization_id: values.organization_id,
			},
			query: {
				include_auth_providers: values.include_auth_providers,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create an organization user - POST /v1/organizations/{organization_id}/users
export const organizationUsersCreate: DnsfilterEndpoints['organizationUsersCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersCreate']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'POST',
			path: {
				organization_id: values.organization_id,
			},
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an organization user - GET /v1/organizations/{organization_id}/users/{id}
export const organizationUsersGet: DnsfilterEndpoints['organizationUsersGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersGet']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
			query: {
				include_auth_providers: values.include_auth_providers,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update an organization user - PATCH /v1/organizations/{organization_id}/users/{id}
export const organizationUsersUpdate: DnsfilterEndpoints['organizationUsersUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersUpdate']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an organization user - DELETE /v1/organizations/{organization_id}/users/{id}
export const organizationUsersDelete: DnsfilterEndpoints['organizationUsersDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.organizationUsersDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersDelete']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Resend invite for organization users - POST /v1/organizations/{organization_id}/users/{id}/resend_invite
export const organizationUsersResendInvite: DnsfilterEndpoints['organizationUsersResendInvite'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.organizationUsersResendInvite.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersResendInvite']
		>('/v1/organizations/{organization_id}/users/{id}/resend_invite', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.organizationUsersResendInvite.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.resendInvite',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

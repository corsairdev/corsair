import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List organization users - GET /v1/organizations/{organization_id}/users
export const organizationUsersList: DnsfilterEndpoints['organizationUsersList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersList']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'GET',
			path: {
				organization_id: input.organization_id,
			},
			query: {
				include_auth_providers: input.include_auth_providers,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create an organization user - POST /v1/organizations/{organization_id}/users
export const organizationUsersCreate: DnsfilterEndpoints['organizationUsersCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersCreate']
		>('/v1/organizations/{organization_id}/users', ctx.key, {
			method: 'POST',
			path: {
				organization_id: input.organization_id,
			},
			body: {
				user: input.user,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an organization user - GET /v1/organizations/{organization_id}/users/{id}
export const organizationUsersGet: DnsfilterEndpoints['organizationUsersGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersGet']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
				organization_id: input.organization_id,
			},
			query: {
				include_auth_providers: input.include_auth_providers,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update an organization user - PATCH /v1/organizations/{organization_id}/users/{id}
export const organizationUsersUpdate: DnsfilterEndpoints['organizationUsersUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersUpdate']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
				organization_id: input.organization_id,
			},
			body: {
				user: input.user,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete an organization user - DELETE /v1/organizations/{organization_id}/users/{id}
export const organizationUsersDelete: DnsfilterEndpoints['organizationUsersDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersDelete']
		>('/v1/organizations/{organization_id}/users/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

// Resend invite for organization users - POST /v1/organizations/{organization_id}/users/{id}/resend_invite
export const organizationUsersResendInvite: DnsfilterEndpoints['organizationUsersResendInvite'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['organizationUsersResendInvite']
		>('/v1/organizations/{organization_id}/users/{id}/resend_invite', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.organizationUsers.resendInvite',
			input ?? {},
			'completed',
		);
		return response;
	};

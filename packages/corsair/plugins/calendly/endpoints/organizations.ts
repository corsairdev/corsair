import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['organizationsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['organizationsGet']
	>(`organizations/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'calendly.organizations.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getInvitation: CalendlyEndpoints['organizationsGetInvitation'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsGetInvitation']
		>(
			`organizations/${input.org_uuid}/invitations/${input.uuid}`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		await logEventFromContext(
			ctx,
			'calendly.organizations.getInvitation',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getMembership: CalendlyEndpoints['organizationsGetMembership'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsGetMembership']
		>(`organization_memberships/${input.uuid}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'calendly.organizations.getMembership',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listInvitations: CalendlyEndpoints['organizationsListInvitations'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsListInvitations']
		>(`organizations/${input.org_uuid}/invitations`, ctx.key, {
			method: 'GET',
			query: {
				count: input.count,
				page_token: input.page_token,
				email: input.email,
				status: input.status,
				sort: input.sort,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.organizations.listInvitations',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listMemberships: CalendlyEndpoints['organizationsListMemberships'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsListMemberships']
		>('organization_memberships', ctx.key, {
			method: 'GET',
			query: {
				organization: input.organization,
				user: input.user,
				count: input.count,
				page_token: input.page_token,
				email: input.email,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.organizations.listMemberships',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteMembership: CalendlyEndpoints['organizationsDeleteMembership'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsDeleteMembership']
		>(`organization_memberships/${input.uuid}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'calendly.organizations.deleteMembership',
			{ ...input },
			'completed',
		);
		return result;
	};

export const invite: CalendlyEndpoints['organizationsInvite'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['organizationsInvite']
	>(`organizations/${input.org_uuid}/invitations`, ctx.key, {
		method: 'POST',
		body: {
			email: input.email,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.organizations.invite',
		{ ...input },
		'completed',
	);
	return result;
};

export const removeMember: CalendlyEndpoints['organizationsRemoveMember'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsRemoveMember']
		>(`organization_memberships/${input.uuid}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'calendly.organizations.removeMember',
			{ ...input },
			'completed',
		);
		return result;
	};

export const revokeInvitation: CalendlyEndpoints['organizationsRevokeInvitation'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['organizationsRevokeInvitation']
		>(
			`organizations/${input.org_uuid}/invitations/${input.uuid}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		await logEventFromContext(
			ctx,
			'calendly.organizations.revokeInvitation',
			{ ...input },
			'completed',
		);
		return result;
	};

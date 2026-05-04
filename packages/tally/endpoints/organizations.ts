import { logEventFromContext } from 'corsair/core';
import type { TallyEndpoints } from '..';
import type { TallyEndpointOutputs } from './types';
import { makeTallyRequest } from '../client';

export const listUsers: TallyEndpoints['organizationsListUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['organizationsListUsers']
	>(`organizations/${input.organizationId}/users`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'tally.organizations.listUsers',
		{ ...input },
		'completed',
	);
	return result;
};

export const removeUser: TallyEndpoints['organizationsRemoveUser'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['organizationsRemoveUser']
	>(`organizations/${input.organizationId}/users/${input.userId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'tally.organizations.removeUser',
		{ ...input },
		'completed',
	);
	return result;
};

export const listInvites: TallyEndpoints['organizationsListInvites'] = async (
	ctx,
	input,
) => {
	const result = await makeTallyRequest<
		TallyEndpointOutputs['organizationsListInvites']
	>(`organizations/${input.organizationId}/invites`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'tally.organizations.listInvites',
		{ ...input },
		'completed',
	);
	return result;
};

export const createInvite: TallyEndpoints['organizationsCreateInvite'] =
	async (ctx, input) => {
		const { organizationId, ...body } = input;
		const result = await makeTallyRequest<
			TallyEndpointOutputs['organizationsCreateInvite']
		>(`organizations/${organizationId}/invites`, ctx.key, {
			method: 'POST',
			body: { ...body },
		});

		await logEventFromContext(
			ctx,
			'tally.organizations.createInvite',
			{ ...input },
			'completed',
		);
		return result;
	};

export const cancelInvite: TallyEndpoints['organizationsCancelInvite'] =
	async (ctx, input) => {
		const result = await makeTallyRequest<
			TallyEndpointOutputs['organizationsCancelInvite']
		>(
			`organizations/${input.organizationId}/invites/${input.inviteId}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'tally.organizations.cancelInvite',
			{ ...input },
			'completed',
		);
		return result;
	};

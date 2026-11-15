import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const listForUser: CodaEndpoints['packInvitationsListForUser'] = async (
	ctx,
	input,
) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packInvitationsListForUser']
	>('packs/invitations', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.packInvitations.listForUser',
		{ ...input },
		'completed',
	);
	return response;
};

const create: CodaEndpoints['packInvitationsCreate'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packInvitationsCreate']
	>(`packs/${encodeURIComponent(packId)}/invitations`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packInvitations.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackInvitations = {
	listForUser,
	create,
};

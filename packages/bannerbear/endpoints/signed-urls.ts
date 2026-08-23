import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const getSignedBases: BannerbearEndpoints['getSignedBases'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getSignedBases']
	>(`/v5/templates/${input.uid}/signed_bases`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.signed_bases.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const createSignedBase: BannerbearEndpoints['createSignedBase'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createSignedBase']
	>(`/v5/templates/${input.uid}/signed_bases`, ctx.key, {
		method: 'POST',
		body: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.signed_bases.create',
		{ ...input },
		'completed',
	);
	return response;
};

import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';
export const listReferrals: LeverEndpoints['listReferrals'] = async (
	ctx,
	input,
) => {
	const path = leverPathParameter(
		'/opportunities/{opportunityId}/referrals',
		'opportunityId',
		input.opportunityId,
	);
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listReferrals']
	>(ctx, path, { method: 'GET' });
	await logEventFromContext(ctx, 'lever.referrals.list', input, 'completed');
	return response;
};

export const retrieveReferral: LeverEndpoints['retrieveReferral'] = async (
	ctx,
	input,
) => {
	let path = leverPathParameter(
		'/opportunities/{opportunityId}/referrals',
		'opportunityId',
		input.opportunityId,
	);
	path = leverPathParameter(
		`${path}/{referralId}`,
		'referralId',
		input.referralId,
	);
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveReferral']
	>(ctx, path, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'lever.referrals.retrieve',
		input,
		'completed',
	);
	return response;
};

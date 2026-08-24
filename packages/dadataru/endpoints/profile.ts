import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruEndpoints } from '../index';

export const balance: DadataruEndpoints['getProfileBalance'] = async (ctx) => {
	const response = await makeDadataruRequest<any>('profile/balance', ctx.key, {
		method: 'GET',
		apiType: 'profile',
		secretKey: ctx.options.secret,
	});

	await logEventFromContext(ctx, 'dadataru.profile.balance', {}, 'completed');
	return response;
};

export const statistics: DadataruEndpoints['getProfileStatistics'] = async (
	ctx,
) => {
	const response = await makeDadataruRequest<any>('stat/daily', ctx.key, {
		method: 'GET',
		apiType: 'profile',
		secretKey: ctx.options.secret,
	});

	await logEventFromContext(
		ctx,
		'dadataru.profile.statistics',
		{},
		'completed',
	);
	return response;
};

export const versions: DadataruEndpoints['getReferenceVersions'] = async (
	ctx,
) => {
	// versions does not require x-secret, only api token
	const response = await makeDadataruRequest<any>('version', ctx.key, {
		method: 'GET',
		apiType: 'profile',
	});

	await logEventFromContext(ctx, 'dadataru.profile.versions', {}, 'completed');
	return response;
};

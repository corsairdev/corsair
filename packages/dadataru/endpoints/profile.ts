import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruEndpoints } from '../index';
import type {
	BalanceResponse,
	StatisticsResponse,
	VersionsResponse,
} from './types';

export const balance: DadataruEndpoints['getProfileBalance'] = async (ctx) => {
	const response = await makeDadataruRequest<BalanceResponse>(
		'profile/balance',
		ctx.key,
		{
			method: 'GET',
			apiType: 'profile',
			secretKey: (await ctx.keys.get_secret_key()) ?? undefined,
		},
	);

	await logEventFromContext(ctx, 'dadataru.profile.balance', {}, 'completed');
	return response;
};

export const statistics: DadataruEndpoints['getProfileStatistics'] = async (
	ctx,
) => {
	const response = await makeDadataruRequest<StatisticsResponse>(
		'stat/daily',
		ctx.key,
		{
			method: 'GET',
			apiType: 'profile',
			secretKey: (await ctx.keys.get_secret_key()) ?? undefined,
		},
	);

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
	const response = await makeDadataruRequest<VersionsResponse>(
		'version',
		ctx.key,
		{
			method: 'GET',
			apiType: 'profile',
		},
	);

	await logEventFromContext(ctx, 'dadataru.profile.versions', {}, 'completed');
	return response;
};

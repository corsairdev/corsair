import { logEventFromContext } from 'corsair/core';
import { makeWizaRequest } from '../client';
import type { WizaEndpoints } from '../index';
import type { GetCreditsResponse } from './types';

export const get: WizaEndpoints['creditsGet'] = async (ctx, _input) => {
	const response = await makeWizaRequest<GetCreditsResponse>(
		'/api/meta/credits',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'wiza.credits.get',
		{ api_credits: response.credits.api_credits },
		'completed',
	);

	return response;
};

export const Credits = { get };

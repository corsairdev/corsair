import { logEventFromContext } from 'corsair/core';
import type { JungleScoutEndpoints } from '..';
import { makeJungleScoutRequest } from '../client';
import {
	JungleScoutEndpointInputSchemas,
	JungleScoutEndpointOutputSchemas,
} from './types';

export const get: JungleScoutEndpoints['shareOfVoice.get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JungleScoutEndpointInputSchemas['shareOfVoice.get'].parse(input);

	const queryParams: Record<string, string | number | boolean | undefined> = {
		marketplace: parsedInput.marketplace,
		keyword: parsedInput.keyword,
	};

	const response = await makeJungleScoutRequest(
		'/api/share_of_voice',
		ctx.key,
		{
			method: 'GET',
			query: queryParams,
			apiType: ctx.options?.apiType,
		},
	);

	const parsed =
		JungleScoutEndpointOutputSchemas['shareOfVoice.get'].parse(response);

	await logEventFromContext(
		ctx,
		'junglescout.shareOfVoice.get',
		{
			marketplace: parsedInput.marketplace,
		},
		'completed',
	);

	return parsed;
};

export const ShareOfVoice = {
	get,
};

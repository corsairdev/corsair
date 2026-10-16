import { logEventFromContext } from 'corsair/core';
import type { AktaEndpoints } from '..';
import { makeAktaRequest } from '../client';
import { AktaEndpointInputSchemas, AktaEndpointOutputSchemas } from './types';

export const search: AktaEndpoints['industrySearch'] = async (ctx, input) => {
	const parsed = AktaEndpointInputSchemas.industrySearch.parse(input);

	// 204 (no match) has no body.
	const raw = await makeAktaRequest('v1/industry/search/', ctx.key, {
		query: parsed.query,
		level: parsed.level,
	});
	const result = AktaEndpointOutputSchemas.industrySearch.parse(
		raw ?? { data: [], count: 0, credits_consumed: 0 },
	);

	await logEventFromContext(
		ctx,
		'akta.industry.search',
		{ resultCount: result.data.length },
		'completed',
	);
	return result;
};

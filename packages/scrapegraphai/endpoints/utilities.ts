import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type { UtilitiesToonifyResponse } from './types';

export const toonify: ScrapegraphAiEndpoints['utilitiesToonify'] = async (
	ctx,
	input,
) => {
	// The API accepts the JSON object to convert as the raw request body —
	// `data` is a Corsair-side ergonomic wrapper, not part of the wire shape.
	const response = await makeScrapegraphAiRequest<UtilitiesToonifyResponse>(
		'v1/toonify',
		ctx.key,
		{ method: 'POST', body: input.data ?? {} },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.utilities.toonify',
		{ keys: input.data ? Object.keys(input.data).length : 0 },
		'completed',
	);
	return response;
};

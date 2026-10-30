import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const list = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.botsList.parse(input ?? {});

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/bots', ctx.key, {
		method: 'GET',
		query: {
			keyword: parsed.keyword ?? parsed.search,
			page: parsed.page,
			per_page: parsed.per_page,
		},
	});

	const response = CodyEndpointOutputSchemas.botsList.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.bots.list',
		{ keyword: parsed.keyword ?? parsed.search, page: parsed.page },
		'completed',
	);

	return response;
};

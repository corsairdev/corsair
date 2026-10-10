import { logEventFromContext } from 'corsair/core';
import type { DaffyEndpoints } from '..';
import { makeDaffyRequest } from '../client';
import { DaffyEndpointInputSchemas, DaffyEndpointOutputSchemas } from './types';

export const getByEin: DaffyEndpoints['getNonProfitByEin2'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.getNonProfitByEin2.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.getNonProfitByEin2.parse(
		await makeDaffyRequest(
			`/non_profits/${encodeURIComponent(input.ein)}`,
			ctx.key,
		),
	);
	await logEventFromContext(
		ctx,
		'daffy.nonProfits.getByEin',
		input,
		'completed',
	);
	return response;
};

export const search: DaffyEndpoints['searchNonProfits'] = async (
	ctx,
	rawInput,
) => {
	const input = DaffyEndpointInputSchemas.searchNonProfits.parse(rawInput);
	const response = DaffyEndpointOutputSchemas.searchNonProfits.parse(
		await makeDaffyRequest('/non_profits', ctx.key, {
			query: { cause_id: input.causeId, query: input.query, page: input.page },
		}),
	);
	await logEventFromContext(ctx, 'daffy.nonProfits.search', input, 'completed');
	return response;
};

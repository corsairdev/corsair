import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type { VoucherListResponse } from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['voucherListList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.voucherListList.parse(input);
	const response = await makeLexofficeRequest<VoucherListResponse>(
		'/voucherlist',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed = LexofficeEndpointOutputSchemas.voucherListList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.voucherlist.list',
		{ count: parsed.content.length },
		'completed',
	);
	return parsed;
};

import { logEventFromContext } from 'corsair/core';
import type { CastingwordsEndpoints } from '..';
import { makeCastingwordsRequest } from '../../client';
import { CastingwordsEndpointOutputSchemas } from '../types';

export const getInvoice: CastingwordsEndpoints['getInvoice'] = async (ctx, input) => {
	const response = await makeCastingwordsRequest<unknown>(
		`invoice/${encodeURIComponent(String(input.invoiceId))}`,
		ctx.key,
	);
	const parsed = CastingwordsEndpointOutputSchemas.getInvoice.parse(response);
	await logEventFromContext(ctx, 'castingwords.get_invoice', { invoiceId: input.invoiceId }, 'completed');
	return parsed;
};

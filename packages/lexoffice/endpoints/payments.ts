import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type { PaymentInformation } from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const get: LexofficeEndpoints['paymentsGet'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.paymentsGet.parse(input);
	const response = await makeLexofficeRequest<PaymentInformation>(
		`/payments/${encodeURIComponent(parsedInput.voucherId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.paymentsGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.payments.get',
		{ voucherId: parsedInput.voucherId },
		'completed',
	);
	return parsed;
};

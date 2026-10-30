import { logEventFromContext } from 'corsair/core';
import type { ImagiorEndpoints } from '..';
import { makeImagiorRequest } from '../client';
import {
	ImagiorEndpointInputSchemas,
	ImagiorEndpointOutputSchemas,
} from './types';

export const getAccount: ImagiorEndpoints['getAccount'] = async (
	ctx,
	input,
) => {
	const parsedInput = ImagiorEndpointInputSchemas.getAccount.parse(input);
	const raw = await makeImagiorRequest('user/account', ctx.key, {
		method: 'GET',
	});
	const response = ImagiorEndpointOutputSchemas.getAccount.parse(raw);

	await logEventFromContext(
		ctx,
		'imagior.account.get',
		parsedInput,
		'completed',
	);
	return response;
};

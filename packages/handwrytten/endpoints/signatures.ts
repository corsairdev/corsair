import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { SignaturesListResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const list: HandwryttenEndpoints['signatures.list'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['signatures.list'].parse(input);
	const response = await makeHandwryttenRequest<SignaturesListResponse>(
		'/profile/signatures',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['signatures.list'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.signatures.list',
		{ count: parsed.signatures?.length ?? 0 },
		'completed',
	);
	return parsed;
};

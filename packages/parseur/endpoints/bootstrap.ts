import { logEventFromContext } from 'corsair/core';
import { makeParseurRequest } from '../client';
import type { ParseurEndpoints } from '../index';
import { GetBootstrapInputSchema, GetBootstrapOutputSchema } from './types';

export const getBootstrap: ParseurEndpoints['getBootstrap'] = async (
	ctx,
	input,
) => {
	GetBootstrapInputSchema.parse(input);
	const response = await makeParseurRequest<unknown>('/bootstrap', {
		apiKey: ctx.key,
		method: 'GET',
	});

	const output = GetBootstrapOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'parseur.bootstrap.getBootstrap',
		{},
		'completed',
	);

	return output;
};

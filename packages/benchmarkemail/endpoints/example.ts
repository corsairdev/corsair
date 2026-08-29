import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const get: BenchmarkEmailEndpoints['exampleGet'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'benchmarkemail.example.get',
		{ ...input },
		'completed',
	);
	return response;
};

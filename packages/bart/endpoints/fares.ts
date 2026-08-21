import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointInputSchemas, BartEndpointOutputSchemas } from './types';

export const calculate: BartEndpoints['faresCalculate'] = async (
	ctx,
	input,
) => {
	const parsedInput = BartEndpointInputSchemas.faresCalculate.parse(input);
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'fare',
			orig: parsedInput.orig,
			dest: parsedInput.dest,
			date: parsedInput.date,
			sched: parsedInput.sched,
		},
	});

	const response = BartEndpointOutputSchemas.faresCalculate.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.fares.calculate',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

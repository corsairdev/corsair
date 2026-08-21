import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointOutputSchemas } from './types';

export const calculate: BartEndpoints['faresCalculate'] = async (
	ctx,
	input,
) => {
	const raw = await makeBartRequest<unknown>('sched.aspx', ctx.key, {
		query: {
			cmd: 'fare',
			orig: input.orig,
			dest: input.dest,
			date: input.date,
			sched: input.sched,
		},
	});

	const response = BartEndpointOutputSchemas.faresCalculate.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.fares.calculate',
		{ ...input },
		'completed',
	);
	return response;
};

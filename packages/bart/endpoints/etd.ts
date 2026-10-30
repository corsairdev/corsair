import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointInputSchemas, BartEndpointOutputSchemas } from './types';

export const station: BartEndpoints['etdStation'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.etdStation.parse(input);
	const raw = await makeBartRequest<unknown>('etd.aspx', ctx.key, {
		query: {
			cmd: 'etd',
			orig: parsedInput.orig,
			plat: parsedInput.plat,
			dir: parsedInput.dir,
		},
	});

	const response = BartEndpointOutputSchemas.etdStation.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.etd.station',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

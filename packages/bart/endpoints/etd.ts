import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointOutputSchemas } from './types';

export const station: BartEndpoints['etdStation'] = async (ctx, input) => {
	const raw = await makeBartRequest<unknown>('etd.aspx', ctx.key, {
		query: {
			cmd: 'etd',
			orig: input.orig,
			plat: input.plat,
			dir: input.dir,
		},
	});

	const response = BartEndpointOutputSchemas.etdStation.parse(raw);
	await logEventFromContext(ctx, 'bart.etd.station', { ...input }, 'completed');
	return response;
};

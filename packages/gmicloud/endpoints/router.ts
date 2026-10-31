import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const autoroute: GmicloudEndpoints['routerAutoroute'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.routerAutoroute.parse(input);
	// The router streams by default; stream: false returns one JSON object.
	const result = GmicloudEndpointOutputSchemas.routerAutoroute.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/ie/recommendation/autoroute',
			body: { ...body, stream: false },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.router.autoroute',
		{ model: result.model, mode: body.mode },
		'completed',
	);
	return result;
};

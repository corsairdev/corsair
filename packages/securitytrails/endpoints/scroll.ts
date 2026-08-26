import { logEventFromContext } from 'corsair/core';
import { makeSecuritytrailsRequest } from '../client';
import type { SecuritytrailsEndpoints } from '../index';
import type { SecuritytrailsEndpointOutputs } from './types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './types';

/**
 * `GET /v1/scroll/{scroll_id}` — next page of a DSL search.
 *
 * The body is whichever envelope the originating endpoint returns, so the
 * result is passed through rather than reshaped. Scroll cursors expire after a
 * couple of minutes.
 * https://docs.securitytrails.com/reference/scroll-old-1
 */
export const get: SecuritytrailsEndpoints['scrollGet'] = async (ctx, input) => {
	const { scroll_id } =
		SecuritytrailsEndpointInputSchemas.scrollGet.parse(input);

	const response = await makeSecuritytrailsRequest<
		SecuritytrailsEndpointOutputs['scrollGet']
	>(`scroll/${encodeURIComponent(scroll_id)}`, ctx.key, {
		method: 'GET',
		schema: SecuritytrailsEndpointOutputSchemas.scrollGet,
	});

	await logEventFromContext(ctx, 'securitytrails.scroll.get', {}, 'completed');

	return response;
};

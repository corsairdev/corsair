import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Stars a company for the user (POST /user/stars). Stars are capped per
 * user: Remoet answers 409 when the company is already starred or the cap
 * is reached, and 404 when no active company has the slug.
 */
export const create: RemoetEndpoints['starsCreate'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.starsCreate.parse(input);
	const response = await makeRemoetRequest('/user/stars', ctx.key, {
		method: 'POST',
		body: { companySlug: parsed.companySlug },
	});
	const validated = RemoetEndpointOutputSchemas.starsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.stars.create',
		{ companySlug: parsed.companySlug, company: validated.company },
		'completed',
	);
	return validated;
};

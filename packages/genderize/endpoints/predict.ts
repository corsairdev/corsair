import { logEventFromContext } from 'corsair/core';
import type { GenderizeContext, GenderizeEndpoints } from '..';
import type { GenderizeCredentials } from '../client';
import { definedQuery, makeGenderizeRequest } from '../client';
import {
	GenderizeEndpointInputSchemas,
	GenderizeEndpointOutputSchemas,
} from './types';

/**
 * Genderize authenticates with a query parameter, so the key is resolved here
 * rather than in a header. It comes only from the key the key builder resolved
 * (`ctx.key`, which a `before` hook may have replaced), never from tool input,
 * so a key never lands in the model's context, tool logs or events. An empty
 * key is dropped instead of sent, which lets the API fall back to its
 * IP-scoped allowance.
 */
function resolveCredentials(ctx: GenderizeContext): GenderizeCredentials {
	return { apiKey: ctx.key || undefined };
}

/** A name is personal data, so the log records the prediction, not the name. */
export const predict: GenderizeEndpoints['name']['predict'] = async (
	ctx,
	input,
) => {
	const parsed = GenderizeEndpointInputSchemas.predict.parse(input ?? {});

	const raw = await makeGenderizeRequest(resolveCredentials(ctx), {
		path: '/',
		query: definedQuery({
			name: parsed.name,
			country_id: parsed.country_id,
		}),
	});

	const result = GenderizeEndpointOutputSchemas.predict.parse(raw);

	await logEventFromContext(
		ctx,
		'genderize.name.predict',
		{
			gender: result.gender ?? 'unknown',
			probability: result.probability,
			count: result.count,
			country_id: result.country_id,
		},
		'completed',
	);
	return result;
};

/**
 * A batch sends repeated `name[]` parameters and answers an array in the same
 * order. The key is one `apikey` for the whole request, so it cannot vary per
 * name.
 */
export const batch: GenderizeEndpoints['batch']['names'] = async (
	ctx,
	input,
) => {
	const parsed = GenderizeEndpointInputSchemas.batch.parse(input ?? {});

	const raw = await makeGenderizeRequest(resolveCredentials(ctx), {
		path: '/',
		// `name[]` is the documented spelling for a batch, and the query builder
		// repeats an array key rather than joining it.
		query: definedQuery({
			'name[]': parsed.names,
			country_id: parsed.country_id,
		}),
	});

	const result = GenderizeEndpointOutputSchemas.batch.parse(raw);

	await logEventFromContext(
		ctx,
		'genderize.batch.names',
		{
			count: result.length,
			// Each name in a batch counts against the monthly quota, and the ones
			// with no match are the useful number when reconciling.
			unknown: result.filter((row) => row.gender === null).length,
		},
		'completed',
	);
	return result;
};

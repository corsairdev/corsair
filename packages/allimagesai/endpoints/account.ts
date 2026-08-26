import { logEventFromContext } from 'corsair/core';
import { makeAllimagesaiRequest } from '../client';
import type { AllimagesaiEndpoints } from '../index';
import type { AllimagesaiEndpointOutputs } from './types';
import { AllimagesaiEndpointOutputSchemas } from './types';

/**
 * `GET /v1/api-keys/check` — validates the key and returns the account it
 * belongs to.
 * https://developer.all-images.ai/all-images.ai-api/api-reference/api-keys
 */
export const check: AllimagesaiEndpoints['apiKeysCheck'] = async (ctx) => {
	const response = await makeAllimagesaiRequest<
		AllimagesaiEndpointOutputs['apiKeysCheck']
	>('api-keys/check', ctx.key, {
		method: 'GET',
		schema: AllimagesaiEndpointOutputSchemas.apiKeysCheck,
	});

	// The response is the account's email address; log the event, not the value.
	await logEventFromContext(ctx, 'allimagesai.apiKeys.check', {}, 'completed');

	return response;
};

/**
 * `GET /v1/credit` — remaining quota per credit bucket.
 *
 * Singular `credit`, even though the operation is named "credits" and returns a
 * `credits` array. An empty array means the account has no provisioned quotas.
 * https://api.all-images.ai/doc-json
 */
export const credits: AllimagesaiEndpoints['creditsGet'] = async (ctx) => {
	const response = await makeAllimagesaiRequest<
		AllimagesaiEndpointOutputs['creditsGet']
	>('credit', ctx.key, {
		method: 'GET',
		schema: AllimagesaiEndpointOutputSchemas.creditsGet,
	});

	await logEventFromContext(ctx, 'allimagesai.credits.get', {}, 'completed');

	return response;
};

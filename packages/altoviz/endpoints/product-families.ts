import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProductFamily, evictEntity } from './persist';
import { buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs } from './types';

/** No internalId here, unlike customer families. */
export const create: AltovizEndpoints['productFamilies']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({ label: input.label, number: input.number });

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productFamiliesCreate']
	>('v1/productfamilies', ctx.key, { method: 'POST', body });

	await cacheProductFamily(ctx.db.productFamilies, result);

	await logEventFromContext(
		ctx,
		'altoviz.productFamilies.create',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['productFamilies']['get'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productFamiliesGet']
	>(`v1/productfamilies/{id}`, ctx.key, { path: { id: input.familyId } });

	await cacheProductFamily(ctx.db.productFamilies, result);

	await logEventFromContext(
		ctx,
		'altoviz.productFamilies.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Same 409-not-cascade rule as customer families - confirmed live for both. */
export const remove: AltovizEndpoints['productFamilies']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/productfamilies/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.familyId },
	});

	await evictEntity(ctx.db.productFamilies, input.familyId, 'product family');

	await logEventFromContext(
		ctx,
		'altoviz.productFamilies.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.familyId };
};

export const list: AltovizEndpoints['productFamilies']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productFamiliesList']
	>('v1/productfamilies', ctx.key, { query: buildPagingQuery(input) });

	for (const family of result)
		await cacheProductFamily(ctx.db.productFamilies, family);

	await logEventFromContext(
		ctx,
		'altoviz.productFamilies.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

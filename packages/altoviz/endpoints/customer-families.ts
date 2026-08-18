import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheCustomerFamily, evictEntity } from './persist';
import { buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs } from './types';

export const create: AltovizEndpoints['customerFamilies']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({
		label: input.label,
		number: input.number,
		internalId: input.internalId,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customerFamiliesCreate']
	>('v1/customerfamilies', ctx.key, { method: 'POST', body });

	await cacheCustomerFamily(ctx.db.customerFamilies, result);

	await logEventFromContext(
		ctx,
		'altoviz.customerFamilies.create',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['customerFamilies']['get'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customerFamiliesGet']
	>(`v1/customerfamilies/{id}`, ctx.key, { path: { id: input.familyId } });

	await cacheCustomerFamily(ctx.db.customerFamilies, result);

	await logEventFromContext(
		ctx,
		'altoviz.customerFamilies.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** No cascade: a family that still holds a member answers 409, not a delete - confirmed live. The 409 is reported by CONFLICT_ERROR in error-handlers.ts, not swallowed here. */
export const remove: AltovizEndpoints['customerFamilies']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/customerfamilies/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.familyId },
	});

	await evictEntity(ctx.db.customerFamilies, input.familyId, 'customer family');

	await logEventFromContext(
		ctx,
		'altoviz.customerFamilies.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.familyId };
};

export const list: AltovizEndpoints['customerFamilies']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customerFamiliesList']
	>('v1/customerfamilies', ctx.key, { query: buildPagingQuery(input) });

	for (const family of result)
		await cacheCustomerFamily(ctx.db.customerFamilies, family);

	await logEventFromContext(
		ctx,
		'altoviz.customerFamilies.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

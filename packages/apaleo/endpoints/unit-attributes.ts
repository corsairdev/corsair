import { logEventFromContext } from 'corsair/core';
import type { ApaleoEndpoints } from '..';
import { apaleoResourceExists, makeApaleoRequest } from '../client';
import { compactQuery, evictEntity, upsertEntity } from './persist';
import type { ApaleoEndpointOutputs } from './types';
import { ApaleoEndpointOutputSchemas } from './types';

const ATTRIBUTES = '/inventory/v1/unit-attributes';

export const get: ApaleoEndpoints['unitAttributesGet'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(
		`${ATTRIBUTES}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const response = ApaleoEndpointOutputSchemas.unitAttributesGet.parse(raw);
	await upsertEntity(ctx.db.unitAttributes, response.id, response);
	await logEventFromContext(
		ctx,
		'apaleo.unitAttributes.get',
		{ id: input.id },
		'completed',
	);
	return response as ApaleoEndpointOutputs['unitAttributesGet'];
};

export const remove: ApaleoEndpoints['unitAttributesDelete'] = async (
	ctx,
	input,
) => {
	await makeApaleoRequest(
		`${ATTRIBUTES}/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await evictEntity(ctx.db.unitAttributes, input.id);
	await logEventFromContext(
		ctx,
		'apaleo.unitAttributes.delete',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

export const exists: ApaleoEndpoints['unitAttributesExists'] = async (
	ctx,
	input,
) => {
	const exists = await apaleoResourceExists(
		`${ATTRIBUTES}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'apaleo.unitAttributes.exists',
		{ id: input.id },
		'completed',
	);
	return { exists };
};

export const list: ApaleoEndpoints['unitAttributesList'] = async (
	ctx,
	input,
) => {
	const raw = await makeApaleoRequest(ATTRIBUTES, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.unitAttributesList.parse(raw);
	for (const attribute of response.unitAttributes) {
		await upsertEntity(ctx.db.unitAttributes, attribute.id, attribute);
	}
	await logEventFromContext(ctx, 'apaleo.unitAttributes.list', {}, 'completed');
	return response as ApaleoEndpointOutputs['unitAttributesList'];
};

export const create: ApaleoEndpoints['unitAttributesCreate'] = async (
	ctx,
	input,
) => {
	const raw = await makeApaleoRequest(ATTRIBUTES, ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = ApaleoEndpointOutputSchemas.unitAttributesCreate.parse(raw);
	await upsertEntity(ctx.db.unitAttributes, response.id, {
		id: response.id,
		name: input.name,
		description: input.description,
	});
	await logEventFromContext(
		ctx,
		'apaleo.unitAttributes.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

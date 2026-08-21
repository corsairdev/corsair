import { logEventFromContext } from 'corsair/core';
import type { ApaleoEndpoints } from '..';
import { apaleoResourceExists, makeApaleoRequest } from '../client';
import { compactQuery, evictEntity, upsertEntity } from './persist';
import type { ApaleoEndpointOutputs } from './types';
import { ApaleoEndpointOutputSchemas } from './types';

const PROPERTIES = '/inventory/v1/properties';

export const list: ApaleoEndpoints['propertiesList'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(PROPERTIES, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.propertiesList.parse(raw);
	for (const property of response.properties) {
		await upsertEntity(ctx.db.properties, property.id, property);
	}
	await logEventFromContext(ctx, 'apaleo.properties.list', {}, 'completed');
	return response as ApaleoEndpointOutputs['propertiesList'];
};

export const create: ApaleoEndpoints['propertiesCreate'] = async (
	ctx,
	input,
) => {
	const raw = await makeApaleoRequest(PROPERTIES, ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = ApaleoEndpointOutputSchemas.propertiesCreate.parse(raw);
	await logEventFromContext(
		ctx,
		'apaleo.properties.create',
		{ code: input.code },
		'completed',
	);
	return response;
};

export const count: ApaleoEndpoints['propertiesCount'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(`${PROPERTIES}/$count`, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.propertiesCount.parse(raw);
	await logEventFromContext(ctx, 'apaleo.properties.count', {}, 'completed');
	return response;
};

export const exists: ApaleoEndpoints['propertiesExists'] = async (
	ctx,
	input,
) => {
	const exists = await apaleoResourceExists(
		`${PROPERTIES}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'apaleo.properties.exists',
		{ id: input.id },
		'completed',
	);
	return { exists };
};

export const get: ApaleoEndpoints['propertiesGet'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(
		`${PROPERTIES}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const response = ApaleoEndpointOutputSchemas.propertiesGet.parse(raw);
	await upsertEntity(ctx.db.properties, response.id, response);
	await logEventFromContext(
		ctx,
		'apaleo.properties.get',
		{ id: input.id },
		'completed',
	);
	return response as ApaleoEndpointOutputs['propertiesGet'];
};

export const clone: ApaleoEndpoints['propertiesClone'] = async (ctx, input) => {
	const { id, ...body } = input;
	const raw = await makeApaleoRequest(
		`/inventory/v1/property-actions/${encodeURIComponent(id)}/clone`,
		ctx.key,
		{ method: 'POST', body },
	);
	const response = ApaleoEndpointOutputSchemas.propertiesClone.parse(raw);
	await logEventFromContext(
		ctx,
		'apaleo.properties.clone',
		{ id },
		'completed',
	);
	return response;
};

export const archive: ApaleoEndpoints['propertiesArchive'] = async (
	ctx,
	input,
) => {
	await makeApaleoRequest(
		`/inventory/v1/property-actions/${encodeURIComponent(input.id)}/archive`,
		ctx.key,
		{ method: 'PUT' },
	);
	await evictEntity(ctx.db.properties, input.id);
	await logEventFromContext(
		ctx,
		'apaleo.properties.archive',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

export const setLive: ApaleoEndpoints['propertiesSetLive'] = async (
	ctx,
	input,
) => {
	await makeApaleoRequest(
		`/inventory/v1/property-actions/${encodeURIComponent(input.id)}/set-live`,
		ctx.key,
		{ method: 'PUT' },
	);
	await evictEntity(ctx.db.properties, input.id);
	await logEventFromContext(
		ctx,
		'apaleo.properties.setLive',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

export const reset: ApaleoEndpoints['propertiesReset'] = async (ctx, input) => {
	await makeApaleoRequest(
		`/inventory/v1/property-actions/${encodeURIComponent(input.id)}/reset`,
		ctx.key,
		{ method: 'PUT' },
	);
	await logEventFromContext(
		ctx,
		'apaleo.properties.reset',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

export const countries: ApaleoEndpoints['propertiesCountries'] = async (
	ctx,
) => {
	const raw = await makeApaleoRequest('/inventory/v1/types/countries', ctx.key);
	const response = ApaleoEndpointOutputSchemas.propertiesCountries.parse(raw);
	await logEventFromContext(
		ctx,
		'apaleo.properties.countries',
		{},
		'completed',
	);
	return response;
};

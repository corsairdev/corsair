import { logEventFromContext } from 'corsair/core';
import type { ApaleoEndpoints } from '..';
import { apaleoResourceExists, makeApaleoRequest } from '../client';
import { compactQuery, evictEntity, upsertEntity } from './persist';
import type { ApaleoEndpointOutputs } from './types';
import { ApaleoEndpointOutputSchemas } from './types';

const UNITS = '/inventory/v1/units';

export const get: ApaleoEndpoints['unitsGet'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(
		`${UNITS}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const response = ApaleoEndpointOutputSchemas.unitsGet.parse(raw);
	await upsertEntity(ctx.db.units, response.id, response);
	await logEventFromContext(
		ctx,
		'apaleo.units.get',
		{ id: input.id },
		'completed',
	);
	return response as ApaleoEndpointOutputs['unitsGet'];
};

export const exists: ApaleoEndpoints['unitsExists'] = async (ctx, input) => {
	const exists = await apaleoResourceExists(
		`${UNITS}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'apaleo.units.exists',
		{ id: input.id },
		'completed',
	);
	return { exists };
};

export const remove: ApaleoEndpoints['unitsDelete'] = async (ctx, input) => {
	await makeApaleoRequest(`${UNITS}/${encodeURIComponent(input.id)}`, ctx.key, {
		method: 'DELETE',
	});
	await evictEntity(ctx.db.units, input.id);
	await logEventFromContext(
		ctx,
		'apaleo.units.delete',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

export const list: ApaleoEndpoints['unitsList'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(UNITS, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.unitsList.parse(raw);
	for (const unit of response.units) {
		await upsertEntity(ctx.db.units, unit.id, unit);
	}
	await logEventFromContext(ctx, 'apaleo.units.list', {}, 'completed');
	return response as ApaleoEndpointOutputs['unitsList'];
};

export const create: ApaleoEndpoints['unitsCreate'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(UNITS, ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = ApaleoEndpointOutputSchemas.unitsCreate.parse(raw);
	await logEventFromContext(
		ctx,
		'apaleo.units.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const count: ApaleoEndpoints['unitsCount'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(`${UNITS}/$count`, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.unitsCount.parse(raw);
	await logEventFromContext(ctx, 'apaleo.units.count', {}, 'completed');
	return response;
};

export const createBulk: ApaleoEndpoints['unitsCreateBulk'] = async (
	ctx,
	input,
) => {
	const raw = await makeApaleoRequest(`${UNITS}/bulk`, ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = ApaleoEndpointOutputSchemas.unitsCreateBulk.parse(raw);
	await logEventFromContext(ctx, 'apaleo.units.createBulk', {}, 'completed');
	return response;
};

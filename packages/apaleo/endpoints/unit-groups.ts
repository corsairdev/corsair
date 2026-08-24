import { logEventFromContext } from 'corsair/core';
import type { ApaleoEndpoints } from '..';
import { apaleoResourceExists, makeApaleoRequest } from '../client';
import { compactQuery, evictEntity, upsertEntity } from './persist';
import type { ApaleoEndpointOutputs } from './types';
import { ApaleoEndpointOutputSchemas } from './types';

const GROUPS = '/inventory/v1/unit-groups';

export const create: ApaleoEndpoints['unitGroupsCreate'] = async (
	ctx,
	input,
) => {
	const raw = await makeApaleoRequest(GROUPS, ctx.key, {
		method: 'POST',
		body: input,
	});
	const response = ApaleoEndpointOutputSchemas.unitGroupsCreate.parse(raw);
	await logEventFromContext(
		ctx,
		'apaleo.unitGroups.create',
		{ code: input.code },
		'completed',
	);
	return response;
};

export const list: ApaleoEndpoints['unitGroupsList'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(GROUPS, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.unitGroupsList.parse(raw);
	for (const group of response.unitGroups) {
		await upsertEntity(ctx.db.unitGroups, group.id, group);
	}
	await logEventFromContext(ctx, 'apaleo.unitGroups.list', {}, 'completed');
	return response as ApaleoEndpointOutputs['unitGroupsList'];
};

export const count: ApaleoEndpoints['unitGroupsCount'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(`${GROUPS}/$count`, ctx.key, {
		query: compactQuery(input),
	});
	const response = ApaleoEndpointOutputSchemas.unitGroupsCount.parse(raw);
	await logEventFromContext(ctx, 'apaleo.unitGroups.count', {}, 'completed');
	return response;
};

export const exists: ApaleoEndpoints['unitGroupsExists'] = async (
	ctx,
	input,
) => {
	const exists = await apaleoResourceExists(
		`${GROUPS}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'apaleo.unitGroups.exists',
		{ id: input.id },
		'completed',
	);
	return { exists };
};

export const get: ApaleoEndpoints['unitGroupsGet'] = async (ctx, input) => {
	const raw = await makeApaleoRequest(
		`${GROUPS}/${encodeURIComponent(input.id)}`,
		ctx.key,
	);
	const response = ApaleoEndpointOutputSchemas.unitGroupsGet.parse(raw);
	await upsertEntity(ctx.db.unitGroups, response.id, response);
	await logEventFromContext(
		ctx,
		'apaleo.unitGroups.get',
		{ id: input.id },
		'completed',
	);
	return response as ApaleoEndpointOutputs['unitGroupsGet'];
};

export const replace: ApaleoEndpoints['unitGroupsReplace'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	await makeApaleoRequest(`${GROUPS}/${encodeURIComponent(id)}`, ctx.key, {
		method: 'PUT',
		body,
	});
	await evictEntity(ctx.db.unitGroups, id);
	await logEventFromContext(
		ctx,
		'apaleo.unitGroups.replace',
		{ id },
		'completed',
	);
	return { ok: true as const };
};

export const remove: ApaleoEndpoints['unitGroupsDelete'] = async (
	ctx,
	input,
) => {
	await makeApaleoRequest(
		`${GROUPS}/${encodeURIComponent(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await evictEntity(ctx.db.unitGroups, input.id);
	await logEventFromContext(
		ctx,
		'apaleo.unitGroups.delete',
		{ id: input.id },
		'completed',
	);
	return { ok: true as const };
};

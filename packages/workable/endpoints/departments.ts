import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableDepartment } from '../schema/database';
import { evictRow, persistRow, persistRows } from './persist';
import {
	compactBody,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['departmentsList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsList']
	>('/departments', ctx.key, account);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.departmentsList,
		raw,
	);
	await persistRows(
		ctx.db.departments,
		WorkableDepartment,
		response.departments,
		'department',
	);
	await logEventFromContext(ctx, 'workable.departments.list', {}, 'completed');
	return response;
};

export const create: WorkableEndpoints['departmentsCreate'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.departmentsCreate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsCreate']
	>('/departments', ctx.key, account, {
		method: 'POST',
		body: compactBody({ name: valid.name, parent_id: valid.parent_id }),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.departmentsCreate,
		raw,
	);
	await persistRow(
		ctx.db.departments,
		WorkableDepartment,
		response,
		'department',
	);
	await logEventFromContext(
		ctx,
		'workable.departments.create',
		{ name: valid.name },
		'completed',
	);
	return response;
};

export const update: WorkableEndpoints['departmentsUpdate'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.departmentsUpdate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsUpdate']
	>('/departments', ctx.key, account, {
		method: 'PUT',
		body: { id: valid.id, name: valid.name, parent_id: valid.parent_id },
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.departmentsUpdate,
		raw,
	);
	await persistRow(
		ctx.db.departments,
		WorkableDepartment,
		response,
		'department',
	);
	await logEventFromContext(
		ctx,
		'workable.departments.update',
		{ id: valid.id },
		'completed',
	);
	return response;
};

export const merge: WorkableEndpoints['departmentsMerge'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.departmentsMerge,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsMerge']
	>(`/departments/${encodeURIComponent(valid.id)}/merge`, ctx.key, account, {
		method: 'POST',
		body: compactBody({
			target_department_id: valid.target_department_id,
			force: valid.force,
		}),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.departmentsMerge,
		// An empty success carries no body — validate the empty object instead.
		raw ?? {},
	);
	await evictRow(ctx.db.departments, valid.id, 'department');
	await logEventFromContext(
		ctx,
		'workable.departments.merge',
		{ id: valid.id, target_department_id: valid.target_department_id },
		'completed',
	);
	return response;
};

export const remove: WorkableEndpoints['departmentsDelete'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.departmentsDelete,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsDelete']
	>(`/departments/${encodeURIComponent(valid.id)}`, ctx.key, account, {
		method: 'DELETE',
		query: { force: valid.force ? 'DELETE' : undefined },
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.departmentsDelete,
		// 204 No Content carries no body — validate the empty object instead.
		raw ?? {},
	);
	await evictRow(ctx.db.departments, valid.id, 'department');
	await logEventFromContext(
		ctx,
		'workable.departments.delete',
		{ id: valid.id },
		'completed',
	);
	return response;
};

import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableDepartment } from '../schema/database';
import { evictRow, persistRow, persistRows } from './persist';
import { compactBody, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['departmentsList'] = async (ctx) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsList']
	>('/departments', ctx.key, account);
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
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsCreate']
	>('/departments', ctx.key, account, {
		method: 'POST',
		body: compactBody({ name: input.name, parent_id: input.parent_id }),
	});
	await persistRow(
		ctx.db.departments,
		WorkableDepartment,
		response,
		'department',
	);
	await logEventFromContext(
		ctx,
		'workable.departments.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const update: WorkableEndpoints['departmentsUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsUpdate']
	>('/departments', ctx.key, account, {
		method: 'PUT',
		body: { id: input.id, name: input.name, parent_id: input.parent_id },
	});
	await persistRow(
		ctx.db.departments,
		WorkableDepartment,
		response,
		'department',
	);
	await logEventFromContext(
		ctx,
		'workable.departments.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const merge: WorkableEndpoints['departmentsMerge'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsMerge']
	>(`/departments/${encodeURIComponent(input.id)}/merge`, ctx.key, account, {
		method: 'POST',
		body: compactBody({
			target_department_id: input.target_department_id,
			force: input.force,
		}),
	});
	await evictRow(ctx.db.departments, input.id, 'department');
	await logEventFromContext(
		ctx,
		'workable.departments.merge',
		{ id: input.id, target_department_id: input.target_department_id },
		'completed',
	);
	return response;
};

export const remove: WorkableEndpoints['departmentsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['departmentsDelete']
	>(`/departments/${encodeURIComponent(input.id)}`, ctx.key, account, {
		method: 'DELETE',
		query: { force: input.force ? 'DELETE' : undefined },
	});
	await evictRow(ctx.db.departments, input.id, 'department');
	await logEventFromContext(
		ctx,
		'workable.departments.delete',
		{ id: input.id },
		'completed',
	);
	return response ?? {};
};

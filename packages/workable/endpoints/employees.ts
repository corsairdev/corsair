import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableEmployee } from '../schema/database';
import { persistRow, persistRows } from './persist';
import { compactBody, compactQuery, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['employeesList'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesList']
	>('/employees', ctx.key, account, {
		query: compactQuery({
			limit: input.limit,
			offset: input.offset,
			query: input.query,
			order_by: input.order_by,
			member_id: input.member_id,
		}),
	});
	await persistRows(
		ctx.db.employees,
		WorkableEmployee,
		response.employees,
		'employee',
	);
	await logEventFromContext(
		ctx,
		'workable.employees.list',
		{ limit: input.limit, offset: input.offset },
		'completed',
	);
	return response;
};

export const get: WorkableEndpoints['employeesGet'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesGet']
	>(`/employees/${encodeURIComponent(input.id)}`, ctx.key, account, {
		query: compactQuery({ member_id: input.member_id }),
	});
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.get',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const create: WorkableEndpoints['employeesCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesCreate']
	>('/employees', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			state: input.state,
			member_id: input.member_id,
			employee: input.employee,
		}),
	});
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.create',
		{ state: input.state },
		'completed',
	);
	return response;
};

export const update: WorkableEndpoints['employeesUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesUpdate']
	>(`/employees/${encodeURIComponent(input.id)}`, ctx.key, account, {
		method: 'PATCH',
		body: compactBody({ member_id: input.member_id, employee: input.employee }),
	});
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const uploadDocuments: WorkableEndpoints['employeesUploadDocuments'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeWorkableRequest<
			WorkableEndpointOutputs['employeesUploadDocuments']
		>(
			`/employees/${encodeURIComponent(input.id)}/documents`,
			ctx.key,
			account,
			{
				method: 'POST',
				body: compactBody({
					member_id: input.member_id,
					documents: input.documents,
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'workable.employees.upload_documents',
			{ id: input.id, count: input.documents.length },
			'completed',
		);
		return response;
	};

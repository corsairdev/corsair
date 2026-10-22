import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableEmployee } from '../schema/database';
import { persistRow, persistRows } from './persist';
import {
	compactBody,
	compactQuery,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['employeesList'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.employeesList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesList']
	>('/employees', ctx.key, account, {
		query: compactQuery({
			limit: valid.limit,
			offset: valid.offset,
			query: valid.query,
			order_by: valid.order_by,
			member_id: valid.member_id,
		}),
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.employeesList,
		raw,
	);
	await persistRows(
		ctx.db.employees,
		WorkableEmployee,
		response.employees,
		'employee',
	);
	await logEventFromContext(
		ctx,
		'workable.employees.list',
		{ limit: valid.limit, offset: valid.offset },
		'completed',
	);
	return response;
};

export const get: WorkableEndpoints['employeesGet'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.employeesGet,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesGet']
	>(`/employees/${encodeURIComponent(valid.id)}`, ctx.key, account, {
		query: compactQuery({ member_id: valid.member_id }),
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.employeesGet,
		raw,
	);
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.get',
		{ id: valid.id },
		'completed',
	);
	return response;
};

export const create: WorkableEndpoints['employeesCreate'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.employeesCreate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesCreate']
	>('/employees', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			state: valid.state,
			member_id: valid.member_id,
			employee: valid.employee,
		}),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.employeesCreate,
		raw,
	);
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.create',
		{ state: valid.state },
		'completed',
	);
	return response;
};

export const update: WorkableEndpoints['employeesUpdate'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.employeesUpdate,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['employeesUpdate']
	>(`/employees/${encodeURIComponent(valid.id)}`, ctx.key, account, {
		method: 'PATCH',
		body: compactBody({ member_id: valid.member_id, employee: valid.employee }),
		retryOnRateLimit: false,
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.employeesUpdate,
		raw,
	);
	await persistRow(ctx.db.employees, WorkableEmployee, response, 'employee');
	await logEventFromContext(
		ctx,
		'workable.employees.update',
		{ id: valid.id },
		'completed',
	);
	return response;
};

export const uploadDocuments: WorkableEndpoints['employeesUploadDocuments'] =
	async (ctx, input) => {
		const valid = parseEndpointInput(
			WorkableEndpointInputSchemas.employeesUploadDocuments,
			input,
		);
		const account = await resolveAccount(ctx);
		const raw = await makeWorkableRequest<
			WorkableEndpointOutputs['employeesUploadDocuments']
		>(
			`/employees/${encodeURIComponent(valid.id)}/documents`,
			ctx.key,
			account,
			{
				method: 'POST',
				body: compactBody({
					member_id: valid.member_id,
					documents: valid.documents,
				}),
				retryOnRateLimit: false,
			},
		);
		const response = parseEndpointOutput(
			WorkableEndpointOutputSchemas.employeesUploadDocuments,
			raw,
		);
		await logEventFromContext(
			ctx,
			'workable.employees.upload_documents',
			{ id: valid.id, count: valid.documents.length },
			'completed',
		);
		return response;
	};

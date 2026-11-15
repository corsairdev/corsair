import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const workOrdersCreate: JobNimbusEndpoints['workOrdersCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.workOrdersCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/workorders',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed =
		JobNimbusEndpointOutputSchemas.workOrdersCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.work_orders.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const workOrdersUpdate: JobNimbusEndpoints['workOrdersUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.workOrdersUpdate.parse(input);
	const { id, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/workorders/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed =
		JobNimbusEndpointOutputSchemas.workOrdersUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.work_orders.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const workOrdersDelete: JobNimbusEndpoints['workOrdersDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.workOrdersDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/workorders/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed =
		JobNimbusEndpointOutputSchemas.workOrdersDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.work_orders.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const workOrdersGet: JobNimbusEndpoints['workOrdersGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.workOrdersGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/workorders/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.workOrdersGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.work_orders.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const workOrdersList: JobNimbusEndpoints['workOrdersList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.workOrdersList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/workorders',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				size: parsedInput.size,
				from: parsedInput.from,
				sort: parsedInput.sort,
				direction: parsedInput.direction,
				actor: parsedInput.actor,
			}),
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.workOrdersList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.work_orders.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const WorkOrders = {
	create: workOrdersCreate,
	update: workOrdersUpdate,
	delete: workOrdersDelete,
	get: workOrdersGet,
	list: workOrdersList,
};

import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const estimatesCreate: JobNimbusEndpoints['estimatesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.estimatesCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/estimates',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.estimatesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.estimates.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const estimatesUpdate: JobNimbusEndpoints['estimatesUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.estimatesUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/estimates/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.estimatesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.estimates.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const estimatesDelete: JobNimbusEndpoints['estimatesDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.estimatesDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/estimates/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.estimatesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.estimates.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const estimatesGet: JobNimbusEndpoints['estimatesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.estimatesGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/estimates/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.estimatesGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.estimates.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const estimatesList: JobNimbusEndpoints['estimatesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.estimatesList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/estimates',
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
	const parsed = JobNimbusEndpointOutputSchemas.estimatesList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.estimates.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Estimates = {
	create: estimatesCreate,
	update: estimatesUpdate,
	delete: estimatesDelete,
	get: estimatesGet,
	list: estimatesList,
};

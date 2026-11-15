import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const jobsCreate: JobNimbusEndpoints['jobsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.jobsCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/jobs',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.jobsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.jobs.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const jobsUpdate: JobNimbusEndpoints['jobsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.jobsUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/jobs/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.jobsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.jobs.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const jobsDelete: JobNimbusEndpoints['jobsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.jobsDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/jobs/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.jobsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.jobs.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const jobsGet: JobNimbusEndpoints['jobsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.jobsGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/jobs/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.jobsGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.jobs.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const jobsList: JobNimbusEndpoints['jobsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.jobsList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/jobs',
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
	const parsed = JobNimbusEndpointOutputSchemas.jobsList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.jobs.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Jobs = {
	create: jobsCreate,
	update: jobsUpdate,
	delete: jobsDelete,
	get: jobsGet,
	list: jobsList,
};

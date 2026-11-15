import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const activitiesCreate: JobNimbusEndpoints['activitiesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.activitiesCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/activities',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed =
		JobNimbusEndpointOutputSchemas.activitiesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.activities.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const activitiesGet: JobNimbusEndpoints['activitiesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.activitiesGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/activities/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.activitiesGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.activities.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const activitiesList: JobNimbusEndpoints['activitiesList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JobNimbusEndpointInputSchemas.activitiesList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/activities',
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
	const parsed = JobNimbusEndpointOutputSchemas.activitiesList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.activities.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Activities = {
	create: activitiesCreate,
	get: activitiesGet,
	list: activitiesList,
};

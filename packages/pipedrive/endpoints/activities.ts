import { logEventFromContext } from 'corsair/core';
import { makePipedriveRequest } from '../client';
import type { PipedriveEndpoints } from '../index';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './types';

type QueryScalar = string | number | boolean | undefined;

function toQuery(
	input: Record<string, QueryScalar | string[] | number[]>,
): Record<string, QueryScalar> {
	return Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			Array.isArray(value) ? value.join(',') : value,
		]),
	);
}

function authType(ctx: Parameters<PipedriveEndpoints['activityList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listActivities: PipedriveEndpoints['activityList'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.activityList.parse(input);
	const response = await makePipedriveRequest(
		'/activities',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed = PipedriveEndpointOutputSchemas.activityList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.activities.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getActivity: PipedriveEndpoints['activityGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.activityGet.parse(input);
	const { id, ...query } = parsedInput;
	const response = await makePipedriveRequest(
		`/activities/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(query) },
	);
	const parsed = PipedriveEndpointOutputSchemas.activityGet.parse(response);
	await logEventFromContext(ctx, 'pipedrive.activities.get', {}, 'completed');
	return parsed;
};

export const createActivity: PipedriveEndpoints['activityCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.activityCreate.parse(input);
	const response = await makePipedriveRequest(
		'/activities',
		ctx.key,
		authType(ctx),
		{ method: 'POST', body: parsedInput },
	);
	const parsed = PipedriveEndpointOutputSchemas.activityCreate.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.activities.create',
		{},
		'completed',
	);
	return parsed;
};

export const updateActivity: PipedriveEndpoints['activityUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.activityUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makePipedriveRequest(
		`/activities/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'PATCH', body },
	);
	const parsed = PipedriveEndpointOutputSchemas.activityUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.activities.update',
		{},
		'completed',
	);
	return parsed;
};

export const deleteActivity: PipedriveEndpoints['activityDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.activityDelete.parse(input);
	const response = await makePipedriveRequest(
		`/activities/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'DELETE' },
	);
	const parsed = PipedriveEndpointOutputSchemas.activityDelete.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.activities.delete',
		{},
		'completed',
	);
	return parsed;
};

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

function authType(ctx: Parameters<PipedriveEndpoints['personList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listPersons: PipedriveEndpoints['personList'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.personList.parse(input);
	const response = await makePipedriveRequest(
		'/persons',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed = PipedriveEndpointOutputSchemas.personList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.persons.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getPerson: PipedriveEndpoints['personGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.personGet.parse(input);
	const { id, ...query } = parsedInput;
	const response = await makePipedriveRequest(
		`/persons/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(query) },
	);
	const parsed = PipedriveEndpointOutputSchemas.personGet.parse(response);
	await logEventFromContext(ctx, 'pipedrive.persons.get', {}, 'completed');
	return parsed;
};

export const createPerson: PipedriveEndpoints['personCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.personCreate.parse(input);
	const response = await makePipedriveRequest(
		'/persons',
		ctx.key,
		authType(ctx),
		{ method: 'POST', body: parsedInput },
	);
	const parsed = PipedriveEndpointOutputSchemas.personCreate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.persons.create', {}, 'completed');
	return parsed;
};

export const updatePerson: PipedriveEndpoints['personUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.personUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makePipedriveRequest(
		`/persons/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'PATCH', body },
	);
	const parsed = PipedriveEndpointOutputSchemas.personUpdate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.persons.update', {}, 'completed');
	return parsed;
};

export const deletePerson: PipedriveEndpoints['personDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.personDelete.parse(input);
	const response = await makePipedriveRequest(
		`/persons/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'DELETE' },
	);
	const parsed = PipedriveEndpointOutputSchemas.personDelete.parse(response);
	await logEventFromContext(ctx, 'pipedrive.persons.delete', {}, 'completed');
	return parsed;
};

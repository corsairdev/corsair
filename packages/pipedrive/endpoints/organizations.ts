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

function authType(ctx: Parameters<PipedriveEndpoints['organizationList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listOrganizations: PipedriveEndpoints['organizationList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		PipedriveEndpointInputSchemas.organizationList.parse(input);
	const response = await makePipedriveRequest(
		'/organizations',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed =
		PipedriveEndpointOutputSchemas.organizationList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.organizations.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getOrganization: PipedriveEndpoints['organizationGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		PipedriveEndpointInputSchemas.organizationGet.parse(input);
	const { id, ...query } = parsedInput;
	const response = await makePipedriveRequest(
		`/organizations/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(query) },
	);
	const parsed = PipedriveEndpointOutputSchemas.organizationGet.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.organizations.get',
		{},
		'completed',
	);
	return parsed;
};

export const createOrganization: PipedriveEndpoints['organizationCreate'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.organizationCreate.parse(input);
		const response = await makePipedriveRequest(
			'/organizations',
			ctx.key,
			authType(ctx),
			{ method: 'POST', body: parsedInput },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.organizationCreate.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.organizations.create',
			{},
			'completed',
		);
		return parsed;
	};

export const updateOrganization: PipedriveEndpoints['organizationUpdate'] =
	async (ctx, input) => {
		const parsedInput =
			PipedriveEndpointInputSchemas.organizationUpdate.parse(input);
		const { id, ...body } = parsedInput;
		const response = await makePipedriveRequest(
			`/organizations/${id}`,
			ctx.key,
			authType(ctx),
			{ method: 'PATCH', body },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.organizationUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.organizations.update',
			{},
			'completed',
		);
		return parsed;
	};

export const deleteOrganization: PipedriveEndpoints['organizationDelete'] =
	async (ctx, input) => {
		const { id } =
			PipedriveEndpointInputSchemas.organizationDelete.parse(input);
		const response = await makePipedriveRequest(
			`/organizations/${id}`,
			ctx.key,
			authType(ctx),
			{ method: 'DELETE' },
		);
		const parsed =
			PipedriveEndpointOutputSchemas.organizationDelete.parse(response);
		await logEventFromContext(
			ctx,
			'pipedrive.organizations.delete',
			{},
			'completed',
		);
		return parsed;
	};

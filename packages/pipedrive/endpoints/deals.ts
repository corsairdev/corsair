import { logEventFromContext } from 'corsair/core';
import type { PipedriveEndpoints } from '..';
import { makePipedriveRequest } from '../client';
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

function authType(ctx: Parameters<PipedriveEndpoints['dealList']>[0]) {
	return ctx.options.authType === 'oauth_2' ? 'oauth_2' : 'api_key';
}

export const listDeals: PipedriveEndpoints['dealList'] = async (ctx, input) => {
	const parsedInput = PipedriveEndpointInputSchemas.dealList.parse(input);
	const response = await makePipedriveRequest(
		'/deals',
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(parsedInput) },
	);
	const parsed = PipedriveEndpointOutputSchemas.dealList.parse(response);
	await logEventFromContext(
		ctx,
		'pipedrive.deals.list',
		{ count: parsed.data?.length ?? 0 },
		'completed',
	);
	return parsed;
};

export const getDeal: PipedriveEndpoints['dealGet'] = async (ctx, input) => {
	const parsedInput = PipedriveEndpointInputSchemas.dealGet.parse(input);
	const { id, ...query } = parsedInput;
	const response = await makePipedriveRequest(
		`/deals/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'GET', query: toQuery(query) },
	);
	const parsed = PipedriveEndpointOutputSchemas.dealGet.parse(response);
	await logEventFromContext(ctx, 'pipedrive.deals.get', {}, 'completed');
	return parsed;
};

export const createDeal: PipedriveEndpoints['dealCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.dealCreate.parse(input);
	const response = await makePipedriveRequest(
		'/deals',
		ctx.key,
		authType(ctx),
		{ method: 'POST', body: parsedInput },
	);
	const parsed = PipedriveEndpointOutputSchemas.dealCreate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.deals.create', {}, 'completed');
	return parsed;
};

export const updateDeal: PipedriveEndpoints['dealUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = PipedriveEndpointInputSchemas.dealUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makePipedriveRequest(
		`/deals/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'PATCH', body },
	);
	const parsed = PipedriveEndpointOutputSchemas.dealUpdate.parse(response);
	await logEventFromContext(ctx, 'pipedrive.deals.update', {}, 'completed');
	return parsed;
};

export const deleteDeal: PipedriveEndpoints['dealDelete'] = async (
	ctx,
	input,
) => {
	const { id } = PipedriveEndpointInputSchemas.dealDelete.parse(input);
	const response = await makePipedriveRequest(
		`/deals/${id}`,
		ctx.key,
		authType(ctx),
		{ method: 'DELETE' },
	);
	const parsed = PipedriveEndpointOutputSchemas.dealDelete.parse(response);
	await logEventFromContext(ctx, 'pipedrive.deals.delete', {}, 'completed');
	return parsed;
};

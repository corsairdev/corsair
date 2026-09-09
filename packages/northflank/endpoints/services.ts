import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { makeNorthflankRequest } from '../client';
import type { NorthflankContext } from '../index';
import type {
	ServicesCreateCombinedInput,
	ServicesCreateCombinedOutput,
	ServicesGetInput,
	ServicesGetOutput,
	ServicesListInput,
	ServicesListOutput,
	ServicesUpdateCombinedInput,
	ServicesUpdateCombinedOutput,
} from './types';

export type NorthflankEndpoint<TInput, TOutput> = CorsairEndpoint<
	NorthflankContext,
	TInput,
	TOutput
>;

export const list: NorthflankEndpoint<
	ServicesListInput,
	ServicesListOutput
> = async (ctx, input) => {
	const query: Record<string, unknown> = {};
	if (input.page !== undefined) query.page = input.page;
	if (input.per_page !== undefined) query.per_page = input.per_page;
	if (input.cursor !== undefined) query.cursor = input.cursor;

	const res = await makeNorthflankRequest<ServicesListOutput>(
		`projects/${input.projectId}/services`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.services.list',
		{ projectId: input.projectId },
		'completed',
	);
	return res;
};

export const get: NorthflankEndpoint<
	ServicesGetInput,
	ServicesGetOutput
> = async (ctx, input) => {
	const res = await makeNorthflankRequest<ServicesGetOutput>(
		`projects/${input.projectId}/services/${input.serviceId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.services.get',
		{ projectId: input.projectId, serviceId: input.serviceId },
		'completed',
	);
	return res;
};

export const createCombined: NorthflankEndpoint<
	ServicesCreateCombinedInput,
	ServicesCreateCombinedOutput
> = async (ctx, input) => {
	const { projectId, ...body } = input;
	const res = await makeNorthflankRequest<ServicesCreateCombinedOutput>(
		`projects/${projectId}/services/combined`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.services.createCombined',
		{ projectId, name: input.name },
		'completed',
	);
	return res;
};

export const updateCombined: NorthflankEndpoint<
	ServicesUpdateCombinedInput,
	ServicesUpdateCombinedOutput
> = async (ctx, input) => {
	const { projectId, serviceId, ...body } = input;
	const res = await makeNorthflankRequest<ServicesUpdateCombinedOutput>(
		`projects/${projectId}/services/combined/${serviceId}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'northflank.services.updateCombined',
		{ projectId, serviceId },
		'completed',
	);
	return res;
};

export const ServicesEndpoints = {
	list,
	get,
	createCombined,
	updateCombined,
} as const;

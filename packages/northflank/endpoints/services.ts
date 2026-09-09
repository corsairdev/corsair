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
import {
	ServicesCreateCombinedInputSchema,
	ServicesCreateCombinedOutputSchema,
	ServicesGetInputSchema,
	ServicesGetOutputSchema,
	ServicesListInputSchema,
	ServicesListOutputSchema,
	ServicesUpdateCombinedInputSchema,
	ServicesUpdateCombinedOutputSchema,
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
	const validatedInput = ServicesListInputSchema.parse(input);
	const query: Record<string, unknown> = {};
	if (validatedInput.page !== undefined) query.page = validatedInput.page;
	if (validatedInput.per_page !== undefined)
		query.per_page = validatedInput.per_page;
	if (validatedInput.cursor !== undefined) query.cursor = validatedInput.cursor;

	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}/services`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'northflank.services.list',
		{ projectId: validatedInput.projectId },
		'completed',
	);
	return ServicesListOutputSchema.parse(res);
};

export const get: NorthflankEndpoint<
	ServicesGetInput,
	ServicesGetOutput
> = async (ctx, input) => {
	const validatedInput = ServicesGetInputSchema.parse(input);
	const res = await makeNorthflankRequest<unknown>(
		`projects/${validatedInput.projectId}/services/${validatedInput.serviceId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'northflank.services.get',
		{
			projectId: validatedInput.projectId,
			serviceId: validatedInput.serviceId,
		},
		'completed',
	);
	return ServicesGetOutputSchema.parse(res);
};

export const createCombined: NorthflankEndpoint<
	ServicesCreateCombinedInput,
	ServicesCreateCombinedOutput
> = async (ctx, input) => {
	const validatedInput = ServicesCreateCombinedInputSchema.parse(input);
	const { projectId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<unknown>(
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
		{ projectId, name: validatedInput.name },
		'completed',
	);
	return ServicesCreateCombinedOutputSchema.parse(res);
};

export const updateCombined: NorthflankEndpoint<
	ServicesUpdateCombinedInput,
	ServicesUpdateCombinedOutput
> = async (ctx, input) => {
	const validatedInput = ServicesUpdateCombinedInputSchema.parse(input);
	const { projectId, serviceId, ...body } = validatedInput;
	const res = await makeNorthflankRequest<unknown>(
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
	return ServicesUpdateCombinedOutputSchema.parse(res);
};

export const ServicesEndpoints = {
	list,
	get,
	createCombined,
	updateCombined,
} as const;

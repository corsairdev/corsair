import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const productsCreate: JobNimbusEndpoints['productsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.productsCreate.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/products',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.productsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.products.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const productsUpdate: JobNimbusEndpoints['productsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.productsUpdate.parse(input);
	const { jnid, ...body } = parsedInput;

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/products/${encodeURIComponent(jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.productsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.products.update',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const productsDelete: JobNimbusEndpoints['productsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.productsDelete.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/products/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'PUT',
			body: { is_active: false },
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.productsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.products.delete',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const productsGet: JobNimbusEndpoints['productsGet'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.productsGet.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		`/v2/products/${encodeURIComponent(parsedInput.jnid)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.productsGet.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.products.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const productsList: JobNimbusEndpoints['productsList'] = async (
	ctx,
	input,
) => {
	const parsedInput = JobNimbusEndpointInputSchemas.productsList.parse(input);

	const response = await makeJobNimbusRequest<unknown>(
		'/v2/products',
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				size: parsedInput.size,
				from: parsedInput.from,
				sort_field: parsedInput.sort,
				sort_direction: parsedInput.direction,
				actor: parsedInput.actor,
			}),
		},
	);

	// `unknown` because response is untrusted data; the Zod schema narrows it.
	const parsed = JobNimbusEndpointOutputSchemas.productsList.parse(response);

	await logEventFromContext(
		ctx,
		'jobnimbus.products.list',
		{ count: parsed.results?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const Products = {
	create: productsCreate,
	update: productsUpdate,
	delete: productsDelete,
	get: productsGet,
	list: productsList,
};

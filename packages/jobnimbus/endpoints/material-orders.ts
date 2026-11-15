import { logEventFromContext } from 'corsair/core';
import type { JobNimbusEndpoints } from '..';
import { compactQuery, makeJobNimbusRequest } from '../client';
import {
	JobNimbusEndpointInputSchemas,
	JobNimbusEndpointOutputSchemas,
} from './types';

export const materialOrdersCreate: JobNimbusEndpoints['materialOrdersCreate'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.materialOrdersCreate.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/v2/materialorders',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.materialOrdersCreate.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.material_orders.create',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const materialOrdersUpdate: JobNimbusEndpoints['materialOrdersUpdate'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.materialOrdersUpdate.parse(input);
		const { jnid, ...body } = parsedInput;

		const response = await makeJobNimbusRequest<unknown>(
			`/v2/materialorders/${encodeURIComponent(jnid)}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.materialOrdersUpdate.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.material_orders.update',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const materialOrdersDelete: JobNimbusEndpoints['materialOrdersDelete'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.materialOrdersDelete.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			`/v2/materialorders/${encodeURIComponent(parsedInput.jnid)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { is_active: false },
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.materialOrdersDelete.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.material_orders.delete',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const materialOrdersGet: JobNimbusEndpoints['materialOrdersGet'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.materialOrdersGet.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			`/v2/materialorders/${encodeURIComponent(parsedInput.jnid)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		// `unknown` because response is untrusted data; the Zod schema narrows it.
		const parsed =
			JobNimbusEndpointOutputSchemas.materialOrdersGet.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.material_orders.get',
			{ count: 1 },
			'completed',
		);

		return parsed;
	};

export const materialOrdersList: JobNimbusEndpoints['materialOrdersList'] =
	async (ctx, input) => {
		const parsedInput =
			JobNimbusEndpointInputSchemas.materialOrdersList.parse(input);

		const response = await makeJobNimbusRequest<unknown>(
			'/v2/materialorders',
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
		const parsed =
			JobNimbusEndpointOutputSchemas.materialOrdersList.parse(response);

		await logEventFromContext(
			ctx,
			'jobnimbus.material_orders.list',
			{ count: parsed.results?.length ?? 0 },
			'completed',
		);

		return parsed;
	};

export const MaterialOrders = {
	create: materialOrdersCreate,
	update: materialOrdersUpdate,
	delete: materialOrdersDelete,
	get: materialOrdersGet,
	list: materialOrdersList,
};

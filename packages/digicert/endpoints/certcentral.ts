import { logEventFromContext } from 'corsair/core';
import type { DigicertEndpoints } from '..';
import { makeDigicertRequest } from '../client';
import type { DigicertEndpointInputs, DigicertEndpointOutputs } from './types';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './types';

type QueryInput =
	| DigicertEndpointInputs['usersList']
	| DigicertEndpointInputs['ordersList']
	| DigicertEndpointInputs['organizationsList'];

function toQuery(
	input: QueryInput,
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(input)) {
		if (key !== 'filters' && value !== undefined) query[key] = value;
	}
	if (input.filters) {
		for (const [key, value] of Object.entries(input.filters)) {
			if (value !== undefined) query[`filters[${key}]`] = value;
		}
	}
	return query;
}

export const usersList: DigicertEndpoints['users']['list'] = async (
	ctx,
	input,
) => {
	const parsedInput = DigicertEndpointInputSchemas.usersList.parse(input);
	const response = await makeDigicertRequest<
		DigicertEndpointOutputs['usersList']
	>('certcentral', '/user', ctx.key, {
		method: 'GET',
		query: toQuery(parsedInput),
		region: ctx.options.certCentralRegion,
	});
	const parsed = DigicertEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'digicert.users.list',
		{ count: parsed.users.length },
		'completed',
	);
	return parsed;
};

export const ordersList: DigicertEndpoints['orders']['list'] = async (
	ctx,
	input,
) => {
	const parsedInput = DigicertEndpointInputSchemas.ordersList.parse(input);
	const response = await makeDigicertRequest<
		DigicertEndpointOutputs['ordersList']
	>('certcentral', '/order/certificate', ctx.key, {
		method: 'GET',
		query: toQuery(parsedInput),
		region: ctx.options.certCentralRegion,
	});
	const parsed = DigicertEndpointOutputSchemas.ordersList.parse(response);
	await logEventFromContext(
		ctx,
		'digicert.orders.list',
		{ count: parsed.orders.length },
		'completed',
	);
	return parsed;
};

export const organizationsList: DigicertEndpoints['organizations']['list'] =
	async (ctx, input) => {
		const parsedInput =
			DigicertEndpointInputSchemas.organizationsList.parse(input);
		const response = await makeDigicertRequest<
			DigicertEndpointOutputs['organizationsList']
		>('certcentral', '/organization', ctx.key, {
			method: 'GET',
			query: toQuery(parsedInput),
			region: ctx.options.certCentralRegion,
		});
		const parsed =
			DigicertEndpointOutputSchemas.organizationsList.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.organizations.list',
			{ count: parsed.organizations.length },
			'completed',
		);
		return parsed;
	};

export const intermediatesList: DigicertEndpoints['certificates']['listIntermediates'] =
	async (ctx, input) => {
		DigicertEndpointInputSchemas.intermediatesList.parse(input);
		const response = await makeDigicertRequest<
			DigicertEndpointOutputs['intermediatesList']
		>('certcentral', '/certificate/intermediates', ctx.key, {
			method: 'GET',
			region: ctx.options.certCentralRegion,
		});
		const parsed =
			DigicertEndpointOutputSchemas.intermediatesList.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.certificates.listIntermediates',
			{ count: parsed.intermediates.length },
			'completed',
		);
		return parsed;
	};

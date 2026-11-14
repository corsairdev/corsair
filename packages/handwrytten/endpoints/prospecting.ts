import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	ProspectingCalculateTargetsResponse,
	ProspectingCreateOrderResponse,
	ProspectingPreviewResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const calculateTargets: HandwryttenEndpoints['prospecting.calculateTargets'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['prospecting.calculateTargets'].parse(
				input,
			);
		const response =
			await makeHandwryttenRequest<ProspectingCalculateTargetsResponse>(
				'/outbound/calcTargets',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['prospecting.calculateTargets'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.prospecting.calculateTargets',
			{ totalRecords: parsed.total_records },
			'completed',
		);
		return parsed;
	};

export const preview: HandwryttenEndpoints['prospecting.preview'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['prospecting.preview'].parse(input);
	const response = await makeHandwryttenRequest<ProspectingPreviewResponse>(
		'/outbound/process',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['prospecting.preview'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.prospecting.preview',
		{ quantity: parsed.quantity },
		'completed',
	);
	return parsed;
};

export const createOrder: HandwryttenEndpoints['prospecting.createOrder'] =
	async (ctx, input) => {
		const parsedInput =
			HandwryttenEndpointInputSchemas['prospecting.createOrder'].parse(input);
		const response =
			await makeHandwryttenRequest<ProspectingCreateOrderResponse>(
				'/outbound/addToBasket',
				ctx.key,
				{
					method: 'POST',
					body: parsedInput,
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['prospecting.createOrder'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.prospecting.createOrder',
			{ orderId: parsed.order_id },
			'completed',
		);
		return parsed;
	};

import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import { makeFathomRequest } from '../client';
import type { FathomEndpointOutputs } from './types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './types';

export const aggregation: FathomEndpoints['reports.aggregation'] = async (
	ctx,
	input,
) => {
	const parsed = FathomEndpointInputSchemas['reports.aggregation'].parse(input);

	const response = await makeFathomRequest<
		FathomEndpointOutputs['reports.aggregation']
	>('/aggregations', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	const parsedResponse =
		FathomEndpointOutputSchemas['reports.aggregation'].parse(response);

	await logEventFromContext(
		ctx,
		'fathom.reports.aggregation',
		{
			entity: parsed.entity,
			row_count: parsedResponse.length,
		},
		'completed',
	);

	return parsedResponse;
};

export const currentVisitors: FathomEndpoints['reports.currentVisitors'] =
	async (ctx, input) => {
		const parsed =
			FathomEndpointInputSchemas['reports.currentVisitors'].parse(input);

		const response = await makeFathomRequest<
			FathomEndpointOutputs['reports.currentVisitors']
		>('/current_visitors', ctx.key, {
			method: 'GET',
			query: parsed,
		});

		const parsedResponse =
			FathomEndpointOutputSchemas['reports.currentVisitors'].parse(response);

		await logEventFromContext(
			ctx,
			'fathom.reports.currentVisitors',
			{
				site_id: parsed.site_id,
				total: parsedResponse.total,
			},
			'completed',
		);

		return parsedResponse;
	};

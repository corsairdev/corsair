import { logEventFromContext } from 'corsair/core';
import type { FundableEndpoints } from '..';
import { makeFundableRequest } from '../client';
import type { FundableEndpointOutputs } from './types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './types';

export const list: FundableEndpoints['alerts']['list'] = async (ctx, input) => {
	const parsedInput = FundableEndpointInputSchemas['alerts.list'].parse(input);

	// Docs: GET /alerts — https://docs.tryfundable.ai/api-reference/alerts/list
	const response = await makeFundableRequest<
		FundableEndpointOutputs['alerts.list']
	>('/alerts', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});

	const parsed = FundableEndpointOutputSchemas['alerts.list'].parse(response);

	await logEventFromContext(
		ctx,
		'fundable.alerts.list',
		{ count: parsed.data.alerts.length },
		'completed',
	);

	return parsed;
};

export const configurations: FundableEndpoints['alerts']['configurations'] =
	async (ctx, input) => {
		const parsedInput =
			FundableEndpointInputSchemas['alerts.configurations'].parse(input);

		// Docs: GET /alerts/configurations — https://docs.tryfundable.ai/api-reference/alerts/configurations
		const response = await makeFundableRequest<
			FundableEndpointOutputs['alerts.configurations']
		>('/alerts/configurations', ctx.key, {
			method: 'GET',
		});

		const parsed =
			FundableEndpointOutputSchemas['alerts.configurations'].parse(response);

		await logEventFromContext(
			ctx,
			'fundable.alerts.configurations',
			{ count: parsed.data.configurations.length },
			'completed',
		);

		return parsed;
	};

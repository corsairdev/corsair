import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getPayGroupByJobId: WorkdayEndpoints['getPayGroupByJobId'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getPayGroupByJobId']
		>('v1/pay/getPayGroupByJobId', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.pay.getPayGroupByJobId',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getPaySlipInstancesForWorker: WorkdayEndpoints['getPaySlipInstancesForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getPaySlipInstancesForWorker']
		>('v1/pay/getPaySlipInstancesForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.pay.getPaySlipInstancesForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getPaySlipsForWorker: WorkdayEndpoints['getPaySlipsForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getPaySlipsForWorker']
		>('v1/pay/getPaySlipsForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.pay.getPaySlipsForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getPayGroupByJobId: WorkdayEndpoints['getPayGroupByJobId'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getPayGroupByJobId']
		>('v1/pay/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
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
		>('v1/pay/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
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
		>('v1/pay/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.pay.getPaySlipsForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

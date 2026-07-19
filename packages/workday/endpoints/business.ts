import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createBusinessTitleChange: WorkdayEndpoints['createBusinessTitleChange'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createBusinessTitleChange']
		>('v1/business/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.business.createBusinessTitleChange',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getBusinessTitleChange: WorkdayEndpoints['getBusinessTitleChange'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getBusinessTitleChange']
		>('v1/business/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.business.getBusinessTitleChange',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getBusinessTitleChangeForWorker: WorkdayEndpoints['getBusinessTitleChangeForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getBusinessTitleChangeForWorker']
		>('v1/business/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.business.getBusinessTitleChangeForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

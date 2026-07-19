import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createBusinessTitleChange: WorkdayEndpoints['createBusinessTitleChange'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createBusinessTitleChange']
		>('v1/business/createBusinessTitleChange', ctx.key, {
			method: 'POST',
			// Justification: The makeWorkdayRequest client expects a generic unknown record.
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
		>('v1/business/getBusinessTitleChange', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
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
		>('v1/business/getBusinessTitleChangeForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.business.getBusinessTitleChangeForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

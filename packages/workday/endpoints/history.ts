import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getHistoryInstanceForWorker: WorkdayEndpoints['getHistoryInstanceForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getHistoryInstanceForWorker']
		>('v1/history/getHistoryInstanceForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.history.getHistoryInstanceForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getHistoryItemsForWorker: WorkdayEndpoints['getHistoryItemsForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getHistoryItemsForWorker']
		>('v1/history/getHistoryItemsForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.history.getHistoryItemsForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

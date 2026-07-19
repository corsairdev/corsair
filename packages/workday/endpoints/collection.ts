import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCollectionOfJobs: WorkdayEndpoints['getCollectionOfJobs'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCollectionOfJobs']
		>('v1/collection/getCollectionOfJobs', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.collection.getCollectionOfJobs',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getCollectionOfPayroll: WorkdayEndpoints['getCollectionOfPayroll'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCollectionOfPayroll']
		>('v1/collection/getCollectionOfPayroll', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.collection.getCollectionOfPayroll',
			input ?? {},
			'completed',
		);
		return response;
	};

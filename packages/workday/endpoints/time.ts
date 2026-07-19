import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createTimeOffRequest: WorkdayEndpoints['createTimeOffRequest'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createTimeOffRequest']
		>('v1/time/createTimeOffRequest', ctx.key, {
			method: 'POST',
			// Justification: The makeWorkdayRequest client expects a generic unknown record.
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.time.createTimeOffRequest',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getTimeOffEntriesForWorker: WorkdayEndpoints['getTimeOffEntriesForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getTimeOffEntriesForWorker']
		>('v1/time/getTimeOffEntriesForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.time.getTimeOffEntriesForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getTimeOffPlansForWorker: WorkdayEndpoints['getTimeOffPlansForWorker'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getTimeOffPlansForWorker']
		>('v1/time/getTimeOffPlansForWorker', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.time.getTimeOffPlansForWorker',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getTimeOffStatusValues: WorkdayEndpoints['getTimeOffStatusValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getTimeOffStatusValues']
		>('v1/time/getTimeOffStatusValues', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.time.getTimeOffStatusValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getTimeTypes: WorkdayEndpoints['getTimeTypes'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getTimeTypes']
	>('v1/time/getTimeTypes', ctx.key, {
		method: 'GET',
		// Justification: The makeWorkdayRequest client expects a generic unknown record.
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.time.getTimeTypes',
		input ?? {},
		'completed',
	);
	return response;
};

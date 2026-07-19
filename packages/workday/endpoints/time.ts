import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createTimeOffRequest: WorkdayEndpoints['createTimeOffRequest'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createTimeOffRequest']
		>('v1/time/api', ctx.key, {
			method: 'POST',
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
		>('v1/time/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
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
		>('v1/time/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
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
		>('v1/time/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
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
	>('v1/time/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.time.getTimeTypes',
		input ?? {},
		'completed',
	);
	return response;
};

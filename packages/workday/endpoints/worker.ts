import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getWorkerBusinessTitleChanges: WorkdayEndpoints['getWorkerBusinessTitleChanges'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerBusinessTitleChanges']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerBusinessTitleChanges',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerEligibleAbsenceTypes: WorkdayEndpoints['getWorkerEligibleAbsenceTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerEligibleAbsenceTypes']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerEligibleAbsenceTypes',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerInfo: WorkdayEndpoints['getWorkerInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getWorkerInfo']
	>('v1/worker/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.worker.getWorkerInfo',
		input ?? {},
		'completed',
	);
	return response;
};

export const getWorkerLeavesOfAbsence: WorkdayEndpoints['getWorkerLeavesOfAbsence'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerLeavesOfAbsence']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerLeavesOfAbsence',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerServiceDates: WorkdayEndpoints['getWorkerServiceDates'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerServiceDates']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerServiceDates',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerStaffingInformation: WorkdayEndpoints['getWorkerStaffingInformation'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerStaffingInformation']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerStaffingInformation',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerTimeOffDetails: WorkdayEndpoints['getWorkerTimeOffDetails'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerTimeOffDetails']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerTimeOffDetails',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getWorkerTypes: WorkdayEndpoints['getWorkerTypes'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getWorkerTypes']
	>('v1/worker/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.worker.getWorkerTypes',
		input ?? {},
		'completed',
	);
	return response;
};

export const getWorkerValidTimeOffDates: WorkdayEndpoints['getWorkerValidTimeOffDates'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkerValidTimeOffDates']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.getWorkerValidTimeOffDates',
			input ?? {},
			'completed',
		);
		return response;
	};

export const retrieveWorkerLeaveOfAbsenceSubresource: WorkdayEndpoints['retrieveWorkerLeaveOfAbsenceSubresource'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['retrieveWorkerLeaveOfAbsenceSubresource']
		>('v1/worker/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.worker.retrieveWorkerLeaveOfAbsenceSubresource',
			input ?? {},
			'completed',
		);
		return response;
	};

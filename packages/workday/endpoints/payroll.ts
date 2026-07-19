import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createPayrollInputs: WorkdayEndpoints['createPayrollInputs'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createPayrollInputs']
		>('v1/payroll/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.payroll.createPayrollInputs',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getPayrollInputInstance: WorkdayEndpoints['getPayrollInputInstance'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getPayrollInputInstance']
		>('v1/payroll/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.payroll.getPayrollInputInstance',
			input ?? {},
			'completed',
		);
		return response;
	};

import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createPayrollInputs: WorkdayEndpoints['createPayrollInputs'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['createPayrollInputs']
		>('v1/payroll/createPayrollInputs', ctx.key, {
			method: 'POST',
			// Justification: The makeWorkdayRequest client expects a generic unknown record.
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
		>('v1/payroll/getPayrollInputInstance', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.payroll.getPayrollInputInstance',
			input ?? {},
			'completed',
		);
		return response;
	};

export const updateAnExistingPayroll: WorkdayEndpoints['updateAnExistingPayroll'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['updateAnExistingPayroll']
		>('v1/payroll/updateAnExistingPayroll', ctx.key, {
			method: 'PUT',
			// Justification: The makeWorkdayRequest client expects a generic unknown record.
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.payroll.updateAnExistingPayroll',
			input ?? {},
			'completed',
		);
		return response;
	};

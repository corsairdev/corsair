import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Employee Time
// Retrieve employee time entries incl. time off (filter by userId/status/type/date).
export const getEmployeeTime: SapsuccessfactorsEndpoints['getEmployeeTime'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmployeeTime']
		>('odata/v2/EmployeeTime', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.employee.getEmployeeTime',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Employee Timesheet
// Retrieve timesheet records: attendance, overtime, on-call, allowances.
export const getEmployeeTimesheet: SapsuccessfactorsEndpoints['getEmployeeTimesheet'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmployeeTimesheet']
		>('odata/v2/EmployeeTimeSheet', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.employee.getEmployeeTimesheet',
			input ?? {},
			'completed',
		);
		return response;
	};

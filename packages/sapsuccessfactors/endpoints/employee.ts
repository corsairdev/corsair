import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Employee Time
// Retrieve employee time entries incl. time off (filter by userId/status/type/date).
export const getEmployeeTime: SapsuccessfactorsEndpoints['getEmployeeTime'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getEmployeeTime.parse(input ?? {});
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmployeeTime']
		>('odata/v2/EmployeeTime', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getEmployeeTime.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.employee.getEmployeeTime',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Employee Timesheet
// Retrieve timesheet records: attendance, overtime, on-call, allowances.
export const getEmployeeTimesheet: SapsuccessfactorsEndpoints['getEmployeeTimesheet'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getEmployeeTimesheet.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmployeeTimesheet']
		>('odata/v2/EmployeeTimeSheet', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getEmployeeTimesheet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.employee.getEmployeeTimesheet',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

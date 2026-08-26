import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// List Employee Employment Records
// Retrieve employment records (start dates, types, assignment classes).
export const listEmpEmployment: SapsuccessfactorsEndpoints['listEmpEmployment'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.listEmpEmployment.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['listEmpEmployment']
		>('odata/v2/EmpEmployment', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.listEmpEmployment.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.emp.listEmpEmployment',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Employee Employment Termination
// Retrieve termination records (date, reason).
export const getEmpEmploymentTermination: SapsuccessfactorsEndpoints['getEmpEmploymentTermination'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getEmpEmploymentTermination.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmpEmploymentTermination']
		>('odata/v2/EmpEmploymentTermination', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getEmpEmploymentTermination.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.emp.getEmpEmploymentTermination',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Recurring Pay Components
// Retrieve recurring pay components (salary, allowances, benefits).
export const getEmpPayCompRecurring: SapsuccessfactorsEndpoints['getEmpPayCompRecurring'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getEmpPayCompRecurring.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmpPayCompRecurring']
		>('odata/v2/EmpPayCompRecurring', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getEmpPayCompRecurring.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.emp.getEmpPayCompRecurring',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Get Non-Recurring Pay Components
// Retrieve non-recurring pay components (bonuses, one-time payments).
export const getEmpPayCompNonRecurring: SapsuccessfactorsEndpoints['getEmpPayCompNonRecurring'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getEmpPayCompNonRecurring.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getEmpPayCompNonRecurring']
		>('odata/v2/EmpPayCompNonRecurring', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getEmpPayCompNonRecurring.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.emp.getEmpPayCompNonRecurring',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

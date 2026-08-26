import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Goal Plan Template
// Retrieve goal plan template configuration (structure via DTD file).
export const getGoalPlanTemplate: SapsuccessfactorsEndpoints['getGoalPlanTemplate'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getGoalPlanTemplate.parse(
				input ?? {},
			);
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getGoalPlanTemplate']
		>('odata/v2/GoalPlanTemplate', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getGoalPlanTemplate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.goal.getGoalPlanTemplate',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

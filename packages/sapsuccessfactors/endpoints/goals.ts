import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Goals By Plan
// Retrieve goals for a specific plan (e.g. Goal_11), optionally by userId.
export const getGoalsByPlan: SapsuccessfactorsEndpoints['getGoalsByPlan'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getGoalsByPlan.parse(input ?? {});
		const { goal_plan_id, ...rest } = (validatedInput ?? {}) as {
			goal_plan_id?: string;
		};
		const safeId = (goal_plan_id || 'Goal').replace(/[^A-Za-z0-9_]/g, '');
		const resourcePath = goal_plan_id
			? `odata/v2/Goal_${safeId}`
			: 'odata/v2/Goal';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getGoalsByPlan']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: rest as Record<string, string | number | boolean | undefined>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getGoalsByPlan.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.goals.getGoalsByPlan',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

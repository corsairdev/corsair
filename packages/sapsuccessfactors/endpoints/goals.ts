import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Goals By Plan
// Retrieve goals for a specific plan (e.g. Goal_11), optionally by userId.
export const getGoalsByPlan: SapsuccessfactorsEndpoints['getGoalsByPlan'] =
	async (ctx, input) => {
		const { goal_plan_id, ...rest } = (input ?? {}) as {
			goal_plan_id?: string;
		};
		const resourcePath = goal_plan_id
			? `odata/v2/Goal_${goal_plan_id}`
			: 'odata/v2/Goal';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getGoalsByPlan']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: rest as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.goals.getGoalsByPlan',
			input ?? {},
			'completed',
		);
		return response;
	};

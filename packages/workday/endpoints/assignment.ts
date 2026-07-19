import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getAssignmentChangeGroupCostCenters: WorkdayEndpoints['getAssignmentChangeGroupCostCenters'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getAssignmentChangeGroupCostCenters']
		>('v1/assignment/getAssignmentChangeGroupCostCenters', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.assignment.getAssignmentChangeGroupCostCenters',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getAssignmentChangeGroupJobs: WorkdayEndpoints['getAssignmentChangeGroupJobs'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getAssignmentChangeGroupJobs']
		>('v1/assignment/getAssignmentChangeGroupJobs', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.assignment.getAssignmentChangeGroupJobs',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getAssignmentTypes: WorkdayEndpoints['getAssignmentTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getAssignmentTypes']
		>('v1/assignment/getAssignmentTypes', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.assignment.getAssignmentTypes',
			input ?? {},
			'completed',
		);
		return response;
	};

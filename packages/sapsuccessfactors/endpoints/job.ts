import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Job Application
// Retrieve job application records linking candidates to requisitions.
export const getJobApplication: SapsuccessfactorsEndpoints['getJobApplication'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getJobApplication']
		>('odata/v2/JobApplication', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.job.getJobApplication',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Job Requisition
// Retrieve job requisition records from Recruiting Management.
export const getJobRequisition: SapsuccessfactorsEndpoints['getJobRequisition'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getJobRequisition']
		>('odata/v2/JobRequisition', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.job.getJobRequisition',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get Job Requisition Screening Questions
// Retrieve screening questions for a job requisition.
export const getJobReqScreeningQuestion: SapsuccessfactorsEndpoints['getJobReqScreeningQuestion'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getJobReqScreeningQuestion']
		>('odata/v2/JobReqScreeningQuestion', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.job.getJobReqScreeningQuestion',
			input ?? {},
			'completed',
		);
		return response;
	};

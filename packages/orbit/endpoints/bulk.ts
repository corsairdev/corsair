import type { OrbitContext } from '../index';
import { callOrbit } from './call';
import { rememberOperation } from './persist';
import {
	BulkJob,
	BulkJobInput,
	BulkResults,
	BulkResultsInput,
	SubmitBulkInput,
} from './types';

async function rememberBulk(
	ctx: OrbitContext,
	response: {
		job_id: string;
		status:
			| 'queued'
			| 'running'
			| 'waiting_for_credits'
			| 'needs_attention'
			| 'completed'
			| 'completed_with_errors'
			| 'canceled';
		request_id?: string;
		updated_at?: string;
	},
) {
	await rememberOperation(ctx, 'bulkJobs', {
		jobId: response.job_id,
		status: response.status,
		requestId: response.request_id,
		updatedAt: response.updated_at,
	});
}

export const Bulk = {
	submit: async (ctx: OrbitContext, input: unknown) => {
		const response = await callOrbit(
			ctx,
			'bulk.submit',
			SubmitBulkInput,
			BulkJob,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/search/bulk',
				body: validated,
				idempotencyKey: validated.request_id,
			}),
			(validated, result) => ({
				jobId: result.job_id,
				count: String(validated.items.length),
			}),
		);
		await rememberBulk(ctx, response);
		return response;
	},
	get: async (ctx: OrbitContext, input: unknown) => {
		const response = await callOrbit(
			ctx,
			'bulk.get',
			BulkJobInput,
			BulkJob,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/search/bulk/{job_id}',
				path: { job_id: validated.job_id },
			}),
			(validated) => ({ jobId: validated.job_id }),
		);
		await rememberBulk(ctx, response);
		return response;
	},
	results: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'bulk.results',
			BulkResultsInput,
			BulkResults,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/search/bulk/{job_id}/results',
				path: { job_id: validated.job_id },
				query: { offset: validated.offset },
			}),
			(validated) => ({ jobId: validated.job_id }),
		),
	cancel: async (ctx: OrbitContext, input: unknown) => {
		const response = await callOrbit(
			ctx,
			'bulk.cancel',
			BulkJobInput,
			BulkJob,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/search/bulk/{job_id}/cancel',
				path: { job_id: validated.job_id },
			}),
			(validated) => ({ jobId: validated.job_id }),
		);
		await rememberBulk(ctx, response);
		return response;
	},
};

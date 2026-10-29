import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { parseCsvRecords } from '../utils';
import { salesforceCall } from './shared';

export const closeOrAbortJob: SalesforceEndpoints['closeOrAbortJob'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{ id: string; state: string }>(
		ctx,
		`jobs/ingest/${input.jobId}`,
		{
			method: 'PATCH',
			body: { state: input.state },
		},
	);

	await logEventFromContext(
		ctx,
		'salesforce.job.close_or_abort',
		input,
		'completed',
	);
	return response;
};

export const deleteJobQuery: SalesforceEndpoints['deleteJobQuery'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `jobs/query/${input.jobId}`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'salesforce.job.delete_query',
		input,
		'completed',
	);
	return { success: true };
};

export const getJobFailedRecordResults: SalesforceEndpoints['getJobFailedRecordResults'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			`jobs/ingest/${input.jobId}/failedResults`,
			{ method: 'GET', responseType: 'text' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.job.failed_results',
			input,
			'completed',
		);
		return { records: parseCsvRecords(response) };
	};

export const getQueryJobInfo: SalesforceEndpoints['getQueryJobInfo'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{ id: string; state: string }>(
		ctx,
		`jobs/query/${input.jobId}`,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.job.query_info',
		input,
		'completed',
	);
	return response;
};

export const getQueryJobResults: SalesforceEndpoints['getQueryJobResults'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			`jobs/query/${input.jobId}/results`,
			{
				method: 'GET',
				query: {
					maxRecords: input.maxRecords,
					locator: input.locator,
				},
				responseType: 'text',
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.job.query_results',
			input,
			'completed',
		);
		return {
			data:
				typeof response === 'string'
					? response
					: JSON.stringify(response ?? ''),
		};
	};

export const getJobSuccessfulRecordResults: SalesforceEndpoints['getJobSuccessfulRecordResults'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			`jobs/ingest/${input.jobId}/successfulResults`,
			{ method: 'GET', responseType: 'text' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.job.successful_results',
			input,
			'completed',
		);
		return { records: parseCsvRecords(response) };
	};

export const getJobUnprocessedRecordResults: SalesforceEndpoints['getJobUnprocessedRecordResults'] =
	async (ctx, input) => {
		const response = await salesforceCall<unknown>(
			ctx,
			`jobs/ingest/${input.jobId}/unprocessedrecords`,
			{ method: 'GET', responseType: 'text' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.job.unprocessed_results',
			input,
			'completed',
		);
		return { records: parseCsvRecords(response) };
	};

export const uploadJobData: SalesforceEndpoints['uploadJobData'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `jobs/ingest/${input.jobId}/batches`, {
		method: 'PUT',
		body: input.csv,
		mediaType: 'text/csv',
	});
	await logEventFromContext(
		ctx,
		'salesforce.job.upload_data',
		{ jobId: input.jobId },
		'completed',
	);
	return { success: true };
};

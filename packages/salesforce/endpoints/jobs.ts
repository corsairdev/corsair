import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { parseCsvRecords } from '../utils';

export const closeOrAbortJob: SalesforceEndpoints['closeOrAbortJob'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{ id: string; state: string }>(
		`jobs/ingest/${input.jobId}`,
		ctx.key,
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
	await makeSalesforceRequest<void>(`jobs/query/${input.jobId}`, ctx.key, {
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
		const response = await makeSalesforceRequest<unknown>(
			`jobs/ingest/${input.jobId}/failedResults`,
			ctx.key,
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
	const response = await makeSalesforceRequest<{ id: string; state: string }>(
		`jobs/query/${input.jobId}`,
		ctx.key,
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
		const response = await makeSalesforceRequest<unknown>(
			`jobs/query/${input.jobId}/results`,
			ctx.key,
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
		const response = await makeSalesforceRequest<unknown>(
			`jobs/ingest/${input.jobId}/successfulResults`,
			ctx.key,
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
		const response = await makeSalesforceRequest<unknown>(
			`jobs/ingest/${input.jobId}/unprocessedrecords`,
			ctx.key,
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

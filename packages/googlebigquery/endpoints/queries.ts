import { logEventFromContext } from 'corsair/core';
import {
	makeAuthenticatedGoogleBigqueryRequest,
	makeAuthenticatedGoogleBigqueryUploadRequest,
} from '../client';
import type { GoogleBigqueryEndpoints } from '../index';
import type { GoogleBigqueryEndpointOutputs } from './types';

export const query: GoogleBigqueryEndpoints['queriesQuery'] = async (
	ctx,
	input,
) => {
	const { projectId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesQuery']
	>(`/projects/${projectId}/queries`, ctx, {
		method: 'POST',
		body,
	});

	// Never log SQL body / queryParameters — may contain PII or secrets
	await logEventFromContext(
		ctx,
		'googlebigquery.queries.query',
		{
			projectId,
			dryRun: body.dryRun,
			useLegacySql: body.useLegacySql,
			timeoutMs: body.timeoutMs,
			maxResults: body.maxResults,
			location: body.location,
			jobId: result.jobReference?.jobId,
		},
		'completed',
	);
	return result;
};

export const getQueryResults: GoogleBigqueryEndpoints['queriesGetQueryResults'] =
	async (ctx, input) => {
		const { projectId, jobId, ...query } = input;
		const result = await makeAuthenticatedGoogleBigqueryRequest<
			GoogleBigqueryEndpointOutputs['queriesGetQueryResults']
		>(`/projects/${projectId}/queries/${jobId}`, ctx, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'googlebigquery.queries.getQueryResults',
			{ ...input },
			'completed',
		);
		return result;
	};

export const insertJob: GoogleBigqueryEndpoints['queriesInsertJob'] = async (
	ctx,
	input,
) => {
	const { projectId, jobReference, configuration } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesInsertJob']
	>(`/projects/${projectId}/jobs`, ctx, {
		method: 'POST',
		body: { jobReference, configuration },
	});

	if (result.id && ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save job to database:', error);
		}
	}

	// Never log configuration (may embed SQL / params); identifiers only
	await logEventFromContext(
		ctx,
		'googlebigquery.queries.insertJob',
		{
			projectId,
			jobId: jobReference?.jobId ?? result.jobReference?.jobId ?? result.id,
			location: jobReference?.location,
			hasConfiguration: Boolean(configuration),
		},
		'completed',
	);
	return result;
};

function buildMultipartRelatedBody(
	metadata: Record<string, unknown>,
	fileContent: string,
	contentType: string,
	boundary: string,
): string {
	return (
		`--${boundary}\r\n` +
		'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
		`${JSON.stringify(metadata)}\r\n` +
		`--${boundary}\r\n` +
		`Content-Type: ${contentType}\r\n\r\n` +
		`${fileContent}\r\n` +
		`--${boundary}--`
	);
}

export const insertJobWithUpload: GoogleBigqueryEndpoints['queriesInsertJobWithUpload'] =
	async (ctx, input) => {
		const { projectId, jobReference, configuration, fileContent, contentType } =
			input;
		const boundary = `corsair-googlebigquery-${Date.now()}`;
		const rawBody = buildMultipartRelatedBody(
			{ jobReference, configuration },
			fileContent,
			contentType ?? 'application/octet-stream',
			boundary,
		);

		const result = await makeAuthenticatedGoogleBigqueryUploadRequest<
			GoogleBigqueryEndpointOutputs['queriesInsertJobWithUpload']
		>(`/upload/bigquery/v2/projects/${projectId}/jobs`, ctx, {
			method: 'POST',
			query: { uploadType: 'multipart' },
			rawBody,
			boundary,
		});

		if (result.id && ctx.db.jobs) {
			try {
				await ctx.db.jobs.upsertByEntityId(result.id, {
					...result,
					id: result.id,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save job to database:', error);
			}
		}

		// Never log configuration (may embed SQL / params); identifiers only
		await logEventFromContext(
			ctx,
			'googlebigquery.queries.insertJobWithUpload',
			{
				projectId,
				jobId: jobReference?.jobId ?? result.jobReference?.jobId ?? result.id,
				location: jobReference?.location,
				hasConfiguration: Boolean(configuration),
				fileName: input.fileName,
			},
			'completed',
		);
		return result;
	};

export const insertAll: GoogleBigqueryEndpoints['queriesInsertAll'] = async (
	ctx,
	input,
) => {
	const { projectId, datasetId, tableId, ...body } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesInsertAll']
	>(
		`/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`,
		ctx,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'googlebigquery.queries.insertAll',
		{
			projectId: input.projectId,
			datasetId: input.datasetId,
			tableId: input.tableId,
			rowsCount: input.rows?.length,
		},
		'completed',
	);
	return result;
};

export const listJobs: GoogleBigqueryEndpoints['queriesListJobs'] = async (
	ctx,
	input,
) => {
	const { projectId, ...query } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesListJobs']
	>(`/projects/${projectId}/jobs`, ctx, { method: 'GET', query });

	if (result.jobs && ctx.db.jobs) {
		try {
			for (const job of result.jobs) {
				if (job.id) {
					await ctx.db.jobs.upsertByEntityId(job.id, {
						...job,
						id: job.id,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save jobs to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.queries.listJobs',
		{ ...input },
		'completed',
	);
	return result;
};

export const getJob: GoogleBigqueryEndpoints['queriesGetJob'] = async (
	ctx,
	input,
) => {
	const { projectId, jobId, location } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesGetJob']
	>(`/projects/${projectId}/jobs/${jobId}`, ctx, {
		method: 'GET',
		query: { location },
	});

	if (result.id && ctx.db.jobs) {
		try {
			await ctx.db.jobs.upsertByEntityId(result.id, {
				...result,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save job to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googlebigquery.queries.getJob',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancelJob: GoogleBigqueryEndpoints['queriesCancelJob'] = async (
	ctx,
	input,
) => {
	const { projectId, jobId, location } = input;
	const result = await makeAuthenticatedGoogleBigqueryRequest<
		GoogleBigqueryEndpointOutputs['queriesCancelJob']
	>(`/projects/${projectId}/jobs/${jobId}/cancel`, ctx, {
		method: 'POST',
		query: { location },
	});

	await logEventFromContext(
		ctx,
		'googlebigquery.queries.cancelJob',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteJobMetadata: GoogleBigqueryEndpoints['queriesDeleteJobMetadata'] =
	async (ctx, input) => {
		const { projectId, jobId, location } = input;
		await makeAuthenticatedGoogleBigqueryRequest<void>(
			`/projects/${projectId}/jobs/${jobId}/delete`,
			ctx,
			{ method: 'DELETE', query: { location } },
		);

		if (ctx.db.jobs) {
			try {
				// Matches BigQuery job resource id used on upsert: "projectId:jobId"
				await ctx.db.jobs.deleteByEntityId(`${projectId}:${jobId}`);
			} catch (error) {
				console.warn('Failed to delete job from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'googlebigquery.queries.deleteJobMetadata',
			{ ...input },
			'completed',
		);
	};

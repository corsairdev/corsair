import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const listConnections: GriptapeEndpoints['connectionList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['connectionList']
	>('connections', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.connection.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const listExportJobs: GriptapeEndpoints['exportJobList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['exportJobList']
	>('export-jobs', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.exportJob.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createExportJob: GriptapeEndpoints['exportJobCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['exportJobCreate']
	>('export-jobs', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.exportJob.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getExportJob: GriptapeEndpoints['exportJobGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['exportJobGet']
	>(`export-jobs/${input.export_job_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.exportJob.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const listImportJobs: GriptapeEndpoints['importJobList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['importJobList']
	>('import-jobs', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.importJob.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createImportJob: GriptapeEndpoints['importJobCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['importJobCreate']
	>('import-jobs', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.importJob.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getImportJob: GriptapeEndpoints['importJobGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['importJobGet']
	>(`import-jobs/${input.import_job_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.importJob.get',
		{ ...input },
		'completed',
	);

	return response;
};

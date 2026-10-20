import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packLogsList'] = async (ctx, input) => {
	const { packId, docId, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packLogsList']>(
		`packs/${encodeURIComponent(packId)}/docs/${encodeURIComponent(docId)}/logs`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.packLogs.list',
		{ ...input },
		'completed',
	);
	return response;
};

const listGrouped: CodaEndpoints['packLogsListGrouped'] = async (
	ctx,
	input,
) => {
	const { packId, docId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packLogsListGrouped']
	>(
		`packs/${encodeURIComponent(packId)}/docs/${encodeURIComponent(docId)}/groupedLogs`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.packLogs.listGrouped',
		{ ...input },
		'completed',
	);
	return response;
};

const listIngestion: CodaEndpoints['packLogsListIngestion'] = async (
	ctx,
	input,
) => {
	const { packId, tenantId, rootIngestionId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packLogsListIngestion']
	>(
		`packs/${encodeURIComponent(packId)}/tenantId/${encodeURIComponent(tenantId)}/rootIngestionId/${encodeURIComponent(rootIngestionId)}/logs`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.packLogs.listIngestion',
		{ ...input },
		'completed',
	);
	return response;
};

const listGroupedIngestion: CodaEndpoints['packLogsListGroupedIngestion'] =
	async (ctx, input) => {
		const { packId, tenantId, rootIngestionId, ...query } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packLogsListGroupedIngestion']
		>(
			`packs/${encodeURIComponent(packId)}/tenantId/${encodeURIComponent(tenantId)}/rootIngestionId/${encodeURIComponent(rootIngestionId)}/groupedLogs`,
			ctx.key,
			{ method: 'GET', query },
		);
		await logEventFromContext(
			ctx,
			'coda.packLogs.listGroupedIngestion',
			{ ...input },
			'completed',
		);
		return response;
	};

const listIngestionExecutions: CodaEndpoints['packLogsListIngestionExecutions'] =
	async (ctx, input) => {
		const { packId, tenantId, rootIngestionId, ...query } = input;
		const response = await makeCodaRequest<
			CodaEndpointOutputs['packLogsListIngestionExecutions']
		>(
			`packs/${encodeURIComponent(packId)}/tenantId/${encodeURIComponent(tenantId)}/rootIngestionId/${encodeURIComponent(rootIngestionId)}/ingestionBatchExecutions`,
			ctx.key,
			{ method: 'GET', query },
		);
		await logEventFromContext(
			ctx,
			'coda.packLogs.listIngestionExecutions',
			{ ...input },
			'completed',
		);
		return response;
	};

const getDetails: CodaEndpoints['packLogsGetDetails'] = async (ctx, input) => {
	const { packId, tenantId, rootIngestionId, logId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packLogsGetDetails']
	>(
		`packs/${encodeURIComponent(packId)}/tenantId/${encodeURIComponent(tenantId)}/rootIngestionId/${encodeURIComponent(rootIngestionId)}/logs/${encodeURIComponent(logId)}`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.packLogs.getDetails',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackLogs = {
	list,
	listGrouped,
	listIngestion,
	listGroupedIngestion,
	listIngestionExecutions,
	getDetails,
};

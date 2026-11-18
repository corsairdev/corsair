import type { DataboxEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	envelopeData,
	nextPageOf,
	readPagination,
	shapeList,
} from './envelope';
import {
	DataboxEndpointInputSchemas as Inputs,
	DataboxEndpointOutputSchemas as Outputs,
} from './types';

export const list: DataboxEndpoints['datasetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.list',
			input: Inputs.listDatasets,
			output: Outputs.listDatasets,
		},
		input,
		({
			dataSourceId,
			type,
			search,
			sortBy,
			sortOrder,
			page,
			pageSize,
			accountId,
		}) => ({
			method: 'GET',
			path: '/v2/datasets',
			query: { dataSourceId, type, search, sortBy, sortOrder, page, pageSize },
			accountId,
			replaySafe: true,
		}),
		{
			shape: shapeList('datasets'),
			log: (_, result) => ({
				count: result.datasets.length,
				page: result.page,
			}),
		},
	);

export const create: DataboxEndpoints['datasetsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.create',
			input: Inputs.createDataset,
			output: Outputs.createDataset,
		},
		input,
		({
			name,
			dataSourceId,
			primaryKey,
			schema,
			accountId,
			idempotencyKey,
		}) => ({
			method: 'POST',
			path: '/v2/datasets',
			body: {
				name,
				dataSourceId,
				...(primaryKey !== undefined ? { primaryKey } : {}),
				schema,
			},
			accountId,
			idempotencyKey,
		}),
		{
			shape: (raw) => ({ dataset: envelopeData(raw) }),
			log: (_, result) => ({
				datasetId: result.dataset.id,
				dataSourceId: result.dataset.dataSourceId ?? undefined,
			}),
		},
	);

export const get: DataboxEndpoints['datasetsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.get',
			input: Inputs.getDataset,
			output: Outputs.getDataset,
		},
		input,
		({ id, accountId }) => ({
			method: 'GET',
			path: `/v2/datasets/${segment(id)}`,
			accountId,
			replaySafe: true,
		}),
		{
			shape: (raw) => ({ dataset: envelopeData(raw) }),
			log: ({ id }) => ({ datasetId: id }),
		},
	);

export const listData: DataboxEndpoints['datasetsListData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasets.listData',
			input: Inputs.listDatasetData,
			output: Outputs.listDatasetData,
		},
		input,
		({ id, sortBy, sortOrder, page, pageSize, accountId }) => ({
			method: 'GET',
			path: `/v2/datasets/${segment(id)}/data`,
			query: { sortBy, sortOrder, page, pageSize },
			accountId,
			replaySafe: true,
		}),
		{
			// Unlike the other lists, records sit beside schema and
			// lastUpdatedAt inside data, and the item key is records, not items.
			// items passes through unchecked so a body without it fails the
			// output parse instead of reading as an empty page.
			shape: (raw) => {
				const data = envelopeData(raw);
				const { page, pageSize, totalItems } = readPagination(data);
				return {
					records: data?.items,
					schema: data?.schema,
					page,
					pageSize,
					totalItems,
					nextPage: nextPageOf(page, pageSize, totalItems),
					lastUpdatedAt: data?.lastUpdatedAt,
				};
			},
			log: ({ id }, result) => ({
				datasetId: id,
				count: result.records.length,
				page: result.page,
			}),
		},
	);

export const ingestData: DataboxEndpoints['datasetsIngestData'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasets.ingestData',
			input: Inputs.ingestDatasetData,
			output: Outputs.ingestDatasetData,
		},
		input,
		({ id, records, accountId, idempotencyKey }) => ({
			method: 'POST',
			path: `/v2/datasets/${segment(id)}/data`,
			body: { records },
			accountId,
			idempotencyKey,
		}),
		{
			shape: (raw) => envelopeData(raw),
			log: ({ id, records }, result) => ({
				datasetId: id,
				recordCount: records.length,
				ingestionId: result.ingestionId,
			}),
		},
	);

export const getIngestion: DataboxEndpoints['datasetsGetIngestion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasets.getIngestion',
			input: Inputs.getIngestion,
			output: Outputs.getIngestion,
		},
		input,
		({ id, ingestionId, accountId }) => ({
			method: 'GET',
			path: `/v2/datasets/${segment(id)}/ingestions/${segment(ingestionId)}`,
			accountId,
			replaySafe: true,
		}),
		{
			shape: (raw) => ({ ingestion: envelopeData(raw) }),
			log: ({ id, ingestionId }, result) => ({
				datasetId: id,
				ingestionId,
				status: result.ingestion.status ?? undefined,
			}),
		},
	);

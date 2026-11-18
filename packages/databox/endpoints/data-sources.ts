import type { DataboxEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { envelopeData, shapeList } from './envelope';
import {
	DataboxEndpointInputSchemas as Inputs,
	DataboxEndpointOutputSchemas as Outputs,
} from './types';

export const list: DataboxEndpoints['dataSourcesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dataSources.list',
			input: Inputs.listDataSources,
			output: Outputs.listDataSources,
		},
		input,
		({
			search,
			connectionId,
			sortBy,
			sortOrder,
			page,
			pageSize,
			accountId,
		}) => ({
			method: 'GET',
			path: '/v2/data-sources',
			query: { search, connectionId, sortBy, sortOrder, page, pageSize },
			accountId,
			replaySafe: true,
		}),
		{
			shape: shapeList('dataSources'),
			log: (_, result) => ({
				count: result.dataSources.length,
				page: result.page,
			}),
		},
	);

export const create: DataboxEndpoints['dataSourcesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dataSources.create',
			input: Inputs.createDataSource,
			output: Outputs.createDataSource,
		},
		input,
		({ name, timezone, accountId, idempotencyKey }) => ({
			method: 'POST',
			path: '/v2/data-sources',
			body: { name, ...(timezone !== undefined ? { timezone } : {}) },
			accountId,
			idempotencyKey,
		}),
		{
			shape: (raw) => ({ dataSource: envelopeData(raw) }),
			log: (_, result) => ({ dataSourceId: result.dataSource.id }),
		},
	);

export const get: DataboxEndpoints['dataSourcesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dataSources.get',
			input: Inputs.getDataSource,
			output: Outputs.getDataSource,
		},
		input,
		({ id, accountId }) => ({
			method: 'GET',
			path: `/v2/data-sources/${segment(id)}`,
			accountId,
			replaySafe: true,
		}),
		{
			shape: (raw) => ({ dataSource: envelopeData(raw) }),
			log: ({ id }) => ({ dataSourceId: id }),
		},
	);

export const remove: DataboxEndpoints['dataSourcesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dataSources.delete',
			input: Inputs.deleteDataSource,
			output: Outputs.deleteDataSource,
		},
		input,
		({ id, accountId }) => ({
			method: 'DELETE',
			path: `/v2/data-sources/${segment(id)}`,
			accountId,
		}),
		{
			shape: (raw) => ({ message: envelopeData(raw)?.message }),
			log: ({ id }) => ({ dataSourceId: id }),
		},
	);

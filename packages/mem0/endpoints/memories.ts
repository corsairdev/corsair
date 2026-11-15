import { asRecord } from 'corsair/core';
import type { Mem0Endpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	Mem0EndpointInputSchemas as Inputs,
	Mem0EndpointOutputSchemas as Outputs,
} from './types';

export const add: Mem0Endpoints['memoriesAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.add',
			input: Inputs.memoriesAdd,
			output: Outputs.memoriesAdd,
		},
		input,
		({
			messages,
			user_id,
			agent_id,
			app_id,
			run_id,
			metadata,
			infer,
			expiration_date,
			immutable,
			includes,
			excludes,
			enable_graph,
			timestamp,
		}) => ({
			method: 'POST',
			path: '/v3/memories/add/',
			body: {
				messages,
				user_id,
				agent_id,
				app_id,
				run_id,
				metadata,
				infer,
				expiration_date,
				immutable,
				includes,
				excludes,
				enable_graph,
				timestamp,
			},
		}),
		{
			log: (_, result) => ({
				eventId: result.event_id ?? undefined,
				status: result.status ?? undefined,
				added: result.results?.length,
			}),
		},
	);

export const search: Mem0Endpoints['memoriesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.search',
			input: Inputs.memoriesSearch,
			output: Outputs.memoriesSearch,
		},
		input,
		({
			query,
			filters,
			top_k,
			threshold,
			rerank,
			show_expired,
			reference_date,
			fields,
			categories,
		}) => ({
			method: 'POST',
			path: '/v3/memories/search/',
			body: {
				query,
				filters,
				top_k,
				threshold,
				rerank,
				show_expired,
				reference_date,
				fields,
				categories,
			},
		}),
		{
			log: (_, result) => ({ results: result.results.length }),
		},
	);

export const list: Mem0Endpoints['memoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.list',
			input: Inputs.memoriesList,
			output: Outputs.memoriesList,
		},
		input,
		({
			filters,
			page,
			page_size,
			show_expired,
			start_date,
			end_date,
			categories,
			fields,
			keywords,
		}) => ({
			method: 'POST',
			path: '/v3/memories/',
			query: { page, page_size },
			body: {
				filters,
				show_expired,
				start_date,
				end_date,
				categories,
				fields,
				keywords,
			},
		}),
		{
			log: (_, result) => ({
				count: result.count,
				page: result.results.length,
			}),
		},
	);

export const get: Mem0Endpoints['memoriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.get',
			input: Inputs.memoriesGet,
			output: Outputs.memoriesGet,
		},
		input,
		({ memory_id }) => ({
			method: 'GET',
			path: `/v1/memories/${segment(memory_id)}/`,
		}),
		{
			log: ({ memory_id }) => ({ memoryId: memory_id }),
		},
	);

export const update: Mem0Endpoints['memoriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.update',
			input: Inputs.memoriesUpdate,
			output: Outputs.memoriesUpdate,
		},
		input,
		({ memory_id, text, metadata, expiration_date }) => ({
			method: 'PUT',
			path: `/v1/memories/${segment(memory_id)}/`,
			// expiration_date: null clears the date, so an explicit null has to
			// reach the wire; the schema already rejects a call with no field.
			body:
				expiration_date === undefined
					? { text, metadata }
					: { text, metadata, expiration_date },
		}),
		{
			log: ({ memory_id }) => ({ memoryId: memory_id }),
		},
	);

export const remove: Mem0Endpoints['memoriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.delete',
			input: Inputs.memoriesDelete,
			output: Outputs.memoriesDelete,
		},
		input,
		({ memory_id, delete_linked }) => ({
			method: 'DELETE',
			path: `/v1/memories/${segment(memory_id)}/`,
			query: { delete_linked },
		}),
		{
			// The memory is gone by now, so a missing body is not a failure.
			shape: (raw, { memory_id }) => ({
				success: true,
				memory_id,
				...asRecord(raw),
			}),
			log: ({ memory_id, delete_linked }, result) => ({
				memoryId: memory_id,
				cascadeCount: result.cascade_count ?? undefined,
				deleteLinked: delete_linked ?? false,
			}),
		},
	);

export const deleteAll: Mem0Endpoints['memoriesDeleteAll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.deleteAll',
			input: Inputs.memoriesDeleteAll,
			output: Outputs.memoriesDeleteAll,
		},
		input,
		({ user_id, agent_id, app_id, run_id, org_id, project_id, metadata }) => ({
			method: 'DELETE',
			path: '/v1/memories/',
			// metadata is a deepObject query parameter, so each key becomes
			// metadata[<key>]=<value>.
			query: {
				user_id,
				agent_id,
				app_id,
				run_id,
				org_id,
				project_id,
				metadata,
			},
		}),
		{
			shape: (raw) => ({ success: true, ...asRecord(raw) }),
			log: (_, result) => ({
				eventId: result.event_id ?? undefined,
				message: result.message ?? undefined,
			}),
		},
	);

export const history: Mem0Endpoints['memoriesHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.history',
			input: Inputs.memoriesHistory,
			output: Outputs.memoriesHistory,
		},
		input,
		({ memory_id }) => ({
			method: 'GET',
			path: `/v1/memories/${segment(memory_id)}/history/`,
		}),
		{
			// Mem0 answers with a bare array, so it is wrapped for the schema. A
			// body that is not an array is left for the schema to reject rather
			// than being reported as an empty history.
			shape: (raw) => ({ history: raw }),
			log: (_, result) => ({ entries: result.history.length }),
		},
	);

export const batchUpdate: Mem0Endpoints['memoriesBatchUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.batchUpdate',
			input: Inputs.memoriesBatchUpdate,
			output: Outputs.memoriesBatchUpdate,
		},
		input,
		({ memories }) => ({
			method: 'PUT',
			path: '/v1/batch/',
			body: { memories },
		}),
		{
			shape: (raw, { memories }) => ({
				success: true,
				count: memories.length,
				...asRecord(raw),
			}),
			log: (_, result) => ({ count: result.count }),
		},
	);

export const batchDelete: Mem0Endpoints['memoriesBatchDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memories.batchDelete',
			input: Inputs.memoriesBatchDelete,
			output: Outputs.memoriesBatchDelete,
		},
		input,
		({ memory_ids }) => ({
			method: 'DELETE',
			path: '/v1/batch/',
			body: { memories: memory_ids.map((memory_id) => ({ memory_id })) },
		}),
		{
			shape: (raw, { memory_ids }) => ({
				success: true,
				count: memory_ids.length,
				...asRecord(raw),
			}),
			log: (_, result) => ({ count: result.count }),
		},
	);

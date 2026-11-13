import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { ParallelContext } from '..';
import { parallelRequest } from '../client';
import {
	ChatInput,
	ChatOutput,
	DecisionInput,
	DecisionOutput,
	EmptyInput,
	ExtractInput,
	ExtractOutput,
	FindAllCreateInput,
	FindAllEnrichInput,
	FindAllEntityInput,
	FindAllEntityOutput,
	FindAllExtendInput,
	FindAllIdInput,
	FindAllIngestInput,
	FindAllResultOutput,
	FindAllRunOutput,
	FindAllSchemaOutput,
	ImageSearchInput,
	ImageSearchOutput,
	MemoryClearInput,
	MemoryEvictInput,
	MemoryRetrieveInput,
	MemoryRetrieveOutput,
	MonitorCreateInput,
	MonitorEventsInput,
	MonitorEventsOutput,
	MonitorIdInput,
	MonitorListInput,
	MonitorListOutput,
	MonitorOutput,
	MonitorStatsOutput,
	MonitorUpdateInput,
	NoContent,
	PlaceSearchInput,
	PlaceSearchOutput,
	ResponseInput,
	ResponseOutput,
	SearchInput,
	SearchOutput,
	safeId,
	TaskGroupCreateInput,
	TaskGroupIdInput,
	TaskGroupOutput,
	TaskGroupRunIdInput,
	TaskGroupRunsInput,
	TaskGroupRunsOutput,
	TaskResultInput,
	TaskResultOutput,
	TaskRunCreateInput,
	TaskRunIdInput,
	TaskRunInput,
	TaskRunOutput,
} from './types';

function operation<I extends z.ZodType<object>, O extends z.ZodType>(
	input: I,
	output: O,
	path: string,
): CorsairEndpoint<ParallelContext, z.input<I>, z.output<O>> {
	return async (ctx, raw) =>
		output.parse(await parallelRequest(ctx.key, path, input.parse(raw)));
}

function monitorPath(id: string): string {
	return `/v1/monitors/${encodeURIComponent(safeId.parse(id))}`;
}
function queryString(
	params: Record<
		string,
		string | number | boolean | readonly string[] | null | undefined
	>,
): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value))
			for (const item of value) search.append(key, String(item));
		else search.append(key, String(value));
	}
	const result = search.toString();
	return result ? `?${result}` : '';
}
function getOperation<I extends z.ZodType<object>, O extends z.ZodType>(
	input: I,
	output: O,
	route: (args: z.output<I>) => string,
): CorsairEndpoint<ParallelContext, z.input<I>, z.output<O>> {
	return async (ctx, raw) =>
		output.parse(
			await parallelRequest(ctx.key, route(input.parse(raw)), undefined, 'GET'),
		);
}
function actionOperation<I extends z.ZodType<object>, O extends z.ZodType>(
	input: I,
	output: O,
	route: (args: z.output<I>) => string,
	body?: (args: z.output<I>) => object,
): CorsairEndpoint<ParallelContext, z.input<I>, z.output<O>> {
	return async (ctx, raw) => {
		const parsed = input.parse(raw);
		return output.parse(
			await parallelRequest(ctx.key, route(parsed), body?.(parsed)),
		);
	};
}

function taskPath(id: string): string {
	return `/v1/tasks/runs/${encodeURIComponent(safeId.parse(id))}`;
}
function taskGroupPath(id: string): string {
	return `/v1/tasks/groups/${encodeURIComponent(safeId.parse(id))}`;
}
function betaHeaders(beta?: string): Record<string, string> {
	return beta === undefined ? {} : { 'parallel-beta': beta };
}
function findallPath(id: string): string {
	return `/v1beta/findall/runs/${encodeURIComponent(safeId.parse(id))}`;
}
export const endpoints = {
	chat: {
		create: operation(ChatInput, ChatOutput, '/v1beta/chat/completions'),
	},
	responses: {
		create: operation(ResponseInput, ResponseOutput, '/v1/responses'),
	},
	findall: {
		entitySearch: operation(
			FindAllEntityInput,
			FindAllEntityOutput,
			'/v1beta/findall/entity-search',
		),
		ingest: operation(
			FindAllIngestInput,
			FindAllSchemaOutput,
			'/v1beta/findall/ingest',
		),
		createRun: operation(
			FindAllCreateInput,
			FindAllRunOutput,
			'/v1beta/findall/runs',
		),
		getRun: getOperation(FindAllIdInput, FindAllRunOutput, (v) =>
			findallPath(v.findall_id),
		),
		cancel: actionOperation(
			FindAllIdInput,
			NoContent,
			(v) => findallPath(v.findall_id) + '/cancel',
		),
		enrich: actionOperation(
			FindAllEnrichInput,
			FindAllSchemaOutput,
			(v) => findallPath(v.findall_id) + '/enrich',
			(v) => v.body,
		),
		extend: actionOperation(
			FindAllExtendInput,
			FindAllSchemaOutput,
			(v) => findallPath(v.findall_id) + '/extend',
			(v) => v.body,
		),
		result: getOperation(
			FindAllIdInput,
			FindAllResultOutput,
			(v) => findallPath(v.findall_id) + '/result',
		),
		schema: getOperation(
			FindAllIdInput,
			FindAllSchemaOutput,
			(v) => findallPath(v.findall_id) + '/schema',
		),
	},
	tasks: {
		createGroup: operation(
			TaskGroupCreateInput,
			TaskGroupOutput,
			'/v1/tasks/groups',
		),
		getGroup: getOperation(TaskGroupIdInput, TaskGroupOutput, (v) =>
			taskGroupPath(v.taskgroup_id),
		),
		addGroupRuns: async (
			ctx: ParallelContext,
			raw: z.input<typeof TaskGroupRunsInput>,
		) => {
			const v = TaskGroupRunsInput.parse(raw);
			return TaskGroupRunsOutput.parse(
				await parallelRequest(
					ctx.key,
					taskGroupPath(v.taskgroup_id) +
						'/runs' +
						queryString({ refresh_status: v.refresh_status }),
					v.body,
					'POST',
					betaHeaders(v.parallel_beta),
				),
			);
		},
		getGroupRun: getOperation(
			TaskGroupRunIdInput,
			TaskRunOutput,
			(v) =>
				taskGroupPath(v.taskgroup_id) + '/runs/' + encodeURIComponent(v.run_id),
		),
		createRun: async (
			ctx: ParallelContext,
			raw: z.input<typeof TaskRunCreateInput>,
		) => {
			const v = TaskRunCreateInput.parse(raw);
			return TaskRunOutput.parse(
				await parallelRequest(
					ctx.key,
					'/v1/tasks/runs',
					v.body,
					'POST',
					betaHeaders(v.parallel_beta),
				),
			);
		},
		getRun: getOperation(TaskRunIdInput, TaskRunOutput, (v) =>
			taskPath(v.run_id),
		),
		getRunInput: getOperation(
			TaskRunIdInput,
			TaskRunInput,
			(v) => taskPath(v.run_id) + '/input',
		),
		getResult: async (
			ctx: ParallelContext,
			raw: z.input<typeof TaskResultInput>,
		) => {
			const v = TaskResultInput.parse(raw);
			return TaskResultOutput.parse(
				await parallelRequest(
					ctx.key,
					taskPath(v.run_id) + '/result' + queryString({ timeout: v.timeout }),
					undefined,
					'GET',
					betaHeaders(v.parallel_beta),
					Math.min(
						2_147_483_647,
						Math.max(60_000, ((v.timeout ?? 600) + 30) * 1000),
					),
				),
			);
		},
	},
	monitors: {
		create: operation(MonitorCreateInput, MonitorOutput, '/v1/monitors'),
		list: getOperation(
			MonitorListInput,
			MonitorListOutput,
			(v) => '/v1/monitors' + queryString(v),
		),
		stats: getOperation(
			EmptyInput,
			MonitorStatsOutput,
			() => '/v1/monitors/stats',
		),
		get: getOperation(MonitorIdInput, MonitorOutput, (v) =>
			monitorPath(v.monitor_id),
		),
		cancel: actionOperation(
			MonitorIdInput,
			MonitorOutput,
			(v) => monitorPath(v.monitor_id) + '/cancel',
		),
		trigger: actionOperation(
			MonitorIdInput,
			NoContent,
			(v) => monitorPath(v.monitor_id) + '/trigger',
		),
		events: getOperation(MonitorEventsInput, MonitorEventsOutput, (v) => {
			const { monitor_id, ...q } = v;
			return monitorPath(monitor_id) + '/events' + queryString(q);
		}),
		update: actionOperation(
			MonitorUpdateInput,
			MonitorOutput,
			(v) => monitorPath(v.monitor_id) + '/update',
			(v) => v.body,
		),
	},
	search: { search: operation(SearchInput, SearchOutput, '/v1/search') },
	images: {
		search: operation(ImageSearchInput, ImageSearchOutput, '/v1/images/search'),
	},
	places: {
		search: operation(PlaceSearchInput, PlaceSearchOutput, '/v1/places/search'),
	},
	decisions: {
		create: operation(DecisionInput, DecisionOutput, '/v1/decisions'),
	},
	memory: {
		clear: operation(MemoryClearInput, NoContent, '/v1beta/memory/clear'),
		evict: operation(MemoryEvictInput, NoContent, '/v1beta/memory/evict'),
		retrieve: operation(
			MemoryRetrieveInput,
			MemoryRetrieveOutput,
			'/v1beta/memory/retrieve',
		),
	},
	extract: { extract: operation(ExtractInput, ExtractOutput, '/v1/extract') },
} as const;

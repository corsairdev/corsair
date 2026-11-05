import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickQuery } from './call';

// CAT endpoints render their tables as JSON rows when format=json; every call
// pins it, and path filters (index, node, name patterns) are comma-separated
// multi-target expressions.
const formatJson = { format: 'json' } as const;

const target = (value: string) => encodeIndexTarget(value);

function catPath(base: string, filter: string | undefined): string {
	return filter ? `/_cat/${base}/${target(filter)}` : `/_cat/${base}`;
}

export const help: ElasticsearchEndpoints['catHelp'] = (ctx, input) =>
	call(ctx, 'catHelp', 'cat.help', input, {
		path: () => '/_cat',
	});

export const aliases: ElasticsearchEndpoints['catAliases'] = (ctx, input) =>
	call(ctx, 'catAliases', 'cat.aliases', input, {
		path: (parsed) => catPath('aliases', parsed.name),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['expand_wildcards']),
		}),
	});

export const allocation: ElasticsearchEndpoints['catAllocation'] = (
	ctx,
	input,
) =>
	call(ctx, 'catAllocation', 'cat.allocation', input, {
		path: (parsed) => catPath('allocation', parsed.node_id),
		query: () => ({ ...formatJson }),
	});

export const circuitBreakers: ElasticsearchEndpoints['catCircuitBreakers'] = (
	ctx,
	input,
) =>
	call(ctx, 'catCircuitBreakers', 'cat.circuitBreakers', input, {
		path: (parsed) => catPath('circuit_breaker', parsed.patterns),
		query: () => ({ ...formatJson }),
	});

export const componentTemplates: ElasticsearchEndpoints['catComponentTemplates'] =
	(ctx, input) =>
		call(ctx, 'catComponentTemplates', 'cat.componentTemplates', input, {
			path: (parsed) => catPath('component_templates', parsed.name),
			query: () => ({ ...formatJson }),
		});

export const count: ElasticsearchEndpoints['catCount'] = (ctx, input) =>
	call(ctx, 'catCount', 'cat.count', input, {
		path: (parsed) => catPath('count', parsed.index),
		query: () => ({ ...formatJson }),
	});

export const fielddata: ElasticsearchEndpoints['catFielddata'] = (ctx, input) =>
	call(ctx, 'catFielddata', 'cat.fielddata', input, {
		path: (parsed) => catPath('fielddata', parsed.fields),
		query: () => ({ ...formatJson }),
	});

export const health: ElasticsearchEndpoints['catHealth'] = (ctx, input) =>
	call(ctx, 'catHealth', 'cat.health', input, {
		path: () => '/_cat/health',
		query: (parsed) => ({ ...formatJson, ...pickQuery(parsed, ['ts']) }),
	});

export const master: ElasticsearchEndpoints['catMaster'] = (ctx, input) =>
	call(ctx, 'catMaster', 'cat.master', input, {
		path: () => '/_cat/master',
		query: () => ({ ...formatJson }),
	});

export const mlJobs: ElasticsearchEndpoints['catMlJobs'] = (ctx, input) =>
	call(ctx, 'catMlJobs', 'cat.mlJobs', input, {
		path: (parsed) => catPath('ml/anomaly_detectors', parsed.job_id),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['allow_no_match']),
		}),
	});

export const mlDataFrameAnalytics: ElasticsearchEndpoints['catMlDataFrameAnalytics'] =
	(ctx, input) =>
		call(ctx, 'catMlDataFrameAnalytics', 'cat.mlDataFrameAnalytics', input, {
			path: (parsed) => catPath('ml/data_frame/analytics', parsed.id),
			query: (parsed) => ({
				...formatJson,
				...pickQuery(parsed, ['allow_no_match']),
			}),
		});

export const mlDatafeeds: ElasticsearchEndpoints['catMlDatafeeds'] = (
	ctx,
	input,
) =>
	call(ctx, 'catMlDatafeeds', 'cat.mlDatafeeds', input, {
		path: (parsed) => catPath('ml/datafeeds', parsed.datafeed_id),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['allow_no_match']),
		}),
	});

export const mlTrainedModels: ElasticsearchEndpoints['catMlTrainedModels'] = (
	ctx,
	input,
) =>
	call(ctx, 'catMlTrainedModels', 'cat.mlTrainedModels', input, {
		path: (parsed) => catPath('ml/trained_models', parsed.model_id),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['allow_no_match', 'from', 'size']),
		}),
	});

export const nodeattrs: ElasticsearchEndpoints['catNodeattrs'] = (ctx, input) =>
	call(ctx, 'catNodeattrs', 'cat.nodeattrs', input, {
		path: () => '/_cat/nodeattrs',
		query: () => ({ ...formatJson }),
	});

export const nodes: ElasticsearchEndpoints['catNodes'] = (ctx, input) =>
	call(ctx, 'catNodes', 'cat.nodes', input, {
		path: () => '/_cat/nodes',
		query: (parsed) => ({ ...formatJson, ...pickQuery(parsed, ['full_id']) }),
	});

export const pendingTasks: ElasticsearchEndpoints['catPendingTasks'] = (
	ctx,
	input,
) =>
	call(ctx, 'catPendingTasks', 'cat.pendingTasks', input, {
		path: () => '/_cat/pending_tasks',
		query: () => ({ ...formatJson }),
	});

export const plugins: ElasticsearchEndpoints['catPlugins'] = (ctx, input) =>
	call(ctx, 'catPlugins', 'cat.plugins', input, {
		path: () => '/_cat/plugins',
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['include_bootstrap']),
		}),
	});

export const recovery: ElasticsearchEndpoints['catRecovery'] = (ctx, input) =>
	call(ctx, 'catRecovery', 'cat.recovery', input, {
		path: (parsed) => catPath('recovery', parsed.index),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['active_only', 'detailed']),
		}),
	});

export const repositories: ElasticsearchEndpoints['catRepositories'] = (
	ctx,
	input,
) =>
	call(ctx, 'catRepositories', 'cat.repositories', input, {
		path: () => '/_cat/repositories',
		query: () => ({ ...formatJson }),
	});

export const segments: ElasticsearchEndpoints['catSegments'] = (ctx, input) =>
	call(ctx, 'catSegments', 'cat.segments', input, {
		path: (parsed) => catPath('segments', parsed.index),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['expand_wildcards']),
		}),
	});

export const shards: ElasticsearchEndpoints['catShards'] = (ctx, input) =>
	call(ctx, 'catShards', 'cat.shards', input, {
		path: (parsed) => catPath('shards', parsed.index),
		query: () => ({ ...formatJson }),
	});

export const snapshots: ElasticsearchEndpoints['catSnapshots'] = (ctx, input) =>
	call(ctx, 'catSnapshots', 'cat.snapshots', input, {
		path: (parsed) => catPath('snapshots', parsed.repository),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['ignore_unavailable']),
		}),
	});

// cat.tasks and tasks.list take actions/nodes as string-or-list; the wire
// form is one comma-joined value.
const joinList = (value: string | string[]): string =>
	Array.isArray(value) ? value.join(',') : value;

export const tasks: ElasticsearchEndpoints['catTasks'] = (ctx, input) =>
	call(ctx, 'catTasks', 'cat.tasks', input, {
		path: () => '/_cat/tasks',
		query: (parsed) => ({
			...formatJson,
			actions:
				parsed.actions === undefined ? undefined : joinList(parsed.actions),
			nodes: parsed.nodes === undefined ? undefined : joinList(parsed.nodes),
			...pickQuery(parsed, [
				'parent_task_id',
				'detailed',
				'wait_for_completion',
			]),
		}),
	});

export const templates: ElasticsearchEndpoints['catTemplates'] = (ctx, input) =>
	call(ctx, 'catTemplates', 'cat.templates', input, {
		path: (parsed) => catPath('templates', parsed.name),
		query: () => ({ ...formatJson }),
	});

export const threadPool: ElasticsearchEndpoints['catThreadPool'] = (
	ctx,
	input,
) =>
	call(ctx, 'catThreadPool', 'cat.threadPool', input, {
		path: (parsed) => catPath('thread_pool', parsed.thread_pool_patterns),
		query: () => ({ ...formatJson }),
	});

export const transforms: ElasticsearchEndpoints['catTransforms'] = (
	ctx,
	input,
) =>
	call(ctx, 'catTransforms', 'cat.transforms', input, {
		path: (parsed) => catPath('transforms', parsed.transform_id),
		query: (parsed) => ({
			...formatJson,
			...pickQuery(parsed, ['allow_no_match', 'from', 'size']),
		}),
	});

import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickQuery } from './call';

// Node selectors are comma-separated node ids or names (multi-target syntax).
const target = (value: string) => encodeIndexTarget(value);

function nodesPath(nodeId: string | undefined, suffix: string): string {
	return nodeId ? `/_nodes/${target(nodeId)}${suffix}` : `/_nodes${suffix}`;
}

export const info: ElasticsearchEndpoints['nodesInfo'] = (ctx, input) =>
	call(ctx, 'nodesInfo', 'nodes.info', input, {
		path: (parsed) => {
			if (parsed.metric === undefined) return nodesPath(parsed.node_id, '');
			const metric = target(parsed.metric);
			return parsed.node_id
				? `/_nodes/${target(parsed.node_id)}/${metric}`
				: `/_nodes/${metric}`;
		},
		query: (parsed) => pickQuery(parsed, ['flat_settings', 'timeout']),
	});

export const stats: ElasticsearchEndpoints['nodesStats'] = (ctx, input) =>
	call(ctx, 'nodesStats', 'nodes.stats', input, {
		path: (parsed) => {
			const base = nodesPath(parsed.node_id, '/stats');
			if (parsed.metric === undefined) return base;
			const metric = target(parsed.metric);
			return parsed.index_metric === undefined
				? `${base}/${metric}`
				: `${base}/${metric}/${target(parsed.index_metric)}`;
		},
		query: (parsed) =>
			pickQuery(parsed, [
				'level',
				'timeout',
				'include_segment_file_sizes',
				'include_unloaded_segments',
				'fields',
			]),
	});

export const usage: ElasticsearchEndpoints['nodesUsage'] = (ctx, input) =>
	call(ctx, 'nodesUsage', 'nodes.usage', input, {
		path: (parsed) =>
			parsed.metric === undefined
				? nodesPath(parsed.node_id, '/usage')
				: `${nodesPath(parsed.node_id, '/usage')}/${target(parsed.metric)}`,
		query: (parsed) => pickQuery(parsed, ['timeout']),
	});

export const hotThreads: ElasticsearchEndpoints['nodesHotThreads'] = (
	ctx,
	input,
) =>
	call(ctx, 'nodesHotThreads', 'nodes.hotThreads', input, {
		path: (parsed) => nodesPath(parsed.node_id, '/hot_threads'),
		query: (parsed) =>
			pickQuery(parsed, [
				'threads',
				'sort',
				'type',
				'interval',
				'snapshots',
				'ignore_idle_threads',
				'timeout',
			]),
	});

export const reloadSecureSettings: ElasticsearchEndpoints['nodesReloadSecureSettings'] =
	(ctx, input) =>
		call(
			ctx,
			'nodesReloadSecureSettings',
			'nodes.reloadSecureSettings',
			input,
			{
				method: 'POST',
				path: (parsed) => nodesPath(parsed.node_id, '/reload_secure_settings'),
				query: (parsed) => pickQuery(parsed, ['timeout']),
			},
		);

export const repositoriesMetering: ElasticsearchEndpoints['nodesRepositoriesMetering'] =
	(ctx, input) =>
		call(
			ctx,
			'nodesRepositoriesMetering',
			'nodes.repositoriesMetering',
			input,
			{
				path: (parsed) => nodesPath(parsed.node_id, '/_repositories_metering'),
			},
		);

export const clearRepositoriesMetering: ElasticsearchEndpoints['nodesClearRepositoriesMetering'] =
	(ctx, input) =>
		call(
			ctx,
			'nodesClearRepositoriesMetering',
			'nodes.clearRepositoriesMetering',
			input,
			{
				method: 'DELETE',
				path: (parsed) =>
					`${nodesPath(parsed.node_id, '/_repositories_metering')}/${parsed.max_archive_version}`,
			},
		);

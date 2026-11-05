import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';

// Cluster-family targets (indices, node ids, metric lists) are comma-separated
// multi-target expressions, so every path segment goes through the same
// per-segment encoder the index endpoints use.
const target = (value: string) => encodeIndexTarget(value);

export const getHealth: ElasticsearchEndpoints['clusterGetHealth'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterGetHealth', 'cluster.getHealth', input, {
		path: (parsed) =>
			parsed.index
				? `/_cluster/health/${target(parsed.index)}`
				: '/_cluster/health',
		query: (parsed) =>
			pickQuery(parsed, [
				'level',
				'expand_wildcards',
				'local',
				'wait_for_status',
				'timeout',
			]),
	});

export const ping: ElasticsearchEndpoints['clusterPing'] = (ctx, input) =>
	call(ctx, 'clusterPing', 'cluster.ping', input, {
		method: 'HEAD',
		path: () => '/',
		existsStyle: true,
	});

export const getInfo: ElasticsearchEndpoints['clusterGetInfo'] = (ctx, input) =>
	call(ctx, 'clusterGetInfo', 'cluster.getInfo', input, {
		path: () => '/',
	});

export const subsystemInfo: ElasticsearchEndpoints['clusterSubsystemInfo'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterSubsystemInfo', 'cluster.subsystemInfo', input, {
		path: (parsed) => `/_info/${target(parsed.target)}`,
	});

export const pendingTasks: ElasticsearchEndpoints['clusterPendingTasks'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterPendingTasks', 'cluster.pendingTasks', input, {
		path: () => '/_cluster/pending_tasks',
		query: (parsed) => pickQuery(parsed, ['local', 'master_timeout']),
	});

export const getSettings: ElasticsearchEndpoints['clusterGetSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterGetSettings', 'cluster.getSettings', input, {
		path: () => '/_cluster/settings',
		query: (parsed) =>
			pickQuery(parsed, [
				'flat_settings',
				'include_defaults',
				'timeout',
				'master_timeout',
			]),
	});

export const putSettings: ElasticsearchEndpoints['clusterPutSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterPutSettings', 'cluster.putSettings', input, {
		method: 'PUT',
		path: () => '/_cluster/settings',
		query: (parsed) =>
			pickQuery(parsed, ['flat_settings', 'timeout', 'master_timeout']),
		body: (parsed) => pickBody(parsed, ['persistent', 'transient']),
	});

export const reroute: ElasticsearchEndpoints['clusterReroute'] = (ctx, input) =>
	call(ctx, 'clusterReroute', 'cluster.reroute', input, {
		method: 'POST',
		path: () => '/_cluster/reroute',
		query: (parsed) =>
			pickQuery(parsed, [
				'dry_run',
				'explain',
				'retry_failed',
				'master_timeout',
				'timeout',
			]),
		body: (parsed) => pickBody(parsed, ['commands']),
	});

export const allocationExplain: ElasticsearchEndpoints['clusterAllocationExplain'] =
	(ctx, input) =>
		call(ctx, 'clusterAllocationExplain', 'cluster.allocationExplain', input, {
			method: 'POST',
			path: () => '/_cluster/allocation/explain',
			query: (parsed) =>
				pickQuery(parsed, [
					'include_disk_info',
					'include_yes_decisions',
					'master_timeout',
				]),
			body: (parsed) =>
				pickBody(parsed, ['index', 'shard', 'primary', 'current_node']),
		});

export const getState: ElasticsearchEndpoints['clusterGetState'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterGetState', 'cluster.getState', input, {
		path: (parsed) => {
			const metric = parsed.metric ? target(parsed.metric) : undefined;
			if (!metric) return '/_cluster/state';
			return parsed.index
				? `/_cluster/state/${metric}/${target(parsed.index)}`
				: `/_cluster/state/${metric}`;
		},
		query: (parsed) =>
			pickQuery(parsed, ['flat_settings', 'local', 'master_timeout']),
	});

export const getStats: ElasticsearchEndpoints['clusterGetStats'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterGetStats', 'cluster.getStats', input, {
		path: (parsed) =>
			parsed.node_id
				? `/_cluster/stats/nodes/${target(parsed.node_id)}`
				: '/_cluster/stats',
		query: (parsed) => pickQuery(parsed, ['include_remotes', 'timeout']),
	});

export const addVotingConfigExclusions: ElasticsearchEndpoints['clusterAddVotingConfigExclusions'] =
	(ctx, input) =>
		call(
			ctx,
			'clusterAddVotingConfigExclusions',
			'cluster.addVotingConfigExclusions',
			input,
			{
				method: 'POST',
				path: () => '/_cluster/voting_config_exclusions',
				query: (parsed) => ({
					...pickQuery(parsed, ['master_timeout', 'timeout']),
					...(parsed.node_names
						? { node_names: parsed.node_names.join(',') }
						: {}),
					...(parsed.node_ids ? { node_ids: parsed.node_ids.join(',') } : {}),
				}),
			},
		);

export const clearVotingConfigExclusions: ElasticsearchEndpoints['clusterClearVotingConfigExclusions'] =
	(ctx, input) =>
		call(
			ctx,
			'clusterClearVotingConfigExclusions',
			'cluster.clearVotingConfigExclusions',
			input,
			{
				method: 'DELETE',
				path: () => '/_cluster/voting_config_exclusions',
				query: (parsed) =>
					pickQuery(parsed, ['wait_for_removal', 'master_timeout']),
			},
		);

export const remoteInfo: ElasticsearchEndpoints['clusterRemoteInfo'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterRemoteInfo', 'cluster.remoteInfo', input, {
		path: () => '/_remote/info',
	});

export const healthReport: ElasticsearchEndpoints['clusterHealthReport'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterHealthReport', 'cluster.healthReport', input, {
		path: (parsed) =>
			parsed.feature
				? `/_health_report/${target(parsed.feature)}`
				: '/_health_report',
		query: (parsed) => pickQuery(parsed, ['size', 'verbose', 'timeout']),
	});

export const sslCertificates: ElasticsearchEndpoints['clusterSslCertificates'] =
	(ctx, input) =>
		call(ctx, 'clusterSslCertificates', 'cluster.sslCertificates', input, {
			path: () => '/_ssl/certificates',
		});

export const scriptContexts: ElasticsearchEndpoints['clusterScriptContexts'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterScriptContexts', 'cluster.scriptContexts', input, {
		path: () => '/_script_context',
	});

export const scriptLanguages: ElasticsearchEndpoints['clusterScriptLanguages'] =
	(ctx, input) =>
		call(ctx, 'clusterScriptLanguages', 'cluster.scriptLanguages', input, {
			path: () => '/_script_language',
		});

export const resolveCluster: ElasticsearchEndpoints['clusterResolveCluster'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterResolveCluster', 'cluster.resolveCluster', input, {
		path: (parsed) => `/_resolve/cluster/${target(parsed.name)}`,
	});

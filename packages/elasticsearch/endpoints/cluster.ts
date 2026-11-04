import type { ElasticsearchEndpoints } from '..';
import { call } from './call';

export const getHealth: ElasticsearchEndpoints['clusterGetHealth'] = (
	ctx,
	input,
) =>
	call(ctx, 'clusterGetHealth', 'cluster.getHealth', input, {
		path: () => '/_cluster/health',
	});

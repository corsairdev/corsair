import type { DataboxEndpoints } from '..';
import { call } from './call';
import { shapeList } from './envelope';
import {
	DataboxEndpointInputSchemas as Inputs,
	DataboxEndpointOutputSchemas as Outputs,
} from './types';

export const list: DataboxEndpoints['dashboardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'dashboards.list',
			input: Inputs.listDashboards,
			output: Outputs.listDashboards,
		},
		input,
		({ search, page, pageSize, accountId }) => ({
			method: 'GET',
			path: '/v2/dashboards',
			query: { search, page, pageSize },
			accountId,
			replaySafe: true,
		}),
		{
			shape: shapeList('dashboards'),
			log: (_, result) => ({
				count: result.dashboards.length,
				page: result.page,
			}),
		},
	);

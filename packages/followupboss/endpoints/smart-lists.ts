import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

export const list: FollowUpBossEndpoints['smartListsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'smartLists.list',
			input: Inputs.smartListsList,
			output: Outputs.smartListsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/smartLists', query }),
		{
			shape: (raw) => ({
				smartLists: envelopeMany(raw, 'smartLists'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.smartLists.length }),
		},
	);

export const get: FollowUpBossEndpoints['smartListsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'smartLists.get',
			input: Inputs.smartListsGet,
			output: Outputs.smartListsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/smartLists/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'smartLists'),
			log: ({ id }) => ({ smartListId: id }),
		},
	);

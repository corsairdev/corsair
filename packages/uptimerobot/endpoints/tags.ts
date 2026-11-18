import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		({ limit, cursor }) => ({
			method: 'GET',
			path: '/tags',
			query: { limit, cursor },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.nextCursorId != null,
			}),
		},
	);

export const remove: UptimeRobotEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.delete',
			input: Inputs.tagsDelete,
			output: Outputs.tagsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tags/${segment(id)}` }),
		{
			// UptimeRobot answers 204. Deleting a tag also removes it from every
			// monitor that carried it, but the monitors themselves stay.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

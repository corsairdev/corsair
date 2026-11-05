import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const get: GrafbaseEndpoints['viewerGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'viewer.get',
			input: Inputs.viewerGet,
			output: Outputs.viewerGet,
		},
		input,
		() => ({
			query: `query ViewerGet {
	viewer {
		id
		email
		name
		createdAt
	}
}`,
			operationKind: 'query',
		}),
		{
			shape: (raw) => ({ viewer: asRecord(raw)?.viewer ?? null }),
		},
	);

import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const get: GrafbaseEndpoints['deploymentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deployments.get',
			input: Inputs.deploymentsGet,
			output: Outputs.deploymentsGet,
		},
		input,
		({ id }) => ({
			query: `query DeploymentsGet($id: ID!) {
	deployment(id: $id) {
		id
		status
		createdAt
		startedAt
		finishedAt
		duration
		message
		isRedeployable
		changeCounts {
			addedFields
			addedTypes
			changedFields
			changedTypes
			removedFields
			removedTypes
		}
		subgraph {
			name
		}
	}
}`,
			variables: { id },
			operationKind: 'query',
		}),
		{
			shape: (raw) => ({ deployment: asRecord(raw)?.deployment ?? null }),
		},
	);

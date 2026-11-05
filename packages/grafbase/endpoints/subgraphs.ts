import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const get: GrafbaseEndpoints['subgraphsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subgraphs.get',
			input: Inputs.subgraphsGet,
			output: Outputs.subgraphsGet,
		},
		input,
		({ accountSlug, graphSlug, subgraphName, branch }) => ({
			query: `query SubgraphsGet($accountSlug: String!, $graphSlug: String, $branch: String, $subgraphName: String!) {
	subgraph(accountSlug: $accountSlug, graphSlug: $graphSlug, branch: $branch, subgraphName: $subgraphName) {
		name
		url
		schema
		createdAt
		updatedAt
	}
}`,
			variables: { accountSlug, graphSlug, branch, subgraphName },
			operationKind: 'query',
		}),
		{
			shape: (raw) => ({ subgraph: asRecord(raw)?.subgraph ?? null }),
		},
	);

export const publish: GrafbaseEndpoints['subgraphsPublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subgraphs.publish',
			input: Inputs.subgraphsPublish,
			output: Outputs.subgraphsPublish,
		},
		input,
		({
			accountSlug,
			graphSlug,
			subgraph,
			schema,
			url,
			branch,
			message,
			virtual,
		}) => ({
			query: `mutation SubgraphsPublish($input: PublishInput!) {
	publish(input: $input) {
		__typename
		... on FederatedGraphCompositionError {
			messages
		}
		... on PublishDeploymentFailure {
			deploymentError
		}
	}
}`,
			variables: {
				input: {
					accountSlug,
					graphSlug,
					subgraph,
					schema,
					url,
					branch,
					message,
					virtual,
				},
			},
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.publish ?? null,
			log: ({ subgraph, branch }, result) => ({
				subgraph,
				branch,
				outcome: result.__typename,
			}),
		},
	);

export const remove: GrafbaseEndpoints['subgraphsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subgraphs.delete',
			input: Inputs.subgraphsDelete,
			output: Outputs.subgraphsDelete,
		},
		input,
		({ accountSlug, graphSlug, branch, subgraph, dryRun, message }) => ({
			query: `mutation SubgraphsDelete($input: DeleteSubgraphInput!) {
	deleteSubgraph(input: $input) {
		__typename
		... on DeleteSubgraphDeploymentFailure {
			deploymentError
		}
		... on FederatedGraphCompositionError {
			messages
		}
	}
}`,
			variables: {
				input: { accountSlug, graphSlug, branch, subgraph, dryRun, message },
			},
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.deleteSubgraph ?? null,
			log: ({ subgraph, branch, dryRun }, result) => ({
				subgraph,
				branch,
				dryRun,
				outcome: result.__typename,
			}),
		},
	);

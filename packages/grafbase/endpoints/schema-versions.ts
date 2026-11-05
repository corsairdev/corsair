import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call, readPage } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const list: GrafbaseEndpoints['schemaVersionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemaVersions.list',
			input: Inputs.schemaVersionsList,
			output: Outputs.schemaVersionsList,
		},
		input,
		({
			accountSlug,
			graphSlug,
			branch,
			subgraphName,
			populated,
			first,
			after,
		}) => ({
			query: `query SchemaVersionsList(
	$accountSlug: String!
	$graphSlug: String
	$branch: String
	$subgraphName: String
	$populated: Boolean!
	$first: Int
	$after: String
) {
	schemaVersions(
		accountSlug: $accountSlug
		graphSlug: $graphSlug
		branch: $branch
		subgraphName: $subgraphName
		populated: $populated
		first: $first
		after: $after
	) {
		nodes {
			id
			createdAt
			message
			schema
			subgraph {
				name
			}
		}
		pageInfo {
			hasNextPage
			endCursor
		}
	}
}`,
			variables: {
				accountSlug,
				graphSlug,
				branch,
				subgraphName,
				populated,
				first,
				after,
			},
			operationKind: 'query',
		}),
		{
			shape: (raw) => {
				const page = readPage(asRecord(raw)?.schemaVersions);
				return {
					versions: page.nodes,
					hasNextPage: page.hasNextPage,
					nextCursor: page.nextCursor,
				};
			},
			log: (_, result) => ({ count: result.versions.length }),
		},
	);

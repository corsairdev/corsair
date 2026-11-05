import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call, readPage } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const list: GrafbaseEndpoints['graphsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'graphs.list',
			input: Inputs.graphsList,
			output: Outputs.graphsList,
		},
		input,
		({ accountSlug, first, after }) => ({
			query: `query GraphsList($slug: String!, $first: Int, $after: String) {
	accountBySlug(slug: $slug) {
		id
		name
		slug
		plan
		graphs(first: $first, after: $after) {
			nodes {
				id
				slug
				createdAt
				productionBranch {
					name
				}
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}
	}
}`,
			variables: { slug: accountSlug, first, after },
			operationKind: 'query',
		}),
		{
			shape: (raw) => {
				const account = asRecord(asRecord(raw)?.accountBySlug);
				const page = readPage(account?.graphs);
				return {
					account: account
						? {
								id: account.id,
								slug: account.slug,
								name: account.name,
								plan: account.plan,
							}
						: null,
					graphs: page.nodes,
					hasNextPage: page.hasNextPage,
					nextCursor: page.nextCursor,
				};
			},
			log: (_, result) => ({
				accountSlug: result.account?.slug ?? undefined,
				count: result.graphs.length,
			}),
		},
	);

export const get: GrafbaseEndpoints['graphsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'graphs.get',
			input: Inputs.graphsGet,
			output: Outputs.graphsGet,
		},
		input,
		({ accountSlug, graphSlug }) => ({
			query: `query GraphsGet($accountSlug: String!, $graphSlug: String!) {
	graphByAccountSlug(accountSlug: $accountSlug, graphSlug: $graphSlug) {
		id
		slug
		createdAt
		account {
			id
			slug
		}
		productionBranch {
			id
			name
			environment
		}
	}
}`,
			variables: { accountSlug, graphSlug },
			operationKind: 'query',
		}),
		{
			shape: (raw) => ({ graph: asRecord(raw)?.graphByAccountSlug ?? null }),
		},
	);

export const create: GrafbaseEndpoints['graphsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'graphs.create',
			input: Inputs.graphsCreate,
			output: Outputs.graphsCreate,
		},
		input,
		({ accountId, graphSlug }) => ({
			query: `mutation GraphsCreate($input: GraphCreateInput!) {
	graphCreate(input: $input) {
		__typename
		... on GraphCreateSuccess {
			graph {
				id
				slug
				createdAt
			}
		}
	}
}`,
			variables: { input: { accountId, graphSlug } },
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.graphCreate ?? null,
			log: ({ graphSlug }, result) => ({
				graphSlug,
				outcome: result.__typename,
				graphId: result.graph?.id ?? undefined,
			}),
		},
	);

export const remove: GrafbaseEndpoints['graphsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'graphs.delete',
			input: Inputs.graphsDelete,
			output: Outputs.graphsDelete,
		},
		input,
		({ id }) => ({
			query: `mutation GraphsDelete($input: GraphDeleteInput!) {
	graphDelete(input: $input) {
		__typename
	}
}`,
			variables: { input: { id } },
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.graphDelete ?? null,
			log: ({ id }, result) => ({ graphId: id, outcome: result.__typename }),
		},
	);

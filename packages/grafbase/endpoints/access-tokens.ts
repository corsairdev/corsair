import { asRecord } from 'corsair/core';
import type { GrafbaseEndpoints } from '..';
import { call, readPage } from './call';
import {
	GrafbaseEndpointInputSchemas as Inputs,
	GrafbaseEndpointOutputSchemas as Outputs,
} from './types';

export const list: GrafbaseEndpoints['accessTokensList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.list',
			input: Inputs.accessTokensList,
			output: Outputs.accessTokensList,
		},
		input,
		({ first, after }) => ({
			query: `query AccessTokensList($first: Int, $after: String) {
	accessTokens(first: $first, after: $after) {
		nodes {
			id
			name
			accountId
			createdAt
			expiresAt
			graphScopes {
				id
				slug
			}
		}
		pageInfo {
			hasNextPage
			endCursor
		}
	}
}`,
			variables: { first, after },
			operationKind: 'query',
		}),
		{
			shape: (raw) => {
				const page = readPage(asRecord(raw)?.accessTokens);
				return {
					tokens: page.nodes,
					hasNextPage: page.hasNextPage,
					nextCursor: page.nextCursor,
				};
			},
			log: (_, result) => ({ count: result.tokens.length }),
		},
	);

export const create: GrafbaseEndpoints['accessTokensCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.create',
			input: Inputs.accessTokensCreate,
			output: Outputs.accessTokensCreate,
		},
		input,
		({ name, kind, accountId, expiresAt, graphScopes }) => ({
			query: `mutation AccessTokensCreate($input: AccessTokenCreateInput!) {
	accessTokenCreate(input: $input) {
		__typename
		... on AccessTokenCreateSuccess {
			jwt
			token {
				id
				name
				createdAt
				expiresAt
			}
		}
	}
}`,
			variables: { input: { name, kind, accountId, expiresAt, graphScopes } },
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.accessTokenCreate ?? null,
			// The jwt must never reach the log.
			log: ({ name, kind }, result) => ({
				name,
				kind,
				outcome: result.__typename,
				tokenId: result.token?.id ?? undefined,
			}),
		},
	);

export const remove: GrafbaseEndpoints['accessTokensDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.delete',
			input: Inputs.accessTokensDelete,
			output: Outputs.accessTokensDelete,
		},
		input,
		({ id }) => ({
			query: `mutation AccessTokensDelete($input: AccessTokenDeleteInput!) {
	accessTokenDelete(input: $input) {
		__typename
	}
}`,
			variables: { input: { id } },
			operationKind: 'mutation',
		}),
		{
			shape: (raw) => asRecord(raw)?.accessTokenDelete ?? null,
			log: ({ id }, result) => ({ tokenId: id, outcome: result.__typename }),
		},
	);

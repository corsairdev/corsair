import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

export const list: PenpotEndpoints['accessTokensList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.list',
			input: Inputs.accessTokensList,
			output: Outputs.accessTokensList,
		},
		input,
		() => 'get-access-tokens',
		{
			body: () => ({}),
			// The token values are never logged, only the names.
			log: (_, tokens) => ({ count: tokens.length }),
		},
	);

export const create: PenpotEndpoints['accessTokensCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.create',
			input: Inputs.accessTokensCreate,
			output: Outputs.accessTokensCreate,
		},
		input,
		() => 'create-access-token',
		{
			body: (input) => input,
			// The one-time token value is not logged, only its presence.
			log: (_, token) => ({
				tokenId: token.id ?? undefined,
				hasToken: token.token !== undefined && token.token !== null,
			}),
		},
	);

export const remove: PenpotEndpoints['accessTokensDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accessTokens.delete',
			input: Inputs.accessTokensDelete,
			output: Outputs.accessTokensDelete,
		},
		input,
		() => 'delete-access-token',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ tokenId: result.id }),
		},
	);

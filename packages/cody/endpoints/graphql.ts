import { logEventFromContext } from 'corsair/core';
import type { CodyEndpoints } from '..';
import { makeCodyRequest } from '../client';
import type { GraphqlResponse } from './types';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const post: CodyEndpoints['graphql'] = async (ctx, input) => {
	const parsed = CodyEndpointInputSchemas.graphql.parse(input);
	const response = await makeCodyRequest<GraphqlResponse>(
		'/.api/graphql',
		ctx.key,
		{
			method: 'POST',
			authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
			body: {
				query: parsed.query,
				...(parsed.variables ? { variables: parsed.variables } : {}),
			},
		},
	);

	const validated = CodyEndpointOutputSchemas.graphql.parse(response);

	await logEventFromContext(
		ctx,
		'cody.graphql.post',
		{ query: parsed.query },
		'completed',
	);

	return validated;
};

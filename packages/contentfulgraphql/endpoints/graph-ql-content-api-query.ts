import { logEventFromContext } from 'corsair/core';
import type { ContentfulGraphqlEndpoints } from '..';
import {
	buildContentfulGraphqlPath,
	makeContentfulGraphqlRequest,
} from '../client';
import type { GraphQlContentApiQueryResponse } from './types';

export const graphQlContentApiQuery: ContentfulGraphqlEndpoints['graphQlContentApiQuery'] =
	async (ctx, input) => {
		const spaceId = await ctx.keys.get_space_id();
		if (!spaceId) {
			throw new Error(
				'[contentfulgraphql] space_id is required but not configured',
			);
		}
		const environmentId = await ctx.keys.get_environment_id();

		const path = buildContentfulGraphqlPath(
			spaceId,
			environmentId ?? undefined,
		);

		const data = await makeContentfulGraphqlRequest<
			GraphQlContentApiQueryResponse['data']
		>(path, ctx.key, {
			query: input.query,
			...(input.variables ? { variables: input.variables } : {}),
			...(input.operationName ? { operationName: input.operationName } : {}),
		});

		await logEventFromContext(
			ctx,
			'contentfulgraphql.graphQlContentApiQuery',
			{ operationName: input.operationName },
			'completed',
		);

		return { data };
	};

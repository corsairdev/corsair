import { logEventFromContext } from 'corsair/core';
import type { ContentfulGraphqlEndpoints } from '..';
import {
	buildContentfulGraphqlPath,
	makeContentfulGraphqlPersistedQueryRequest,
	sha256,
} from '../client';
import type { GraphQlContentApiPersistedQueryResponse } from './types';

export const graphQlContentApiPersistedQuery: ContentfulGraphqlEndpoints['graphQlContentApiPersistedQuery'] =
	async (ctx, input) => {
		const spaceId = await ctx.keys.get_space_id();
		if (!spaceId) {
			throw new Error(
				'[contentfulgraphql] space_id is required but not configured',
			);
		}
		const environmentId = await ctx.keys.get_environment_id();

		if (!input.sha256Hash && !input.query) {
			throw new Error('Either query or sha256Hash must be provided');
		}

		// When the caller only supplies the query, derive the SHA-256 hash so the
		// request registers the persisted query with Contentful on the first call.
		const sha256Hash = input.sha256Hash || sha256(input.query!);

		const path = buildContentfulGraphqlPath(
			spaceId,
			environmentId ?? undefined,
		);

		const data = await makeContentfulGraphqlPersistedQueryRequest<
			GraphQlContentApiPersistedQueryResponse['data']
		>(path, ctx.key, {
			sha256Hash,
			query: input.query,
			variables: input.variables,
			operationName: input.operationName,
		});

		await logEventFromContext(
			ctx,
			'contentfulgraphql.graphQlContentApiPersistedQuery',
			{ sha256Hash },
			'completed',
		);

		return { data };
	};

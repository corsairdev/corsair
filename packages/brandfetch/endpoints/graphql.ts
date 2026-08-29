import { logEventFromContext } from 'corsair/core';
import { makeBrandfetchGraphqlRequest } from '../client';
import type { BrandfetchEndpoints } from '../index';
import { requireApiKey } from './rest';
import { BrandfetchEndpointOutputSchemas } from './types';

const TAXONOMY_QUERY = `{
  taxonomy {
    industries {
      id urn name slug emoji depth banner
      parent { id urn name slug emoji }
      children { id urn name slug emoji depth }
    }
    countries { code name slug emoji latitude longitude }
    geographicRegions { name slug emoji depth parent { name slug } }
  }
}`;

const VERSION_QUERY = `{ version }`;

const SUBSCRIBABLE_EVENTS_QUERY = `{
  subscribableEvents { namespace name description subscriptionScope }
}`;

const WEBHOOKS_QUERY = `
query ListWebhooks($first: Int, $after: ID) {
  webhooks(first: $first, after: $after) {
    nodes { urn url description enabled events createdAt updatedAt }
    pageInfo { hasNextPage endCursor }
  }
}`;

export const getTaxonomy: BrandfetchEndpoints['getTaxonomy'] = async (
	ctx,
	_input,
) => {
	const apiKey = await requireApiKey(ctx);
	const data = await makeBrandfetchGraphqlRequest<{
		taxonomy: unknown;
	}>(apiKey, TAXONOMY_QUERY);
	const response = BrandfetchEndpointOutputSchemas.getTaxonomy.parse(
		data.taxonomy,
	);
	await logEventFromContext(ctx, 'brandfetch.taxonomy.get', {}, 'completed');
	return response;
};

export const getGraphqlVersion: BrandfetchEndpoints['getGraphqlVersion'] =
	async (ctx, _input) => {
		const apiKey = await requireApiKey(ctx);
		const data = await makeBrandfetchGraphqlRequest<{ version: string }>(
			apiKey,
			VERSION_QUERY,
		);
		const response =
			BrandfetchEndpointOutputSchemas.getGraphqlVersion.parse(data);
		await logEventFromContext(
			ctx,
			'brandfetch.graphql.getVersion',
			{},
			'completed',
		);
		return response;
	};

export const listSubscribableEvents: BrandfetchEndpoints['listSubscribableEvents'] =
	async (ctx, _input) => {
		const apiKey = await requireApiKey(ctx);
		const data = await makeBrandfetchGraphqlRequest<unknown>(
			apiKey,
			SUBSCRIBABLE_EVENTS_QUERY,
		);
		const response =
			BrandfetchEndpointOutputSchemas.listSubscribableEvents.parse(data);
		await logEventFromContext(
			ctx,
			'brandfetch.webhooks.listEvents',
			{},
			'completed',
		);
		return response;
	};

export const listWebhooks: BrandfetchEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const apiKey = await requireApiKey(ctx);
	const data = await makeBrandfetchGraphqlRequest<{
		webhooks: unknown;
	}>(apiKey, WEBHOOKS_QUERY, {
		first: input.first,
		after: input.after,
	});
	const response = BrandfetchEndpointOutputSchemas.listWebhooks.parse(
		data.webhooks,
	);
	if (ctx.db.webhooks) {
		for (const node of response.nodes) {
			try {
				await ctx.db.webhooks.upsertByEntityId(node.urn, {
					urn: node.urn,
					url: node.url,
					description: node.description ?? null,
					enabled: node.enabled,
					events: node.events,
					checkedAt: new Date(),
				});
			} catch {
				// Cache write is best-effort.
			}
		}
	}
	await logEventFromContext(
		ctx,
		'brandfetch.webhooks.list',
		{ first: input.first },
		'completed',
	);
	return response;
};

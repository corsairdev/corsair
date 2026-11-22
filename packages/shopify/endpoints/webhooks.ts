import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import { call } from './call';
import { DEFAULT_PAGE_SIZE } from './schemas';
import {
	ShopifyEndpointInputSchemas as Inputs,
	ShopifyEndpointOutputSchemas as Outputs,
} from './types';

const SUBSCRIPTION_FRAGMENT = `
fragment WebhookSubscriptionFields on WebhookSubscription {
  id
  topic
  uri
  format
  createdAt
  updatedAt
}`;

const LIST_QUERY = `
query WebhookSubscriptionsList($first: Int, $after: String) {
  webhookSubscriptions(first: $first, after: $after) {
    edges { node { ...WebhookSubscriptionFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${SUBSCRIPTION_FRAGMENT}`;

const CREATE_MUTATION = `
mutation WebhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
  webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
    webhookSubscription { ...WebhookSubscriptionFields }
    userErrors { field message }
  }
}
${SUBSCRIPTION_FRAGMENT}`;

const DELETE_MUTATION = `
mutation WebhookSubscriptionDelete($id: ID!) {
  webhookSubscriptionDelete(id: $id) {
    deletedWebhookSubscriptionId
    userErrors { field message }
  }
}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['webhooksList'],
): Promise<ShopifyEndpointOutputs['webhooksList']> =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ first, after }) => ({
			query: LIST_QUERY,
			variables: { first: first ?? DEFAULT_PAGE_SIZE, after },
			replaySafe: true,
		}),
		{
			// The topic filter is applied here rather than as a query argument:
			// `webhookSubscriptions` filters on the enum, and a caller passes a
			// plain string, so a wrong value would fail the whole page instead of
			// returning an empty one. Filtering keeps the page's cursor intact.
			shape: (raw, { topic }) => {
				const page = raw as {
					webhookSubscriptions?: {
						edges: { node: { topic?: string }; cursor?: string | null }[];
						// unknown: carried through untouched; the output schema
						// validates it after the edges are filtered.
						pageInfo: unknown;
					};
				};
				const connection = page.webhookSubscriptions;
				if (!connection) return { webhookSubscriptions: connection };
				return {
					webhookSubscriptions: topic
						? {
								...connection,
								edges: connection.edges.filter(
									(edge) => edge.node.topic === topic,
								),
							}
						: connection,
				};
			},
			log: (_, result) => ({
				count: result.webhookSubscriptions.edges.length,
			}),
		},
	);

export const create = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['webhooksCreate'],
): Promise<ShopifyEndpointOutputs['webhooksCreate']> =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
			mutation: true,
		},
		input,
		({ topic, uri }) => ({
			query: CREATE_MUTATION,
			variables: {
				topic,
				// JSON is the only format this plugin's verifier can read: an
				// XML delivery would not parse against the payload schemas.
				webhookSubscription: { uri, format: 'JSON' },
			},
			payloadKey: 'webhookSubscriptionCreate',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					webhookSubscriptionCreate: { webhookSubscription?: unknown };
				};
				return {
					webhookSubscription:
						payload.webhookSubscriptionCreate.webhookSubscription,
				};
			},
			log: (_, result) => ({ subscriptionId: result.webhookSubscription.id }),
		},
	);

export const remove = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['webhooksDelete'],
): Promise<ShopifyEndpointOutputs['webhooksDelete']> =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
			mutation: true,
		},
		input,
		({ id }) => ({
			query: DELETE_MUTATION,
			variables: { id },
			payloadKey: 'webhookSubscriptionDelete',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					webhookSubscriptionDelete: { deletedWebhookSubscriptionId?: unknown };
				};
				return {
					deletedWebhookSubscriptionId:
						payload.webhookSubscriptionDelete.deletedWebhookSubscriptionId,
				};
			},
			log: (_, result) => ({
				subscriptionId: result.deletedWebhookSubscriptionId ?? undefined,
			}),
		},
	);

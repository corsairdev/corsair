import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['webhooksList']>(
		`query($boardId: ID!) {
			webhooks(board_id: $boardId) {
				id
				board_id
				event
			}
		}`,
		ctx.key,
		{ boardId: input.board_id },
	);

	await logEventFromContext(
		ctx,
		'monday.webhooks.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: MondayEndpoints['webhooksCreate'] = async (ctx, input) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['webhooksCreate']
	>(
		`mutation($boardId: ID!, $url: String!, $event: WebhookEventType!, $config: JSON) {
			create_webhook(board_id: $boardId, url: $url, event: $event, config: $config) {
				id
				board_id
				event
			}
		}`,
		ctx.key,
		{
			boardId: input.board_id,
			url: input.url,
			event: input.event,
			config: input.config,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.webhooks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deletewebhook: MondayEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeMondayRequest<
		MondayEndpointOutputs['webhooksDelete']
	>(
		`mutation($webhookId: ID!) {
			delete_webhook(id: $webhookId) {
				id
				board_id
			}
		}`,
		ctx.key,
		{ webhookId: input.webhook_id },
	);

	await logEventFromContext(
		ctx,
		'monday.webhooks.delete',
		{ ...input },
		'completed',
	);
	return result;
};

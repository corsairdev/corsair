import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactBody, compactQuery } from './shared';
import type {
	BotpressConversation,
	BotpressMessage,
	BotpressWorkflow,
} from './types';

/**
 * Creates a conversation on a channel.
 *
 * Scoped by `x-bot-id` rather than `x-workspace-id` (confirmed live:
 * `GET /v1/chat/conversations` answers 400 `request/headers must have
 * required property 'x-bot-id'` without it, and succeeds with it against
 * `api.botpress.cloud` — see `client.ts` for the host correction). The
 * channel must be one an integration installed on the bot actually serves;
 * confirmed live against a bot with zero integrations installed, which
 * answered "Must specify either integrationId or integrationAlias" — this
 * plugin does not install integrations, so full exercise of this route needs
 * a bot with at least one channel-providing integration installed.
 */
export const createConversation: BotpressEndpoints['chatCreateConversation'] =
	async (ctx, input) => {
		const result = await botpressCall<{ conversation: BotpressConversation }>(
			ctx,
			'/v1/chat/conversations',
			{
				method: 'POST',
				body: compactBody({
					channel: input.channel,
					tags: input.tags,
					properties: input.properties,
				}),
				botId: input.botId,
			},
		);

		await logEventFromContext(
			ctx,
			'botpress.chat.createConversation',
			auditPayload(input, ['botId', 'channel']),
			'completed',
		);
		return result.conversation;
	};

/** Lists a bot's conversations, optionally filtered by tags, channel or date range. */
export const listConversations: BotpressEndpoints['chatListConversations'] =
	async (ctx, input) => {
		const result = await botpressCall<{
			conversations?: BotpressConversation[];
			meta?: { nextToken?: string };
		}>(ctx, '/v1/chat/conversations', {
			method: 'GET',
			query: compactQuery({
				nextToken: input.nextToken,
				pageSize: input.pageSize,
				tags: input.tags,
				sortField: input.sortField,
				sortDirection: input.sortDirection,
				participantIds: input.participantIds,
				integrationName: input.integrationName,
				channel: input.channel,
				afterDate: input.afterDate,
				beforeDate: input.beforeDate,
				minMessageCount: input.minMessageCount,
				maxMessageCount: input.maxMessageCount,
			}),
			botId: input.botId,
		});

		await logEventFromContext(
			ctx,
			'botpress.chat.listConversations',
			auditPayload(input, ['botId', 'channel']),
			'completed',
		);
		return {
			conversations: result.conversations ?? [],
			nextToken: result.meta?.nextToken,
		};
	};

/** Sends a message into a conversation on behalf of a user. */
export const sendMessage: BotpressEndpoints['chatSendMessage'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ message: BotpressMessage }>(
		ctx,
		'/v1/chat/messages',
		{
			method: 'POST',
			body: {
				payload: input.payload,
				userId: input.userId,
				conversationId: input.conversationId,
				type: input.type,
				// Required by CreateMessageRequestBody, so sent as-is (not compacted).
				tags: input.tags,
				...compactBody({ schedule: input.schedule, origin: input.origin }),
			},
			botId: input.botId,
		},
	);

	await logEventFromContext(
		ctx,
		'botpress.chat.sendMessage',
		auditPayload(input, ['botId', 'conversationId', 'userId', 'type']),
		'completed',
	);
	return result.message;
};

/** Updates a workflow's status, output or failure reason. */
export const updateWorkflow: BotpressEndpoints['chatUpdateWorkflow'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ workflow: BotpressWorkflow }>(
		ctx,
		`/v1/chat/workflows/${encodeURIComponent(input.id)}`,
		{
			method: 'PUT',
			body: compactBody({
				status: input.status,
				output: input.output,
				timeoutAt: input.timeoutAt,
				failureReason: input.failureReason,
				tags: input.tags,
				userId: input.userId,
				eventId: input.eventId,
			}),
			botId: input.botId,
		},
	);

	await logEventFromContext(
		ctx,
		'botpress.chat.updateWorkflow',
		auditPayload(input, ['botId', 'id', 'status']),
		'completed',
	);
	return result.workflow;
};

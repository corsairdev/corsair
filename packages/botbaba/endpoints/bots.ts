import { logEventFromContext } from 'corsair/core';
import type { BotbabaEndpoints } from '../index';
import { auditPayload } from './logging';
import { botbabaCall, compactBody, compactQuery } from './shared';
import type { BotbabaBot, BotbabaEndpointOutputs } from './types';

/** Creates a new chatbot. */
export const create: BotbabaEndpoints['botsCreate'] = async (ctx, input) => {
	const result = await botbabaCall<{ bot: BotbabaBot }>(ctx, '/v1/bots', {
		method: 'POST',
		body: compactBody({
			name: input.name,
			description: input.description,
			channel: input.channel,
			welcomeMessage: input.welcomeMessage,
			greetingMessage: input.greetingMessage,
		}),
	});

	await logEventFromContext(
		ctx,
		'botbaba.bots.create',
		auditPayload(input, ['name']),
		'completed',
	);
	return result.bot;
};

/** Gets a bot by id. */
export const get: BotbabaEndpoints['botsGet'] = async (ctx, input) => {
	const result = await botbabaCall<{ bot: BotbabaBot }>(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}`,
	);

	await logEventFromContext(
		ctx,
		'botbaba.bots.get',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result.bot;
};

/** Lists all bots, optionally filtered by status. */
export const list: BotbabaEndpoints['botsList'] = async (ctx, input) => {
	const result = await botbabaCall<BotbabaEndpointOutputs['botsList']>(
		ctx,
		'/v1/bots',
		{
			query: compactQuery({
				page: input?.page,
				limit: input?.limit,
				status: input?.status,
			}),
		},
	);

	await logEventFromContext(ctx, 'botbaba.bots.list', {}, 'completed');
	return result;
};

/** Updates a bot's settings. */
export const update: BotbabaEndpoints['botsUpdate'] = async (ctx, input) => {
	const result = await botbabaCall<{ bot: BotbabaBot }>(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}`,
		{
			method: 'PUT',
			body: compactBody({
				name: input.name,
				description: input.description,
				welcomeMessage: input.welcomeMessage,
				greetingMessage: input.greetingMessage,
				isActive: input.isActive,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'botbaba.bots.update',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result.bot;
};

/** Permanently deletes a bot. */
export const remove: BotbabaEndpoints['botsDelete'] = async (ctx, input) => {
	await botbabaCall(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'botbaba.bots.delete',
		auditPayload(input, ['botId']),
		'completed',
	);
	return {};
};

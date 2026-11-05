import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactQuery } from './shared';

/**
 * Deletes a file from a bot's storage.
 *
 * Scoped by `x-bot-id`, not `x-workspace-id` — confirmed live: `GET
 * /v1/files/tags` answers 400 "Request is missing some required
 * authentication params" without it, and succeeds with it.
 */
export const remove: BotpressEndpoints['filesDelete'] = async (ctx, input) => {
	await botpressCall(ctx, `/v1/files/${encodeURIComponent(input.id)}`, {
		method: 'DELETE',
		botId: input.botId,
	});

	await logEventFromContext(
		ctx,
		'botpress.files.delete',
		auditPayload(input, ['botId', 'id']),
		'completed',
	);
	return {};
};

/** Lists tags used across a bot's files. */
export const listTags: BotpressEndpoints['filesListTags'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		tags?: string[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/files/tags', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
		}),
		botId: input.botId,
	});

	await logEventFromContext(
		ctx,
		'botpress.files.listTags',
		auditPayload(input, ['botId']),
		'completed',
	);
	return { tags: result.tags ?? [], nextToken: result.meta?.nextToken };
};

/** Lists all values seen for a given file tag. */
export const listTagValues: BotpressEndpoints['filesListTagValues'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		values?: string[];
		meta?: { nextToken?: string };
	}>(ctx, `/v1/files/tags/${encodeURIComponent(input.tag)}/values`, {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
		}),
		botId: input.botId,
	});

	await logEventFromContext(
		ctx,
		'botpress.files.listTagValues',
		auditPayload(input, ['botId', 'tag']),
		'completed',
	);
	return { values: result.values ?? [], nextToken: result.meta?.nextToken };
};

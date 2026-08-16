import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheBot } from './persist';
import {
	botpressCall,
	compactBody,
	compactQuery,
	resolveWorkspaceId,
} from './shared';
import type { BotpressActionRun, BotpressBot, BotpressBotIssue } from './types';

/**
 * Creates a bot in a workspace.
 *
 * No workspace id in the path (confirmed live: `POST /v1/admin/bots` answers
 * 400 without `x-workspace-id`), so the acting workspace is resolved and
 * required here.
 */
export const create: BotpressEndpoints['botsCreate'] = async (ctx, input) => {
	const workspaceId = await resolveWorkspaceId(ctx);

	const result = await botpressCall<{ bot: BotpressBot }>(
		ctx,
		'/v1/admin/bots',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				description: input.description,
				tags: input.tags,
				dev: input.dev,
				code: input.code,
				url: input.url,
				states: input.states,
				events: input.events,
				recurringEvents: input.recurringEvents,
				actions: input.actions,
				configuration: input.configuration,
				user: input.user,
				conversation: input.conversation,
				message: input.message,
				subscriptions: input.subscriptions,
				maxExecutionTime: input.maxExecutionTime,
				medias: input.medias,
				secrets: input.secrets,
				type: input.type,
				moduleFormat: input.moduleFormat,
			}),
			workspaceId,
		},
	);

	await cacheBot(ctx.db?.bots, result.bot);

	await logEventFromContext(
		ctx,
		'botpress.bots.create',
		auditPayload(input, ['name']),
		'completed',
	);
	return result.bot;
};

/**
 * Updates a bot's configuration, tags or lifecycle flags.
 *
 * Unlike `bots.create`, the target bot is identified by `id` in the path, the
 * same way workspace-by-id updates need no ambient `x-workspace-id` header
 * (confirmed live for the workspace case) — not independently confirmed live
 * for this specific route since it is a mutating call, so this is inferred
 * from that pattern rather than directly tested.
 */
export const update: BotpressEndpoints['botsUpdate'] = async (ctx, input) => {
	const result = await botpressCall<{ bot: BotpressBot }>(
		ctx,
		`/v1/admin/bots/${encodeURIComponent(input.id)}`,
		{
			method: 'PUT',
			body: compactBody({
				name: input.name,
				description: input.description,
				tags: input.tags,
				blocked: input.blocked,
				alwaysAlive: input.alwaysAlive,
				maxExecutionTime: input.maxExecutionTime,
				url: input.url,
				authentication: input.authentication,
				configuration: input.configuration,
				user: input.user,
				message: input.message,
				conversation: input.conversation,
				events: input.events,
				actions: input.actions,
				states: input.states,
				recurringEvents: input.recurringEvents,
				integrations: input.integrations,
				plugins: input.plugins,
				subscriptions: input.subscriptions,
				code: input.code,
				medias: input.medias,
				secrets: input.secrets,
				layers: input.layers,
				type: input.type,
				moduleFormat: input.moduleFormat,
			}),
		},
	);

	await cacheBot(ctx.db?.bots, result.bot);

	await logEventFromContext(
		ctx,
		'botpress.bots.update',
		auditPayload(input, ['id']),
		'completed',
	);
	return result.bot;
};

/** Lists action-execution history for a bot's integration instances. */
export const listActionRuns: BotpressEndpoints['botsListActionRuns'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		data?: BotpressActionRun[];
		meta?: { nextToken?: string };
	}>(ctx, `/v1/admin/bots/${encodeURIComponent(input.id)}/action-runs`, {
		method: 'GET',
		query: compactQuery({
			integrationName: input.integrationName,
			timestampFrom: input.timestampFrom,
			timestampUntil: input.timestampUntil,
			nextToken: input.nextToken,
			pageSize: input.pageSize,
		}),
	});

	await logEventFromContext(
		ctx,
		'botpress.bots.listActionRuns',
		auditPayload(input, ['id']),
		'completed',
	);
	return { data: result.data ?? [], nextToken: result.meta?.nextToken };
};

/** Lists configuration and runtime issues detected for a bot. */
export const listIssues: BotpressEndpoints['botsListIssues'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		issues?: BotpressBotIssue[];
		meta?: { nextToken?: string };
	}>(ctx, `/v1/admin/bots/${encodeURIComponent(input.id)}/issues`, {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
		}),
	});

	await logEventFromContext(
		ctx,
		'botpress.bots.listIssues',
		auditPayload(input, ['id']),
		'completed',
	);
	return { issues: result.issues ?? [], nextToken: result.meta?.nextToken };
};

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { callApifyMcpTool } from '../client';
import type { ApifyMcpContext } from '../index';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readEntityId(item: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

// `unknown` because Apify MCP response shape varies by tool and Actor.
async function cacheActors(ctx: ApifyMcpContext, response: unknown) {
	if (!ctx.db.actors?.upsertByEntityId) return;

	const items: Record<string, unknown>[] = [];
	if (Array.isArray(response)) {
		items.push(...response.filter(isRecord));
	} else if (isRecord(response)) {
		if (Array.isArray(response.items)) {
			items.push(...response.items.filter(isRecord));
		} else if (Array.isArray(response.actors)) {
			items.push(...response.actors.filter(isRecord));
		} else {
			items.push(response);
		}
	}

	for (const item of items) {
		const entityId =
			readEntityId(item, ['id', 'actorId', 'name', 'username']) ??
			(typeof item.name === 'string' && typeof item.username === 'string'
				? `${item.username}/${item.name}`
				: undefined);
		if (!entityId) continue;
		try {
			await ctx.db.actors.upsertByEntityId(entityId, item);
		} catch (error) {
			console.warn('[apify_mcp] Failed to cache actor:', error);
		}
	}
}

// `unknown` because run metadata shape varies by Actor and run state.
async function cacheActorRun(ctx: ApifyMcpContext, response: unknown) {
	if (!ctx.db.actorRuns?.upsertByEntityId || !isRecord(response)) return;

	const entityId = readEntityId(response, ['id', 'runId', 'run_id']);
	if (!entityId) return;

	try {
		await ctx.db.actorRuns.upsertByEntityId(entityId, response);
	} catch (error) {
		console.warn('[apify_mcp] Failed to cache actor run:', error);
	}
}

// `unknown` because dataset item shape varies by Actor output schema.
async function cacheActorOutput(
	ctx: ApifyMcpContext,
	datasetId: string,
	response: unknown,
) {
	if (!ctx.db.actorOutputs?.upsertByEntityId) return;

	try {
		await ctx.db.actorOutputs.upsertByEntityId(datasetId, {
			datasetId,
			output: response,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('[apify_mcp] Failed to cache actor output:', error);
	}
}

export async function executeApifyMcpTool<T>(
	ctx: ApifyMcpContext,
	eventName: string,
	toolName: string,
	args: Record<string, unknown>,
	options: {
		cache?: 'actors' | 'actorRun' | 'actorOutput';
		datasetId?: string;
		requireAuth?: boolean;
	},
): Promise<T> {
	let status: 'completed' | 'failed' = 'completed';
	try {
		if (options.requireAuth && !ctx.key) {
			throw new AuthMissingError('apify_mcp', 'api_key');
		}

		const response = await callApifyMcpTool<T>(
			toolName,
			args,
			ctx.key || undefined,
		);

		if (options.cache === 'actors') {
			await cacheActors(ctx, response);
		} else if (options.cache === 'actorRun') {
			await cacheActorRun(ctx, response);
		} else if (options.cache === 'actorOutput' && options.datasetId) {
			await cacheActorOutput(ctx, options.datasetId, response);
		}

		return response;
	} catch (error) {
		status = 'failed';
		throw error;
	} finally {
		await logEventFromContext(ctx, eventName, { tool: toolName }, status);
	}
}

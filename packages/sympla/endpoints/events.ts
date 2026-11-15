import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeSymplaRequest } from '../client';
import type { SymplaContext } from '../context';
import { SymplaEventEntity } from '../schema/database';
import type { ListEventsInput, ListEventsResponse } from './types';
import { ListEventsInputSchema, ListEventsResponseSchema } from './types';

export const listEvents: CorsairEndpoint<
	SymplaContext,
	ListEventsInput,
	ListEventsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('sympla', 'api_key');
	}

	const parsed = ListEventsInputSchema.parse(input ?? {});
	const body = await makeSymplaRequest<unknown>(ctx.key, {
		page: parsed.page,
		page_size: parsed.page_size,
		published: parsed.published,
		from: parsed.from,
		to: parsed.to,
		field_sort: parsed.field_sort,
		sort: parsed.sort,
	});
	const result = ListEventsResponseSchema.parse(body);
	await storeEvents(ctx, result.data);
	await logEventFromContext(
		ctx,
		'sympla.events.list',
		{ page: parsed.page ?? 1 },
		'completed',
	);
	return result;
};

function eventRow(item: unknown): SymplaEventEntity | undefined {
	if (!item || typeof item !== 'object') return undefined;
	const record = item as { id?: unknown; name?: unknown };
	if (typeof record.id !== 'string' && typeof record.id !== 'number') {
		return undefined;
	}
	const parsed = SymplaEventEntity.safeParse({
		id: String(record.id),
		name: typeof record.name === 'string' ? record.name : undefined,
	});
	return parsed.success ? parsed.data : undefined;
}

async function storeEvents(
	ctx: SymplaContext,
	events: unknown[],
): Promise<void> {
	if (!ctx.db?.events) return;
	for (const item of events) {
		const row = eventRow(item);
		if (!row) continue;
		try {
			await ctx.db.events.upsertByEntityId(row.id, row);
		} catch {
			console.warn('Failed to save Sympla event');
		}
	}
}

export const Events = { list: listEvents };

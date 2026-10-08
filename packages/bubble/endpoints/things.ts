import { logEventFromContext } from 'corsair/core';
import { BUBBLE_BULK_TIMEOUT_MS } from '../client';
import type { BubbleEndpoints } from '../index';
import { BubbleThingEntity } from '../schema/database';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bubbleCall, compact, objPath, thingPath } from './shared';
import type { BubbleEndpointOutputs } from './types';

const LABEL = 'thing';

/** Retrieves a single thing by ID. */
export const get: BubbleEndpoints['thingsGet'] = async (ctx, input) => {
	const envelope = await bubbleCall<{
		response: BubbleEndpointOutputs['thingsGet'];
	}>(ctx, thingPath(input.typeName, input.thingId));

	const thing = envelope?.response;

	await cacheEntity(ctx.db.things, BubbleThingEntity, thing, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bubble.things.get',
		auditPayload(input, ['typeName', 'thingId']),
		'completed',
	);
	return thing;
};

/** Searches for things of a data type, with optional constraints and pagination. */
export const list: BubbleEndpoints['thingsList'] = async (ctx, input) => {
	const result = await bubbleCall<BubbleEndpointOutputs['thingsList']>(
		ctx,
		objPath(input.typeName),
		{
			query: compact({
				cursor: input.cursor,
				limit: input.limit,
				constraints: input.constraints
					? JSON.stringify(input.constraints)
					: undefined,
				sort_field: input.sortField,
				descending: input.descending,
				exclude_remaining: input.excludeRemaining,
				additional_sort_fields: input.additionalSortFields
					? JSON.stringify(
							input.additionalSortFields.map((field) =>
								compact({
									sort_field: field.sortField,
									descending: field.descending,
								}),
							),
						)
					: undefined,
			}),
		},
	);

	const records = result?.response?.results as unknown;
	const results = Array.isArray(records) ? records : [];
	await cacheEntities(ctx.db.things, BubbleThingEntity, results, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bubble.things.list',
		{
			returned: countOf(results),
			...auditPayload(input, ['typeName']),
		},
		'completed',
	);
	return result;
};

/** Creates a single thing. */
export const create: BubbleEndpoints['thingsCreate'] = async (ctx, input) => {
	const result = await bubbleCall<BubbleEndpointOutputs['thingsCreate']>(
		ctx,
		objPath(input.typeName),
		{
			method: 'POST',
			body: input.fields,
		},
	);

	await logEventFromContext(
		ctx,
		'bubble.things.create',
		{ id: typeof result?.id === 'string' ? result.id : undefined },
		'completed',
	);
	return result;
};

/**
 * Creates up to 1,000 things in one `text/plain` request (one JSON line per
 * record). Bubble may accept some records and reject others; each line is
 * parsed and returned individually. Allow a longer timeout than the shared
 * 20s default since Bubble permits bulk creates to run up to 4 minutes.
 */
export const bulkCreate: BubbleEndpoints['thingsBulkCreate'] = async (
	ctx,
	input,
) => {
	const body = input.records.map((record) => JSON.stringify(record)).join('\n');

	const raw = await bubbleCall<string>(ctx, `${objPath(input.typeName)}/bulk`, {
		method: 'POST',
		body,
		mediaType: 'text/plain',
		timeout: BUBBLE_BULK_TIMEOUT_MS,
	});

	const items = raw
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line !== '')
		.map((line) => {
			try {
				return JSON.parse(line) as {
					status: string;
					id?: string;
					message?: string;
				};
			} catch {
				return { status: 'error', message: 'Could not parse response line' };
			}
		});

	await logEventFromContext(
		ctx,
		'bubble.things.bulkCreate',
		{
			typeName: input.typeName,
			attempted: countOf(input.records),
			completed: countOf(items),
		},
		'completed',
	);
	return { count: items.length, items };
};

/** Patches selected fields of an existing thing (other fields keep their values). */
export const update: BubbleEndpoints['thingsUpdate'] = async (ctx, input) => {
	await bubbleCall(ctx, thingPath(input.typeName, input.thingId), {
		method: 'PATCH',
		body: input.fields,
	});

	// The response carries no field values, so the cached snapshot (if any)
	// is now stale - drop it rather than trust a partial rewrite.
	await evictEntity(ctx.db.things, input.thingId, LABEL);
	await logEventFromContext(
		ctx,
		'bubble.things.update',
		auditPayload(input, ['typeName', 'thingId']),
		'completed',
	);
};

/** Overwrites every editable field of an existing thing. */
export const replace: BubbleEndpoints['thingsReplace'] = async (ctx, input) => {
	await bubbleCall(ctx, thingPath(input.typeName, input.thingId), {
		method: 'PUT',
		body: input.fields,
	});

	await evictEntity(ctx.db.things, input.thingId, LABEL);
	await logEventFromContext(
		ctx,
		'bubble.things.replace',
		auditPayload(input, ['typeName', 'thingId']),
		'completed',
	);
};

/** Permanently deletes a thing. */
export const remove: BubbleEndpoints['thingsDelete'] = async (ctx, input) => {
	await bubbleCall(ctx, thingPath(input.typeName, input.thingId), {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.things, input.thingId, LABEL);
	await logEventFromContext(
		ctx,
		'bubble.things.delete',
		auditPayload(input, ['typeName', 'thingId']),
		'completed',
	);
};

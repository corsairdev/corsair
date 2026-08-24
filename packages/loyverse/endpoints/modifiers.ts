import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseModifierEntity } from '../schema/database';
import { auditPayload, countOf } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'modifier';

/** Lists modifiers with their options nested inline. */
export const list: LoyverseEndpoints['modifiersList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['modifiersList']>(
		ctx,
		'modifiers',
		{ query: listQuery(input, { modifier_ids: csv(input.modifier_ids) }) },
	);

	await cacheEntities(
		ctx.db.modifiers,
		LoyverseModifierEntity,
		result.modifiers,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.modifiers.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one modifier by id. */
export const get: LoyverseEndpoints['modifiersGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['modifiersGet']>(
		ctx,
		`modifiers/${input.modifier_id}`,
	);

	await cacheEntity(ctx.db.modifiers, LoyverseModifierEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.modifiers.get',
		auditPayload(input, ['modifier_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a modifier.
 *
 * The options are replaced wholesale by what is sent, so an update has to
 * restate the options it wants to keep - an option missing from the array is
 * removed.
 */
export const upsert: LoyverseEndpoints['modifiersUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['modifiersUpsert']>(
		ctx,
		'modifiers',
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				name: input.name,
				position: input.position,
				stores: input.stores,
				modifier_options: input.modifier_options,
			}),
		},
	);

	await cacheEntity(ctx.db.modifiers, LoyverseModifierEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.modifiers.upsert',
		// Option names are caller-authored, so the count is logged rather than
		// the options themselves.
		{
			modifier_id: result.id,
			created: input.id === undefined,
			option_count: countOf(input.modifier_options),
		},
		'completed',
	);
	return result;
};

/** Deletes a modifier and drops it from the mirror. */
export const remove: LoyverseEndpoints['modifiersDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['modifiersDelete']>(
		ctx,
		`modifiers/${input.modifier_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.modifiers, input.modifier_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.modifiers.delete',
		auditPayload(input, ['modifier_id']),
		'completed',
	);
	return result;
};

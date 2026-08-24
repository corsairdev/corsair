import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseTaxEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'tax';

/** Lists taxes. */
export const list: LoyverseEndpoints['taxesList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['taxesList']>(
		ctx,
		'taxes',
		{ query: listQuery(input, { tax_ids: csv(input.tax_ids) }) },
	);

	await cacheEntities(ctx.db.taxes, LoyverseTaxEntity, result.taxes, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.taxes.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one tax by id. */
export const get: LoyverseEndpoints['taxesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['taxesGet']>(
		ctx,
		`taxes/${input.tax_id}`,
	);

	await cacheEntity(ctx.db.taxes, LoyverseTaxEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'loyverse.taxes.get',
		auditPayload(input, ['tax_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a tax.
 *
 * `type` decides whether the rate is folded into the displayed price
 * (`INCLUDED`) or added at the till (`ADDED`), so it is required rather than
 * defaulted - guessing would quietly change what customers are charged.
 */
export const upsert: LoyverseEndpoints['taxesUpsert'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['taxesUpsert']>(
		ctx,
		'taxes',
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				name: input.name,
				type: input.type,
				rate: input.rate,
				stores: input.stores,
			}),
		},
	);

	await cacheEntity(ctx.db.taxes, LoyverseTaxEntity, result, { label: LABEL });

	await logEventFromContext(
		ctx,
		'loyverse.taxes.upsert',
		{
			tax_id: result.id,
			type: input.type,
			rate: input.rate,
			created: input.id === undefined,
		},
		'completed',
	);
	return result;
};

/** Deletes a tax and drops it from the mirror. */
export const remove: LoyverseEndpoints['taxesDelete'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['taxesDelete']>(
		ctx,
		`taxes/${input.tax_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.taxes, input.tax_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.taxes.delete',
		auditPayload(input, ['tax_id']),
		'completed',
	);
	return result;
};

import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestCompanyEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity } from './persist';
import { compactBody, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

/**
 * Company settings are a per-account singleton with no `id`, so the cache is
 * keyed on `full_domain` — the one field that identifies the account and does
 * not change.
 */
const companyEntityId = (parsed: { full_domain?: string | null }) =>
	parsed.full_domain ?? undefined;

/** Reads the account's settings: features enabled, locale, week start, clock. */
export const get: HarvestEndpoints['companyGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['companyGet']>(
		ctx,
		'company',
	);

	await cacheEntity(ctx.db.company, HarvestCompanyEntity, result, {
		label: 'company',
		entityId: companyEntityId,
	});

	await logEventFromContext(
		ctx,
		'harvest.company.get',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/**
 * Updates the two writable company settings.
 *
 * Everything else on the company object — name, currency, date and time
 * formats, colour scheme — is read-only over the API and can only be changed in
 * the Harvest web interface, so those fields are not accepted here rather than
 * being sent and silently ignored.
 */
export const update: HarvestEndpoints['companyUpdate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['companyUpdate']>(
		ctx,
		'company',
		{
			method: 'PATCH',
			body: compactBody({
				wants_timestamp_timers: input.wants_timestamp_timers,
				weekly_capacity: input.weekly_capacity,
			}),
		},
	);

	await cacheEntity(ctx.db.company, HarvestCompanyEntity, result, {
		label: 'company',
		entityId: companyEntityId,
	});

	await logEventFromContext(
		ctx,
		'harvest.company.update',
		auditPayload(input, ['wants_timestamp_timers', 'weekly_capacity']),
		'completed',
	);
	return result;
};

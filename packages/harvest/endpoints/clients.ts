import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestClientEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'client';

/** Lists clients, mirroring each page into the local cache. */
export const list: HarvestEndpoints['clientsList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['clientsList']>(
		ctx,
		'clients',
		{
			query: compactQuery({
				is_active: input.is_active,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.clients, HarvestClientEntity, result.clients, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.clients.list',
		auditPayload(input, ['is_active', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/** Retrieves one client by id. */
export const get: HarvestEndpoints['clientsGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['clientsGet']>(
		ctx,
		`clients/${input.client_id}`,
	);

	await cacheEntity(ctx.db.clients, HarvestClientEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.clients.get',
		auditPayload(input, ['client_id']),
		'completed',
	);
	return result;
};

/** Creates a client. */
export const create: HarvestEndpoints['clientsCreate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['clientsCreate']>(
		ctx,
		'clients',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				is_active: input.is_active,
				address: input.address,
				currency: input.currency,
			}),
		},
	);

	await cacheEntity(ctx.db.clients, HarvestClientEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.clients.create',
		// The client's name and address are caller-authored, so only the id
		// Harvest assigned is recorded.
		{ client_id: result.id },
		'completed',
	);
	return result;
};

/**
 * Updates a client.
 *
 * Only the supplied fields are sent: Harvest treats an omitted field as "leave
 * unchanged" and an explicit `null` as "clear", so unset inputs must not be
 * serialised.
 */
export const update: HarvestEndpoints['clientsUpdate'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['clientsUpdate']>(
		ctx,
		`clients/${input.client_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				name: input.name,
				is_active: input.is_active,
				address: input.address,
				currency: input.currency,
			}),
		},
	);

	await cacheEntity(ctx.db.clients, HarvestClientEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.clients.update',
		auditPayload(input, ['client_id']),
		'completed',
	);
	return result;
};

/**
 * Deletes a client.
 *
 * Harvest refuses with 422 when the client still has projects, invoices or
 * estimates attached; that is surfaced rather than worked around.
 */
export const remove: HarvestEndpoints['clientsDelete'] = async (ctx, input) => {
	await harvestCall<void>(ctx, `clients/${input.client_id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.clients, input.client_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.clients.delete',
		auditPayload(input, ['client_id']),
		'completed',
	);
	return { success: true, id: input.client_id };
};

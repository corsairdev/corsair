import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyversePosDeviceEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'pos device';

/** Lists POS devices. */
export const list: LoyverseEndpoints['posDevicesList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['posDevicesList']>(
		ctx,
		'pos_devices',
		{ query: listQuery(input, { store_id: input.store_id }) },
	);

	await cacheEntities(
		ctx.db.posDevices,
		LoyversePosDeviceEntity,
		result.pos_devices,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.posDevices.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one POS device by id. */
export const get: LoyverseEndpoints['posDevicesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['posDevicesGet']>(
		ctx,
		`pos_devices/${input.pos_device_id}`,
	);

	await cacheEntity(ctx.db.posDevices, LoyversePosDeviceEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.posDevices.get',
		auditPayload(input, ['pos_device_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a POS device.
 *
 * `activated` is read-only: it reports whether a physical till has claimed the
 * device, so it is not accepted here rather than being sent and ignored.
 */
export const upsert: LoyverseEndpoints['posDevicesUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['posDevicesUpsert']
	>(ctx, 'pos_devices', {
		method: 'POST',
		body: compactBody({
			id: input.id,
			name: input.name,
			store_id: input.store_id,
		}),
	});

	await cacheEntity(ctx.db.posDevices, LoyversePosDeviceEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.posDevices.upsert',
		{
			pos_device_id: result.id,
			store_id: input.store_id,
			created: input.id === undefined,
		},
		'completed',
	);
	return result;
};

/** Deletes a POS device and drops it from the mirror. */
export const remove: LoyverseEndpoints['posDevicesDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['posDevicesDelete']
	>(ctx, `pos_devices/${input.pos_device_id}`, { method: 'DELETE' });

	await evictEntity(ctx.db.posDevices, input.pos_device_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.posDevices.delete',
		auditPayload(input, ['pos_device_id']),
		'completed',
	);
	return result;
};

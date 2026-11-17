import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { SensiboPodEntity } from '../schema/database';
import { callSensibo, requireKey } from './shared';
import type {
	GetDeviceInput,
	GetDeviceResponse,
	ListDevicesInput,
	ListDevicesResponse,
	SensiboPod,
} from './types';
import {
	GetDeviceInputSchema,
	GetDeviceResponseSchema,
	ListDevicesInputSchema,
	ListDevicesResponseSchema,
} from './types';

export const listDevices: CorsairEndpoint<
	SensiboContext,
	ListDevicesInput,
	ListDevicesResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListDevicesInputSchema.parse(input ?? {});
	const result = await callSensibo(
		ctx,
		'devices.list',
		{ path: '/users/me/pods', query: { fields: parsed.fields } },
		ListDevicesResponseSchema,
	);
	await storePods(ctx, result.result);
	return result;
};

export const getDevice: CorsairEndpoint<
	SensiboContext,
	GetDeviceInput,
	GetDeviceResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetDeviceInputSchema.parse(input);
	const result = await callSensibo(
		ctx,
		'devices.get',
		{
			path: `/pods/${pathPart(parsed.deviceId)}`,
			query: { fields: parsed.fields },
		},
		GetDeviceResponseSchema,
		{ deviceId: parsed.deviceId },
	);
	await storePods(ctx, [{ id: parsed.deviceId, ...result.result }]);
	return result;
};

/**
 * Saves each pod that has an id. A response made with a narrow `fields` list
 * may leave the room out, so a missing room keeps the stored room name.
 */
async function storePods(
	ctx: SensiboContext,
	pods: SensiboPod[],
): Promise<void> {
	if (!ctx.db?.pods) return;
	for (const pod of pods) {
		if (typeof pod.id !== 'string' || pod.id.length === 0) continue;
		try {
			const existing = await ctx.db.pods.findByEntityId(pod.id);
			const roomName =
				pod.room === undefined
					? existing?.data.roomName
					: (pod.room?.name ?? undefined);
			const row = SensiboPodEntity.safeParse({
				...existing?.data,
				id: pod.id,
				roomName,
			});
			if (!row.success) continue;
			await ctx.db.pods.upsertByEntityId(pod.id, row.data);
		} catch {
			console.warn('Failed to save Sensibo pod');
		}
	}
}

export const Devices = { list: listDevices, get: getDevice };

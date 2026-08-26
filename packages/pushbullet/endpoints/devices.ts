import { logEventFromContext } from 'corsair/core';
import { makePushbulletRequest } from '../client';
import type { PushbulletEndpoints } from '../index';
import type { PushbulletEndpointOutputs } from './types';

async function cacheDevice(
	ctx: Parameters<PushbulletEndpoints['devicesRegister']>[0],
	device: PushbulletEndpointOutputs['devicesRegister'],
) {
	if (!device.iden || !ctx.db.devices) return;
	try {
		await ctx.db.devices.upsertByEntityId(device.iden, {
			id: device.iden,
			nickname: device.nickname,
			manufacturer: device.manufacturer,
			model: device.model,
			icon: device.icon,
			active: device.active,
			has_sms: device.has_sms,
			created: device.created,
		});
	} catch (error) {
		console.warn('Failed to cache device:', error);
	}
}

export const register: PushbulletEndpoints['devicesRegister'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['devicesRegister']
	>('devices', ctx.key, { method: 'POST', body: input });

	await cacheDevice(ctx, result);
	await logEventFromContext(
		ctx,
		'pushbullet.devices.register',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: PushbulletEndpoints['devicesList'] = async (ctx, input) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['devicesList']
	>('devices', ctx.key, { method: 'GET', query: input });

	await logEventFromContext(
		ctx,
		'pushbullet.devices.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: PushbulletEndpoints['devicesUpdate'] = async (
	ctx,
	input,
) => {
	const { iden, ...body } = input;
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['devicesUpdate']
	>(`devices/${encodeURIComponent(iden)}`, ctx.key, { method: 'POST', body });

	await cacheDevice(ctx, result);
	await logEventFromContext(
		ctx,
		'pushbullet.devices.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: PushbulletEndpoints['devicesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makePushbulletRequest<
		PushbulletEndpointOutputs['devicesDelete']
	>(`devices/${encodeURIComponent(input.iden)}`, ctx.key, { method: 'DELETE' });

	if (ctx.db.devices) {
		try {
			await ctx.db.devices.deleteByEntityId(input.iden);
		} catch (error) {
			console.warn('Failed to evict deleted device from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pushbullet.devices.delete',
		{ ...input },
		'completed',
	);
	return result;
};

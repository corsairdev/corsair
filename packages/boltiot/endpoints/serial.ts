import { logEventFromContext } from 'corsair/core';
import type { BoltIotEndpoints } from '..';
import { makeBoltIotRequest } from '../client';

export const read: BoltIotEndpoints['serialRead'] = async (ctx, input) => {
	const res = await makeBoltIotRequest('serialRead', ctx.key, {
		deviceName: input.deviceName,
		till: input.till,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.serial.read',
		{ ...input },
		'completed',
	);
	return response;
};

export const write: BoltIotEndpoints['serialWrite'] = async (ctx, input) => {
	const res = await makeBoltIotRequest('serialWrite', ctx.key, {
		deviceName: input.deviceName,
		data: input.data,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.serial.write',
		{ ...input },
		'completed',
	);
	return response;
};

export const writeRead: BoltIotEndpoints['serialWriteRead'] = async (
	ctx,
	input,
) => {
	const res = await makeBoltIotRequest('serialWR', ctx.key, {
		deviceName: input.deviceName,
		data: input.data,
		till: input.till,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.serial.writeRead',
		{ ...input },
		'completed',
	);
	return response;
};

import { logEventFromContext } from 'corsair/core';
import type { BoltIotEndpoints } from '..';
import { BoltIotAPIError, makeBoltIotRequest } from '../client';

function parseAnalogReading(raw: string): number {
	if (!/^\d+$/.test(raw)) {
		throw new BoltIotAPIError(`Invalid analog reading: ${raw}`);
	}
	const value = Number(raw);
	if (value < 0 || value > 1023) {
		throw new BoltIotAPIError(`Analog reading out of range: ${raw}`);
	}
	return value;
}

export const checkStatus: BoltIotEndpoints['checkDeviceStatus'] = async (
	ctx,
	input,
) => {
	const res = await makeBoltIotRequest('isOnline', ctx.key, {
		deviceName: input.deviceName,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		...(res.time ? { time: res.time } : {}),
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.device.checkStatus',
		{ ...input },
		'completed',
	);
	return response;
};

export const analogRead: BoltIotEndpoints['analogRead'] = async (
	ctx,
	input,
) => {
	const pin = input.pin ?? 'A0';
	const res = await makeBoltIotRequest('analogRead', ctx.key, {
		deviceName: input.deviceName,
		pin,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: parseAnalogReading(res.value),
		rawValue: res.value,
		pin,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.device.analogRead',
		{ ...input },
		'completed',
	);
	return response;
};

export const digitalWrite: BoltIotEndpoints['digitalWrite'] = async (
	ctx,
	input,
) => {
	const stateVal =
		input.state === 'HIGH' || input.state === '1' ? 'HIGH' : 'LOW';
	const res = await makeBoltIotRequest('digitalWrite', ctx.key, {
		deviceName: input.deviceName,
		pin: input.pin,
		state: stateVal,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		pin: input.pin,
		state: input.state,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.device.digitalWrite',
		{ ...input },
		'completed',
	);
	return response;
};

export const digitalRead: BoltIotEndpoints['digitalRead'] = async (
	ctx,
	input,
) => {
	const res = await makeBoltIotRequest('digitalRead', ctx.key, {
		deviceName: input.deviceName,
		pin: input.pin,
	});

	const response = {
		success: res.success === '1' || res.success === 1,
		value: res.value,
		pin: input.pin,
		deviceName: input.deviceName,
	};

	await logEventFromContext(
		ctx,
		'boltiot.device.digitalRead',
		{ ...input },
		'completed',
	);
	return response;
};

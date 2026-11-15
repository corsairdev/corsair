import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { SensiboContext } from '..';
import { makeSensiboRequest } from '../client';
import type { ListDevicesInput, ListDevicesResponse } from './types';
import { ListDevicesInputSchema, ListDevicesResponseSchema } from './types';

export const listDevices: CorsairEndpoint<
	SensiboContext,
	ListDevicesInput,
	ListDevicesResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('sensibo', 'api_key');
	}

	const parsed = ListDevicesInputSchema.parse(input ?? {});
	const body = await makeSensiboRequest<unknown>(ctx.key, {
		fields: parsed.fields,
	});
	const result = ListDevicesResponseSchema.parse(body);
	await logEventFromContext(ctx, 'sensibo.devices.list', {}, 'completed');
	return result;
};

export const Devices = { list: listDevices };

import { AuthMissingError } from 'corsair/core';
import type { AmbientWeatherEndpoints } from '..';
import { makeAmbientWeatherRequest, parseAmbientWeatherKey } from '../client';
import { pickAmbientWeatherReadingFields } from '../schema/database';
import type { AmbientWeatherEndpointOutputs } from './types';
import {
	AmbientWeatherDeviceDataResponseSchema,
	AmbientWeatherDeviceListResponseSchema,
} from './types';

function requireAmbientWeatherCredentials(key: string): {
	apiKey: string;
	applicationKey: string;
} {
	const credentials = parseAmbientWeatherKey(key);
	if (!credentials) {
		throw new AuthMissingError('ambientweather', 'api_key');
	}
	return credentials;
}

export const list: AmbientWeatherEndpoints['devicesList'] = async (
	ctx,
	_input,
) => {
	const { apiKey, applicationKey } = requireAmbientWeatherCredentials(ctx.key);

	const response = AmbientWeatherDeviceListResponseSchema.parse(
		await makeAmbientWeatherRequest<
			AmbientWeatherEndpointOutputs['devicesList']
		>('/v1/devices', apiKey, applicationKey),
	);

	if (ctx.db.devices) {
		for (const device of response) {
			try {
				await ctx.db.devices.upsertByEntityId(device.macAddress, {
					macAddress: device.macAddress,
					name: device.info.name,
					location: device.info.location,
					...pickAmbientWeatherReadingFields(device.lastData),
				});
			} catch (error) {
				console.warn('Failed to save Ambient Weather device:', error);
			}
		}
	}

	return response;
};

export const getData: AmbientWeatherEndpoints['devicesGetData'] = async (
	ctx,
	input,
) => {
	const { apiKey, applicationKey } = requireAmbientWeatherCredentials(ctx.key);

	const response = AmbientWeatherDeviceDataResponseSchema.parse(
		await makeAmbientWeatherRequest<
			AmbientWeatherEndpointOutputs['devicesGetData']
		>(
			`/v1/devices/${encodeURIComponent(input.macAddress)}`,
			apiKey,
			applicationKey,
			{
				query: {
					...(input.limit !== undefined ? { limit: input.limit } : {}),
					...(input.endDate !== undefined ? { endDate: input.endDate } : {}),
				},
			},
		),
	);

	if (ctx.db.readings) {
		for (const point of response) {
			try {
				const entityId = `${input.macAddress}:${point.dateutc}`;
				await ctx.db.readings.upsertByEntityId(entityId, {
					macAddress: input.macAddress,
					...pickAmbientWeatherReadingFields(point),
				});
			} catch (error) {
				console.warn('Failed to save Ambient Weather reading:', error);
			}
		}
	}

	return response;
};

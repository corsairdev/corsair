import { AuthMissingError } from 'corsair/core';
import type { AmbientWeatherEndpoints } from '..';
import { makeAmbientWeatherRequest, parseAmbientWeatherKey } from '../client';
import type { AmbientWeatherEndpointOutputs } from './types';

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
	input,
) => {
	const { apiKey, applicationKey } = requireAmbientWeatherCredentials(ctx.key);

	return makeAmbientWeatherRequest<
		AmbientWeatherEndpointOutputs['devicesList']
	>('/v1/devices', apiKey, applicationKey, {
		query: input,
	});
};

export const getData: AmbientWeatherEndpoints['devicesGetData'] = async (
	ctx,
	input,
) => {
	const { apiKey, applicationKey } = requireAmbientWeatherCredentials(ctx.key);

	return makeAmbientWeatherRequest<
		AmbientWeatherEndpointOutputs['devicesGetData']
	>(
		`/v1/devices/${encodeURIComponent(input.macAddress)}`,
		apiKey,
		applicationKey,
		{
			query: {
				limit: input.limit,
				endDate: input.endDate,
			},
		},
	);
};

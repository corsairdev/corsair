import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruContext, DadataruEndpoints } from '../index';
import type { SuggestResponse } from './types';

async function handleGeolocate(
	ctx: DadataruContext,
	input: { lat: number; lon: number; radius_meters?: number; count?: number },
	endpointPath: string,
	eventName: string,
): Promise<SuggestResponse> {
	const response = await makeDadataruRequest<SuggestResponse>(
		endpointPath,
		ctx.key,
		{
			method: 'POST',
			body: {
				lat: input.lat,
				lon: input.lon,
				radius_meters: input.radius_meters,
				count: input.count ?? 5,
			},
			apiType: 'suggest',
		},
	);

	await logEventFromContext(
		ctx,
		eventName,
		{ lat: input.lat, lon: input.lon },
		'completed',
	);
	return response;
}

export const address: DadataruEndpoints['geolocateAddress'] = (ctx, input) =>
	handleGeolocate(
		ctx,
		input,
		'geolocate/address',
		'dadataru.geolocate.address',
	);

export const postalUnit: DadataruEndpoints['geolocatePostalUnit'] = (
	ctx,
	input,
) =>
	handleGeolocate(
		ctx,
		input,
		'geolocate/postal_unit',
		'dadataru.geolocate.postalUnit',
	);

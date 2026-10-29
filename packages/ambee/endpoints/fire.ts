import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest } from '../client';
import type { AmbeeEndpoints } from '../index';
import type { FireResponse, FireRiskResponse } from './types';
import { FireResponseSchema, FireRiskResponseSchema } from './types';

/**
 * Wildfires detected or reported near a coordinate pair over the last 7 days.
 *
 * API: GET api.ambeedata.com/fire/latest/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/fire
 */
export const getLatestByLatLng: AmbeeEndpoints['fireGetLatestByLatLng'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<FireResponse>(
			'fire/latest/by-lat-lng',
			ctx.key,
			{ query: { lat: input.lat, lng: input.lng, type: input.type } },
		);

		const response = FireResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.fire.getLatestByLatLng',
			{ lat: input.lat, lng: input.lng, type: input.type },
			'completed',
		);

		return response;
	};

/**
 * Wildfires detected or reported near a named place over the last 7 days.
 *
 * API: GET api.ambeedata.com/fire/latest/by-place
 * Docs: https://docs.ambeedata.com/apis/fire
 */
export const getLatestByPlace: AmbeeEndpoints['fireGetLatestByPlace'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<FireResponse>(
		'fire/latest/by-place',
		ctx.key,
		{ query: { place: input.place, type: input.type } },
	);

	const response = FireResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.fire.getLatestByPlace',
		{ place: input.place, type: input.type },
		'completed',
	);

	return response;
};

/**
 * Wildfire risk forecast for a coordinate pair (up to 4 weeks ahead, North
 * America coverage).
 *
 * API: GET api.ambeedata.com/fire/risk/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/fire
 */
export const getRiskByLatLng: AmbeeEndpoints['fireGetRiskByLatLng'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<FireRiskResponse>(
		'fire/risk/by-lat-lng',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng } },
	);

	const response = FireRiskResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.fire.getRiskByLatLng',
		{ lat: input.lat, lng: input.lng },
		'completed',
	);

	return response;
};

/**
 * Wildfire risk forecast for a named place (up to 4 weeks ahead, North
 * America coverage).
 *
 * API: GET api.ambeedata.com/fire/risk/by-place
 * Docs: https://docs.ambeedata.com/apis/fire
 */
export const getRiskByPlace: AmbeeEndpoints['fireGetRiskByPlace'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<FireRiskResponse>(
		'fire/risk/by-place',
		ctx.key,
		{ query: { place: input.place } },
	);

	const response = FireRiskResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.fire.getRiskByPlace',
		{ place: input.place },
		'completed',
	);

	return response;
};

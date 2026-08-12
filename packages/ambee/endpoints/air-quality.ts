import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest, toAmbeeTimestamp } from '../client';
import type { AmbeeEndpoints } from '../index';
import { persistAirQualityStations } from './persist';
import type {
	AirQualitySeriesResponse,
	AirQualityStationsResponse,
} from './types';
import {
	AirQualitySeriesResponseSchema,
	AirQualityStationsResponseSchema,
} from './types';

/**
 * Latest air quality (AQI + pollutant concentrations) for a coordinate pair.
 *
 * API: GET api.ambeedata.com/latest/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getLatestByLatLng: AmbeeEndpoints['airQualityGetLatestByLatLng'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<AirQualityStationsResponse>(
			'latest/by-lat-lng',
			ctx.key,
			{ query: { lat: input.lat, lng: input.lng } },
		);

		// Ambee's payload isn't guaranteed to match our types at compile time —
		// validate before trusting or persisting it.
		const response = AirQualityStationsResponseSchema.parse(raw);

		await persistAirQualityStations(ctx, response.stations);
		await logEventFromContext(
			ctx,
			'ambee.airQuality.getLatestByLatLng',
			{ lat: input.lat, lng: input.lng },
			'completed',
		);

		return response;
	};

/**
 * Latest air quality for the monitoring stations in a city.
 *
 * API: GET api.ambeedata.com/latest/by-city
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getLatestByCity: AmbeeEndpoints['airQualityGetLatestByCity'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<AirQualityStationsResponse>(
			'latest/by-city',
			ctx.key,
			{ query: { city: input.city, limit: input.limit } },
		);

		const response = AirQualityStationsResponseSchema.parse(raw);

		await persistAirQualityStations(ctx, response.stations);
		await logEventFromContext(
			ctx,
			'ambee.airQuality.getLatestByCity',
			{ city: input.city, limit: input.limit },
			'completed',
		);

		return response;
	};

/**
 * Latest air quality for a postal code within a country.
 *
 * API: GET api.ambeedata.com/latest/by-postal-code
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getLatestByPostalCode: AmbeeEndpoints['airQualityGetLatestByPostalCode'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<AirQualityStationsResponse>(
			'latest/by-postal-code',
			ctx.key,
			{
				query: {
					postalCode: input.postalCode,
					countryCode: input.countryCode,
				},
			},
		);

		const response = AirQualityStationsResponseSchema.parse(raw);

		await persistAirQualityStations(ctx, response.stations);
		await logEventFromContext(
			ctx,
			'ambee.airQuality.getLatestByPostalCode',
			{ postalCode: input.postalCode, countryCode: input.countryCode },
			'completed',
		);

		return response;
	};

/**
 * Latest air quality for the monitoring stations across a whole country.
 *
 * API: GET api.ambeedata.com/latest/by-country-code
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getLatestByCountryCode: AmbeeEndpoints['airQualityGetLatestByCountryCode'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<AirQualityStationsResponse>(
			'latest/by-country-code',
			ctx.key,
			{ query: { countryCode: input.countryCode, limit: input.limit } },
		);

		const response = AirQualityStationsResponseSchema.parse(raw);

		await persistAirQualityStations(ctx, response.stations);
		await logEventFromContext(
			ctx,
			'ambee.airQuality.getLatestByCountryCode',
			{ countryCode: input.countryCode, limit: input.limit },
			'completed',
		);

		return response;
	};

/**
 * Hourly historical air quality for a coordinate pair (up to 48 hours per
 * request).
 *
 * API: GET api.ambeedata.com/history/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getHistoryByLatLng: AmbeeEndpoints['airQualityGetHistoryByLatLng'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<AirQualitySeriesResponse>(
			'history/by-lat-lng',
			ctx.key,
			{ query: { lat: input.lat, lng: input.lng, from, to } },
		);

		const response = AirQualitySeriesResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.airQuality.getHistoryByLatLng',
			{ lat: input.lat, lng: input.lng, from, to },
			'completed',
		);

		return response;
	};

/**
 * Hourly historical air quality for a postal code.
 *
 * API: GET api.ambeedata.com/history/by-postal-code
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getHistoryByPostalCode: AmbeeEndpoints['airQualityGetHistoryByPostalCode'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<AirQualitySeriesResponse>(
			'history/by-postal-code',
			ctx.key,
			{
				query: {
					postalCode: input.postalCode,
					countryCode: input.countryCode,
					from,
					to,
				},
			},
		);

		const response = AirQualitySeriesResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.airQuality.getHistoryByPostalCode',
			{
				postalCode: input.postalCode,
				countryCode: input.countryCode,
				from,
				to,
			},
			'completed',
		);

		return response;
	};

/**
 * Hourly air-quality forecast for a coordinate pair (next 48 hours).
 *
 * API: GET api.ambeedata.com/forecast/aq/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/air-quality
 */
export const getForecastByLatLng: AmbeeEndpoints['airQualityGetForecastByLatLng'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<AirQualitySeriesResponse>(
			'forecast/aq/by-lat-lng',
			ctx.key,
			{ query: { lat: input.lat, lng: input.lng } },
		);

		const response = AirQualitySeriesResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.airQuality.getForecastByLatLng',
			{ lat: input.lat, lng: input.lng },
			'completed',
		);

		return response;
	};

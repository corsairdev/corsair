import { logEventFromContext } from 'corsair/core';
import type { AmbeeQuery } from '../client';
import { makeAmbeeRequest, toAmbeeTimestamp } from '../client';
import type { AmbeeEndpoints } from '../index';
import type { DisasterResponse } from './types';
import { DisasterResponseSchema } from './types';

/**
 * Natural disasters is the only paginated Ambee product — every endpoint
 * accepts `page` and `limit`, and both default to 1 server-side, so they are
 * forwarded verbatim rather than defaulted here.
 */
function paginationQuery(input: {
	eventType?: string;
	limit?: number;
	page?: number;
}): AmbeeQuery {
	return {
		eventType: input.eventType,
		limit: input.limit,
		page: input.page,
	};
}

/**
 * Latest natural disasters near a coordinate pair.
 *
 * API: GET api.ambeedata.com/disasters/latest/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getLatestByLatLng: AmbeeEndpoints['disastersGetLatestByLatLng'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/latest/by-lat-lng',
			ctx.key,
			{
				query: {
					lat: input.lat,
					lng: input.lng,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getLatestByLatLng',
			{ lat: input.lat, lng: input.lng, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Latest natural disasters in a country.
 *
 * API: GET api.ambeedata.com/disasters/latest/by-country-code
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getLatestByCountryCode: AmbeeEndpoints['disastersGetLatestByCountryCode'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/latest/by-country-code',
			ctx.key,
			{
				query: {
					countryCode: input.countryCode,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getLatestByCountryCode',
			{ countryCode: input.countryCode, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Latest natural disasters on a continent.
 *
 * API: GET api.ambeedata.com/disasters/latest/by-continent
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getLatestByContinent: AmbeeEndpoints['disastersGetLatestByContinent'] =
	async (ctx, input) => {
		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/latest/by-continent',
			ctx.key,
			{
				query: {
					continent: input.continent,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getLatestByContinent',
			{ continent: input.continent, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Historical natural disasters near a coordinate pair.
 *
 * API: GET api.ambeedata.com/disasters/history/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getHistoryByLatLng: AmbeeEndpoints['disastersGetHistoryByLatLng'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/history/by-lat-lng',
			ctx.key,
			{
				query: {
					lat: input.lat,
					lng: input.lng,
					from,
					to,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getHistoryByLatLng',
			{ lat: input.lat, lng: input.lng, from, to, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Historical natural disasters in a country.
 *
 * API: GET api.ambeedata.com/disasters/history/by-country-code
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getHistoryByCountryCode: AmbeeEndpoints['disastersGetHistoryByCountryCode'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/history/by-country-code',
			ctx.key,
			{
				query: {
					countryCode: input.countryCode,
					from,
					to,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getHistoryByCountryCode',
			{ countryCode: input.countryCode, from, to, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Historical natural disasters on a continent.
 *
 * API: GET api.ambeedata.com/disasters/history/by-continent
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getHistoryByContinent: AmbeeEndpoints['disastersGetHistoryByContinent'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/history/by-continent',
			ctx.key,
			{
				query: {
					continent: input.continent,
					from,
					to,
					...paginationQuery(input),
				},
			},
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getHistoryByContinent',
			{ continent: input.continent, from, to, page: input.page },
			'completed',
		);

		return response;
	};

/**
 * Historical natural disasters worldwide over a date range — the only
 * disasters endpoint with no location filter, and the only one where `to` is
 * optional.
 *
 * API: GET api.ambeedata.com/disasters/history
 * Docs: https://docs.ambeedata.com/apis/natural_disasters
 */
export const getHistoryByDateRange: AmbeeEndpoints['disastersGetHistoryByDateRange'] =
	async (ctx, input) => {
		const from = toAmbeeTimestamp(input.from);
		const to = input.to === undefined ? undefined : toAmbeeTimestamp(input.to);

		const raw = await makeAmbeeRequest<DisasterResponse>(
			'disasters/history',
			ctx.key,
			{ query: { from, to, ...paginationQuery(input) } },
		);

		const response = DisasterResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'ambee.disasters.getHistoryByDateRange',
			{ from, to, page: input.page },
			'completed',
		);

		return response;
	};

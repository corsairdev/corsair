import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Timezones, world time, holidays and working days.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Get timezone info by city/state/country or location coordinates
 * (latitude/longitude). Returns the timezone name of the specified input
 * location and the time offset in seconds.
 */
export const timezone: ApiNinjasEndpoints['calendarTimezone'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['calendarTimezone']
	>('timezone', ctx.key, {
		version: 'v1',
		query: {
			timezone: input.timezone,
			lat: input.lat,
			lon: input.lon,
			city: input.city,
			state: input.state,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.calendar.timezone',
		withCount(
			auditPayload(input, ['timezone', 'city', 'state', 'country']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Get the current date and time by city/state/country, location
 * coordinates (latitude/longitude), or timezone.
 */
export const worldTime: ApiNinjasEndpoints['calendarWorldTime'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['calendarWorldTime']
	>('worldtime', ctx.key, {
		version: 'v1',
		query: {
			timezone: input.timezone,
			lat: input.lat,
			lon: input.lon,
			city: input.city,
			state: input.state,
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.calendar.worldTime',
		withCount(
			auditPayload(input, ['timezone', 'city', 'state', 'country']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns a list of holiday entries for a given country and year. Each
 * entry in the response contains the holiday name, date, day of the week,
 * and the type of holiday.
 */
export const holidays: ApiNinjasEndpoints['calendarHolidays'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['calendarHolidays']
	>('holidays', ctx.key, {
		version: 'v2',
		query: {
			country: input.country,
			year: input.year,
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.calendar.holidays',
		withCount(auditPayload(input, ['country', 'year', 'type']), result),
		'completed',
	);
	return result;
};

/** Returns a list of public holidays for a given country and year. */
export const publicHolidays: ApiNinjasEndpoints['calendarPublicHolidays'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['calendarPublicHolidays']
		>('publicholidays', ctx.key, {
			version: 'v1',
			query: {
				country: input.country,
				year: input.year,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.calendar.publicHolidays',
			withCount(auditPayload(input, ['country', 'year']), result),
			'completed',
		);
		return result;
	};

/** Returns whether a given date is a public holiday for a given country. */
export const isPublicHoliday: ApiNinjasEndpoints['calendarIsPublicHoliday'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['calendarIsPublicHoliday']
		>('ispublicholiday', ctx.key, {
			version: 'v1',
			query: {
				country: input.country,
				date: input.date,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.calendar.isPublicHoliday',
			withCount(auditPayload(input, ['country', 'date']), result),
			'completed',
		);
		return result;
	};

/** Returns whether a given date is a working day for a given country. */
export const isWorkingDay: ApiNinjasEndpoints['calendarIsWorkingDay'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['calendarIsWorkingDay']
	>('isworkingday', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			date: input.date,
			weekend: input.weekend,
			public_holidays: input.public_holidays,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.calendar.isWorkingDay',
		withCount(
			auditPayload(input, ['country', 'date', 'weekend', 'public_holidays']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns a list of working days and non-working days for a given country
 * and year/month.
 */
export const workingDays: ApiNinjasEndpoints['calendarWorkingDays'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['calendarWorkingDays']
	>('workingdays', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
			year: input.year,
			month: input.month,
			weekend: input.weekend,
			public_holidays: input.public_holidays,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.calendar.workingDays',
		withCount(
			auditPayload(input, [
				'country',
				'year',
				'month',
				'weekend',
				'public_holidays',
			]),
			result,
		),
		'completed',
	);
	return result;
};

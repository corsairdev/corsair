import { logEventFromContext } from 'corsair/core';
import { makeBartRequest } from '../client';
import type { BartEndpoints } from '../index';
import { BartEndpointInputSchemas, BartEndpointOutputSchemas } from './types';

export const list: BartEndpoints['stationsList'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.stationsList.parse(input);
	const raw = await makeBartRequest<unknown>('stn.aspx', ctx.key, {
		query: {
			cmd: 'stns',
		},
	});

	const response = BartEndpointOutputSchemas.stationsList.parse(raw);

	if (ctx.db.stations && response.stations?.station) {
		const stationsArray = Array.isArray(response.stations.station)
			? response.stations.station
			: [response.stations.station];

		for (const stn of stationsArray) {
			try {
				await ctx.db.stations.upsertByEntityId(stn.abbr, {
					id: stn.abbr,
					name: stn.name,
					abbr: stn.abbr,
					gtfs_latitude: stn.gtfs_latitude,
					gtfs_longitude: stn.gtfs_longitude,
					address: stn.address,
					city: stn.city,
					county: stn.county,
					state: stn.state,
					zipcode: stn.zipcode,
				});
			} catch (error) {
				console.warn('Failed to persist station to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bart.stations.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const info: BartEndpoints['stationsInfo'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.stationsInfo.parse(input);
	const raw = await makeBartRequest<unknown>('stn.aspx', ctx.key, {
		query: {
			cmd: 'stninfo',
			orig: parsedInput.orig,
		},
	});

	const response = BartEndpointOutputSchemas.stationsInfo.parse(raw);

	if (ctx.db.stations) {
		const stnObj = response.stations?.station ?? response.station;
		if (stnObj) {
			const stn = Array.isArray(stnObj) ? stnObj[0] : stnObj;
			if (stn) {
				try {
					await ctx.db.stations.upsertByEntityId(stn.abbr, {
						id: stn.abbr,
						name: stn.name,
						abbr: stn.abbr,
						gtfs_latitude: stn.gtfs_latitude,
						gtfs_longitude: stn.gtfs_longitude,
						address: stn.address,
						city: stn.city,
						county: stn.county,
						state: stn.state,
						zipcode: stn.zipcode,
					});
				} catch (error) {
					console.warn('Failed to persist station info to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'bart.stations.info',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const access: BartEndpoints['stationsAccess'] = async (ctx, input) => {
	const parsedInput = BartEndpointInputSchemas.stationsAccess.parse(input);
	const raw = await makeBartRequest<unknown>('stn.aspx', ctx.key, {
		query: {
			cmd: 'stnaccess',
			orig: parsedInput.orig,
			l: parsedInput.l,
		},
	});

	const response = BartEndpointOutputSchemas.stationsAccess.parse(raw);
	await logEventFromContext(
		ctx,
		'bart.stations.access',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

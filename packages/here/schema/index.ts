import {
	HereAddress,
	HerePlace,
	HerePosition,
	HereRoute,
	HereTrafficResult,
	HereWeatherPlace,
} from './database';

export const HereSchema = {
	version: '1.0.0',
	entities: {
		addresses: HereAddress,
		places: HerePlace,
		positions: HerePosition,
		routes: HereRoute,
		trafficResults: HereTrafficResult,
		weatherPlaces: HereWeatherPlace,
	},
} as const;

export type {
	HereAddress,
	HerePlace,
	HerePosition,
	HereRoute,
	HereTrafficResult,
	HereWeatherPlace,
} from './database';

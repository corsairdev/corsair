import { OpenWeatherMapDaySummary, OpenWeatherMapOverview } from './database';

export const OpenWeatherMapSchema = {
	version: '1.0.0',
	entities: {
		daySummaries: OpenWeatherMapDaySummary,
		overviews: OpenWeatherMapOverview,
	},
} as const;

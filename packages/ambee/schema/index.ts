import {
	AmbeeAirQualityReading,
	AmbeeGeocodedPlace,
	AmbeeWeatherObservation,
} from './database';

export const AmbeeSchema = {
	version: '1.0.0',
	entities: {
		airQualityReadings: AmbeeAirQualityReading,
		weatherObservations: AmbeeWeatherObservation,
		geocodedPlaces: AmbeeGeocodedPlace,
	},
} as const;

export * from './database';

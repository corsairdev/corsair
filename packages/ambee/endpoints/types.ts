import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared input fragments
//
// Ambee validates coordinates server-side; the same bounds are enforced here
// so an obviously-bad request fails before it costs an API call.
// ─────────────────────────────────────────────────────────────────────────────

const LatSchema = z
	.number()
	.min(-90)
	.max(90)
	.describe('Latitude, between -90 and 90');

const LngSchema = z
	.number()
	.min(-180)
	.max(180)
	.describe('Longitude, between -180 and 180');

const FromSchema = z
	.string()
	.min(1)
	.describe(
		'Start of the time range, as "YYYY-MM-DD hh:mm:ss" (UTC) or an ISO 8601 date',
	);

const ToSchema = z
	.string()
	.min(1)
	.describe(
		'End of the time range, as "YYYY-MM-DD hh:mm:ss" (UTC) or an ISO 8601 date',
	);

const LatLngInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
});

const LatLngRangeInputSchema = z.object({
	lat: LatSchema,
	lng: LngSchema,
	from: FromSchema,
	to: ToSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// Response shapes
//
// Ambee wraps every payload in `{ message: "success", ... }` and returns a
// wide, product-specific body whose optional fields depend on the coverage
// available for the requested location (e.g. a station with no SO2 sensor
// simply omits `SO2`). Response objects are therefore modelled as `.loose()`
// with optional members: the envelope and the known fields are validated at
// runtime, while provider-side additions pass through instead of throwing.
// ─────────────────────────────────────────────────────────────────────────────

const MessageSchema = z
	.string()
	.describe('Ambee status message, "success" on a successful call');

/** Pollutant concentrations shared by every air-quality payload. */
const AirQualityMeasurementSchema = z.object({
	CO: z.number().nullable().optional(),
	NO2: z.number().nullable().optional(),
	OZONE: z.number().nullable().optional(),
	PM10: z.number().nullable().optional(),
	PM25: z.number().nullable().optional(),
	SO2: z.number().nullable().optional(),
	NO: z.number().nullable().optional(),
	AQI: z.number().nullable().optional(),
	aqiInfo: z
		.object({
			pollutant: z.string().nullable().optional(),
			concentration: z.number().nullable().optional(),
			category: z.string().nullable().optional(),
		})
		.loose()
		.optional(),
});

/** A single air-quality station reading (the `stations[]` entries). */
export const AirQualityStationSchema = AirQualityMeasurementSchema.extend({
	city: z.string().nullable().optional(),
	countryCode: z.string().nullable().optional(),
	division: z.string().nullable().optional(),
	state: z.string().nullable().optional(),
	placeName: z.string().nullable().optional(),
	postalCode: z.union([z.string(), z.number()]).nullable().optional(),
	lat: z.number().nullable().optional(),
	lng: z.number().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
}).loose();

export type AirQualityStation = z.infer<typeof AirQualityStationSchema>;

/** A time-series air-quality reading (history and forecast entries). */
export const AirQualityReadingSchema = AirQualityMeasurementSchema.extend({
	time: z.number().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
}).loose();

export type AirQualityReading = z.infer<typeof AirQualityReadingSchema>;

export const AirQualityStationsResponseSchema = z
	.object({
		message: MessageSchema,
		stations: z.array(AirQualityStationSchema).optional(),
	})
	.loose();

export type AirQualityStationsResponse = z.infer<
	typeof AirQualityStationsResponseSchema
>;

export const AirQualitySeriesResponseSchema = z
	.object({
		message: MessageSchema,
		lat: z.number().optional(),
		lng: z.number().optional(),
		data: z.array(AirQualityReadingSchema).optional(),
	})
	.loose();

export type AirQualitySeriesResponse = z.infer<
	typeof AirQualitySeriesResponseSchema
>;

/** A single hourly weather observation/forecast point. */
export const WeatherPointSchema = z
	.object({
		time: z.number().nullable().optional(),
		summary: z.string().nullable().optional(),
		icon: z.string().nullable().optional(),
		temperature: z.number().nullable().optional(),
		apparentTemperature: z.number().nullable().optional(),
		dewPoint: z.number().nullable().optional(),
		humidity: z.number().nullable().optional(),
		pressure: z.number().nullable().optional(),
		surfacePressure: z.number().nullable().optional(),
		windSpeed: z.number().nullable().optional(),
		windGust: z.number().nullable().optional(),
		windBearing: z.number().nullable().optional(),
		cloudCover: z.number().nullable().optional(),
		visibility: z.number().nullable().optional(),
		ozone: z.number().nullable().optional(),
		uvIndex: z.number().nullable().optional(),
		precipIntensity: z.number().nullable().optional(),
		precipProbability: z.number().nullable().optional(),
		precipType: z.string().nullable().optional(),
	})
	.loose();

export type WeatherPoint = z.infer<typeof WeatherPointSchema>;

const WeatherLocationSchema = {
	lat: z.number().optional(),
	lng: z.number().optional(),
	timezone: z.string().optional(),
	units: z.string().optional(),
};

/** A pollen reading — counts, risk bands and per-species breakdown. */
export const PollenReadingSchema = z
	.object({
		time: z.number().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
		Count: z
			.object({
				grass_pollen: z.number().nullable().optional(),
				tree_pollen: z.number().nullable().optional(),
				weed_pollen: z.number().nullable().optional(),
			})
			.loose()
			.optional(),
		Risk: z
			.object({
				grass_pollen: z.string().nullable().optional(),
				tree_pollen: z.string().nullable().optional(),
				weed_pollen: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		// Only returned when `speciesRisk` is requested; the per-species keys
		// vary by region, so they stay an open record rather than a fixed shape.
		Species: z.record(z.string(), z.unknown()).optional(),
		Risks: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type PollenReading = z.infer<typeof PollenReadingSchema>;

export const PollenResponseSchema = z
	.object({
		message: MessageSchema,
		lat: z.number().optional(),
		lng: z.number().optional(),
		data: z.array(PollenReadingSchema).optional(),
	})
	.loose();

export type PollenResponse = z.infer<typeof PollenResponseSchema>;

/** A detected or reported wildfire event. */
export const FireEventSchema = z
	.object({
		fireId: z.union([z.string(), z.number()]).nullable().optional(),
		lat: z.number().nullable().optional(),
		lng: z.number().nullable().optional(),
		detectedAt: z.union([z.string(), z.number()]).nullable().optional(),
		detectedAtLocalTime: z.string().nullable().optional(),
		confidence: z.union([z.string(), z.number()]).nullable().optional(),
		frp: z.number().nullable().optional(),
		satellite: z.string().nullable().optional(),
		instrument: z.string().nullable().optional(),
		fireType: z.string().nullable().optional(),
		fireName: z.string().nullable().optional(),
		locationName: z.string().nullable().optional(),
		area: z.number().nullable().optional(),
	})
	.loose();

export type FireEvent = z.infer<typeof FireEventSchema>;

export const FireResponseSchema = z
	.object({
		message: MessageSchema,
		data: z.array(FireEventSchema).optional(),
	})
	.loose();

export type FireResponse = z.infer<typeof FireResponseSchema>;

/** A daily wildfire-risk forecast entry. */
export const FireRiskSchema = z
	.object({
		date: z.string().nullable().optional(),
		time: z.number().nullable().optional(),
		risk: z.union([z.string(), z.number()]).nullable().optional(),
		riskCategory: z.string().nullable().optional(),
		lat: z.number().nullable().optional(),
		lng: z.number().nullable().optional(),
	})
	.loose();

export type FireRisk = z.infer<typeof FireRiskSchema>;

export const FireRiskResponseSchema = z
	.object({
		message: MessageSchema,
		data: z.array(FireRiskSchema).optional(),
	})
	.loose();

export type FireRiskResponse = z.infer<typeof FireRiskResponseSchema>;

/** A geocoding / reverse-geocoding match. */
export const GeocodeResultSchema = z
	.object({
		lat: z.union([z.string(), z.number()]).nullable().optional(),
		lng: z.union([z.string(), z.number()]).nullable().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		countryCode: z.string().nullable().optional(),
		countryName: z.string().nullable().optional(),
		postalCode: z.union([z.string(), z.number()]).nullable().optional(),
		placeName: z.string().nullable().optional(),
		formattedAddress: z.string().nullable().optional(),
	})
	.loose();

export type GeocodeResult = z.infer<typeof GeocodeResultSchema>;

export const GeocodeResponseSchema = z
	.object({
		message: MessageSchema,
		data: z.array(GeocodeResultSchema).optional(),
	})
	.loose();

export type GeocodeResponse = z.infer<typeof GeocodeResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Air Quality — https://docs.ambeedata.com/apis/air-quality
// ─────────────────────────────────────────────────────────────────────────────

export const AirQualityGetLatestByLatLngInputSchema = LatLngInputSchema;
export type AirQualityGetLatestByLatLngInput = z.infer<
	typeof AirQualityGetLatestByLatLngInputSchema
>;

export const AirQualityGetLatestByCityInputSchema = z.object({
	city: z.string().min(1).describe('City name, e.g. "Bengaluru"'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum number of stations to return (Ambee defaults to 1)'),
});
export type AirQualityGetLatestByCityInput = z.infer<
	typeof AirQualityGetLatestByCityInputSchema
>;

export const AirQualityGetLatestByPostalCodeInputSchema = z.object({
	postalCode: z.string().min(1).describe('Postal code, e.g. "560020"'),
	countryCode: z
		.string()
		.min(2)
		.describe('Three-letter ISO country code, e.g. "IND" or "USA"'),
});
export type AirQualityGetLatestByPostalCodeInput = z.infer<
	typeof AirQualityGetLatestByPostalCodeInputSchema
>;

export const AirQualityGetHistoryByLatLngInputSchema = LatLngRangeInputSchema;
export type AirQualityGetHistoryByLatLngInput = z.infer<
	typeof AirQualityGetHistoryByLatLngInputSchema
>;

export const AirQualityGetHistoryByPostalCodeInputSchema = z.object({
	postalCode: z.string().min(1).describe('Postal code, e.g. "560020"'),
	countryCode: z
		.string()
		.min(2)
		.describe('Three-letter ISO country code, e.g. "IND" or "USA"'),
	from: FromSchema,
	to: ToSchema,
});
export type AirQualityGetHistoryByPostalCodeInput = z.infer<
	typeof AirQualityGetHistoryByPostalCodeInputSchema
>;

export const AirQualityGetForecastByLatLngInputSchema = LatLngInputSchema;
export type AirQualityGetForecastByLatLngInput = z.infer<
	typeof AirQualityGetForecastByLatLngInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Weather — https://docs.ambeedata.com/apis/weather
// ─────────────────────────────────────────────────────────────────────────────

const UnitsSchema = z
	.literal('si')
	.optional()
	.describe('Pass "si" to receive SI units instead of the imperial default');

export const WeatherGetLatestInputSchema = LatLngInputSchema.extend({
	units: UnitsSchema,
});
export type WeatherGetLatestInput = z.infer<typeof WeatherGetLatestInputSchema>;

export const WeatherGetHistoryInputSchema = LatLngRangeInputSchema.extend({
	units: UnitsSchema,
});
export type WeatherGetHistoryInput = z.infer<
	typeof WeatherGetHistoryInputSchema
>;

export const WeatherGetForecastInputSchema = LatLngInputSchema.extend({
	units: UnitsSchema,
});
export type WeatherGetForecastInput = z.infer<
	typeof WeatherGetForecastInputSchema
>;

/** Latest weather returns a single observation under `data`. */
export const WeatherLatestResponseSchema = z
	.object({
		message: MessageSchema,
		...WeatherLocationSchema,
		data: WeatherPointSchema.optional(),
	})
	.loose();
export type WeatherLatestResponse = z.infer<typeof WeatherLatestResponseSchema>;

/** History and forecast return an hourly series under `data`. */
export const WeatherSeriesResponseSchema = z
	.object({
		message: MessageSchema,
		...WeatherLocationSchema,
		data: z.array(WeatherPointSchema).optional(),
	})
	.loose();
export type WeatherSeriesResponse = z.infer<typeof WeatherSeriesResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Pollen — https://docs.ambeedata.com/apis/pollen (v3)
// ─────────────────────────────────────────────────────────────────────────────

const SpeciesRiskSchema = z
	.boolean()
	.optional()
	.describe('Include the per-species pollen breakdown (defaults to false)');

const PlaceSchema = z.string().min(1).describe('Place name, e.g. "Barcelona"');

/**
 * Pollen endpoints accept *either* a coordinate pair or a place name — never
 * both. Each input is therefore a union of the two location forms rather than
 * one object with both fields optional, so an ambiguous call is rejected at
 * validation time instead of silently dropping a parameter at request time.
 */
export const PollenGetLatestInputSchema = z.union([
	z.object({ lat: LatSchema, lng: LngSchema, speciesRisk: SpeciesRiskSchema }),
	z.object({ place: PlaceSchema, speciesRisk: SpeciesRiskSchema }),
]);
export type PollenGetLatestInput = z.infer<typeof PollenGetLatestInputSchema>;

export const PollenGetHistoryInputSchema = z.union([
	z.object({
		lat: LatSchema,
		lng: LngSchema,
		from: FromSchema,
		to: ToSchema,
		speciesRisk: SpeciesRiskSchema,
	}),
	z.object({
		place: PlaceSchema,
		from: FromSchema,
		to: ToSchema,
		speciesRisk: SpeciesRiskSchema,
	}),
]);
export type PollenGetHistoryInput = z.infer<typeof PollenGetHistoryInputSchema>;

const PollenForecastHoursSchema = z
	.union([z.literal(48), z.literal(120)])
	.optional()
	.describe('Forecast horizon in hours: 48 (hourly) or 120 (3-hourly)');

export const PollenGetForecastInputSchema = z.union([
	z.object({
		lat: LatSchema,
		lng: LngSchema,
		hours: PollenForecastHoursSchema,
		speciesRisk: SpeciesRiskSchema,
	}),
	z.object({
		place: PlaceSchema,
		hours: PollenForecastHoursSchema,
		speciesRisk: SpeciesRiskSchema,
	}),
]);
export type PollenGetForecastInput = z.infer<
	typeof PollenGetForecastInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Fire — https://docs.ambeedata.com/apis/fire
// ─────────────────────────────────────────────────────────────────────────────

const FireTypeSchema = z
	.enum(['reported', 'detected'])
	.optional()
	.describe('Restrict results to reported or satellite-detected fires');

export const FireGetLatestByLatLngInputSchema = LatLngInputSchema.extend({
	type: FireTypeSchema,
});
export type FireGetLatestByLatLngInput = z.infer<
	typeof FireGetLatestByLatLngInputSchema
>;

export const FireGetLatestByPlaceInputSchema = z.object({
	place: z.string().min(1).describe('Place name, e.g. "Virgin, UT"'),
	type: FireTypeSchema,
});
export type FireGetLatestByPlaceInput = z.infer<
	typeof FireGetLatestByPlaceInputSchema
>;

export const FireGetRiskByLatLngInputSchema = LatLngInputSchema;
export type FireGetRiskByLatLngInput = z.infer<
	typeof FireGetRiskByLatLngInputSchema
>;

export const FireGetRiskByPlaceInputSchema = z.object({
	place: z.string().min(1).describe('Place name, e.g. "Leon, Mexico"'),
});
export type FireGetRiskByPlaceInput = z.infer<
	typeof FireGetRiskByPlaceInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Location services — https://docs.ambeedata.com/apis/location
// ─────────────────────────────────────────────────────────────────────────────

export const GeocodeByPlaceInputSchema = z.object({
	place: z.string().min(1).describe('Address or place name to geocode'),
});
export type GeocodeByPlaceInput = z.infer<typeof GeocodeByPlaceInputSchema>;

export const GeocodeReverseByLatLngInputSchema = LatLngInputSchema;
export type GeocodeReverseByLatLngInput = z.infer<
	typeof GeocodeReverseByLatLngInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint input/output maps
// ─────────────────────────────────────────────────────────────────────────────

export type AmbeeEndpointInputs = {
	airQualityGetLatestByLatLng: AirQualityGetLatestByLatLngInput;
	airQualityGetLatestByCity: AirQualityGetLatestByCityInput;
	airQualityGetLatestByPostalCode: AirQualityGetLatestByPostalCodeInput;
	airQualityGetHistoryByLatLng: AirQualityGetHistoryByLatLngInput;
	airQualityGetHistoryByPostalCode: AirQualityGetHistoryByPostalCodeInput;
	airQualityGetForecastByLatLng: AirQualityGetForecastByLatLngInput;
	weatherGetLatest: WeatherGetLatestInput;
	weatherGetHistory: WeatherGetHistoryInput;
	weatherGetForecast: WeatherGetForecastInput;
	pollenGetLatest: PollenGetLatestInput;
	pollenGetHistory: PollenGetHistoryInput;
	pollenGetForecast: PollenGetForecastInput;
	fireGetLatestByLatLng: FireGetLatestByLatLngInput;
	fireGetLatestByPlace: FireGetLatestByPlaceInput;
	fireGetRiskByLatLng: FireGetRiskByLatLngInput;
	fireGetRiskByPlace: FireGetRiskByPlaceInput;
	geocodeByPlace: GeocodeByPlaceInput;
	geocodeReverseByLatLng: GeocodeReverseByLatLngInput;
};

export type AmbeeEndpointOutputs = {
	airQualityGetLatestByLatLng: AirQualityStationsResponse;
	airQualityGetLatestByCity: AirQualityStationsResponse;
	airQualityGetLatestByPostalCode: AirQualityStationsResponse;
	airQualityGetHistoryByLatLng: AirQualitySeriesResponse;
	airQualityGetHistoryByPostalCode: AirQualitySeriesResponse;
	airQualityGetForecastByLatLng: AirQualitySeriesResponse;
	weatherGetLatest: WeatherLatestResponse;
	weatherGetHistory: WeatherSeriesResponse;
	weatherGetForecast: WeatherSeriesResponse;
	pollenGetLatest: PollenResponse;
	pollenGetHistory: PollenResponse;
	pollenGetForecast: PollenResponse;
	fireGetLatestByLatLng: FireResponse;
	fireGetLatestByPlace: FireResponse;
	fireGetRiskByLatLng: FireRiskResponse;
	fireGetRiskByPlace: FireRiskResponse;
	geocodeByPlace: GeocodeResponse;
	geocodeReverseByLatLng: GeocodeResponse;
};

export const AmbeeEndpointInputSchemas = {
	airQualityGetLatestByLatLng: AirQualityGetLatestByLatLngInputSchema,
	airQualityGetLatestByCity: AirQualityGetLatestByCityInputSchema,
	airQualityGetLatestByPostalCode: AirQualityGetLatestByPostalCodeInputSchema,
	airQualityGetHistoryByLatLng: AirQualityGetHistoryByLatLngInputSchema,
	airQualityGetHistoryByPostalCode: AirQualityGetHistoryByPostalCodeInputSchema,
	airQualityGetForecastByLatLng: AirQualityGetForecastByLatLngInputSchema,
	weatherGetLatest: WeatherGetLatestInputSchema,
	weatherGetHistory: WeatherGetHistoryInputSchema,
	weatherGetForecast: WeatherGetForecastInputSchema,
	pollenGetLatest: PollenGetLatestInputSchema,
	pollenGetHistory: PollenGetHistoryInputSchema,
	pollenGetForecast: PollenGetForecastInputSchema,
	fireGetLatestByLatLng: FireGetLatestByLatLngInputSchema,
	fireGetLatestByPlace: FireGetLatestByPlaceInputSchema,
	fireGetRiskByLatLng: FireGetRiskByLatLngInputSchema,
	fireGetRiskByPlace: FireGetRiskByPlaceInputSchema,
	geocodeByPlace: GeocodeByPlaceInputSchema,
	geocodeReverseByLatLng: GeocodeReverseByLatLngInputSchema,
} as const;

export const AmbeeEndpointOutputSchemas = {
	airQualityGetLatestByLatLng: AirQualityStationsResponseSchema,
	airQualityGetLatestByCity: AirQualityStationsResponseSchema,
	airQualityGetLatestByPostalCode: AirQualityStationsResponseSchema,
	airQualityGetHistoryByLatLng: AirQualitySeriesResponseSchema,
	airQualityGetHistoryByPostalCode: AirQualitySeriesResponseSchema,
	airQualityGetForecastByLatLng: AirQualitySeriesResponseSchema,
	weatherGetLatest: WeatherLatestResponseSchema,
	weatherGetHistory: WeatherSeriesResponseSchema,
	weatherGetForecast: WeatherSeriesResponseSchema,
	pollenGetLatest: PollenResponseSchema,
	pollenGetHistory: PollenResponseSchema,
	pollenGetForecast: PollenResponseSchema,
	fireGetLatestByLatLng: FireResponseSchema,
	fireGetLatestByPlace: FireResponseSchema,
	fireGetRiskByLatLng: FireRiskResponseSchema,
	fireGetRiskByPlace: FireRiskResponseSchema,
	geocodeByPlace: GeocodeResponseSchema,
	geocodeReverseByLatLng: GeocodeResponseSchema,
} as const;

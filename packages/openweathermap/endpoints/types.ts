import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared / Common Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const OPENWEATHERMAP_UNITS = ['standard', 'metric', 'imperial'] as const;
export type OpenWeatherMapUnits = (typeof OPENWEATHERMAP_UNITS)[number];

export const OPENWEATHERMAP_EXCLUDE = [
	'current',
	'minutely',
	'hourly',
	'daily',
	'alerts',
] as const;
export type OpenWeatherMapExclude = (typeof OPENWEATHERMAP_EXCLUDE)[number];

/** Weather condition object returned in most responses. */
const WeatherConditionSchema = z.object({
	/** Weather condition ID */
	id: z.number(),
	/** Group of weather parameters (Rain, Snow, Clouds, etc.) */
	main: z.string(),
	/** Weather condition within the group */
	description: z.string(),
	/** Weather icon ID */
	icon: z.string(),
});

export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Current & Forecast — GET /onecall
// ─────────────────────────────────────────────────────────────────────────────

export const OneCallInputSchema = z.object({
	/** Latitude (-90 to 90) */
	lat: z.number().min(-90).max(90).describe('Latitude of the location'),
	/** Longitude (-180 to 180) */
	lon: z.number().min(-180).max(180).describe('Longitude of the location'),
	/** Exclude parts of the response. Comma-separated list. */
	exclude: z
		.array(z.enum(OPENWEATHERMAP_EXCLUDE))
		.optional()
		.describe(
			'Parts to exclude from the response: current, minutely, hourly, daily, alerts',
		),
	/** Units of measurement: standard, metric, or imperial */
	units: z
		.enum(OPENWEATHERMAP_UNITS)
		.optional()
		.describe(
			'Units: standard (Kelvin), metric (Celsius), imperial (Fahrenheit)',
		),
	/** Language code for descriptions (e.g. "en", "fr", "de") */
	lang: z
		.string()
		.optional()
		.describe('Language code for weather descriptions'),
});

export type OneCallInput = z.infer<typeof OneCallInputSchema>;

const CurrentWeatherSchema = z.object({
	/** Current time, Unix, UTC */
	dt: z.number(),
	/** Sunrise time, Unix, UTC */
	sunrise: z.number().optional(),
	/** Sunset time, Unix, UTC */
	sunset: z.number().optional(),
	/** Temperature */
	temp: z.number(),
	/** Human perception of temperature */
	feels_like: z.number(),
	/** Atmospheric pressure on sea level, hPa */
	pressure: z.number(),
	/** Humidity, % */
	humidity: z.number(),
	/** Atmospheric temperature below which water droplets begin to condense */
	dew_point: z.number(),
	/** UV index */
	uvi: z.number(),
	/** Cloudiness, % */
	clouds: z.number(),
	/** Average visibility, metres (max 10km) */
	visibility: z.number().optional(),
	/** Wind speed */
	wind_speed: z.number(),
	/** Wind direction, degrees (meteorological) */
	wind_deg: z.number(),
	/** Wind gust */
	wind_gust: z.number().optional(),
	/** Weather conditions */
	weather: z.array(WeatherConditionSchema),
	/** Rain volume for last 1 hour, mm */
	rain: z.object({ '1h': z.number() }).optional(),
	/** Snow volume for last 1 hour, mm */
	snow: z.object({ '1h': z.number() }).optional(),
});

export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;

const MinutelyForecastSchema = z.object({
	/** Time of the forecasted data, Unix, UTC */
	dt: z.number(),
	/** Precipitation volume, mm/h */
	precipitation: z.number(),
});

export type MinutelyForecast = z.infer<typeof MinutelyForecastSchema>;

const HourlyForecastSchema = z.object({
	dt: z.number(),
	temp: z.number(),
	feels_like: z.number(),
	pressure: z.number(),
	humidity: z.number(),
	dew_point: z.number(),
	uvi: z.number(),
	clouds: z.number(),
	visibility: z.number().optional(),
	wind_speed: z.number(),
	wind_deg: z.number(),
	wind_gust: z.number().optional(),
	weather: z.array(WeatherConditionSchema),
	/** Probability of precipitation (0–1) */
	pop: z.number(),
	rain: z.object({ '1h': z.number() }).optional(),
	snow: z.object({ '1h': z.number() }).optional(),
});

export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;

const DailyTemperatureSchema = z.object({
	day: z.number(),
	min: z.number(),
	max: z.number(),
	night: z.number(),
	eve: z.number(),
	morn: z.number(),
});

const DailyFeelsLikeSchema = z.object({
	day: z.number(),
	night: z.number(),
	eve: z.number(),
	morn: z.number(),
});

const DailyForecastSchema = z.object({
	dt: z.number(),
	sunrise: z.number(),
	sunset: z.number(),
	moonrise: z.number(),
	moonset: z.number(),
	/** Moon phase (0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter) */
	moon_phase: z.number(),
	summary: z.string().optional(),
	temp: DailyTemperatureSchema,
	feels_like: DailyFeelsLikeSchema,
	pressure: z.number(),
	humidity: z.number(),
	dew_point: z.number(),
	wind_speed: z.number(),
	wind_deg: z.number(),
	wind_gust: z.number().optional(),
	weather: z.array(WeatherConditionSchema),
	clouds: z.number(),
	/** Probability of precipitation (0–1) */
	pop: z.number(),
	/** Precipitation volume, mm */
	rain: z.number().optional(),
	/** Snow volume, mm */
	snow: z.number().optional(),
	uvi: z.number(),
});

export type DailyForecast = z.infer<typeof DailyForecastSchema>;

const WeatherAlertSchema = z.object({
	/** Name of the alert source */
	sender_name: z.string(),
	/** Alert event name */
	event: z.string(),
	/** Start of the alert, Unix, UTC */
	start: z.number(),
	/** End of the alert, Unix, UTC */
	end: z.number(),
	/** Description of the alert */
	description: z.string(),
	/** Tags associated with the alert */
	tags: z.array(z.string()),
});

export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;

export const OneCallResponseSchema = z.object({
	/** Latitude of the location */
	lat: z.number(),
	/** Longitude of the location */
	lon: z.number(),
	/** Timezone name (e.g. "America/Chicago") */
	timezone: z.string(),
	/** Shift in seconds from UTC */
	timezone_offset: z.number(),
	/** Current weather data */
	current: CurrentWeatherSchema.optional(),
	/** Minute-by-minute forecast for 1 hour */
	minutely: z.array(MinutelyForecastSchema).optional(),
	/** Hourly forecast for 48 hours */
	hourly: z.array(HourlyForecastSchema).optional(),
	/** Daily forecast for 8 days */
	daily: z.array(DailyForecastSchema).optional(),
	/** Government weather alerts */
	alerts: z.array(WeatherAlertSchema).optional(),
});

export type OneCallResponse = z.infer<typeof OneCallResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Historical Weather — GET /onecall/timemachine
// ─────────────────────────────────────────────────────────────────────────────

export const TimeMachineInputSchema = z.object({
	/** Latitude (-90 to 90) */
	lat: z.number().min(-90).max(90).describe('Latitude of the location'),
	/** Longitude (-180 to 180) */
	lon: z.number().min(-180).max(180).describe('Longitude of the location'),
	/** Timestamp (Unix time, UTC) for the requested date. Data is available from 1979-01-01. */
	dt: z
		.number()
		.describe('Unix timestamp (UTC) for the requested historical date'),
	/** Units of measurement: standard, metric, or imperial */
	units: z
		.enum(OPENWEATHERMAP_UNITS)
		.optional()
		.describe(
			'Units: standard (Kelvin), metric (Celsius), imperial (Fahrenheit)',
		),
	/** Language code for descriptions */
	lang: z
		.string()
		.optional()
		.describe('Language code for weather descriptions'),
});

export type TimeMachineInput = z.infer<typeof TimeMachineInputSchema>;

const HistoricalWeatherDataSchema = z.object({
	dt: z.number(),
	sunrise: z.number(),
	sunset: z.number(),
	temp: z.number(),
	feels_like: z.number(),
	pressure: z.number(),
	humidity: z.number(),
	dew_point: z.number(),
	uvi: z.number().optional(),
	clouds: z.number(),
	visibility: z.number().optional(),
	wind_speed: z.number(),
	wind_deg: z.number(),
	wind_gust: z.number().optional(),
	weather: z.array(WeatherConditionSchema),
	rain: z.object({ '1h': z.number() }).optional(),
	snow: z.object({ '1h': z.number() }).optional(),
});

export type HistoricalWeatherData = z.infer<typeof HistoricalWeatherDataSchema>;

export const TimeMachineResponseSchema = z.object({
	lat: z.number(),
	lon: z.number(),
	timezone: z.string(),
	timezone_offset: z.number(),
	data: z.array(HistoricalWeatherDataSchema),
});

export type TimeMachineResponse = z.infer<typeof TimeMachineResponseSchema>;

// ────────────────────────────────────────────────────────────────────────────��
// Day Summary — GET /onecall/day_summary
// ─────────────────────────────────────────────────────────────────────────────

export const DaySummaryInputSchema = z.object({
	/** Latitude (-90 to 90) */
	lat: z.number().min(-90).max(90).describe('Latitude of the location'),
	/** Longitude (-180 to 180) */
	lon: z.number().min(-180).max(180).describe('Longitude of the location'),
	/** Date in YYYY-MM-DD format. Data is available from 1979-01-02 to 1.5 years ahead. */
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.describe('Date in YYYY-MM-DD format'),
	/** Units of measurement: standard, metric, or imperial */
	units: z
		.enum(OPENWEATHERMAP_UNITS)
		.optional()
		.describe(
			'Units: standard (Kelvin), metric (Celsius), imperial (Fahrenheit)',
		),
	/** Language code for descriptions */
	lang: z
		.string()
		.optional()
		.describe('Language code for weather descriptions'),
	/** Timezone in ±XX:XX format for date interpretation */
	tz: z
		.string()
		.optional()
		.describe('Timezone offset in ±XX:XX format (e.g. +05:30)'),
});

export type DaySummaryInput = z.infer<typeof DaySummaryInputSchema>;

const DaySummaryTemperatureSchema = z.object({
	min: z.number(),
	max: z.number(),
	afternoon: z.number(),
	night: z.number(),
	evening: z.number(),
	morning: z.number(),
});

const DaySummaryWindSchema = z.object({
	max: z.object({
		speed: z.number(),
		direction: z.number(),
	}),
});

const DaySummaryPrecipitationSchema = z.object({
	total: z.number(),
});

export const DaySummaryResponseSchema = z.object({
	lat: z.number(),
	lon: z.number(),
	tz: z.string(),
	date: z.string(),
	units: z.string(),
	cloud_cover: z.object({ afternoon: z.number() }),
	humidity: z.object({ afternoon: z.number() }),
	precipitation: DaySummaryPrecipitationSchema,
	temperature: DaySummaryTemperatureSchema,
	pressure: z.object({ afternoon: z.number() }),
	wind: DaySummaryWindSchema,
});

export type DaySummaryResponse = z.infer<typeof DaySummaryResponseSchema>;

// ───────────────────────────────��─────────────────────────────────────────────
// Weather Overview — GET /onecall/overview
// ─────────────────────────────────────────────────────────────────────────────

export const OverviewInputSchema = z.object({
	/** Latitude (-90 to 90) */
	lat: z.number().min(-90).max(90).describe('Latitude of the location'),
	/** Longitude (-180 to 180) */
	lon: z.number().min(-180).max(180).describe('Longitude of the location'),
	/** Date in YYYY-MM-DD format. If omitted, returns today's overview. */
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe('Date in YYYY-MM-DD format (defaults to today)'),
	/** Units of measurement: standard, metric, or imperial */
	units: z
		.enum(OPENWEATHERMAP_UNITS)
		.optional()
		.describe(
			'Units: standard (Kelvin), metric (Celsius), imperial (Fahrenheit)',
		),
});

export type OverviewInput = z.infer<typeof OverviewInputSchema>;

export const OverviewResponseSchema = z.object({
	lat: z.number(),
	lon: z.number(),
	tz: z.string(),
	date: z.string(),
	units: z.string(),
	/** Human-readable weather overview text */
	weather_overview: z.string(),
});

export type OverviewResponse = z.infer<typeof OverviewResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type OpenWeatherMapEndpointInputs = {
	oneCall: OneCallInput;
	timeMachine: TimeMachineInput;
	daySummary: DaySummaryInput;
	overview: OverviewInput;
};

export type OpenWeatherMapEndpointOutputs = {
	oneCall: OneCallResponse;
	timeMachine: TimeMachineResponse;
	daySummary: DaySummaryResponse;
	overview: OverviewResponse;
};

export const OpenWeatherMapEndpointInputSchemas = {
	oneCall: OneCallInputSchema,
	timeMachine: TimeMachineInputSchema,
	daySummary: DaySummaryInputSchema,
	overview: OverviewInputSchema,
} as const;

export const OpenWeatherMapEndpointOutputSchemas = {
	oneCall: OneCallResponseSchema,
	timeMachine: TimeMachineResponseSchema,
	daySummary: DaySummaryResponseSchema,
	overview: OverviewResponseSchema,
} as const;

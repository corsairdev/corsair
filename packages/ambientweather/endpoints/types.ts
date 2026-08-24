import { z } from 'zod';

export const AmbientWeatherDeviceInfoSchema = z
	.object({
		name: z.string(),
		location: z.string().optional(),
	})
	.passthrough();

/**
 * Device data point fields from the Ambient Weather REST sample + wiki.
 * `.passthrough()` keeps station-specific sensors (temp1f, pm25, …).
 * https://ambientweather.docs.apiary.io/
 * https://github.com/ambient-weather/api-docs/wiki/Device-Data-Specs
 */
export const AmbientWeatherDataPointSchema = z
	.object({
		dateutc: z.number().int(),
		date: z.string().optional(),
		tz: z.string().optional(),
		winddir: z.number().optional(),
		windspeedmph: z.number().optional(),
		windgustmph: z.number().optional(),
		maxdailygust: z.number().optional(),
		windgustdir: z.number().optional(),
		winddir_avg2m: z.number().optional(),
		windspdmph_avg2m: z.number().optional(),
		winddir_avg10m: z.number().optional(),
		windspdmph_avg10m: z.number().optional(),
		tempf: z.number().optional(),
		humidity: z.number().optional(),
		baromrelin: z.number().optional(),
		baromabsin: z.number().optional(),
		tempinf: z.number().optional(),
		humidityin: z.number().optional(),
		hourlyrainin: z.number().optional(),
		dailyrainin: z.number().optional(),
		weeklyrainin: z.number().optional(),
		monthlyrainin: z.number().optional(),
		yearlyrainin: z.number().optional(),
		eventrainin: z.number().optional(),
		totalrainin: z.number().optional(),
		uv: z.number().optional(),
		solarradiation: z.number().optional(),
		feelsLike: z.number().optional(),
		dewPoint: z.number().optional(),
		lastRain: z.string().optional(),
	})
	.passthrough();

export const AmbientWeatherDeviceListItemSchema = z
	.object({
		macAddress: z.string(),
		info: AmbientWeatherDeviceInfoSchema,
		lastData: AmbientWeatherDataPointSchema,
	})
	.passthrough();

export const AmbientWeatherDeviceListResponseSchema = z.array(
	AmbientWeatherDeviceListItemSchema,
);

export const AmbientWeatherDeviceDataResponseSchema = z.array(
	AmbientWeatherDataPointSchema,
);

export const AmbientWeatherDevicesListInputSchema = z.object({});

/** Docs: limit max 288; omit to use Ambient Weather's default (288). */
export const AmbientWeatherDevicesGetDataInputSchema = z.object({
	macAddress: z.string().min(1),
	limit: z.coerce.number().int().min(1).max(288).optional(),
	endDate: z.coerce.number().int().optional(),
});

export type AmbientWeatherDeviceInfo = z.infer<
	typeof AmbientWeatherDeviceInfoSchema
>;
export type AmbientWeatherDataPoint = z.infer<
	typeof AmbientWeatherDataPointSchema
>;
export type AmbientWeatherDeviceListItem = z.infer<
	typeof AmbientWeatherDeviceListItemSchema
>;
export type AmbientWeatherDeviceListResponse = z.infer<
	typeof AmbientWeatherDeviceListResponseSchema
>;
export type AmbientWeatherDeviceDataResponse = z.infer<
	typeof AmbientWeatherDeviceDataResponseSchema
>;
export type AmbientWeatherDevicesListInput = z.infer<
	typeof AmbientWeatherDevicesListInputSchema
>;
export type AmbientWeatherDevicesGetDataInput = z.infer<
	typeof AmbientWeatherDevicesGetDataInputSchema
>;

export type AmbientWeatherEndpointInputs = {
	devicesList: AmbientWeatherDevicesListInput;
	devicesGetData: AmbientWeatherDevicesGetDataInput;
};

export type AmbientWeatherEndpointOutputs = {
	devicesList: AmbientWeatherDeviceListResponse;
	devicesGetData: AmbientWeatherDeviceDataResponse;
};

export const AmbientWeatherEndpointInputSchemas = {
	devicesList: AmbientWeatherDevicesListInputSchema,
	devicesGetData: AmbientWeatherDevicesGetDataInputSchema,
} as const;

export const AmbientWeatherEndpointOutputSchemas = {
	devicesList: AmbientWeatherDeviceListResponseSchema,
	devicesGetData: AmbientWeatherDeviceDataResponseSchema,
} as const;

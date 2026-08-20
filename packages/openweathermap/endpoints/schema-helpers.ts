import { z } from 'zod';

export const OPENWEATHERMAP_UNITS = ['standard', 'metric', 'imperial'] as const;
export type OpenWeatherMapUnits = (typeof OPENWEATHERMAP_UNITS)[number];

export const WeatherConditionSchema = z.object({
	id: z.number(),
	main: z.string(),
	description: z.string(),
	icon: z.string(),
});

export const EmptySuccessSchema = z.object({
	success: z.literal(true),
});

export type EmptySuccess = z.infer<typeof EmptySuccessSchema>;

const locationQueryShape = {
	q: z
		.string()
		.trim()
		.min(1)
		.optional()
		.describe('City name, state code, country code'),
	id: z.number().int().optional().describe('OpenWeatherMap city ID'),
	zip: z
		.string()
		.trim()
		.min(1)
		.optional()
		.describe('Zip/post code with country code'),
	lat: z.number().min(-90).max(90).optional().describe('Latitude'),
	lon: z.number().min(-180).max(180).optional().describe('Longitude'),
};

type LocationQuery = {
	q?: string;
	id?: number;
	zip?: string;
	lat?: number;
	lon?: number;
};

function hasExactlyOneLocation(input: LocationQuery): boolean {
	const hasQ = Boolean(input.q?.trim());
	const hasId = input.id !== undefined;
	const hasZip = Boolean(input.zip?.trim());
	const hasLatLon = input.lat !== undefined && input.lon !== undefined;
	const hasPartialLatLon =
		(input.lat !== undefined) !== (input.lon !== undefined);
	if (hasPartialLatLon) return false;
	const count = [hasQ, hasId, hasZip, hasLatLon].filter(Boolean).length;
	return count === 1;
}

export function withExactlyOneLocation<T extends z.ZodRawShape>(
	shape: T,
	message = 'Provide exactly one of: q, id, zip, or both lat and lon',
) {
	return z
		.object({ ...locationQueryShape, ...shape })
		.refine((input) => hasExactlyOneLocation(input as LocationQuery), {
			message,
		});
}

export function withTimeRange<T extends z.ZodRawShape>(
	shape: T,
	startKey = 'start',
	endKey = 'end',
) {
	return z.object(shape).refine(
		(input) => {
			const record = input as Record<string, number>;
			const start = record[startKey];
			const end = record[endKey];
			return (
				typeof start === 'number' && typeof end === 'number' && start <= end
			);
		},
		{ message: `${startKey} must be less than or equal to ${endKey}` },
	);
}

import { z } from 'zod';

/** Tide station. https://docs.stormglass.io/ */
export const StormglassStationEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	lat: z.number().optional(),
	lng: z.number().optional(),
	source: z.string().optional(),
});

/** Elevation for one requested point. */
export const StormglassPointEntity = z.object({
	id: z.string().min(1),
	elevation: z.number().optional(),
});

/** One high or low tide. */
export const StormglassExtremeEntity = z.object({
	id: z.string().min(1),
	time: z.string().optional(),
	type: z.string().optional(),
	height: z.number().optional(),
});

/** Daily quota from a response meta object. The coordinate is not stored. */
export const StormglassQuotaEntity = z.object({
	id: z.string().min(1),
	dailyQuota: z.number().optional(),
	requestCount: z.number().optional(),
});

export type StormglassStationEntity = z.infer<typeof StormglassStationEntity>;
export type StormglassPointEntity = z.infer<typeof StormglassPointEntity>;
export type StormglassExtremeEntity = z.infer<typeof StormglassExtremeEntity>;
export type StormglassQuotaEntity = z.infer<typeof StormglassQuotaEntity>;

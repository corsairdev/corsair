import { z } from 'zod';

/** Plan usage. https://screenshotone.com/docs/get-usage/ */
export const ScreenshotOneUsageEntity = z.object({
	id: z.string().min(1),
	total: z.number().optional(),
	available: z.number().optional(),
	used: z.number().optional(),
	concurrencyLimit: z.number().optional(),
	concurrencyRemaining: z.number().optional(),
	concurrencyReset: z.number().optional(),
});

/** Device preset. https://screenshotone.com/docs/devices/ userAgent is not stored. */
export const ScreenshotOneDeviceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
});

export type ScreenshotOneUsageEntity = z.infer<typeof ScreenshotOneUsageEntity>;
export type ScreenshotOneDeviceEntity = z.infer<
	typeof ScreenshotOneDeviceEntity
>;

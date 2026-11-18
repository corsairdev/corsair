import { z } from 'zod';

/**
 * Snapshot statistics.
 * https://guides.platerecognizer.com/docs/snapshot/api-reference/
 * Documented fields: usage.month, usage.calls, usage.year, usage.resets_on, total_calls.
 * The row key is the usage period.
 */
export const PlateRecognizerUsageEntity = z.object({
	id: z.string().min(1),
	year: z.number().int(),
	month: z.number().int(),
	calls: z.number().int(),
	resetsOn: z.string().min(1),
	totalCalls: z.number().int(),
});

export type PlateRecognizerUsageEntity = z.infer<
	typeof PlateRecognizerUsageEntity
>;

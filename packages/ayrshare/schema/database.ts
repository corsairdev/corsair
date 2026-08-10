import { z } from 'zod';

export const AyrshareAutoSchedule = z.object({
	title: z.string(),
	schedule: z.array(z.string()),
	daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
	lastScheduleDate: z.string().optional(),
});
export type AyrshareAutoSchedule = z.infer<typeof AyrshareAutoSchedule>;

import { z } from 'zod';

export const OuraPersonalInfo = z.object({
	id: z.string(),
	age: z.number().nullable().optional(),
	weight: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	biological_sex: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

export const OuraDailyActivity = z.object({
	id: z.string(),
	day: z.string(),
	score: z.number().nullable().optional(),
	active_calories: z.number().nullable().optional(),
	steps: z.number().nullable().optional(),
	total_calories: z.number().nullable().optional(),
	high_activity_time: z.number().nullable().optional(),
	medium_activity_time: z.number().nullable().optional(),
	low_activity_time: z.number().nullable().optional(),
	sedentary_time: z.number().nullable().optional(),
	resting_time: z.number().nullable().optional(),
	timestamp: z.string().optional(),
});

export const OuraDailyReadiness = z.object({
	id: z.string(),
	day: z.string(),
	score: z.number().nullable().optional(),
	temperature_deviation: z.number().nullable().optional(),
	temperature_trend_deviation: z.number().nullable().optional(),
	timestamp: z.string().optional(),
});

export const OuraDailySleep = z.object({
	id: z.string(),
	day: z.string(),
	score: z.number().nullable().optional(),
	timestamp: z.string().optional(),
});

export type OuraPersonalInfo = z.infer<typeof OuraPersonalInfo>;
export type OuraDailyActivity = z.infer<typeof OuraDailyActivity>;
export type OuraDailyReadiness = z.infer<typeof OuraDailyReadiness>;
export type OuraDailySleep = z.infer<typeof OuraDailySleep>;

import { z } from 'zod';

// ── Input Schemas ────────────────────────────────────────────────────────────

const ProfileGetInputSchema = z.object({});

const SummaryGetActivityInputSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	next_token: z.string().optional(),
});

const SummaryGetReadinessInputSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	next_token: z.string().optional(),
});

const SummaryGetSleepInputSchema = z.object({
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	next_token: z.string().optional(),
});

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const ActivityContributorsSchema = z
	.object({
		meet_daily_targets: z.number().nullable().optional(),
		move_every_hour: z.number().nullable().optional(),
		recovery_time: z.number().nullable().optional(),
		stay_active: z.number().nullable().optional(),
		training_frequency: z.number().nullable().optional(),
		training_volume: z.number().nullable().optional(),
	})
	.passthrough();

const ReadinessContributorsSchema = z
	.object({
		activity_balance: z.number().nullable().optional(),
		body_temperature: z.number().nullable().optional(),
		hrv_balance: z.number().nullable().optional(),
		previous_day_activity: z.number().nullable().optional(),
		previous_night: z.number().nullable().optional(),
		recovery_index: z.number().nullable().optional(),
		resting_heart_rate: z.number().nullable().optional(),
		sleep_balance: z.number().nullable().optional(),
	})
	.passthrough();

const SleepContributorsSchema = z
	.object({
		deep_sleep: z.number().nullable().optional(),
		efficiency: z.number().nullable().optional(),
		latency: z.number().nullable().optional(),
		rem_sleep: z.number().nullable().optional(),
		restfulness: z.number().nullable().optional(),
		timing: z.number().nullable().optional(),
		total_sleep: z.number().nullable().optional(),
	})
	.passthrough();

// ── Output Schemas ───────────────────────────────────────────────────────────

const ProfileGetResponseSchema = z.object({
	id: z.string(),
	age: z.number().nullable().optional(),
	weight: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	biological_sex: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

const DailyActivitySchema = z
	.object({
		id: z.string(),
		class_5_min: z.string().nullable().optional(),
		score: z.number().nullable().optional(),
		active_calories: z.number().optional(),
		average_met_minutes: z.number().optional(),
		contributors: ActivityContributorsSchema.optional(),
		equivalent_walking_distance: z.number().optional(),
		high_activity_met_minutes: z.number().optional(),
		high_activity_time: z.number().optional(),
		inactivity_alerts: z.number().optional(),
		low_activity_met_minutes: z.number().optional(),
		low_activity_time: z.number().optional(),
		medium_activity_met_minutes: z.number().optional(),
		medium_activity_time: z.number().optional(),
		meters_to_target: z.number().optional(),
		non_wear_time: z.number().optional(),
		resting_time: z.number().optional(),
		sedentary_met_minutes: z.number().optional(),
		sedentary_time: z.number().optional(),
		steps: z.number().optional(),
		target_calories: z.number().optional(),
		target_meters: z.number().optional(),
		total_calories: z.number().optional(),
		day: z.string(),
		timestamp: z.string(),
	})
	.passthrough();

const DailyReadinessSchema = z
	.object({
		id: z.string(),
		contributors: ReadinessContributorsSchema.optional(),
		day: z.string(),
		score: z.number().nullable().optional(),
		temperature_deviation: z.number().nullable().optional(),
		temperature_trend_deviation: z.number().nullable().optional(),
		timestamp: z.string(),
	})
	.passthrough();

const DailySleepSchema = z
	.object({
		id: z.string(),
		contributors: SleepContributorsSchema.optional(),
		day: z.string(),
		score: z.number().nullable().optional(),
		timestamp: z.string(),
	})
	.passthrough();

const SummaryGetActivityResponseSchema = z.object({
	data: z.array(DailyActivitySchema),
	next_token: z.string().nullable().optional(),
});

const SummaryGetReadinessResponseSchema = z.object({
	data: z.array(DailyReadinessSchema),
	next_token: z.string().nullable().optional(),
});

const SummaryGetSleepResponseSchema = z.object({
	data: z.array(DailySleepSchema),
	next_token: z.string().nullable().optional(),
});

// ── Named Types ──────────────────────────────────────────────────────────────

export type ProfileGetInput = z.infer<typeof ProfileGetInputSchema>;
export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>;

export type SummaryGetActivityInput = z.infer<
	typeof SummaryGetActivityInputSchema
>;
export type SummaryGetActivityResponse = z.infer<
	typeof SummaryGetActivityResponseSchema
>;

export type SummaryGetReadinessInput = z.infer<
	typeof SummaryGetReadinessInputSchema
>;
export type SummaryGetReadinessResponse = z.infer<
	typeof SummaryGetReadinessResponseSchema
>;

export type SummaryGetSleepInput = z.infer<typeof SummaryGetSleepInputSchema>;
export type SummaryGetSleepResponse = z.infer<
	typeof SummaryGetSleepResponseSchema
>;

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type OuraEndpointInputs = {
	profileGet: ProfileGetInput;
	summaryGetActivity: SummaryGetActivityInput;
	summaryGetReadiness: SummaryGetReadinessInput;
	summaryGetSleep: SummaryGetSleepInput;
};

export type OuraEndpointOutputs = {
	profileGet: ProfileGetResponse;
	summaryGetActivity: SummaryGetActivityResponse;
	summaryGetReadiness: SummaryGetReadinessResponse;
	summaryGetSleep: SummaryGetSleepResponse;
};

export const OuraEndpointInputSchemas = {
	profileGet: ProfileGetInputSchema,
	summaryGetActivity: SummaryGetActivityInputSchema,
	summaryGetReadiness: SummaryGetReadinessInputSchema,
	summaryGetSleep: SummaryGetSleepInputSchema,
} as const;

export const OuraEndpointOutputSchemas = {
	profileGet: ProfileGetResponseSchema,
	summaryGetActivity: SummaryGetActivityResponseSchema,
	summaryGetReadiness: SummaryGetReadinessResponseSchema,
	summaryGetSleep: SummaryGetSleepResponseSchema,
} as const;

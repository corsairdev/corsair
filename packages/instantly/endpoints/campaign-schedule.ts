import { z } from 'zod';
import {
	ACCEPTED_TIMEZONES,
	TIMEZONE_ALIAS_SUMMARY,
	toInstantlyTimezone,
} from './timezones';

// Campaign and subsequence schedules and email sequences share one shape.

const HourMinute = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected HH:MM, 24-hour')
	.describe('HH:MM, 24-hour, e.g. 09:00');

const Weekday = z.boolean().optional();

export const ScheduleSchema = z.object({
	name: z.string().min(1).describe('Schedule name, e.g. Weekdays'),
	timing: z.object({ from: HourMinute, to: HourMinute }),
	days: z
		.object({
			'0': Weekday.describe('Sunday'),
			'1': Weekday.describe('Monday'),
			'2': Weekday.describe('Tuesday'),
			'3': Weekday.describe('Wednesday'),
			'4': Weekday.describe('Thursday'),
			'5': Weekday.describe('Friday'),
			'6': Weekday.describe('Saturday'),
		})
		.describe(
			'Days to send on: "0" is Sunday through "6" Saturday, e.g. `{ "1": true, ..., "5": true }` for weekdays',
		),
	timezone: z
		.enum(ACCEPTED_TIMEZONES, {
			error:
				"Not a time zone Instantly accepts. Use one from Instantly's list or a mapped alias such as America/New_York. Pacific time (America/Los_Angeles) has no exact match: Instantly's America/Dawson stays at UTC-7 all year.",
		})
		.describe(
			`A zone from Instantly's list (not all of IANA), or a common IANA zone it lacks, which is sent as the listed zone with the same offsets and DST rules: ${TIMEZONE_ALIAS_SUMMARY}. Zones with no exact match are rejected, including Pacific time (America/Los_Angeles, America/Vancouver): Instantly's America/Dawson stays at UTC-7 all year`,
		),
});

export const CampaignScheduleSchema = z.object({
	schedules: z.array(ScheduleSchema).min(1),
	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
		.nullish()
		.describe("YYYY-MM-DD in the schedule's time zone"),
	end_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
		.nullish(),
});

export const VariantSchema = z.object({
	subject: z
		.string()
		.describe(
			'Subject line; leave empty on a follow-up to thread it under the previous email. Variables like `{{firstName}}` work',
		),
	body: z
		.string()
		.describe(
			'Email body as HTML; use `<br/>` for line breaks. Variables: `{{firstName}}`, `{{lastName}}`, `{{companyName}}`, `{{personalization}}` and custom variables',
		),
	v_disabled: z.boolean().optional().describe('Turn this variant off'),
});

export const StepSchema = z.object({
	type: z.literal('email').default('email'),
	delay: z
		.number()
		.min(0)
		.max(527_040)
		.describe(
			'How long to wait after this step before sending the NEXT step (not before this one), in delay_unit',
		),
	delay_unit: z.enum(['minutes', 'hours', 'days']).optional(),
	pre_delay: z
		.number()
		.min(0)
		.max(527_040)
		.optional()
		.describe(
			'Subsequences only: how long to wait before the FIRST step, in pre_delay_unit',
		),
	pre_delay_unit: z.enum(['minutes', 'hours', 'days']).optional(),
	variants: z
		.array(VariantSchema)
		.min(1)
		.describe('A/B variants of this step; at least one'),
});

export const SequencesSchema = z
	.array(z.object({ steps: z.array(StepSchema).min(1) }))
	.length(1)
	.describe(
		'Exactly one sequence holding every step: Instantly reads only the first element',
	);

type CampaignSchedule = z.output<typeof CampaignScheduleSchema>;

/**
 * Aliases such as America/New_York are sent as the listed zone Instantly
 * accepts (America/Detroit); see INSTANTLY_TIMEZONE_ALIASES. Used by
 * campaigns and subsequences.
 */
export function withInstantlyTimezones(
	schedule: CampaignSchedule,
): CampaignSchedule {
	return {
		...schedule,
		schedules: schedule.schedules.map((entry) => ({
			...entry,
			timezone: toInstantlyTimezone(entry.timezone),
		})),
	};
}

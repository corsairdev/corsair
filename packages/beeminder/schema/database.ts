import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://api.beeminder.com
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const Id = z.string();

/**
 * A Beeminder user.
 *
 * Minimal fields from the documented schema. The user object can carry
 * additional undocumented fields; `.loose()` lets those through.
 */
export const BeeminderUserEntity = z
	.object({
		username: S,
		timezone: S,
		updated_at: N,
		goals: z.array(z.string()).nullable().optional(),
		deleted_goals: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		deadbeat: B,
		urgency_load: N,
	})
	.loose();
export type BeeminderUserEntity = z.infer<typeof BeeminderUserEntity>;

/**
 * A Beeminder goal.
 *
 * The full goal object has dozens of fields. The most commonly used ones are
 * modelled explicitly; the rest pass through under `.loose()`.
 */
export const BeeminderGoalEntity = z
	.object({
		id: Id,
		slug: S,
		title: S,
		fineprint: S,
		yaxis: S,
		goaldate: N,
		goalval: N,
		rate: N,
		runits: S,
		svg_url: S,
		graph_url: S,
		thumb_url: S,
		autodata: S,
		goal_type: S,
		losedate: N,
		urgencykey: S,
		queued: B,
		secret: B,
		datapublic: B,
		numpts: N,
		pledge: N,
		initday: N,
		initval: N,
		curday: N,
		curval: N,
		currate: N,
		lastday: N,
		yaw: N,
		dir: N,
		lane: N,
		mathishard: z.array(z.number()).nullable().optional(),
		headsum: S,
		limsum: S,
		kyoom: B,
		odom: B,
		aggday: S,
		steppy: B,
		rosy: B,
		movingav: B,
		aura: B,
		frozen: B,
		won: B,
		lost: B,
		maxflux: N,
		contract: z.record(z.string(), z.unknown()).nullable().optional(),
		road: z.array(z.unknown()).nullable().optional(),
		roadall: z.array(z.unknown()).nullable().optional(),
		fullroad: z.array(z.unknown()).nullable().optional(),
		rah: N,
		delta: N,
		delta_text: S,
		safebuf: N,
		colorkey: S,
		colorhex: S,
		safebump: N,
		autoratchet: N,
		callback_url: S,
		description: S,
		graphsum: S,
		lanewidth: N,
		deadline: N,
		leadtime: N,
		alertstart: N,
		plotall: B,
		integery: B,
		gunits: S,
		timey: B,
		hhmmformat: B,
		todayta: B,
		weekends_off: B,
		tmin: S,
		tmax: S,
		tags: z.array(z.string()).nullable().optional(),
		archivedate: N,
		updated_at: N,
	})
	.loose();
export type BeeminderGoalEntity = z.infer<typeof BeeminderGoalEntity>;

/**
 * A Beeminder charge.
 *
 * Represents a monetary charge to a user.
 */
export const BeeminderChargeEntity = z
	.object({
		id: Id,
		amount: N,
		note: S,
		username: S,
	})
	.loose();
export type BeeminderChargeEntity = z.infer<typeof BeeminderChargeEntity>;

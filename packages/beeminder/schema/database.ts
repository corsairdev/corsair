import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://api.beeminder.com
 */

/** Optional documented fields. Identifying keys are required below, not these. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** Graph-matrix row: 2 of 3 of [time, value, rate] are set; the rest are null. */
const RoadRow = z.array(z.number().nullable());

/**
 * Datapoint nested on a Goal when `datapoints` / `last_datapoint` is present.
 */
export const BeeminderDatapointEntity = z
	.object({
		id: S,
		timestamp: N,
		daystamp: S,
		value: N,
		comment: S,
		updated_at: N,
		requestid: S,
		origin: S,
		creator: S,
		is_dummy: B,
		is_initial: B,
		created_at: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.loose();
export type BeeminderDatapointEntity = z.infer<typeof BeeminderDatapointEntity>;

export const BeeminderGoalEntity = z
	.object({
		id: S,
		slug: z.string(),
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
		datapoints: z.array(BeeminderDatapointEntity).nullable().optional(),
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
		mathishard: z
			.tuple([z.number(), z.number(), z.number()])
			.nullable()
			.optional(),
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
		contract: z
			.object({
				amount: N,
				stepdown_at: N,
			})
			.loose()
			.nullable()
			.optional(),
		road: z.array(RoadRow).nullable().optional(),
		roadall: z.array(RoadRow).nullable().optional(),
		fullroad: z.array(RoadRow).nullable().optional(),
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
		last_datapoint: BeeminderDatapointEntity.nullable().optional(),
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
		burner: S,
		updated_at: N,
	})
	.loose();
export type BeeminderGoalEntity = z.infer<typeof BeeminderGoalEntity>;

/**
 * `goals` is slug strings by default, or Goal objects when `associations`
 * / `diff_since` is sent.
 */
export const BeeminderUserEntity = z
	.object({
		username: z.string(),
		timezone: S,
		updated_at: N,
		goals: z
			.array(z.union([z.string(), BeeminderGoalEntity]))
			.nullable()
			.optional(),
		deleted_goals: z
			.array(
				z
					.object({
						id: z.string(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		deadbeat: B,
		urgency_load: N,
	})
	.loose();
export type BeeminderUserEntity = z.infer<typeof BeeminderUserEntity>;

export const BeeminderChargeEntity = z
	.object({
		id: z.string(),
		amount: z.number(),
		note: S,
		username: z.string(),
	})
	.loose();
export type BeeminderChargeEntity = z.infer<typeof BeeminderChargeEntity>;

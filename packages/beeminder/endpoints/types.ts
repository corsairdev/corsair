import { z } from 'zod';
import {
	BeeminderChargeEntity,
	BeeminderGoalEntity,
	BeeminderUserEntity,
} from '../schema/database';

/**
 * Input and output schemas for every Beeminder operation.
 *
 * Output schemas reuse the entity definitions in `schema/database.ts` rather
 * than restating them, so the persisted shape and the returned shape cannot
 * drift apart.
 */

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

const UserGetInputSchema = z.object({});
export type UserGetInput = z.infer<typeof UserGetInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Goals                                   */
/* -------------------------------------------------------------------------- */

const GoalsListInputSchema = z.object({
	/**
	 * Strip road, roadall, and fullroad from the response.
	 * Default: false.
	 */
	emaciated: z.boolean().optional(),
});
export type GoalsListInput = z.infer<typeof GoalsListInputSchema>;

const GoalsListArchivedInputSchema = z.object({
	emaciated: z.boolean().optional(),
});
export type GoalsListArchivedInput = z.infer<
	typeof GoalsListArchivedInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                   Charges                                  */
/* -------------------------------------------------------------------------- */

const ChargesCreateInputSchema = z.object({
	/** Username of the user who is getting charged. */
	user_id: z.string(),
	/** Amount in US dollars. Minimum $1.00. */
	amount: z.number().min(1.0),
	note: z.string().optional(),
	dryrun: z.boolean().optional(),
});
export type ChargesCreateInput = z.infer<typeof ChargesCreateInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Registry                                  */
/* -------------------------------------------------------------------------- */

export type BeeminderEndpointInputs = {
	userGet: UserGetInput;

	goalsList: GoalsListInput;
	goalsListArchived: GoalsListArchivedInput;

	chargesCreate: ChargesCreateInput;
};

export type BeeminderEndpointOutputs = {
	userGet: z.infer<typeof BeeminderUserEntity>;

	goalsList: z.infer<typeof BeeminderGoalEntity>[];
	goalsListArchived: z.infer<typeof BeeminderGoalEntity>[];

	chargesCreate: z.infer<typeof BeeminderChargeEntity>;
};

export const BeeminderEndpointInputSchemas = {
	userGet: UserGetInputSchema,

	goalsList: GoalsListInputSchema,
	goalsListArchived: GoalsListArchivedInputSchema,

	chargesCreate: ChargesCreateInputSchema,
} as const;

export const BeeminderEndpointOutputSchemas = {
	userGet: BeeminderUserEntity,

	goalsList: z.array(BeeminderGoalEntity),
	goalsListArchived: z.array(BeeminderGoalEntity),

	chargesCreate: BeeminderChargeEntity,
} as const;

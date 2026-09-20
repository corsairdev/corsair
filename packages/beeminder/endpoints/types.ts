import { z } from 'zod';
import {
	BeeminderChargeEntity,
	BeeminderGoalEntity,
	BeeminderUserEntity,
} from '../schema/database';

const UserGetInputSchema = z.object({
	associations: z.boolean().optional(),
	diff_since: z.number().optional(),
	skinny: z.boolean().optional(),
	emaciated: z.boolean().optional(),
	datapoints_count: z.number().optional(),
});
export type UserGetInput = z.infer<typeof UserGetInputSchema>;

const GoalsListInputSchema = z.object({
	emaciated: z.boolean().optional(),
});
export type GoalsListInput = z.infer<typeof GoalsListInputSchema>;

const GoalsListArchivedInputSchema = z.object({
	emaciated: z.boolean().optional(),
});
export type GoalsListArchivedInput = z.infer<
	typeof GoalsListArchivedInputSchema
>;

const ChargesCreateInputSchema = z.object({
	user_id: z.string(),
	amount: z.number().min(1.0),
	note: z.string().optional(),
	dryrun: z.boolean().optional(),
});
export type ChargesCreateInput = z.infer<typeof ChargesCreateInputSchema>;

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

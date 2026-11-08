import { z } from 'zod';
import { FubMetadataSchema, IdSchema, ListQuerySchema } from './types';

// Inputs use Follow Up Boss's own parameter names; outputs are `.loose()` and
// their documented fields nullish, so a field FUB adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.followupboss.com/reference

// ── automations ────────────────────────────────────────────────────────────

// unknown: the published example response for /automations is an empty object,
// so only the fields its own operations imply are declared and the rest passes
// through as sent.
export const AutomationSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type FollowUpBossAutomation = z.infer<typeof AutomationSchema>;

const AutomationsListInputSchema = ListQuerySchema.extend({
	status: z.string().optional().describe('`Active`, `Disabled` or `Deleted`.'),
	enabledOnly: z.boolean().optional(),
	manualOnly: z.boolean().optional(),
});

export type AutomationsListInput = z.infer<typeof AutomationsListInputSchema>;

const AutomationsListResponseSchema = z
	.object({
		automations: z.array(AutomationSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type AutomationsListResponse = z.infer<
	typeof AutomationsListResponseSchema
>;

const AutomationsGetInputSchema = z.object({
	id: IdSchema.describe('The automation ID.'),
});

export type AutomationsGetInput = z.infer<typeof AutomationsGetInputSchema>;

const AutomationsGetResponseSchema = AutomationSchema;

export type AutomationsGetResponse = z.infer<
	typeof AutomationsGetResponseSchema
>;

// ── automations people ─────────────────────────────────────────────────────

export const AutomationPersonSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		createdById: z.number().nullish(),
		updatedById: z.number().nullish(),
		createdBy: z.string().nullish(),
		updatedBy: z.string().nullish(),
		personId: z.number().nullish(),
		automationId: z.number().nullish(),
		status: z.string().nullish(),
		automationName: z.string().nullish(),
	})
	.loose();

export type FollowUpBossAutomationPerson = z.infer<
	typeof AutomationPersonSchema
>;

// The published spec wraps its enum values in extra quotes (`"Running"`),
// which are normalized to the documented plain values here.
const AUTOMATION_RUN_STATUSES = [
	'Initial',
	'Running',
	'Paused',
	'Completed',
] as const;

const AutomationsPeopleListInputSchema = ListQuerySchema.extend({
	personId: z.number().int().optional(),
	automationId: z.number().int().optional(),
	status: z.enum(AUTOMATION_RUN_STATUSES).optional(),
});

export type AutomationsPeopleListInput = z.infer<
	typeof AutomationsPeopleListInputSchema
>;

const AutomationsPeopleListResponseSchema = z
	.object({
		automationsPeople: z.array(AutomationPersonSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type AutomationsPeopleListResponse = z.infer<
	typeof AutomationsPeopleListResponseSchema
>;

// The published contract marks neither field required; FUB pairs whichever
// ids are sent.
const AutomationsPeopleCreateInputSchema = z.object({
	automationId: z
		.number()
		.int()
		.optional()
		.describe('ID of an existing Automation to trigger.'),
	personId: z
		.number()
		.int()
		.optional()
		.describe('ID of an existing Person to run the Automation for.'),
});

export type AutomationsPeopleCreateInput = z.infer<
	typeof AutomationsPeopleCreateInputSchema
>;

// FUB answers 201 with the created pairing.
const AutomationsPeopleCreateResponseSchema = AutomationPersonSchema;

export type AutomationsPeopleCreateResponse = z.infer<
	typeof AutomationsPeopleCreateResponseSchema
>;

// The published contract does not mark `status` required, so a bare PUT stays
// schema-valid.
const AutomationsPeopleUpdateInputSchema = z.object({
	id: IdSchema.describe('The automation-person pairing ID.'),
	status: z
		.enum(['Running', 'Paused'])
		.optional()
		.describe('`Paused` to pause the automation or `Running` to unpause it.'),
});

export type AutomationsPeopleUpdateInput = z.infer<
	typeof AutomationsPeopleUpdateInputSchema
>;

const AutomationsPeopleUpdateResponseSchema = AutomationPersonSchema;

export type AutomationsPeopleUpdateResponse = z.infer<
	typeof AutomationsPeopleUpdateResponseSchema
>;

const AutomationsPeopleGetInputSchema = z.object({
	id: IdSchema.describe('The automation-person pairing ID.'),
});

export type AutomationsPeopleGetInput = z.infer<
	typeof AutomationsPeopleGetInputSchema
>;

const AutomationsPeopleGetResponseSchema = AutomationPersonSchema;

export type AutomationsPeopleGetResponse = z.infer<
	typeof AutomationsPeopleGetResponseSchema
>;

// ── action plans ───────────────────────────────────────────────────────────

export const ActionPlanSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type FollowUpBossActionPlan = z.infer<typeof ActionPlanSchema>;

const ActionPlansListInputSchema = ListQuerySchema.extend({
	sort: z.string().optional(),
	status: z
		.string()
		.optional()
		.describe('`Active`, `Deleted`, or `Active,Deleted` for both.'),
	names: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'Action plan names to match; sent as the repeated `names[]` array filter.',
		),
	ids: z
		.string()
		.optional()
		.describe('Comma separated action plan IDs, e.g. `287564,67484`.'),
});

export type ActionPlansListInput = z.infer<typeof ActionPlansListInputSchema>;

const ActionPlansListResponseSchema = z
	.object({
		actionPlans: z.array(ActionPlanSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type ActionPlansListResponse = z.infer<
	typeof ActionPlansListResponseSchema
>;

// ── action plans people ────────────────────────────────────────────────────

export const ActionPlanPersonSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		personId: z.number().nullish(),
		actionPlanId: z.number().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type FollowUpBossActionPlanPerson = z.infer<
	typeof ActionPlanPersonSchema
>;

const ActionPlansPeopleListInputSchema = ListQuerySchema.extend({
	personId: z
		.number()
		.int()
		.optional()
		.describe('List action plans applied to this person.'),
	actionPlanId: z
		.number()
		.int()
		.optional()
		.describe('List the people on this action plan.'),
});

export type ActionPlansPeopleListInput = z.infer<
	typeof ActionPlansPeopleListInputSchema
>;

const ActionPlansPeopleListResponseSchema = z
	.object({
		actionPlansPeople: z.array(ActionPlanPersonSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type ActionPlansPeopleListResponse = z.infer<
	typeof ActionPlansPeopleListResponseSchema
>;

const ActionPlansPeopleCreateInputSchema = z.object({
	personId: z
		.number()
		.int()
		.describe('The person to apply the action plan to.'),
	actionPlanId: z.number().int().describe('The action plan to apply.'),
});

export type ActionPlansPeopleCreateInput = z.infer<
	typeof ActionPlansPeopleCreateInputSchema
>;

// The published example answers 200 with an empty body, so every field of the
// pairing stays optional.
const ActionPlansPeopleCreateResponseSchema = ActionPlanPersonSchema;

export type ActionPlansPeopleCreateResponse = z.infer<
	typeof ActionPlansPeopleCreateResponseSchema
>;

const ActionPlansPeopleUpdateInputSchema = z.object({
	id: IdSchema.describe('The action-plan-person pairing ID.'),
	status: z
		.enum(['Running', 'Paused'])
		.describe('The desired state of the applied action plan.'),
});

export type ActionPlansPeopleUpdateInput = z.infer<
	typeof ActionPlansPeopleUpdateInputSchema
>;

const ActionPlansPeopleUpdateResponseSchema = ActionPlanPersonSchema;

export type ActionPlansPeopleUpdateResponse = z.infer<
	typeof ActionPlansPeopleUpdateResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export type AutomationsEndpointInputs = {
	automationsList: AutomationsListInput;
	automationsGet: AutomationsGetInput;
	automationsPeopleList: AutomationsPeopleListInput;
	automationsPeopleCreate: AutomationsPeopleCreateInput;
	automationsPeopleUpdate: AutomationsPeopleUpdateInput;
	automationsPeopleGet: AutomationsPeopleGetInput;
	actionPlansList: ActionPlansListInput;
	actionPlansPeopleList: ActionPlansPeopleListInput;
	actionPlansPeopleCreate: ActionPlansPeopleCreateInput;
	actionPlansPeopleUpdate: ActionPlansPeopleUpdateInput;
};

export type AutomationsEndpointOutputs = {
	automationsList: AutomationsListResponse;
	automationsGet: AutomationsGetResponse;
	automationsPeopleList: AutomationsPeopleListResponse;
	automationsPeopleCreate: AutomationsPeopleCreateResponse;
	automationsPeopleUpdate: AutomationsPeopleUpdateResponse;
	automationsPeopleGet: AutomationsPeopleGetResponse;
	actionPlansList: ActionPlansListResponse;
	actionPlansPeopleList: ActionPlansPeopleListResponse;
	actionPlansPeopleCreate: ActionPlansPeopleCreateResponse;
	actionPlansPeopleUpdate: ActionPlansPeopleUpdateResponse;
};

export const AutomationsInputSchemas = {
	automationsList: AutomationsListInputSchema,
	automationsGet: AutomationsGetInputSchema,
	automationsPeopleList: AutomationsPeopleListInputSchema,
	automationsPeopleCreate: AutomationsPeopleCreateInputSchema,
	automationsPeopleUpdate: AutomationsPeopleUpdateInputSchema,
	automationsPeopleGet: AutomationsPeopleGetInputSchema,
	actionPlansList: ActionPlansListInputSchema,
	actionPlansPeopleList: ActionPlansPeopleListInputSchema,
	actionPlansPeopleCreate: ActionPlansPeopleCreateInputSchema,
	actionPlansPeopleUpdate: ActionPlansPeopleUpdateInputSchema,
} as const;

export const AutomationsOutputSchemas = {
	automationsList: AutomationsListResponseSchema,
	automationsGet: AutomationsGetResponseSchema,
	automationsPeopleList: AutomationsPeopleListResponseSchema,
	automationsPeopleCreate: AutomationsPeopleCreateResponseSchema,
	automationsPeopleUpdate: AutomationsPeopleUpdateResponseSchema,
	automationsPeopleGet: AutomationsPeopleGetResponseSchema,
	actionPlansList: ActionPlansListResponseSchema,
	actionPlansPeopleList: ActionPlansPeopleListResponseSchema,
	actionPlansPeopleCreate: ActionPlansPeopleCreateResponseSchema,
	actionPlansPeopleUpdate: ActionPlansPeopleUpdateResponseSchema,
} as const;

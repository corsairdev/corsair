import { z } from 'zod';
import {
	CustomFieldInputsSchema,
	DeletedResponseSchema,
	FubFlagSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// The deals family: deals, pipelines, stages, deal custom fields, deal
// attachments and appointment outcomes. Inputs use Follow Up Boss's own
// parameter names; outputs are `.loose()` and their documented fields nullish,
// so a field FUB adds or omits cannot fail a call that has already happened.
// Field reference: https://docs.followupboss.com/reference
//
// Contract quirks kept verbatim (see also the handlers):
// - PUT /deals/{id} documents the request fields `agentCommision` and
//   `teamComission` (one `s`), while POST /deals and every response use
//   `agentCommission`/`teamCommission`; the documented PUT spellings are sent.
// - The deal custom field list envelope is keyed `dealCustomfields` and the
//   appointment outcome list envelope `appointmentoutcomes` (lowercase), while
//   their resource paths are camelCase; the documented spellings are the
//   result keys and the camelCase variants are accepted from the wire.
// - POST /deals answers 200 with the bare deal (not 201), and the
//   dealAttachments GET/PUT document 201 as their success code.
// - Deals carry their user-defined custom fields as flat `customField1`-style
//   keys, which `.loose()` passes through.

// ── entities ───────────────────────────────────────────────────────────────

const DealPersonSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		avatar: z.string().nullish(),
	})
	.loose();

const DealUserSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const DealSchema = z
	.object({
		id: IdSchema.nullish(),
		pipelineId: IdSchema.nullish(),
		stageId: IdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		type: z.number().nullish(),
		status: z.string().nullish(),
		price: z.number().nullish(),
		createdAt: z.string().nullish(),
		enteredStageAt: z.string().nullish(),
		projectedCloseDate: z.string().nullish(),
		earnestMoneyDueDate: z.string().nullish(),
		mutualAcceptanceDate: z.string().nullish(),
		dueDiligenceDate: z.string().nullish(),
		finalWalkThroughDate: z.string().nullish(),
		possessionDate: z.string().nullish(),
		orderWeight: z.number().nullish(),
		commissionValue: z.number().nullish(),
		agentCommission: z.number().nullish(),
		teamCommission: z.number().nullish(),
		peopleIds: z.array(IdSchema).nullish(),
		userIds: z.array(IdSchema).nullish(),
		people: z.array(DealPersonSchema).nullish(),
		users: z.array(DealUserSchema).nullish(),
	})
	.loose();

export type FollowUpBossDeal = z.infer<typeof DealSchema>;

// Stage objects appear both under pipelines and in the top-level /stages
// collection, so the schema is the documented superset.
export const StageSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		orderWeight: z.number().nullish(),
		color: z.string().nullish(),
		closedStage: FubFlagSchema.nullish(),
		isProtected: FubFlagSchema.nullish(),
		peopleCount: z.number().nullish(),
	})
	.loose();

export type FollowUpBossStage = z.infer<typeof StageSchema>;

export const PipelineSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		orderWeight: z.number().nullish(),
		stages: z.array(StageSchema).nullish(),
	})
	.loose();

export type FollowUpBossPipeline = z.infer<typeof PipelineSchema>;

export const DealCustomFieldSchema = z
	.object({
		id: IdSchema.nullish(),
		label: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		choices: z.array(z.string()).nullish(),
		isRecurring: FubFlagSchema.nullish(),
		orderWeight: z.number().nullish(),
		hideIfEmpty: FubFlagSchema.nullish(),
		readOnly: FubFlagSchema.nullish(),
	})
	.loose();

export type FollowUpBossDealCustomField = z.infer<typeof DealCustomFieldSchema>;

export const DealAttachmentSchema = z
	.object({
		id: IdSchema.nullish(),
		dealId: IdSchema.nullish(),
		uri: z.string().nullish(),
		fileName: z.string().nullish(),
		fileSize: z.number().nullish(),
		mimeType: z.string().nullish(),
		thumbnailUri: z.string().nullish(),
		status: z.string().nullish(),
		createdAt: z.string().nullish(),
		createdById: IdSchema.nullish(),
		createdByName: z.string().nullish(),
	})
	.loose();

export type FollowUpBossDealAttachment = z.infer<typeof DealAttachmentSchema>;

export const AppointmentOutcomeSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		orderWeight: z.number().nullish(),
	})
	.loose();

export type FollowUpBossAppointmentOutcome = z.infer<
	typeof AppointmentOutcomeSchema
>;

// ── envelopes ──────────────────────────────────────────────────────────────

const DealEnvelopeSchema = z
	.object({
		deals: z.array(DealSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const PipelineEnvelopeSchema = z
	.object({
		pipelines: z.array(PipelineSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const StageEnvelopeSchema = z
	.object({
		stages: z.array(StageSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// FUB publishes this list under the envelope key `dealCustomfields` while the
// resource path is `/dealCustomFields`.
const DealCustomFieldEnvelopeSchema = z
	.object({
		dealCustomfields: z.array(DealCustomFieldSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// FUB publishes this list under the all-lowercase envelope key
// `appointmentoutcomes` while the resource path is camelCase.
const AppointmentOutcomeEnvelopeSchema = z
	.object({
		appointmentoutcomes: z.array(AppointmentOutcomeSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// ── deals ──────────────────────────────────────────────────────────────────

export const DEAL_STATUSES = ['Active', 'Archived', 'Deleted'] as const;

const DealsListInputSchema = ListQuerySchema.extend({
	pipelineId: z.number().int().optional(),
	userId: z.number().int().optional(),
	personId: z.number().int().optional(),
	includeDeleted: z
		.number()
		.int()
		.optional()
		.describe('Set to `1` to include deals with a status of `Deleted`.'),
	includeArchived: z
		.number()
		.int()
		.optional()
		.describe('Set to `1` to include deals with a status of `Archived`.'),
	status: z.enum(DEAL_STATUSES).optional(),
});

export type DealsListInput = z.infer<typeof DealsListInputSchema>;

const DealsListResponseSchema = DealEnvelopeSchema;

export type DealsListResponse = z.infer<typeof DealsListResponseSchema>;

const DealsGetInputSchema = z.object({
	id: IdSchema.describe('The deal ID.'),
});

export type DealsGetInput = z.infer<typeof DealsGetInputSchema>;

const DealsGetResponseSchema = DealSchema;

export type DealsGetResponse = z.infer<typeof DealsGetResponseSchema>;

// The five YYYY-MM-DD milestone dates are sent as plain strings.
const DealsCreateInputSchema = z.object({
	name: z.string().describe('Name of the deal.'),
	stageId: IdSchema.describe('The stage that this deal should be assigned to.'),
	description: z.string().optional(),
	customFields: CustomFieldInputsSchema.optional().describe(
		'Deal custom field values keyed by their `custom…` name (e.g. `{ customClosingDate: "2026-12-01" }`); sent as top-level fields.',
	),
	peopleIds: z
		.array(IdSchema)
		.optional()
		.describe('Person ids that should be part of this deal.'),
	userIds: z
		.array(IdSchema)
		.optional()
		.describe('User ids that should be part of this deal.'),
	price: z.number().int().optional(),
	projectedCloseDate: z.string().optional(),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('Set this value to enforce a specific sort order.'),
	commissionValue: z
		.number()
		.int()
		.optional()
		.describe('Commission value to assign to this deal.'),
	agentCommission: z
		.number()
		.int()
		.optional()
		.describe('Commission split for the agent split.'),
	teamCommission: z
		.number()
		.int()
		.optional()
		.describe('Commission split for the team split.'),
	earnestMoneyDueDate: z.string().optional(),
	mutualAcceptanceDate: z.string().optional(),
	dueDiligenceDate: z.string().optional(),
	finalWalkThroughDate: z.string().optional(),
	possessionDate: z.string().optional(),
});

export type DealsCreateInput = z.infer<typeof DealsCreateInputSchema>;

// POST /deals answers 200 with the bare deal, not 201.
const DealsCreateResponseSchema = DealSchema;

export type DealsCreateResponse = z.infer<typeof DealsCreateResponseSchema>;

const DealsUpdateInputSchema = z.object({
	id: IdSchema.describe('The deal ID.'),
	name: z.string().optional(),
	stageId: IdSchema.optional(),
	description: z.string().optional(),
	customFields: CustomFieldInputsSchema.optional().describe(
		'Deal custom field values keyed by their `custom…` name (e.g. `{ customClosingDate: "2026-12-01" }`); sent as top-level fields.',
	),
	peopleIds: z.array(IdSchema).optional(),
	userIds: z.array(IdSchema).optional(),
	price: z.number().int().optional(),
	projectedCloseDate: z.string().optional(),
	commissionValue: z.number().int().optional(),
	// The PUT contract misspells these two request fields (`agentCommision`,
	// `teamComission`); POST and the responses use `agentCommission`/
	// `teamCommission`, so the documented PUT spellings are sent as-is.
	agentCommision: z
		.number()
		.int()
		.optional()
		.describe(
			'Commission value for an agent split; spelled `agentCommision` in the PUT contract.',
		),
	teamComission: z
		.number()
		.int()
		.optional()
		.describe(
			'Commission value for a team split; spelled `teamComission` in the PUT contract.',
		),
	earnestMoneyDueDate: z.string().optional(),
	mutualAcceptanceDate: z.string().optional(),
	dueDiligenceDate: z.string().optional(),
	finalWalkThroughDate: z.string().optional(),
	possessionDate: z.string().optional(),
});

export type DealsUpdateInput = z.infer<typeof DealsUpdateInputSchema>;

const DealsUpdateResponseSchema = DealSchema;

export type DealsUpdateResponse = z.infer<typeof DealsUpdateResponseSchema>;

const DealsDeleteInputSchema = z.object({
	id: IdSchema.describe('The deal ID to delete.'),
});

export type DealsDeleteInput = z.infer<typeof DealsDeleteInputSchema>;

const DealsDeleteResponseSchema = DeletedResponseSchema;

export type DealsDeleteResponse = z.infer<typeof DealsDeleteResponseSchema>;

// ── pipelines ──────────────────────────────────────────────────────────────

// The pipeline contract requires `name` and `closedStage` on every stage
// object sent with a pipeline; `id` is only sent when updating existing
// stages, so it lives on the update variant.
const PipelineStageInputSchema = z.object({
	name: z.string(),
	closedStage: z.boolean(),
	description: z.string().optional(),
	orderWeight: z.number().int().optional(),
	color: z.string().optional(),
});

const PipelineStageUpdateInputSchema = PipelineStageInputSchema.extend({
	id: IdSchema.optional().describe('The stage id of an existing stage.'),
});

const PipelinesListInputSchema = ListQuerySchema.extend({
	name: z
		.string()
		.optional()
		.describe('The pipeline name to look up (must be an exact match).'),
});

export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;

const PipelinesListResponseSchema = PipelineEnvelopeSchema;

export type PipelinesListResponse = z.infer<typeof PipelinesListResponseSchema>;

const PipelinesGetInputSchema = z.object({
	id: IdSchema.describe('The pipeline ID.'),
});

export type PipelinesGetInput = z.infer<typeof PipelinesGetInputSchema>;

const PipelinesGetResponseSchema = PipelineSchema;

export type PipelinesGetResponse = z.infer<typeof PipelinesGetResponseSchema>;

const PipelinesCreateInputSchema = z.object({
	name: z.string().describe('Name of the pipeline.'),
	description: z.string().optional(),
	stages: z
		.array(PipelineStageInputSchema)
		.optional()
		.describe('Stage objects to associate with the pipeline.'),
	orderWeight: z.number().int().optional(),
});

export type PipelinesCreateInput = z.infer<typeof PipelinesCreateInputSchema>;

const PipelinesCreateResponseSchema = PipelineSchema;

export type PipelinesCreateResponse = z.infer<
	typeof PipelinesCreateResponseSchema
>;

const PipelinesUpdateInputSchema = z.object({
	id: IdSchema.describe('The pipeline ID.'),
	name: z.string().optional(),
	description: z.string().optional(),
	stages: z.array(PipelineStageUpdateInputSchema).optional(),
	orderWeight: z.number().int().optional(),
});

export type PipelinesUpdateInput = z.infer<typeof PipelinesUpdateInputSchema>;

const PipelinesUpdateResponseSchema = PipelineSchema;

export type PipelinesUpdateResponse = z.infer<
	typeof PipelinesUpdateResponseSchema
>;

const PipelinesDeleteInputSchema = z.object({
	id: IdSchema.describe('The pipeline ID to delete.'),
});

export type PipelinesDeleteInput = z.infer<typeof PipelinesDeleteInputSchema>;

const PipelinesDeleteResponseSchema = DeletedResponseSchema;

export type PipelinesDeleteResponse = z.infer<
	typeof PipelinesDeleteResponseSchema
>;

// ── stages ─────────────────────────────────────────────────────────────────

const StagesListInputSchema = ListQuerySchema.extend({
	sort: z
		.string()
		.optional()
		.describe('Sorts the stages by `orderWeight`, `id` or `name`.'),
});

export type StagesListInput = z.infer<typeof StagesListInputSchema>;

const StagesListResponseSchema = StageEnvelopeSchema;

export type StagesListResponse = z.infer<typeof StagesListResponseSchema>;

const StagesGetInputSchema = z.object({
	id: IdSchema.describe('The stage ID.'),
});

export type StagesGetInput = z.infer<typeof StagesGetInputSchema>;

const StagesGetResponseSchema = StageSchema;

export type StagesGetResponse = z.infer<typeof StagesGetResponseSchema>;

const StagesCreateInputSchema = z.object({
	name: z.string().describe('Name of the stage.'),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('Set this value to enforce a specific sort order.'),
});

export type StagesCreateInput = z.infer<typeof StagesCreateInputSchema>;

const StagesCreateResponseSchema = StageSchema;

export type StagesCreateResponse = z.infer<typeof StagesCreateResponseSchema>;

const StagesUpdateInputSchema = z.object({
	id: IdSchema.describe('The stage ID.'),
	name: z.string().optional(),
	orderWeight: z.number().int().optional(),
});

export type StagesUpdateInput = z.infer<typeof StagesUpdateInputSchema>;

const StagesUpdateResponseSchema = StageSchema;

export type StagesUpdateResponse = z.infer<typeof StagesUpdateResponseSchema>;

// DELETE /stages/{id} requires the query parameter that reassigns the action
// plans referencing the deleted stage.
const StagesDeleteInputSchema = z.object({
	id: IdSchema.describe('The stage ID to delete.'),
	assignStageId: IdSchema.describe(
		'The stage id assigned to action plans referencing the deleted stage.',
	),
});

export type StagesDeleteInput = z.infer<typeof StagesDeleteInputSchema>;

const StagesDeleteResponseSchema = DeletedResponseSchema;

export type StagesDeleteResponse = z.infer<typeof StagesDeleteResponseSchema>;

// ── deal custom fields ─────────────────────────────────────────────────────

export const DEAL_CUSTOM_FIELD_TYPES = [
	'text',
	'date',
	'number',
	'dropdown',
] as const;

const DealCustomFieldsListInputSchema = ListQuerySchema.extend({
	label: z.string().optional().describe('Find a custom field by label.'),
	sort: z
		.string()
		.optional()
		.describe(
			'Sorts by `id`, `name` or `orderWeight`; prefix with `-` for descending.',
		),
});

export type DealCustomFieldsListInput = z.infer<
	typeof DealCustomFieldsListInputSchema
>;

const DealCustomFieldsListResponseSchema = DealCustomFieldEnvelopeSchema;

export type DealCustomFieldsListResponse = z.infer<
	typeof DealCustomFieldsListResponseSchema
>;

const DealCustomFieldsGetInputSchema = z.object({
	id: IdSchema.describe('The deals custom field ID.'),
});

export type DealCustomFieldsGetInput = z.infer<
	typeof DealCustomFieldsGetInputSchema
>;

const DealCustomFieldsGetResponseSchema = DealCustomFieldSchema;

export type DealCustomFieldsGetResponse = z.infer<
	typeof DealCustomFieldsGetResponseSchema
>;

const DealCustomFieldsCreateInputSchema = z.object({
	label: z
		.string()
		.describe(
			'The user-friendly name of the custom field (e.g. "Anniversary").',
		),
	type: z
		.enum(DEAL_CUSTOM_FIELD_TYPES)
		.describe('The type of deals custom field.'),
	choices: z
		.array(z.string())
		.optional()
		.describe('Options for a deals custom field of type `dropdown`.'),
	isRecurring: z
		.boolean()
		.optional()
		.describe('Whether a date field occurs every year (e.g. birthdays).'),
	hideIfEmpty: z
		.boolean()
		.optional()
		.describe('Sets whether the field is hidden if it is empty.'),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('A weighted integer for custom sorting.'),
	readOnly: z
		.boolean()
		.optional()
		.describe('Determines whether the deals custom field is read only.'),
});

export type DealCustomFieldsCreateInput = z.infer<
	typeof DealCustomFieldsCreateInputSchema
>;

const DealCustomFieldsCreateResponseSchema = DealCustomFieldSchema;

export type DealCustomFieldsCreateResponse = z.infer<
	typeof DealCustomFieldsCreateResponseSchema
>;

// The PUT contract requires `label` and `type` again, and carries the
// dropdown choice remapping used when options move or are renamed.
const DealCustomFieldsUpdateInputSchema = z.object({
	id: IdSchema.describe('The deals custom field ID.'),
	label: z
		.string()
		.describe(
			'The user-friendly name of the custom field (e.g. "Anniversary").',
		),
	type: z
		.enum(DEAL_CUSTOM_FIELD_TYPES)
		.describe('The type of deals custom field.'),
	choices: z.array(z.string()).optional(),
	isRecurring: z.boolean().optional(),
	hideIfEmpty: z.boolean().optional(),
	orderWeight: z.number().int().optional(),
	// unknown: the contract publishes this remapping as an int array pointing
	// previous dropdown choice positions to their new positions.
	dropdownChoiceMap: z.array(z.number().int()).optional(),
	readOnly: z.boolean().optional(),
});

export type DealCustomFieldsUpdateInput = z.infer<
	typeof DealCustomFieldsUpdateInputSchema
>;

const DealCustomFieldsUpdateResponseSchema = DealCustomFieldSchema;

export type DealCustomFieldsUpdateResponse = z.infer<
	typeof DealCustomFieldsUpdateResponseSchema
>;

const DealCustomFieldsDeleteInputSchema = z.object({
	id: IdSchema.describe('The deals custom field ID to delete.'),
});

export type DealCustomFieldsDeleteInput = z.infer<
	typeof DealCustomFieldsDeleteInputSchema
>;

const DealCustomFieldsDeleteResponseSchema = DeletedResponseSchema;

export type DealCustomFieldsDeleteResponse = z.infer<
	typeof DealCustomFieldsDeleteResponseSchema
>;

// ── deal attachments ───────────────────────────────────────────────────────

const DealAttachmentBodySchema = z.object({
	dealId: IdSchema.describe('The id of the deal to attach the file to.'),
	uri: z.string().describe('URI of the externally hosted file.'),
	fileName: z.string().describe('Name of the file.'),
	fileSize: z.number().int().optional().describe('Size of the file in bytes.'),
});

const DealAttachmentsCreateInputSchema = DealAttachmentBodySchema;

export type DealAttachmentsCreateInput = z.infer<
	typeof DealAttachmentsCreateInputSchema
>;

// The dealAttachments answers use 201 for their success responses.
const DealAttachmentsCreateResponseSchema = DealAttachmentSchema;

export type DealAttachmentsCreateResponse = z.infer<
	typeof DealAttachmentsCreateResponseSchema
>;

const DealAttachmentsGetInputSchema = z.object({
	id: IdSchema.describe('ID of the attachment.'),
});

export type DealAttachmentsGetInput = z.infer<
	typeof DealAttachmentsGetInputSchema
>;

const DealAttachmentsGetResponseSchema = DealAttachmentSchema;

export type DealAttachmentsGetResponse = z.infer<
	typeof DealAttachmentsGetResponseSchema
>;

const DealAttachmentsUpdateInputSchema = DealAttachmentBodySchema.extend({
	id: IdSchema.describe('ID of the attachment.'),
});

export type DealAttachmentsUpdateInput = z.infer<
	typeof DealAttachmentsUpdateInputSchema
>;

const DealAttachmentsUpdateResponseSchema = DealAttachmentSchema;

export type DealAttachmentsUpdateResponse = z.infer<
	typeof DealAttachmentsUpdateResponseSchema
>;

const DealAttachmentsDeleteInputSchema = z.object({
	id: IdSchema.describe('ID of the attachment to delete.'),
});

export type DealAttachmentsDeleteInput = z.infer<
	typeof DealAttachmentsDeleteInputSchema
>;

const DealAttachmentsDeleteResponseSchema = DeletedResponseSchema;

export type DealAttachmentsDeleteResponse = z.infer<
	typeof DealAttachmentsDeleteResponseSchema
>;

// ── appointment outcomes ───────────────────────────────────────────────────

const AppointmentOutcomesListInputSchema = ListQuerySchema.extend({
	sort: z
		.string()
		.optional()
		.describe(
			'Sorts by `id`, `name` or `orderWeight`; prefix with `-` for descending.',
		),
});

export type AppointmentOutcomesListInput = z.infer<
	typeof AppointmentOutcomesListInputSchema
>;

const AppointmentOutcomesListResponseSchema = AppointmentOutcomeEnvelopeSchema;

export type AppointmentOutcomesListResponse = z.infer<
	typeof AppointmentOutcomesListResponseSchema
>;

// The contract publishes no required body for creating an outcome; both
// fields are optional even though an unnamed outcome is unusual.
const AppointmentOutcomesCreateInputSchema = z.object({
	name: z.string().optional().describe('Name of the appointment outcome.'),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('Set this value to enforce a specific sort order.'),
});

export type AppointmentOutcomesCreateInput = z.infer<
	typeof AppointmentOutcomesCreateInputSchema
>;

const AppointmentOutcomesCreateResponseSchema = AppointmentOutcomeSchema;

export type AppointmentOutcomesCreateResponse = z.infer<
	typeof AppointmentOutcomesCreateResponseSchema
>;

const AppointmentOutcomesGetInputSchema = z.object({
	id: IdSchema.describe('The appointment outcome ID.'),
});

export type AppointmentOutcomesGetInput = z.infer<
	typeof AppointmentOutcomesGetInputSchema
>;

const AppointmentOutcomesGetResponseSchema = AppointmentOutcomeSchema;

export type AppointmentOutcomesGetResponse = z.infer<
	typeof AppointmentOutcomesGetResponseSchema
>;

const AppointmentOutcomesUpdateInputSchema = z.object({
	id: IdSchema.describe('The appointment outcome ID.'),
	name: z.string().optional(),
	orderWeight: z.number().int().optional(),
});

export type AppointmentOutcomesUpdateInput = z.infer<
	typeof AppointmentOutcomesUpdateInputSchema
>;

const AppointmentOutcomesUpdateResponseSchema = AppointmentOutcomeSchema;

export type AppointmentOutcomesUpdateResponse = z.infer<
	typeof AppointmentOutcomesUpdateResponseSchema
>;

// DELETE /appointmentOutcomes/{id} requires the query parameter that
// reassigns the existing appointments to another outcome.
const AppointmentOutcomesDeleteInputSchema = z.object({
	id: IdSchema.describe('ID of the appointment outcome to delete.'),
	assignOutcomeId: IdSchema.describe(
		'The outcome id that existing appointments are reassigned to.',
	),
});

export type AppointmentOutcomesDeleteInput = z.infer<
	typeof AppointmentOutcomesDeleteInputSchema
>;

const AppointmentOutcomesDeleteResponseSchema = DeletedResponseSchema;

export type AppointmentOutcomesDeleteResponse = z.infer<
	typeof AppointmentOutcomesDeleteResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export const DealInputSchemas = {
	dealsList: DealsListInputSchema,
	dealsGet: DealsGetInputSchema,
	dealsCreate: DealsCreateInputSchema,
	dealsUpdate: DealsUpdateInputSchema,
	dealsDelete: DealsDeleteInputSchema,
	pipelinesList: PipelinesListInputSchema,
	pipelinesGet: PipelinesGetInputSchema,
	pipelinesCreate: PipelinesCreateInputSchema,
	pipelinesUpdate: PipelinesUpdateInputSchema,
	pipelinesDelete: PipelinesDeleteInputSchema,
	stagesList: StagesListInputSchema,
	stagesGet: StagesGetInputSchema,
	stagesCreate: StagesCreateInputSchema,
	stagesUpdate: StagesUpdateInputSchema,
	stagesDelete: StagesDeleteInputSchema,
	dealCustomFieldsList: DealCustomFieldsListInputSchema,
	dealCustomFieldsGet: DealCustomFieldsGetInputSchema,
	dealCustomFieldsCreate: DealCustomFieldsCreateInputSchema,
	dealCustomFieldsUpdate: DealCustomFieldsUpdateInputSchema,
	dealCustomFieldsDelete: DealCustomFieldsDeleteInputSchema,
	dealAttachmentsCreate: DealAttachmentsCreateInputSchema,
	dealAttachmentsGet: DealAttachmentsGetInputSchema,
	dealAttachmentsUpdate: DealAttachmentsUpdateInputSchema,
	dealAttachmentsDelete: DealAttachmentsDeleteInputSchema,
	appointmentOutcomesList: AppointmentOutcomesListInputSchema,
	appointmentOutcomesGet: AppointmentOutcomesGetInputSchema,
	appointmentOutcomesCreate: AppointmentOutcomesCreateInputSchema,
	appointmentOutcomesUpdate: AppointmentOutcomesUpdateInputSchema,
	appointmentOutcomesDelete: AppointmentOutcomesDeleteInputSchema,
} as const;

export const DealOutputSchemas = {
	dealsList: DealsListResponseSchema,
	dealsGet: DealsGetResponseSchema,
	dealsCreate: DealsCreateResponseSchema,
	dealsUpdate: DealsUpdateResponseSchema,
	dealsDelete: DealsDeleteResponseSchema,
	pipelinesList: PipelinesListResponseSchema,
	pipelinesGet: PipelinesGetResponseSchema,
	pipelinesCreate: PipelinesCreateResponseSchema,
	pipelinesUpdate: PipelinesUpdateResponseSchema,
	pipelinesDelete: PipelinesDeleteResponseSchema,
	stagesList: StagesListResponseSchema,
	stagesGet: StagesGetResponseSchema,
	stagesCreate: StagesCreateResponseSchema,
	stagesUpdate: StagesUpdateResponseSchema,
	stagesDelete: StagesDeleteResponseSchema,
	dealCustomFieldsList: DealCustomFieldsListResponseSchema,
	dealCustomFieldsGet: DealCustomFieldsGetResponseSchema,
	dealCustomFieldsCreate: DealCustomFieldsCreateResponseSchema,
	dealCustomFieldsUpdate: DealCustomFieldsUpdateResponseSchema,
	dealCustomFieldsDelete: DealCustomFieldsDeleteResponseSchema,
	dealAttachmentsCreate: DealAttachmentsCreateResponseSchema,
	dealAttachmentsGet: DealAttachmentsGetResponseSchema,
	dealAttachmentsUpdate: DealAttachmentsUpdateResponseSchema,
	dealAttachmentsDelete: DealAttachmentsDeleteResponseSchema,
	appointmentOutcomesList: AppointmentOutcomesListResponseSchema,
	appointmentOutcomesGet: AppointmentOutcomesGetResponseSchema,
	appointmentOutcomesCreate: AppointmentOutcomesCreateResponseSchema,
	appointmentOutcomesUpdate: AppointmentOutcomesUpdateResponseSchema,
	appointmentOutcomesDelete: AppointmentOutcomesDeleteResponseSchema,
} as const;

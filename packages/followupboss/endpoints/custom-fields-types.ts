import { z } from 'zod';
import {
	DeletedResponseSchema,
	FubFlagSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// Inputs use Follow Up Boss's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field FUB adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.followupboss.com/reference

// ── custom fields ──────────────────────────────────────────────────────────

export const CUSTOM_FIELD_TYPES = [
	'text',
	'date',
	'number',
	'dropdown',
] as const;

export const CustomFieldSchema = z
	.object({
		id: IdSchema.nullish(),
		label: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		isRecurring: FubFlagSchema.nullish(),
		hideIfEmpty: FubFlagSchema.nullish(),
		orderWeight: z.number().nullish(),
		choices: z.array(z.string()).nullish(),
	})
	.loose();

export type FollowUpBossCustomField = z.infer<typeof CustomFieldSchema>;

const CustomFieldsListInputSchema = ListQuerySchema.extend({
	label: z.string().optional().describe('Find custom fields by their label.'),
	sort: z
		.string()
		.optional()
		.describe(
			'Sort by `id`, `name` or `orderWeight`, optionally prefixed with `-` for descending.',
		),
});

export type CustomFieldsListInput = z.infer<typeof CustomFieldsListInputSchema>;

// The collection envelope key is the lowercase `customfields`, unlike the
// camelCase /customFields path.
const CustomFieldsListResponseSchema = z
	.object({
		customfields: z.array(CustomFieldSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type CustomFieldsListResponse = z.infer<
	typeof CustomFieldsListResponseSchema
>;

const CustomFieldsGetInputSchema = z.object({
	id: IdSchema.describe('The custom field ID.'),
});

export type CustomFieldsGetInput = z.infer<typeof CustomFieldsGetInputSchema>;

const CustomFieldsGetResponseSchema = CustomFieldSchema;

export type CustomFieldsGetResponse = z.infer<
	typeof CustomFieldsGetResponseSchema
>;

const CustomFieldsCreateInputSchema = z.object({
	label: z
		.string()
		.describe(
			'The user-friendly name of the custom field (e.g. `Anniversary`).',
		),
	type: z.enum(CUSTOM_FIELD_TYPES).describe('The type of custom field.'),
	choices: z
		.array(z.string())
		.optional()
		.describe('Options for a custom field of type `dropdown`.'),
	isRecurring: z
		.boolean()
		.optional()
		.describe(
			'Whether a `date` field occurs every year, e.g. birthdays or anniversaries; only set and returned for `date` fields.',
		),
	hideIfEmpty: z
		.boolean()
		.optional()
		.describe('Hide the field on a person while it is empty.'),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('Weight used for custom sorting of the fields.'),
});

export type CustomFieldsCreateInput = z.infer<
	typeof CustomFieldsCreateInputSchema
>;

// Create answers 200 (not 201) with the created field.
const CustomFieldsCreateResponseSchema = CustomFieldSchema;

export type CustomFieldsCreateResponse = z.infer<
	typeof CustomFieldsCreateResponseSchema
>;

// Update cannot change the field type: the published PUT body has no `type`.
const CustomFieldsUpdateInputSchema = z.object({
	id: IdSchema.describe('The custom field ID.'),
	label: z.string().optional(),
	choices: z.array(z.string()).optional(),
	isRecurring: z.boolean().optional(),
	hideIfEmpty: z.boolean().optional(),
	orderWeight: z.number().int().optional(),
	dropdownChoiceMap: z
		.array(z.number().int())
		.optional()
		.describe(
			'Maps previous dropdown choice positions to their new positions; choices missing from the keys are removed. When omitted, FUB tries to detect moves and renames on its own.',
		),
});

export type CustomFieldsUpdateInput = z.infer<
	typeof CustomFieldsUpdateInputSchema
>;

const CustomFieldsUpdateResponseSchema = CustomFieldSchema;

export type CustomFieldsUpdateResponse = z.infer<
	typeof CustomFieldsUpdateResponseSchema
>;

const CustomFieldsDeleteInputSchema = z.object({
	id: IdSchema.describe('The custom field ID to delete.'),
});

export type CustomFieldsDeleteInput = z.infer<
	typeof CustomFieldsDeleteInputSchema
>;

const CustomFieldsDeleteResponseSchema = DeletedResponseSchema;

export type CustomFieldsDeleteResponse = z.infer<
	typeof CustomFieldsDeleteResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export const CustomFieldsInputSchemas = {
	customFieldsList: CustomFieldsListInputSchema,
	customFieldsGet: CustomFieldsGetInputSchema,
	customFieldsCreate: CustomFieldsCreateInputSchema,
	customFieldsUpdate: CustomFieldsUpdateInputSchema,
	customFieldsDelete: CustomFieldsDeleteInputSchema,
} as const;

export const CustomFieldsOutputSchemas = {
	customFieldsList: CustomFieldsListResponseSchema,
	customFieldsGet: CustomFieldsGetResponseSchema,
	customFieldsCreate: CustomFieldsCreateResponseSchema,
	customFieldsUpdate: CustomFieldsUpdateResponseSchema,
	customFieldsDelete: CustomFieldsDeleteResponseSchema,
} as const;

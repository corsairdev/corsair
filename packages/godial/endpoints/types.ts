import { z } from 'zod';

const EmptyInputSchema = z.object({}).strict();

const CustomFieldSchema = z
	.object({
		name: z.string(),
		value: z.string(),
	})
	.strict();

const SourceMarketingSchema = z
	.object({
		source: z.string().optional(),
		medium: z.string().optional(),
		campaign: z.string().optional(),
		term: z.string().optional(),
		content: z.string().optional(),
	})
	.strict();

// Fields from GoDial's Contact - Add reference (godial.stoplight.io); phone and listId are required.
const AddContactInputSchema = z
	.object({
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().min(1),
		secondPhone: z.string().optional(),
		companyName: z.string().optional(),
		note: z.string().optional(),
		remarks: z.string().optional(),
		extra: z.string().optional(),
		assignmentMode: z.enum(['default', 'roundrobin']).optional(),
		customFields: z.array(CustomFieldSchema).optional(),
		listId: z.string().min(1),
		accountsId: z.string().optional(),
		source: z.string().optional(),
		address: z.string().optional(),
		source_marketing: SourceMarketingSchema.optional(),
	})
	.strict();

// Response shapes from the live API (11-15); the reference shows only `{}`.
// Loose objects keep fields GoDial adds later; every field but id is optional.
const IdSchema = z.union([z.string(), z.number()]);

const GoDialListSchema = z.looseObject({
	id: IdSchema,
	name: z.string().nullish(),
	system: z.boolean().nullish(),
	callScript: z.string().nullish(),
	companyId: IdSchema.nullish(),
	teamsId: IdSchema.nullish(),
	// Only `enabled` is kept: the IndiaMart block also holds that integration's
	// API key (GLUSR_MOBILE_KEY), which must not reach agents.
	indiamart: z.object({ enabled: z.boolean().nullish() }).nullish(),
});

const GoDialContactSchema = z.looseObject({
	id: IdSchema,
	name: z.string().nullish(),
	phone: z.string().nullish(),
	secondPhone: z.string().nullish(),
	email: z.string().nullish(),
	companyName: z.string().nullish(),
	note: z.string().nullish(),
	remarks: z.string().nullish(),
	extra: z.string().nullish(),
	listId: IdSchema.nullish(),
	companyId: IdSchema.nullish(),
	stageId: IdSchema.nullish(),
	source: z.string().nullish(),
	createdOn: z.string().nullish(),
	called: z.boolean().nullish(),
	dnc: z.boolean().nullish(),
	leadScore: z.number().nullish(),
	// unknown because custom field values are user-defined.
	customFields: z.unknown().optional(),
	// unknown because UTM fields are whatever the caller sent.
	source_marketing: z.unknown().optional(),
});

export const GoDialEndpointInputSchemas = {
	listsList: EmptyInputSchema,
	contactsAdd: AddContactInputSchema,
} as const;

export const GoDialEndpointOutputSchemas = {
	listsList: z.array(GoDialListSchema),
	contactsAdd: GoDialContactSchema,
} as const;

export type GoDialEndpointInputs = {
	listsList: z.infer<typeof GoDialEndpointInputSchemas.listsList>;
	contactsAdd: z.infer<typeof GoDialEndpointInputSchemas.contactsAdd>;
};

export type GoDialEndpointOutputs = {
	listsList: z.infer<typeof GoDialEndpointOutputSchemas.listsList>;
	contactsAdd: z.infer<typeof GoDialEndpointOutputSchemas.contactsAdd>;
};

export type AddContactInput = GoDialEndpointInputs['contactsAdd'];

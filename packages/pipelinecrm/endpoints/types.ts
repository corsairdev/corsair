import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** The wrapper every list answer carries. */
function listEnvelope<T extends z.ZodType>(
	item: T,
	note: string,
): z.ZodObject<{
	entries: z.ZodArray<T>;
	pagination: z.ZodObject<{
		page: z.ZodNullable<z.ZodNumber>;
		per_page: z.ZodNullable<z.ZodNumber>;
		total: z.ZodNullable<z.ZodNumber>;
	}>;
}> {
	return z.object({
		entries: z.array(item).describe('The records on this page'),
		pagination: z
			.object({
				page: z.number().nullable().describe('Page returned'),
				per_page: z.number().nullable().describe('Records per page'),
				total: z.number().nullable().describe('Total records'),
			})
			.describe('Pagination metadata'),
	}) as z.ZodObject<{
		entries: z.ZodArray<T>;
		pagination: z.ZodObject<{
			page: z.ZodNullable<z.ZodNumber>;
			per_page: z.ZodNullable<z.ZodNumber>;
			total: z.ZodNullable<z.ZodNumber>;
		}>;
	}>;
}

export const PaginationMetaSchema = z
	.object({
		page: z.number().nullable().describe('Page returned'),
		per_page: z.number().nullable().describe('Records per page'),
		total: z.number().nullable().describe('Total records'),
	})
	.describe('Pagination metadata');
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

/** A Pipeline CRM user reference embedded on records. */
export const UserRefSchema = z
	.object({
		id: z.number().nullish().describe('User id'),
		name: z.string().nullish().describe('User display name'),
		email: z.string().nullish().describe('User email'),
	})
	.loose()
	.describe('A Pipeline CRM user reference');
export type UserRef = z.infer<typeof UserRefSchema>;

/** A deal, as the deals endpoints answer. */
export const DealSchema = z
	.object({
		id: z.number().nullish().describe('Deal id'),
		name: z.string().nullish().describe('Deal name'),
		summary: z.string().nullish().describe('Deal description'),
		user_id: z.number().nullish().describe('Owning user id'),
		status: z.number().nullish().describe('Deal status id'),
		expected_close_date: z
			.string()
			.nullish()
			.describe('Expected close, YYYY-MM-DD'),
		closed_time: z.string().nullish().describe('Actual close date'),
		is_archived: z.boolean().nullish().describe('Archived flag'),
		value: z.string().nullish().describe('Deal value as a decimal string'),
		primary_contact_id: z
			.number()
			.nullish()
			.describe('Primary contact person id'),
		person_ids: z.array(z.number()).nullish().describe('Associated person ids'),
		shared_user_ids: z
			.array(z.number())
			.nullish()
			.describe('Collaborator user ids'),
		company_id: z.number().nullish().describe('Company id'),
		company_name: z.string().nullish().describe('Company name'),
		probability: z.number().nullish().describe('Win probability, 0-100'),
		deal_stage_id: z.number().nullish().describe('Deal stage id'),
		deal_stage_name: z.string().nullish().describe('Deal stage name'),
		deal_loss_reason_id: z.number().nullish().describe('Loss reason id'),
		deal_loss_reason_notes: z.string().nullish().describe('Loss reason notes'),
		deal_won_reason_id: z.number().nullish().describe('Won reason id'),
		deal_won_reason_notes: z.string().nullish().describe('Won reason notes'),
		deal_source: z.number().nullish().describe('Lead source id'),
		// unknown: the currency record's fields vary by account settings.
		currency: z.unknown().nullish().describe('Currency record'),
		custom_fields: z
			// unknown: custom field values keyed by custom_label_<id>.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom field values'),
		tag_ids: z.array(z.number()).nullish().describe('Tag ids'),
		owner: UserRefSchema.nullish().describe('The owning user'),
		next_task_name: z.string().nullish().describe('Next task name'),
		next_task_due: z.string().nullish().describe('Next task due date'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pipeline CRM deal');
export type Deal = z.infer<typeof DealSchema>;

/** A person (lead or contact). */
export const PersonSchema = z
	.object({
		id: z.number().nullish().describe('Person id'),
		first_name: z.string().nullish().describe('First name'),
		last_name: z.string().nullish().describe('Last name'),
		full_name: z.string().nullish().describe('Full name'),
		summary: z.string().nullish().describe('Summary or notes'),
		phone: z.string().nullish().describe('Primary phone'),
		email: z.string().nullish().describe('Primary email'),
		position: z.string().nullish().describe('Professional position'),
		website: z.string().nullish().describe('Website URL'),
		company_id: z.number().nullish().describe('Company id'),
		company_name: z.string().nullish().describe('Company name'),
		user_id: z.number().nullish().describe('Owning user id'),
		lead_status_id: z.number().nullish().describe('Lead status id'),
		lead_source_id: z.number().nullish().describe('Lead source id'),
		image_thumb_url: z.string().nullish().describe('Avatar URL'),
		custom_fields: z
			// unknown: custom field values keyed by custom_label_<id>.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom field values'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pipeline CRM person');
export type Person = z.infer<typeof PersonSchema>;

/** A company. */
export const CompanySchema = z
	.object({
		id: z.number().nullish().describe('Company id'),
		name: z.string().nullish().describe('Company name'),
		description: z.string().nullish().describe('Description'),
		email: z.string().nullish().describe('Email'),
		web: z.string().nullish().describe('Website'),
		address_1: z.string().nullish().describe('Address line 1'),
		city: z.string().nullish().describe('City'),
		state: z.string().nullish().describe('State'),
		postal_code: z.string().nullish().describe('Postal code'),
		country: z.string().nullish().describe('Country'),
		phone1: z.string().nullish().describe('Primary phone'),
		facebook_url: z.string().nullish().describe('Facebook URL'),
		linked_in_url: z.string().nullish().describe('LinkedIn URL'),
		twitter: z.string().nullish().describe('Twitter username'),
		custom_fields: z
			// unknown: custom field values keyed by custom_label_<id>.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom field values'),
		user_id: z.number().nullish().describe('Owning user id'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pipeline CRM company');
export type Company = z.infer<typeof CompanySchema>;

/** An activity (a note in the app). */
export const NoteSchema = z
	.object({
		id: z.number().nullish().describe('Note id'),
		title: z.string().nullish().describe('Title, if any'),
		content: z.string().nullish().describe('Content'),
		user_id: z.number().nullish().describe('Owning user id'),
		deal_id: z.number().nullish().describe('Linked deal id'),
		company_id: z.number().nullish().describe('Linked company id'),
		person_id: z.number().nullish().describe('Linked person id'),
		milestone_id: z.number().nullish().describe('Milestone id'),
		note_category_id: z.number().nullish().describe('Category id'),
		notify_user_ids: z
			.array(z.number())
			.nullish()
			.describe('Users emailed on new comments'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pipeline CRM activity (note)');
export type Note = z.infer<typeof NoteSchema>;

/** A visible user. */
export const PipelineUserSchema = z
	.object({
		id: z.number().nullish().describe('User id'),
		email: z.string().nullish().describe('Email'),
		name: z.string().nullish().describe('Display name'),
		first_name: z.string().nullish().describe('First name'),
		last_name: z.string().nullish().describe('Last name'),
		work_phone: z.string().nullish().describe('Work phone'),
		mobile: z.string().nullish().describe('Mobile phone'),
		admin: z.boolean().nullish().describe('Whether the user is an admin'),
		// unknown: the role level record is not documented field by field.
		user_level: z.unknown().nullish().describe('Role level record'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last update timestamp'),
	})
	.loose()
	.describe('A Pipeline CRM user');
export type PipelineUser = z.infer<typeof PipelineUserSchema>;

/** A stage totals line from deals.totalsByStage. */
export const StageTotalSchema = z
	.object({
		deal_stage_id: z.number().nullish().describe('Deal stage id'),
		deal_stage_name: z.string().nullish().describe('Deal stage name'),
		count: z.number().nullish().describe('Deals in the stage'),
		total: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Total value (a number live, a decimal string in the docs)'),
	})
	.loose()
	.describe('A per-stage deal total');
export type StageTotal = z.infer<typeof StageTotalSchema>;

/** Paging parameters every list endpoint takes. */
const pagingParams = {
	page: z.number().int().min(1).optional().describe('Page number'),
	perPage: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe('Records per page, at most 200'),
};

/**
 * conditions[...] filters: each key is the full bracketed parameter name,
 * each value its raw value (e.g. "conditions[deal_stage][]" and "3").
 * Unknown keys are ignored by the API, not rejected.
 */
const conditionsParam = z
	.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
	.optional()
	.describe(
		'Filter conditions as Pipeline CRM query parameters: each key is the full bracketed key (e.g. "conditions[deal_stage][]" or "conditions[deal_created][selection]") with its value; unknown keys are ignored by the API',
	);

type Conditions = Record<string, string | number | boolean> | undefined;

/** Passes the caller's bracketed condition keys through unchanged. */
export function conditionsQuery(
	conditions: Conditions,
): Record<string, string> {
	const query: Record<string, string> = {};
	for (const [key, value] of Object.entries(conditions ?? {})) {
		query[key] = String(value);
	}
	return query;
}

const EmptyInputSchema = z.object({}).describe('No input parameters');
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

// ── deals ──────────────────────────────────────────────────────────────────

export const DealsListInputSchema = z
	.object({
		conditions: conditionsParam,
		sort: z
			.string()
			.optional()
			.describe(
				'Record field to sort by, e.g. value, name, created_at; prefix - for descending',
			),
		...pagingParams,
	})
	.describe('Query parameters for listing deals');
export type DealsListInput = z.infer<typeof DealsListInputSchema>;

export const DealsListOutputSchema = listEnvelope(
	DealSchema,
	'A page of deals',
);

export const DealsTotalsOutputSchema = z
	.array(StageTotalSchema)
	.describe('Deal count and value per stage');

export const DealCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Deal name'),
		summary: z.string().optional().describe('Deal description'),
		userId: z.number().int().optional().describe('Owning user id'),
		status: z.number().int().optional().describe('Deal status id'),
		expectedCloseDate: z
			.string()
			.optional()
			.describe('Expected close date, YYYY-MM-DD'),
		value: z
			.union([z.number(), z.string()])
			.optional()
			.describe('Deal value; a number or numeric string'),
		primaryContactId: z
			.number()
			.int()
			.optional()
			.describe('Primary contact person id'),
		personIds: z
			.array(z.number().int())
			.optional()
			.describe('Associated person ids'),
		sharedUserIds: z
			.array(z.number().int())
			.optional()
			.describe('Collaborator user ids'),
		companyId: z.number().int().optional().describe('Company id'),
		companyName: z
			.string()
			.optional()
			.describe('Creates and links a company of this name when no id matches'),
		probability: z
			.number()
			.int()
			.min(0)
			.max(100)
			.optional()
			.describe('Win probability 0-100; 0 or 100 closes the deal'),
		dealStageId: z.number().int().optional().describe('Deal stage id'),
		dealLossReasonId: z.number().int().optional().describe('Loss reason id'),
		dealLossReasonNotes: z.string().optional().describe('Loss reason notes'),
		dealWonReasonId: z.number().int().optional().describe('Won reason id'),
		dealWonReasonNotes: z.string().optional().describe('Won reason notes'),
		dealSource: z.number().int().optional().describe('Lead source id'),
		tagIds: z.array(z.number().int()).optional().describe('Tag ids'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
		deliverAssignmentEmail: z
			.boolean()
			.optional()
			.describe(
				'Email the new owner when the deal is assigned to another user',
			),
	})
	.describe('Input for creating a deal');
export type DealCreateInput = z.infer<typeof DealCreateInputSchema>;

export const DealOutputSchema = DealSchema.describe('The deal');

export const DealUpdateInputSchema = z
	.object({
		id: z.number().int().describe('Deal id'),
		name: z.string().optional().describe('New deal name'),
		summary: z.string().optional().describe('New description'),
		userId: z.number().int().optional().describe('New owning user id'),
		status: z.number().int().optional().describe('New deal status id'),
		expectedCloseDate: z
			.string()
			.optional()
			.describe('New expected close date, YYYY-MM-DD'),
		closedTime: z.string().optional().describe('Actual close date, YYYY-MM-DD'),
		isArchived: z.boolean().optional().describe('Archived flag'),
		value: z
			.union([z.number(), z.string()])
			.optional()
			.describe('Deal value; a number or numeric string'),
		primaryContactId: z
			.number()
			.int()
			.optional()
			.describe('Primary contact person id'),
		personIds: z
			.array(z.number().int())
			.optional()
			.describe('Associated person ids'),
		sharedUserIds: z
			.array(z.number().int())
			.optional()
			.describe('Collaborator user ids'),
		companyId: z.number().int().optional().describe('Company id'),
		companyName: z
			.string()
			.optional()
			.describe('Creates and links a company of this name'),
		probability: z
			.number()
			.int()
			.min(0)
			.max(100)
			.optional()
			.describe('Win probability; 0 or 100 closes, 1-99 reopens'),
		dealStageId: z.number().int().optional().describe('Deal stage id'),
		dealLossReasonId: z.number().int().optional().describe('Loss reason id'),
		dealLossReasonNotes: z.string().optional().describe('Loss reason notes'),
		dealWonReasonId: z.number().int().optional().describe('Won reason id'),
		dealWonReasonNotes: z.string().optional().describe('Won reason notes'),
		dealSource: z.number().int().optional().describe('Lead source id'),
		tagIds: z.array(z.number().int()).optional().describe('Tag ids'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
		deliverReassignmentEmail: z
			.boolean()
			.optional()
			.describe('Email the new owner on reassignment'),
	})
	.describe('Input for updating a deal');
export type DealUpdateInput = z.infer<typeof DealUpdateInputSchema>;

export const IdInputSchema = z
	.object({ id: z.number().int().describe('The record id') })
	.describe('Input with a record id');
export type IdInput = z.infer<typeof IdInputSchema>;

/** A record id plus paging, for the lists that hang off one record. */
export const IdPageInputSchema = z
	.object({
		id: z.number().int().describe('The record id'),
		...pagingParams,
	})
	.describe('The parent record id and paging');
export type IdPageInput = z.infer<typeof IdPageInputSchema>;

export const DeletedOutputSchema = z
	.unknown()
	.optional()
	.describe('The deletion answer (200 with a body or 204 with none)');

export const NotesListOutputSchema = listEnvelope(
	NoteSchema,
	'A page of activities (notes)',
);

// ── people ─────────────────────────────────────────────────────────────────

export const PeopleListInputSchema = z
	.object({
		conditions: conditionsParam,
		sort: z
			.string()
			.optional()
			.describe(
				'Record field to sort by, e.g. value, name, created_at; prefix - for descending',
			),
		...pagingParams,
	})
	.describe('Query parameters for listing people');
export type PeopleListInput = z.infer<typeof PeopleListInputSchema>;

export const PeopleListOutputSchema = listEnvelope(
	PersonSchema,
	'A page of people',
);

export const PersonCreateInputSchema = z
	.object({
		firstName: z.string().optional().describe('First name'),
		lastName: z.string().optional().describe('Last name'),
		fullName: z
			.string()
			.optional()
			.describe('Full name; splits on whitespace into first and last'),
		summary: z.string().optional().describe('Summary or notes'),
		phone: z.string().optional().describe('Primary phone'),
		homePhone: z.string().optional().describe('Home phone'),
		mobile: z.string().optional().describe('Mobile phone'),
		position: z.string().optional().describe('Professional position'),
		website: z.string().optional().describe('Website URL'),
		email: z.string().optional().describe('Primary email'),
		email2: z.string().optional().describe('Secondary email'),
		companyId: z.number().int().optional().describe('Company id'),
		companyName: z
			.string()
			.optional()
			.describe('Creates and links a company of this name when no id matches'),
		userId: z.number().int().optional().describe('Owning user id'),
		leadStatusId: z.number().int().optional().describe('Lead status id'),
		leadSourceId: z.number().int().optional().describe('Lead source id'),
		tagIds: z
			.array(z.number().int())
			.optional()
			.describe('Predefined contact tag ids'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
	})
	.describe('Input for creating a person');
export type PersonCreateInput = z.infer<typeof PersonCreateInputSchema>;

export const PersonOutputSchema = PersonSchema.describe('The person');

export const PersonUpdateInputSchema = z
	.object({
		id: z.number().int().describe('Person id'),
		firstName: z.string().optional().describe('First name'),
		lastName: z.string().optional().describe('Last name'),
		fullName: z.string().optional().describe('Full name; splits on whitespace'),
		summary: z.string().optional().describe('Summary or notes'),
		phone: z.string().optional().describe('Primary phone'),
		homePhone: z.string().optional().describe('Home phone'),
		mobile: z.string().optional().describe('Mobile phone'),
		position: z.string().optional().describe('Professional position'),
		website: z.string().optional().describe('Website URL'),
		email: z.string().optional().describe('Primary email'),
		email2: z.string().optional().describe('Secondary email'),
		companyId: z.number().int().optional().describe('Company id'),
		companyName: z
			.string()
			.optional()
			.describe('Creates and links a company of this name'),
		userId: z.number().int().optional().describe('Owning user id'),
		leadStatusId: z.number().int().optional().describe('Lead status id'),
		leadSourceId: z.number().int().optional().describe('Lead source id'),
		tagIds: z
			.array(z.number().int())
			.optional()
			.describe('Predefined contact tag ids'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
		deliverReassignmentEmail: z
			.boolean()
			.optional()
			.describe('Email the new owner on reassignment'),
	})
	.describe('Input for updating a person');
export type PersonUpdateInput = z.infer<typeof PersonUpdateInputSchema>;

export const PeopleAutocompleteInputSchema = z
	.object({
		q: z.string().min(1).describe('Search text'),
		companyId: z.number().int().optional().describe('Restrict to this company'),
		dealId: z.number().int().optional().describe('Restrict to this deal'),
	})
	.describe('Input for the person autocomplete');
export type PeopleAutocompleteInput = z.infer<
	typeof PeopleAutocompleteInputSchema
>;

export const PeopleAutocompleteOutputSchema = z
	.array(PersonSchema)
	.describe('Matching people');

export const DealsListForParentOutputSchema = listEnvelope(
	DealSchema,
	'A page of the parent deals',
);

// ── companies ──────────────────────────────────────────────────────────────

export const CompaniesListInputSchema = z
	.object({
		conditions: conditionsParam,
		sort: z
			.string()
			.optional()
			.describe(
				'Record field to sort by, e.g. value, name, created_at; prefix - for descending',
			),
		...pagingParams,
	})
	.describe('Query parameters for listing companies');
export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;

export const CompaniesListOutputSchema = listEnvelope(
	CompanySchema,
	'A page of companies',
);

export const CompanyCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('Company name'),
		description: z.string().optional().describe('Description'),
		email: z.string().optional().describe('Email'),
		web: z.string().optional().describe('Website'),
		address1: z.string().optional().describe('Address line 1'),
		address2: z.string().optional().describe('Address line 2'),
		city: z.string().optional().describe('City'),
		state: z.string().optional().describe('State'),
		postalCode: z.string().optional().describe('Postal code'),
		country: z.string().optional().describe('Country'),
		phone1: z.string().optional().describe('Primary phone'),
		phone2: z.string().optional().describe('Secondary phone'),
		facebookUrl: z.string().optional().describe('Facebook URL'),
		linkedInUrl: z.string().optional().describe('LinkedIn URL'),
		twitter: z.string().optional().describe('Twitter username'),
		userId: z.number().int().optional().describe('Owning user id'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
		checkForDuplicates: z
			.boolean()
			.optional()
			.describe('Let the API detect and report possible duplicates'),
	})
	.describe('Input for creating a company');
export type CompanyCreateInput = z.infer<typeof CompanyCreateInputSchema>;

export const CompanyOutputSchema = CompanySchema.describe('The company');

export const CompanyUpdateInputSchema = z
	.object({
		id: z.number().int().describe('Company id'),
		name: z.string().optional().describe('Company name'),
		description: z.string().optional().describe('Description'),
		email: z.string().optional().describe('Email'),
		web: z.string().optional().describe('Website'),
		address1: z.string().optional().describe('Address line 1'),
		address2: z.string().optional().describe('Address line 2'),
		city: z.string().optional().describe('City'),
		state: z.string().optional().describe('State'),
		postalCode: z.string().optional().describe('Postal code'),
		country: z.string().optional().describe('Country'),
		phone1: z.string().optional().describe('Primary phone'),
		phone2: z.string().optional().describe('Secondary phone'),
		facebookUrl: z.string().optional().describe('Facebook URL'),
		linkedInUrl: z.string().optional().describe('LinkedIn URL'),
		twitter: z.string().optional().describe('Twitter username'),
		userId: z.number().int().optional().describe('New owning user id'),
		customFields: z
			// unknown: values follow each custom field's type, keyed custom_label_<id>.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom field values keyed by custom_label_<id>'),
		deliverReassignmentEmail: z
			.boolean()
			.optional()
			.describe('Email the new owner on reassignment'),
	})
	.describe('Input for updating a company');
export type CompanyUpdateInput = z.infer<typeof CompanyUpdateInputSchema>;

export const CompaniesAutocompleteInputSchema = z
	.object({ q: z.string().min(1).describe('Search text') })
	.describe('Input for the company autocomplete');
export type CompaniesAutocompleteInput = z.infer<
	typeof CompaniesAutocompleteInputSchema
>;

export const CompaniesAutocompleteOutputSchema = z
	.array(CompanySchema)
	.describe('Matching companies');

export const PeopleListForParentOutputSchema = listEnvelope(
	PersonSchema,
	'A page of the parent people',
);

// ── notes ──────────────────────────────────────────────────────────────────

export const NotesListInputSchema = z
	.object({
		conditions: conditionsParam.describe(
			'Filter conditions; one of conditions[deal_id], conditions[company_id] or conditions[person_id] is required by the API',
		),
		...pagingParams,
	})
	.describe('Query parameters for listing activities');
export type NotesListInput = z.infer<typeof NotesListInputSchema>;

export const NoteCreateInputSchema = z
	.object({
		title: z.string().optional().describe('Title, if any'),
		content: z.string().optional().describe('Note content'),
		userId: z.number().int().optional().describe('Owning user id'),
		dealId: z.number().int().optional().describe('Linked deal id'),
		companyId: z.number().int().optional().describe('Linked company id'),
		personId: z.number().int().optional().describe('Linked person id'),
		noteCategoryId: z.number().int().optional().describe('Category id'),
		notifyUserIds: z
			.array(z.number().int())
			.optional()
			.describe('Users emailed on new comments'),
	})
	.describe('Input for creating an activity');
export type NoteCreateInput = z.infer<typeof NoteCreateInputSchema>;

export const NoteOutputSchema = NoteSchema.describe('The activity');

export const NoteUpdateInputSchema = z
	.object({
		id: z.number().int().describe('Note id'),
		title: z.string().optional().describe('Title, if any'),
		content: z.string().optional().describe('Note content'),
		userId: z.number().int().optional().describe('Owning user id'),
		noteCategoryId: z.number().int().optional().describe('Category id'),
		notifyUserIds: z
			.array(z.number().int())
			.optional()
			.describe('Users emailed on new comments'),
	})
	.describe('Input for updating an activity');
export type NoteUpdateInput = z.infer<typeof NoteUpdateInputSchema>;

// ── users ──────────────────────────────────────────────────────────────────

export const UsersListInputSchema = z
	.object({
		conditions: conditionsParam.describe(
			'Filter conditions: "conditions[email]" for an exact email match, "conditions[admin]" for admins only, "conditions[including_inactive]" to include deactivated users',
		),
		...pagingParams,
	})
	.describe('Query parameters for listing visible users');
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UsersListOutputSchema = listEnvelope(
	PipelineUserSchema,
	'A page of visible users',
);

export const UserOutputSchema = PipelineUserSchema.describe('The user');

// ── Operation registry ─────────────────────────────────────────────────────

export const PipelineCrmEndpointInputSchemas = {
	dealsList: DealsListInputSchema,
	dealsCreate: DealCreateInputSchema,
	dealsGet: IdInputSchema,
	dealsUpdate: DealUpdateInputSchema,
	dealsDelete: IdInputSchema,
	dealsTotalsByStage: EmptyInputSchema,
	dealsListNotes: IdPageInputSchema,
	peopleList: PeopleListInputSchema,
	peopleCreate: PersonCreateInputSchema,
	peopleGet: IdInputSchema,
	peopleUpdate: PersonUpdateInputSchema,
	peopleDelete: IdInputSchema,
	peopleAutocomplete: PeopleAutocompleteInputSchema,
	peopleListDeals: IdPageInputSchema,
	peopleListNotes: IdPageInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesCreate: CompanyCreateInputSchema,
	companiesGet: IdInputSchema,
	companiesUpdate: CompanyUpdateInputSchema,
	companiesDelete: IdInputSchema,
	companiesAutocomplete: CompaniesAutocompleteInputSchema,
	companiesListPeople: IdPageInputSchema,
	notesList: NotesListInputSchema,
	notesCreate: NoteCreateInputSchema,
	notesGet: IdInputSchema,
	notesUpdate: NoteUpdateInputSchema,
	notesDelete: IdInputSchema,
	usersList: UsersListInputSchema,
	usersGet: IdInputSchema,
};

export const PipelineCrmEndpointOutputSchemas = {
	dealsList: DealsListOutputSchema,
	dealsCreate: DealOutputSchema,
	dealsGet: DealOutputSchema,
	dealsUpdate: DealOutputSchema,
	dealsDelete: DeletedOutputSchema,
	dealsTotalsByStage: DealsTotalsOutputSchema,
	dealsListNotes: NotesListOutputSchema,
	peopleList: PeopleListOutputSchema,
	peopleCreate: PersonOutputSchema,
	peopleGet: PersonOutputSchema,
	peopleUpdate: PersonOutputSchema,
	peopleDelete: DeletedOutputSchema,
	peopleAutocomplete: PeopleAutocompleteOutputSchema,
	peopleListDeals: DealsListForParentOutputSchema,
	peopleListNotes: NotesListOutputSchema,
	companiesList: CompaniesListOutputSchema,
	companiesCreate: CompanyOutputSchema,
	companiesGet: CompanyOutputSchema,
	companiesUpdate: CompanyOutputSchema,
	companiesDelete: DeletedOutputSchema,
	companiesAutocomplete: CompaniesAutocompleteOutputSchema,
	companiesListPeople: PeopleListForParentOutputSchema,
	notesList: NotesListOutputSchema,
	notesCreate: NoteOutputSchema,
	notesGet: NoteOutputSchema,
	notesUpdate: NoteOutputSchema,
	notesDelete: DeletedOutputSchema,
	usersList: UsersListOutputSchema,
	usersGet: UserOutputSchema,
};

export type PipelineCrmEndpointInputs = {
	[K in keyof typeof PipelineCrmEndpointInputSchemas]: z.input<
		(typeof PipelineCrmEndpointInputSchemas)[K]
	>;
};

export type PipelineCrmEndpointOutputs = {
	[K in keyof typeof PipelineCrmEndpointOutputSchemas]: z.infer<
		(typeof PipelineCrmEndpointOutputSchemas)[K]
	>;
};

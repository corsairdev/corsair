import { z } from 'zod';

/**
 * SuiteDash's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field SuiteDash adds or omits cannot fail a
 * read that already succeeded.
 *
 * Every answer is an envelope, `{ success, message, data }`, and a list adds
 * `meta.pagination`. The client rejects an envelope whose `success` is false, so
 * the output schemas model the successful form.
 *
 * Contract: https://app.suitedash.com/secure-api/swagger (the public live docs)
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const Timestamp = z
	.string()
	.describe('ISO 8601, with the account timezone offset.');

/**
 * A caller's own custom fields. **A response sends an array**, usually empty,
 * but the spec types it as an object and a write sends it keyed by the field's
 * uuid, so a read accepts both and a write is checked as the spec describes.
 */
const CustomFieldsReadSchema = z
	.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]) // unknown: any value
	.describe(
		'The custom fields of this record. A response sends an array; a write sends an object keyed by field uuid.',
	);

/** A write sends the fields keyed by uuid, as the account meta describes them. */
const CustomFieldsWriteSchema = z.record(z.string(), z.unknown()); // unknown: any value

/** SuiteDash's role values, which decide who can see the record. */
const CompanyRoleSchema = z.enum(['Lead', 'Client', 'Prospect']);

/**
 * `meta.pagination` is how a list reports paging. `nextPage` is a full URL, so
 * the endpoint turns it into a page number rather than passing a URL.
 */
const PaginationSchema = z
	.object({
		pageSize: z.number().nullish(),
		totalPages: z.number().nullish(),
		totalItems: z.number().nullish(),
		currentPageNumber: z.number().nullish(),
		previousPage: z.string().nullish(),
		nextPage: z
			.string()
			.nullish()
			.describe('The next page URL, or null on the last page.'),
	})
	.loose();

export type SuitedashPagination = z.infer<typeof PaginationSchema>;

/** A meta attribute, as the per-resource meta route describes each custom field. */
const MetaAttributeSchema = z
	.object({
		type: z.string().nullish(),
		format: z.string().nullish(),
		required: z.boolean().nullish(),
		nullable: z.boolean().nullish(),
		allowed_on_action: z.array(z.string()).nullish(),
		allowed_values: z.array(z.string()).nullish(),
		field_name: z.string().nullish(),
		field_description: z.string().nullish(),
	})
	.loose();

export type SuitedashMetaAttribute = z.infer<typeof MetaAttributeSchema>;

const MetaSchema = z
	.object({
		pagination: PaginationSchema.nullish(),
		attributes: z.record(z.string(), MetaAttributeSchema).nullish(),
	})
	.loose();

// ── Record schemas ────────────────────────────────────────────────────────

const ContactAddressSchema = z
	.object({
		address_line_1: z.string().nullish(),
		address_line_2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		country: z.string().nullish(),
		zip: z.string().nullish(),
	})
	.loose();

export type SuitedashAddress = z.infer<typeof ContactAddressSchema>;

const CompanyCategorySchema = z
	.object({
		name: z.string().nullish(),
		color: z.string().nullish(),
		isDefault: z.boolean().nullish(),
	})
	.loose();

const CompanyContactSchema = z
	.object({
		uid: z.string().nullish(),
		role: z.string().nullish(),
		name_prefix: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

const CompanySchema = z
	.object({
		uid: z.string().nullish(),
		role: CompanyRoleSchema.nullish(),
		name: z.string().nullish(),
		phone: z.string().nullish(),
		/**
		 * SuiteDash sends `{}` rather than null when a company has no category,
		 * which is why every field here is optional rather than the object being
		 * nullable.
		 */
		category: CompanyCategorySchema.nullish(),
		home_phone: z.string().nullish(),
		work_phone: z.string().nullish(),
		shop_phone: z.string().nullish(),
		website: z.string().nullish(),
		full_address: z.string().nullish(),
		address: ContactAddressSchema.nullish(),
		primaryContact: CompanyContactSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		background_info: z.string().nullish(),
		created: Timestamp.nullish(),
		public_custom_fields: CustomFieldsReadSchema.nullish(),
		private_custom_fields: CustomFieldsReadSchema.nullish(),
		target_custom_fields: CustomFieldsReadSchema.nullish(),
	})
	.loose();

export type SuitedashCompany = z.infer<typeof CompanySchema>;

const ContactSchema = z
	.object({
		uid: z.string().nullish(),
		role: z.string().nullish(),
		name_prefix: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		home_email: z.string().nullish(),
		work_email: z.string().nullish(),
		phone: z.string().nullish(),
		home_phone: z.string().nullish(),
		work_phone: z.string().nullish(),
		shop_phone: z.string().nullish(),
		title: z.string().nullish(),
		website: z.string().nullish(),
		active: z.boolean().nullish(),
		full_address: z.string().nullish(),
		address: ContactAddressSchema.nullish(),
		company: z.unknown().nullish(), // unknown: a nested company or a name
		companies: z.array(z.unknown()).nullish(), // unknown: same, as a list
		tags: z.array(z.string()).nullish(),
		created: Timestamp.nullish(),
		public_custom_fields: CustomFieldsReadSchema.nullish(),
		private_custom_fields: CustomFieldsReadSchema.nullish(),
		target_custom_fields: CustomFieldsReadSchema.nullish(),
	})
	.loose();

export type SuitedashContact = z.infer<typeof ContactSchema>;

const ProjectSchema = z
	.object({
		uid: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		due_time: z.string().nullish(),
		created: Timestamp.nullish(),
		info_description: z.string().nullish(),
		info_title_client: z.string().nullish(),
		info_description_client: z.string().nullish(),
		client: z
			.object({
				uid: z.string().nullish(),
				full_name: z.string().nullish(),
				email: z.string().nullish(),
			})
			.loose()
			.nullish(),
		secondary_clients: z.array(z.unknown()).nullish(), // unknown: client shape
		teammates: z.array(z.unknown()).nullish(), // unknown: staff shape
		team: z
			.object({ uid: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		leader: z.unknown().nullish(), // unknown: staff shape
		project_custom_fields: CustomFieldsReadSchema.nullish(),
	})
	.loose();

export type SuitedashProject = z.infer<typeof ProjectSchema>;

const WorldSchema = z
	.object({
		uid: z.string().nullish(),
		key: z.string().nullish(),
	})
	.loose();

export type SuitedashWorld = z.infer<typeof WorldSchema>;

// ── Envelopes ─────────────────────────────────────────────────────────────

/** One record: `{ success, message, data }`. */
function oneOf<T extends z.ZodType>(schema: T) {
	return z
		.object({
			success: z.literal(true),
			message: z.string().nullish(),
			data: schema,
			meta: MetaSchema.nullish(),
		})
		.loose();
}

/** A list: the same envelope, a `data` array and the paging meta. */
function pageOf<T extends z.ZodType>(schema: T) {
	return z
		.object({
			success: z.literal(true),
			message: z.string().nullish(),
			data: z.array(schema),
			meta: MetaSchema.nullish(),
		})
		.loose();
}

/**
 * The list and single-record routes share these filters. `page` is what a
 * caller advances; the endpoint also accepts the `nextPage` URL's page.
 */
const listQuery = {
	page: z.number().int().min(1).optional().describe('Page number, from 1.'),
	createdMin: Timestamp.optional().describe(
		'Only records created at or after this.',
	),
	createdMax: Timestamp.optional().describe(
		'Only records created before this.',
	),
	orderBy: z
		.string()
		.optional()
		.describe('A field name, optionally followed by :asc or :desc.'),
	meta: z
		.boolean()
		.optional()
		.describe(
			"Include the meta block: the paging object plus this account's custom field definitions.",
		),
};

// ── companies ─────────────────────────────────────────────────────────────

const CompaniesListInputSchema = z.object({ ...listQuery });

export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;

const CompaniesListResponseSchema = pageOf(CompanySchema);

export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

const companyBody = {
	name: z.string().min(1),
	role: CompanyRoleSchema,
	phone: z.string().nullish(),
	home_phone: z.string().nullish(),
	work_phone: z.string().nullish(),
	shop_phone: z.string().nullish(),
	website: z.string().nullish(),
	full_address: z.string().nullish(),
	address: ContactAddressSchema.optional(),
	tags: z.array(z.string()).nullish(),
	background_info: z.string().nullish(),
	public_custom_fields: CustomFieldsWriteSchema.nullish(),
	private_custom_fields: CustomFieldsWriteSchema.nullish(),
	target_custom_fields: CustomFieldsWriteSchema.nullish(),
};

/**
 * A company create can also create its first contact. `role`, `first_name`,
 * `last_name` and `email` are required inside it when `create_primary` is set.
 */
const primaryContactBody = z
	.object({
		create_primary: z.boolean().optional(),
		role: z.string().optional(),
		name_prefix: z.string().nullish(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().nullish(),
	})
	.superRefine((value, ctx) => {
		if (!value.create_primary) return;
		// The spec marks these required only when a contact is being created, so
		// a missing one would be a 422 after the company already exists.
		for (const field of ['first_name', 'last_name', 'email'] as const) {
			if (!value[field]) {
				ctx.addIssue({
					code: 'custom',
					path: [field],
					message: `${field} is required when create_primary is set.`,
				});
			}
		}
	});

const CompaniesCreateInputSchema = z.object({
	...companyBody,
	primaryContact: primaryContactBody.optional(),
});

export type CompaniesCreateInput = z.infer<typeof CompaniesCreateInputSchema>;

const CompaniesCreateResponseSchema = oneOf(CompanySchema);

export type CompaniesCreateResponse = z.infer<
	typeof CompaniesCreateResponseSchema
>;

const CompanyTargetSchema = z.object({
	identifier: z
		.string()
		.describe(
			"The company's uid or its exact name. SuiteDash decides which from the value, so send the name as the name.",
		),
});

export type CompanyTargetInput = z.infer<typeof CompanyTargetSchema>;

const CompaniesGetInputSchema = z.object({
	...CompanyTargetSchema.shape,
	meta: listQuery.meta,
});

export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;

const CompaniesGetResponseSchema = oneOf(CompanySchema);

export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

const CompaniesUpdateInputSchema = z.object({
	...CompanyTargetSchema.shape,
	...companyBody,
});

export type CompaniesUpdateInput = z.infer<typeof CompaniesUpdateInputSchema>;

const CompaniesUpdateResponseSchema = oneOf(CompanySchema);

export type CompaniesUpdateResponse = z.infer<
	typeof CompaniesUpdateResponseSchema
>;

const CompaniesMetaInputSchema = z.object({});

export type CompaniesMetaInput = z.infer<typeof CompaniesMetaInputSchema>;

/**
 * The meta routes answer an array of attribute maps, and the map keys are the
 * account's own field uuids, so there is no fixed shape to type.
 */
const MetaResponseSchema = oneOf(
	z.array(z.unknown()), // unknown: uuid-keyed attribute maps, per account
);

export type MetaResponse = z.infer<typeof MetaResponseSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsListInputSchema = z.object({ ...listQuery });

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = pageOf(ContactSchema);

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const contactBody = {
	name_prefix: z.string().nullish(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
	home_email: z.string().nullish(),
	work_email: z.string().nullish(),
	phone: z.string().nullish(),
	home_phone: z.string().nullish(),
	work_phone: z.string().nullish(),
	shop_phone: z.string().nullish(),
	title: z.string().nullish(),
	website: z.string().nullish(),
	full_address: z.string().nullish(),
	address: ContactAddressSchema.optional(),
	tags: z.array(z.string()).nullish(),
	send_welcome_email: z
		.boolean()
		.optional()
		.describe('Send the portal welcome email as part of the write.'),
	public_custom_fields: CustomFieldsWriteSchema.nullish(),
	private_custom_fields: CustomFieldsWriteSchema.nullish(),
	target_custom_fields: CustomFieldsWriteSchema.nullish(),
};

/**
 * The spec requires first_name, last_name, email and role on a create, so the
 * four are required here. `role` decides portal visibility.
 */
const ContactsCreateInputSchema = z.object({
	...contactBody,
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.string().min(1),
	role: z
		.enum(['Lead', 'Client', 'Prospect'])
		.describe('The contact role, which decides what the portal shows them.'),
});

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const ContactsCreateResponseSchema = oneOf(ContactSchema);

export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

const ContactTargetSchema = z.object({
	identifier: z
		.string()
		.describe(
			"The contact's uid or its email address. SuiteDash decides which from the value.",
		),
});

export type ContactTargetInput = z.infer<typeof ContactTargetSchema>;

const ContactsGetInputSchema = z.object({
	...ContactTargetSchema.shape,
	meta: listQuery.meta,
});

export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

const ContactsGetResponseSchema = oneOf(ContactSchema);

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const ContactsUpdateInputSchema = z.object({
	...ContactTargetSchema.shape,
	...contactBody,
});

export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

const ContactsUpdateResponseSchema = oneOf(ContactSchema);

export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

const ContactsMetaInputSchema = z.object({});

export type ContactsMetaInput = z.infer<typeof ContactsMetaInputSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({ ...listQuery });

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsListResponseSchema = pageOf(ProjectSchema);

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

/** The route's own lookup modes, which decide what `identifier` means. */
const ProjectLookupTypeSchema = z
	.enum(['uid', 'name', 'contains_the_following', 'most_recent'])
	.describe(
		'How to find the project: uid, exact name, a name fragment, or most_recent with identifier "true".',
	);

const ProjectTargetSchema = z.object({
	type: ProjectLookupTypeSchema,
	identifier: z.string().min(1),
});

export type ProjectTargetInput = z.infer<typeof ProjectTargetSchema>;

const ProjectsGetInputSchema = z.object({
	...ProjectTargetSchema.shape,
	meta: listQuery.meta,
});

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = oneOf(ProjectSchema);

export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

/**
 * SuiteDash's update schema for a project is an empty object, so the spec does
 * not constrain the body. The documented fields are offered as optional, and
 * anything else would have to be a custom field, which this plugin cannot type.
 */
const projectBody = {
	name: z.string().optional(),
	status: z.string().optional(),
	start_date: z.string().nullish(),
	end_date: z.string().nullish(),
	due_time: z.string().nullish(),
	info_title_client: z.string().nullish(),
	info_description_client: z.string().nullish(),
	info_description: z.string().nullish(),
	project_custom_fields: CustomFieldsReadSchema.nullish(),
};

const ProjectsUpdateInputSchema = z.object({
	...ProjectTargetSchema.shape,
	...projectBody,
});

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = oneOf(ProjectSchema);

export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

const ProjectsMetaInputSchema = z.object({});

export type ProjectsMetaInput = z.infer<typeof ProjectsMetaInputSchema>;

// ── worlds ────────────────────────────────────────────────────────────────

const WorldsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	orderBy: z.string().optional(),
});

export type WorldsListInput = z.infer<typeof WorldsListInputSchema>;

/** The worlds route answers a bare array, unlike the CRM lists. */
const WorldsListResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().nullish(),
	data: z.array(WorldSchema),
	pagination: PaginationSchema.nullish(),
});

export type WorldsListResponse = z.infer<typeof WorldsListResponseSchema>;

// ── marketing ─────────────────────────────────────────────────────────────

const MarketingSubscribeInputSchema = z.object({
	subscribers: z
		.array(
			z.object({
				email: z.string().min(1),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				audiences: z
					.array(z.number().int())
					.min(1)
					.describe('Marketing audience ids to subscribe the contact to.'),
			}),
		)
		.min(1),
});

export type MarketingSubscribeInput = z.infer<
	typeof MarketingSubscribeInputSchema
>;

/**
 * A subscribe answers one result per subscriber. `success` is true only when
 * every one worked, so a per-item flag is what tells a caller which failed.
 */
const MarketingSubscribeResponseSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullish(),
		data: z.array(
			z
				.object({
					success: z.boolean().nullish(),
					errors: z.array(z.string()).nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type MarketingSubscribeResponse = z.infer<
	typeof MarketingSubscribeResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SuitedashEndpointInputs = {
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	companiesCreate: CompaniesCreateInput;
	companiesUpdate: CompaniesUpdateInput;
	companiesMeta: CompaniesMetaInput;
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsMeta: ContactsMetaInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsMeta: ProjectsMetaInput;
	worldsList: WorldsListInput;
	marketingSubscribe: MarketingSubscribeInput;
};

export type SuitedashEndpointOutputs = {
	companiesList: CompaniesListResponse;
	companiesGet: CompaniesGetResponse;
	companiesCreate: CompaniesCreateResponse;
	companiesUpdate: CompaniesUpdateResponse;
	companiesMeta: MetaResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsMeta: MetaResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsMeta: MetaResponse;
	worldsList: WorldsListResponse;
	marketingSubscribe: MarketingSubscribeResponse;
};

export const SuitedashEndpointInputSchemas = {
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesCreate: CompaniesCreateInputSchema,
	companiesUpdate: CompaniesUpdateInputSchema,
	companiesMeta: CompaniesMetaInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsMeta: ContactsMetaInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsMeta: ProjectsMetaInputSchema,
	worldsList: WorldsListInputSchema,
	marketingSubscribe: MarketingSubscribeInputSchema,
} as const;

export const SuitedashEndpointOutputSchemas = {
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	companiesCreate: CompaniesCreateResponseSchema,
	companiesUpdate: CompaniesUpdateResponseSchema,
	companiesMeta: MetaResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsMeta: MetaResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsMeta: MetaResponseSchema,
	worldsList: WorldsListResponseSchema,
	marketingSubscribe: MarketingSubscribeResponseSchema,
} as const;

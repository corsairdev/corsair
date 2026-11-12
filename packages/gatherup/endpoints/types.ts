import { z } from 'zod';

// Inputs use GatherUp's own camelCase names. Outputs are `.loose()` and their
// documented fields nullish, so a field GatherUp adds or omits cannot fail a
// read that has already happened.
// Reference: https://apidocs.gatherup.com/

const BusinessIdSchema = z
	.number()
	.int()
	.min(1)
	.describe('The business ID, from `businesses.list`.');

const CustomerIdSchema = z
	.union([z.string().min(1), z.number().int().min(1)])
	.describe('The customer ID, as a string or a number.');

// Every answer carries `errorCode` and `errorMessage` beside the payload, with
// `0` and `"Success"` on a good one. The client throws when the code is non-zero.
const errorFields = {
	errorCode: z
		.number()
		.nullish()
		.describe(
			'`0` on success. Any other value is a failure, whatever the status.',
		),
	errorMessage: z.string().nullish(),
};

const pageFields = {
	page: z.number().nullish(),
	pages: z.number().nullish().describe('Total pages.'),
	count: z.number().nullish().describe('Rows in this page.'),
	perPage: z.number().nullish(),
};

// ── businesses ────────────────────────────────────────────────────────────

export const GatherupBusinessSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		phone: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country: z.string().nullish(),
		// GatherUp's own spelling, with `Address` camel-cased.
		streetAddress: z.string().nullish(),
		timezone: z.string().nullish(),
		organisationType: z.string().nullish(),
		emailLogo: z.string().nullish(),
		emailImage: z.string().nullish(),
		feedbackBanner: z.string().nullish(),
		added: z.string().nullish(),
		websiteURL: z.string().nullish(),
		package: z.string().nullish(),
		shortFeedbackUrl: z.string().nullish(),
		communicationMethod: z.string().nullish(),
		nps: z.number().nullish(),
		ratingsReceived: z.number().nullish(),
		customersNotSent: z.string().nullish(),
		legalBusinessName: z.string().nullish(),
		isActive: z.boolean().nullish(),
	})
	.loose();

export type GatherupBusiness = z.infer<typeof GatherupBusinessSchema>;

const BusinessesListInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('1-based page.'),
	perPage: z.number().int().min(1).optional(),
});

export type BusinessesListInput = z.input<typeof BusinessesListInputSchema>;

const BusinessesListResponseSchema = z
	.object({
		...pageFields,
		data: z.array(GatherupBusinessSchema),
		...errorFields,
		next_page: z
			.number()
			.nullable()
			.describe('The next page while more remain; null on the last one.'),
	})
	.loose();

export type BusinessesListResponse = z.infer<
	typeof BusinessesListResponseSchema
>;

const BusinessGetInputSchema = z.object({ businessId: BusinessIdSchema });

export type BusinessGetInput = z.input<typeof BusinessGetInputSchema>;

// A single business answers the record itself rather than a `data` wrapper.
const BusinessResponseSchema =
	GatherupBusinessSchema.extend(errorFields).loose();

export type BusinessResponse = z.infer<typeof BusinessResponseSchema>;

const BusinessSearchInputSchema = z.object({
	search: z
		.string()
		.min(1)
		.describe('A name or domain to search the business directory for.'),
});

export type BusinessSearchInput = z.input<typeof BusinessSearchInputSchema>;

const BusinessSearchResponseSchema = z
	.object({
		data: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string().nullish(),
						website: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		...errorFields,
	})
	.loose();

export type BusinessSearchResponse = z.infer<
	typeof BusinessSearchResponseSchema
>;

const BusinessTypesInputSchema = z.object({
	search: z.string().optional().describe('Filter the types by name.'),
});

export type BusinessTypesInput = z.input<typeof BusinessTypesInputSchema>;

const BusinessTypeSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type GatherupBusinessType = z.infer<typeof BusinessTypeSchema>;

const BusinessTypesResponseSchema = z
	.object({
		data: z.array(BusinessTypeSchema).nullish(),
		...errorFields,
	})
	.loose();

export type BusinessTypesResponse = z.infer<typeof BusinessTypesResponseSchema>;

// The write routes take prefixed body names, not the field names the read
// returns: `businessName` and `businessType`, where a read answers `name` and
// `organisationType`. They are used as documented.
const BusinessCreateInputSchema = z.object({
	businessName: z.string().min(1),
	businessType: z
		.string()
		.min(1)
		.describe(
			'A Google business type, such as `Insurance Agency`; see `businesses.types`.',
		),
	city: z.string().min(1),
	country: z.string().min(1).describe('A country code or full name.'),
	streetAddress: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	phone: z.string().optional(),
	// GatherUp spells this one with a lower-case `rl`, unlike the read's `websiteURL`.
	websiteUrl: z.url().optional(),
	organisationType: z.string().optional().describe('Defaults to `company`.'),
	legalBusinessName: z.string().optional(),
	publicBusinessName: z.string().optional(),
	language: z.string().optional(),
});

export type BusinessCreateInput = z.input<typeof BusinessCreateInputSchema>;

const BusinessWriteResponseSchema = z
	.object({
		data: z.object({ id: z.number().nullish() }).loose().nullish(),
		...errorFields,
	})
	.loose();

export type BusinessWriteResponse = z.infer<typeof BusinessWriteResponseSchema>;

const BusinessUpdateInputSchema = BusinessCreateInputSchema.partial().extend({
	businessId: BusinessIdSchema,
});

export type BusinessUpdateInput = z.input<typeof BusinessUpdateInputSchema>;

const BusinessActiveInputSchema = z.object({ businessId: BusinessIdSchema });

export type BusinessActiveInput = z.input<typeof BusinessActiveInputSchema>;

const BusinessRemoveInputSchema = z.object({ businessId: BusinessIdSchema });

export type BusinessRemoveInput = z.input<typeof BusinessRemoveInputSchema>;

const SuccessResponseSchema = z
	.object({
		data: z.unknown().optional(),
		...errorFields,
	})
	.loose();

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// ── customers ─────────────────────────────────────────────────────────────

export const GatherupCustomerSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		businessId: z.union([z.string(), z.number()]).nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		phone: z.string().nullish(),
		email: z.string().nullish(),
		jobId: z
			.string()
			.nullish()
			.describe('The caller’s own reference for the job.'),
		customId: z.string().nullish(),
		parentId: z.string().nullish(),
		// A rating arrives as a decimal string, such as `5.00`, or null.
		rating: z.string().nullish(),
		review: z.string().nullish(),
		statusInfo: z.string().nullish(),
		subscription: z.number().nullish(),
		unsubscribed: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

export type GatherupCustomer = z.infer<typeof GatherupCustomerSchema>;

const CustomersListInputSchema = z.object({
	businessId: BusinessIdSchema,
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).optional(),
});

export type CustomersListInput = z.input<typeof CustomersListInputSchema>;

const CustomersListResponseSchema = z
	.object({
		...pageFields,
		data: z.array(GatherupCustomerSchema),
		...errorFields,
		next_page: z.number().nullable(),
	})
	.loose();

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

const CustomerGetInputSchema = z.object({
	businessId: BusinessIdSchema,
	customerId: CustomerIdSchema,
});

export type CustomerGetInput = z.input<typeof CustomerGetInputSchema>;

const CustomerResponseSchema =
	GatherupCustomerSchema.extend(errorFields).loose();

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;

// The create body uses `customer…` names. An email is required on the basic
// plan and either an email or a phone on higher ones, so a body without both is
// refused here rather than costing a call.
const CustomerCreateInputSchema = z
	.object({
		businessId: BusinessIdSchema,
		customerFirstName: z.string().min(1),
		customerLastName: z.string().min(1),
		customerEmail: z
			.string()
			.optional()
			.describe('Required on the basic plan.'),
		customerPhone: z.string().optional(),
		customerJobId: z.string().optional(),
		customerCustomId: z.string().optional(),
		customerTags: z
			.string()
			.optional()
			.describe('Comma-separated tags, each at most 50 characters.'),
		sendFeedbackRequest: z
			.boolean()
			.optional()
			.describe('Send the request as soon as the customer is created.'),
	})
	.superRefine((value, ctx) => {
		if (
			value.customerEmail === undefined &&
			value.customerPhone === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['customerEmail'],
				message:
					'A customer needs a `customerEmail` or a `customerPhone` to be reachable.',
			});
		}
	});

export type CustomerCreateInput = z.input<typeof CustomerCreateInputSchema>;

// The update route spells the phone field `customerPhoneNumber`, where create
// spells it `customerPhone`, so each keeps its own documented name.
const CustomerUpdateInputSchema = z.object({
	businessId: BusinessIdSchema,
	customerId: CustomerIdSchema,
	customerFirstName: z.string().optional(),
	customerLastName: z.string().optional(),
	customerEmail: z.string().optional(),
	customerPhoneNumber: z.string().optional(),
	customerJobId: z.string().optional(),
	customerCustomId: z.string().optional(),
	customerTags: z.string().optional(),
});

export type CustomerUpdateInput = z.input<typeof CustomerUpdateInputSchema>;

const CustomerRemoveInputSchema = z.object({
	businessId: BusinessIdSchema,
	customerId: CustomerIdSchema,
});

export type CustomerRemoveInput = z.input<typeof CustomerRemoveInputSchema>;

const FeedbackRequestInputSchema = z.object({
	businessId: BusinessIdSchema,
	customerId: CustomerIdSchema,
});

export type FeedbackRequestInput = z.input<typeof FeedbackRequestInputSchema>;

// ── feedback ──────────────────────────────────────────────────────────────

export const GatherupFeedbackSchema = z
	.object({
		rating: z.number().nullish(),
		recommend: z.number().nullish().describe('The NPS answer, 0 to 10.'),
		feedbackId: z.union([z.string(), z.number()]).nullish(),
		businessId: z.union([z.string(), z.number()]).nullish(),
		dateOfReview: z.string().nullish(),
		showReview: z
			.string()
			.nullish()
			.describe('`1` when the review is shown publicly.'),
		authorEmail: z.string().nullish(),
		authorName: z.string().nullish(),
		body: z.string().nullish(),
		jobId: z.string().nullish(),
		customId: z.string().nullish(),
		// GatherUp sends this as one comma-separated string, not an array.
		tags: z.string().nullish(),
		negativeDetails: z.string().nullish(),
	})
	.loose();

export type GatherupFeedback = z.infer<typeof GatherupFeedbackSchema>;

const FeedbacksListInputSchema = z.object({
	businessId: BusinessIdSchema,
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).optional(),
	from: z.string().optional().describe('Earliest review date, `YYYY-MM-DD`.'),
	to: z.string().optional().describe('Latest review date, `YYYY-MM-DD`.'),
});

export type FeedbacksListInput = z.input<typeof FeedbacksListInputSchema>;

const FeedbacksListResponseSchema = z
	.object({
		...pageFields,
		data: z.array(GatherupFeedbackSchema),
		...errorFields,
		next_page: z.number().nullable(),
	})
	.loose();

export type FeedbacksListResponse = z.infer<typeof FeedbacksListResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type GatherupEndpointInputs = {
	businessesList: BusinessesListInput;
	businessesGet: BusinessGetInput;
	businessesSearch: BusinessSearchInput;
	businessesTypes: BusinessTypesInput;
	businessesCreate: BusinessCreateInput;
	businessesUpdate: BusinessUpdateInput;
	businessesDeactivate: BusinessActiveInput;
	businessesReactivate: BusinessActiveInput;
	businessesRemove: BusinessRemoveInput;
	customersList: CustomersListInput;
	customersGet: CustomerGetInput;
	customersCreate: CustomerCreateInput;
	customersUpdate: CustomerUpdateInput;
	customersRemove: CustomerRemoveInput;
	feedbackRequest: FeedbackRequestInput;
	feedbacksList: FeedbacksListInput;
};

export type GatherupEndpointOutputs = {
	businessesList: BusinessesListResponse;
	businessesGet: BusinessResponse;
	businessesSearch: BusinessSearchResponse;
	businessesTypes: BusinessTypesResponse;
	businessesCreate: BusinessWriteResponse;
	businessesUpdate: BusinessWriteResponse;
	businessesDeactivate: SuccessResponse;
	businessesReactivate: SuccessResponse;
	businessesRemove: SuccessResponse;
	customersList: CustomersListResponse;
	customersGet: CustomerResponse;
	customersCreate: CustomerResponse;
	customersUpdate: CustomerResponse;
	customersRemove: SuccessResponse;
	feedbackRequest: SuccessResponse;
	feedbacksList: FeedbacksListResponse;
};

export const GatherupEndpointInputSchemas = {
	businessesList: BusinessesListInputSchema,
	businessesGet: BusinessGetInputSchema,
	businessesSearch: BusinessSearchInputSchema,
	businessesTypes: BusinessTypesInputSchema,
	businessesCreate: BusinessCreateInputSchema,
	businessesUpdate: BusinessUpdateInputSchema,
	businessesDeactivate: BusinessActiveInputSchema,
	businessesReactivate: BusinessActiveInputSchema,
	businessesRemove: BusinessRemoveInputSchema,
	customersList: CustomersListInputSchema,
	customersGet: CustomerGetInputSchema,
	customersCreate: CustomerCreateInputSchema,
	customersUpdate: CustomerUpdateInputSchema,
	customersRemove: CustomerRemoveInputSchema,
	feedbackRequest: FeedbackRequestInputSchema,
	feedbacksList: FeedbacksListInputSchema,
} as const;

export const GatherupEndpointOutputSchemas = {
	businessesList: BusinessesListResponseSchema,
	businessesGet: BusinessResponseSchema,
	businessesSearch: BusinessSearchResponseSchema,
	businessesTypes: BusinessTypesResponseSchema,
	businessesCreate: BusinessWriteResponseSchema,
	businessesUpdate: BusinessWriteResponseSchema,
	businessesDeactivate: SuccessResponseSchema,
	businessesReactivate: SuccessResponseSchema,
	businessesRemove: SuccessResponseSchema,
	customersList: CustomersListResponseSchema,
	customersGet: CustomerResponseSchema,
	customersCreate: CustomerResponseSchema,
	customersUpdate: CustomerResponseSchema,
	customersRemove: SuccessResponseSchema,
	feedbackRequest: SuccessResponseSchema,
	feedbacksList: FeedbacksListResponseSchema,
} as const;

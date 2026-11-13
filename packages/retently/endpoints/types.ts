import { z } from 'zod';

// Inputs use Retently's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Retently adds or omits cannot fail a
// call that has already happened. Response shapes follow the examples in the
// API reference at https://www.retently.com/docs/api/.
//
// Retently is not consistent about where a payload sits, and the models follow
// it exactly rather than inventing a common envelope:
//
//   GET  /customers, /feedback, /outbox   -> { message, code, data: { <rows>[] } }
//   GET  /templates, /campaigns           -> { code, message, <rows>[] }
//   GET  /reports                         -> { code, message, data: [...] }
//   POST /survey                          -> { success, code, message, status }
//   POST /customers/resubscribe           -> { success, code, message, data: [...] }

const IdSchema = z.string().min(1);

/**
 * A JSON value. Used where a field's shape depends on data the caller owns - a
 * custom property's value, or a template question's answer - so it is described
 * as JSON rather than as `unknown`, which would reach the docs as `any`.
 */
export type RetentlyJsonValue =
	| string
	| number
	| boolean
	| null
	| RetentlyJsonValue[]
	| { [key: string]: RetentlyJsonValue };

const JsonValueSchema: z.ZodType<RetentlyJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const DateParamSchema = z
	.string()
	.min(1)
	.describe(
		'YYYY-MM-DD, an ISO 8601 date-time, or a UNIX timestamp in seconds. Milliseconds are not detected and resolve to a far-future date, so send seconds.',
	);

// ── shared ────────────────────────────────────────────────────────────────

const PageSchema = z
	.object({
		page: z.number().nullish(),
		pages: z.number().nullish(),
		limit: z.number().nullish(),
		sort: z.string().nullish(),
		total: z.number().nullish(),
	})
	.loose();

const CursorSchema = z
	.object({
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('1-based, defaults to 1.'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(1000)
			.optional()
			.describe('Defaults to 20, maximum 1,000.'),
		sort: z
			.string()
			.optional()
			.describe(
				'Field to sort by; prefix with - for descending, such as -createdDate.',
			),
	})
	.loose();

/**
 * One property filter. The operators Retently accepts depend on the property's
 * type: `contains`/`not_contains` are string-only, `greater_than`/`less_than`
 * number and date, `greater_than_ago`/`less_than_ago` date-only, and
 * `in`/`not_in` arrays and tags. An operator the property's type does not
 * support is a 400.
 */
const AttributeSchema = z.object({
	name: z.string().min(1).describe("The property's name, such as country."),
	op: z
		.enum([
			'equal',
			'not_equal',
			'exists',
			'not_exists',
			'contains',
			'not_contains',
			'greater_than',
			'less_than',
			'greater_than_ago',
			'less_than_ago',
			'in',
			'not_in',
		])
		.describe('The comparison. Leave `value` out for exists/not_exists.'),
	value: JsonValueSchema.optional().describe(
		'What to compare against; omitted for exists/not_exists.',
	),
});

export type RetentlyAttribute = z.infer<typeof AttributeSchema>;

/** Property `value` across every response: a scalar, or absent. */
const PropertyValueSchema = z
	.union([z.string(), z.number(), z.boolean(), z.null()])
	.describe('A string, number or boolean, depending on the property type.');

const PropertySchema = z
	.object({
		label: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish().describe('text, number, date or collection.'),
		value: PropertyValueSchema.nullish(),
	})
	.loose();

export type RetentlyProperty = z.infer<typeof PropertySchema>;

// ── account.ping ──────────────────────────────────────────────────────────

const AccountPingInputSchema = z.object({});

const PingAccountSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		createdAt: z.string().nullish(),
		timezone: z.string().nullish(),
	})
	.loose();

const PingPlanCreditsSchema = z
	.object({
		period: z.string().nullish(),
		periodStart: z.string().nullish(),
		periodEnd: z.string().nullish(),
		included: z.number().nullish(),
		purchased: z.number().nullish(),
		limit: z.number().nullish(),
		used: z.number().nullish(),
		remaining: z.number().nullish(),
		dailyLimit: z.number().nullish(),
	})
	.loose();

const PingPlanSchema = z
	.object({
		code: z.string().nullish(),
		billingCycle: z.string().nullish(),
		renewsAt: z.string().nullish(),
		credits: z
			.object({ surveys: PingPlanCreditsSchema.nullish() })
			.loose()
			.nullish(),
	})
	.loose();

const PingUsageSchema = z
	.object({
		contacts: z.number().nullish(),
		feedback: z.number().nullish(),
		outbox: z.number().nullish(),
		queue: z.number().nullish(),
		suppressions: z.number().nullish(),
	})
	.loose();

const AccountPingResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: z
			.object({
				account: PingAccountSchema.nullish(),
				plan: PingPlanSchema.nullish(),
				usage: PingUsageSchema.nullish(),
				cache: z.object({ updatedAt: z.string().nullish() }).loose().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type AccountPingResponse = z.infer<typeof AccountPingResponseSchema>;

// ── customers ─────────────────────────────────────────────────────────────

export const RETENTLY_MAX_PAGE_SIZE = 1000;

const CustomersListInputSchema = CursorSchema.extend({
	email: z.string().min(1).optional().describe('Find one customer by email.'),
	startDate: DateParamSchema.optional().describe(
		'Only customers created at or after this instant. A bare YYYY-MM-DD means 00:00:00 UTC.',
	),
	endDate: DateParamSchema.optional().describe(
		'Only customers created at or before this instant. Not expanded to the end of the day.',
	),
	attributes: z
		.array(AttributeSchema)
		.min(1)
		.optional()
		.describe(
			'Property filters. The operators allowed depend on the property type.',
		),
	match: z
		.enum(['all', 'any'])
		.optional()
		.describe(
			'How to combine several attributes: all (AND, default) or any (OR).',
		),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

/**
 * A customer as `/customers` returns it.
 *
 * The by-ID response writes `firstName`/`lastName`/`companyName`, while the
 * upsert response echoes the request's `first_name`/`last_name`/`company`.
 * Both spellings are declared so either response parses.
 */
export const CustomerSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		companyId: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		company: z.string().nullish(),
		jobTitle: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		createdDate: z.string().nullish(),
		updatedDate: z.string().nullish(),
		properties: z.array(PropertySchema).nullish(),
		location: z
			.object({
				countryCode: z.string().nullish(),
				region: z.string().nullish(),
				country: z.string().nullish(),
				city: z.string().nullish(),
				state: z.string().nullish(),
				zipCode: z.string().nullish(),
				timezone: z.string().nullish(),
			})
			.loose()
			.nullish(),
		integrationsLists: z
			.array(
				z
					.object({ name: z.string().nullish(), source: z.string().nullish() })
					.loose(),
			)
			.nullish(),
		surveySubscriptionStatus: z
			.object({
				isOptedOut: z.boolean().nullish(),
				optOutDate: z.string().nullish(),
				optOutMessage: z.string().nullish(),
				optOutBy: z.string().nullish(),
				isSuppressed: z.boolean().nullish(),
				suppressedDate: z.string().nullish(),
				suppressedReason: z.string().nullish(),
			})
			.loose()
			.nullish(),
		isInQueue: z.boolean().nullish(),
		isInQueueSetAt: z.string().nullish(),
		lastSurveySent: z
			.object({
				openedDate: z.string().nullish(),
				surveyId: z.string().nullish(),
				metric: z.string().nullish(),
				receivedDate: z.string().nullish(),
				status: z.string().nullish(),
				campaignId: z.string().nullish(),
				resent: z.boolean().nullish(),
				sentBy: z.string().nullish(),
				channel: z.string().nullish(),
				isNegative: z.boolean().nullish(),
				isNeutral: z.boolean().nullish(),
				isPositive: z.boolean().nullish(),
				respondedDate: z.string().nullish(),
			})
			.loose()
			.nullish(),
		isEmailDeliverable: z.boolean().nullish(),
		syncId: z.string().nullish(),
		isAtRisk: z.boolean().nullish(),
		source: z.string().nullish(),
		isAnonymous: z.boolean().nullish(),
	})
	.loose();

export type RetentlyCustomer = z.infer<typeof CustomerSchema>;

const CustomersListResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.object({
				subscribers: z.array(CustomerSchema).nullish(),
				page: z.number().nullish(),
				pages: z.number().nullish(),
				limit: z.number().nullish(),
				sort: z.string().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

const CustomersGetInputSchema = z.object({
	customerId: IdSchema.describe('The Retently customer ID.'),
});

export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

/**
 * A by-ID lookup puts the customer straight in `data`. The docs sample shows a
 * one-row `subscribers` array, but the live API (checked 11-12) does not.
 */
const CustomersGetResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: CustomerSchema.nullish(),
	})
	.loose();

export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;

const SubscriberPropertySchema = z.object({
	label: z.string().min(1).describe('The property name as shown in Retently.'),
	type: z
		.enum([
			'string',
			'text',
			'integer',
			'number',
			'date',
			'boolean',
			'collection',
		])
		.optional()
		.describe('Defaults to string.'),
	value: PropertyValueSchema.describe('A scalar matching the type.'),
});

const SubscriberSchema = z.object({
	email: z.string().min(1),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	company: z.string().optional(),
	tags: z.array(z.string()).optional(),
	properties: z.array(SubscriberPropertySchema).optional(),
	unset_properties: z
		.array(z.string())
		.optional()
		.describe(
			'Properties to clear. Only the ones listed are cleared; the rest are left untouched.',
		),
	unset_tags: z
		.array(z.string())
		.optional()
		.describe('Tags to drop without resending the full list.'),
});

export type RetentlySubscriber = z.infer<typeof SubscriberSchema>;

const CustomersUpsertInputSchema = z.object({
	subscribers: z
		.array(SubscriberSchema)
		.min(1)
		.max(1000)
		.describe('Up to 1,000 customers. An existing email is updated.'),
});

export type CustomersUpsertInput = z.infer<typeof CustomersUpsertInputSchema>;

/** One customer's outcome in an upsert answer. */
const UpsertResultSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		company: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		properties: z
			.array(
				z
					.object({
						label: z.string().nullish(),
						name: z.string().nullish(),
						dataType: z.string().nullish(),
						value: JsonValueSchema.nullish(),
					})
					.loose(),
			)
			.nullish(),
		status: z.string().nullish().describe('created or updated.'),
		reason: z.string().nullish(),
	})
	.loose();

/**
 * The live API (checked 11-12) keys `data` by email, one result per customer.
 * The docs sample shows a `subscribers` array instead, so that shape still
 * parses.
 */
const CustomersUpsertResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.union([
				z.record(z.string(), UpsertResultSchema),
				z.object({ subscribers: z.array(CustomerSchema).nullish() }).loose(),
			])
			.nullish(),
		page: z.number().nullish(),
		pages: z.number().nullish(),
		limit: z.number().nullish(),
		sort: z.string().nullish(),
		total: z.number().nullish(),
	})
	.loose();

export type CustomersUpsertResponse = z.infer<
	typeof CustomersUpsertResponseSchema
>;

const EmailsOnlySchema = z.array(z.object({ email: z.string().min(1) })).min(1);

const CustomersUnsubscribeInputSchema = z.object({
	subscribers: EmailsOnlySchema.describe('The customers to unsubscribe.'),
	message: z
		.string()
		.optional()
		.describe('A custom opt-out message recorded with the unsubscribe.'),
});

export type CustomersUnsubscribeInput = z.infer<
	typeof CustomersUnsubscribeInputSchema
>;

const CustomersUnsubscribeResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.array(
				z
					.object({
						email: z.string().nullish(),
						unsubscribed: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type CustomersUnsubscribeResponse = z.infer<
	typeof CustomersUnsubscribeResponseSchema
>;

const CustomersResubscribeInputSchema = z.object({
	subscribers: EmailsOnlySchema.describe('The customers to resubscribe.'),
});

export type CustomersResubscribeInput = z.infer<
	typeof CustomersResubscribeInputSchema
>;

const ResubscribeResultSchema = z
	.object({
		email: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'resubscribed, already_subscribed, skipped or not_found. Only resubscribed means a change.',
			),
		reason: z
			.string()
			.nullish()
			.describe(
				'Why a skipped contact was left alone, such as self-unsubscribed or bounced.',
			),
		suppressed: z
			.boolean()
			.nullish()
			.describe(
				'True when an account-level email suppression still blocks delivery.',
			),
	})
	.loose();

const CustomersResubscribeResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: z.array(ResubscribeResultSchema).nullish(),
	})
	.loose();

export type CustomersResubscribeResponse = z.infer<
	typeof CustomersResubscribeResponseSchema
>;

const CustomersDeleteInputSchema = z.object({
	subscribers: EmailsOnlySchema.describe(
		'The customers to delete, with all their associated data.',
	),
});

export type CustomersDeleteInput = z.infer<typeof CustomersDeleteInputSchema>;

const CustomersDeleteResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.array(
				z
					.object({
						email: z.string().nullish(),
						deleted: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type CustomersDeleteResponse = z.infer<
	typeof CustomersDeleteResponseSchema
>;

// ── companies ─────────────────────────────────────────────────────────────

const CompaniesListInputSchema = CursorSchema;

export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;

const CompanySchema = z
	.object({
		id: z.string().nullish(),
		createdDate: z.string().nullish(),
		domain: z.string().nullish(),
		companyName: z.string().nullish(),
		industryName: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		cxMetrics: z
			.object({
				NPS: z.number().nullish(),
				CSAT: z.number().nullish(),
				CES: z.number().nullish(),
				STAR: z.number().nullish(),
			})
			.loose()
			.nullish(),
		contactsCount: z.number().nullish(),
	})
	.loose();

export type RetentlyCompany = z.infer<typeof CompanySchema>;

const CompaniesListResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: z
			.object({
				total: z.number().nullish(),
				page: z.number().nullish(),
				limit: z.number().nullish(),
				sort: z.string().nullish(),
				companies: z.array(CompanySchema).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

const CompaniesGetInputSchema = z.object({
	companyId: IdSchema.describe(
		'The company ID, or its domain such as acme.com.',
	),
});

export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;

const CompaniesGetResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: CompanySchema.nullish(),
	})
	.loose();

export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

// ── feedback ──────────────────────────────────────────────────────────────

const FeedbackListInputSchema = CursorSchema.extend({
	email: z.string().min(1).optional().describe("Search by a customer's email."),
	customerId: z
		.string()
		.min(1)
		.optional()
		.describe("Search by a customer's ID."),
	campaignId: z.string().min(1).optional().describe('Only this campaign.'),
	startDate: DateParamSchema.optional().describe(
		'Only responses at or after this instant.',
	),
	endDate: DateParamSchema.optional().describe(
		'Only responses at or before this instant, not expanded to the end of the day.',
	),
	attributes: z.array(AttributeSchema).min(1).optional(),
	match: z.enum(['all', 'any']).optional(),
});

export type FeedbackListInput = z.infer<typeof FeedbackListInputSchema>;

const AdditionalQuestionSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('RATING, OPEN_ENDED or MULTIPLE_OPTIONS.'),
		questionText: z.string().nullish(),
		metricsType: z.string().nullish(),
		answer: JsonValueSchema.optional().describe(
			'A number for RATING, a string for OPEN_ENDED, or a list for MULTIPLE_OPTIONS.',
		),
	})
	.loose();

const FeedbackNoteSchema = z
	.object({
		author: z.string().nullish(),
		content: z.string().nullish(),
		metricsType: z.string().nullish(),
		date: z.string().nullish(),
	})
	.loose();

const FeedbackTopicSchema = z
	.object({
		name: z.string().nullish(),
		sentiment: z.string().nullish(),
	})
	.loose();

export const FeedbackResponseSchema = z
	.object({
		id: z.string().nullish(),
		surveyId: z.string().nullish(),
		customerId: z.string().nullish(),
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		companyId: z.string().nullish(),
		jobTitle: z.string().nullish(),
		country: z.string().nullish(),
		state: z.string().nullish(),
		city: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		customProps: z.array(PropertySchema).nullish(),
		campaignName: z.string().nullish(),
		campaignId: z.string().nullish(),
		createdDate: z.string().nullish(),
		score: z.number().nullish(),
		comment: z.string().nullish(),
		checkbox: z.boolean().nullish(),
		additionalQuestions: z.array(AdditionalQuestionSchema).nullish(),
		feedbackTags: z.array(z.string()).nullish(),
		feedbackTagsNew: z.array(z.string()).nullish(),
		feedbackTopics: z.array(FeedbackTopicSchema).nullish(),
		notes: z.array(FeedbackNoteSchema).nullish(),
		status: z.string().nullish(),
		assigned: z.string().nullish(),
		ratingCategory: z.string().nullish(),
		resolved: z.boolean().nullish(),
		channel: z.string().nullish(),
		metricsType: z.string().nullish(),
		isBogus: z.boolean().nullish(),
		isSubmitted: z.boolean().nullish(),
	})
	.loose();

export type RetentlyFeedbackResponse = z.infer<typeof FeedbackResponseSchema>;

const FeedbackListResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.object({
				responses: z.array(FeedbackResponseSchema).nullish(),
				page: z.number().nullish(),
				pages: z.number().nullish(),
				limit: z.number().nullish(),
				sort: z.string().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type FeedbackListResponse = z.infer<typeof FeedbackListResponseSchema>;

const FeedbackGetInputSchema = z.object({
	feedbackId: IdSchema.describe('The response ID.'),
});

export type FeedbackGetInput = z.infer<typeof FeedbackGetInputSchema>;

const FeedbackGetResponseSchema = FeedbackListResponseSchema;

export type FeedbackGetResponse = z.infer<typeof FeedbackGetResponseSchema>;

// ── feedback.import ───────────────────────────────────────────────────────

/** The metric a RATING sub-answer is scored on. */
export const RETENTLY_IMPORT_METRICS = [
	'nps',
	'csat',
	'ces',
	'star',
	'thumbs',
	'xsat',
	'pmf',
] as const;

export const RETENTLY_TOPIC_SENTIMENTS = [
	'positive',
	'negative',
	'neutral',
] as const;

const ImportTopicSchema = z.object({
	name: z.string().min(1),
	sentiment: z.enum(RETENTLY_TOPIC_SENTIMENTS),
});

const ImportAdditionalQuestionSchema = z
	.object({
		uuid: z
			.string()
			.min(1)
			.describe('The question UUID from the template, via templates.get.'),
		type: z.enum(['RATING', 'OPEN_ENDED', 'MULTIPLE_OPTIONS']),
		answer: JsonValueSchema.describe(
			'A number for RATING, a string for OPEN_ENDED, or a list of option UUIDs (preferred) or texts for MULTIPLE_OPTIONS.',
		),
		metric: z
			.enum(RETENTLY_IMPORT_METRICS)
			.optional()
			.describe('Required for RATING, ignored otherwise. Case-insensitive.'),
	})
	.superRefine((question, ctx) => {
		if (question.type === 'RATING' && question.metric === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['metric'],
				message:
					'A RATING answer needs the metric its score is on; without it the item fails.',
			});
		}
	});

const ImportFeedbackItemSchema = z
	.object({
		email: z.string().min(1).describe('The respondent.'),
		score: z
			.number()
			.int()
			.describe(
				"Validated against the campaign's metric, such as 0-10 for NPS or 1-5 for CSAT. An out-of-range score fails that item, not the request.",
			),
		comment: z
			.string()
			.optional()
			.describe(
				"The main open-ended answer, mapped to the template's isMain question. Do not also answer that question in additional_questions: the item fails as ambiguous.",
			),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company: z.string().optional(),
		job_title: z.string().optional(),
		phone: z.string().optional(),
		country: z.string().optional(),
		state: z.string().optional(),
		city: z.string().optional(),
		tags: z
			.union([z.array(z.string()), z.string()])
			.optional()
			.describe('Feedback tags, as an array or a comma-separated string.'),
		customer_tags: z
			.array(z.string())
			.optional()
			.describe('Customer-level tags, separate from feedback tags.'),
		topics: z.array(ImportTopicSchema).optional(),
		properties: z.array(SubscriberPropertySchema).optional(),
		response_date: z
			.string()
			.optional()
			.describe(
				'ISO 8601 only; UNIX timestamps are rejected. This is the date the response is bucketed by, so set it on a historical import or the response lands on the import date.',
			),
		send_date: z.string().optional().describe('ISO 8601 only.'),
		open_date: z.string().optional().describe('ISO 8601 only.'),
		additional_questions: z.array(ImportAdditionalQuestionSchema).optional(),
	})
	.loose();

export type RetentlyImportFeedbackItem = z.infer<
	typeof ImportFeedbackItemSchema
>;

const ImportOptionsSchema = z.object({
	create_customers: z
		.boolean()
		.optional()
		.describe('Create customers that do not exist yet. Defaults to true.'),
	update_existing_customers: z
		.boolean()
		.optional()
		.describe(
			'Update existing customers from the feedback item. Defaults to false.',
		),
	skip_duplicates: z
		.boolean()
		.optional()
		.describe(
			'Skip an email that already has feedback in the window. Defaults to true.',
		),
	duplicate_check_window: z
		.number()
		.int()
		.min(1)
		.max(365)
		.optional()
		.describe('Days to look back for duplicates. Defaults to 30.'),
	default_send_date: z.string().optional().describe('ISO 8601 only.'),
});

const FeedbackImportInputSchema = z.object({
	campaign_id: z
		.string()
		.min(1)
		.describe(
			'The campaign to import into; it decides the metric and template.',
		),
	feedback: z
		.array(ImportFeedbackItemSchema)
		.min(1)
		.max(200)
		.describe('Up to 200 responses.'),
	options: ImportOptionsSchema.optional(),
});

export type FeedbackImportInput = z.infer<typeof FeedbackImportInputSchema>;

const ImportProblemSchema = z
	.object({
		email: z.string().nullish(),
		reason: z.string().nullish(),
		field: z.string().nullish(),
	})
	.loose();

const FeedbackImportResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: z
			.object({
				imported: z.number().nullish(),
				skipped: z.number().nullish(),
				failed: z.number().nullish(),
				customersCreated: z.number().nullish(),
				customersUpdated: z.number().nullish(),
				warnings: z.array(ImportProblemSchema).nullish(),
				details: z
					.object({
						skipped: z.array(ImportProblemSchema).nullish(),
						failed: z.array(ImportProblemSchema).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type FeedbackImportResponse = z.infer<
	typeof FeedbackImportResponseSchema
>;

// ── campaigns ─────────────────────────────────────────────────────────────

const CampaignsListInputSchema = z.object({});

const CampaignSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		isActive: z.boolean().nullish(),
		templateId: z.string().nullish(),
		metric: z.string().nullish().describe('NPS, CSAT, CES or STAR.'),
		type: z.string().nullish().describe('regular or transactional.'),
		channel: z.string().nullish(),
	})
	.loose();

export type RetentlyCampaign = z.infer<typeof CampaignSchema>;

const CampaignsListResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		campaigns: z.array(CampaignSchema).nullish(),
	})
	.loose();

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

// ── reports ───────────────────────────────────────────────────────────────

const ReportsGetInputSchema = z.object({
	campaignId: z
		.string()
		.min(1)
		.optional()
		.describe('Omit for every campaign in the account.'),
	startDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe(
			'YYYY-MM-DD only. ISO 8601 date-times and UNIX timestamps are a 400 here, unlike elsewhere in the API.',
		),
	endDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe('YYYY-MM-DD only, inclusive of the whole day.'),
});

export type ReportsGetInput = z.infer<typeof ReportsGetInputSchema>;

const RatingDistributionSchema = z
	.record(z.string(), z.number())
	.describe('Rating value to count; only ratings that occurred are listed.');

const ReportTrendPointSchema = z
	.object({
		day: z.string().nullish(),
		promoters: z.number().nullish(),
		passives: z.number().nullish(),
		detractors: z.number().nullish(),
		total: z.number().nullish(),
		score: z.number().nullish(),
		ratingDistribution: RatingDistributionSchema.nullish(),
	})
	.loose();

const ReportLastSchema = z
	.object({
		promoters: z.number().nullish(),
		passives: z.number().nullish(),
		detractors: z.number().nullish(),
		total: z.number().nullish(),
		score: z.number().nullish(),
		ratingDistribution: RatingDistributionSchema.nullish(),
	})
	.loose();

const DeliveryStatsSchema = z
	.object({
		totalCount: z.number().nullish(),
		opened: z.number().nullish(),
		responded: z.number().nullish(),
		optedOut: z.number().nullish(),
		isBounced: z.number().nullish(),
	})
	.loose();

const QuestionStatsSchema = z
	.object({
		day: z.string().nullish(),
		promoters: z.number().nullish(),
		passives: z.number().nullish(),
		detractors: z.number().nullish(),
		responded: z.number().nullish(),
		opened: z.number().nullish(),
		skipped: z.number().nullish(),
		total: z.number().nullish(),
		scoreSum: z.number().nullish(),
		score: z.number().nullish(),
	})
	.loose();

const QuestionReportSchema = z
	.object({
		uuid: z.string().nullish(),
		title: z.string().nullish(),
		isStarred: z.boolean().nullish(),
		position: z.number().nullish(),
		isOnMain: z.boolean().nullish(),
		metricsType: z.string().nullish(),
		stats: z
			.object({
				last: QuestionStatsSchema.nullish(),
				first: QuestionStatsSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const CampaignReportSchema = z
	.object({
		campaignId: z.string().nullish(),
		name: z.string().nullish(),
		isActive: z.boolean().nullish(),
		metric: z.string().nullish(),
		type: z.string().nullish(),
		trend: z.array(ReportTrendPointSchema).nullish(),
		last: ReportLastSchema.nullish(),
		deliveryStats: DeliveryStatsSchema.nullish(),
		questionsStats: z.array(QuestionReportSchema).nullish(),
	})
	.loose();

export type RetentlyCampaignReport = z.infer<typeof CampaignReportSchema>;

const ReportsGetResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: z.array(CampaignReportSchema).nullish(),
	})
	.loose();

export type ReportsGetResponse = z.infer<typeof ReportsGetResponseSchema>;

// ── outbox ────────────────────────────────────────────────────────────────

const OutboxListInputSchema = CursorSchema.extend({
	email: z
		.string()
		.min(1)
		.optional()
		.describe("Find a customer's sent surveys."),
	campaignId: z.string().min(1).optional(),
	startDate: DateParamSchema.optional().describe(
		'Surveys sent at or after this date, snapped to the start of the day in the account timezone.',
	),
	endDate: DateParamSchema.optional().describe(
		'Surveys sent at or before this date, snapped to the end of the day in the account timezone.',
	),
	channel: z.enum(['email', 'link', 'inapp', 'intercom', 'embed']).optional(),
	sentBy: z
		.enum(['campaign', 'reminder', 'manual', 'test', 'imported'])
		.optional(),
	attributes: z.array(AttributeSchema).min(1).optional(),
	match: z.enum(['all', 'any']).optional(),
});

export type OutboxListInput = z.infer<typeof OutboxListInputSchema>;

const OutboxStatusSchema = z
	.object({
		isOpened: z.boolean().nullish(),
		openedDate: z.string().nullish(),
		isResponded: z.boolean().nullish(),
		respondedDate: z.string().nullish(),
		hasFeedback: z.boolean().nullish(),
		isOptedOut: z.boolean().nullish(),
		isBounced: z.boolean().nullish(),
	})
	.loose();

const AdditionalRecipientSchema = z
	.object({
		email: z.string().nullish(),
		type: z.string().nullish().describe('cc or bcc.'),
		mandrillMessageId: z.string().nullish(),
	})
	.loose();

const SurveySchema = z
	.object({
		surveyId: z.string().nullish(),
		email: z.string().nullish(),
		customerId: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		companyName: z.string().nullish(),
		companyId: z.string().nullish(),
		personTags: z
			.string()
			.nullish()
			.describe('A JSON-encoded array, sent as a string.'),
		sentDate: z.string().nullish(),
		channel: z.string().nullish(),
		campaign: z.string().nullish(),
		campaignId: z.string().nullish(),
		surveyTemplateId: z.string().nullish(),
		subject: z.string().nullish(),
		sentBy: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('SENT, OPENED, RESPONDED, BOUNCED and so on.'),
		detailedStatus: OutboxStatusSchema.nullish(),
		additionalRecipients: z.array(AdditionalRecipientSchema).nullish(),
		mandrillMessageId: z.string().nullish(),
		responseId: z.string().nullish(),
	})
	.loose();

export type RetentlySurvey = z.infer<typeof SurveySchema>;

const OutboxListResponseSchema = z
	.object({
		message: z.string().nullish(),
		code: z.number().nullish(),
		data: z
			.object({
				surveys: z.array(SurveySchema).nullish(),
				page: z.number().nullish(),
				pages: z.number().nullish(),
				limit: z.number().nullish(),
				sort: z.string().nullish(),
				total: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type OutboxListResponse = z.infer<typeof OutboxListResponseSchema>;

// ── templates ─────────────────────────────────────────────────────────────

const TemplatesListInputSchema = z.object({});

const TemplateSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		channel: z.string().nullish(),
		metric: z.string().nullish(),
	})
	.loose();

export type RetentlyTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		templates: z.array(TemplateSchema).nullish(),
	})
	.loose();

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

const TemplatesGetInputSchema = z.object({
	templateId: IdSchema.describe('A template ID from templates.list.'),
});

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const TemplateOptionSchema = z
	.object({
		uuid: z.string().nullish(),
		text: z.string().nullish(),
	})
	.loose();

const SurveyQuestionSchema = z
	.object({
		uuid: z
			.string()
			.nullish()
			.describe('Pass this as `uuid` in feedback.import additional_questions.'),
		type: z
			.string()
			.nullish()
			.describe('RATING, OPEN_ENDED or MULTIPLE_OPTIONS.'),
		title: z.string().nullish(),
		isMain: z
			.boolean()
			.nullish()
			.describe(
				'The primary open-ended question, which a top-level `comment` fills automatically.',
			),
		options: z
			.array(TemplateOptionSchema)
			.nullish()
			.describe('MULTIPLE_OPTIONS only.'),
	})
	.loose();

const TemplateDetailSchema = TemplateSchema.extend({
	surveyQuestions: z.array(SurveyQuestionSchema).nullish(),
});

export type RetentlyTemplateDetail = z.infer<typeof TemplateDetailSchema>;

const TemplatesGetResponseSchema = z
	.object({
		code: z.number().nullish(),
		message: z.string().nullish(),
		data: TemplateDetailSchema.nullish(),
	})
	.loose();

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

// ── survey.send ───────────────────────────────────────────────────────────

const SurveySendInputSchema = z.object({
	campaign: z
		.string()
		.min(1)
		.describe(
			'The transactional campaign to survey through. A regular campaign is a 400.',
		),
	delay: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			"Days to wait, overriding the campaign's scheduling. Omit it to respect the campaign's sending time frame.",
		),
	subscribers: z
		.array(SubscriberSchema)
		.min(1)
		.max(100)
		.describe('Up to 100 customers.'),
});

export type SurveySendInput = z.infer<typeof SurveySendInputSchema>;

const SurveySendResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		code: z.number().nullish(),
		message: z.string().nullish(),
		status: z.string().nullish().describe('queued, or error on a refusal.'),
	})
	.loose();

export type SurveySendResponse = z.infer<typeof SurveySendResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RetentlyEndpointInputs = {
	accountPing: z.infer<typeof AccountPingInputSchema>;
	customersList: CustomersListInput;
	customersGet: CustomersGetInput;
	customersUpsert: CustomersUpsertInput;
	customersUnsubscribe: CustomersUnsubscribeInput;
	customersResubscribe: CustomersResubscribeInput;
	customersDelete: CustomersDeleteInput;
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	feedbackList: FeedbackListInput;
	feedbackGet: FeedbackGetInput;
	feedbackImport: FeedbackImportInput;
	campaignsList: z.infer<typeof CampaignsListInputSchema>;
	reportsGet: ReportsGetInput;
	outboxList: OutboxListInput;
	templatesList: z.infer<typeof TemplatesListInputSchema>;
	templatesGet: TemplatesGetInput;
	surveySend: SurveySendInput;
};

export type RetentlyEndpointOutputs = {
	accountPing: AccountPingResponse;
	customersList: CustomersListResponse;
	customersGet: CustomersGetResponse;
	customersUpsert: CustomersUpsertResponse;
	customersUnsubscribe: CustomersUnsubscribeResponse;
	customersResubscribe: CustomersResubscribeResponse;
	customersDelete: CustomersDeleteResponse;
	companiesList: CompaniesListResponse;
	companiesGet: CompaniesGetResponse;
	feedbackList: FeedbackListResponse;
	feedbackGet: FeedbackGetResponse;
	feedbackImport: FeedbackImportResponse;
	campaignsList: CampaignsListResponse;
	reportsGet: ReportsGetResponse;
	outboxList: OutboxListResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	surveySend: SurveySendResponse;
};

export const RetentlyEndpointInputSchemas = {
	accountPing: AccountPingInputSchema,
	customersList: CustomersListInputSchema,
	customersGet: CustomersGetInputSchema,
	customersUpsert: CustomersUpsertInputSchema,
	customersUnsubscribe: CustomersUnsubscribeInputSchema,
	customersResubscribe: CustomersResubscribeInputSchema,
	customersDelete: CustomersDeleteInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	feedbackList: FeedbackListInputSchema,
	feedbackGet: FeedbackGetInputSchema,
	feedbackImport: FeedbackImportInputSchema,
	campaignsList: CampaignsListInputSchema,
	reportsGet: ReportsGetInputSchema,
	outboxList: OutboxListInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	surveySend: SurveySendInputSchema,
} as const;

export const RetentlyEndpointOutputSchemas = {
	accountPing: AccountPingResponseSchema,
	customersList: CustomersListResponseSchema,
	customersGet: CustomersGetResponseSchema,
	customersUpsert: CustomersUpsertResponseSchema,
	customersUnsubscribe: CustomersUnsubscribeResponseSchema,
	customersResubscribe: CustomersResubscribeResponseSchema,
	customersDelete: CustomersDeleteResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	feedbackList: FeedbackListResponseSchema,
	feedbackGet: FeedbackGetResponseSchema,
	feedbackImport: FeedbackImportResponseSchema,
	campaignsList: CampaignsListResponseSchema,
	reportsGet: ReportsGetResponseSchema,
	outboxList: OutboxListResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	surveySend: SurveySendResponseSchema,
} as const;

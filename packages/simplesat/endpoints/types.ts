import { z } from 'zod';

/**
 * Simplesat's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field Simplesat adds or omits cannot fail a
 * read that already succeeded.
 *
 * Every list answers `{ next, previous, count, <resource> }`, where `next` is a
 * full URL for the following page rather than a cursor value. The output models
 * that envelope, and the endpoint strips the API base so it can be replayed.
 *
 * Contract: https://developer.simplesat.io/api
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const Timestamp = z.string().describe('ISO 8601.');

/**
 * A caller's own attributes, whose keys and value types are set by whoever
 * configured the survey rather than by Simplesat.
 */
const CustomAttributesSchema = z.record(z.string(), z.unknown()); // unknown: any value

const CustomerSchema = z
	.object({
		id: z.number().int().nullish(),
		external_id: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		company: z.string().nullish(),
		language: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_attributes: CustomAttributesSchema.nullish(),
	})
	.loose();

export type SimplesatCustomer = z.infer<typeof CustomerSchema>;

const TeamMemberSchema = z
	.object({
		id: z.number().int().nullish(),
		external_id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		custom_attributes: CustomAttributesSchema.nullish(),
		groups: z.array(z.string()).nullish(),
	})
	.loose();

export type SimplesatTeamMember = z.infer<typeof TeamMemberSchema>;

const SurveySchema = z
	.object({
		id: z.number().int().nullish(),
		name: z.string().nullish(),
		metric: z.string().nullish(),
		survey_token: z.string().nullish(),
		survey_type: z.string().nullish(),
		brand_name: z.string().nullish(),
	})
	.loose();

export type SimplesatSurvey = z.infer<typeof SurveySchema>;

const QuestionSchema = z
	.object({
		id: z.number().int().nullish(),
		survey: z
			.object({
				id: z.number().int().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		order: z.number().int().nullish(),
		metric: z.string().nullish(),
		type: z.string().nullish(),
		text: z.string().nullish(),
		rating_scale: z.boolean().nullish(),
		required: z.boolean().nullish(),
		choices: z.array(z.string()).nullish(),
	})
	.loose();

export type SimplesatQuestion = z.infer<typeof QuestionSchema>;

/** An answer as the response routes embed it and the answer routes return it. */
const AnswerSchema = z
	.object({
		id: z.number().int().nullish(),
		question: z
			.object({
				id: z.number().int().nullish(),
				text: z.string().nullish(),
				metric: z.string().nullish(),
			})
			.loose()
			.nullish(),
		choice: z.string().nullish(),
		choice_label: z.string().nullish(),
		choices: z.array(z.string()).nullish(),
		sentiment: z.string().nullish(),
		comment: z.string().nullish(),
		follow_up_answer: z.string().nullish(),
		follow_up_answer_choice: z.string().nullish(),
		follow_up_answer_choices: z.array(z.string()).nullish(),
		survey: z
			.object({
				id: z.number().int().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type SimplesatAnswer = z.infer<typeof AnswerSchema>;

const ResponseSchema = z
	.object({
		id: z.number().int().nullish(),
		survey_id: z.number().int().nullish(),
		language: z.string().nullish(),
		created: Timestamp.nullish(),
		modified: Timestamp.nullish(),
		ip_address: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		ticket: z
			.object({
				external_id: z.string().nullish(),
				subject: z.string().nullish(),
				custom_attributes: CustomAttributesSchema.nullish(),
			})
			.loose()
			.nullish(),
		team_members: z
			.array(
				z
					.object({
						external_id: z.string().nullish(),
						name: z.string().nullish(),
						email: z.string().nullish(),
						role: z.string().nullish(),
						is_primary: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		customer: CustomerSchema.nullish(),
		answers: z.array(AnswerSchema).nullish(),
	})
	.loose();

export type SimplesatResponse = z.infer<typeof ResponseSchema>;

/**
 * Simplesat answers a list as `{ next, previous, count, <resource> }`, naming the
 * array after the resource. The endpoint renames it to `results`, so one page
 * shape covers every list route, and each page link becomes a path with the API
 * base removed.
 */
function pageOf<T extends z.ZodType>(item: T) {
	return z
		.object({
			next: z
				.string()
				.nullish()
				.describe(
					'Path of the next page, or null on the last one. Pass it back as `next`.',
				),
			previous: z.string().nullish(),
			count: z.number().nullish().describe('Total matching records.'),
			results: z.array(item),
		})
		.loose();
}

/** The page shape every list route returns after the endpoint renames it. */
export type SimplesatPage<T> = z.infer<ReturnType<typeof pageOf<z.ZodType<T>>>>;

// ── customers ─────────────────────────────────────────────────────────────

const pageQuery = {
	page: z.number().int().min(1).optional().describe('Page number, from 1.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(250)
		.optional()
		.describe('Results per page, up to 250. Defaults to 50.'),
	next: z
		.string()
		.optional()
		.describe(
			'The `next` path from the previous page. It replaces the other filters, because Simplesat already encoded them into it.',
		),
};

const CustomersListInputSchema = z.object({
	...pageQuery,
	created_after: Timestamp.optional(),
	created_before: Timestamp.optional(),
	modified_after: Timestamp.optional(),
	modified_before: Timestamp.optional(),
	subscribed: z.boolean().optional(),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

const CustomersListResponseSchema = pageOf(CustomerSchema);

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

const customerBody = {
	external_id: z.string().nullish().describe('Your own id for this customer.'),
	email: z.string().nullish(),
	name: z.string().nullish(),
	company: z.string().nullish(),
	language: z.string().nullish(),
	tags: z.array(z.string()).nullish(),
	custom_attributes: CustomAttributesSchema.nullish(),
};

/**
 * The API calls this "create or update", so it is an upsert keyed on
 * `external_id` or `email`. Sending neither would create a record Simplesat
 * cannot match against later, so one is required here.
 */
const CustomersCreateInputSchema = z
	.object(customerBody)
	.superRefine((value, ctx) => {
		if (!value.external_id && !value.email) {
			ctx.addIssue({
				code: 'custom',
				path: ['external_id'],
				message:
					'Send external_id or email: Simplesat matches an existing customer on one of them.',
			});
		}
	});

export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;

const CustomersCreateResponseSchema = CustomerSchema;

export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;

const CustomerIdInputSchema = z.object({
	customer_id: z.string().describe('The Simplesat id, or an external id.'),
});

export type CustomerIdInput = z.infer<typeof CustomerIdInputSchema>;

const CustomersGetResponseSchema = CustomerSchema;

export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;

const CustomersUpdateInputSchema = z.object({
	customer_id: z.string(),
	...customerBody,
});

export type CustomersUpdateInput = z.infer<typeof CustomersUpdateInputSchema>;

const CustomersUpdateResponseSchema = CustomerSchema;

export type CustomersUpdateResponse = z.infer<
	typeof CustomersUpdateResponseSchema
>;

const CustomersBulkInputSchema = z.object({
	customers: z
		.array(z.object(customerBody))
		.min(1)
		.describe('The customers to create or update.'),
});

export type CustomersBulkInput = z.infer<typeof CustomersBulkInputSchema>;

/**
 * A bulk write is queued, not applied: the answer carries a `request_id` and a
 * message rather than the stored records.
 */
const CustomersBulkResponseSchema = z
	.object({
		request_id: z.string().nullish(),
		detail: z.string().nullish(),
	})
	.loose();

export type CustomersBulkResponse = z.infer<typeof CustomersBulkResponseSchema>;

// ── teamMembers ───────────────────────────────────────────────────────────

const TeamMembersCreateInputSchema = z.object({
	external_id: z.string().nullish(),
	name: z.string().nullish(),
	email: z.string().nullish(),
	custom_attributes: CustomAttributesSchema.nullish(),
});

export type TeamMembersCreateInput = z.infer<
	typeof TeamMembersCreateInputSchema
>;

const TeamMembersCreateResponseSchema = TeamMemberSchema;

export type TeamMembersCreateResponse = z.infer<
	typeof TeamMembersCreateResponseSchema
>;

const TeamMemberIdInputSchema = z.object({
	team_member_id: z.string().describe('The Simplesat team member id.'),
});

export type TeamMemberIdInput = z.infer<typeof TeamMemberIdInputSchema>;

const TeamMembersGetResponseSchema = TeamMemberSchema;

export type TeamMembersGetResponse = z.infer<
	typeof TeamMembersGetResponseSchema
>;

// ── surveys ───────────────────────────────────────────────────────────────

const SurveysListInputSchema = z.object({
	...pageQuery,
	name: z.string().optional().describe('Only surveys whose name matches.'),
});

export type SurveysListInput = z.infer<typeof SurveysListInputSchema>;

const SurveysListResponseSchema = pageOf(SurveySchema);

export type SurveysListResponse = z.infer<typeof SurveysListResponseSchema>;

const SurveyTokenInputSchema = z.object({
	survey_token: z
		.string()
		.describe('The survey_token from surveys.list, not the numeric id.'),
});

export type SurveyTokenInput = z.infer<typeof SurveyTokenInputSchema>;

const SurveysEmailInputSchema = z.object({
	survey_token: z.string(),
	customer: z
		.object({
			email: z.string().describe('Required.'),
			id: z.string().nullish().describe('Your own id for the customer.'),
			name: z.string().nullish(),
			external_id: z.string().nullish(),
		})
		.describe('The customer to send the survey to.'),
});

export type SurveysEmailInput = z.infer<typeof SurveysEmailInputSchema>;

const SurveysEmailResponseSchema = z
	.object({ detail: z.string().nullish() })
	.loose();

export type SurveysEmailResponse = z.infer<typeof SurveysEmailResponseSchema>;

// ── questions ─────────────────────────────────────────────────────────────

const QuestionsListInputSchema = z.object({
	...pageQuery,
	survey_id: z.number().int().optional(),
	metric: z.string().optional(),
});

export type QuestionsListInput = z.infer<typeof QuestionsListInputSchema>;

const QuestionsListResponseSchema = pageOf(QuestionSchema);

export type QuestionsListResponse = z.infer<typeof QuestionsListResponseSchema>;

// ── answers ───────────────────────────────────────────────────────────────

const searchFilters = z
	.array(
		z.object({
			key: z.string().describe('The field to filter on, such as sentiment.'),
			values: z.array(z.string()),
			attribute: z
				.string()
				.optional()
				.describe('The attribute, when the key names a custom field.'),
			comparison: z.string().describe('The comparison, such as is or is not.'),
		}),
	)
	.optional();

const AnswersSearchInputSchema = z.object({
	...pageQuery,
	start_date: Timestamp.optional(),
	end_date: Timestamp.optional(),
	filters: searchFilters,
});

export type AnswersSearchInput = z.infer<typeof AnswersSearchInputSchema>;

const AnswersSearchResponseSchema = pageOf(AnswerSchema);

export type AnswersSearchResponse = z.infer<typeof AnswersSearchResponseSchema>;

const AnswerIdInputSchema = z.object({
	answer_id: z.string(),
});

export type AnswerIdInput = z.infer<typeof AnswerIdInputSchema>;

const AnswersGetResponseSchema = AnswerSchema;

export type AnswersGetResponse = z.infer<typeof AnswersGetResponseSchema>;

const AnswersUpdateInputSchema = z.object({
	answer_id: z.string(),
	choice: z.string().nullish().describe('The chosen option id.'),
	choices: z
		.array(z.string())
		.nullish()
		.describe('The chosen option ids, for a multi-select question.'),
	comment: z.string().nullish(),
	sentiment: z.string().nullish(),
	follow_up_answer: z.string().nullish(),
	follow_up_answer_choice: z.string().nullish(),
	follow_up_answer_choices: z.array(z.string()).nullish(),
});

export type AnswersUpdateInput = z.infer<typeof AnswersUpdateInputSchema>;

const AnswersUpdateResponseSchema = AnswerSchema;

export type AnswersUpdateResponse = z.infer<typeof AnswersUpdateResponseSchema>;

// ── responses ─────────────────────────────────────────────────────────────

const ResponseAnswerInputSchema = z.object({
	question_id: z.number().int(),
	choice: z.string().optional(),
	choices: z.array(z.string()).optional(),
	comment: z.string().optional(),
	sentiment: z.string().optional(),
	follow_up_answer: z.string().optional(),
	follow_up_answer_choice: z.string().optional(),
	follow_up_answer_choices: z.array(z.string()).optional(),
});

const TeamMemberInResponseSchema = z.object({
	email: z.string(),
	role: z.string(),
	is_primary: z.boolean(),
	external_id: z.string().optional(),
	name: z.string().optional(),
	custom_attributes: CustomAttributesSchema.optional(),
});

/**
 * The response body both write routes take. Only `survey_id` is required by the
 * API; everything else shapes the answer, and an update sends the whole record
 * back the same way.
 */
const responseBody = {
	survey_id: z.number().int(),
	language: z.string().optional(),
	created: z
		.string()
		.optional()
		.describe(
			'Backdates the response, when the survey was answered elsewhere.',
		),
	tags: z.array(z.string()).optional(),
	answers: z.array(ResponseAnswerInputSchema).optional(),
	team_members: z.array(TeamMemberInResponseSchema).optional(),
	ticket: z
		.object({
			external_id: z.string().optional(),
			subject: z.string().optional(),
			custom_attributes: CustomAttributesSchema.optional(),
		})
		.optional(),
	customer: z
		.object({
			email: z.string(),
			external_id: z.string().optional(),
			name: z.string().optional(),
			tags: z.array(z.string()).optional(),
			company: z.string().optional(),
			custom_attributes: CustomAttributesSchema.optional(),
		})
		.optional(),
};

const ResponsesCreateInputSchema = z.object(responseBody);

export type ResponsesCreateInput = z.infer<typeof ResponsesCreateInputSchema>;

const ResponsesCreateResponseSchema = ResponseSchema;

export type ResponsesCreateResponse = z.infer<
	typeof ResponsesCreateResponseSchema
>;

const ResponsesSearchInputSchema = z.object({
	...pageQuery,
	start_date: Timestamp.optional(),
	created_start_date: Timestamp.optional(),
	end_date: Timestamp.optional(),
	created_end_date: Timestamp.optional(),
	modified_start_date: Timestamp.optional(),
	modified_end_date: Timestamp.optional(),
	filters: searchFilters,
});

export type ResponsesSearchInput = z.infer<typeof ResponsesSearchInputSchema>;

const ResponsesSearchResponseSchema = pageOf(ResponseSchema);

export type ResponsesSearchResponse = z.infer<
	typeof ResponsesSearchResponseSchema
>;

const ResponseIdInputSchema = z.object({
	response_id: z.string(),
});

export type ResponseIdInput = z.infer<typeof ResponseIdInputSchema>;

const ResponsesGetResponseSchema = ResponseSchema;

export type ResponsesGetResponse = z.infer<typeof ResponsesGetResponseSchema>;

const ResponsesUpdateInputSchema = z.object({
	response_id: z.string(),
	...responseBody,
});

export type ResponsesUpdateInput = z.infer<typeof ResponsesUpdateInputSchema>;

const ResponsesUpdateResponseSchema = ResponseSchema;

export type ResponsesUpdateResponse = z.infer<
	typeof ResponsesUpdateResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SimplesatEndpointInputs = {
	customersList: CustomersListInput;
	customersGet: CustomerIdInput;
	customersCreate: CustomersCreateInput;
	customersUpdate: CustomersUpdateInput;
	customersBulk: CustomersBulkInput;
	teamMembersGet: TeamMemberIdInput;
	teamMembersCreate: TeamMembersCreateInput;
	surveysList: SurveysListInput;
	surveysEmail: SurveysEmailInput;
	questionsList: QuestionsListInput;
	answersSearch: AnswersSearchInput;
	answersGet: AnswerIdInput;
	answersUpdate: AnswersUpdateInput;
	responsesSearch: ResponsesSearchInput;
	responsesCreate: ResponsesCreateInput;
	responsesGet: ResponseIdInput;
	responsesUpdate: ResponsesUpdateInput;
};

export type SimplesatEndpointOutputs = {
	customersList: CustomersListResponse;
	customersGet: CustomersGetResponse;
	customersCreate: CustomersCreateResponse;
	customersUpdate: CustomersUpdateResponse;
	customersBulk: CustomersBulkResponse;
	teamMembersGet: TeamMembersGetResponse;
	teamMembersCreate: TeamMembersCreateResponse;
	surveysList: z.infer<typeof SurveysListResponseSchema>;
	surveysEmail: SurveysEmailResponse;
	questionsList: z.infer<typeof QuestionsListResponseSchema>;
	answersSearch: z.infer<typeof AnswersSearchResponseSchema>;
	answersGet: AnswersGetResponse;
	answersUpdate: AnswersUpdateResponse;
	responsesSearch: z.infer<typeof ResponsesSearchResponseSchema>;
	responsesCreate: ResponsesCreateResponse;
	responsesGet: ResponsesGetResponse;
	responsesUpdate: ResponsesUpdateResponse;
};

export const SimplesatEndpointInputSchemas = {
	customersList: CustomersListInputSchema,
	customersGet: CustomerIdInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersBulk: CustomersBulkInputSchema,
	teamMembersGet: TeamMemberIdInputSchema,
	teamMembersCreate: TeamMembersCreateInputSchema,
	surveysList: SurveysListInputSchema,
	surveysEmail: SurveysEmailInputSchema,
	questionsList: QuestionsListInputSchema,
	answersSearch: AnswersSearchInputSchema,
	answersGet: AnswerIdInputSchema,
	answersUpdate: AnswersUpdateInputSchema,
	responsesSearch: ResponsesSearchInputSchema,
	responsesCreate: ResponsesCreateInputSchema,
	responsesGet: ResponseIdInputSchema,
	responsesUpdate: ResponsesUpdateInputSchema,
} as const;

export const SimplesatEndpointOutputSchemas = {
	customersList: CustomersListResponseSchema,
	customersGet: CustomersGetResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersUpdate: CustomersUpdateResponseSchema,
	customersBulk: CustomersBulkResponseSchema,
	teamMembersGet: TeamMembersGetResponseSchema,
	teamMembersCreate: TeamMembersCreateResponseSchema,
	surveysList: SurveysListResponseSchema,
	surveysEmail: SurveysEmailResponseSchema,
	questionsList: QuestionsListResponseSchema,
	answersSearch: AnswersSearchResponseSchema,
	answersGet: AnswersGetResponseSchema,
	answersUpdate: AnswersUpdateResponseSchema,
	responsesSearch: ResponsesSearchResponseSchema,
	responsesCreate: ResponsesCreateResponseSchema,
	responsesGet: ResponsesGetResponseSchema,
	responsesUpdate: ResponsesUpdateResponseSchema,
} as const;

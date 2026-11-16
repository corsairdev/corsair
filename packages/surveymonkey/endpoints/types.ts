import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// SurveyMonkey shapes come from the vendor's own documentation repo,
// https://github.com/SurveyMonkey/public_api_docs. Every id is a **string**
// even when it looks numeric, and every list is wrapped in
// `{ data, page, per_page, total, links }`.

/** A paging wrapper. `links` carries the self/next/prev/first/last URLs. */
const linksSchema = z
	.object({
		self: z.string().nullish(),
		next: z.string().nullish(),
		prev: z.string().nullish(),
		first: z.string().nullish(),
		last: z.string().nullish(),
	})
	.loose();

/** The paging fields a list route puts beside its `data` array. */
const pagingFields = {
	page: z.number().int().nullish(),
	per_page: z.number().int().nullish(),
	total: z.number().int().nullish(),
	links: linksSchema.nullish(),
};

/** Builds the `{ data: [...] }` wrapper every list route answers. */
function listOf<T extends z.ZodType>(item: T) {
	return z.object({ ...pagingFields, data: z.array(item) }).loose();
}

const buttonsTextSchema = z
	.object({
		next_button: z.string().nullish(),
		prev_button: z.string().nullish(),
		exit_button: z.string().nullish(),
		done_button: z.string().nullish(),
	})
	.loose();

const surveySchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		nickname: z.string().nullish(),
		category: z.string().nullish(),
		language: z.string().nullish(),
		question_count: z.number().int().nullish(),
		page_count: z.number().int().nullish(),
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		href: z.string().nullish(),
		buttons_text: buttonsTextSchema.nullish(),
		custom_variables: z.record(z.string(), z.string()).nullish(),
		footer: z.boolean().nullish(),
		folder_id: z.string().nullish(),
		preview: z.string().nullish(),
		edit_url: z.string().nullish(),
		collect_url: z.string().nullish(),
		analyze_url: z.string().nullish(),
		summary_url: z.string().nullish(),
		response_count: z.number().int().nullish(),
	})
	.loose();

const pageSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		position: z.number().int().nullish(),
		question_count: z.number().int().nullish(),
		href: z.string().nullish(),
		questions: z.array(z.looseObject({})).nullish(),
	})
	.loose();

const questionSchema = z
	.object({
		id: z.string(),
		headings: z
			.array(
				z
					.object({
						heading: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		family: z.string().nullish(),
		subtype: z.string().nullish(),
		position: z.number().int().nullish(),
		required: z.looseObject({}).nullish(),
		visible: z.boolean().nullish(),
		href: z.string().nullish(),
		answers: z
			.object({
				choices: z
					.array(
						z
							.object({
								id: z.string().nullish(),
								position: z.number().int().nullish(),
								visible: z.boolean().nullish(),
								text: z.string().nullish(),
							})
							.loose(),
					)
					.nullish(),
				rows: z.array(z.looseObject({})).nullish(),
				other: z.array(z.looseObject({})).nullish(),
				cols: z.array(z.looseObject({})).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const collectorSchema = z
	.object({
		id: z.string(),
		status: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		thank_you_message: z.string().nullish(),
		disqualification_message: z.string().nullish(),
		disqualification_url: z.string().nullish(),
		close_date: z.string().nullish(),
		closed_page_message: z.string().nullish(),
		redirect_url: z.string().nullish(),
		display_survey_results: z.boolean().nullish(),
		edit_response_type: z.string().nullish(),
		anonymous_type: z.string().nullish(),
		allow_multiple_responses: z.boolean().nullish(),
		date_modified: z.string().nullish(),
		date_created: z.string().nullish(),
		url: z.string().nullish(),
		open: z.boolean().nullish(),
		password_enabled: z.boolean().nullish(),
		sender_email: z.string().nullish(),
		response_limit: z.number().int().nullish(),
		redirect_type: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

const messageSchema = z
	.object({
		id: z.string(),
		status: z.string().nullish(),
		type: z.string().nullish(),
		subject: z.string().nullish(),
		body: z.string().nullish(),
		is_branding_enabled: z.boolean().nullish(),
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

const recipientSchema = z
	.object({
		id: z.string(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		href: z.string().nullish(),
		survey_response_status: z.string().nullish(),
		mail_status: z.string().nullish(),
	})
	.loose();

const contactSchema = z
	.object({
		id: z.string(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		phone_number: z.string().nullish(),
		status: z.string().nullish(),
		href: z.string().nullish(),
		custom_fields: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

const contactListSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

const contactFieldSchema = z
	.object({
		id: z.string(),
		label: z.string().nullish(),
		type: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

const webhookSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		event_type: z.string().nullish(),
		object_type: z.string().nullish(),
		object_ids: z.array(z.string()).nullish(),
		subscription_url: z.string().nullish(),
		authorization: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

/** One answer on one question. Only the fields the question type uses appear. */
const answerSchema = z
	.object({
		choice_id: z.string().nullish(),
		row_id: z.string().nullish(),
		col_id: z.string().nullish(),
		other_id: z.string().nullish(),
		text: z.string().nullish(),
		download_url: z.string().nullish(),
		human_download_url: z.string().nullish(),
		content_type: z.string().nullish(),
		tag_data: z.looseObject({}).nullish(),
	})
	.loose();

const questionAnswerSchema = z
	.object({
		id: z.string().nullish(),
		variable_id: z.string().nullish(),
		answers: z.array(answerSchema).nullish(),
	})
	.loose();

const responsePageSchema = z
	.object({
		id: z.string().nullish(),
		questions: z.array(questionAnswerSchema).nullish(),
	})
	.loose();

/** The full response, as the collector and survey detail routes answer it. */
const responseSchema = z
	.object({
		id: z.string(),
		href: z.string().nullish(),
		survey_id: z.string().nullish(),
		collector_id: z.string().nullish(),
		recipient_id: z.string().nullish(),
		total_time: z.number().int().nullish(),
		custom_value: z.string().nullish(),
		edit_url: z.string().nullish(),
		analyze_url: z.string().nullish(),
		ip_address: z.string().nullish(),
		language: z.string().nullish(),
		custom_variables: z.record(z.string(), z.string()).nullish(),
		collection_mode: z.string().nullish(),
		response_status: z.string().nullish(),
		date_created: z.string().nullish(),
		date_modified: z.string().nullish(),
		pages: z.array(responsePageSchema).nullish(),
	})
	.loose();

/** A response in the survey list, which carries only the id and the link. */
const responseSummarySchema = z
	.object({
		id: z.string(),
		href: z.string().nullish(),
	})
	.loose();

const userSchema = z
	.object({
		id: z.string(),
		username: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		account_type: z.string().nullish(),
		language: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

// ── surveys ───────────────────────────────────────────────────────────────

const SurveysListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(1000).optional(),
	sort_by: z.enum(['title', 'date_modified', 'date_created']).optional(),
	sort_order: z.enum(['ASC', 'DESC']).optional(),
	/** `-response_count` for the list, or `response_count` on a survey. */
	include: z.string().optional(),
	title: z.string().optional(),
	folder_id: z.string().optional(),
	start_modified_at: z.string().optional(),
	end_modified_at: z.string().optional(),
});

export type SurveysListInput = z.input<typeof SurveysListInputSchema>;

const SurveysListResponseSchema = listOf(surveySchema);

export type SurveysListResponse = z.infer<typeof SurveysListResponseSchema>;

const SurveysCreateInputSchema = z.object({
	title: z.string().min(1),
	/** Creates a copy of a template instead of an empty survey. */
	from_template_id: z.string().optional(),
	/** Creates a copy of an existing survey. */
	from_survey_id: z.string().optional(),
});

export type SurveysCreateInput = z.input<typeof SurveysCreateInputSchema>;

const SurveysCreateResponseSchema = surveySchema;

export type SurveysCreateResponse = z.infer<typeof SurveysCreateResponseSchema>;

const SurveysGetInputSchema = z.object({ survey_id: z.string().min(1) });

export type SurveysGetInput = z.input<typeof SurveysGetInputSchema>;

const SurveysGetResponseSchema = surveySchema;

export type SurveysGetResponse = z.infer<typeof SurveysGetResponseSchema>;

const SurveysGetDetailsInputSchema = SurveysGetInputSchema;

export type SurveysGetDetailsInput = z.input<
	typeof SurveysGetDetailsInputSchema
>;

/** `/details` answers the survey with every page and question, unfurled. */
const SurveysGetDetailsResponseSchema = surveySchema.extend({
	pages: z.array(pageSchema).nullish(),
});

export type SurveysGetDetailsResponse = z.infer<
	typeof SurveysGetDetailsResponseSchema
>;

const SurveysUpdateInputSchema = z.object({
	survey_id: z.string().min(1),
	title: z.string().optional(),
	nickname: z.string().optional(),
	language: z.string().optional(),
	buttons_text: buttonsTextSchema.optional(),
	custom_variables: z.record(z.string(), z.string()).optional(),
	footer: z.boolean().optional(),
	folder_id: z.string().optional(),
});

export type SurveysUpdateInput = z.input<typeof SurveysUpdateInputSchema>;

const SurveysUpdateResponseSchema = surveySchema;

export type SurveysUpdateResponse = z.infer<typeof SurveysUpdateResponseSchema>;

/** A PUT replaces the survey, so the body matches create plus a title. */
const SurveysReplaceInputSchema = z.object({
	survey_id: z.string().min(1),
	title: z.string().optional(),
	nickname: z.string().optional(),
	language: z.string().optional(),
	buttons_text: buttonsTextSchema.optional(),
	custom_variables: z.record(z.string(), z.string()).optional(),
	footer: z.boolean().optional(),
	folder_id: z.string().optional(),
});

export type SurveysReplaceInput = z.input<typeof SurveysReplaceInputSchema>;

const SurveysReplaceResponseSchema = surveySchema;

export type SurveysReplaceResponse = z.infer<
	typeof SurveysReplaceResponseSchema
>;

const SurveysDeleteInputSchema = SurveysGetInputSchema;

export type SurveysDeleteInput = z.input<typeof SurveysDeleteInputSchema>;

/** A delete answers 200 with an empty body, so the plugin reports the id. */
const SurveysDeleteResponseSchema = z.object({
	survey_id: z.string(),
	deleted: z.literal(true),
});

export type SurveysDeleteResponse = z.infer<typeof SurveysDeleteResponseSchema>;

const SurveysListCategoriesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
	language: z.string().optional(),
});

export type SurveysListCategoriesInput = z.input<
	typeof SurveysListCategoriesInputSchema
>;

const SurveysListCategoriesResponseSchema = listOf(
	z
		.object({
			id: z.string(),
			name: z.string().nullish(),
			href: z.string().nullish(),
		})
		.loose(),
);

export type SurveysListCategoriesResponse = z.infer<
	typeof SurveysListCategoriesResponseSchema
>;

const SurveysListTemplatesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
	language: z.string().optional(),
	category: z.string().optional(),
});

export type SurveysListTemplatesInput = z.input<
	typeof SurveysListTemplatesInputSchema
>;

const SurveysListTemplatesResponseSchema = listOf(surveySchema);

export type SurveysListTemplatesResponse = z.infer<
	typeof SurveysListTemplatesResponseSchema
>;

const SurveysListLanguagesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type SurveysListLanguagesInput = z.input<
	typeof SurveysListLanguagesInputSchema
>;

const SurveysListLanguagesResponseSchema = listOf(
	z
		.object({
			id: z.string(),
			name: z.string().nullish(),
			href: z.string().nullish(),
		})
		.loose(),
);

export type SurveysListLanguagesResponse = z.infer<
	typeof SurveysListLanguagesResponseSchema
>;

// ── pages ─────────────────────────────────────────────────────────────────

const PagesListInputSchema = z.object({
	survey_id: z.string().min(1),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type PagesListInput = z.input<typeof PagesListInputSchema>;

const PagesListResponseSchema = listOf(pageSchema);

export type PagesListResponse = z.infer<typeof PagesListResponseSchema>;

const PagesCreateInputSchema = z.object({
	survey_id: z.string().min(1),
	title: z.string().optional(),
	description: z.string().optional(),
	position: z.number().int().min(1).optional(),
});

export type PagesCreateInput = z.input<typeof PagesCreateInputSchema>;

const PagesCreateResponseSchema = pageSchema;

export type PagesCreateResponse = z.infer<typeof PagesCreateResponseSchema>;

const PagesGetInputSchema = z.object({
	survey_id: z.string().min(1),
	page_id: z.string().min(1),
});

export type PagesGetInput = z.input<typeof PagesGetInputSchema>;

const PagesGetResponseSchema = pageSchema;

export type PagesGetResponse = z.infer<typeof PagesGetResponseSchema>;

const PagesUpdateInputSchema = z.object({
	survey_id: z.string().min(1),
	page_id: z.string().min(1),
	title: z.string().optional(),
	description: z.string().optional(),
	position: z.number().int().min(1).optional(),
});

export type PagesUpdateInput = z.input<typeof PagesUpdateInputSchema>;

const PagesUpdateResponseSchema = pageSchema;

export type PagesUpdateResponse = z.infer<typeof PagesUpdateResponseSchema>;

const PagesDeleteInputSchema = PagesGetInputSchema;

export type PagesDeleteInput = z.input<typeof PagesDeleteInputSchema>;

const PagesDeleteResponseSchema = z.object({
	survey_id: z.string(),
	page_id: z.string(),
	deleted: z.literal(true),
});

export type PagesDeleteResponse = z.infer<typeof PagesDeleteResponseSchema>;

// ── questions ─────────────────────────────────────────────────────────────

const questionPosition = {
	survey_id: z.string().min(1),
	page_id: z.string().min(1),
};

const QuestionsListInputSchema = z.object({
	...questionPosition,
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type QuestionsListInput = z.input<typeof QuestionsListInputSchema>;

const QuestionsListResponseSchema = listOf(questionSchema);

export type QuestionsListResponse = z.infer<typeof QuestionsListResponseSchema>;

const QuestionsCreateInputSchema = z.object({
	...questionPosition,
	/** The question family, such as `single_choice` or `open_ended`. Required. */
	family: z.string().min(1),
	/** The subtype, such as `vertical` or `single`. Required. */
	subtype: z.string().min(1),
	/** At least one heading is required; it is the question text. */
	headings: z
		.array(
			z.object({
				heading: z.string().min(1),
				description: z.string().optional(),
				image: z.looseObject({}).optional(),
			}),
		)
		.min(1),
	position: z.number().int().min(1).optional(),
	required: z
		.object({
			text: z.string().optional(),
			type: z.string().optional(),
			amount: z.string().optional(),
		})
		.optional(),
	sorting: z.looseObject({}).optional(),
	validation: z.looseObject({}).optional(),
	forced_ranking: z.boolean().optional(),
	quiz_options: z.looseObject({}).optional(),
	display_options: z.looseObject({}).optional(),
	answers: z
		.object({
			choices: z
				.array(
					z.object({
						text: z.string().optional(),
						position: z.number().int().optional(),
					}),
				)
				.optional(),
			rows: z.array(z.looseObject({})).optional(),
			cols: z.array(z.looseObject({})).optional(),
			other: z.array(z.looseObject({})).optional(),
		})
		.optional(),
});

export type QuestionsCreateInput = z.input<typeof QuestionsCreateInputSchema>;

const QuestionsCreateResponseSchema = questionSchema;

export type QuestionsCreateResponse = z.infer<
	typeof QuestionsCreateResponseSchema
>;

const QuestionsGetInputSchema = z.object({
	...questionPosition,
	question_id: z.string().min(1),
});

export type QuestionsGetInput = z.input<typeof QuestionsGetInputSchema>;

const QuestionsGetResponseSchema = questionSchema;

export type QuestionsGetResponse = z.infer<typeof QuestionsGetResponseSchema>;

const QuestionsUpdateInputSchema = z.object({
	...questionPosition,
	question_id: z.string().min(1),
	headings: z
		.array(
			z.object({
				heading: z.string(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	position: z.number().int().min(1).optional(),
	required: z
		.object({
			text: z.string().optional(),
			type: z.string().optional(),
			amount: z.string().optional(),
		})
		.optional(),
	visible: z.boolean().optional(),
	answers: z
		.object({
			choices: z
				.array(
					z.object({
						id: z.string().optional(),
						text: z.string().optional(),
						position: z.number().int().optional(),
						visible: z.boolean().optional(),
					}),
				)
				.optional(),
			rows: z.array(z.looseObject({})).optional(),
			cols: z.array(z.looseObject({})).optional(),
		})
		.optional(),
});

export type QuestionsUpdateInput = z.input<typeof QuestionsUpdateInputSchema>;

const QuestionsUpdateResponseSchema = questionSchema;

export type QuestionsUpdateResponse = z.infer<
	typeof QuestionsUpdateResponseSchema
>;

const QuestionsDeleteInputSchema = QuestionsGetInputSchema;

export type QuestionsDeleteInput = z.input<typeof QuestionsDeleteInputSchema>;

const QuestionsDeleteResponseSchema = z.object({
	survey_id: z.string(),
	page_id: z.string(),
	question_id: z.string(),
	deleted: z.literal(true),
});

export type QuestionsDeleteResponse = z.infer<
	typeof QuestionsDeleteResponseSchema
>;

// ── responses ─────────────────────────────────────────────────────────────

/** The filters the survey and collector response lists share. */
const responseFilters = {
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(1000).optional(),
	start_created_at: z.string().optional(),
	end_created_at: z.string().optional(),
	start_modified_at: z.string().optional(),
	end_modified_at: z.string().optional(),
	status: z
		.enum(['completed', 'partial', 'overquota', 'disqualified'])
		.optional(),
	sort_by: z.enum(['date_modified', 'date_created']).optional(),
	sort_order: z.enum(['ASC', 'DESC']).optional(),
};

const ResponsesListInputSchema = z.object({
	survey_id: z.string().min(1),
	...responseFilters,
});

export type ResponsesListInput = z.input<typeof ResponsesListInputSchema>;

/** The survey list answers only ids and links; read one for the answers. */
const ResponsesListResponseSchema = listOf(responseSummarySchema);

export type ResponsesListResponse = z.infer<typeof ResponsesListResponseSchema>;

const ResponsesListBulkInputSchema = z.object({
	survey_id: z.string().min(1),
	...responseFilters,
	/** `true` drops the page and question structure and keeps the answers flat. */
	simple: z.boolean().optional(),
	collector_ids: z.string().optional(),
	page_ids: z.string().optional(),
	question_ids: z.string().optional(),
});

export type ResponsesListBulkInput = z.input<
	typeof ResponsesListBulkInputSchema
>;

const ResponsesListBulkResponseSchema = listOf(responseSchema);

export type ResponsesListBulkResponse = z.infer<
	typeof ResponsesListBulkResponseSchema
>;

const ResponsesGetInputSchema = z.object({
	survey_id: z.string().min(1),
	response_id: z.string().min(1),
});

export type ResponsesGetInput = z.input<typeof ResponsesGetInputSchema>;

const ResponsesGetResponseSchema = responseSchema;

export type ResponsesGetResponse = z.infer<typeof ResponsesGetResponseSchema>;

const ResponsesGetDetailsInputSchema = ResponsesGetInputSchema;

export type ResponsesGetDetailsInput = z.input<
	typeof ResponsesGetDetailsInputSchema
>;

const ResponsesGetDetailsResponseSchema = responseSchema;

export type ResponsesGetDetailsResponse = z.infer<
	typeof ResponsesGetDetailsResponseSchema
>;

/** A response is created through a collector, which owns its link. */
const ResponsesCreateInputSchema = z.object({
	collector_id: z.string().min(1),
	response_status: z
		.enum(['completed', 'partial', 'overquota', 'disqualified'])
		.optional(),
	custom_value: z.string().optional(),
	custom_variables: z.record(z.string(), z.string()).optional(),
	ip_address: z.string().optional(),
	/** Required for an email collector. */
	recipient_id: z.string().optional(),
	pages: z
		.array(
			z.object({
				id: z.string(),
				questions: z
					.array(
						z.object({
							id: z.string(),
							variable_id: z.string().optional(),
							answers: z.array(answerSchema).optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
});

export type ResponsesCreateInput = z.input<typeof ResponsesCreateInputSchema>;

const ResponsesCreateResponseSchema = responseSchema;

export type ResponsesCreateResponse = z.infer<
	typeof ResponsesCreateResponseSchema
>;

const ResponsesDeleteInputSchema = z.object({
	survey_id: z.string().min(1),
	response_id: z.string().min(1),
});

export type ResponsesDeleteInput = z.input<typeof ResponsesDeleteInputSchema>;

const ResponsesDeleteResponseSchema = z.object({
	survey_id: z.string(),
	response_id: z.string(),
	deleted: z.literal(true),
});

export type ResponsesDeleteResponse = z.infer<
	typeof ResponsesDeleteResponseSchema
>;

const ResponsesDeleteAllInputSchema = z.object({
	collector_id: z.string().min(1),
});

export type ResponsesDeleteAllInput = z.input<
	typeof ResponsesDeleteAllInputSchema
>;

/** Clearing a collector answers 200 with no body, so the plugin reports it. */
const ResponsesDeleteAllResponseSchema = z.object({
	collector_id: z.string(),
	deleted: z.literal(true),
});

export type ResponsesDeleteAllResponse = z.infer<
	typeof ResponsesDeleteAllResponseSchema
>;

// ── collectors ────────────────────────────────────────────────────────────

const CollectorsListInputSchema = z.object({
	survey_id: z.string().min(1),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
	name: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	include: z.string().optional(),
	sort_by: z.enum(['id', 'date_created', 'date_modified', 'name']).optional(),
	sort_order: z.enum(['ASC', 'DESC']).optional(),
});

export type CollectorsListInput = z.input<typeof CollectorsListInputSchema>;

const CollectorsListResponseSchema = listOf(collectorSchema);

export type CollectorsListResponse = z.infer<
	typeof CollectorsListResponseSchema
>;

const CollectorsCreateInputSchema = z.object({
	survey_id: z.string().min(1),
	/** `weblink` or `email`. `sms` exists but cannot be created here. */
	type: z.enum(['weblink', 'email']).optional(),
	name: z.string().optional(),
	thank_you_message: z.string().optional(),
	disqualification_message: z.string().optional(),
	disqualification_url: z.string().optional(),
	close_date: z.string().optional(),
	closed_page_message: z.string().optional(),
	redirect_url: z.string().optional(),
	display_survey_results: z.boolean().optional(),
	edit_response_type: z.enum(['until_complete', 'never', 'always']).optional(),
	anonymous_type: z
		.enum(['not_anonymous', 'partially_anonymous', 'fully_anonymous'])
		.optional(),
	allow_multiple_responses: z.boolean().optional(),
	sender_email: z.string().optional(),
	response_limit: z.number().int().optional(),
	redirect_type: z.enum(['url', 'close', 'loop']).optional(),
	password: z.string().optional(),
	/** Copies another collector of the same survey instead of taking fields. */
	from_collector_id: z.string().optional(),
});

export type CollectorsCreateInput = z.input<typeof CollectorsCreateInputSchema>;

const CollectorsCreateResponseSchema = collectorSchema;

export type CollectorsCreateResponse = z.infer<
	typeof CollectorsCreateResponseSchema
>;

const CollectorsGetInputSchema = z.object({ collector_id: z.string().min(1) });

export type CollectorsGetInput = z.input<typeof CollectorsGetInputSchema>;

const CollectorsGetResponseSchema = collectorSchema;

export type CollectorsGetResponse = z.infer<typeof CollectorsGetResponseSchema>;

/** PATCH takes the create fields plus `status`, and not `type`. */
const CollectorsUpdateInputSchema = z.object({
	collector_id: z.string().min(1),
	status: z.enum(['open', 'closed']).optional(),
	name: z.string().optional(),
	thank_you_message: z.string().optional(),
	disqualification_message: z.string().optional(),
	disqualification_url: z.string().optional(),
	close_date: z.string().optional(),
	closed_page_message: z.string().optional(),
	redirect_url: z.string().optional(),
	display_survey_results: z.boolean().optional(),
	edit_response_type: z.enum(['until_complete', 'never', 'always']).optional(),
	anonymous_type: z
		.enum(['not_anonymous', 'partially_anonymous', 'fully_anonymous'])
		.optional(),
	allow_multiple_responses: z.boolean().optional(),
	sender_email: z.string().optional(),
	response_limit: z.number().int().optional(),
	redirect_type: z.enum(['url', 'close', 'loop']).optional(),
	password: z.string().optional(),
});

export type CollectorsUpdateInput = z.input<typeof CollectorsUpdateInputSchema>;

const CollectorsUpdateResponseSchema = collectorSchema;

export type CollectorsUpdateResponse = z.infer<
	typeof CollectorsUpdateResponseSchema
>;

const CollectorsDeleteInputSchema = CollectorsGetInputSchema;

export type CollectorsDeleteInput = z.input<typeof CollectorsDeleteInputSchema>;

const CollectorsDeleteResponseSchema = z.object({
	collector_id: z.string(),
	deleted: z.literal(true),
});

export type CollectorsDeleteResponse = z.infer<
	typeof CollectorsDeleteResponseSchema
>;

const MessagesListInputSchema = z.object({
	collector_id: z.string().min(1),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type MessagesListInput = z.input<typeof MessagesListInputSchema>;

const MessagesListResponseSchema = listOf(messageSchema);

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

const MessagesCreateInputSchema = z.object({
	collector_id: z.string().min(1),
	/** `invite` for the first send, `reminder` to chase non-responders. */
	type: z.enum(['invite', 'reminder', 'thank_you']).optional(),
	subject: z.string().min(1),
	/**
	 * The plain-text email body. It must include [SurveyLink], [OptOutLink],
	 * [PrivacyLink] and [FooterLink].
	 */
	body_text: z.string().optional(),
	/** The HTML email body, which overrides `body_text`. Same required links. */
	body_html: z.string().optional(),
	from_collector_id: z.string().optional(),
	from_message_id: z.string().optional(),
});

export type MessagesCreateInput = z.input<typeof MessagesCreateInputSchema>;

const MessagesCreateResponseSchema = messageSchema;

export type MessagesCreateResponse = z.infer<
	typeof MessagesCreateResponseSchema
>;

const MessagesGetInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
});

export type MessagesGetInput = z.input<typeof MessagesGetInputSchema>;

const MessagesGetResponseSchema = messageSchema;

export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;

const MessagesUpdateInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
	type: z.enum(['invite', 'reminder', 'thank_you']).optional(),
	subject: z.string().optional(),
	body_text: z.string().optional(),
	body_html: z.string().optional(),
});

export type MessagesUpdateInput = z.input<typeof MessagesUpdateInputSchema>;

const MessagesUpdateResponseSchema = messageSchema;

export type MessagesUpdateResponse = z.infer<
	typeof MessagesUpdateResponseSchema
>;

const MessagesSendInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
	/** An ISO date to schedule the send instead of sending it now. */
	scheduled_date: z.string().optional(),
});

export type MessagesSendInput = z.input<typeof MessagesSendInputSchema>;

/**
 * The send route answers the scheduled message without an `id`:
 * `{ is_scheduled, scheduled_date, body, subject, recipients, recipient_status, type }`.
 */
const MessagesSendResponseSchema = z
	.object({
		is_scheduled: z.boolean().nullish(),
		scheduled_date: z.string().nullish(),
		body: z.string().nullish(),
		subject: z.string().nullish(),
		recipients: z.array(z.union([z.string(), z.number()])).nullish(),
		recipient_status: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

const RecipientsListInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type RecipientsListInput = z.input<typeof RecipientsListInputSchema>;

const RecipientsListResponseSchema = listOf(recipientSchema);

export type RecipientsListResponse = z.infer<
	typeof RecipientsListResponseSchema
>;

const RecipientsCreateInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
	email: z.string().min(1),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
});

export type RecipientsCreateInput = z.input<typeof RecipientsCreateInputSchema>;

const RecipientsCreateResponseSchema = recipientSchema;

export type RecipientsCreateResponse = z.infer<
	typeof RecipientsCreateResponseSchema
>;

const RecipientsBulkCreateInputSchema = z.object({
	collector_id: z.string().min(1),
	message_id: z.string().min(1),
	contacts: z
		.array(
			z.object({
				email: z.string().min(1),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
			}),
		)
		.min(1),
});

export type RecipientsBulkCreateInput = z.input<
	typeof RecipientsBulkCreateInputSchema
>;

const RecipientsBulkCreateResponseSchema = z
	.object({
		succeeded: z.array(recipientSchema).nullish(),
		// unknown: the invalid entries are echoed input (an address, or a contact).
		invalids: z.array(z.unknown()).nullish(),
		existing: z.array(recipientSchema).nullish(),
	})
	.loose();

export type RecipientsBulkCreateResponse = z.infer<
	typeof RecipientsBulkCreateResponseSchema
>;

// ── contact lists ─────────────────────────────────────────────────────────

const ContactListsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type ContactListsListInput = z.input<typeof ContactListsListInputSchema>;

const ContactListsListResponseSchema = listOf(contactListSchema);

export type ContactListsListResponse = z.infer<
	typeof ContactListsListResponseSchema
>;

const ContactListsCreateInputSchema = z.object({
	name: z.string().min(1),
});

export type ContactListsCreateInput = z.input<
	typeof ContactListsCreateInputSchema
>;

const ContactListsCreateResponseSchema = contactListSchema;

export type ContactListsCreateResponse = z.infer<
	typeof ContactListsCreateResponseSchema
>;

const ContactListsGetInputSchema = z.object({
	contact_list_id: z.string().min(1),
});

export type ContactListsGetInput = z.input<typeof ContactListsGetInputSchema>;

const ContactListsGetResponseSchema = contactListSchema;

export type ContactListsGetResponse = z.infer<
	typeof ContactListsGetResponseSchema
>;

const ContactListsUpdateInputSchema = z.object({
	contact_list_id: z.string().min(1),
	name: z.string().min(1),
});

export type ContactListsUpdateInput = z.input<
	typeof ContactListsUpdateInputSchema
>;

const ContactListsUpdateResponseSchema = contactListSchema;

export type ContactListsUpdateResponse = z.infer<
	typeof ContactListsUpdateResponseSchema
>;

const ContactListsDeleteInputSchema = ContactListsGetInputSchema;

export type ContactListsDeleteInput = z.input<
	typeof ContactListsDeleteInputSchema
>;

const ContactListsDeleteResponseSchema = z.object({
	contact_list_id: z.string(),
	deleted: z.literal(true),
});

export type ContactListsDeleteResponse = z.infer<
	typeof ContactListsDeleteResponseSchema
>;

const ContactListsCopyInputSchema = z.object({
	contact_list_id: z.string().min(1),
	name: z.string().optional(),
});

export type ContactListsCopyInput = z.input<typeof ContactListsCopyInputSchema>;

const ContactListsCopyResponseSchema = contactListSchema;

export type ContactListsCopyResponse = z.infer<
	typeof ContactListsCopyResponseSchema
>;

/** A merge empties the source list into the target, which is named here. */
const ContactListsMergeInputSchema = z.object({
	contact_list_id: z.string().min(1),
	list_id: z.string().min(1),
});

export type ContactListsMergeInput = z.input<
	typeof ContactListsMergeInputSchema
>;

const ContactListsMergeResponseSchema = z.object({
	source_list_id: z.string(),
	target_list_id: z.string(),
	merged: z.literal(true),
});

export type ContactListsMergeResponse = z.infer<
	typeof ContactListsMergeResponseSchema
>;

// ── contacts ──────────────────────────────────────────────────────────────

const contactFilters = {
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
	status: z.enum(['active', 'optout', 'bounced']).optional(),
	/** A field name, or a custom field number as `1` through `6`. */
	sort_by: z.string().optional(),
	sort_order: z.enum(['ASC', 'DESC']).optional(),
	/** A field name, or a custom field number as `1` through `6`. */
	search_by: z.string().optional(),
	search: z.string().optional(),
};

const ContactsListInputSchema = z.object(contactFilters);

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = listOf(contactSchema);

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

/** The writable contact fields, shared by create, bulk and list-add. */
const contactFields = {
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone_number: z.string().optional(),
	custom_fields: z.record(z.string(), z.string()).optional(),
};

const ContactsCreateInputSchema = z
	.object({
		...contactFields,
		first_name: z.string().min(1),
		last_name: z.string().min(1),
	})
	.refine(
		(value) =>
			(value.email?.length ?? 0) > 0 || (value.phone_number?.length ?? 0) > 0,
		'a contact needs an email or a phone number',
	);

export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;

const ContactsCreateResponseSchema = contactSchema;

export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

const ContactsBulkCreateInputSchema = z.object({
	contacts: z
		.array(
			z.object({
				...contactFields,
				first_name: z.string().min(1),
				last_name: z.string().min(1),
				/** Updates the contact when the email already exists. */
				update_existing: z.boolean().optional(),
			}),
		)
		.min(1),
});

export type ContactsBulkCreateInput = z.input<
	typeof ContactsBulkCreateInputSchema
>;

const ContactsBulkCreateResponseSchema = z
	.object({
		succeeded: z.array(contactSchema).nullish(),
		// unknown: the invalid entries are echoed input (an address, or a contact).
		invalids: z.array(z.unknown()).nullish(),
		existing: z.array(contactSchema).nullish(),
	})
	.loose();

export type ContactsBulkCreateResponse = z.infer<
	typeof ContactsBulkCreateResponseSchema
>;

const ContactsGetInputSchema = z.object({ contact_id: z.string().min(1) });

export type ContactsGetInput = z.input<typeof ContactsGetInputSchema>;

const ContactsGetResponseSchema = contactSchema;

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const ContactsUpdateInputSchema = z.object({
	contact_id: z.string().min(1),
	...contactFields,
});

export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;

const ContactsUpdateResponseSchema = contactSchema;

export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

const ContactsDeleteInputSchema = ContactsGetInputSchema;

export type ContactsDeleteInput = z.input<typeof ContactsDeleteInputSchema>;

const ContactsDeleteResponseSchema = z.object({
	contact_id: z.string(),
	deleted: z.literal(true),
});

export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

const ContactsListFieldsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type ContactsListFieldsInput = z.input<
	typeof ContactsListFieldsInputSchema
>;

const ContactsListFieldsResponseSchema = listOf(contactFieldSchema);

export type ContactsListFieldsResponse = z.infer<
	typeof ContactsListFieldsResponseSchema
>;

const ContactsUpdateFieldInputSchema = z.object({
	contact_field_id: z.string().min(1),
	label: z.string().min(1),
});

export type ContactsUpdateFieldInput = z.input<
	typeof ContactsUpdateFieldInputSchema
>;

const ContactsUpdateFieldResponseSchema = contactFieldSchema;

export type ContactsUpdateFieldResponse = z.infer<
	typeof ContactsUpdateFieldResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

const WebhooksListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = listOf(webhookSchema);

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WEBHOOK_EVENT_TYPES = [
	'response_completed',
	'response_updated',
	'response_created',
	'response_deleted',
	'response_disqualified',
	'response_overquota',
	'collector_created',
	'collector_updated',
	'collector_deleted',
	'survey_created',
	'survey_updated',
	'survey_deleted',
] as const;

const WebhooksCreateInputSchema = z.object({
	name: z.string().min(1),
	event_type: z.enum(WEBHOOK_EVENT_TYPES),
	object_type: z.enum(['survey', 'collector']).optional(),
	/** The survey or collector ids to watch. Omitted for `survey_created`. */
	object_ids: z.array(z.string()).optional(),
	subscription_url: z.string().min(1),
	/** A header value SurveyMonkey sends with every delivery. */
	authorization: z.string().optional(),
});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

const WebhooksCreateResponseSchema = webhookSchema;

export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

const WebhooksGetInputSchema = z.object({ webhook_id: z.string().min(1) });

export type WebhooksGetInput = z.input<typeof WebhooksGetInputSchema>;

const WebhooksGetResponseSchema = webhookSchema;

export type WebhooksGetResponse = z.infer<typeof WebhooksGetResponseSchema>;

const WebhooksUpdateInputSchema = z.object({
	webhook_id: z.string().min(1),
	name: z.string().optional(),
	event_type: z.enum(WEBHOOK_EVENT_TYPES).optional(),
	object_type: z.enum(['survey', 'collector']).optional(),
	object_ids: z.array(z.string()).optional(),
	subscription_url: z.string().optional(),
	authorization: z.string().optional(),
});

export type WebhooksUpdateInput = z.input<typeof WebhooksUpdateInputSchema>;

const WebhooksUpdateResponseSchema = webhookSchema;

export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;

const WebhooksDeleteInputSchema = WebhooksGetInputSchema;

export type WebhooksDeleteInput = z.input<typeof WebhooksDeleteInputSchema>;

const WebhooksDeleteResponseSchema = z.object({
	webhook_id: z.string(),
	deleted: z.literal(true),
});

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersGetMeInputSchema = z.object({});

export type UsersGetMeInput = z.input<typeof UsersGetMeInputSchema>;

const UsersGetMeResponseSchema = userSchema;

export type UsersGetMeResponse = z.infer<typeof UsersGetMeResponseSchema>;

// ── folders ───────────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).optional(),
});

export type FoldersListInput = z.input<typeof FoldersListInputSchema>;

const folderSchema = z
	.object({
		id: z.string(),
		title: z.string().nullish(),
		href: z.string().nullish(),
	})
	.loose();

const FoldersListResponseSchema = listOf(folderSchema);

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

const FoldersCreateInputSchema = z.object({
	title: z.string().min(1),
});

export type FoldersCreateInput = z.input<typeof FoldersCreateInputSchema>;

const FoldersCreateResponseSchema = folderSchema;

export type FoldersCreateResponse = z.infer<typeof FoldersCreateResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SurveymonkeyEndpointInputs = {
	surveysList: SurveysListInput;
	surveysCreate: SurveysCreateInput;
	surveysGet: SurveysGetInput;
	surveysGetDetails: SurveysGetDetailsInput;
	surveysUpdate: SurveysUpdateInput;
	surveysReplace: SurveysReplaceInput;
	surveysDelete: SurveysDeleteInput;
	surveysListCategories: SurveysListCategoriesInput;
	surveysListTemplates: SurveysListTemplatesInput;
	surveysListLanguages: SurveysListLanguagesInput;
	pagesList: PagesListInput;
	pagesCreate: PagesCreateInput;
	pagesGet: PagesGetInput;
	pagesUpdate: PagesUpdateInput;
	pagesDelete: PagesDeleteInput;
	questionsList: QuestionsListInput;
	questionsCreate: QuestionsCreateInput;
	questionsGet: QuestionsGetInput;
	questionsUpdate: QuestionsUpdateInput;
	questionsDelete: QuestionsDeleteInput;
	responsesList: ResponsesListInput;
	responsesListBulk: ResponsesListBulkInput;
	responsesGet: ResponsesGetInput;
	responsesGetDetails: ResponsesGetDetailsInput;
	responsesCreate: ResponsesCreateInput;
	responsesDelete: ResponsesDeleteInput;
	responsesDeleteAll: ResponsesDeleteAllInput;
	collectorsList: CollectorsListInput;
	collectorsCreate: CollectorsCreateInput;
	collectorsGet: CollectorsGetInput;
	collectorsUpdate: CollectorsUpdateInput;
	collectorsDelete: CollectorsDeleteInput;
	messagesList: MessagesListInput;
	messagesCreate: MessagesCreateInput;
	messagesGet: MessagesGetInput;
	messagesUpdate: MessagesUpdateInput;
	messagesSend: MessagesSendInput;
	recipientsList: RecipientsListInput;
	recipientsCreate: RecipientsCreateInput;
	recipientsBulkCreate: RecipientsBulkCreateInput;
	contactListsList: ContactListsListInput;
	contactListsCreate: ContactListsCreateInput;
	contactListsGet: ContactListsGetInput;
	contactListsUpdate: ContactListsUpdateInput;
	contactListsDelete: ContactListsDeleteInput;
	contactListsCopy: ContactListsCopyInput;
	contactListsMerge: ContactListsMergeInput;
	contactsList: ContactsListInput;
	contactsCreate: ContactsCreateInput;
	contactsBulkCreate: ContactsBulkCreateInput;
	contactsGet: ContactsGetInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	contactsListFields: ContactsListFieldsInput;
	contactsUpdateField: ContactsUpdateFieldInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksGet: WebhooksGetInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	usersGetMe: UsersGetMeInput;
	foldersList: FoldersListInput;
	foldersCreate: FoldersCreateInput;
};

export type SurveymonkeyEndpointOutputs = {
	surveysList: SurveysListResponse;
	surveysCreate: SurveysCreateResponse;
	surveysGet: SurveysGetResponse;
	surveysGetDetails: SurveysGetDetailsResponse;
	surveysUpdate: SurveysUpdateResponse;
	surveysReplace: SurveysReplaceResponse;
	surveysDelete: SurveysDeleteResponse;
	surveysListCategories: SurveysListCategoriesResponse;
	surveysListTemplates: SurveysListTemplatesResponse;
	surveysListLanguages: SurveysListLanguagesResponse;
	pagesList: PagesListResponse;
	pagesCreate: PagesCreateResponse;
	pagesGet: PagesGetResponse;
	pagesUpdate: PagesUpdateResponse;
	pagesDelete: PagesDeleteResponse;
	questionsList: QuestionsListResponse;
	questionsCreate: QuestionsCreateResponse;
	questionsGet: QuestionsGetResponse;
	questionsUpdate: QuestionsUpdateResponse;
	questionsDelete: QuestionsDeleteResponse;
	responsesList: ResponsesListResponse;
	responsesListBulk: ResponsesListBulkResponse;
	responsesGet: ResponsesGetResponse;
	responsesGetDetails: ResponsesGetDetailsResponse;
	responsesCreate: ResponsesCreateResponse;
	responsesDelete: ResponsesDeleteResponse;
	responsesDeleteAll: ResponsesDeleteAllResponse;
	collectorsList: CollectorsListResponse;
	collectorsCreate: CollectorsCreateResponse;
	collectorsGet: CollectorsGetResponse;
	collectorsUpdate: CollectorsUpdateResponse;
	collectorsDelete: CollectorsDeleteResponse;
	messagesList: MessagesListResponse;
	messagesCreate: MessagesCreateResponse;
	messagesGet: MessagesGetResponse;
	messagesUpdate: MessagesUpdateResponse;
	messagesSend: MessagesSendResponse;
	recipientsList: RecipientsListResponse;
	recipientsCreate: RecipientsCreateResponse;
	recipientsBulkCreate: RecipientsBulkCreateResponse;
	contactListsList: ContactListsListResponse;
	contactListsCreate: ContactListsCreateResponse;
	contactListsGet: ContactListsGetResponse;
	contactListsUpdate: ContactListsUpdateResponse;
	contactListsDelete: ContactListsDeleteResponse;
	contactListsCopy: ContactListsCopyResponse;
	contactListsMerge: ContactListsMergeResponse;
	contactsList: ContactsListResponse;
	contactsCreate: ContactsCreateResponse;
	contactsBulkCreate: ContactsBulkCreateResponse;
	contactsGet: ContactsGetResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	contactsListFields: ContactsListFieldsResponse;
	contactsUpdateField: ContactsUpdateFieldResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksGet: WebhooksGetResponse;
	webhooksUpdate: WebhooksUpdateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	usersGetMe: UsersGetMeResponse;
	foldersList: FoldersListResponse;
	foldersCreate: FoldersCreateResponse;
};

export const SurveymonkeyEndpointInputSchemas = {
	surveysList: SurveysListInputSchema,
	surveysCreate: SurveysCreateInputSchema,
	surveysGet: SurveysGetInputSchema,
	surveysGetDetails: SurveysGetDetailsInputSchema,
	surveysUpdate: SurveysUpdateInputSchema,
	surveysReplace: SurveysReplaceInputSchema,
	surveysDelete: SurveysDeleteInputSchema,
	surveysListCategories: SurveysListCategoriesInputSchema,
	surveysListTemplates: SurveysListTemplatesInputSchema,
	surveysListLanguages: SurveysListLanguagesInputSchema,
	pagesList: PagesListInputSchema,
	pagesCreate: PagesCreateInputSchema,
	pagesGet: PagesGetInputSchema,
	pagesUpdate: PagesUpdateInputSchema,
	pagesDelete: PagesDeleteInputSchema,
	questionsList: QuestionsListInputSchema,
	questionsCreate: QuestionsCreateInputSchema,
	questionsGet: QuestionsGetInputSchema,
	questionsUpdate: QuestionsUpdateInputSchema,
	questionsDelete: QuestionsDeleteInputSchema,
	responsesList: ResponsesListInputSchema,
	responsesListBulk: ResponsesListBulkInputSchema,
	responsesGet: ResponsesGetInputSchema,
	responsesGetDetails: ResponsesGetDetailsInputSchema,
	responsesCreate: ResponsesCreateInputSchema,
	responsesDelete: ResponsesDeleteInputSchema,
	responsesDeleteAll: ResponsesDeleteAllInputSchema,
	collectorsList: CollectorsListInputSchema,
	collectorsCreate: CollectorsCreateInputSchema,
	collectorsGet: CollectorsGetInputSchema,
	collectorsUpdate: CollectorsUpdateInputSchema,
	collectorsDelete: CollectorsDeleteInputSchema,
	messagesList: MessagesListInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesSend: MessagesSendInputSchema,
	recipientsList: RecipientsListInputSchema,
	recipientsCreate: RecipientsCreateInputSchema,
	recipientsBulkCreate: RecipientsBulkCreateInputSchema,
	contactListsList: ContactListsListInputSchema,
	contactListsCreate: ContactListsCreateInputSchema,
	contactListsGet: ContactListsGetInputSchema,
	contactListsUpdate: ContactListsUpdateInputSchema,
	contactListsDelete: ContactListsDeleteInputSchema,
	contactListsCopy: ContactListsCopyInputSchema,
	contactListsMerge: ContactListsMergeInputSchema,
	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsBulkCreate: ContactsBulkCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsListFields: ContactsListFieldsInputSchema,
	contactsUpdateField: ContactsUpdateFieldInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	usersGetMe: UsersGetMeInputSchema,
	foldersList: FoldersListInputSchema,
	foldersCreate: FoldersCreateInputSchema,
} as const;

export const SurveymonkeyEndpointOutputSchemas = {
	surveysList: SurveysListResponseSchema,
	surveysCreate: SurveysCreateResponseSchema,
	surveysGet: SurveysGetResponseSchema,
	surveysGetDetails: SurveysGetDetailsResponseSchema,
	surveysUpdate: SurveysUpdateResponseSchema,
	surveysReplace: SurveysReplaceResponseSchema,
	surveysDelete: SurveysDeleteResponseSchema,
	surveysListCategories: SurveysListCategoriesResponseSchema,
	surveysListTemplates: SurveysListTemplatesResponseSchema,
	surveysListLanguages: SurveysListLanguagesResponseSchema,
	pagesList: PagesListResponseSchema,
	pagesCreate: PagesCreateResponseSchema,
	pagesGet: PagesGetResponseSchema,
	pagesUpdate: PagesUpdateResponseSchema,
	pagesDelete: PagesDeleteResponseSchema,
	questionsList: QuestionsListResponseSchema,
	questionsCreate: QuestionsCreateResponseSchema,
	questionsGet: QuestionsGetResponseSchema,
	questionsUpdate: QuestionsUpdateResponseSchema,
	questionsDelete: QuestionsDeleteResponseSchema,
	responsesList: ResponsesListResponseSchema,
	responsesListBulk: ResponsesListBulkResponseSchema,
	responsesGet: ResponsesGetResponseSchema,
	responsesGetDetails: ResponsesGetDetailsResponseSchema,
	responsesCreate: ResponsesCreateResponseSchema,
	responsesDelete: ResponsesDeleteResponseSchema,
	responsesDeleteAll: ResponsesDeleteAllResponseSchema,
	collectorsList: CollectorsListResponseSchema,
	collectorsCreate: CollectorsCreateResponseSchema,
	collectorsGet: CollectorsGetResponseSchema,
	collectorsUpdate: CollectorsUpdateResponseSchema,
	collectorsDelete: CollectorsDeleteResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesCreate: MessagesCreateResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesUpdate: MessagesUpdateResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	recipientsList: RecipientsListResponseSchema,
	recipientsCreate: RecipientsCreateResponseSchema,
	recipientsBulkCreate: RecipientsBulkCreateResponseSchema,
	contactListsList: ContactListsListResponseSchema,
	contactListsCreate: ContactListsCreateResponseSchema,
	contactListsGet: ContactListsGetResponseSchema,
	contactListsUpdate: ContactListsUpdateResponseSchema,
	contactListsDelete: ContactListsDeleteResponseSchema,
	contactListsCopy: ContactListsCopyResponseSchema,
	contactListsMerge: ContactListsMergeResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsBulkCreate: ContactsBulkCreateResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	contactsListFields: ContactsListFieldsResponseSchema,
	contactsUpdateField: ContactsUpdateFieldResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	usersGetMe: UsersGetMeResponseSchema,
	foldersList: FoldersListResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
} as const;

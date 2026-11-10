import { z } from 'zod';

/**
 * Request and response shapes for the SatisMeter API.
 *
 * Every path, parameter and field below is transcribed from the provider's own
 * OpenAPI document, which the Redoc page at https://app.satismeter.com/apidoc
 * embeds (servers: `https://app.satismeter.com/api/v3`; tags: Project, Surveys,
 * Responses, Statistics). All six read operations appear there. The three users
 * operations do not: they are documented only as support articles
 * (https://support.satismeter.com/hc/en-us/sections/6973838752659-REST-API) and
 * live on the unversioned `/api` base, which a live probe confirmed by their own
 * error bodies.
 *
 * Inputs use the provider's own parameter names. Outputs are `.loose()` and
 * their documented fields nullish, so a field SatisMeter adds or omits cannot
 * fail a call that has already happened.
 */

const ProjectIdSchema = z
	.string()
	.min(1)
	.describe(
		'Project ID, from Settings > Integrations > API in the SatisMeter dashboard.',
	);

const SurveyIdSchema = z
	.string()
	.min(1)
	.describe('Survey ID, from Settings > Integrations > API > Survey Keys.');

const IsoDateSchema = z.iso.datetime({
	offset: true,
	message: 'Use an ISO 8601 timestamp such as 2026-01-01T00:00:00.000Z',
});

/** Applied to both response-listing operations. */
const DateRangeShape = {
	startDate: IsoDateSchema.optional().describe(
		'Only include results recorded after this time, in ISO 8601. Defaults to 30 days ago, so older responses need an explicit `startDate`.',
	),
	endDate: IsoDateSchema.optional().describe(
		'Only include results recorded before this time, in ISO 8601. Defaults to now.',
	),
};

/** The provider returns 20 per page unless `pageSize` says otherwise. */
export const SATISMETER_DEFAULT_PAGE_SIZE = 20;
export const SATISMETER_MAX_PAGE_SIZE = 100;

const PageSizeSchema = z
	.number()
	.int()
	.min(1)
	.max(SATISMETER_MAX_PAGE_SIZE)
	.optional()
	.describe(
		`Results per page, 1 to ${SATISMETER_MAX_PAGE_SIZE}. Defaults to ${SATISMETER_DEFAULT_PAGE_SIZE}.`,
	);

const PageCursorSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'The `page.nextPageCursor` value of the previous page. Omit it for the first page; when the answer has no cursor, that was the last page.',
	);

// ── projects.get ──────────────────────────────────────────────────────────

const ProjectsGetInputSchema = z.object({
	projectId: ProjectIdSchema,
});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
	})
	.loose();

export type SatisMeterProject = z.infer<typeof ProjectSchema>;

const ProjectsGetResponseSchema = z.object({
	project: ProjectSchema,
});

export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

// ── surveys.list ──────────────────────────────────────────────────────────

const SurveysListInputSchema = z.object({
	projectId: ProjectIdSchema,
});

export type SurveysListInput = z.input<typeof SurveysListInputSchema>;

/** Documented template names; a newer template must not fail a read. */
export const SATISMETER_SURVEY_TYPES = [
	'nps',
	'ces',
	'csat',
	'pmf',
	'custom',
] as const;

export const SATISMETER_SURVEY_STATES = ['live', 'paused', 'draft'] as const;

const SurveySchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		// A string rather than the enum: a template the provider adds later must
		// not fail a list that has already been paid for in latency.
		type: z
			.string()
			.nullish()
			.describe('Survey template: nps, ces, csat, pmf or custom.'),
		state: z.string().nullish().describe('live, paused or draft.'),
	})
	.loose();

export type SatisMeterSurvey = z.infer<typeof SurveySchema>;

const SurveysListResponseSchema = z.object({
	surveys: z.array(SurveySchema),
});

export type SurveysListResponse = z.infer<typeof SurveysListResponseSchema>;

// ── surveys.get ───────────────────────────────────────────────────────────

const SurveysGetInputSchema = z.object({
	projectId: ProjectIdSchema,
	surveyId: SurveyIdSchema,
});

export type SurveysGetInput = z.input<typeof SurveysGetInputSchema>;

const SurveysGetResponseSchema = z.object({
	survey: SurveySchema,
});

export type SurveysGetResponse = z.infer<typeof SurveysGetResponseSchema>;

// ── responses.list ────────────────────────────────────────────────────────

/** Documented answer value: a scale or smiley score, free text, or choices. */
export const AnswerValueSchema = z.union([
	z.string(),
	z.number(),
	z.array(z.string()),
]);

const AnswerSchema = z
	.object({
		id: z.string().nullish().describe('ID of the answered question.'),
		label: z
			.string()
			.nullish()
			.describe('The question text, as shown to the person answering.'),
		value: AnswerValueSchema.nullish().describe(
			'Number for scale and smiley questions, string for long text and single choice, string array for multiple choice.',
		),
		type: z
			.string()
			.nullish()
			.describe('scale, smiley, long-text, single-choice or multiple-choice.'),
		metric: z
			.string()
			.nullish()
			.describe('nps, ces, csat or pmf, when the question carries one.'),
	})
	.loose();

export type SatisMeterAnswer = z.infer<typeof AnswerSchema>;

const RegionSchema = z
	.object({
		code: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

// Traits is a free-form map of whatever the caller sent with the user. Its keys
// are the caller's, so no shape can pin them.
// unknown: a record already accepts unknown keys and any value, and `z.record`
// has no `.loose()` in Zod 4, so this is the documented way to express it.
const TraitsSchema = z.record(z.string(), z.unknown());

const ResponseUserSchema = z
	.object({
		id: z.string().nullish().describe('SatisMeter internal user ID.'),
		userId: z.string().nullish().describe('The ID you supplied for this user.'),
		anonymousId: z
			.string()
			.nullish()
			.describe('Generated by SatisMeter when no `userId` was supplied.'),
		deleted: z.boolean().nullish(),
		// The spec documents traits as an object with no properties; the example
		// shows name, email and createdAt inside it.
		traits: TraitsSchema.nullish(),
		// The spec's example response includes these two beside traits.
		name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

export const LocationSchema = z
	.object({
		country: z
			.object({ code: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		region: RegionSchema.nullish(),
		city: z.string().nullish(),
	})
	.loose();

export const DeviceSchema = z
	.object({
		type: z.string().nullish().describe('phone, tablet or desktop.'),
		os: z.string().nullish(),
	})
	.loose();

export const ResponseSchema = z
	.object({
		id: z.string(),
		project: z.string().nullish(),
		campaign: z
			.string()
			.nullish()
			.describe('The survey this response belongs to.'),
		created: z.string().nullish().describe('UTC timestamp, ISO 8601.'),
		answers: z.array(AnswerSchema).nullish(),
		user: ResponseUserSchema.nullish(),
		ip: z
			.string()
			.nullish()
			.describe(
				"The answering user's IP address. Personal data: it is returned because the API returns it, so treat a stored response accordingly.",
			),
		location: LocationSchema.nullish(),
		referrer: z
			.string()
			.nullish()
			.describe(
				'The URL the user was on. Not logged by this plugin, because a URL can carry a token.',
			),
		method: z
			.string()
			.nullish()
			.describe('In-app, Form, Mobile, Reminder or Email.'),
		language: z.string().nullish().describe('ISO 639-1 code.'),
		device: DeviceSchema.nullish(),
	})
	.loose();

export type SatisMeterResponse = z.infer<typeof ResponseSchema>;

const ResponsesPageSchema = z
	.object({
		nextPageCursor: z
			.string()
			.nullish()
			.describe(
				'Pass as `pageCursor` to read the next page. Absent or null on the last page.',
			),
		hasNextPage: z
			.boolean()
			.describe(
				'True when more pages follow. Read this rather than the cursor, which is nullable.',
			),
		size: z.number().nullish().describe('Maximum results per page.'),
	})
	.loose();

/**
 * One shape for both response listings. The project route has no `campaignId`,
 * so its rows carry the campaign each response belongs to instead.
 */
const ResponsesPageResponseSchema = z.object({
	responses: z.array(ResponseSchema),
	page: ResponsesPageSchema,
});

export type ResponsesPageResponse = z.infer<typeof ResponsesPageResponseSchema>;

const ResponsesListInputSchema = z.object({
	projectId: ProjectIdSchema,
	...DateRangeShape,
	pageCursor: PageCursorSchema,
	pageSize: PageSizeSchema,
});

export type ResponsesListInput = z.input<typeof ResponsesListInputSchema>;

const SurveyResponsesListInputSchema = z.object({
	projectId: ProjectIdSchema,
	surveyId: SurveyIdSchema,
	...DateRangeShape,
	pageCursor: PageCursorSchema,
	pageSize: PageSizeSchema,
});

export type SurveyResponsesListInput = z.input<
	typeof SurveyResponsesListInputSchema
>;

// ── statistics.get ────────────────────────────────────────────────────────

const StatisticsGetInputSchema = z.object({
	projectId: ProjectIdSchema,
	surveyId: SurveyIdSchema,
	...DateRangeShape,
});

export type StatisticsGetInput = z.input<typeof StatisticsGetInputSchema>;

/** `long-text` questions carry no `values` array, only a count. */
const AnswerTallySchema = z
	.object({
		value: z.union([z.string(), z.number()]).nullish(),
		answers: z.number().nullish(),
	})
	.loose();

const MetricSchema = z
	.object({
		type: z.string().nullish().describe('nps, ces, csat or pmf.'),
		value: z.number().nullish(),
	})
	.loose();

const QuestionStatisticsSchema = z
	.object({
		id: z.string().nullish(),
		label: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('scale, smiley, long-text, single-choice or multiple-choice.'),
		statistics: z
			.object({
				answers: z
					.number()
					.nullish()
					.describe('Responses that answered this question.'),
				values: z
					.array(AnswerTallySchema)
					.nullish()
					.describe(
						'One entry per possible answer and how many chose it. Never present for long-text questions.',
					),
				metric: MetricSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const StatisticsGetResponseSchema = z.object({
	statistics: z
		.object({
			responses: z.number().nullish().describe('Total responses left.'),
			displays: z.number().nullish().describe('Times the survey was shown.'),
			responseRate: z
				.number()
				.nullish()
				.describe('Responses divided by displays, from 0 to 1.'),
		})
		.loose()
		.describe('Counts for the survey as a whole.'),
	questions: z
		.array(QuestionStatisticsSchema)
		.describe('Per-question breakdown.'),
});

export type StatisticsGetResponse = z.infer<typeof StatisticsGetResponseSchema>;

// ── users.upsert ──────────────────────────────────────────────────────────

/** `traits` is whatever the caller wants to send; SatisMeter stores it as sent. */
// unknown: the caller defines these keys and their value types, so there is no
// stricter type than an open record to describe them.
const UserTraitsSchema = z.record(z.string(), z.unknown());

const UsersUpsertInputSchema = z.object({
	projectId: ProjectIdSchema,
	userId: z
		.string()
		.min(1)
		.describe(
			'Your own ID for this user, the same one the browser snippet sends.',
		),
	traits: UserTraitsSchema.optional().describe(
		'Custom traits used for survey targeting, such as name, email, createdAt and plan. Sent as given.',
	),
	surveyDate: IsoDateSchema.optional().describe(
		'When the user next sees a survey. Use it to survey someone earlier or later than the targeting rules would.',
	),
});

export type UsersUpsertInput = z.input<typeof UsersUpsertInputSchema>;

/**
 * Every successful users write answers `204 No Content` with no body at all
 * (captured live for both `upsert` and `remove`). A write in Corsair has to
 * report something, so this echoes what was sent; nothing here is read back.
 */
const WriteAckSchema = z.object({
	userId: z.string(),
	/** SatisMeter answered without a body, so there is nothing to report but the request. */
	accepted: z.literal(true),
});

export type UsersUpsertResponse = z.infer<typeof WriteAckSchema>;

// ── users.track ───────────────────────────────────────────────────────────

const UsersTrackInputSchema = z.object({
	projectId: ProjectIdSchema,
	userId: z
		.string()
		.min(1)
		.describe(
			'Your own ID for this user, matching the one sent to the browser snippet.',
		),
	event: z
		.string()
		.min(1)
		.describe(
			'A name you choose, such as `completed-checkout`. Survey targeting can match on it.',
		),
});

export type UsersTrackInput = z.input<typeof UsersTrackInputSchema>;

const UsersTrackResponseSchema = z.object({
	userId: z.string(),
	event: z.string(),
	accepted: z.literal(true),
});

export type UsersTrackResponse = z.infer<typeof UsersTrackResponseSchema>;

// ── users.list ────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({
	projectId: ProjectIdSchema,
	userId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Only the user with this userId. The API still answers a list, holding one entry or none.',
		),
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const SatisMeterUserSchema = z
	.object({
		id: z
			.string()
			.nullish()
			.describe('SatisMeter internal ID, which `users.remove` takes.'),
		userId: z.string().nullish().describe('The ID you supplied.'),
		project: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		unsubscribed: z.boolean().nullish(),
		created: z.string().nullish(),
		lastSeen: z.string().nullish(),
		traits: TraitsSchema.nullish(),
		events: z
			.array(z.string())
			.nullish()
			.describe(
				"Event names recorded for this user. Present in the live answer although the provider's article example omits it.",
			),
	})
	.loose();

export type SatisMeterUser = z.infer<typeof SatisMeterUserSchema>;

const UsersListResponseSchema = z.object({
	users: z.array(SatisMeterUserSchema),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── users.remove ──────────────────────────────────────────────────────────

const UsersRemoveInputSchema = z.object({
	/** The internal `id`, not the `userId`: the provider says so explicitly. */
	userId: z
		.string()
		.min(1)
		.describe(
			"The user's internal `id` from `users.list`, not the `userId` you supplied. Deleting anonymises the user's responses rather than removing them.",
		),
});

export type UsersRemoveInput = z.input<typeof UsersRemoveInputSchema>;

const UsersRemoveResponseSchema = z.object({
	userId: z.string(),
	removed: z.literal(true),
});

export type UsersRemoveResponse = z.infer<typeof UsersRemoveResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SatisMeterEndpointInputs = {
	projectsGet: ProjectsGetInput;
	surveysList: SurveysListInput;
	surveysGet: SurveysGetInput;
	responsesList: ResponsesListInput;
	surveyResponsesList: SurveyResponsesListInput;
	statisticsGet: StatisticsGetInput;
	usersUpsert: UsersUpsertInput;
	usersTrack: UsersTrackInput;
	usersList: UsersListInput;
	usersRemove: UsersRemoveInput;
};

export type SatisMeterEndpointOutputs = {
	projectsGet: ProjectsGetResponse;
	surveysList: SurveysListResponse;
	surveysGet: SurveysGetResponse;
	responsesList: ResponsesPageResponse;
	surveyResponsesList: ResponsesPageResponse;
	statisticsGet: StatisticsGetResponse;
	usersUpsert: UsersUpsertResponse;
	usersTrack: UsersTrackResponse;
	usersList: UsersListResponse;
	usersRemove: UsersRemoveResponse;
};

export const SatisMeterEndpointInputSchemas = {
	projectsGet: ProjectsGetInputSchema,
	surveysList: SurveysListInputSchema,
	surveysGet: SurveysGetInputSchema,
	responsesList: ResponsesListInputSchema,
	surveyResponsesList: SurveyResponsesListInputSchema,
	statisticsGet: StatisticsGetInputSchema,
	usersUpsert: UsersUpsertInputSchema,
	usersTrack: UsersTrackInputSchema,
	usersList: UsersListInputSchema,
	usersRemove: UsersRemoveInputSchema,
} as const;

export const SatisMeterEndpointOutputSchemas = {
	projectsGet: ProjectsGetResponseSchema,
	surveysList: SurveysListResponseSchema,
	surveysGet: SurveysGetResponseSchema,
	responsesList: ResponsesPageResponseSchema,
	surveyResponsesList: ResponsesPageResponseSchema,
	statisticsGet: StatisticsGetResponseSchema,
	usersUpsert: WriteAckSchema,
	usersTrack: UsersTrackResponseSchema,
	usersList: UsersListResponseSchema,
	usersRemove: UsersRemoveResponseSchema,
} as const;

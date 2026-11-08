import { z } from 'zod';

// Field reference: https://api.memberspot.de/api (OpenAPI 3.0, also served as
// JSON at https://api.memberspot.de/api-json).
//
// Provider field names are kept exactly as sent, including the mixed
// `nextPage`/`lastLoadedId` pair and the `firstname`/`name` split where `name`
// means last name. Errors are `{ message, statusCode }`; a missing key is 400
// and an invalid one is 401.

const UidSchema = z.string().min(1);
const EmailSchema = z.string().email();

// ── shared response pieces ────────────────────────────────────────────────

const ExamRunSchema = z
	.object({
		startedAt: z.string().nullish(),
		finishedAt: z.string().nullish(),
		points: z.number().nullish(),
		passed: z.boolean().nullish(),
	})
	.loose();

const UserCourseProgressSchema = z
	.object({
		courseId: z.string().nullish(),
		activePosts: z.number().nullish(),
		completedPosts: z.number().nullish(),
		grantedAt: z.string().nullish(),
		progress: z.number().nullish(),
	})
	.loose();

export const UserSchema = z
	.object({
		uid: z.string(),
		email: z.string(),
		created: z.string(),
		firstname: z.string(),
		// MemberSpot calls the last name `name`.
		name: z.string(),
		active: z.boolean().nullish(),
		progress: z.array(UserCourseProgressSchema).nullish(),
		customUserProperties: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export type MemberSpotUser = z.infer<typeof UserSchema>;

const OfferSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		hasCourseIds: z.array(z.string()).nullish(),
	})
	.loose();

export type MemberSpotOffer = z.infer<typeof OfferSchema>;

const CourseSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

export type MemberSpotCourse = z.infer<typeof CourseSchema>;

const ExamSummarySchema = z
	.object({
		examId: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		requiredPercentage: z.number().nullish(),
		questionCount: z.number().nullish(),
	})
	.loose();

const ExamResultSchema = z
	.object({
		uid: z.string().nullish(),
		email: z.string().nullish(),
		firstname: z.string().nullish(),
		name: z.string().nullish(),
		lastRun: ExamRunSchema.nullish(),
		lastSuccessfullRun: ExamRunSchema.nullish(),
		runs: z.array(ExamRunSchema).nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

const CustomPropertySchema = z
	.object({
		id: z.string(),
		schoolId: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		options: z.array(z.string()).nullish(),
	})
	.loose();

const UserOfferGrantSchema = z
	.object({
		offerId: z.string(),
		active: z.boolean().nullish(),
		grantedAt: z.string().nullish(),
		expiresAt: z.string().nullish(),
	})
	.loose();

const UserCourseProgressItemSchema = z
	.object({
		uid: z.string().nullish(),
		email: z.string().nullish(),
		firstname: z.string().nullish(),
		name: z.string().nullish(),
		active: z.boolean().nullish(),
		courseId: z.string().nullish(),
		activePosts: z.number().nullish(),
		completedPosts: z.number().nullish(),
	})
	.loose();

// ── auth ──────────────────────────────────────────────────────────────────

const AuthCheckInputSchema = z.object({});

export type AuthCheckInput = z.input<typeof AuthCheckInputSchema>;

const AuthCheckResponseSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type AuthCheckResponse = z.infer<typeof AuthCheckResponseSchema>;

// ── catalog reads ─────────────────────────────────────────────────────────

const NoInputSchema = z.object({});

export type NoInput = z.input<typeof NoInputSchema>;

const OffersResponseSchema = z.array(OfferSchema);
export type OffersResponse = z.infer<typeof OffersResponseSchema>;

const CoursesResponseSchema = z.object({ data: z.array(CourseSchema) }).loose();
export type CoursesResponse = z.infer<typeof CoursesResponseSchema>;

const ExamsResponseSchema = z
	.object({ data: z.array(ExamSummarySchema) })
	.loose();
export type ExamsResponse = z.infer<typeof ExamsResponseSchema>;

const CustomPropertiesResponseSchema = z.array(CustomPropertySchema);
export type CustomPropertiesResponse = z.infer<
	typeof CustomPropertiesResponseSchema
>;

// ── users: paginated list ─────────────────────────────────────────────────

const PageInputSchema = z.object({
	lastLoadedId: z
		.string()
		.optional()
		.describe(
			'Cursor to continue from. Pass the `nextPage` value from the previous response.',
		),
	pageLength: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Page size, 1 to 100. MemberSpot defaults to 10.'),
});

const UsersListInputSchema = PageInputSchema.extend({
	offerId: z.string().optional().describe('Only users holding this offer.'),
	courseId: z
		.string()
		.optional()
		.describe(
			'Only users with this course. Also populates each user\u2019s `progress` with that course alone.',
		),
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({
		data: z.array(UserSchema),
		nextPage: z
			.string()
			.nullish()
			.describe('Present while more users remain; pass it as `lastLoadedId`.'),
	})
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── users: single lookups ─────────────────────────────────────────────────

const UserByEmailInputSchema = z.object({ email: EmailSchema });
const UserByUidInputSchema = z.object({ uid: UidSchema });

export type UserByEmailInput = z.input<typeof UserByEmailInputSchema>;
export type UserByUidInput = z.input<typeof UserByUidInputSchema>;

export type UserResponse = MemberSpotUser;

// ── users: offers ─────────────────────────────────────────────────────────

const UserOffersResponseSchema = z
	.object({
		uid: z.string(),
		offers: z.array(UserOfferGrantSchema),
	})
	.loose();

export type UserOffersResponse = z.infer<typeof UserOffersResponseSchema>;

// ── users: course progress ────────────────────────────────────────────────

const UserCourseProgressListInputSchema = PageInputSchema.extend({
	email: EmailSchema,
});

export type UserCourseProgressListInput = z.input<
	typeof UserCourseProgressListInputSchema
>;

const UserCourseProgressByUidListInputSchema = PageInputSchema.extend({
	uid: UidSchema,
});

export type UserCourseProgressByUidListInput = z.input<
	typeof UserCourseProgressByUidListInputSchema
>;

const UserCourseProgressResponseSchema = z
	.object({
		data: z.array(UserCourseProgressItemSchema),
		nextPage: z.string().nullish(),
	})
	.loose();

export type UserCourseProgressResponse = z.infer<
	typeof UserCourseProgressResponseSchema
>;

const UserCourseInputSchema = z.object({
	courseId: z.string().min(1),
	email: EmailSchema,
});

const UserCourseByUidInputSchema = z.object({
	courseId: z.string().min(1),
	uid: UidSchema,
});

export type UserCourseInput = z.input<typeof UserCourseInputSchema>;
export type UserCourseByUidInput = z.input<typeof UserCourseByUidInputSchema>;

const UserCourseProgressDetailSchema = z
	.object({
		courseId: z.string().nullish(),
		activePosts: z.number().nullish(),
		completedPosts: z.number().nullish(),
		progress: z.number().nullish(),
	})
	.loose();

export type UserCourseProgressDetail = z.infer<
	typeof UserCourseProgressDetailSchema
>;

// ── users: writes ─────────────────────────────────────────────────────────

const GrantOfferInputSchema = z.object({
	email: EmailSchema,
	firstname: z.string().optional(),
	name: z.string().optional().describe('Last name.'),
	grantOffer: z
		.string()
		.optional()
		.describe('Offer to grant in the same call, by id.'),
	orderId: z.string().optional(),
});

export type GrantOfferInput = z.input<typeof GrantOfferInputSchema>;

const GrantOfferByUidInputSchema = z.object({
	uid: UidSchema,
	offerId: z.string().min(1),
});

export type GrantOfferByUidInput = z.input<typeof GrantOfferByUidInputSchema>;

const UserCreatedResponseSchema = z
	.object({
		uid: z.string(),
		externalId: z.string().nullish(),
		isNew: z.boolean(),
		firstname: z.string(),
		name: z.string(),
		email: z.string(),
		active: z.boolean().nullish(),
		grantedOffers: z
			.array(z.object({ offerId: z.string(), name: z.string() }).loose())
			.nullish(),
	})
	.loose();

export type UserCreatedResponse = z.infer<typeof UserCreatedResponseSchema>;

const SetOfferStateInputSchema = z.object({
	email: EmailSchema,
	offerId: z.string().min(1),
	active: z.boolean().optional().describe('True grants, false revokes.'),
});

const SetOfferStateByUidInputSchema = z.object({
	uid: UidSchema,
	offerId: z.string().min(1),
	active: z.boolean().optional(),
});

export type SetOfferStateInput = z.input<typeof SetOfferStateInputSchema>;
export type SetOfferStateByUidInput = z.input<
	typeof SetOfferStateByUidInputSchema
>;

const SetOrderStateInputSchema = z.object({
	email: EmailSchema,
	offerId: z.string().min(1),
	orderId: z.string().min(1),
	active: z.boolean().optional(),
});

const SetOrderStateByUidInputSchema = z.object({
	uid: UidSchema,
	offerId: z.string().min(1),
	orderId: z.string().min(1),
	active: z.boolean().optional(),
});

const SetOrderStateByOrderIdInputSchema = z.object({
	orderId: z.string().min(1),
	active: z.boolean().optional(),
});

export type SetOrderStateInput = z.input<typeof SetOrderStateInputSchema>;
export type SetOrderStateByUidInput = z.input<
	typeof SetOrderStateByUidInputSchema
>;
export type SetOrderStateByOrderIdInput = z.input<
	typeof SetOrderStateByOrderIdInputSchema
>;

const SetOfferExpiresInputSchema = z.object({
	uid: UidSchema,
	offerId: z.string().min(1),
	expiresAt: z
		.string()
		.nullish()
		.describe('ISO date-time, or null to clear the expiry.'),
});

export type SetOfferExpiresInput = z.input<typeof SetOfferExpiresInputSchema>;

const SetCourseStartDateInputSchema = z.object({
	uid: UidSchema,
	courseId: z.string().min(1),
	startDate: z
		.string()
		.describe('ISO date-time the course access should start.'),
});

export type SetCourseStartDateInput = z.input<
	typeof SetCourseStartDateInputSchema
>;

const CustomPropertyValueSchema = z.record(z.string(), z.string());

const SetCustomPropertiesInputSchema = z.object({
	email: EmailSchema,
	properties: CustomPropertyValueSchema.describe(
		'Property key to value. A property omitted here is left unchanged.',
	),
});

const SetCustomPropertiesByUidInputSchema = z.object({
	uid: UidSchema,
	properties: CustomPropertyValueSchema,
});

export type SetCustomPropertiesInput = z.input<
	typeof SetCustomPropertiesInputSchema
>;
export type SetCustomPropertiesByUidInput = z.input<
	typeof SetCustomPropertiesByUidInputSchema
>;

const SetCustomPropertyInputSchema = z.object({
	email: EmailSchema,
	key: z.string().min(1).describe('The custom property id.'),
	value: z.string().nullish().describe('Null or omitted blanks the property.'),
});

const SetCustomPropertyByUidInputSchema = z.object({
	uid: UidSchema,
	key: z.string().min(1),
	value: z.string().nullish(),
});

export type SetCustomPropertyInput = z.input<
	typeof SetCustomPropertyInputSchema
>;
export type SetCustomPropertyByUidInput = z.input<
	typeof SetCustomPropertyByUidInputSchema
>;

/**
 * MemberSpot caps a single delete at 10 users, so the schema enforces it rather
 * than letting the API reject the call a request later.
 */
const DeleteUsersInputSchema = z.object({
	emails: z.array(EmailSchema).min(1).max(10),
});

const DeleteUsersByUidInputSchema = z.object({
	uids: z.array(UidSchema).min(1).max(10),
});

export type DeleteUsersInput = z.input<typeof DeleteUsersInputSchema>;
export type DeleteUsersByUidInput = z.input<typeof DeleteUsersByUidInputSchema>;

const MutationResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type MutationResponse = z.infer<typeof MutationResponseSchema>;

// ── chapters ──────────────────────────────────────────────────────────────

const ChapterAccessInputSchema = z.object({
	email: EmailSchema,
	chapterId: z.string().min(1),
});

const ChapterAccessByUidInputSchema = z.object({
	uid: UidSchema,
	chapterId: z.string().min(1),
});

export type ChapterAccessInput = z.input<typeof ChapterAccessInputSchema>;
export type ChapterAccessByUidInput = z.input<
	typeof ChapterAccessByUidInputSchema
>;

// ── exams ─────────────────────────────────────────────────────────────────

const ExamResultsInputSchema = PageInputSchema.extend({
	id: z.string().min(1).describe('The `examId` from `exams.list`.'),
});

export type ExamResultsInput = z.input<typeof ExamResultsInputSchema>;

const ExamResultsResponseSchema = z
	.object({
		data: z.array(ExamResultSchema),
		nextPage: z.string().nullish(),
	})
	.loose();

export type ExamResultsResponse = z.infer<typeof ExamResultsResponseSchema>;

// ── login token ───────────────────────────────────────────────────────────

const LoginTokenInputSchema = z.object({ uid: UidSchema });

export type LoginTokenInput = z.input<typeof LoginTokenInputSchema>;

const LoginTokenResponseSchema = z
	.object({
		token: z.string(),
		loginUrl: z.string(),
	})
	.loose();

export type LoginTokenResponse = z.infer<typeof LoginTokenResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MemberSpotEndpointInputs = {
	authCheck: AuthCheckInput;
	offersList: NoInput;
	coursesList: NoInput;
	examsList: NoInput;
	customPropertiesList: NoInput;
	usersList: UsersListInput;
	usersFindByEmail: UserByEmailInput;
	usersFindByUid: UserByUidInput;
	usersOffers: UserByUidInput;
	usersLoginToken: LoginTokenInput;
	usersGrantOffer: GrantOfferInput;
	usersGrantOfferByUid: GrantOfferByUidInput;
	usersSetOfferState: SetOfferStateInput;
	usersSetOfferStateByUid: SetOfferStateByUidInput;
	usersSetOrderState: SetOrderStateInput;
	usersSetOrderStateByUid: SetOrderStateByUidInput;
	usersSetOrderStateByOrderId: SetOrderStateByOrderIdInput;
	usersSetOfferExpires: SetOfferExpiresInput;
	usersSetCourseStartDate: SetCourseStartDateInput;
	usersCourseProgress: UserCourseProgressListInput;
	usersCourseProgressByUid: UserCourseProgressByUidListInput;
	usersCourseProgressDetail: UserCourseInput;
	usersCourseProgressDetailByUid: UserCourseByUidInput;
	usersSetCustomProperties: SetCustomPropertiesInput;
	usersSetCustomPropertiesByUid: SetCustomPropertiesByUidInput;
	usersSetCustomProperty: SetCustomPropertyInput;
	usersSetCustomPropertyByUid: SetCustomPropertyByUidInput;
	usersDelete: DeleteUsersInput;
	usersDeleteByUid: DeleteUsersByUidInput;
	examResults: ExamResultsInput;
	chaptersEnableAccess: ChapterAccessInput;
	chaptersEnableAccessByUid: ChapterAccessByUidInput;
};

export type MemberSpotEndpointOutputs = {
	authCheck: AuthCheckResponse;
	offersList: OffersResponse;
	coursesList: CoursesResponse;
	examsList: ExamsResponse;
	customPropertiesList: CustomPropertiesResponse;
	usersList: UsersListResponse;
	usersFindByEmail: UserResponse;
	usersFindByUid: UserResponse;
	usersOffers: UserOffersResponse;
	usersLoginToken: LoginTokenResponse;
	usersGrantOffer: UserCreatedResponse;
	usersGrantOfferByUid: UserCreatedResponse;
	usersSetOfferState: MutationResponse;
	usersSetOfferStateByUid: MutationResponse;
	usersSetOrderState: MutationResponse;
	usersSetOrderStateByUid: MutationResponse;
	usersSetOrderStateByOrderId: MutationResponse;
	usersSetOfferExpires: MutationResponse;
	usersSetCourseStartDate: MutationResponse;
	usersCourseProgress: UserCourseProgressResponse;
	usersCourseProgressByUid: UserCourseProgressResponse;
	usersCourseProgressDetail: UserCourseProgressDetail;
	usersCourseProgressDetailByUid: UserCourseProgressDetail;
	usersSetCustomProperties: MutationResponse;
	usersSetCustomPropertiesByUid: MutationResponse;
	usersSetCustomProperty: MutationResponse;
	usersSetCustomPropertyByUid: MutationResponse;
	usersDelete: MutationResponse;
	usersDeleteByUid: MutationResponse;
	examResults: ExamResultsResponse;
	chaptersEnableAccess: MutationResponse;
	chaptersEnableAccessByUid: MutationResponse;
};

export const MemberSpotEndpointInputSchemas = {
	authCheck: AuthCheckInputSchema,
	offersList: NoInputSchema,
	coursesList: NoInputSchema,
	examsList: NoInputSchema,
	customPropertiesList: NoInputSchema,
	usersList: UsersListInputSchema,
	usersFindByEmail: UserByEmailInputSchema,
	usersFindByUid: UserByUidInputSchema,
	usersOffers: UserByUidInputSchema,
	usersLoginToken: LoginTokenInputSchema,
	usersGrantOffer: GrantOfferInputSchema,
	usersGrantOfferByUid: GrantOfferByUidInputSchema,
	usersSetOfferState: SetOfferStateInputSchema,
	usersSetOfferStateByUid: SetOfferStateByUidInputSchema,
	usersSetOrderState: SetOrderStateInputSchema,
	usersSetOrderStateByUid: SetOrderStateByUidInputSchema,
	usersSetOrderStateByOrderId: SetOrderStateByOrderIdInputSchema,
	usersSetOfferExpires: SetOfferExpiresInputSchema,
	usersSetCourseStartDate: SetCourseStartDateInputSchema,
	usersCourseProgress: UserCourseProgressListInputSchema,
	usersCourseProgressByUid: UserCourseProgressByUidListInputSchema,
	usersCourseProgressDetail: UserCourseInputSchema,
	usersCourseProgressDetailByUid: UserCourseByUidInputSchema,
	usersSetCustomProperties: SetCustomPropertiesInputSchema,
	usersSetCustomPropertiesByUid: SetCustomPropertiesByUidInputSchema,
	usersSetCustomProperty: SetCustomPropertyInputSchema,
	usersSetCustomPropertyByUid: SetCustomPropertyByUidInputSchema,
	usersDelete: DeleteUsersInputSchema,
	usersDeleteByUid: DeleteUsersByUidInputSchema,
	examResults: ExamResultsInputSchema,
	chaptersEnableAccess: ChapterAccessInputSchema,
	chaptersEnableAccessByUid: ChapterAccessByUidInputSchema,
} as const;

export const MemberSpotEndpointOutputSchemas = {
	authCheck: AuthCheckResponseSchema,
	offersList: OffersResponseSchema,
	coursesList: CoursesResponseSchema,
	examsList: ExamsResponseSchema,
	customPropertiesList: CustomPropertiesResponseSchema,
	usersList: UsersListResponseSchema,
	usersFindByEmail: UserSchema,
	usersFindByUid: UserSchema,
	usersOffers: UserOffersResponseSchema,
	usersLoginToken: LoginTokenResponseSchema,
	usersGrantOffer: UserCreatedResponseSchema,
	usersGrantOfferByUid: UserCreatedResponseSchema,
	usersSetOfferState: MutationResponseSchema,
	usersSetOfferStateByUid: MutationResponseSchema,
	usersSetOrderState: MutationResponseSchema,
	usersSetOrderStateByUid: MutationResponseSchema,
	usersSetOrderStateByOrderId: MutationResponseSchema,
	usersSetOfferExpires: MutationResponseSchema,
	usersSetCourseStartDate: MutationResponseSchema,
	usersCourseProgress: UserCourseProgressResponseSchema,
	usersCourseProgressByUid: UserCourseProgressResponseSchema,
	usersCourseProgressDetail: UserCourseProgressDetailSchema,
	usersCourseProgressDetailByUid: UserCourseProgressDetailSchema,
	usersSetCustomProperties: MutationResponseSchema,
	usersSetCustomPropertiesByUid: MutationResponseSchema,
	usersSetCustomProperty: MutationResponseSchema,
	usersSetCustomPropertyByUid: MutationResponseSchema,
	usersDelete: MutationResponseSchema,
	usersDeleteByUid: MutationResponseSchema,
	examResults: ExamResultsResponseSchema,
	chaptersEnableAccess: MutationResponseSchema,
	chaptersEnableAccessByUid: MutationResponseSchema,
} as const;

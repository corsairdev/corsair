import { z } from 'zod';

const ClassmarkerStatusSchema = z.enum([
	'ok',
	'no_results',
	'error',
	'verified',
]);

const TestRefSchema = z.object({
	test_id: z.coerce.number(),
	test_name: z.string(),
});

const AssignedTestSchema = z.object({
	test: TestRefSchema,
});

const GroupRefSchema = z.object({
	group_id: z.coerce.number(),
	group_name: z.string(),
	assigned_tests: z.array(AssignedTestSchema).optional(),
});

const LinkRefSchema = z.object({
	link_id: z.coerce.number(),
	link_name: z.string(),
	link_url_id: z.string().optional(),
	access_list_id: z.coerce.number().optional(),
	assigned_tests: z.array(AssignedTestSchema).optional(),
});

const MonitorEventItemSchema = z.object({
	timestamp: z.coerce.number(),
	event: z.string(),
	seconds_away: z.coerce.number(),
});

const MonitorEventsSchema = z.object({
	browser_monitoring: z.string().optional(),
	camera_monitoring: z.string().optional(),
	total_event_count: z.coerce.number().optional(),
	total_seconds_away: z.coerce.number().optional(),
	events: z.array(MonitorEventItemSchema).optional(),
});

const CommonResultSchema = z.object({
	test_id: z.coerce.number(),
	percentage: z.coerce.number(),
	points_scored: z.coerce.number(),
	points_available: z.coerce.number(),
	time_started: z.coerce.number(),
	time_finished: z.coerce.number(),
	status: z.string(),
	duration: z.string().optional(),
	percentage_passmark: z.coerce.number().optional(),
	passed: z.boolean().optional(),
	requires_grading: z.string().optional(),
	give_certificate_only_when_passed: z.boolean().optional(),
	certificate_url: z.string().optional(),
	certificate_serial: z.string().optional(),
	view_results_url: z.string().optional(),
	test_type: z.string().optional(),
	monitor_events: MonitorEventsSchema.optional(),
});

const GroupResultSchema = CommonResultSchema.extend({
	user_id: z.coerce.number(),
	group_id: z.coerce.number(),
	first: z.string().optional(),
	last: z.string().optional(),
	email: z.string().optional(),
});

const LinkResultSchema = CommonResultSchema.extend({
	link_id: z.coerce.number(),
	first: z.string().optional(),
	last: z.string().optional(),
	email: z.string().optional(),
	access_code: z.string().optional(),
	extra_info: z.string().optional(),
	extra_info2: z.string().optional(),
	extra_info3: z.string().optional(),
	extra_info4: z.string().optional(),
	extra_info5: z.string().optional(),
	link_result_id: z.coerce.number().optional(),
	cm_user_id: z.string().optional(),
	ip_address: z.string().optional(),
});

const GroupResultWrapperSchema = z.object({
	result: GroupResultSchema,
});

const LinkResultWrapperSchema = z.object({
	result: LinkResultSchema,
});

const GroupWrapperSchema = z.object({ group: GroupRefSchema });
const LinkWrapperSchema = z.object({ link: LinkRefSchema });
const TestWrapperSchema = z.object({ test: TestRefSchema });

const ClassmarkerErrorBodySchema = z
	.object({
		error_code: z.string().optional(),
		error_message: z.string().optional(),
		next_request_after: z.coerce.number().optional(),
	})
	.optional();

const BaseEnvelopeSchema = z.object({
	status: ClassmarkerStatusSchema,
	request_path: z.string().optional(),
	server_timestamp: z.coerce.number().optional(),
	finished_after_timestamp_used: z.coerce.number().optional(),
	num_results_available: z.coerce.number().optional(),
	num_results_returned: z.coerce.number().optional(),
	more_results_exist: z.boolean().optional(),
	next_finished_after_timestamp: z.coerce.number().optional(),
	error: ClassmarkerErrorBodySchema,
});

const AccessListResponseSchema = z.object({
	access_lists: z
		.object({
			access_list: z.object({
				access_list_id: z.coerce.number(),
				access_list_name: z.string().optional(),
				num_codes_added: z.coerce.number().optional(),
				num_codes_deleted: z.coerce.number().optional(),
				num_codes_total: z.coerce.number().optional(),
			}),
		})
		.optional(),
});

const ParentCategorySchema = z.object({
	parent_category_id: z.coerce.number(),
	parent_category_name: z.string(),
	categories: z
		.array(
			z.object({
				category_id: z.coerce.number(),
				category_name: z.string(),
				parent_category_id: z.coerce.number(),
			}),
		)
		.optional(),
});

const CategorySchema = z.object({
	category_id: z.coerce.number(),
	category_name: z.string(),
	parent_category_id: z.coerce.number(),
});

const CategoriesDataSchema = z.object({
	parent_categories: z.array(ParentCategorySchema),
});

const CategoryDataSchema = z.object({
	parent_category: ParentCategorySchema.optional(),
	category: CategorySchema.optional(),
});

const QuestionOptionSchema = z.object({
	content: z.string().optional(),
});

const QuestionTypeSchema = z.enum([
	'multiplechoice',
	'multipleresponse',
	'truefalse',
	'essay',
]);

const QuestionBaseMutationSchema = z
	.object({
		question: z.string().min(1),
		question_type: QuestionTypeSchema,
		category_id: z.coerce.number().int().positive(),
		points: z.union([z.string(), z.coerce.number()]),
		correct_feedback: z.string().optional(),
		incorrect_feedback: z.string().optional(),
	})
	.strict();

const ChoiceQuestionMutationSchema = QuestionBaseMutationSchema.extend({
	question_type: z.enum(['multiplechoice', 'multipleresponse', 'truefalse']),
	random_answers: z.boolean().optional(),
	options: z.record(z.string().regex(/^[A-J]$/), QuestionOptionSchema),
	correct_options: z.array(z.string().regex(/^[A-J]$/)).min(1),
	grade_style: z
		.enum(['partial_with_deduction', 'partial_without_deduction', 'off'])
		.optional(),
}).superRefine((value, ctx) => {
	const optionKeys = Object.keys(value.options);
	const optionKeySet = new Set(optionKeys);

	for (const option of value.correct_options) {
		if (!optionKeySet.has(option)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['correct_options'],
				message: `correct option ${option} is not defined in options`,
			});
		}
	}

	if (optionKeys.length === 0 || optionKeys.length > 10) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['options'],
			message: 'options must contain between 1 and 10 entries',
		});
	}

	if (
		value.question_type === 'multiplechoice' &&
		value.correct_options.length !== 1
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['correct_options'],
			message: 'multiplechoice requires exactly one correct option',
		});
	}

	if (value.question_type === 'truefalse') {
		if (!('A' in value.options) || !('B' in value.options)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['options'],
				message: 'truefalse questions require A and B options',
			});
		}

		if (value.correct_options.length !== 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['correct_options'],
				message: 'truefalse requires exactly one correct option',
			});
		}

		for (const option of value.correct_options) {
			if (option !== 'A' && option !== 'B') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['correct_options'],
					message: 'truefalse correct option must be A or B',
				});
			}
		}
	}

	if (
		value.question_type === 'multiplechoice' ||
		value.question_type === 'truefalse'
	) {
		if (value.grade_style !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['grade_style'],
				message: 'grade_style is only supported for multipleresponse questions',
			});
		}
	}
});

const EssayQuestionMutationSchema = QuestionBaseMutationSchema.extend({
	question_type: z.literal('essay'),
}).strict();

const QuestionMutationSchema = z.union([
	ChoiceQuestionMutationSchema,
	EssayQuestionMutationSchema,
]);

const QuestionSchema = z
	.object({
		question_id: z.coerce.number(),
		question: z.string(),
		question_type: z.string(),
		category_id: z.coerce.number().optional(),
		random_answers: z.boolean().optional(),
		points: z.union([z.string(), z.coerce.number()]).optional(),
		correct_feedback: z.string().optional(),
		incorrect_feedback: z.string().optional(),
		last_updated_timestamp: z.coerce.number().optional(),
		status: z.string().optional(),
		grade_style: z.string().optional(),
		options: z.record(z.string(), QuestionOptionSchema).optional(),
		correct_options: z.array(z.string()).optional(),
	})
	.passthrough();

const VerifyOnlySchema = z.object({
	status: z.literal('verified'),
	request_path: z.string().optional(),
	server_timestamp: z.coerce.number().optional(),
});

export const GetAllGroupsLinksExamsInputSchema = z.object({});
export const GetRecentResultsForAllGroupsInputSchema = z.object({
	finishedAfterTimestamp: z.coerce.number().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
});
export const GetRecentResultsForAllLinksInputSchema =
	GetRecentResultsForAllGroupsInputSchema;
export const GetRecentResultsForGroupExamInputSchema = z.object({
	group_id: z.coerce.number().int().positive(),
	test_id: z.coerce.number().int().positive(),
	finishedAfterTimestamp: z.coerce.number().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
});
export const GetRecentResultsForLinkExamInputSchema = z.object({
	link_id: z.coerce.number().int().positive(),
	test_id: z.coerce.number().int().positive(),
	finishedAfterTimestamp: z.coerce.number().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
});
export const AddAccessCodesInputSchema = z.object({
	access_list_id: z.coerce.number().int().positive(),
	access_codes: z.array(z.string().min(1).max(255)).min(1).max(100),
});
export const DeleteAccessCodesInputSchema = AddAccessCodesInputSchema;
export const GetAllCategoriesInputSchema = z.object({});
export const CreateParentCategoryInputSchema = z.object({
	parent_category_name: z.string().min(1),
	verify_only: z.boolean().optional(),
});
export const UpdateParentCategoryInputSchema = z.object({
	parent_category_id: z.coerce.number().int().positive(),
	parent_category_name: z.string().min(1),
	verify_only: z.boolean().optional(),
});
export const CreateCategoryInputSchema = z.object({
	category_name: z.string().min(1),
	parent_category_id: z.coerce.number().int().positive(),
	verify_only: z.boolean().optional(),
});
export const UpdateCategoryInputSchema = z.object({
	category_id: z.coerce.number().int().positive(),
	category_name: z.string().min(1),
	parent_category_id: z.coerce.number().int().positive(),
	verify_only: z.boolean().optional(),
});
export const ListQuestionsInputSchema = z.object({
	page: z.coerce.number().int().min(1).optional(),
});
export const GetQuestionInputSchema = z.object({
	question_id: z.coerce.number().int().positive(),
});
export const CreateQuestionInputSchema = z.object({
	question: QuestionMutationSchema,
	verify_only: z.boolean().optional(),
});
export const UpdateQuestionInputSchema = z.object({
	question_id: z.coerce.number().int().positive(),
	question: QuestionMutationSchema,
	verify_only: z.boolean().optional(),
});
export const ListUsersInputSchema = z.object({
	page: z.coerce.number().int().min(1).optional(),
});
export const GetUserDetailsInputSchema = z.object({
	user_id: z.coerce.number().int().positive(),
});
export const CreateUserInputSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	email: z.string().email(),
	group_ids: z.array(z.coerce.number().int().positive()).optional(),
});
export const DeleteUserInputSchema = GetUserDetailsInputSchema;
export const CreateGroupInputSchema = z.object({
	group_name: z.string().min(1),
});
export const DeleteGroupInputSchema = z.object({
	group_id: z.coerce.number().int().positive(),
});
export const GetGroupDetailsInputSchema = DeleteGroupInputSchema;
export const ListTestsInputSchema = z.object({});
export const GetTestDetailsInputSchema = z.object({
	test_id: z.coerce.number().int().positive(),
});
export const DeleteTestLinkInputSchema = z.object({
	link_id: z.coerce.number().int().positive(),
	test_id: z.coerce.number().int().positive(),
});
export const ListCertificatesInputSchema = z.object({});
export const ListWebhooksInputSchema = z.object({});
export const DeleteWebhookInputSchema = z.object({
	webhook_id: z.coerce.number().int().positive(),
});
export const DeleteApiKeyInputSchema = z.object({
	api_key_id: z.coerce.number().int().positive(),
});
export const GetInitialFinishedAfterTimestampInputSchema = z.object({});

export const GetAllGroupsLinksExamsOutputSchema = BaseEnvelopeSchema.extend({
	groups: z.array(GroupWrapperSchema).optional(),
	links: z.array(LinkWrapperSchema).optional(),
});
export const GetRecentResultsForAllGroupsOutputSchema =
	BaseEnvelopeSchema.extend({
		groups: z.array(GroupWrapperSchema).optional(),
		tests: z.array(TestWrapperSchema).optional(),
		results: z.array(GroupResultWrapperSchema).optional(),
	});
export const GetRecentResultsForAllLinksOutputSchema =
	BaseEnvelopeSchema.extend({
		links: z.array(LinkWrapperSchema).optional(),
		tests: z.array(TestWrapperSchema).optional(),
		results: z.array(LinkResultWrapperSchema).optional(),
	});
export const GetRecentResultsForGroupExamOutputSchema =
	GetRecentResultsForAllGroupsOutputSchema;
export const GetRecentResultsForLinkExamOutputSchema =
	GetRecentResultsForAllLinksOutputSchema;
export const AccessCodesResponseOutputSchema = BaseEnvelopeSchema.merge(
	AccessListResponseSchema,
);
export const GetAllCategoriesOutputSchema = BaseEnvelopeSchema.extend({
	data: CategoriesDataSchema.optional(),
});
export const ParentCategoryMutationOutputSchema = z.union([
	VerifyOnlySchema,
	BaseEnvelopeSchema.extend({ data: CategoryDataSchema.optional() }),
]);
export const CategoryMutationOutputSchema = ParentCategoryMutationOutputSchema;
export const ListQuestionsOutputSchema = BaseEnvelopeSchema.extend({
	questions: z.array(QuestionSchema).optional(),
});
export const GetQuestionOutputSchema = z.union([
	QuestionSchema,
	BaseEnvelopeSchema.extend({
		question_id: z.coerce.number().optional(),
	}),
]);
export const QuestionMutationOutputSchema = z.union([
	VerifyOnlySchema,
	QuestionSchema,
	BaseEnvelopeSchema.extend({ question_id: z.coerce.number().optional() }),
]);
const UserSchema = z
	.object({
		user_id: z.coerce.number().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();
const TestAssignmentSchema = z.object({
	test: TestRefSchema,
	group: GroupRefSchema.optional(),
	link: LinkRefSchema.optional(),
});
const GenericEnvelopeOutputSchema = BaseEnvelopeSchema.passthrough();
export const ListUsersOutputSchema = BaseEnvelopeSchema.extend({
	users: z.array(z.object({ user: UserSchema })).optional(),
}).passthrough();
export const GetUserDetailsOutputSchema = z.union([
	UserSchema,
	BaseEnvelopeSchema.extend({
		user: UserSchema.optional(),
	}).passthrough(),
]);
export const CreateUserOutputSchema = GenericEnvelopeOutputSchema;
export const DeleteUserOutputSchema = GenericEnvelopeOutputSchema;
export const CreateGroupOutputSchema = GenericEnvelopeOutputSchema;
export const DeleteGroupOutputSchema = GenericEnvelopeOutputSchema;
export const GetGroupDetailsOutputSchema = z
	.object({
		status: ClassmarkerStatusSchema,
		group: GroupRefSchema.optional(),
		request_path: z.string().optional(),
		server_timestamp: z.coerce.number().optional(),
	})
	.passthrough();
export const ListTestsOutputSchema = z.object({
	status: ClassmarkerStatusSchema,
	tests: z.array(TestRefSchema),
});
export const GetTestDetailsOutputSchema = z.object({
	status: ClassmarkerStatusSchema,
	test: TestRefSchema.optional(),
	assignments: z.array(TestAssignmentSchema),
});
export const DeleteTestLinkOutputSchema = GenericEnvelopeOutputSchema;
export const ListCertificatesOutputSchema = BaseEnvelopeSchema.extend({
	certificates: z.array(z.record(z.string(), z.unknown())).optional(),
}).passthrough();
export const ListWebhooksOutputSchema = BaseEnvelopeSchema.extend({
	webhooks: z.array(z.record(z.string(), z.unknown())).optional(),
}).passthrough();
export const DeleteWebhookOutputSchema = GenericEnvelopeOutputSchema;
export const DeleteApiKeyOutputSchema = GenericEnvelopeOutputSchema;
export const GetInitialFinishedAfterTimestampOutputSchema = z.object({
	finishedAfterTimestamp: z.coerce.number().int().positive(),
});

export const ClassmarkerEndpointInputSchemas = {
	getAllGroupsLinksExams: GetAllGroupsLinksExamsInputSchema,
	getRecentResultsForAllGroups: GetRecentResultsForAllGroupsInputSchema,
	getRecentResultsForAllLinks: GetRecentResultsForAllLinksInputSchema,
	getRecentResultsForGroupExam: GetRecentResultsForGroupExamInputSchema,
	getRecentResultsForLinkExam: GetRecentResultsForLinkExamInputSchema,
	addAccessCodes: AddAccessCodesInputSchema,
	deleteAccessCodes: DeleteAccessCodesInputSchema,
	getAllCategories: GetAllCategoriesInputSchema,
	createParentCategory: CreateParentCategoryInputSchema,
	updateParentCategory: UpdateParentCategoryInputSchema,
	createCategory: CreateCategoryInputSchema,
	updateCategory: UpdateCategoryInputSchema,
	listQuestions: ListQuestionsInputSchema,
	getQuestion: GetQuestionInputSchema,
	createQuestion: CreateQuestionInputSchema,
	updateQuestion: UpdateQuestionInputSchema,
	listUsers: ListUsersInputSchema,
	getUserDetails: GetUserDetailsInputSchema,
	createUser: CreateUserInputSchema,
	deleteUser: DeleteUserInputSchema,
	createGroup: CreateGroupInputSchema,
	deleteGroup: DeleteGroupInputSchema,
	getGroupDetails: GetGroupDetailsInputSchema,
	listTests: ListTestsInputSchema,
	getTestDetails: GetTestDetailsInputSchema,
	deleteTestLink: DeleteTestLinkInputSchema,
	listCertificates: ListCertificatesInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
	deleteApiKey: DeleteApiKeyInputSchema,
	getInitialFinishedAfterTimestamp: GetInitialFinishedAfterTimestampInputSchema,
} as const;

export const ClassmarkerEndpointOutputSchemas = {
	getAllGroupsLinksExams: GetAllGroupsLinksExamsOutputSchema,
	getRecentResultsForAllGroups: GetRecentResultsForAllGroupsOutputSchema,
	getRecentResultsForAllLinks: GetRecentResultsForAllLinksOutputSchema,
	getRecentResultsForGroupExam: GetRecentResultsForGroupExamOutputSchema,
	getRecentResultsForLinkExam: GetRecentResultsForLinkExamOutputSchema,
	addAccessCodes: AccessCodesResponseOutputSchema,
	deleteAccessCodes: AccessCodesResponseOutputSchema,
	getAllCategories: GetAllCategoriesOutputSchema,
	createParentCategory: ParentCategoryMutationOutputSchema,
	updateParentCategory: ParentCategoryMutationOutputSchema,
	createCategory: CategoryMutationOutputSchema,
	updateCategory: CategoryMutationOutputSchema,
	listQuestions: ListQuestionsOutputSchema,
	getQuestion: GetQuestionOutputSchema,
	createQuestion: QuestionMutationOutputSchema,
	updateQuestion: QuestionMutationOutputSchema,
	listUsers: ListUsersOutputSchema,
	getUserDetails: GetUserDetailsOutputSchema,
	createUser: CreateUserOutputSchema,
	deleteUser: DeleteUserOutputSchema,
	createGroup: CreateGroupOutputSchema,
	deleteGroup: DeleteGroupOutputSchema,
	getGroupDetails: GetGroupDetailsOutputSchema,
	listTests: ListTestsOutputSchema,
	getTestDetails: GetTestDetailsOutputSchema,
	deleteTestLink: DeleteTestLinkOutputSchema,
	listCertificates: ListCertificatesOutputSchema,
	listWebhooks: ListWebhooksOutputSchema,
	deleteWebhook: DeleteWebhookOutputSchema,
	deleteApiKey: DeleteApiKeyOutputSchema,
	getInitialFinishedAfterTimestamp:
		GetInitialFinishedAfterTimestampOutputSchema,
} as const;

export type ClassmarkerEndpointInputs = {
	[K in keyof typeof ClassmarkerEndpointInputSchemas]: z.infer<
		(typeof ClassmarkerEndpointInputSchemas)[K]
	>;
};

export type ClassmarkerEndpointOutputs = {
	[K in keyof typeof ClassmarkerEndpointOutputSchemas]: z.infer<
		(typeof ClassmarkerEndpointOutputSchemas)[K]
	>;
};

export type GetAllGroupsLinksExamsInput =
	ClassmarkerEndpointInputs['getAllGroupsLinksExams'];
export type GetRecentResultsForAllGroupsInput =
	ClassmarkerEndpointInputs['getRecentResultsForAllGroups'];
export type GetRecentResultsForAllLinksInput =
	ClassmarkerEndpointInputs['getRecentResultsForAllLinks'];
export type GetRecentResultsForGroupExamInput =
	ClassmarkerEndpointInputs['getRecentResultsForGroupExam'];
export type GetRecentResultsForLinkExamInput =
	ClassmarkerEndpointInputs['getRecentResultsForLinkExam'];
export type AddAccessCodesInput = ClassmarkerEndpointInputs['addAccessCodes'];
export type DeleteAccessCodesInput =
	ClassmarkerEndpointInputs['deleteAccessCodes'];
export type GetAllCategoriesInput =
	ClassmarkerEndpointInputs['getAllCategories'];
export type CreateParentCategoryInput =
	ClassmarkerEndpointInputs['createParentCategory'];
export type UpdateParentCategoryInput =
	ClassmarkerEndpointInputs['updateParentCategory'];
export type CreateCategoryInput = ClassmarkerEndpointInputs['createCategory'];
export type UpdateCategoryInput = ClassmarkerEndpointInputs['updateCategory'];
export type ListQuestionsInput = ClassmarkerEndpointInputs['listQuestions'];
export type GetQuestionInput = ClassmarkerEndpointInputs['getQuestion'];
export type CreateQuestionInput = ClassmarkerEndpointInputs['createQuestion'];
export type UpdateQuestionInput = ClassmarkerEndpointInputs['updateQuestion'];
export type ListUsersInput = ClassmarkerEndpointInputs['listUsers'];
export type GetUserDetailsInput = ClassmarkerEndpointInputs['getUserDetails'];
export type CreateUserInput = ClassmarkerEndpointInputs['createUser'];
export type DeleteUserInput = ClassmarkerEndpointInputs['deleteUser'];
export type CreateGroupInput = ClassmarkerEndpointInputs['createGroup'];
export type DeleteGroupInput = ClassmarkerEndpointInputs['deleteGroup'];
export type GetGroupDetailsInput = ClassmarkerEndpointInputs['getGroupDetails'];
export type ListTestsInput = ClassmarkerEndpointInputs['listTests'];
export type GetTestDetailsInput = ClassmarkerEndpointInputs['getTestDetails'];
export type DeleteTestLinkInput = ClassmarkerEndpointInputs['deleteTestLink'];
export type ListCertificatesInput =
	ClassmarkerEndpointInputs['listCertificates'];
export type ListWebhooksInput = ClassmarkerEndpointInputs['listWebhooks'];
export type DeleteWebhookInput = ClassmarkerEndpointInputs['deleteWebhook'];
export type DeleteApiKeyInput = ClassmarkerEndpointInputs['deleteApiKey'];
export type GetInitialFinishedAfterTimestampInput =
	ClassmarkerEndpointInputs['getInitialFinishedAfterTimestamp'];

export type GetAllGroupsLinksExamsOutput =
	ClassmarkerEndpointOutputs['getAllGroupsLinksExams'];
export type GetRecentResultsForAllGroupsOutput =
	ClassmarkerEndpointOutputs['getRecentResultsForAllGroups'];
export type GetRecentResultsForAllLinksOutput =
	ClassmarkerEndpointOutputs['getRecentResultsForAllLinks'];
export type GetRecentResultsForGroupExamOutput =
	ClassmarkerEndpointOutputs['getRecentResultsForGroupExam'];
export type GetRecentResultsForLinkExamOutput =
	ClassmarkerEndpointOutputs['getRecentResultsForLinkExam'];
export type AccessCodesResponseOutput =
	ClassmarkerEndpointOutputs['addAccessCodes'];
export type GetAllCategoriesOutput =
	ClassmarkerEndpointOutputs['getAllCategories'];
export type ParentCategoryMutationOutput =
	ClassmarkerEndpointOutputs['createParentCategory'];
export type CategoryMutationOutput =
	ClassmarkerEndpointOutputs['createCategory'];
export type ListQuestionsOutput = ClassmarkerEndpointOutputs['listQuestions'];
export type GetQuestionOutput = ClassmarkerEndpointOutputs['getQuestion'];
export type QuestionMutationOutput =
	ClassmarkerEndpointOutputs['createQuestion'];
export type ListUsersOutput = ClassmarkerEndpointOutputs['listUsers'];
export type GetUserDetailsOutput = ClassmarkerEndpointOutputs['getUserDetails'];
export type CreateUserOutput = ClassmarkerEndpointOutputs['createUser'];
export type DeleteUserOutput = ClassmarkerEndpointOutputs['deleteUser'];
export type CreateGroupOutput = ClassmarkerEndpointOutputs['createGroup'];
export type DeleteGroupOutput = ClassmarkerEndpointOutputs['deleteGroup'];
export type GetGroupDetailsOutput =
	ClassmarkerEndpointOutputs['getGroupDetails'];
export type ListTestsOutput = ClassmarkerEndpointOutputs['listTests'];
export type GetTestDetailsOutput = ClassmarkerEndpointOutputs['getTestDetails'];
export type DeleteTestLinkOutput = ClassmarkerEndpointOutputs['deleteTestLink'];
export type ListCertificatesOutput =
	ClassmarkerEndpointOutputs['listCertificates'];
export type ListWebhooksOutput = ClassmarkerEndpointOutputs['listWebhooks'];
export type DeleteWebhookOutput = ClassmarkerEndpointOutputs['deleteWebhook'];
export type DeleteApiKeyOutput = ClassmarkerEndpointOutputs['deleteApiKey'];
export type GetInitialFinishedAfterTimestampOutput =
	ClassmarkerEndpointOutputs['getInitialFinishedAfterTimestamp'];

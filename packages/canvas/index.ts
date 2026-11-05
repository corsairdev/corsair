import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { normalizeCanvasBaseUrl } from './client';
import {
	Accounts,
	AppointmentGroups,
	AssignmentGroups,
	AssignmentOverrides,
	Assignments,
	AuditReports,
	Authentication,
	BlackoutDates,
	Blueprints,
	Bookmarks,
	BrandConfig,
	CalendarEvents,
	CommentBank,
	CommunicationChannels,
	ContentExports,
	ContentMigrations,
	ContentShares,
	Conversations,
	CourseNicknames,
	Courses,
	Discussions,
	Enrollments,
	EPortfolios,
	EpubExports,
	ExternalFeeds,
	ExternalTools,
	FetchData,
	Files,
	GradebookColumns,
	Grading,
	GraphQL,
	GroupCategories,
	GroupDiscussions,
	GroupMemberships,
	Groups,
	LatePolicy,
	Modules,
	OutcomeGroups,
	Outcomes,
	Pages,
	PeerReviews,
	Planner,
	Polls,
	QuizReports,
	Quizzes,
	Rubrics,
	Submissions,
	UserCustomData,
	UserInboxLabels,
	Users,
	UserTokens,
} from './endpoints';
import type {
	CanvasOperation,
	CanvasOperationName,
} from './endpoints/operations';
import { canvasOperations } from './endpoints/operations';
import type {
	CanvasEndpointInputs,
	CanvasEndpointOutputs,
} from './endpoints/types';
import {
	CanvasEndpointInputSchemas,
	CanvasEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CanvasSchema } from './schema';
import { CanvasWebhookHandlers } from './webhooks';
import { resolveCanvasOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCanvasTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AssignmentGradedEvent,
	CanvasWebhookOutputs,
	NewAssignmentSubmissionEvent,
	NewCourseCreatedEvent,
	NewDiscussionMessageEvent,
	NewDiscussionTopicEvent,
	NewFileUploadedEvent,
} from './webhooks/types';
import {
	AssignmentGradedEventSchema,
	NewAssignmentSubmissionEventSchema,
	NewCourseCreatedEventSchema,
	NewDiscussionMessageEventSchema,
	NewDiscussionTopicEventSchema,
	NewFileUploadedEventSchema,
} from './webhooks/types';

export const canvasAuthConfig = {
	api_key: {
		account: ['base_url'] as const,
	},
	oauth_2: {
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type CanvasPluginOptions = {
	/** Canvas LMS integration for Corsair */
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	/** Base URL for the Canvas LMS instance (e.g. https://myschool.instructure.com) */
	baseUrl?: string;
	webhookSecret?: string;
	hooks?: InternalCanvasPlugin['hooks'];
	webhookHooks?: InternalCanvasPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof canvasEndpointsNested>;
};

export type CanvasContext = CorsairPluginContext<
	typeof CanvasSchema,
	CanvasPluginOptions,
	undefined,
	typeof canvasAuthConfig
>;

export type CanvasKeyBuilderContext = KeyBuilderContext<
	CanvasPluginOptions,
	typeof canvasAuthConfig
>;

export type CanvasBoundEndpoints = BindEndpoints<typeof canvasEndpointsNested>;

type CanvasEndpoint<K extends keyof CanvasEndpointOutputs> = CorsairEndpoint<
	CanvasContext,
	CanvasEndpointInputs[K],
	CanvasEndpointOutputs[K]
>;

export type CanvasEndpoints = {
	[K in CanvasOperationName]: CanvasEndpoint<K>;
};

type CanvasWebhook<
	K extends keyof CanvasWebhookOutputs,
	TEvent,
> = CorsairWebhook<CanvasContext, TEvent, CanvasWebhookOutputs[K]>;

export type CanvasWebhooks = {
	assignmentGraded: CanvasWebhook<'assignmentGraded', AssignmentGradedEvent>;
	newAssignmentSubmission: CanvasWebhook<
		'newAssignmentSubmission',
		NewAssignmentSubmissionEvent
	>;
	newDiscussionMessage: CanvasWebhook<
		'newDiscussionMessage',
		NewDiscussionMessageEvent
	>;
	newDiscussionTopic: CanvasWebhook<
		'newDiscussionTopic',
		NewDiscussionTopicEvent
	>;
	newFileUploaded: CanvasWebhook<'newFileUploaded', NewFileUploadedEvent>;
	newCourseCreated: CanvasWebhook<'newCourseCreated', NewCourseCreatedEvent>;
};

export type CanvasBoundWebhooks = BindWebhooks<CanvasWebhooks>;

const canvasEndpointsNested = {
	courses: {
		createCourse: Courses.createCourse,
		getSingleCourse: Courses.getSingleCourse,
		getAccountCourse: Courses.getAccountCourse,
		getCoursePermissions: Courses.getCoursePermissions,
		getCourseLevelParticipationData: Courses.getCourseLevelParticipationData,
		addCourseToFavorites: Courses.addCourseToFavorites,
	},
	accounts: {
		getSingleAccount: Accounts.getSingleAccount,
		getAccountsThatUsersCanCreateCoursesIn:
			Accounts.getAccountsThatUsersCanCreateCoursesIn,
		getAccountHelpLinks: Accounts.getAccountHelpLinks,
		getAccountGraphQl: Accounts.getAccountGraphQl,
		getAccountNotifications: Accounts.getAccountNotifications,
		createAccountNotification: Accounts.createAccountNotification,
		closeNotificationForUser: Accounts.closeNotificationForUser,
	},
	users: {
		getCurrentUser: Users.getCurrentUser,
		getSingleUser: Users.getSingleUser,
		getUserProfile: Users.getUserProfile,
		editUser: Users.editUser,
		getAllUsers: Users.getAllUsers,
		getUserAvatars: Users.getUserAvatars,
		getCustomColors: Users.getCustomColors,
		getCustomColor: Users.getCustomColor,
		getDashboardPositions: Users.getDashboardPositions,
	},
	userTokens: {
		createUsersTokens: UserTokens.createUsersTokens,
		getUsersTokens: UserTokens.getUsersTokens,
		deleteAccessToken: UserTokens.deleteAccessToken,
	},
	userCustomData: {
		createUsersCustomData: UserCustomData.createUsersCustomData,
		getUsersCustomDataScope: UserCustomData.getUsersCustomDataScope,
		deleteCustomData: UserCustomData.deleteCustomData,
		deleteUsersCustomDataScope: UserCustomData.deleteUsersCustomDataScope,
	},
	userInboxLabels: {
		createUserInboxLabel: UserInboxLabels.createUserInboxLabel,
		deleteUserInboxLabel: UserInboxLabels.deleteUserInboxLabel,
	},
	enrollments: {
		createEnrollment: Enrollments.createEnrollment,
		concludeDeactivateOrDeleteEnrollment:
			Enrollments.concludeDeactivateOrDeleteEnrollment,
		getEnrollmentInvitations: Enrollments.getEnrollmentInvitations,
		addLastAttendedDate: Enrollments.addLastAttendedDate,
	},
	assignments: {
		createAssignment: Assignments.createAssignment,
		getAssignment: Assignments.getAssignment,
		getAssignment2: Assignments.getAssignment2,
		editAssignment: Assignments.editAssignment,
		deleteAssignment: Assignments.deleteAssignment,
		getAllAssignments: Assignments.getAllAssignments,
		createAssignmentGraphQl: Assignments.createAssignmentGraphQl,
		getSubmissionSummary: Assignments.getSubmissionSummary,
	},
	assignmentGroups: {
		createAssignmentGroup: AssignmentGroups.createAssignmentGroup,
		getAnAssignmentGroup: AssignmentGroups.getAnAssignmentGroup,
		getAssignmentGroup: AssignmentGroups.getAssignmentGroup,
	},
	assignmentOverrides: {
		createAssignmentOverride: AssignmentOverrides.createAssignmentOverride,
		getSingleAssignmentOverride:
			AssignmentOverrides.getSingleAssignmentOverride,
		deleteAssignmentOverride: AssignmentOverrides.deleteAssignmentOverride,
		createBatchOverridesInACourse:
			AssignmentOverrides.createBatchOverridesInACourse,
		getCourses12Assignments: AssignmentOverrides.getCourses12Assignments,
	},
	rubrics: {
		getAssignmentRubric: Rubrics.getAssignmentRubric,
		createRubric: Rubrics.createRubric,
		getRubricAssessmentsReadState: Rubrics.getRubricAssessmentsReadState,
		getRubricsUploadTemplate: Rubrics.getRubricsUploadTemplate,
	},
	submissions: {
		createSubmissionDraft: Submissions.createSubmissionDraft,
		deleteSubmissionDraft: Submissions.deleteSubmissionDraft,
		getAUsersMostRecentlyGraded: Submissions.getAUsersMostRecentlyGraded,
	},
	peerReviews: {
		getAllPeerReviews: PeerReviews.getAllPeerReviews,
		getAllPeerReviewsForSectionAssignment:
			PeerReviews.getAllPeerReviewsForSectionAssignment,
		getAllPeerReviewsForSectionSubmission:
			PeerReviews.getAllPeerReviewsForSectionSubmission,
	},
	modules: {
		createModule: Modules.createModule,
		createModuleGraphQl: Modules.createModuleGraphQl,
		createModuleItem: Modules.createModuleItem,
		getModuleItem: Modules.getModuleItem,
		getModuleItemSequence: Modules.getModuleItemSequence,
	},
	pages: {
		createPageForCourse: Pages.createPageForCourse,
		getPageForCourse: Pages.getPageForCourse,
		createPageForGroup: Pages.createPageForGroup,
		deletePageForGroup: Pages.deletePageForGroup,
	},
	discussions: {
		createDiscussionTopic: Discussions.createDiscussionTopic,
		createDiscussionTopicGraphQl: Discussions.createDiscussionTopicGraphQl,
		getSingleTopic: Discussions.getSingleTopic,
		createDiscussionEntry: Discussions.createDiscussionEntry,
		createDiscussionEntryGraphQl: Discussions.createDiscussionEntryGraphQl,
		deleteAnEntry: Discussions.deleteAnEntry,
		deleteDiscussionEntry: Discussions.deleteDiscussionEntry,
		deleteDiscussionTopicGraphQl: Discussions.deleteDiscussionTopicGraphQl,
	},
	groupDiscussions: {
		createGroupDiscussionTopic: GroupDiscussions.createGroupDiscussionTopic,
		getSingleTopic2: GroupDiscussions.getSingleTopic2,
		getFullTopicGroups: GroupDiscussions.getFullTopicGroups,
		deleteAnEntry2: GroupDiscussions.deleteAnEntry2,
		deleteGroupDiscussionTopic: GroupDiscussions.deleteGroupDiscussionTopic,
		duplicateGroupDiscussionTopic:
			GroupDiscussions.duplicateGroupDiscussionTopic,
	},
	quizzes: {
		createQuiz: Quizzes.createQuiz,
		getSingleQuiz: Quizzes.getSingleQuiz,
		editQuiz: Quizzes.editQuiz,
		deleteQuiz: Quizzes.deleteQuiz,
		createQuizQuestion: Quizzes.createQuizQuestion,
		createQuestionGroup: Quizzes.createQuestionGroup,
		createQuizSubmission: Quizzes.createQuizSubmission,
		answerQuizQuestions: Quizzes.answerQuizQuestions,
		getQuizStatistics: Quizzes.getQuizStatistics,
	},
	quizReports: {
		createQuizReport: QuizReports.createQuizReport,
		getQuizReport: QuizReports.getQuizReport,
		abortQuizReportGeneration: QuizReports.abortQuizReportGeneration,
	},
	calendarEvents: {
		createCalendarEvent: CalendarEvents.createCalendarEvent,
		deleteCalendarEvent: CalendarEvents.deleteCalendarEvent,
		createOrUpdateTimetableEvents: CalendarEvents.createOrUpdateTimetableEvents,
	},
	appointmentGroups: {
		createAppointmentGroup: AppointmentGroups.createAppointmentGroup,
		deleteAppointmentGroup: AppointmentGroups.deleteAppointmentGroup,
	},
	conversations: {
		createConversation: Conversations.createConversation,
		createConversationGraphQl: Conversations.createConversationGraphQl,
		getSingleConversation: Conversations.getSingleConversation,
		editConversation: Conversations.editConversation,
		deleteConversations: Conversations.deleteConversations,
		deleteConversationMessages: Conversations.deleteConversationMessages,
		addConversationMessage: Conversations.addConversationMessage,
		addRecipientsToConversation: Conversations.addRecipientsToConversation,
		getUnreadCount: Conversations.getUnreadCount,
		findRecipients: Conversations.findRecipients,
	},
	bookmarks: {
		createBookmark: Bookmarks.createBookmark,
		getBookmark: Bookmarks.getBookmark,
		deleteBookmark: Bookmarks.deleteBookmark,
	},
	files: {
		createFiles: Files.createFiles,
		copyFileToFolder: Files.copyFileToFolder,
		deleteFile: Files.deleteFile,
		getFolderById: Files.getFolderById,
		createFolder: Files.createFolder,
		createFolderInGroup: Files.createFolderInGroup,
		copyFolder: Files.copyFolder,
		deleteFolder: Files.deleteFolder,
		getGroupFolder: Files.getGroupFolder,
		getQuotaInformation: Files.getQuotaInformation,
	},
	groups: {
		createGroup: Groups.createGroup,
		getGroup: Groups.getGroup,
		deleteGroup: Groups.deleteGroup,
		addGroupToFavorites: Groups.addGroupToFavorites,
		getGroupPermissions: Groups.getGroupPermissions,
		getGroupActivityStreamSummary: Groups.getGroupActivityStreamSummary,
	},
	groupCategories: {
		createGroupCategoryCourses: GroupCategories.createGroupCategoryCourses,
		createGroupSet: GroupCategories.createGroupSet,
		createGroupInSet: GroupCategories.createGroupInSet,
		assignUnassignedMembersToGroupCategory:
			GroupCategories.assignUnassignedMembersToGroupCategory,
	},
	groupMemberships: {
		createMembership: GroupMemberships.createMembership,
		getASingleGroupMembership: GroupMemberships.getASingleGroupMembership,
		getASingleGroupMembership2: GroupMemberships.getASingleGroupMembership2,
	},
	grading: {
		createCourseGradingStandard: Grading.createCourseGradingStandard,
		getSingleGradingStandardIn2: Grading.getSingleGradingStandardIn2,
		deleteCustomGradeStatus: Grading.deleteCustomGradeStatus,
	},
	gradebookColumns: {
		createCustomGradebookColumn: GradebookColumns.createCustomGradebookColumn,
		deleteCustomGradebookColumn: GradebookColumns.deleteCustomGradebookColumn,
		updateCustomGradebookColumnData:
			GradebookColumns.updateCustomGradebookColumnData,
	},
	commentBank: {
		deleteCommentBankItem: CommentBank.deleteCommentBankItem,
	},
	latePolicy: {
		getALatePolicy: LatePolicy.getALatePolicy,
	},
	externalTools: {
		createExternalTool: ExternalTools.createExternalTool,
		createExternalToolInCourse: ExternalTools.createExternalToolInCourse,
		getSingleExternalTool: ExternalTools.getSingleExternalTool,
		getASingleExternalTool2: ExternalTools.getASingleExternalTool2,
		deleteAnExternalTool: ExternalTools.deleteAnExternalTool,
		createLtiResourceLink: ExternalTools.createLtiResourceLink,
	},
	externalFeeds: {
		createExternalFeed: ExternalFeeds.createExternalFeed,
		createExternalFeedForGroup: ExternalFeeds.createExternalFeedForGroup,
		deleteExternalFeedFromGroup: ExternalFeeds.deleteExternalFeedFromGroup,
	},
	planner: {
		createPlannerNote: Planner.createPlannerNote,
		deletePlannerNote: Planner.deletePlannerNote,
		createPlannerOverride: Planner.createPlannerOverride,
		deletePlannerOverride: Planner.deletePlannerOverride,
	},
	communicationChannels: {
		createCommunicationChannel:
			CommunicationChannels.createCommunicationChannel,
		deleteCommunicationChannel:
			CommunicationChannels.deleteCommunicationChannel,
		deleteCommunicationChannelByTypeAndAddress:
			CommunicationChannels.deleteCommunicationChannelByTypeAndAddress,
	},
	contentShares: {
		createContentShare: ContentShares.createContentShare,
		getContentShare: ContentShares.getContentShare,
		addUsersToContentShare: ContentShares.addUsersToContentShare,
		getContentSharesUnreadCount: ContentShares.getContentSharesUnreadCount,
	},
	contentMigrations: {
		createGroupContentMigration: ContentMigrations.createGroupContentMigration,
		getAContentMigration3: ContentMigrations.getAContentMigration3,
		createAContentMigration4: ContentMigrations.createAContentMigration4,
		getAContentMigration4: ContentMigrations.getAContentMigration4,
	},
	contentExports: {
		exportContent: ContentExports.exportContent,
		exportGroupContent: ContentExports.exportGroupContent,
		exportUserContent: ContentExports.exportUserContent,
	},
	outcomes: {
		createLearningOutcome: Outcomes.createLearningOutcome,
		getOutcomeResults: Outcomes.getOutcomeResults,
		getAlignedAssignmentsForAnOutcome:
			Outcomes.getAlignedAssignmentsForAnOutcome,
		deleteOutcomeLinks: Outcomes.deleteOutcomeLinks,
	},
	outcomeGroups: {
		getAllOutcomeGroupsForContext: OutcomeGroups.getAllOutcomeGroupsForContext,
		getAllOutcomeGroupsForContext2:
			OutcomeGroups.getAllOutcomeGroupsForContext2,
		getAllOutcomeLinksForContext: OutcomeGroups.getAllOutcomeLinksForContext,
		getAllOutcomeLinksForContext2: OutcomeGroups.getAllOutcomeLinksForContext2,
		getGlobalOutcomeGroup: OutcomeGroups.getGlobalOutcomeGroup,
		getRootOutcomeGroupForCourse: OutcomeGroups.getRootOutcomeGroupForCourse,
		getAccountsOutcomeGroups: OutcomeGroups.getAccountsOutcomeGroups,
		createSubgroupCourses: OutcomeGroups.createSubgroupCourses,
		deleteAnOutcomeGroupCourses: OutcomeGroups.deleteAnOutcomeGroupCourses,
		createLinkOutcomeCourses: OutcomeGroups.createLinkOutcomeCourses,
	},
	polls: {
		createSinglePoll: Polls.createSinglePoll,
		getSinglePoll: Polls.getSinglePoll,
		deletePoll: Polls.deletePoll,
		createSinglePollChoice: Polls.createSinglePollChoice,
		getSinglePollChoice: Polls.getSinglePollChoice,
		deletePollChoice: Polls.deletePollChoice,
		createSinglePollSession: Polls.createSinglePollSession,
		deletePollSession: Polls.deletePollSession,
		createSinglePollSubmission: Polls.createSinglePollSubmission,
	},
	blackoutDates: {
		createBlackoutDateForCourse: BlackoutDates.createBlackoutDateForCourse,
		deleteBlackoutDate: BlackoutDates.deleteBlackoutDate,
	},
	ePortfolios: {
		getAllEPortfoliosForUser: EPortfolios.getAllEPortfoliosForUser,
	},
	epubExports: {
		createEpubExport: EpubExports.createEpubExport,
	},
	courseNicknames: {
		clearCourseNicknames: CourseNicknames.clearCourseNicknames,
	},
	authentication: {
		getAuthenticationProvider: Authentication.getAuthenticationProvider,
	},
	blueprints: {
		getCoursesBlueprint: Blueprints.getCoursesBlueprint,
	},
	brandConfig: {
		getBrandVariables: BrandConfig.getBrandVariables,
		getKalturaConfig: BrandConfig.getKalturaConfig,
		getInternalSettings: BrandConfig.getInternalSettings,
	},
	auditReports: {
		getAuditLogs: AuditReports.getAuditLogs,
		getStatusOfLastReport: AuditReports.getStatusOfLastReport,
	},
	fetchData: {
		fetchData: FetchData.fetchData,
	},
	graphql: {
		getLegacyNode: GraphQL.getLegacyNode,
	},
} as const;

const canvasWebhooksNested = {
	triggers: {
		assignmentGraded: CanvasWebhookHandlers.assignmentGraded,
		newAssignmentSubmission: CanvasWebhookHandlers.newAssignmentSubmission,
		newDiscussionMessage: CanvasWebhookHandlers.newDiscussionMessage,
		newDiscussionTopic: CanvasWebhookHandlers.newDiscussionTopic,
		newFileUploaded: CanvasWebhookHandlers.newFileUploaded,
		newCourseCreated: CanvasWebhookHandlers.newCourseCreated,
	},
} as const;

// ── Helper: build endpoint schemas from operations ─────────────────────────
function buildEndpointSchemas() {
	const schemas: Record<string, { input: unknown; output: unknown }> = {};
	for (const [groupKey, group] of Object.entries(canvasEndpointsNested)) {
		for (const endpointKey of Object.keys(group as Record<string, unknown>)) {
			const dotKey = `${groupKey}.${endpointKey}`;
			schemas[dotKey] = {
				input:
					CanvasEndpointInputSchemas[
						endpointKey as keyof typeof CanvasEndpointInputSchemas
					],
				output:
					CanvasEndpointOutputSchemas[
						endpointKey as keyof typeof CanvasEndpointOutputSchemas
					],
			};
		}
	}
	return schemas;
}

export const canvasEndpointSchemas =
	buildEndpointSchemas() as unknown as RequiredPluginEndpointSchemas<
		typeof canvasEndpointsNested
	>;

const canvasWebhookSchemas = {
	'triggers.assignmentGraded': {
		description: 'Canvas Live Event when an assignment grade changes',
		payload: AssignmentGradedEventSchema,
		response: AssignmentGradedEventSchema,
	},
	'triggers.newAssignmentSubmission': {
		description:
			'Canvas Live Event when a new assignment submission is created',
		payload: NewAssignmentSubmissionEventSchema,
		response: NewAssignmentSubmissionEventSchema,
	},
	'triggers.newDiscussionMessage': {
		description: 'Canvas Live Event when a discussion entry is created',
		payload: NewDiscussionMessageEventSchema,
		response: NewDiscussionMessageEventSchema,
	},
	'triggers.newDiscussionTopic': {
		description: 'Canvas Live Event when a discussion topic is created',
		payload: NewDiscussionTopicEventSchema,
		response: NewDiscussionTopicEventSchema,
	},
	'triggers.newFileUploaded': {
		description: 'Canvas Live Event when a file attachment is created',
		payload: NewFileUploadedEventSchema,
		response: NewFileUploadedEventSchema,
	},
	'triggers.newCourseCreated': {
		description: 'Canvas Live Event when a course is created',
		payload: NewCourseCreatedEventSchema,
		response: NewCourseCreatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof canvasWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// ── Helper: build endpoint meta from operations ───────────────────────────
function buildEndpointMeta() {
	const meta: Record<string, { riskLevel: string; description: string }> = {};
	for (const [groupKey, group] of Object.entries(canvasEndpointsNested)) {
		for (const endpointKey of Object.keys(group as Record<string, unknown>)) {
			const dotKey = `${groupKey}.${endpointKey}`;
			const op = canvasOperations[
				endpointKey as CanvasOperationName
			] as CanvasOperation;
			const method: string = op.method;
			let riskLevel: 'read' | 'write' | 'destructive' = 'read';
			if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
				riskLevel = 'write';
			} else if (method === 'DELETE') {
				riskLevel = 'destructive';
			}
			meta[dotKey] = {
				riskLevel: op.riskLevel ?? riskLevel,
				description: op.description,
			};
		}
	}
	return meta;
}

const canvasEndpointMeta =
	buildEndpointMeta() as unknown as RequiredPluginEndpointMeta<
		typeof canvasEndpointsNested
	>;

export type BaseCanvasPlugin<T extends CanvasPluginOptions> = CorsairPlugin<
	'canvas',
	typeof CanvasSchema,
	typeof canvasEndpointsNested,
	typeof canvasWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof canvasAuthConfig
>;

export type InternalCanvasPlugin = BaseCanvasPlugin<CanvasPluginOptions>;

export type ExternalCanvasPlugin<T extends CanvasPluginOptions> =
	BaseCanvasPlugin<T>;

export function canvas<const T extends CanvasPluginOptions>(
	incomingOptions: CanvasPluginOptions & T = {} as CanvasPluginOptions & T,
): ExternalCanvasPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const baseUrl = options.baseUrl
		? normalizeCanvasBaseUrl(options.baseUrl)
		: undefined;

	// OAuthConfig is static strings — framework cannot resolve per-tenant hosts.
	if (options.authType === 'oauth_2' && !baseUrl) {
		throw new Error('[canvas] options.baseUrl is required for oauth_2');
	}

	return {
		id: 'canvas',
		authConfig: canvasAuthConfig,
		...(baseUrl
			? {
					oauthConfig: {
						providerName: 'Canvas LMS',
						authUrl: `${baseUrl}/login/oauth2/auth`,
						tokenUrl: `${baseUrl}/login/oauth2/token`,
						scopes: ['url:GET|/api/v1/users/self', 'url:GET|/api/v1/courses'],
						tokenAuthMethod: 'body' as const,
						requiresRegisteredRedirect: true,
					},
				}
			: {}),
		schema: CanvasSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: canvasEndpointsNested,
		webhooks: canvasWebhooksNested,
		endpointMeta: canvasEndpointMeta satisfies RequiredPluginEndpointMeta<
			typeof canvasEndpointsNested
		>,
		endpointSchemas: canvasEndpointSchemas,
		webhookSchemas: canvasWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'x-canvas-signature' in headers || 'x-instructure-webhook' in headers
			);
		},
		pluginTenantWebhookMatcher: matchCanvasTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCanvasOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CanvasKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('canvas', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('canvas', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('canvas', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('canvas', 'api_key');
		},
	} satisfies InternalCanvasPlugin;
}

export type { CanvasRoute } from './endpoints/routes';
export { canvasRoutes, getCanvasRoute } from './endpoints/routes';
export type {
	CanvasAccount,
	CanvasAssignment,
	CanvasConversation,
	CanvasCourse,
	CanvasDiscussionTopic,
	CanvasEndpointInputs,
	CanvasEndpointOutputs,
	CanvasEnrollment,
	CanvasEntity,
	CanvasFile,
	CanvasGraphqlResponse,
	CanvasGroup,
	CanvasModule,
	CanvasPage,
	CanvasPermissions,
	CanvasQuiz,
	CanvasRequestInput,
	CanvasResponse,
	CanvasUnreadCount,
	CanvasUser,
} from './endpoints/types';
export type { CanvasWebhookOutputs } from './webhooks/types';

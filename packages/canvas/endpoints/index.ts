import { createCanvasEndpoint } from './factory';
import type { CanvasOperationName } from './operations';

function defineGroup<const Names extends readonly CanvasOperationName[]>(
	group: string,
	names: Names,
): { [K in Names[number]]: ReturnType<typeof createCanvasEndpoint<K>> } {
	return Object.fromEntries(
		names.map((name) => [
			name,
			createCanvasEndpoint(name, `canvas.${group}.${name}`),
		]),
	) as { [K in Names[number]]: ReturnType<typeof createCanvasEndpoint<K>> };
}

// ── Courses ────────────────────────────────────────────────────────────────
export const Courses = defineGroup('courses', [
	'createCourse',
	'getSingleCourse',
	'getAccountCourse',
	'getCoursePermissions',
	'getCourseLevelParticipationData',
	'addCourseToFavorites',
] as const);

// ── Accounts ───────────────────────────────────────────────────────────────
export const Accounts = defineGroup('accounts', [
	'getSingleAccount',
	'getAccountsThatUsersCanCreateCoursesIn',
	'getAccountHelpLinks',
	'getAccountGraphQl',
	'getAccountNotifications',
	'createAccountNotification',
	'closeNotificationForUser',
] as const);

// ── Users ──────────────────────────────────────────────────────────────────
export const Users = defineGroup('users', [
	'getCurrentUser',
	'getSingleUser',
	'getUserProfile',
	'editUser',
	'getAllUsers',
	'getUserAvatars',
	'getCustomColors',
	'getCustomColor',
	'getDashboardPositions',
] as const);

// ── User Tokens ────────────────────────────────────────────────────────────
export const UserTokens = defineGroup('userTokens', [
	'createUsersTokens',
	'getUsersTokens',
	'deleteAccessToken',
] as const);

// ── User Custom Data ───────────────────────────────────────────────────────
export const UserCustomData = defineGroup('userCustomData', [
	'createUsersCustomData',
	'getUsersCustomDataScope',
	'deleteCustomData',
	'deleteUsersCustomDataScope',
] as const);

// ── User Inbox Labels ──────────────────────────────────────────────────────
export const UserInboxLabels = defineGroup('userInboxLabels', [
	'createUserInboxLabel',
	'deleteUserInboxLabel',
] as const);

// ── Enrollments ────────────────────────────────────────────────────────────
export const Enrollments = defineGroup('enrollments', [
	'createEnrollment',
	'concludeDeactivateOrDeleteEnrollment',
	'getEnrollmentInvitations',
	'addLastAttendedDate',
] as const);

// ── Assignments ────────────────────────────────────────────────────────────
export const Assignments = defineGroup('assignments', [
	'createAssignment',
	'getAssignment',
	'getAssignment2',
	'editAssignment',
	'deleteAssignment',
	'getAllAssignments',
	'createAssignmentGraphQl',
	'getSubmissionSummary',
] as const);

// ── Assignment Groups ──────────────────────────────────────────────────────
export const AssignmentGroups = defineGroup('assignmentGroups', [
	'createAssignmentGroup',
	'getAnAssignmentGroup',
	'getAssignmentGroup',
] as const);

// ── Assignment Overrides ───────────────────────────────────────────────────
export const AssignmentOverrides = defineGroup('assignmentOverrides', [
	'createAssignmentOverride',
	'getSingleAssignmentOverride',
	'deleteAssignmentOverride',
	'createBatchOverridesInACourse',
	'getCourses12Assignments',
] as const);

// ── Rubrics ────────────────────────────────────────────────────────────────
export const Rubrics = defineGroup('rubrics', [
	'getAssignmentRubric',
	'createRubric',
	'getRubricAssessmentsReadState',
	'getRubricsUploadTemplate',
] as const);

// ── Submissions ────────────────────────────────────────────────────────────
export const Submissions = defineGroup('submissions', [
	'createSubmissionDraft',
	'deleteSubmissionDraft',
	'getAUsersMostRecentlyGraded',
] as const);

// ── Peer Reviews ───────────────────────────────────────────────────────────
export const PeerReviews = defineGroup('peerReviews', [
	'getAllPeerReviews',
	'getAllPeerReviewsForSectionAssignment',
	'getAllPeerReviewsForSectionSubmission',
] as const);

// ── Modules ────────────────────────────────────────────────────────────────
export const Modules = defineGroup('modules', [
	'createModule',
	'createModuleGraphQl',
	'createModuleItem',
	'getModuleItem',
	'getModuleItemSequence',
] as const);

// ── Pages ──────────────────────────────────────────────────────────────────
export const Pages = defineGroup('pages', [
	'createPageForCourse',
	'getPageForCourse',
	'createPageForGroup',
	'deletePageForGroup',
] as const);

// ── Discussions ────────────────────────────────────────────────────────────
export const Discussions = defineGroup('discussions', [
	'createDiscussionTopic',
	'createDiscussionTopicGraphQl',
	'getSingleTopic',
	'createDiscussionEntry',
	'createDiscussionEntryGraphQl',
	'deleteAnEntry',
	'deleteDiscussionEntry',
	'deleteDiscussionTopicGraphQl',
] as const);

// ── Group Discussions ──────────────────────────────────────────────────────
export const GroupDiscussions = defineGroup('groupDiscussions', [
	'createGroupDiscussionTopic',
	'getSingleTopic2',
	'getFullTopicGroups',
	'deleteAnEntry2',
	'deleteGroupDiscussionTopic',
	'duplicateGroupDiscussionTopic',
] as const);

// ── Quizzes ────────────────────────────────────────────────────────────────
export const Quizzes = defineGroup('quizzes', [
	'createQuiz',
	'getSingleQuiz',
	'editQuiz',
	'deleteQuiz',
	'createQuizQuestion',
	'createQuestionGroup',
	'createQuizSubmission',
	'answerQuizQuestions',
	'getQuizStatistics',
] as const);

// ── Quiz Reports ───────────────────────────────────────────────────────────
export const QuizReports = defineGroup('quizReports', [
	'createQuizReport',
	'getQuizReport',
	'abortQuizReportGeneration',
] as const);

// ── Calendar Events ────────────────────────────────────────────────────────
export const CalendarEvents = defineGroup('calendarEvents', [
	'createCalendarEvent',
	'deleteCalendarEvent',
	'createOrUpdateTimetableEvents',
] as const);

// ── Appointment Groups ─────────────────────────────────────────────────────
export const AppointmentGroups = defineGroup('appointmentGroups', [
	'createAppointmentGroup',
	'deleteAppointmentGroup',
] as const);

// ── Conversations ──────────────────────────────────────────────────────────
export const Conversations = defineGroup('conversations', [
	'createConversation',
	'createConversationGraphQl',
	'getSingleConversation',
	'editConversation',
	'deleteConversations',
	'deleteConversationMessages',
	'addConversationMessage',
	'addRecipientsToConversation',
	'getUnreadCount',
	'findRecipients',
] as const);

// ── Bookmarks ──────────────────────────────────────────────────────────────
export const Bookmarks = defineGroup('bookmarks', [
	'createBookmark',
	'getBookmark',
	'deleteBookmark',
] as const);

// ── Files & Folders ────────────────────────────────────────────────────────
export const Files = defineGroup('files', [
	'createFiles',
	'copyFileToFolder',
	'deleteFile',
	'getFolderById',
	'createFolder',
	'createFolderInGroup',
	'copyFolder',
	'deleteFolder',
	'getGroupFolder',
	'getQuotaInformation',
] as const);

// ── Groups ─────────────────────────────────────────────────────────────────
export const Groups = defineGroup('groups', [
	'createGroup',
	'getGroup',
	'deleteGroup',
	'addGroupToFavorites',
	'getGroupPermissions',
	'getGroupActivityStreamSummary',
] as const);

// ── Group Categories ───────────────────────────────────────────────────────
export const GroupCategories = defineGroup('groupCategories', [
	'createGroupCategoryCourses',
	'createGroupSet',
	'createGroupInSet',
	'assignUnassignedMembersToGroupCategory',
] as const);

// ── Group Memberships ──────────────────────────────────────────────────────
export const GroupMemberships = defineGroup('groupMemberships', [
	'createMembership',
	'getASingleGroupMembership',
	'getASingleGroupMembership2',
] as const);

// ── Grading ────────────────────────────────────────────────────────────────
export const Grading = defineGroup('grading', [
	'createCourseGradingStandard',
	'getSingleGradingStandardIn2',
	'deleteCustomGradeStatus',
] as const);

// ── Gradebook Columns ──────────────────────────────────────────────────────
export const GradebookColumns = defineGroup('gradebookColumns', [
	'createCustomGradebookColumn',
	'deleteCustomGradebookColumn',
	'updateCustomGradebookColumnData',
] as const);

// ── Comment Bank ───────────────────────────────────────────────────────────
export const CommentBank = defineGroup('commentBank', [
	'deleteCommentBankItem',
] as const);

// ── Late Policy ────────────────────────────────────────────────────────────
export const LatePolicy = defineGroup('latePolicy', [
	'getALatePolicy',
] as const);

// ── External Tools ─────────────────────────────────────────────────────────
export const ExternalTools = defineGroup('externalTools', [
	'createExternalTool',
	'createExternalToolInCourse',
	'getSingleExternalTool',
	'getASingleExternalTool2',
	'deleteAnExternalTool',
	'createLtiResourceLink',
] as const);

// ── External Feeds ─────────────────────────────────────────────────────────
export const ExternalFeeds = defineGroup('externalFeeds', [
	'createExternalFeed',
	'createExternalFeedForGroup',
	'deleteExternalFeedFromGroup',
] as const);

// ── Planner ────────────────────────────────────────────────────────────────
export const Planner = defineGroup('planner', [
	'createPlannerNote',
	'deletePlannerNote',
	'createPlannerOverride',
	'deletePlannerOverride',
] as const);

// ── Communication Channels ─────────────────────────────────────────────────
export const CommunicationChannels = defineGroup('communicationChannels', [
	'createCommunicationChannel',
	'deleteCommunicationChannel',
	'deleteCommunicationChannelByTypeAndAddress',
] as const);

// ── Content Shares ─────────────────────────────────────────────────────────
export const ContentShares = defineGroup('contentShares', [
	'createContentShare',
	'getContentShare',
	'addUsersToContentShare',
	'getContentSharesUnreadCount',
] as const);

// ── Content Migrations ─────────────────────────────────────────────────────
export const ContentMigrations = defineGroup('contentMigrations', [
	'createGroupContentMigration',
	'getAContentMigration3',
	'createAContentMigration4',
	'getAContentMigration4',
] as const);

// ── Content Exports ────────────────────────────────────────────────────────
export const ContentExports = defineGroup('contentExports', [
	'exportContent',
	'exportGroupContent',
	'exportUserContent',
] as const);

// ── Outcomes ───────────────────────────────────────────────────────────────
export const Outcomes = defineGroup('outcomes', [
	'createLearningOutcome',
	'getOutcomeResults',
	'getAlignedAssignmentsForAnOutcome',
	'deleteOutcomeLinks',
] as const);

// ── Outcome Groups ─────────────────────────────────────────────────────────
export const OutcomeGroups = defineGroup('outcomeGroups', [
	'getAllOutcomeGroupsForContext',
	'getAllOutcomeGroupsForContext2',
	'getAllOutcomeLinksForContext',
	'getAllOutcomeLinksForContext2',
	'getGlobalOutcomeGroup',
	'getRootOutcomeGroupForCourse',
	'getAccountsOutcomeGroups',
	'createSubgroupCourses',
	'deleteAnOutcomeGroupCourses',
	'createLinkOutcomeCourses',
] as const);

// ── Polls ──────────────────────────────────────────────────────────────────
export const Polls = defineGroup('polls', [
	'createSinglePoll',
	'getSinglePoll',
	'deletePoll',
	'createSinglePollChoice',
	'getSinglePollChoice',
	'deletePollChoice',
	'createSinglePollSession',
	'deletePollSession',
	'createSinglePollSubmission',
] as const);

// ── Blackout Dates ─────────────────────────────────────────────────────────
export const BlackoutDates = defineGroup('blackoutDates', [
	'createBlackoutDateForCourse',
	'deleteBlackoutDate',
] as const);

// ── ePortfolios ────────────────────────────────────────────────────────────
export const EPortfolios = defineGroup('ePortfolios', [
	'getAllEPortfoliosForUser',
] as const);

// ── ePub Exports ───────────────────────────────────────────────────────────
export const EpubExports = defineGroup('epubExports', [
	'createEpubExport',
] as const);

// ── Course Nicknames ───────────────────────────────────────────────────────
export const CourseNicknames = defineGroup('courseNicknames', [
	'clearCourseNicknames',
] as const);

// ── Authentication ─────────────────────────────────────────────────────────
export const Authentication = defineGroup('authentication', [
	'getAuthenticationProvider',
] as const);

// ── Blueprints ─────────────────────────────────────────────────────────────
export const Blueprints = defineGroup('blueprints', [
	'getCoursesBlueprint',
] as const);

// ── Brand & Config ─────────────────────────────────────────────────────────
export const BrandConfig = defineGroup('brandConfig', [
	'getBrandVariables',
	'getKalturaConfig',
	'getInternalSettings',
] as const);

// ── Audit & Reports ────────────────────────────────────────────────────────
export const AuditReports = defineGroup('auditReports', [
	'getAuditLogs',
	'getStatusOfLastReport',
] as const);

// ── Fetch Data ─────────────────────────────────────────────────────────────
export const FetchData = defineGroup('fetchData', ['fetchData'] as const);

// ── GraphQL ────────────────────────────────────────────────────────────────
export const GraphQL = defineGroup('graphql', ['getLegacyNode'] as const);

export * from './operations';
export * from './response-schemas';
export * from './routes';
export * from './types';

export type CanvasHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type CanvasOperation = {
	method: CanvasHttpMethod;
	path: string;
	description: string;
	/** POST/PUT/PATCH that Canvas accepts with no JSON body (e.g. favorites). */
	bodyless?: boolean;
	/** Overrides HTTP-method risk inference in buildEndpointMeta. */
	riskLevel?: 'read' | 'write' | 'destructive';
};

export const canvasOperations = {
	// ── Courses ────────────────────────────────────────────────────────────
	createCourse: {
		method: 'POST',
		path: '/api/v1/accounts/{account_id}/courses',
		description: 'Create a new course in Canvas within a specified account',
	},
	getSingleCourse: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}',
		description: 'Retrieve detailed information for a specific Canvas course',
	},
	getAccountCourse: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/courses/{course_id}',
		description:
			'Retrieve information on a single course from a Canvas account',
	},
	getCoursePermissions: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/permissions',
		description:
			'Returns permission information for the calling user in the given course',
	},
	getCourseLevelParticipationData: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/analytics/activity',
		description:
			'Retrieves daily activity analytics for a specified Canvas course',
	},
	addCourseToFavorites: {
		method: 'POST',
		path: '/api/v1/users/self/favorites/courses/{course_id}',
		description: 'Add a course to the current user favorites',
		bodyless: true,
	},

	// ── Accounts ───────────────────────────────────────────────────────────
	getSingleAccount: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}',
		description: 'Retrieve information on an individual account by ID',
	},
	getAccountsThatUsersCanCreateCoursesIn: {
		method: 'GET',
		path: '/api/v1/manageable_accounts',
		description:
			'Retrieves Canvas accounts where the current user can create courses',
	},
	getAccountHelpLinks: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/help_links',
		description:
			'Retrieves help links configured for the specified Canvas account',
	},
	getAccountGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body',
	},
	getAccountNotifications: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/account_notifications',
		description: 'Retrieve global account notifications for the current user',
	},
	createAccountNotification: {
		method: 'POST',
		path: '/api/v1/accounts/{account_id}/account_notifications',
		description: 'Creates a global notification within a Canvas account',
	},
	closeNotificationForUser: {
		method: 'DELETE',
		path: '/api/v1/accounts/{account_id}/account_notifications/{notification_id}',
		description: 'Close an account notification for the current user',
	},

	// ── Users ──────────────────────────────────────────────────────────────
	getCurrentUser: {
		method: 'GET',
		path: '/api/v1/users/self',
		description:
			'Retrieves detailed information about the currently authenticated user',
	},
	getSingleUser: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/users/{user_id}',
		description:
			'Retrieves detailed information for a single user in a Canvas course',
	},
	getUserProfile: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/profile',
		description: 'Retrieves profile information for an existing Canvas user',
	},
	editUser: {
		method: 'PUT',
		path: '/api/v1/users/{user_id}',
		description: 'Modifies an existing Canvas user profile and settings',
	},
	getAllUsers: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/users',
		description: 'Retrieves a list of users for a specified Canvas account',
	},
	getUserAvatars: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/avatars',
		description: 'Retrieve available avatar options for a Canvas user',
	},
	getCustomColors: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/colors',
		description: 'Retrieve all custom colors saved by a user in Canvas LMS',
	},
	getCustomColor: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/colors/{asset_string}',
		description: 'Retrieve the custom color for a specific course or context',
	},
	getDashboardPositions: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/dashboard_positions',
		description: 'Retrieve all dashboard positions saved for a user',
	},

	// ── User Tokens ────────────────────────────────────────────────────────
	createUsersTokens: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/tokens',
		description: 'Create a new access token for a Canvas user',
	},
	getUsersTokens: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/tokens/{token_id}',
		description: 'Retrieves detailed information about a specific access token',
	},
	deleteAccessToken: {
		method: 'DELETE',
		path: '/api/v1/users/{user_id}/tokens/{token_id}',
		description: 'Delete an access token for a Canvas user',
	},

	// ── User Custom Data ───────────────────────────────────────────────────
	createUsersCustomData: {
		method: 'PUT',
		path: '/api/v1/users/{user_id}/custom_data',
		description:
			'Create or update custom data for a Canvas user within a specified namespace',
	},
	getUsersCustomDataScope: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/custom_data/{scope}',
		description: 'Retrieve custom data stored for a Canvas user',
	},
	deleteCustomData: {
		method: 'DELETE',
		path: '/api/v1/users/{user_id}/custom_data',
		description: 'Delete custom user data for a given namespace',
	},
	deleteUsersCustomDataScope: {
		method: 'DELETE',
		path: '/api/v1/users/{user_id}/custom_data/{scope}',
		description: 'Delete custom user data at a specific scope path',
	},

	// ── User Inbox Labels ──────────────────────────────────────────────────
	createUserInboxLabel: {
		method: 'POST',
		path: '/api/v1/users/self/inbox_labels',
		description: 'Create new user inbox labels in Canvas',
	},
	deleteUserInboxLabel: {
		method: 'DELETE',
		path: '/api/v1/users/self/inbox_labels',
		description: 'Delete user inbox labels in Canvas',
	},

	// ── Enrollments ────────────────────────────────────────────────────────
	createEnrollment: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/enrollments',
		description:
			'Enrolls a user in a Canvas course with a specified role and status',
	},
	concludeDeactivateOrDeleteEnrollment: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/enrollments/{enrollment_id}',
		description:
			'Conclude, deactivate, or delete an enrollment in a Canvas course',
	},
	getEnrollmentInvitations: {
		method: 'GET',
		path: '/api/v1/users/self/enrollments',
		description: 'Retrieve pending enrollment invitations for the current user',
	},
	addLastAttendedDate: {
		method: 'PUT',
		path: '/api/v1/courses/{course_id}/users/{user_id}/last_attended',
		description:
			'Add or update the last attended date for a student enrollment',
	},

	// ── Assignments ────────────────────────────────────────────────────────
	createAssignment: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/assignments',
		description:
			'Creates a new assignment within a specified course in Canvas LMS',
	},
	getAssignment: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}',
		description: 'Retrieves detailed information for a specific assignment',
	},
	getAssignment2: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body',
	},
	editAssignment: {
		method: 'PUT',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}',
		description: 'Updates an existing assignment in a Canvas course',
	},
	deleteAssignment: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}',
		description: 'Soft-deletes a specific assignment within a course',
	},
	getAllAssignments: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments',
		description: 'Retrieves assignments for a specific Canvas course',
	},
	createAssignmentGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Call Canvas GraphQL (/api/graphql); supply the mutation document and variables in input.body',
	},
	getSubmissionSummary: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/submission_summary',
		description:
			'Retrieves submission summary counts for a specific assignment',
	},

	// ── Assignment Groups ──────────────────────────────────────────────────
	createAssignmentGroup: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/assignment_groups',
		description: 'Create a new assignment group for a course',
	},
	getAnAssignmentGroup: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignment_groups/{assignment_group_id}',
		description: 'Retrieves the assignment group with the given id',
	},
	getAssignmentGroup: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Retrieve information about a specific assignment group by ID',
	},

	// ── Assignment Overrides ───────────────────────────────────────────────
	createAssignmentOverride: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/overrides',
		description:
			'Creates an assignment override to adjust due/unlock/lock dates',
	},
	getSingleAssignmentOverride: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/overrides/{override_id}',
		description:
			'Retrieves details of the assignment override with the given id',
	},
	deleteAssignmentOverride: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/overrides/{override_id}',
		description:
			'Deletes an assignment override and returns its former details',
	},
	createBatchOverridesInACourse: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/assignments/overrides',
		description:
			'Batch create assignment overrides for multiple assignments in a course',
	},
	getCourses12Assignments: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/overrides',
		description: 'Batch retrieve assignment overrides in a course',
	},

	// ── Assignment Rubrics ─────────────────────────────────────────────────
	getAssignmentRubric: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/rubric',
		description: 'Fetches the detailed rubric for a specified assignment',
	},
	createRubric: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/rubrics',
		description: 'Create a rubric in a Canvas course',
	},
	getRubricAssessmentsReadState: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/submissions/{submission_id}/rubric_assessments/read_state',
		description:
			'Check whether rubric comments/grading have been seen by the student',
	},
	getRubricsUploadTemplate: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/rubrics/upload',
		description: 'Retrieve a CSV template file for importing rubrics',
	},

	// ── Submissions ────────────────────────────────────────────────────────
	createSubmissionDraft: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Create a draft submission for an assignment in Canvas via GraphQL',
	},
	deleteSubmissionDraft: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Delete a submission draft in Canvas via GraphQL',
		riskLevel: 'destructive',
	},
	getAUsersMostRecentlyGraded: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/graded_submissions',
		description: 'Retrieves a user most recently graded submissions',
	},

	// ── Peer Reviews ───────────────────────────────────────────────────────
	getAllPeerReviews: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/assignments/{assignment_id}/submissions/{submission_id}/peer_reviews',
		description: 'Retrieves all peer reviews for a specific submission',
	},
	getAllPeerReviewsForSectionAssignment: {
		method: 'GET',
		path: '/api/v1/sections/{section_id}/assignments/{assignment_id}/peer_reviews',
		description:
			'Retrieves all peer reviews for a specific assignment within a section',
	},
	getAllPeerReviewsForSectionSubmission: {
		method: 'GET',
		path: '/api/v1/sections/{section_id}/assignments/{assignment_id}/submissions/{submission_id}/peer_reviews',
		description:
			'Retrieves all peer reviews for a specific submission within a section',
	},

	// ── Modules ────────────────────────────────────────────────────────────
	createModule: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/modules',
		description:
			'Creates a new organizational module within a specified Canvas LMS course',
	},
	createModuleGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Create a new module in a Canvas course via GraphQL',
	},
	createModuleItem: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/modules/{module_id}/items',
		description:
			'Create and return a new module item within a Canvas course module',
	},
	getModuleItem: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Retrieve information about a specific module item by ID using GraphQL',
	},
	getModuleItemSequence: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/module_item_sequence',
		description:
			'Find the module item sequence for a given asset in a Canvas course',
	},

	// ── Pages ──────────────────────────────────────────────────────────────
	createPageForCourse: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/pages',
		description: 'Creates a new wiki page in a specified Canvas course',
	},
	getPageForCourse: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/pages/{url_or_id}',
		description:
			'Retrieves a specific content page by its URL or ID from a course',
	},
	createPageForGroup: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/pages',
		description: 'Creates a new wiki page in a specified Canvas group',
	},
	deletePageForGroup: {
		method: 'DELETE',
		path: '/api/v1/groups/{group_id}/pages/{url_or_id}',
		description: 'Deletes a wiki page from a Canvas group',
	},

	// ── Discussions ────────────────────────────────────────────────────────
	createDiscussionTopic: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/discussion_topics',
		description: 'Creates a new discussion topic in a specified Canvas course',
	},
	createDiscussionTopicGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Create a new discussion topic via GraphQL API',
	},
	getSingleTopic: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/discussion_topics/{topic_id}',
		description:
			'Retrieve detailed information about a single discussion topic',
	},
	createDiscussionEntry: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/discussion_topics/{topic_id}/entries',
		description: 'Create a new entry in a Canvas discussion topic',
	},
	createDiscussionEntryGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Create a new entry in a Canvas discussion topic via GraphQL',
	},
	deleteAnEntry: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/discussion_topics/{topic_id}/entries/{entry_id}',
		description: 'Delete a discussion entry',
	},
	deleteDiscussionEntry: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Delete a discussion entry via GraphQL',
		riskLevel: 'destructive',
	},
	deleteDiscussionTopicGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Delete a discussion topic in Canvas via GraphQL',
		riskLevel: 'destructive',
	},

	// ── Group Discussions ──────────────────────────────────────────────────
	createGroupDiscussionTopic: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/discussion_topics',
		description: 'Create a new discussion topic in a Canvas group',
	},
	getSingleTopic2: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/discussion_topics/{topic_id}',
		description:
			'Retrieve detailed information about a single group discussion topic',
	},
	getFullTopicGroups: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/discussion_topics/{topic_id}/view',
		description:
			'Retrieve the full cached structure of a group discussion topic',
	},
	deleteAnEntry2: {
		method: 'DELETE',
		path: '/api/v1/groups/{group_id}/discussion_topics/{topic_id}/entries/{entry_id}',
		description: 'Delete a discussion entry in a group discussion',
	},
	deleteGroupDiscussionTopic: {
		method: 'DELETE',
		path: '/api/v1/groups/{group_id}/discussion_topics/{topic_id}',
		description: 'Deletes a discussion topic from a group',
	},
	duplicateGroupDiscussionTopic: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/discussion_topics/{topic_id}/duplicate',
		description: 'Duplicate an existing discussion topic in a Canvas group',
		bodyless: true,
	},

	// ── Quizzes ────────────────────────────────────────────────────────────
	createQuiz: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/quizzes',
		description: 'Creates a new quiz with various settings in a Canvas course',
	},
	getSingleQuiz: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}',
		description:
			'Retrieves detailed information for a specific quiz in a course',
	},
	editQuiz: {
		method: 'PUT',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}',
		description: 'Modifies an existing Canvas quiz',
	},
	deleteQuiz: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}',
		description:
			'Permanently deletes the quiz identified by quiz_id from the course',
	},
	createQuizQuestion: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/questions',
		description: 'Creates a new question for an existing quiz within a course',
	},
	createQuestionGroup: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/groups',
		description: 'Create one or more question groups for a quiz',
	},
	createQuizSubmission: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/submissions',
		description: 'Start taking a quiz by creating a quiz submission',
	},
	answerQuizQuestions: {
		method: 'POST',
		path: '/api/v1/quiz_submissions/{quiz_submission_id}/questions',
		description:
			'Provide or update answers to quiz questions for a quiz submission',
	},
	getQuizStatistics: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/statistics',
		description: 'Fetch the latest quiz statistics for a Canvas quiz',
	},

	// ── Quiz Reports ───────────────────────────────────────────────────────
	createQuizReport: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/reports',
		description: 'Create a quiz report in Canvas (student or item analysis)',
	},
	getQuizReport: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/reports/{report_id}',
		description: 'Retrieves the data for a single quiz report',
	},
	abortQuizReportGeneration: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/quizzes/{quiz_id}/reports/{report_id}',
		description:
			'Aborts the generation of a quiz report or removes a previously generated one',
	},

	// ── Calendar Events ────────────────────────────────────────────────────
	createCalendarEvent: {
		method: 'POST',
		path: '/api/v1/calendar_events',
		description: 'Creates a calendar event with options for recurrence',
	},
	deleteCalendarEvent: {
		method: 'DELETE',
		path: '/api/v1/calendar_events/{calendar_event_id}',
		description: 'Delete a calendar event from Canvas',
	},
	createOrUpdateTimetableEvents: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/calendar_events/timetable_events',
		description: 'Create or update timetable events for a course or section',
	},

	// ── Appointment Groups ─────────────────────────────────────────────────
	createAppointmentGroup: {
		method: 'POST',
		path: '/api/v1/appointment_groups',
		description: 'Creates a new appointment group in Canvas',
	},
	deleteAppointmentGroup: {
		method: 'DELETE',
		path: '/api/v1/appointment_groups/{appointment_group_id}',
		description: 'Permanently deletes an existing appointment group',
	},

	// ── Conversations ──────────────────────────────────────────────────────
	createConversation: {
		method: 'POST',
		path: '/api/v1/conversations',
		description: 'Send messages in Canvas by creating a new conversation',
	},
	createConversationGraphQl: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Create a new conversation between users in Canvas via GraphQL',
	},
	getSingleConversation: {
		method: 'GET',
		path: '/api/v1/conversations/{conversation_id}',
		description: 'Retrieve detailed information for a single conversation',
	},
	editConversation: {
		method: 'PUT',
		path: '/api/v1/conversations/{conversation_id}',
		description: 'Update attributes for a single conversation in Canvas',
	},
	deleteConversations: {
		method: 'DELETE',
		path: '/api/v1/conversations/{conversation_id}',
		description: 'Delete one or more Canvas conversations',
	},
	deleteConversationMessages: {
		method: 'POST',
		path: '/api/v1/conversations/{conversation_id}/remove_messages',
		description: 'Delete specific messages from a Canvas conversation',
	},
	addConversationMessage: {
		method: 'POST',
		path: '/api/v1/conversations/{conversation_id}/add_message',
		description: 'Add a message to an existing Canvas conversation',
	},
	addRecipientsToConversation: {
		method: 'POST',
		path: '/api/v1/conversations/{conversation_id}/add_recipients',
		description: 'Add recipients to an existing group conversation',
	},
	getUnreadCount: {
		method: 'GET',
		path: '/api/v1/conversations/unread_count',
		description: 'Get the number of unread conversations for the current user',
	},
	findRecipients: {
		method: 'GET',
		path: '/api/v1/search/recipients',
		description:
			'Find valid recipients that the current user can send messages to',
	},

	// ── Bookmarks ──────────────────────────────────────────────────────────
	createBookmark: {
		method: 'POST',
		path: '/api/v1/users/self/bookmarks',
		description: 'Creates a new bookmark for the authenticated user',
	},
	getBookmark: {
		method: 'GET',
		path: '/api/v1/users/self/bookmarks/{bookmark_id}',
		description: 'Retrieves the details for a specific bookmark by ID',
	},
	deleteBookmark: {
		method: 'DELETE',
		path: '/api/v1/users/self/bookmarks/{bookmark_id}',
		description: 'Deletes a bookmark from the current user bookmarks',
	},

	// ── Files & Folders ────────────────────────────────────────────────────
	createFiles: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/files',
		description: 'Initiate file upload to Canvas (Step 1 of 3-step process)',
	},
	copyFileToFolder: {
		method: 'POST',
		path: '/api/v1/folders/{dest_folder_id}/copy_file',
		description:
			'Copies an existing Canvas file to a specified destination folder',
	},
	deleteFile: {
		method: 'DELETE',
		path: '/api/v1/files/{file_id}',
		description: 'Remove a file from Canvas',
	},
	getFolderById: {
		method: 'GET',
		path: '/api/v1/folders/{folder_id}',
		description: 'Retrieves the details for a specific folder by its ID',
	},
	createFolder: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/folders',
		description: 'Create a folder in the specified context for a user',
	},
	createFolderInGroup: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/folders',
		description: 'Create a folder within a Canvas group',
	},
	copyFolder: {
		method: 'POST',
		path: '/api/v1/folders/{dest_folder_id}/copy_folder',
		description: 'Copy a folder to another folder in Canvas',
	},
	deleteFolder: {
		method: 'DELETE',
		path: '/api/v1/folders/{folder_id}',
		description: 'Permanently deletes an existing folder',
	},
	getGroupFolder: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/folders/{folder_id}',
		description: 'Retrieves the details for a folder within a Canvas group',
	},
	getQuotaInformation: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/files/quota',
		description: 'Retrieves the total and used storage quota for a Canvas user',
	},

	// ── Groups ─────────────────────────────────────────────────────────────
	createGroup: {
		method: 'POST',
		path: '/api/v1/groups',
		description: 'Create a new community group directly',
	},
	getGroup: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}',
		description: 'Retrieves detailed information for a single Canvas group',
	},
	deleteGroup: {
		method: 'DELETE',
		path: '/api/v1/groups/{group_id}',
		description: 'Deletes a group and removes all members',
	},
	addGroupToFavorites: {
		method: 'POST',
		path: '/api/v1/users/self/favorites/groups/{group_id}',
		description: 'Add a group to the current user favorites',
		bodyless: true,
	},
	getGroupPermissions: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/permissions',
		description:
			'Returns permission information for the calling user in the group',
	},
	getGroupActivityStreamSummary: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/activity_stream/summary',
		description: 'Retrieves a summary of the group-specific activity stream',
	},

	// ── Group Categories / Sets ────────────────────────────────────────────
	createGroupCategoryCourses: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/group_categories',
		description:
			'Creates a new group category within a specified Canvas course',
	},
	createGroupSet: {
		method: 'POST',
		path: '/api/v1/accounts/{account_id}/group_categories',
		description: 'Create a new group set (group category) in a Canvas account',
	},
	createGroupInSet: {
		method: 'POST',
		path: '/api/v1/group_categories/{group_category_id}/groups',
		description: 'Create a new group within a Canvas group set',
	},
	assignUnassignedMembersToGroupCategory: {
		method: 'POST',
		path: '/api/v1/group_categories/{group_category_id}/assign_unassigned_members',
		description: 'Assign unassigned members to groups within a group category',
		bodyless: true,
	},

	// ── Group Memberships ──────────────────────────────────────────────────
	createMembership: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/memberships',
		description: 'Join or request to join a group',
	},
	getASingleGroupMembership: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/memberships/{membership_id}',
		description: 'Retrieve a single group membership by its membership_id',
	},
	getASingleGroupMembership2: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/users/{user_id}',
		description: 'Retrieve a single group membership by user_id',
	},

	// ── Grading ────────────────────────────────────────────────────────────
	createCourseGradingStandard: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/grading_standards',
		description: 'Create a new grading standard in a Canvas course',
	},
	getSingleGradingStandardIn2: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/grading_standards/{grading_standard_id}',
		description:
			'Retrieves a single grading standard for the given course context',
	},
	deleteCustomGradeStatus: {
		method: 'DELETE',
		path: '/api/v1/accounts/{account_id}/custom_grade_statuses/{custom_grade_status_id}',
		description: 'Delete a custom grade status from Canvas',
	},

	// ── Gradebook Columns ──────────────────────────────────────────────────
	createCustomGradebookColumn: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/custom_gradebook_columns',
		description: 'Creates a new custom gradebook column in a course',
	},
	deleteCustomGradebookColumn: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/custom_gradebook_columns/{column_id}',
		description: 'Permanently deletes a custom gradebook column',
	},
	updateCustomGradebookColumnData: {
		method: 'PUT',
		path: '/api/v1/courses/{course_id}/custom_gradebook_columns/{column_id}/data',
		description:
			'Bulk updates custom gradebook column data for multiple students',
	},

	// ── Comment Bank ───────────────────────────────────────────────────────
	deleteCommentBankItem: {
		method: 'DELETE',
		path: '/api/v1/comment_bank/{comment_id}',
		description: 'Delete a comment bank item from Canvas',
	},

	// ── Late Policy ────────────────────────────────────────────────────────
	getALatePolicy: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/late_policy',
		description: 'Retrieve the late policy for a Canvas course',
	},

	// ── External Tools ─────────────────────────────────────────────────────
	createExternalTool: {
		method: 'POST',
		path: '/api/v1/accounts/{account_id}/external_tools',
		description: 'Create an external tool in a Canvas account',
	},
	createExternalToolInCourse: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/external_tools',
		description: 'Create an external tool in a Canvas course',
	},
	getSingleExternalTool: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/external_tools/{external_tool_id}',
		description: 'Retrieve detailed information for a specific external tool',
	},
	getASingleExternalTool2: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/external_tools/{external_tool_id}',
		description:
			'Retrieve detailed information for a specific external tool in a course',
	},
	deleteAnExternalTool: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/external_tools/{external_tool_id}',
		description: 'Remove the specified external tool from a course',
	},
	createLtiResourceLink: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/lti_resource_links',
		description: 'Creates a new LTI Resource Link in a Canvas course',
	},

	// ── External Feeds ─────────────────────────────────────────────────────
	createExternalFeed: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/external_feeds',
		description: 'Creates a new external RSS or Atom feed for a Canvas course',
	},
	createExternalFeedForGroup: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/external_feeds',
		description: 'Create a new external RSS or Atom feed for a Canvas group',
	},
	deleteExternalFeedFromGroup: {
		method: 'DELETE',
		path: '/api/v1/groups/{group_id}/external_feeds/{external_feed_id}',
		description: 'Deletes the external feed from the specified group',
	},

	// ── Planner ────────────────────────────────────────────────────────────
	createPlannerNote: {
		method: 'POST',
		path: '/api/v1/planner_notes',
		description: 'Create a planner note for the current user',
	},
	deletePlannerNote: {
		method: 'DELETE',
		path: '/api/v1/planner_notes/{planner_note_id}',
		description: 'Delete a planner note for the current user',
	},
	createPlannerOverride: {
		method: 'POST',
		path: '/api/v1/planner/overrides',
		description: 'Create a planner override for the current user',
	},
	deletePlannerOverride: {
		method: 'DELETE',
		path: '/api/v1/planner/overrides/{planner_override_id}',
		description: 'Delete a planner override for the current user',
	},

	// ── Communication Channels ─────────────────────────────────────────────
	createCommunicationChannel: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/communication_channels',
		description:
			'Creates a new communication channel for an existing Canvas user',
	},
	deleteCommunicationChannel: {
		method: 'DELETE',
		path: '/api/v1/users/{user_id}/communication_channels/{communication_channel_id}',
		description: 'Deletes an existing communication channel for a user',
	},
	deleteCommunicationChannelByTypeAndAddress: {
		method: 'DELETE',
		path: '/api/v1/users/{user_id}/communication_channels/{type}/{address}',
		description: 'Deletes a communication channel by type and address',
	},

	// ── Content Shares ─────────────────────────────────────────────────────
	createContentShare: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/content_shares',
		description: 'Shares a Canvas content item to specified users',
	},
	getContentShare: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/content_shares/{content_share_id}',
		description: 'Retrieves detailed information about a single content share',
	},
	addUsersToContentShare: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/content_shares/{content_share_id}/add_users',
		description: 'Send a previously created content share to additional users',
	},
	getContentSharesUnreadCount: {
		method: 'GET',
		path: '/api/v1/users/self/content_shares/unread_count',
		description:
			'Retrieve the count of unread content shares for the authenticated user',
	},

	// ── Content Migrations ─────────────────────────────────────────────────
	createGroupContentMigration: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/content_migrations',
		description: 'Create a content migration in a Canvas group',
	},
	getAContentMigration3: {
		method: 'GET',
		path: '/api/v1/groups/{group_id}/content_migrations/{content_migration_id}',
		description:
			'Retrieve data on an individual content migration from a group',
	},
	createAContentMigration4: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/content_migrations',
		description: 'Create a content migration for a Canvas user',
	},
	getAContentMigration4: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/content_migrations/{content_migration_id}',
		description: 'Retrieve data on an individual content migration from a user',
	},

	// ── Content Exports ────────────────────────────────────────────────────
	exportContent: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/content_exports',
		description:
			'Initiates an asynchronous export of course content from Canvas',
	},
	exportGroupContent: {
		method: 'POST',
		path: '/api/v1/groups/{group_id}/content_exports',
		description: 'Begin a content export job for a group',
	},
	exportUserContent: {
		method: 'POST',
		path: '/api/v1/users/{user_id}/content_exports',
		description: 'Begin a content export job for a user',
	},

	// ── Outcomes ────────────────────────────────────────────────────────────
	createLearningOutcome: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Create a new learning outcome in Canvas using GraphQL',
	},
	getOutcomeResults: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/outcome_results',
		description:
			'Get outcome results for users and outcomes in a course context',
	},
	getAlignedAssignmentsForAnOutcome: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/outcome_alignments',
		description: 'Retrieves outcome alignments for a student or assignment',
	},
	deleteOutcomeLinks: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Delete links between outcomes and content in Canvas',
		riskLevel: 'destructive',
	},

	// ── Outcome Groups ─────────────────────────────────────────────────────
	getAllOutcomeGroupsForContext: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/outcome_groups',
		description: 'Retrieve all outcome groups for an account context',
	},
	getAllOutcomeGroupsForContext2: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/outcome_groups',
		description: 'Retrieve all outcome groups for a course context',
	},
	getAllOutcomeLinksForContext: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/outcome_group_links',
		description: 'Retrieves all outcome links for an account context',
	},
	getAllOutcomeLinksForContext2: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/outcome_group_links',
		description: 'Retrieves all outcome links for a course context',
	},
	getGlobalOutcomeGroup: {
		method: 'GET',
		path: '/api/v1/global/outcome_groups/{outcome_group_id}',
		description: 'Retrieves a global outcome group by ID from Canvas',
	},
	getRootOutcomeGroupForCourse: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/root_outcome_group',
		description:
			'Retrieves the root outcome group for a specified course context',
	},
	getAccountsOutcomeGroups: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/outcome_groups/{outcome_group_id}',
		description: 'Retrieve a specific outcome group from a Canvas account',
	},
	createSubgroupCourses: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/outcome_groups/{outcome_group_id}/subgroups',
		description: 'Creates a new empty subgroup under the outcome group',
	},
	deleteAnOutcomeGroupCourses: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/outcome_groups/{outcome_group_id}',
		description: 'Deletes an outcome group from a course',
	},
	createLinkOutcomeCourses: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/outcome_groups/{outcome_group_id}/outcomes',
		description:
			'Link an existing outcome or create a new outcome within a course',
	},

	// ── Polls ──────────────────────────────────────────────────────────────
	createSinglePoll: {
		method: 'POST',
		path: '/api/v1/polls',
		description: 'Create a new poll for the current user in Canvas',
	},
	getSinglePoll: {
		method: 'GET',
		path: '/api/v1/polls/{poll_id}',
		description: 'Retrieve a single poll by its ID from Canvas',
	},
	deletePoll: {
		method: 'DELETE',
		path: '/api/v1/polls/{poll_id}',
		description: 'Permanently deletes the poll identified by id',
	},
	createSinglePollChoice: {
		method: 'POST',
		path: '/api/v1/polls/{poll_id}/poll_choices',
		description: 'Create one or more poll choices for an existing poll',
	},
	getSinglePollChoice: {
		method: 'GET',
		path: '/api/v1/polls/{poll_id}/poll_choices/{poll_choice_id}',
		description: 'Retrieve a single poll choice by its ID',
	},
	deletePollChoice: {
		method: 'DELETE',
		path: '/api/v1/polls/{poll_id}/poll_choices/{poll_choice_id}',
		description: 'Delete a poll choice from a Canvas poll',
	},
	createSinglePollSession: {
		method: 'POST',
		path: '/api/v1/polls/{poll_id}/poll_sessions',
		description: 'Create a new poll session for a poll in Canvas',
	},
	deletePollSession: {
		method: 'DELETE',
		path: '/api/v1/polls/{poll_id}/poll_sessions/{poll_session_id}',
		description: 'Permanently delete a poll session from a poll',
	},
	createSinglePollSubmission: {
		method: 'POST',
		path: '/api/v1/polls/{poll_id}/poll_sessions/{poll_session_id}/poll_submissions',
		description: 'Create a new poll submission for a poll session',
	},

	// ── Blackout Dates ─────────────────────────────────────────────────────
	createBlackoutDateForCourse: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/blackout_dates',
		description: 'Create a blackout date for the given course context',
	},
	deleteBlackoutDate: {
		method: 'DELETE',
		path: '/api/v1/courses/{course_id}/blackout_dates/{blackout_date_id}',
		description: 'Delete a blackout date for the given course context',
	},

	// ── ePortfolios ────────────────────────────────────────────────────────
	getAllEPortfoliosForUser: {
		method: 'GET',
		path: '/api/v1/users/{user_id}/eportfolios',
		description: 'Retrieve all ePortfolios for a specified user',
	},

	// ── ePub Exports ───────────────────────────────────────────────────────
	createEpubExport: {
		method: 'POST',
		path: '/api/v1/courses/{course_id}/epub_exports',
		description: 'Initiate an ePub export for a course',
	},

	// ── Course Nicknames ───────────────────────────────────────────────────
	clearCourseNicknames: {
		method: 'DELETE',
		path: '/api/v1/users/self/course_nicknames',
		description: 'Remove all stored course nicknames for the current user',
	},

	// ── Authentication Providers ───────────────────────────────────────────
	getAuthenticationProvider: {
		method: 'GET',
		path: '/api/v1/accounts/{account_id}/authentication_providers/{authentication_provider_id}',
		description: 'Retrieves a specific authentication provider configuration',
	},

	// ── Blueprints ─────────────────────────────────────────────────────────
	getCoursesBlueprint: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/blueprint_subscriptions/{subscription_id}/migrations',
		description:
			'Retrieves blueprint subscription migrations for a Canvas course',
	},

	// ── Brand & Config ─────────────────────────────────────────────────────
	getBrandVariables: {
		method: 'GET',
		path: '/api/v1/brand_variables',
		description:
			'Retrieve all brand configuration variables for the Canvas account',
	},
	getKalturaConfig: {
		method: 'GET',
		path: '/api/v1/services/kaltura',
		description: 'Return the config information for the Kaltura plugin',
	},
	getInternalSettings: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Retrieve all internal settings from Canvas using GraphQL',
	},

	// ── Audit Logs & Reports ───────────────────────────────────────────────
	getAuditLogs: {
		method: 'POST',
		path: '/api/graphql',
		description: 'Access Canvas audit logs for a specified asset using GraphQL',
	},
	getStatusOfLastReport: {
		method: 'GET',
		path: '/api/v1/courses/{course_id}/reports/{report_type}',
		description:
			'Retrieve the status of the last generated report for a course',
	},

	// ── Fetch Data (generic list) ──────────────────────────────────────────
	fetchData: {
		method: 'GET',
		path: '/api/v1/{resource}',
		description:
			'Fetches a specific category of Canvas data (accounts, courses, users, etc.)',
	},

	// ── GraphQL Legacy Node ────────────────────────────────────────────────
	getLegacyNode: {
		method: 'POST',
		path: '/api/graphql',
		description:
			'Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body',
	},
} as const satisfies Record<string, CanvasOperation>;

export type CanvasOperationName = keyof typeof canvasOperations;

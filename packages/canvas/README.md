# @corsair-dev/canvas

Canvas plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/canvas
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.closeNotificationForUser` | `canvas.api.accounts.closeNotificationForUser` | `destructive` | Close an account notification for the current user |
| `accounts.createAccountNotification` | `canvas.api.accounts.createAccountNotification` | `write` | Creates a global notification within a Canvas account |
| `accounts.getAccountGraphQl` | `canvas.api.accounts.getAccountGraphQl` | `write` | Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body |
| `accounts.getAccountHelpLinks` | `canvas.api.accounts.getAccountHelpLinks` | `read` | Retrieves help links configured for the specified Canvas account |
| `accounts.getAccountNotifications` | `canvas.api.accounts.getAccountNotifications` | `read` | Retrieve global account notifications for the current user |
| `accounts.getAccountsThatUsersCanCreateCoursesIn` | `canvas.api.accounts.getAccountsThatUsersCanCreateCoursesIn` | `read` | Retrieves Canvas accounts where the current user can create courses |
| `accounts.getSingleAccount` | `canvas.api.accounts.getSingleAccount` | `read` | Retrieve information on an individual account by ID |
| `appointmentGroups.createAppointmentGroup` | `canvas.api.appointmentGroups.createAppointmentGroup` | `write` | Creates a new appointment group in Canvas |
| `appointmentGroups.deleteAppointmentGroup` | `canvas.api.appointmentGroups.deleteAppointmentGroup` | `destructive` | Permanently deletes an existing appointment group |
| `assignmentGroups.createAssignmentGroup` | `canvas.api.assignmentGroups.createAssignmentGroup` | `write` | Create a new assignment group for a course |
| `assignmentGroups.getAnAssignmentGroup` | `canvas.api.assignmentGroups.getAnAssignmentGroup` | `read` | Retrieves the assignment group with the given id |
| `assignmentGroups.getAssignmentGroup` | `canvas.api.assignmentGroups.getAssignmentGroup` | `write` | Retrieve information about a specific assignment group by ID |
| `assignmentOverrides.createAssignmentOverride` | `canvas.api.assignmentOverrides.createAssignmentOverride` | `write` | Creates an assignment override to adjust due/unlock/lock dates |
| `assignmentOverrides.createBatchOverridesInACourse` | `canvas.api.assignmentOverrides.createBatchOverridesInACourse` | `write` | Batch create assignment overrides for multiple assignments in a course |
| `assignmentOverrides.deleteAssignmentOverride` | `canvas.api.assignmentOverrides.deleteAssignmentOverride` | `destructive` | Deletes an assignment override and returns its former details |
| `assignmentOverrides.getCourses12Assignments` | `canvas.api.assignmentOverrides.getCourses12Assignments` | `read` | Batch retrieve assignment overrides in a course |
| `assignmentOverrides.getSingleAssignmentOverride` | `canvas.api.assignmentOverrides.getSingleAssignmentOverride` | `read` | Retrieves details of the assignment override with the given id |
| `assignments.createAssignment` | `canvas.api.assignments.createAssignment` | `write` | Creates a new assignment within a specified course in Canvas LMS |
| `assignments.createAssignmentGraphQl` | `canvas.api.assignments.createAssignmentGraphQl` | `write` | Call Canvas GraphQL (/api/graphql); supply the mutation document and variables in input.body |
| `assignments.deleteAssignment` | `canvas.api.assignments.deleteAssignment` | `destructive` | Soft-deletes a specific assignment within a course |
| `assignments.editAssignment` | `canvas.api.assignments.editAssignment` | `write` | Updates an existing assignment in a Canvas course |
| `assignments.getAllAssignments` | `canvas.api.assignments.getAllAssignments` | `read` | Retrieves assignments for a specific Canvas course |
| `assignments.getAssignment` | `canvas.api.assignments.getAssignment` | `read` | Retrieves detailed information for a specific assignment |
| `assignments.getAssignment2` | `canvas.api.assignments.getAssignment2` | `write` | Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body |
| `assignments.getSubmissionSummary` | `canvas.api.assignments.getSubmissionSummary` | `read` | Retrieves submission summary counts for a specific assignment |
| `auditReports.getAuditLogs` | `canvas.api.auditReports.getAuditLogs` | `write` | Access Canvas audit logs for a specified asset using GraphQL |
| `auditReports.getStatusOfLastReport` | `canvas.api.auditReports.getStatusOfLastReport` | `read` | Retrieve the status of the last generated report for a course |
| `authentication.getAuthenticationProvider` | `canvas.api.authentication.getAuthenticationProvider` | `read` | Retrieves a specific authentication provider configuration |
| `blackoutDates.createBlackoutDateForCourse` | `canvas.api.blackoutDates.createBlackoutDateForCourse` | `write` | Create a blackout date for the given course context |
| `blackoutDates.deleteBlackoutDate` | `canvas.api.blackoutDates.deleteBlackoutDate` | `destructive` | Delete a blackout date for the given course context |
| `blueprints.getCoursesBlueprint` | `canvas.api.blueprints.getCoursesBlueprint` | `read` | Retrieves blueprint subscription migrations for a Canvas course |
| `bookmarks.createBookmark` | `canvas.api.bookmarks.createBookmark` | `write` | Creates a new bookmark for the authenticated user |
| `bookmarks.deleteBookmark` | `canvas.api.bookmarks.deleteBookmark` | `destructive` | Deletes a bookmark from the current user bookmarks |
| `bookmarks.getBookmark` | `canvas.api.bookmarks.getBookmark` | `read` | Retrieves the details for a specific bookmark by ID |
| `brandConfig.getBrandVariables` | `canvas.api.brandConfig.getBrandVariables` | `read` | Retrieve all brand configuration variables for the Canvas account |
| `brandConfig.getInternalSettings` | `canvas.api.brandConfig.getInternalSettings` | `write` | Retrieve all internal settings from Canvas using GraphQL |
| `brandConfig.getKalturaConfig` | `canvas.api.brandConfig.getKalturaConfig` | `read` | Return the config information for the Kaltura plugin |
| `calendarEvents.createCalendarEvent` | `canvas.api.calendarEvents.createCalendarEvent` | `write` | Creates a calendar event with options for recurrence |
| `calendarEvents.createOrUpdateTimetableEvents` | `canvas.api.calendarEvents.createOrUpdateTimetableEvents` | `write` | Create or update timetable events for a course or section |
| `calendarEvents.deleteCalendarEvent` | `canvas.api.calendarEvents.deleteCalendarEvent` | `destructive` | Delete a calendar event from Canvas |
| `commentBank.deleteCommentBankItem` | `canvas.api.commentBank.deleteCommentBankItem` | `destructive` | Delete a comment bank item from Canvas |
| `communicationChannels.createCommunicationChannel` | `canvas.api.communicationChannels.createCommunicationChannel` | `write` | Creates a new communication channel for an existing Canvas user |
| `communicationChannels.deleteCommunicationChannel` | `canvas.api.communicationChannels.deleteCommunicationChannel` | `destructive` | Deletes an existing communication channel for a user |
| `communicationChannels.deleteCommunicationChannelByTypeAndAddress` | `canvas.api.communicationChannels.deleteCommunicationChannelByTypeAndAddress` | `destructive` | Deletes a communication channel by type and address |
| `contentExports.exportContent` | `canvas.api.contentExports.exportContent` | `write` | Initiates an asynchronous export of course content from Canvas |
| `contentExports.exportGroupContent` | `canvas.api.contentExports.exportGroupContent` | `write` | Begin a content export job for a group |
| `contentExports.exportUserContent` | `canvas.api.contentExports.exportUserContent` | `write` | Begin a content export job for a user |
| `contentMigrations.createAContentMigration4` | `canvas.api.contentMigrations.createAContentMigration4` | `write` | Create a content migration for a Canvas user |
| `contentMigrations.createGroupContentMigration` | `canvas.api.contentMigrations.createGroupContentMigration` | `write` | Create a content migration in a Canvas group |
| `contentMigrations.getAContentMigration3` | `canvas.api.contentMigrations.getAContentMigration3` | `read` | Retrieve data on an individual content migration from a group |
| `contentMigrations.getAContentMigration4` | `canvas.api.contentMigrations.getAContentMigration4` | `read` | Retrieve data on an individual content migration from a user |
| `contentShares.addUsersToContentShare` | `canvas.api.contentShares.addUsersToContentShare` | `write` | Send a previously created content share to additional users |
| `contentShares.createContentShare` | `canvas.api.contentShares.createContentShare` | `write` | Shares a Canvas content item to specified users |
| `contentShares.getContentShare` | `canvas.api.contentShares.getContentShare` | `read` | Retrieves detailed information about a single content share |
| `contentShares.getContentSharesUnreadCount` | `canvas.api.contentShares.getContentSharesUnreadCount` | `read` | Retrieve the count of unread content shares for the authenticated user |
| `conversations.addConversationMessage` | `canvas.api.conversations.addConversationMessage` | `write` | Add a message to an existing Canvas conversation |
| `conversations.addRecipientsToConversation` | `canvas.api.conversations.addRecipientsToConversation` | `write` | Add recipients to an existing group conversation |
| `conversations.createConversation` | `canvas.api.conversations.createConversation` | `write` | Send messages in Canvas by creating a new conversation |
| `conversations.createConversationGraphQl` | `canvas.api.conversations.createConversationGraphQl` | `write` | Create a new conversation between users in Canvas via GraphQL |
| `conversations.deleteConversationMessages` | `canvas.api.conversations.deleteConversationMessages` | `write` | Delete specific messages from a Canvas conversation |
| `conversations.deleteConversations` | `canvas.api.conversations.deleteConversations` | `destructive` | Delete one or more Canvas conversations |
| `conversations.editConversation` | `canvas.api.conversations.editConversation` | `write` | Update attributes for a single conversation in Canvas |
| `conversations.findRecipients` | `canvas.api.conversations.findRecipients` | `read` | Find valid recipients that the current user can send messages to |
| `conversations.getSingleConversation` | `canvas.api.conversations.getSingleConversation` | `read` | Retrieve detailed information for a single conversation |
| `conversations.getUnreadCount` | `canvas.api.conversations.getUnreadCount` | `read` | Get the number of unread conversations for the current user |
| `courseNicknames.clearCourseNicknames` | `canvas.api.courseNicknames.clearCourseNicknames` | `destructive` | Remove all stored course nicknames for the current user |
| `courses.addCourseToFavorites` | `canvas.api.courses.addCourseToFavorites` | `write` | Add a course to the current user favorites |
| `courses.createCourse` | `canvas.api.courses.createCourse` | `write` | Create a new course in Canvas within a specified account |
| `courses.getAccountCourse` | `canvas.api.courses.getAccountCourse` | `read` | Retrieve information on a single course from a Canvas account |
| `courses.getCourseLevelParticipationData` | `canvas.api.courses.getCourseLevelParticipationData` | `read` | Retrieves daily activity analytics for a specified Canvas course |
| `courses.getCoursePermissions` | `canvas.api.courses.getCoursePermissions` | `read` | Returns permission information for the calling user in the given course |
| `courses.getSingleCourse` | `canvas.api.courses.getSingleCourse` | `read` | Retrieve detailed information for a specific Canvas course |
| `discussions.createDiscussionEntry` | `canvas.api.discussions.createDiscussionEntry` | `write` | Create a new entry in a Canvas discussion topic |
| `discussions.createDiscussionEntryGraphQl` | `canvas.api.discussions.createDiscussionEntryGraphQl` | `write` | Create a new entry in a Canvas discussion topic via GraphQL |
| `discussions.createDiscussionTopic` | `canvas.api.discussions.createDiscussionTopic` | `write` | Creates a new discussion topic in a specified Canvas course |
| `discussions.createDiscussionTopicGraphQl` | `canvas.api.discussions.createDiscussionTopicGraphQl` | `write` | Create a new discussion topic via GraphQL API |
| `discussions.deleteAnEntry` | `canvas.api.discussions.deleteAnEntry` | `destructive` | Delete a discussion entry |
| `discussions.deleteDiscussionEntry` | `canvas.api.discussions.deleteDiscussionEntry` | `destructive` | Delete a discussion entry via GraphQL |
| `discussions.deleteDiscussionTopicGraphQl` | `canvas.api.discussions.deleteDiscussionTopicGraphQl` | `destructive` | Delete a discussion topic in Canvas via GraphQL |
| `discussions.getSingleTopic` | `canvas.api.discussions.getSingleTopic` | `read` | Retrieve detailed information about a single discussion topic |
| `enrollments.addLastAttendedDate` | `canvas.api.enrollments.addLastAttendedDate` | `write` | Add or update the last attended date for a student enrollment |
| `enrollments.concludeDeactivateOrDeleteEnrollment` | `canvas.api.enrollments.concludeDeactivateOrDeleteEnrollment` | `destructive` | Conclude, deactivate, or delete an enrollment in a Canvas course |
| `enrollments.createEnrollment` | `canvas.api.enrollments.createEnrollment` | `write` | Enrolls a user in a Canvas course with a specified role and status |
| `enrollments.getEnrollmentInvitations` | `canvas.api.enrollments.getEnrollmentInvitations` | `read` | Retrieve pending enrollment invitations for the current user |
| `ePortfolios.getAllEPortfoliosForUser` | `canvas.api.ePortfolios.getAllEPortfoliosForUser` | `read` | Retrieve all ePortfolios for a specified user |
| `epubExports.createEpubExport` | `canvas.api.epubExports.createEpubExport` | `write` | Initiate an ePub export for a course |
| `externalFeeds.createExternalFeed` | `canvas.api.externalFeeds.createExternalFeed` | `write` | Creates a new external RSS or Atom feed for a Canvas course |
| `externalFeeds.createExternalFeedForGroup` | `canvas.api.externalFeeds.createExternalFeedForGroup` | `write` | Create a new external RSS or Atom feed for a Canvas group |
| `externalFeeds.deleteExternalFeedFromGroup` | `canvas.api.externalFeeds.deleteExternalFeedFromGroup` | `destructive` | Deletes the external feed from the specified group |
| `externalTools.createExternalTool` | `canvas.api.externalTools.createExternalTool` | `write` | Create an external tool in a Canvas account |
| `externalTools.createExternalToolInCourse` | `canvas.api.externalTools.createExternalToolInCourse` | `write` | Create an external tool in a Canvas course |
| `externalTools.createLtiResourceLink` | `canvas.api.externalTools.createLtiResourceLink` | `write` | Creates a new LTI Resource Link in a Canvas course |
| `externalTools.deleteAnExternalTool` | `canvas.api.externalTools.deleteAnExternalTool` | `destructive` | Remove the specified external tool from a course |
| `externalTools.getASingleExternalTool2` | `canvas.api.externalTools.getASingleExternalTool2` | `read` | Retrieve detailed information for a specific external tool in a course |
| `externalTools.getSingleExternalTool` | `canvas.api.externalTools.getSingleExternalTool` | `read` | Retrieve detailed information for a specific external tool |
| `fetchData.fetchData` | `canvas.api.fetchData.fetchData` | `read` | Fetches a specific category of Canvas data (accounts, courses, users, etc.) |
| `files.copyFileToFolder` | `canvas.api.files.copyFileToFolder` | `write` | Copies an existing Canvas file to a specified destination folder |
| `files.copyFolder` | `canvas.api.files.copyFolder` | `write` | Copy a folder to another folder in Canvas |
| `files.createFiles` | `canvas.api.files.createFiles` | `write` | Initiate file upload to Canvas (Step 1 of 3-step process) |
| `files.createFolder` | `canvas.api.files.createFolder` | `write` | Create a folder in the specified context for a user |
| `files.createFolderInGroup` | `canvas.api.files.createFolderInGroup` | `write` | Create a folder within a Canvas group |
| `files.deleteFile` | `canvas.api.files.deleteFile` | `destructive` | Remove a file from Canvas |
| `files.deleteFolder` | `canvas.api.files.deleteFolder` | `destructive` | Permanently deletes an existing folder |
| `files.getFolderById` | `canvas.api.files.getFolderById` | `read` | Retrieves the details for a specific folder by its ID |
| `files.getGroupFolder` | `canvas.api.files.getGroupFolder` | `read` | Retrieves the details for a folder within a Canvas group |
| `files.getQuotaInformation` | `canvas.api.files.getQuotaInformation` | `read` | Retrieves the total and used storage quota for a Canvas user |
| `gradebookColumns.createCustomGradebookColumn` | `canvas.api.gradebookColumns.createCustomGradebookColumn` | `write` | Creates a new custom gradebook column in a course |
| `gradebookColumns.deleteCustomGradebookColumn` | `canvas.api.gradebookColumns.deleteCustomGradebookColumn` | `destructive` | Permanently deletes a custom gradebook column |
| `gradebookColumns.updateCustomGradebookColumnData` | `canvas.api.gradebookColumns.updateCustomGradebookColumnData` | `write` | Bulk updates custom gradebook column data for multiple students |
| `grading.createCourseGradingStandard` | `canvas.api.grading.createCourseGradingStandard` | `write` | Create a new grading standard in a Canvas course |
| `grading.deleteCustomGradeStatus` | `canvas.api.grading.deleteCustomGradeStatus` | `destructive` | Delete a custom grade status from Canvas |
| `grading.getSingleGradingStandardIn2` | `canvas.api.grading.getSingleGradingStandardIn2` | `read` | Retrieves a single grading standard for the given course context |
| `graphql.getLegacyNode` | `canvas.api.graphql.getLegacyNode` | `write` | Call Canvas GraphQL (/api/graphql); supply the query document and variables in input.body |
| `groupCategories.assignUnassignedMembersToGroupCategory` | `canvas.api.groupCategories.assignUnassignedMembersToGroupCategory` | `write` | Assign unassigned members to groups within a group category |
| `groupCategories.createGroupCategoryCourses` | `canvas.api.groupCategories.createGroupCategoryCourses` | `write` | Creates a new group category within a specified Canvas course |
| `groupCategories.createGroupInSet` | `canvas.api.groupCategories.createGroupInSet` | `write` | Create a new group within a Canvas group set |
| `groupCategories.createGroupSet` | `canvas.api.groupCategories.createGroupSet` | `write` | Create a new group set (group category) in a Canvas account |
| `groupDiscussions.createGroupDiscussionTopic` | `canvas.api.groupDiscussions.createGroupDiscussionTopic` | `write` | Create a new discussion topic in a Canvas group |
| `groupDiscussions.deleteAnEntry2` | `canvas.api.groupDiscussions.deleteAnEntry2` | `destructive` | Delete a discussion entry in a group discussion |
| `groupDiscussions.deleteGroupDiscussionTopic` | `canvas.api.groupDiscussions.deleteGroupDiscussionTopic` | `destructive` | Deletes a discussion topic from a group |
| `groupDiscussions.duplicateGroupDiscussionTopic` | `canvas.api.groupDiscussions.duplicateGroupDiscussionTopic` | `write` | Duplicate an existing discussion topic in a Canvas group |
| `groupDiscussions.getFullTopicGroups` | `canvas.api.groupDiscussions.getFullTopicGroups` | `read` | Retrieve the full cached structure of a group discussion topic |
| `groupDiscussions.getSingleTopic2` | `canvas.api.groupDiscussions.getSingleTopic2` | `read` | Retrieve detailed information about a single group discussion topic |
| `groupMemberships.createMembership` | `canvas.api.groupMemberships.createMembership` | `write` | Join or request to join a group |
| `groupMemberships.getASingleGroupMembership` | `canvas.api.groupMemberships.getASingleGroupMembership` | `read` | Retrieve a single group membership by its membership_id |
| `groupMemberships.getASingleGroupMembership2` | `canvas.api.groupMemberships.getASingleGroupMembership2` | `read` | Retrieve a single group membership by user_id |
| `groups.addGroupToFavorites` | `canvas.api.groups.addGroupToFavorites` | `write` | Add a group to the current user favorites |
| `groups.createGroup` | `canvas.api.groups.createGroup` | `write` | Create a new community group directly |
| `groups.deleteGroup` | `canvas.api.groups.deleteGroup` | `destructive` | Deletes a group and removes all members |
| `groups.getGroup` | `canvas.api.groups.getGroup` | `read` | Retrieves detailed information for a single Canvas group |
| `groups.getGroupActivityStreamSummary` | `canvas.api.groups.getGroupActivityStreamSummary` | `read` | Retrieves a summary of the group-specific activity stream |
| `groups.getGroupPermissions` | `canvas.api.groups.getGroupPermissions` | `read` | Returns permission information for the calling user in the group |
| `latePolicy.getALatePolicy` | `canvas.api.latePolicy.getALatePolicy` | `read` | Retrieve the late policy for a Canvas course |
| `modules.createModule` | `canvas.api.modules.createModule` | `write` | Creates a new organizational module within a specified Canvas LMS course |
| `modules.createModuleGraphQl` | `canvas.api.modules.createModuleGraphQl` | `write` | Create a new module in a Canvas course via GraphQL |
| `modules.createModuleItem` | `canvas.api.modules.createModuleItem` | `write` | Create and return a new module item within a Canvas course module |
| `modules.getModuleItem` | `canvas.api.modules.getModuleItem` | `write` | Retrieve information about a specific module item by ID using GraphQL |
| `modules.getModuleItemSequence` | `canvas.api.modules.getModuleItemSequence` | `read` | Find the module item sequence for a given asset in a Canvas course |
| `outcomeGroups.createLinkOutcomeCourses` | `canvas.api.outcomeGroups.createLinkOutcomeCourses` | `write` | Link an existing outcome or create a new outcome within a course |
| `outcomeGroups.createSubgroupCourses` | `canvas.api.outcomeGroups.createSubgroupCourses` | `write` | Creates a new empty subgroup under the outcome group |
| `outcomeGroups.deleteAnOutcomeGroupCourses` | `canvas.api.outcomeGroups.deleteAnOutcomeGroupCourses` | `destructive` | Deletes an outcome group from a course |
| `outcomeGroups.getAccountsOutcomeGroups` | `canvas.api.outcomeGroups.getAccountsOutcomeGroups` | `read` | Retrieve a specific outcome group from a Canvas account |
| `outcomeGroups.getAllOutcomeGroupsForContext` | `canvas.api.outcomeGroups.getAllOutcomeGroupsForContext` | `read` | Retrieve all outcome groups for an account context |
| `outcomeGroups.getAllOutcomeGroupsForContext2` | `canvas.api.outcomeGroups.getAllOutcomeGroupsForContext2` | `read` | Retrieve all outcome groups for a course context |
| `outcomeGroups.getAllOutcomeLinksForContext` | `canvas.api.outcomeGroups.getAllOutcomeLinksForContext` | `read` | Retrieves all outcome links for an account context |
| `outcomeGroups.getAllOutcomeLinksForContext2` | `canvas.api.outcomeGroups.getAllOutcomeLinksForContext2` | `read` | Retrieves all outcome links for a course context |
| `outcomeGroups.getGlobalOutcomeGroup` | `canvas.api.outcomeGroups.getGlobalOutcomeGroup` | `read` | Retrieves a global outcome group by ID from Canvas |
| `outcomeGroups.getRootOutcomeGroupForCourse` | `canvas.api.outcomeGroups.getRootOutcomeGroupForCourse` | `read` | Retrieves the root outcome group for a specified course context |
| `outcomes.createLearningOutcome` | `canvas.api.outcomes.createLearningOutcome` | `write` | Create a new learning outcome in Canvas using GraphQL |
| `outcomes.deleteOutcomeLinks` | `canvas.api.outcomes.deleteOutcomeLinks` | `destructive` | Delete links between outcomes and content in Canvas |
| `outcomes.getAlignedAssignmentsForAnOutcome` | `canvas.api.outcomes.getAlignedAssignmentsForAnOutcome` | `read` | Retrieves outcome alignments for a student or assignment |
| `outcomes.getOutcomeResults` | `canvas.api.outcomes.getOutcomeResults` | `read` | Get outcome results for users and outcomes in a course context |
| `pages.createPageForCourse` | `canvas.api.pages.createPageForCourse` | `write` | Creates a new wiki page in a specified Canvas course |
| `pages.createPageForGroup` | `canvas.api.pages.createPageForGroup` | `write` | Creates a new wiki page in a specified Canvas group |
| `pages.deletePageForGroup` | `canvas.api.pages.deletePageForGroup` | `destructive` | Deletes a wiki page from a Canvas group |
| `pages.getPageForCourse` | `canvas.api.pages.getPageForCourse` | `read` | Retrieves a specific content page by its URL or ID from a course |
| `peerReviews.getAllPeerReviews` | `canvas.api.peerReviews.getAllPeerReviews` | `read` | Retrieves all peer reviews for a specific submission |
| `peerReviews.getAllPeerReviewsForSectionAssignment` | `canvas.api.peerReviews.getAllPeerReviewsForSectionAssignment` | `read` | Retrieves all peer reviews for a specific assignment within a section |
| `peerReviews.getAllPeerReviewsForSectionSubmission` | `canvas.api.peerReviews.getAllPeerReviewsForSectionSubmission` | `read` | Retrieves all peer reviews for a specific submission within a section |
| `planner.createPlannerNote` | `canvas.api.planner.createPlannerNote` | `write` | Create a planner note for the current user |
| `planner.createPlannerOverride` | `canvas.api.planner.createPlannerOverride` | `write` | Create a planner override for the current user |
| `planner.deletePlannerNote` | `canvas.api.planner.deletePlannerNote` | `destructive` | Delete a planner note for the current user |
| `planner.deletePlannerOverride` | `canvas.api.planner.deletePlannerOverride` | `destructive` | Delete a planner override for the current user |
| `polls.createSinglePoll` | `canvas.api.polls.createSinglePoll` | `write` | Create a new poll for the current user in Canvas |
| `polls.createSinglePollChoice` | `canvas.api.polls.createSinglePollChoice` | `write` | Create one or more poll choices for an existing poll |
| `polls.createSinglePollSession` | `canvas.api.polls.createSinglePollSession` | `write` | Create a new poll session for a poll in Canvas |
| `polls.createSinglePollSubmission` | `canvas.api.polls.createSinglePollSubmission` | `write` | Create a new poll submission for a poll session |
| `polls.deletePoll` | `canvas.api.polls.deletePoll` | `destructive` | Permanently deletes the poll identified by id |
| `polls.deletePollChoice` | `canvas.api.polls.deletePollChoice` | `destructive` | Delete a poll choice from a Canvas poll |
| `polls.deletePollSession` | `canvas.api.polls.deletePollSession` | `destructive` | Permanently delete a poll session from a poll |
| `polls.getSinglePoll` | `canvas.api.polls.getSinglePoll` | `read` | Retrieve a single poll by its ID from Canvas |
| `polls.getSinglePollChoice` | `canvas.api.polls.getSinglePollChoice` | `read` | Retrieve a single poll choice by its ID |
| `quizReports.abortQuizReportGeneration` | `canvas.api.quizReports.abortQuizReportGeneration` | `destructive` | Aborts the generation of a quiz report or removes a previously generated one |
| `quizReports.createQuizReport` | `canvas.api.quizReports.createQuizReport` | `write` | Create a quiz report in Canvas (student or item analysis) |
| `quizReports.getQuizReport` | `canvas.api.quizReports.getQuizReport` | `read` | Retrieves the data for a single quiz report |
| `quizzes.answerQuizQuestions` | `canvas.api.quizzes.answerQuizQuestions` | `write` | Provide or update answers to quiz questions for a quiz submission |
| `quizzes.createQuestionGroup` | `canvas.api.quizzes.createQuestionGroup` | `write` | Create one or more question groups for a quiz |
| `quizzes.createQuiz` | `canvas.api.quizzes.createQuiz` | `write` | Creates a new quiz with various settings in a Canvas course |
| `quizzes.createQuizQuestion` | `canvas.api.quizzes.createQuizQuestion` | `write` | Creates a new question for an existing quiz within a course |
| `quizzes.createQuizSubmission` | `canvas.api.quizzes.createQuizSubmission` | `write` | Start taking a quiz by creating a quiz submission |
| `quizzes.deleteQuiz` | `canvas.api.quizzes.deleteQuiz` | `destructive` | Permanently deletes the quiz identified by quiz_id from the course |
| `quizzes.editQuiz` | `canvas.api.quizzes.editQuiz` | `write` | Modifies an existing Canvas quiz |
| `quizzes.getQuizStatistics` | `canvas.api.quizzes.getQuizStatistics` | `read` | Fetch the latest quiz statistics for a Canvas quiz |
| `quizzes.getSingleQuiz` | `canvas.api.quizzes.getSingleQuiz` | `read` | Retrieves detailed information for a specific quiz in a course |
| `rubrics.createRubric` | `canvas.api.rubrics.createRubric` | `write` | Create a rubric in a Canvas course |
| `rubrics.getAssignmentRubric` | `canvas.api.rubrics.getAssignmentRubric` | `read` | Fetches the detailed rubric for a specified assignment |
| `rubrics.getRubricAssessmentsReadState` | `canvas.api.rubrics.getRubricAssessmentsReadState` | `read` | Check whether rubric comments/grading have been seen by the student |
| `rubrics.getRubricsUploadTemplate` | `canvas.api.rubrics.getRubricsUploadTemplate` | `read` | Retrieve a CSV template file for importing rubrics |
| `submissions.createSubmissionDraft` | `canvas.api.submissions.createSubmissionDraft` | `write` | Create a draft submission for an assignment in Canvas via GraphQL |
| `submissions.deleteSubmissionDraft` | `canvas.api.submissions.deleteSubmissionDraft` | `destructive` | Delete a submission draft in Canvas via GraphQL |
| `submissions.getAUsersMostRecentlyGraded` | `canvas.api.submissions.getAUsersMostRecentlyGraded` | `read` | Retrieves a user most recently graded submissions |
| `userCustomData.createUsersCustomData` | `canvas.api.userCustomData.createUsersCustomData` | `write` | Create or update custom data for a Canvas user within a specified namespace |
| `userCustomData.deleteCustomData` | `canvas.api.userCustomData.deleteCustomData` | `destructive` | Delete custom user data for a given namespace |
| `userCustomData.deleteUsersCustomDataScope` | `canvas.api.userCustomData.deleteUsersCustomDataScope` | `destructive` | Delete custom user data at a specific scope path |
| `userCustomData.getUsersCustomDataScope` | `canvas.api.userCustomData.getUsersCustomDataScope` | `read` | Retrieve custom data stored for a Canvas user |
| `userInboxLabels.createUserInboxLabel` | `canvas.api.userInboxLabels.createUserInboxLabel` | `write` | Create new user inbox labels in Canvas |
| `userInboxLabels.deleteUserInboxLabel` | `canvas.api.userInboxLabels.deleteUserInboxLabel` | `destructive` | Delete user inbox labels in Canvas |
| `users.editUser` | `canvas.api.users.editUser` | `write` | Modifies an existing Canvas user profile and settings |
| `users.getAllUsers` | `canvas.api.users.getAllUsers` | `read` | Retrieves a list of users for a specified Canvas account |
| `users.getCurrentUser` | `canvas.api.users.getCurrentUser` | `read` | Retrieves detailed information about the currently authenticated user |
| `users.getCustomColor` | `canvas.api.users.getCustomColor` | `read` | Retrieve the custom color for a specific course or context |
| `users.getCustomColors` | `canvas.api.users.getCustomColors` | `read` | Retrieve all custom colors saved by a user in Canvas LMS |
| `users.getDashboardPositions` | `canvas.api.users.getDashboardPositions` | `read` | Retrieve all dashboard positions saved for a user |
| `users.getSingleUser` | `canvas.api.users.getSingleUser` | `read` | Retrieves detailed information for a single user in a Canvas course |
| `users.getUserAvatars` | `canvas.api.users.getUserAvatars` | `read` | Retrieve available avatar options for a Canvas user |
| `users.getUserProfile` | `canvas.api.users.getUserProfile` | `read` | Retrieves profile information for an existing Canvas user |
| `userTokens.createUsersTokens` | `canvas.api.userTokens.createUsersTokens` | `write` | Create a new access token for a Canvas user |
| `userTokens.deleteAccessToken` | `canvas.api.userTokens.deleteAccessToken` | `destructive` | Delete an access token for a Canvas user |
| `userTokens.getUsersTokens` | `canvas.api.userTokens.getUsersTokens` | `read` | Retrieves detailed information about a specific access token |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 6 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/canvas

## License

Apache-2.0

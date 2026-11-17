import type { TeamworkJsonValue } from './operation-types';

type TeamworkV1Output_TeamPickerObject = TeamworkV1Output_TeamSingleObject & {
	isInPrivacy?: boolean;
	isResponsible?: boolean;
	isFollowingChanges?: boolean;
	isFollowingComments?: boolean;
	hasAccess?: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV1Output_TeamSingleObject = {
	createdByUserId?: string;
	name?: string;
	logoIcon?: string;
	deletedDate?: string;
	handle?: string;
	dateUpdated?: string;
	company?: { name?: string; id?: string } & Record<string, TeamworkJsonValue>;
	parentTeam?: { name?: string; handle?: string; id?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	rootTeam?: { name?: string; handle?: string; id?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	numMembers?: string;
	projectId?: string;
	logoUrl?: string;
	members?: Array<
		{ id?: string; name?: string } & Record<string, TeamworkJsonValue>
	>;
	logoColor?: string;
	numDirectChildren?: string;
	canEdit?: boolean;
	updatedByUserId?: string;
	isPrivate?: boolean;
	id?: string;
	dateCreated?: string;
	defaultProjectIds?: string;
	numSubteams?: string;
	deleted?: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV1Output_TeamsMultipleResponse = {
	STATUS?: string;
	teams?: Array<TeamworkV1Output_TeamSingleObject>;
	users?: Record<string, TeamworkJsonValue>;
	projects?: Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV1Output_TeamsPickerResponse = {
	STATUS?: string;
	included?: Array<TeamworkV1Output_TeamPickerObject>;
	teams?: Array<TeamworkV1Output_TeamPickerObject>;
	users?: Record<string, TeamworkJsonValue>;
	projects?: Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV1Output_TeamsSingleResponse = {
	STATUS?: string;
	team?: TeamworkV1Output_TeamSingleObject;
	users?: Record<string, TeamworkJsonValue>;
	projects?: Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;

export type TeamworkV1Inputs = {
	'projects.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: {
			project?: {
				name?: string;
				'use-tasks'?: boolean;
				'use-milestones'?: boolean;
				'use-messages'?: boolean;
				'use-files'?: boolean;
				'use-time'?: boolean;
				'use-notebook'?: boolean;
				'use-riskregister'?: boolean;
				'use-links'?: boolean;
				'use-billing'?: boolean;
				'use-comments'?: boolean;
				'category-id'?: number;
				'start-date'?: string;
				'end-date'?: string;
				tagIds?: string;
				onboarding?: boolean;
				'grant-access-to'?: string;
				private?: boolean;
				customFields?: Array<{ customFieldId?: number; value?: string }>;
				people?: number;
				projectOwnerId?: number;
				companyId?: number;
			};
		};
	};
	'projects.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			project?: {
				name?: string;
				'use-tasks'?: boolean;
				'use-milestones'?: boolean;
				'use-messages'?: boolean;
				'use-files'?: boolean;
				'use-time'?: boolean;
				'use-notebook'?: boolean;
				'use-riskregister'?: boolean;
				'use-links'?: boolean;
				'use-billing'?: boolean;
				'use-comments'?: boolean;
				'category-id'?: number;
				'start-date'?: string;
				'end-date'?: string;
				tagIds?: string;
				onboarding?: boolean;
				templateDateTargetDefault?: string;
				'grant-access-to'?: string;
				private?: boolean;
				customFields?: Array<{ customFieldId?: number; value?: string }>;
				people?: string;
				projectOwnerId?: string;
				companyId?: number;
			};
		};
	};
	'projects.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'projects.clone': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			cloneProjectName?: string;
			cloneProjectAction?: 'COPY' | 'MOVE';
			companyId?: number;
			copyFiles?: boolean;
			copyMessages?: boolean;
			copyMilestones?: boolean;
			copyTasks?: boolean;
			copyTasklists?: boolean;
			copyNotebooks?: boolean;
			copyLinks?: boolean;
			copyComments?: boolean;
			copyFollowers?: boolean;
			copyInvoices?: boolean;
			copyTimelogs?: boolean;
			copyExpenses?: boolean;
			copyWebhooks?: boolean;
			copyProjectRoles?: boolean;
			copyCustomFields?: boolean;
			copyCustomItems?: boolean;
			copyProjectUpdates?: boolean;
			copyRisks?: boolean;
			copyForms?: boolean;
			copyAutomations?: boolean;
			copyPeople?: boolean;
			copyProjectPrivacy?: boolean;
			copyBudgets?: boolean;
			copyAllocations?: boolean;
			copyLogo?: boolean;
			copyProjectPrefs?: boolean;
			newFromTemplate?: boolean;
			toTemplate?: boolean;
			templateDateTarget?: 'start' | 'end';
			targetDate?: string;
			daysOffset?: number;
		};
	};
	'projects.star': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'projects.getStats': {
		path: { id: string };
		query?: {
			'responsible-party-ids'?: string;
			onlymyprojects?: boolean;
			forStarredProjects?: boolean;
			onlyMyEvents?: boolean;
			getPermissions?: boolean;
			eventsInNext?: number;
		};
		body?: never;
	};
	'projects.getRates': {
		path: { id: string };
		query?: { page?: number; pageSize?: number };
		body?: never;
	};
	'projects.setRates': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			rates?: {
				users?: { '12345'?: { rate?: number }; '12346'?: { rate?: number } };
				'project-default'?: number;
			};
		};
	};
	'projectTemplates.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: {
			project?: {
				name?: string;
				'use-tasks'?: boolean;
				'use-milestones'?: boolean;
				'use-messages'?: boolean;
				'use-files'?: boolean;
				'use-time'?: boolean;
				'use-notebook'?: boolean;
				'use-riskregister'?: boolean;
				'use-links'?: boolean;
				'use-billing'?: boolean;
				'use-comments'?: boolean;
				'category-id'?: number;
				tags?: string;
				templateDateTargetDefault: string;
				people?: string;
				projectOwnerId?: string;
				companyId?: number;
				'grant-access-to'?: string;
			};
		};
	};
	'projectCategories.list': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'projectCategories.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'projectCategories.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'projectCategories.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'projectCategories.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'projectUpdates.create': {
		path: { projectId: string };
		query?: Record<string, never>;
		body?: { update?: { text?: string; health?: string }; notifyIds?: string };
	};
	'projectUpdates.update': {
		path: { updateId: string };
		query?: Record<string, never>;
		body?: { update?: { text?: string }; notifyIds?: string };
	};
	'projectUpdates.delete': {
		path: { updateId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'projectUpdates.request': {
		path: { projectId: string };
		query?: Record<string, never>;
		body?: { userId?: string; content?: string };
	};
	'projectPeople.getPermissions': {
		path: { projectId: number; personId: number };
		query?: Record<string, never>;
		body?: never;
	};
	'projectPeople.remove': {
		path: { projectId: number; personId: number };
		query?: Record<string, never>;
		body?: never;
	};
	'projectRoles.list': {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	'projectRoles.get': {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	'projectRoles.update': {
		path: { id: number };
		query?: Record<string, never>;
		body?: { role?: { users?: string; name?: string } };
	};
	'projectRoles.delete': {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	'tasks.complete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'tasks.uncomplete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'tasks.quickAdd': {
		path: { projectId: string };
		query?: Record<string, never>;
		body?: {
			content: string;
			tasklistId?: number;
			'creator-id'?: number;
			notify?: boolean;
			private?: boolean;
			'todo-item'?: {
				'responsible-party-id'?: string;
				'start-date'?: string;
				'due-date'?: string;
				priority?: string;
			};
		};
	};
	'tasks.quickAddSubtasks': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			content?: string;
			tasklistId?: number;
			'creator-id'?: number;
			notify?: boolean;
			private?: boolean;
			'todo-item'?: {
				'responsible-party-id'?: string;
				'start-date'?: string;
				'due-date'?: string;
				priority?: string;
			};
		};
	};
	'tasks.reorder': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { 'todo-items'?: Array<{ 'todo-item'?: { id?: string } }> };
	};
	'tasks.move': {
		path: { taskId: string };
		query?: Record<string, never>;
		body?: { taskId?: number; projectId?: number; tasklistId?: number };
	};
	'tasks.copy': {
		path: { taskId: string };
		query?: Record<string, never>;
		body?: { taskId?: number; projectId?: number; tasklistId?: number };
	};
	'tasks.setEstimate': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { taskId?: number; taskEstimatedMinutes?: number };
	};
	'tasks.listDependencies': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'tasks.listPredecessors': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'tasks.listRecurring': {
		path: { taskId: string };
		query?: { onlyFutureDates?: boolean };
		body?: never;
	};
	'tasklists.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			applyDefaultsToExistingTasks?: boolean;
			'todo-list'?: {
				'new-task-defaults'?: {
					'start-date-offset'?: string;
					'due-date-offset'?: string;
					'responsible-party-id'?: string;
					priority?: number;
					priorityText?: string;
					'estimated-minutes'?: number;
					tags?: Array<{
						id?: number;
						color?: string;
						name?: string;
						projectId?: number;
					}>;
					'column-id'?: number;
					reminders?: Array<{
						'user-id'?: number;
						type?: string;
						note?: string;
						'people-assigned'?: boolean;
						isRelative?: boolean;
						'relative-number-days'?: number;
						usingOffSetDueDate?: boolean;
						time?: string;
					}>;
					removeAllReminders?: boolean;
					'comment-follower-ids'?: string;
					'change-follower-ids'?: string;
					'grant-access-to'?: string;
					private?: boolean;
					customFields?: Array<{ customFieldId?: number; value?: string }>;
					pendingFileAttachments?: Array<Record<string, never>>;
				};
			};
		};
	};
	'tasklists.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			applyDefaultsToExistingTasks?: boolean;
			'todo-list'?: {
				'new-task-defaults'?: {
					'start-date-offset'?: string;
					'due-date-offset'?: string;
					'responsible-party-id'?: string;
					priority?: number;
					priorityText?: string;
					'estimated-minutes'?: number;
					tags?: Array<{
						id?: number;
						color?: string;
						name?: string;
						projectId?: number;
					}>;
					'column-id'?: number;
					reminders?: Array<{
						'user-id'?: number;
						type?: string;
						note?: string;
						'people-assigned'?: boolean;
						isRelative?: boolean;
						'relative-number-days'?: number;
						usingOffSetDueDate?: boolean;
						time?: string;
					}>;
					removeAllReminders?: boolean;
					'comment-follower-ids'?: string;
					'change-follower-ids'?: string;
					'grant-access-to'?: string;
					private?: boolean;
					customFields?: Array<{ customFieldId?: number; value?: string }>;
					pendingFileAttachments?: Array<Record<string, never>>;
				};
			};
		};
	};
	'tasklists.reorder': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { 'todo-lists'?: Array<{ 'todo-list'?: { id?: string } }> };
	};
	'tasklists.copy': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { projectId?: number; includeCompletedTasks?: number };
	};
	'tasklists.move': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { projectId: string };
	};
	'milestones.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			milestone?: {
				changeFollowerIds?: string;
				deadline?: string;
				notify?: boolean;
				'responsible-party-ids'?: string;
				tagIds?: string;
				reminder?: boolean;
				taskListIds?: Array<string>;
				'grant-access-to'?: string;
				private?: boolean;
			};
			'move-upcoming-milestones'?: boolean;
			'move-upcoming-milestones-off-weekends'?: boolean;
		};
	};
	'milestones.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			milestone?: {
				changeFollowerIds?: string;
				deadline?: string;
				notify?: boolean;
				'responsible-party-ids'?: string;
				tagIds?: string;
				reminder?: boolean;
				taskListIds?: Array<string>;
				'grant-access-to'?: string;
				private?: boolean;
			};
			'move-upcoming-milestones'?: boolean;
			'move-upcoming-milestones-off-weekends'?: boolean;
		};
	};
	'milestones.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'milestones.complete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'milestones.uncomplete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'people.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: {
			person?: {
				startPage?: string;
				'email-address'?: string;
				'first-name'?: string;
				'last-name'?: string;
				'company-id'?: number;
				sendInvite?: boolean;
				'phone-number-office'?: string;
				'phone-number-office-ext'?: string;
				'phone-number-mobile-countrycode'?: string;
				'phone-number-mobile-prefix'?: string;
				'phone-number-mobile'?: string;
				'phone-number-home'?: string;
				'phone-number-fax'?: string;
				'email-alt-1'?: string;
				'email-alt-2'?: string;
				'email-alt-3'?: string;
				address?: {
					line1?: string;
					line2?: string;
					city?: string;
					state?: string;
					zipcode?: string;
					countrycode?: string;
				};
				profile?: string;
				userTwitterName?: string;
				userLinkedin?: string;
				userFacebook?: string;
				userWebsite?: string;
				'im-service'?: string;
				'im-handle'?: string;
				language?: string;
				dateFormatId?: number;
				timeFormatId?: number;
				timezoneId?: number;
				calendarStartsOnSunday?: string;
				lengthOfDay?: number;
				workingHours?: {
					entries?: Array<{ weekday?: string; taskHours?: number }>;
				};
				changeForEveryone?: boolean;
				administrator?: boolean;
				canAddProjects?: boolean;
				canManagePeople?: boolean;
				autoGiveProjectAccess?: boolean;
				canAccessCalendar?: boolean;
				canAccessTemplates?: boolean;
				canAccessPortfolio?: boolean;
				canManageCustomFields?: boolean;
				canManagePortfolio?: boolean;
				canManageProjectTemplates?: boolean;
				canViewProjectTemplates?: boolean;
				notifyOnTaskComplete?: boolean;
				'notify-on-added-as-follower'?: boolean;
				'notify-on-status-update'?: boolean;
				textFormat?: string;
				useShorthandDurations?: boolean;
				userReceiveNotifyWarnings?: boolean;
				userReceiveMyNotificationsOnly?: boolean;
				receiveDailyReports?: boolean;
				receiveDailyReportsAtWeekend?: boolean;
				receiveDailyReportsIfEmpty?: boolean;
				soundAlertsEnabled?: boolean;
				dailyReportSort?: string;
				receiveDailyReportsAtTime?: string;
				dailyReportEventsType?: string;
				dailyReportDaysFilter?: number;
				avatarPendingFileRef?: string;
				removeAvatar?: boolean;
				allowEmailNotifications?: boolean;
				'user-type'?: string;
				privateNotes?: string;
				getUserDetails?: boolean;
			};
		};
	};
	'people.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			person?: {
				startPage?: string;
				'email-address'?: string;
				'first-name'?: string;
				'last-name'?: string;
				'company-id'?: number;
				sendInvite?: boolean;
				'phone-number-office'?: string;
				'phone-number-office-ext'?: string;
				'phone-number-mobile-countrycode'?: string;
				'phone-number-mobile-prefix'?: string;
				'phone-number-mobile'?: string;
				'phone-number-home'?: string;
				'phone-number-fax'?: string;
				'email-alt-1'?: string;
				'email-alt-2'?: string;
				'email-alt-3'?: string;
				address?: {
					line1?: string;
					line2?: string;
					city?: string;
					state?: string;
					zipcode?: string;
					countrycode?: string;
				};
				profile?: string;
				userTwitterName?: string;
				userLinkedin?: string;
				userFacebook?: string;
				userWebsite?: string;
				'im-service'?: string;
				'im-handle'?: string;
				language?: string;
				dateFormatId?: number;
				timeFormatId?: number;
				timezoneId?: number;
				calendarStartsOnSunday?: string;
				lengthOfDay?: number;
				workingHours?: {
					entries?: Array<{ weekday?: string; taskHours?: number }>;
				};
				changeForEveryone?: boolean;
				administrator?: boolean;
				canAddProjects?: boolean;
				canManagePeople?: boolean;
				autoGiveProjectAccess?: boolean;
				canAccessCalendar?: boolean;
				canAccessTemplates?: boolean;
				canAccessPortfolio?: boolean;
				canManageCustomFields?: boolean;
				canManagePortfolio?: boolean;
				canManageProjectTemplates?: boolean;
				canViewProjectTemplates?: boolean;
				notifyOnTaskComplete?: boolean;
				'notify-on-added-as-follower'?: boolean;
				'notify-on-status-update'?: boolean;
				textFormat?: string;
				useShorthandDurations?: boolean;
				userReceiveNotifyWarnings?: boolean;
				userReceiveMyNotificationsOnly?: boolean;
				receiveDailyReports?: boolean;
				receiveDailyReportsAtWeekend?: boolean;
				receiveDailyReportsIfEmpty?: boolean;
				soundAlertsEnabled?: boolean;
				dailyReportSort?: string;
				receiveDailyReportsAtTime?: string;
				dailyReportEventsType?: string;
				dailyReportDaysFilter?: number;
				avatarPendingFileRef?: string;
				removeAvatar?: boolean;
				allowEmailNotifications?: boolean;
				'user-type'?: string;
				privateNotes?: string;
				getUserDetails?: boolean;
			};
		};
	};
	'people.listDeleted': {
		path?: Record<string, never>;
		query?: { groupByCompany?: boolean };
		body?: never;
	};
	'people.myStats': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'statuses.getMine': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'statuses.getForPerson': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'statuses.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			userStatus?: {
				status?: string;
				notify?: boolean;
				notifyIds?: Array<Record<string, never>>;
			};
		};
	};
	'statuses.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { userstatus?: { status?: string; notify?: string } };
	};
	'statuses.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'companies.listForProject': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'comments.create': {
		path: { resource: string; resourceId: string };
		query?: Record<string, never>;
		body?: {
			comment?: {
				body?: string;
				notify?: string;
				isprivate?: boolean;
				pendingFileAttachments?: string;
				'content-type'?: string;
			};
		};
	};
	'comments.update': {
		path: { id: number };
		query?: Record<string, never>;
		body?: {
			comment: {
				body: string;
				notify?: string;
				isprivate?: boolean;
				pendingFileAttachments?: string;
				'content-type'?: string;
			};
		};
	};
	'comments.delete': {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	'comments.markRead': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'files.listForProject': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'files.listForTask': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'files.addToProject': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			file?: {
				name?: string;
				private?: number;
				'category-id'?: number;
				'category-name'?: string;
				pendingFileRef?: string;
				tags?: Array<string>;
				notify?: string;
				notifyCurrentUser?: boolean;
				autoNewVersion?: boolean;
				'grant-access-to'?: string;
				tagIds?: Array<number>;
			};
		};
	};
	'files.addToTask': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			task?: {
				pendingFileAttachments?: Array<string>;
				updateFiles?: boolean;
				removeOtherFiles?: boolean;
				attachments?: string;
				attachmentsCategoryIds?: string;
				pendingFileAttachmentsCategoryIds?: string;
			};
		};
	};
	'files.addVersion': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { fileversion?: { pendingFileRef?: string } };
	};
	'files.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'files.getShareLink': {
		path: { id: string };
		query?: { version?: string };
		body?: never;
	};
	'files.copy': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { projectId?: number };
	};
	'fileCategories.list': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'fileCategories.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'fileCategories.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'fileCategories.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'fileCategories.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'links.list': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'links.listForProject': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'links.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'links.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			link?: {
				notify?: string;
				'notify-current-user'?: boolean;
				code?: string;
				'category-id'?: number;
				width?: string;
				height?: string;
				name?: string;
				tagIds?: string;
				'grant-access-to'?: string;
				private?: boolean;
			};
		};
	};
	'links.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			link?: {
				notify?: string;
				'notify-current-user'?: boolean;
				code?: string;
				'category-id'?: number;
				width?: string;
				height?: string;
				name?: string;
				tagIds?: string;
				'grant-access-to'?: string;
				private?: boolean;
			};
		};
	};
	'links.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'linkCategories.list': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'linkCategories.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'linkCategories.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'linkCategories.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'notebooks.lock': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'notebooks.unlock': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'notebooks.copy': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { projectId?: number };
	};
	'notebooks.move': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { projectId?: number };
	};
	'notebookCategories.list': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'notebookCategories.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'notebookCategories.create': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'notebookCategories.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { category?: { name?: string; 'parent-id'?: string } };
	};
	'notebookCategories.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'boardColumns.list': {
		path: { id: number };
		query?: {
			page?: number;
			pageSize?: number;
			showDeleted?: boolean;
			sortBy?: string;
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			includeDefaults?: boolean;
			get?: string;
			updatedAfterDate?: string;
			getStats?: boolean;
		};
		body?: never;
	};
	'boardColumns.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'boardColumns.create': {
		path: { id: number };
		query?: Record<string, never>;
		body?: { column?: { name?: string; color?: string } };
	};
	'boardColumns.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { column?: { name?: string; color?: string } };
	};
	'boardColumns.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'boardCards.list': {
		path: { id: string };
		query?: {
			page?: number;
			pageSize?: number;
			showDeleted?: boolean;
			deletedAfterDate?: string;
			updatedAfterDate?: string;
			searchTerm?: string;
		};
		body?: never;
	};
	'boardCards.get': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'boardCards.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			card?: {
				content?: string;
				taskListId?: string;
				'start-date'?: string;
				'due-date'?: string;
				'responsible-party-id'?: string;
				'estimated-minutes'?: number;
				priority?: string;
				progress?: string;
				tags?: string;
			};
		};
	};
	'boardCards.move': {
		path: { id: number };
		query?: Record<string, never>;
		body?: { cardId?: number; positionAfterId?: number; columnId?: number };
	};
	'boardCards.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioBoards.list': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioBoards.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: { board?: { name?: string; color?: string } };
	};
	'portfolioBoards.update': {
		path: { boardId: string };
		query?: Record<string, never>;
		body?: { board?: { name?: string; color?: string } };
	};
	'portfolioBoards.delete': {
		path: { boardId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioColumns.list': {
		path: { boardId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioColumns.get': {
		path: { columnId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioColumns.create': {
		path: { boardId: string };
		query?: Record<string, never>;
		body?: { column?: { color?: string; name?: string } };
	};
	'portfolioColumns.delete': {
		path: { columnId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioCards.list': {
		path: { columnId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioCards.get': {
		path: { cardId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'portfolioCards.add': {
		path: { columnId: string };
		query?: Record<string, never>;
		body?: { card?: { projectId?: string } };
	};
	'portfolioCards.move': {
		path: { cardId: string };
		query?: Record<string, never>;
		body?: {
			cardId?: string;
			positionAfterId?: number;
			columnId?: string;
			oldColumnId?: string;
		};
	};
	'portfolioCards.delete': {
		path: { cardId: string };
		query?: Record<string, never>;
		body?: never;
	};
	'teams.list': {
		path?: Record<string, never>;
		query?: {
			include?: string;
			page?: number;
			pageSize?: number;
			sortBy?: 'name' | 'picker' | 'dateAdded';
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			showDeleted?: boolean;
			updatedAfterDate?: string;
			projectIds?: string;
			userIds?: string;
			teamIds?: string;
			companyIds?: string;
			parentTeamIds?: string;
			excludeTeamIds?: string;
			excludeProjectId?: number;
			excludeDefaultProjectIds?: string;
			projectCompanyId?: number;
			includeGlobalTeams?: boolean;
			includeCompanyTeams?: boolean;
			includeProjectTeams?: boolean;
			includePrivateTeams?: boolean;
			includeSubteams?: boolean;
			onlyGlobalTeamsWithProjectMembers?: boolean;
			format?: 'list' | 'tree';
			isInPrivacyOfProjectId?: number;
		};
		body?: never;
	};
	'teams.get': {
		path: { id: string };
		query?: {
			includeSubteams?: boolean;
			include?: 'members';
			showDeleted?: boolean;
			getEmoji?: boolean;
		};
		body?: never;
	};
	'teams.create': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: {
			person?: {
				parentTeamId?: number;
				name?: string;
				logoPendingFileRef?: string;
				logoIcon?: string;
				logoColor?: string;
				handle?: string;
				companyId?: number;
				projectId?: number;
				userIds?: string;
				defaultProjectIds?: string;
				isPrivate?: boolean;
				get?: string;
			};
		};
	};
	'teams.update': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			person?: {
				parentTeamId?: number;
				name?: string;
				logoPendingFileRef?: string;
				logoIcon?: string;
				logoColor?: string;
				handle?: string;
				companyId?: number;
				projectId?: number;
				userIds?: string;
				defaultProjectIds?: string;
				isPrivate?: boolean;
				removeLogo?: boolean;
				get?: string;
			};
		};
	};
	'teams.delete': {
		path: { id: string };
		query?: Record<string, never>;
		body?: never;
	};
	'teams.setMembers': {
		path: { id: string };
		query?: Record<string, never>;
		body?: { userIds?: string; action?: 'add' | 'replace' };
	};
	'teams.listSubteams': {
		path: { id: string };
		query?: {
			include?: string;
			page?: number;
			pageSize?: number;
			sortBy?: 'name' | 'picker' | 'dateAdded';
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			showDeleted?: boolean;
			updatedAfterDate?: string;
			projectIds?: string;
			userIds?: string;
			teamIds?: string;
			companyIds?: string;
			excludeTeamIds?: string;
			excludeProjectId?: number;
			excludeDefaultProjectIds?: string;
			projectCompanyId?: number;
			includeGlobalTeams?: boolean;
			includeCompanyTeams?: boolean;
			includeProjectTeams?: boolean;
			includePrivateTeams?: boolean;
			onlyGlobalTeamsWithProjectMembers?: boolean;
			format?: 'list' | 'tree';
			isInPrivacyOfProjectId?: number;
		};
		body?: never;
	};
	'teams.listMemberIds': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'teams.createForProject': {
		path: { id: string };
		query?: Record<string, never>;
		body?: {
			person?: {
				parentTeamId?: number;
				name?: string;
				logoPendingFileRef?: string;
				logoIcon?: string;
				logoColor?: string;
				handle?: string;
				userIds?: string;
				defaultProjectIds?: string;
				isPrivate?: boolean;
				get?: string;
			};
		};
	};
	'teams.listForProject': {
		path: { id: string };
		query?: {
			include?: string;
			page?: number;
			pageSize?: number;
			sortBy?: 'name' | 'picker' | 'dateAdded';
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			showDeleted?: boolean;
			updatedAfterDate?: string;
			userIds?: string;
			teamIds?: string;
			companyIds?: string;
			parentTeamIds?: string;
			excludeTeamIds?: string;
			excludeProjectId?: number;
			excludeDefaultProjectIds?: string;
			projectCompanyId?: number;
			includeGlobalTeams?: boolean;
			includeCompanyTeams?: boolean;
			includeProjectTeams?: boolean;
			includePrivateTeams?: boolean;
			includeSubteams?: boolean;
			onlyGlobalTeamsWithProjectMembers?: boolean;
			format?: 'list' | 'tree';
			isInPrivacyOfProjectId?: number;
		};
		body?: never;
	};
	'teams.listForCompany': {
		path: { id: string };
		query?: {
			include?: string;
			page?: number;
			pageSize?: number;
			sortBy?: 'name' | 'picker' | 'dateAdded';
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			showDeleted?: boolean;
			updatedAfterDate?: string;
			projectIds?: string;
			userIds?: string;
			teamIds?: string;
			companyIds?: string;
			parentTeamIds?: string;
			excludeTeamIds?: string;
			excludeProjectId?: number;
			excludeDefaultProjectIds?: string;
			projectCompanyId?: number;
			includeGlobalTeams?: boolean;
			includeCompanyTeams?: boolean;
			includeProjectTeams?: boolean;
			includeSubteams?: boolean;
			onlyGlobalTeamsWithProjectMembers?: boolean;
			format?: 'list' | 'tree';
			isInPrivacyOfProjectId?: number;
		};
		body?: never;
	};
	'teams.listForPerson': {
		path: { id: string };
		query?: {
			include?: string;
			page?: number;
			pageSize?: number;
			sortBy?: 'name' | 'picker' | 'dateAdded';
			sortOrder?: 'asc' | 'desc';
			searchTerm?: string;
			getEmoji?: boolean;
			showDeleted?: boolean;
			updatedAfterDate?: string;
			projectIds?: string;
			teamIds?: string;
			companyIds?: string;
			parentTeamIds?: string;
			excludeTeamIds?: string;
			excludeProjectId?: number;
			excludeDefaultProjectIds?: string;
			projectCompanyId?: number;
			includeGlobalTeams?: boolean;
			includeCompanyTeams?: boolean;
			includePrivateTeams?: boolean;
			onlyGlobalTeamsWithProjectMembers?: boolean;
			format?: 'list' | 'tree';
			isInPrivacyOfProjectId?: number;
		};
		body?: never;
	};
	'time.estimatedTotals': {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	'time.loggedByPerson': {
		path: { id: string };
		query?: { m?: string; y?: string; page?: number; pageSize?: number };
		body?: never;
	};
};

export type TeamworkV1Outputs = {
	'projects.create': { id?: string; STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projects.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'projects.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'projects.clone': { projectId?: number } & Record<string, TeamworkJsonValue>;
	'projects.star': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'projects.getStats': {
		STATUS?: string;
		stats?: {
			tasks?: {
				nodate?: string;
				today?: string;
				late?: string;
				complete?: string;
				upcoming?: string;
				active?: string;
			} & Record<string, TeamworkJsonValue>;
			columns?: { count?: string } & Record<string, TeamworkJsonValue>;
			billing?: { completed?: string; active?: string } & Record<
				string,
				TeamworkJsonValue
			>;
			events?: { today?: string; count?: string; hasEvents?: boolean } & Record<
				string,
				TeamworkJsonValue
			>;
			milestones?: {
				today?: string;
				late?: string;
				complete?: string;
				upcoming?: string;
				active?: string;
			} & Record<string, TeamworkJsonValue>;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'projects.getRates': {
		rates?: {
			users?: {
				'12345'?: { source?: string; rate?: string } & Record<
					string,
					TeamworkJsonValue
				>;
			} & Record<string, TeamworkJsonValue>;
			'account-default'?: string;
			'project-default'?: string;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projects.setRates': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'projectTemplates.create': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectCategories.list': {
		categories?: Array<
			{
				'parent-id'?: string;
				name?: string;
				count?: string;
				'elements-count'?: string;
				id?: string;
				color?: string;
				type?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'projectCategories.get': {
		category?: {
			'parent-id'?: string;
			name?: string;
			count?: string;
			id?: string;
			elements_count?: string;
			color?: string;
			type?: string;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectCategories.create': {
		categoryId?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectCategories.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectCategories.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectUpdates.create': {
		updateId?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectUpdates.update': {
		updateId?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectUpdates.delete': {
		updateId?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectUpdates.request': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectPeople.getPermissions': {
		people?: Array<
			{
				administrator?: boolean;
				'address-city'?: string;
				pid?: string;
				'site-owner'?: boolean;
				twitter?: string;
				'phone-number-home'?: string;
				'last-name'?: string;
				'email-address'?: string;
				userUUID?: string;
				'user-name'?: string;
				'company-name'?: string;
				id?: string;
				'last-changed-on'?: string;
				'phone-number-office'?: string;
				deleted?: boolean;
				'address-state'?: string;
				'address-country'?: string;
				notes?: string;
				'phone-number-mobile'?: string;
				'first-name'?: string;
				'user-type'?: string;
				permissions?: {
					'add-tasks'?: string;
					'view-time'?: string;
					'add-messages'?: string;
					'view-messages-and-files'?: string;
					'view-estimated-time'?: string;
					'view-tasks-and-milestones'?: string;
					'add-links'?: string;
					'view-notebooks'?: string;
					'view-invoices'?: string;
					'edit-all-tasks'?: string;
					'set-privacy'?: string;
					'add-milestones'?: string;
					'add-time'?: string;
					'is-observing'?: string;
					'view-all-time-logs'?: string;
					'add-taskLists'?: string;
					'project-administrator'?: string;
					'can-be-assigned-to-tasks-and-milestones'?: string;
					'view-links'?: string;
					'add-files'?: string;
					'can-receive-email'?: string;
					'add-notebooks'?: string;
					'add-people-to-project'?: string;
					'view-risk-register'?: string;
				} & Record<string, TeamworkJsonValue>;
				'im-service'?: string;
				'im-handle'?: string;
				'address-line-2'?: string;
				'address-line-1'?: string;
				'created-at'?: string;
				'phone-number-office-ext'?: string;
				'company-id'?: string;
				'has-access-to-new-projects'?: boolean;
				'address-zip'?: string;
				'phone-number-fax'?: string;
				'avatar-url'?: string;
				'in-owner-company'?: boolean;
				'last-login'?: string;
				'email-alt-1'?: string;
				'email-alt-2'?: string;
				companyId?: string;
				'email-alt-3'?: string;
			} & Record<string, TeamworkJsonValue>
		>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'projectPeople.remove': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectRoles.list': {
		roles?: Array<
			{
				users?: Array<
					{
						firstname?: string;
						id?: string;
						userimage?: string;
						lastname?: string;
					} & Record<string, TeamworkJsonValue>
				>;
				name?: string;
				id?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'projectRoles.get': {
		role?: {
			users?: Array<
				{
					firstname?: string;
					id?: string;
					userimage?: string;
					lastname?: string;
				} & Record<string, TeamworkJsonValue>
			>;
			name?: string;
			id?: string;
			projectId?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'projectRoles.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'projectRoles.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'tasks.complete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasks.uncomplete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasks.quickAdd': {
		tasklistId?: string;
		success?: string;
		taskIds?: string;
		STATUS?: string;
		failed?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.quickAddSubtasks': {
		tasklistId?: string;
		success?: string;
		taskIds?: string;
		STATUS?: string;
		failed?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.reorder': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasks.move': {
		STATUS?: string;
		affectedTaskIds?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.copy': {
		STATUS?: string;
		affectedTaskIds?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.setEstimate': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasks.listDependencies': {
		dependents?: Array<
			{
				'responsible-party-id'?: string;
				predecessorMust?: string;
				name?: string;
				id?: string;
				hardness?: string;
				projectId?: string;
				dependentCant?: string;
				'responsible-party-summary'?: string;
				'responsible-party-names'?: string;
			} & Record<string, TeamworkJsonValue>
		>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.listPredecessors': {
		predecessors?: Array<
			{
				'responsible-party-id'?: string;
				predecessorMust?: string;
				name?: string;
				id?: string;
				hardness?: string;
				projectType?: string;
				projectId?: string;
				dependentCant?: string;
				'responsible-party-summary'?: string;
				'responsible-party-names'?: string;
			} & Record<string, TeamworkJsonValue>
		>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasks.listRecurring': {
		'recurring-dates'?: Array<string>;
		'dates-set'?: Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasklists.create': {
		TASKLISTID?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'tasklists.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasklists.reorder': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasklists.copy': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'tasklists.move': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'milestones.create': {
		milestoneid?: number;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'milestones.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'milestones.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'milestones.complete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'milestones.uncomplete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'people.create': {
		id?: string;
		STATUS?: string;
		user?: {
			avatarUrl?: string;
			firstName?: string;
			id?: string;
			lastName?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'people.update': { id?: number; STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'people.listDeleted': {
		people?: Array<
			{
				avatarUrl?: string;
				deletedByUserFirstName?: string;
				companyName?: string;
				deletedByUserId?: string;
				deletedByUserLastName?: string;
				isInOwnerCompany?: boolean;
				firstName?: string;
				userType?: string;
				id?: string;
				deletedDateTime?: string;
				emailAddress?: string;
				companyId?: string;
				lastName?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'people.myStats': {
		STATUS?: string;
		stats?: {
			tasks?: { today?: string; late?: string; upcoming?: string } & Record<
				string,
				TeamworkJsonValue
			>;
			permissions?: {
				canLogTime?: boolean;
				canAddMilestones?: boolean;
				canAddTasks?: boolean;
				canAddMessages?: boolean;
			} & Record<string, TeamworkJsonValue>;
			events?: { count?: string; hasEvents?: boolean } & Record<
				string,
				TeamworkJsonValue
			>;
			milestones?: {
				today?: string;
				late?: string;
				complete?: string;
				upcoming?: string;
				active?: string;
			} & Record<string, TeamworkJsonValue>;
			projects?: {
				starred?: string;
				late?: string;
				count?: string;
				archived?: string;
				upcoming?: string;
				completed?: string;
				current?: string;
			} & Record<string, TeamworkJsonValue>;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'statuses.getMine': {
		userStatus?: {
			'first-name'?: string;
			'avatar-url'?: string;
			id?: string;
			status?: string;
			'last-name'?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'statuses.getForPerson': {
		userStatus?: {
			'first-name'?: string;
			'avatar-url'?: string;
			id?: string;
			status?: string;
			'last-name'?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'statuses.create': Record<string, TeamworkJsonValue>;
	'statuses.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'statuses.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'companies.listForProject': {
		companies?: Array<
			{
				state?: string;
				name?: string;
				address_two?: string;
				email_one?: string;
				country?: string;
				isowner?: string;
				email_three?: string;
				contacts?: string;
				industry?: string;
				'logo-URL'?: string;
				address_one?: string;
				website?: string;
				cid?: string;
				email_two?: string;
				accounts?: string;
				phone?: string;
				company_name_url?: string;
				countrycode?: string;
				can_see_private?: boolean;
				zip?: string;
				id?: string;
				city?: string;
				fax?: string;
			} & Record<string, TeamworkJsonValue>
		>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'comments.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'comments.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'comments.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'comments.markRead': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'files.listForProject': {
		project?: {
			company?: string;
			name?: string;
			files?: Array<
				{
					'project-id'?: string;
					'uploaded-by-user-last-name'?: string;
					name?: string;
					'uploaded-date'?: string;
					'uploaded-by-userId'?: string;
					extraData?: string;
					'comments-count'?: string;
					'version-id'?: string;
					private?: string;
					status?: string;
					'category-id'?: string;
					version?: string;
					originalName?: string;
					id?: string;
					'last-changed-on'?: string;
					size?: string;
					versions?: Array<Record<string, TeamworkJsonValue>>;
					thumbURL?: string;
					'file-source'?: string;
					'uploaded-by-user-first-name'?: string;
					'category-name'?: string;
				} & Record<string, TeamworkJsonValue>
			>;
			id?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'files.listForTask': {
		project?: {
			company?: string;
			name?: string;
			files?: Array<
				{
					'project-id'?: string;
					filenameOnDisk?: string;
					'can-upload-new-version'?: boolean;
					'uploaded-date'?: string;
					'read-comments-count'?: string;
					extraData?: string;
					private?: string;
					'version-id'?: string;
					userFollowingComments?: boolean;
					'comments-count'?: string;
					status?: string;
					changeFollowerIds?: string;
					tags?: Array<Record<string, TeamworkJsonValue>>;
					version?: string;
					id?: string;
					'last-changed-on'?: string;
					commentFollowerIds?: string;
					shareable?: boolean;
					versions?: Array<Record<string, TeamworkJsonValue>>;
					thumbURL?: string;
					'uploaded-by-user-first-name'?: string;
					'uploaded-by-user-last-name'?: string;
					name?: string;
					'uploaded-by-userId'?: string;
					userFollowingChanges?: boolean;
					'category-id'?: string;
					originalName?: string;
					size?: string;
					'file-source'?: string;
					'category-name'?: string;
				} & Record<string, TeamworkJsonValue>
			>;
			id?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'files.addToProject': { id?: string; STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'files.addToTask': {
		affectedTaskIds?: string;
		assignedFileIds?: Array<string>;
		STATUS?: string;
		existingFileIds?: Array<string>;
	} & Record<string, TeamworkJsonValue>;
	'files.addVersion': { id?: string; STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'files.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'files.getShareLink': { STATUS?: string; url?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'files.copy': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'fileCategories.list': {
		categories?: Array<
			{
				'project-id'?: string;
				'parent-id'?: string;
				name?: string;
				count?: string;
				id?: string;
				elements_count?: string;
				type?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'fileCategories.get': {
		category?: {
			'project-id'?: string;
			'parent-id'?: string;
			name?: string;
			count?: string;
			id?: string;
			elements_count?: string;
			type?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'fileCategories.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'fileCategories.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'fileCategories.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'links.list': {
		projects?: Array<
			{
				links?: Array<
					{
						'project-id'?: string;
						name?: string;
						'created-by-userfirstname'?: string;
						height?: string;
						private?: string;
						width?: string;
						'created-by-userId'?: string;
						'created-by-userlastname'?: string;
						'category-id'?: string;
						'open-in-new-window'?: string;
						id?: string;
						provider?: string;
						'created-date'?: string;
						'category-name'?: string;
						code?: string;
					} & Record<string, TeamworkJsonValue>
				>;
				name?: string;
				id?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'links.listForProject': {
		project?: {
			links?: Array<
				{
					'project-id'?: string;
					name?: string;
					'created-by-userfirstname'?: string;
					height?: string;
					private?: string;
					width?: string;
					'created-by-userId'?: string;
					'created-by-userlastname'?: string;
					'category-id'?: string;
					'open-in-new-window'?: string;
					id?: string;
					provider?: string;
					'created-date'?: string;
					'category-name'?: string;
					code?: string;
				} & Record<string, TeamworkJsonValue>
			>;
			name?: string;
			id?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'links.get': {
		link?: {
			'project-id'?: string;
			commentNotifyIds?: string;
			'created-by-userfirstname'?: string;
			height?: string;
			'comments-count'?: string;
			private?: string;
			userFollowingComments?: boolean;
			'updated-date'?: string;
			changeFollowerIds?: string;
			'created-by-userlastname'?: string;
			tags?: Array<Record<string, TeamworkJsonValue>>;
			canEdit?: boolean;
			userDisplayUpdatedTime?: string;
			id?: string;
			commentFollowerIds?: string;
			'created-date'?: string;
			code?: string;
			userDisplayUpdatedDate?: string;
			name?: string;
			userFollowingChanges?: boolean;
			combinedFollowersCount?: string;
			width?: string;
			'created-by-userId'?: string;
			'category-id'?: string;
			'project-name'?: string;
			'open-in-new-window'?: string;
			provider?: string;
			lockdownId?: string;
			'category-name'?: string;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'links.create': {
		link?: {
			notify?: string;
			'notify-current-user'?: boolean;
			code?: string;
			'category-id'?: number;
			width?: string;
			height?: string;
			name?: string;
			tagIds?: string;
			'grant-access-to'?: string;
			private?: boolean;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'links.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'links.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'linkCategories.list': {
		categories?: Array<
			{
				'project-id'?: string;
				'parent-id'?: string;
				name?: string;
				count?: string;
				id?: string;
				elements_count?: string;
				type?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'linkCategories.get': {
		category?: {
			'project-id'?: string;
			'parent-id'?: string;
			name?: string;
			count?: string;
			id?: string;
			elements_count?: string;
			type?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'linkCategories.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'linkCategories.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'notebooks.lock': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'notebooks.unlock': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'notebooks.copy': { id?: string; STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'notebooks.move': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'notebookCategories.list': {
		categories?: Array<
			{
				'project-id'?: string;
				'parent-id'?: string;
				name?: string;
				count?: string;
				id?: string;
				elements_count?: string;
				type?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'notebookCategories.get': {
		category?: {
			'project-id'?: string;
			'parent-id'?: string;
			name?: string;
			count?: string;
			id?: string;
			elements_count?: string;
			type?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'notebookCategories.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'notebookCategories.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'notebookCategories.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'boardColumns.list': {
		columns?: Array<
			{
				name?: string;
				displayOrder?: string;
				sortOrder?: string;
				deletedDate?: string;
				dateUpdated?: string;
				settings?: {
					avatar?: boolean;
					time?: boolean;
					name?: boolean;
					files?: boolean;
					comments?: boolean;
					priority?: boolean;
					progress?: boolean;
					subtasktext?: boolean;
					tasklist?: boolean;
					private?: boolean;
					reminders?: boolean;
					assignee?: boolean;
					dependencies?: boolean;
					tags?: boolean;
					estimatedtime?: boolean;
					startdate?: boolean;
					tickets?: boolean;
					followers?: boolean;
					recurring?: boolean;
					subtasklabel?: boolean;
					parenttask?: boolean;
					enddate?: boolean;
				} & Record<string, TeamworkJsonValue>;
				defaultTasklist?: {
					newTaskDefaults?: Record<string, TeamworkJsonValue>;
					name?: string;
					id?: string;
				} & Record<string, TeamworkJsonValue>;
				projectId?: string;
				stats?: {
					estimatedTime?: string;
					total?: string;
					completed?: string;
					active?: string;
				} & Record<string, TeamworkJsonValue>;
				hasTriggers?: boolean;
				sort?: string;
				canEdit?: boolean;
				triggers?: Array<Record<string, TeamworkJsonValue>>;
				id?: string;
				dateCreated?: string;
				color?: string;
				deleted?: boolean;
				canAddCards?: boolean;
			} & Record<string, TeamworkJsonValue>
		>;
		people?: {
			'123'?: {
				company?: { name?: string; id?: string } & Record<
					string,
					TeamworkJsonValue
				>;
				avatarUrl?: string;
				firstName?: string;
				id?: string;
				lastName?: string;
			} & Record<string, TeamworkJsonValue>;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'boardColumns.get': {
		STATUS?: string;
		column?: {
			name?: string;
			displayOrder?: string;
			sortOrder?: string;
			deletedDate?: string;
			dateUpdated?: string;
			settings?: {
				time?: boolean;
				avatar?: boolean;
				name?: boolean;
				files?: boolean;
				comments?: boolean;
				priority?: boolean;
				progress?: boolean;
				subtasktext?: boolean;
				tasklist?: boolean;
				private?: boolean;
				reminders?: boolean;
				assignee?: boolean;
				dependencies?: boolean;
				tags?: boolean;
				estimatedtime?: boolean;
				startdate?: boolean;
				tickets?: boolean;
				followers?: boolean;
				recurring?: boolean;
				subtasklabel?: boolean;
				enddate?: boolean;
			} & Record<string, TeamworkJsonValue>;
			defaultTasklist?: {
				newTaskDefaults?: Record<string, TeamworkJsonValue>;
				name?: string;
				id?: string;
			} & Record<string, TeamworkJsonValue>;
			projectId?: string;
			hasTriggers?: boolean;
			sort?: string;
			canEdit?: boolean;
			id?: string;
			dateCreated?: string;
			color?: string;
			deleted?: boolean;
			canAddCards?: boolean;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'boardColumns.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'boardColumns.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'boardColumns.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'boardCards.list': {
		people?: {
			'12345'?: {
				company?: { name?: string; id?: string } & Record<
					string,
					TeamworkJsonValue
				>;
				avatarUrl?: string;
				firstName?: string;
				id?: string;
				lastName?: string;
			} & Record<string, TeamworkJsonValue>;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
		column?: { name?: string; id?: string; color?: string } & Record<
			string,
			TeamworkJsonValue
		>;
		cards?: Array<
			{
				dueDate?: string;
				canComplete?: boolean;
				numComments?: string;
				taskListId?: string;
				displayOrder?: string;
				hasTickets?: boolean;
				archived?: boolean;
				deletedDate?: string;
				dateUpdated?: string;
				dateCompleted?: string;
				private?: string;
				projectId?: string;
				status?: string;
				numPredecessors?: string;
				numDependencies?: string;
				numAttachments?: string;
				canEdit?: boolean;
				tags?: Array<Record<string, TeamworkJsonValue>>;
				startDate?: string;
				id?: string;
				hasLoggedTime?: boolean;
				dateCreated?: string;
				completed?: boolean;
				estimatedMinutes?: string;
				deleted?: boolean;
				taskListName?: string;
				taskStatus?: string;
				columnId?: string;
				name?: string;
				priority?: string;
				progress?: string;
				parentTaskId?: string;
				numActiveSubTasks?: string;
				assignedPeople?: Array<string>;
				taskId?: string;
				isRecurring?: boolean;
				hasUnreadComments?: boolean;
				archivedDate?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'boardCards.get': {
		card?: {
			dueDate?: string;
			canComplete?: boolean;
			numComments?: string;
			taskListId?: string;
			displayOrder?: string;
			hasTickets?: boolean;
			archived?: boolean;
			deletedDate?: string;
			dateCompleted?: string;
			dateUpdated?: string;
			private?: string;
			projectId?: string;
			status?: string;
			numPredecessors?: string;
			numDependencies?: string;
			numAttachments?: string;
			tags?: Array<Record<string, TeamworkJsonValue>>;
			canEdit?: boolean;
			startDate?: string;
			id?: string;
			hasLoggedTime?: boolean;
			dateCreated?: string;
			completed?: boolean;
			estimatedMinutes?: string;
			deleted?: boolean;
			taskStatus?: string;
			taskListName?: string;
			columnId?: string;
			name?: string;
			progress?: string;
			priority?: string;
			projectName?: string;
			hasReminders?: boolean;
			parentTaskId?: string;
			column?: { name?: string; id?: string; color?: string } & Record<
				string,
				TeamworkJsonValue
			>;
			hasRemindersForUser?: boolean;
			numActiveSubTasks?: string;
			assignedPeople?: Array<string>;
			taskId?: string;
			isRecurring?: boolean;
			hasUnreadComments?: boolean;
			archivedDate?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'boardCards.update': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'boardCards.move': Record<string, TeamworkJsonValue>;
	'boardCards.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'portfolioBoards.list': {
		STATUS?: string;
		boards?: Array<
			{
				canEdit?: boolean;
				name?: string;
				displayOrder?: string;
				deletedDate?: string;
				id?: string;
				dateCreated?: string;
				color?: string;
				stats?: { projects?: string } & Record<string, TeamworkJsonValue>;
				deleted?: boolean;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'portfolioBoards.create': { STATUS?: string; id?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'portfolioBoards.update': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'portfolioBoards.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'portfolioColumns.list': {
		columns?: Array<
			{
				name?: string;
				displayOrder?: string;
				sortOrder?: string;
				deletedDate?: string;
				dateUpdated?: string;
				settings?: {
					company?: boolean;
					category?: boolean;
					starred?: boolean;
					tags?: boolean;
					name?: boolean;
					dates?: boolean;
				} & Record<string, TeamworkJsonValue>;
				hasTriggers?: boolean;
				sort?: string;
				canEdit?: boolean;
				id?: string;
				dateCreated?: string;
				color?: string;
				deleted?: boolean;
			} & Record<string, TeamworkJsonValue>
		>;
		board?: {
			name?: string;
			id?: string;
			color?: string;
			deleted?: boolean;
		} & Record<string, TeamworkJsonValue>;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'portfolioColumns.get': {
		STATUS?: string;
		column?: {
			name?: string;
			displayOrder?: string;
			sortOrder?: string;
			deletedDate?: string;
			dateUpdated?: string;
			settings?: {
				company?: boolean;
				update?: boolean;
				category?: boolean;
				starred?: boolean;
				tags?: boolean;
				name?: boolean;
				progress?: boolean;
				dates?: boolean;
				owner?: boolean;
			} & Record<string, TeamworkJsonValue>;
			hasTriggers?: boolean;
			sort?: string;
			canEdit?: boolean;
			id?: string;
			dateCreated?: string;
			color?: string;
			deleted?: boolean;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'portfolioColumns.create': {
		id?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'portfolioColumns.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'portfolioCards.list': {
		STATUS?: string;
		column?: { name?: string; id?: string; color?: string } & Record<
			string,
			TeamworkJsonValue
		>;
		cards?: Array<
			{
				company?: { name?: string; id?: string } & Record<
					string,
					TeamworkJsonValue
				>;
				starred?: boolean;
				name?: string;
				columnId?: string;
				boardId?: string;
				displayOrder?: string;
				archived?: boolean;
				deletedDate?: string;
				dateUpdated?: string;
				projectId?: string;
				status?: string;
				category?: { name?: string; id?: string; color?: string } & Record<
					string,
					TeamworkJsonValue
				>;
				canEdit?: boolean;
				tags?: Array<Record<string, TeamworkJsonValue>>;
				startDate?: string;
				id?: string;
				dateCreated?: string;
				deleted?: boolean;
				endDate?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'portfolioCards.get': {
		STATUS?: string;
		column?: { color?: string; id?: string; name?: string } & Record<
			string,
			TeamworkJsonValue
		>;
		card?: {
			canEdit?: boolean;
			startDate?: string;
			boardId?: string;
			starred?: boolean;
			displayOrder?: string;
			deleted?: boolean;
			columnId?: string;
			name?: string;
			endDate?: string;
			company?: { id?: string; name?: string } & Record<
				string,
				TeamworkJsonValue
			>;
			dateUpdated?: string;
			status?: string;
			owner?: {
				lastName?: string;
				firstName?: string;
				id?: string;
				fullName?: string;
				avatarUrl?: string;
			} & Record<string, TeamworkJsonValue>;
			deletedDate?: string;
			projectId?: string;
			category?: { color?: string; id?: string; name?: string } & Record<
				string,
				TeamworkJsonValue
			>;
			progress?: Record<string, TeamworkJsonValue>;
			update?: {
				deletedDate?: string;
				projectId?: string;
				color?: string;
				text?: string;
				id?: string;
				health?: string;
				deleted?: boolean;
				user?: {
					lastName?: string;
					firstName?: string;
					id?: string;
					fullName?: string;
					avatarUrl?: string;
				} & Record<string, TeamworkJsonValue>;
				dateCreated?: string;
			} & Record<string, TeamworkJsonValue>;
			id?: string;
			archived?: boolean;
			dateCreated?: string;
			tags?: Array<Record<string, TeamworkJsonValue>>;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'portfolioCards.add': {
		cardId?: string;
		projectId?: string;
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
	'portfolioCards.move': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'portfolioCards.delete': { STATUS?: string } & Record<
		string,
		TeamworkJsonValue
	>;
	'teams.list': TeamworkV1Output_TeamsMultipleResponse;
	'teams.get': TeamworkV1Output_TeamsSingleResponse;
	'teams.create': {
		id?: string;
		STATUS?: string;
		user?: { id?: string; name?: string; handle?: string } & Record<
			string,
			TeamworkJsonValue
		>;
	} & Record<string, TeamworkJsonValue>;
	'teams.update': {
		id?: string;
		STATUS?: string;
		user?: { id?: string; name?: string; handle?: string } & Record<
			string,
			TeamworkJsonValue
		>;
	} & Record<string, TeamworkJsonValue>;
	'teams.delete': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'teams.setMembers': { STATUS?: string } & Record<string, TeamworkJsonValue>;
	'teams.listSubteams': TeamworkV1Output_TeamsMultipleResponse;
	'teams.listMemberIds': {
		teams?: { teamId?: Array<string> } & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
	'teams.createForProject': {
		id?: string;
		STATUS?: string;
		user?: { id?: string; name?: string; handle?: string } & Record<
			string,
			TeamworkJsonValue
		>;
	} & Record<string, TeamworkJsonValue>;
	'teams.listForProject': TeamworkV1Output_TeamsPickerResponse;
	'teams.listForCompany': TeamworkV1Output_TeamsMultipleResponse;
	'teams.listForPerson': TeamworkV1Output_TeamsMultipleResponse;
	'time.estimatedTotals': {
		STATUS?: string;
		projects?: Array<
			{
				company?: { name?: string; id?: string } & Record<
					string,
					TeamworkJsonValue
				>;
				name?: string;
				totalEstimatedMins?: string;
				totalEstimatedHours?: string;
				id?: string;
			} & Record<string, TeamworkJsonValue>
		>;
	} & Record<string, TeamworkJsonValue>;
	'time.loggedByPerson': {
		STATUS?: string;
		user?: {
			billable?: Array<Record<string, TeamworkJsonValue>>;
			firstname?: string;
			nonbillable?: Array<Record<string, TeamworkJsonValue>>;
			endepoch?: string;
			id?: string;
			startepoch?: string;
			lastname?: string;
		} & Record<string, TeamworkJsonValue>;
	} & Record<string, TeamworkJsonValue>;
};

import type { TeamworkJsonValue } from './operation-types';

type TeamworkV3Input_comment_Comment = {
	body?: string;
	contentType?: string;
	createdAt?: string;
	createdBy?: number;
	fileIds: TeamworkV3Input_payload_NullableInt64Slice;
	grantAccessTo?: TeamworkV3Input_payload_UserGroups;
	private?: boolean;
};
type TeamworkV3Input_comment_File = { categoryId?: number; id: number };
type TeamworkV3Input_comment_PendingFile = {
	categoryId?: number;
	reference: string;
};
type TeamworkV3Input_comment_Request = {
	attachments: {
		files?: Array<TeamworkV3Input_comment_File>;
		pendingFiles?: Array<TeamworkV3Input_comment_PendingFile>;
	};
	comment: TeamworkV3Input_comment_Comment;
	commentOptions: {
		fireWebhook?: boolean;
		markdownToHTML?: boolean;
		notify?: TeamworkV3Input_payload_Notify;
		notifyCurrentUser?: boolean;
		parseMentions?: boolean;
	};
};
type TeamworkV3Input_company_ClientRatesRequest = {
	clientRateByRoleId: Record<string, number>;
};
type TeamworkV3Input_company_Company = {
	addressOne?: string;
	addressTwo?: string;
	cid?: string;
	city?: string;
	clientManagedBy: number;
	countrycode?: string;
	currencyId?: number;
	customFields: TeamworkV3Input_company_CustomFields;
	emailOne?: string;
	emailThree?: string;
	emailTwo?: string;
	fax?: string;
	industryCatId?: number;
	logoPendingFileRef?: string;
	name?: string;
	phone?: string;
	privateNotes?: string;
	profile?: string;
	removeLogo?: boolean;
	state?: string;
	tagIds?: Array<number>;
	website?: string;
	zip?: string;
};
type TeamworkV3Input_company_CustomFields = {
	Values: Array<TeamworkV3Input_value_CustomFieldValue>;
};
type TeamworkV3Input_company_Request = {
	company: TeamworkV3Input_company_Company;
	companyOptions: {
		fireWebhook?: boolean;
		logActivity?: boolean;
		useNotifyViaTWIM?: boolean;
	};
	tags: Array<TeamworkV3Input_tag_Tag>;
};
type TeamworkV3Input_companydomain_BulkRequest = {
	companyDomains: Array<TeamworkV3Input_companydomain_Domain>;
};
type TeamworkV3Input_companydomain_Domain = {
	companyId: number;
	domain: string;
};
type TeamworkV3Input_companydomain_Request = {
	companyDomain: TeamworkV3Input_companydomain_Domain;
};
// The spec has an empty object; Teamwork takes the reminder time as a date-time string.
type TeamworkV3Input_entity_RemindAt = string;
type TeamworkV3Input_notebook_Notebook = {
	categoryId: number;
	contents?: string;
	isFullWidth?: boolean;
	isPrivate?: boolean;
	locked?: boolean;
	name?: string;
	newVersion?: boolean;
	notify?: TeamworkV3Input_payload_Notify;
	notifyCurrentUser?: boolean;
	privacy?: TeamworkV3Input_payload_UserGroups;
	secureContent?: boolean;
	sendDiff?: boolean;
	tagIds: TeamworkV3Input_payload_NullableInt64Slice;
	type?: string;
};
type TeamworkV3Input_notebook_Request = {
	notebook: TeamworkV3Input_notebook_Notebook;
};
type TeamworkV3Input_payload_Notify = {
	ids: TeamworkV3Input_payload_UserGroups;
	type: TeamworkV3Input_payload_NotifyType;
};
type TeamworkV3Input_payload_NotifyType = {
	Null: boolean;
	Set: boolean;
	Value: string;
};
type TeamworkV3Input_payload_NullableInt64Slice = {
	Null: boolean;
	Set: boolean;
	Value: Array<number>;
};
type TeamworkV3Input_payload_NullableTaskPriority = {
	Null: boolean;
	Set: boolean;
	Value: string;
};
type TeamworkV3Input_payload_NullableTaskRepeatFrequency = {
	Null: boolean;
	Set: boolean;
	Value: string;
};
type TeamworkV3Input_payload_NullableTaskRepeatMonthlyType = {
	Null: boolean;
	Set: boolean;
	Value: string;
};
type TeamworkV3Input_payload_NullableWorkingHourEntryWeekdays = {
	Null: boolean;
	Set: boolean;
	Value: Array<string>;
};
type TeamworkV3Input_payload_UserGroups = {
	companyIds: TeamworkV3Input_payload_NullableInt64Slice;
	jobRoleIds: TeamworkV3Input_payload_NullableInt64Slice;
	teamIds: TeamworkV3Input_payload_NullableInt64Slice;
	userIds: TeamworkV3Input_payload_NullableInt64Slice;
};
type TeamworkV3Input_people_UsersPayload = {
	checkTeamIds: Array<number>;
	userIds: Array<number>;
};
type TeamworkV3Input_project_FeatureOrder2 = {
	billing?: number;
	board?: number;
	comments?: number;
	dashboard?: number;
	files?: number;
	finance?: number;
	forms?: number;
	gantt?: number;
	links?: number;
	list?: number;
	messages?: number;
	milestones?: number;
	notebooks?: number;
	numVisibleTabs?: number;
	people?: number;
	proofs?: number;
	risks?: number;
	schedule?: number;
	settings?: number;
	table?: number;
	tickets?: number;
	time?: number;
	timeline?: number;
};
type TeamworkV3Input_project_FeatureOrderRequest = {
	featureOrder?: TeamworkV3Input_project_FeatureOrder2;
	featureOrderOptions: { useNotifyViaTWIM?: boolean };
};
type TeamworkV3Input_project_ProjectNumberSettingsPayload = {
	autoIncrement?: boolean;
	nextNumber?: number;
	projectNumberPattern?: string;
	projectNumberText?: string;
	startNumber?: string;
};
type TeamworkV3Input_project_ProjectNumberSettingsRequest = {
	projectNumberSettings: TeamworkV3Input_project_ProjectNumberSettingsPayload;
};
type TeamworkV3Input_reminder_Reminder = {
	isRelative: boolean;
	note?: string;
	relativeNumberDays: number;
	remindAt: TeamworkV3Input_entity_RemindAt;
	teamIds: Array<number>;
	type: string;
	userIds: Array<number>;
};
type TeamworkV3Input_reminder_Request = {
	reminder: TeamworkV3Input_reminder_Reminder;
};
type TeamworkV3Input_tag_Tag = {
	color?: string;
	name?: string;
	projectId?: number;
};
type TeamworkV3Input_task_CustomFieldValue = {
	countryCode?: string;
	currencySymbol?: string;
	customfieldId: number;
	urlTextToDisplay?: string;
	value: TeamworkJsonValue;
};
type TeamworkV3Input_task_CustomFields =
	| { Values: Array<TeamworkV3Input_task_CustomFieldValue> }
	| Array<TeamworkV3Input_task_CustomFieldValue>;
type TeamworkV3Input_task_File = { categoryId?: number; id: number };
type TeamworkV3Input_task_Options = {
	appendAssignees?: boolean;
	checkInvalidusers?: boolean;
	everyoneMustDo?: boolean;
	fireWebhook?: boolean;
	isTemplate?: boolean;
	logActivity?: boolean;
	notify: boolean;
	parseInlineTags?: boolean;
	positionAfterTaskId?: number;
	pushDependents?: boolean;
	pushSubtasks?: boolean;
	shiftProjectDates?: boolean;
	useDefaults?: boolean;
	useNotifyViaTWIM?: boolean;
};
type TeamworkV3Input_task_PendingFile = {
	categoryId?: number;
	reference: string;
};
type TeamworkV3Input_task_Predecessor = { id: number; type: string };
type TeamworkV3Input_task_Reminder = {
	isRelative: boolean;
	note: string;
	relativeNumberDays: number;
	remindAt: string;
	type: string;
	userId: number;
};
type TeamworkV3Input_task_RepeatOptions = {
	duration: number;
	editOption?: string;
	endsAt: string;
	frequency: TeamworkV3Input_payload_NullableTaskRepeatFrequency;
	monthlyRepeatType: TeamworkV3Input_payload_NullableTaskRepeatMonthlyType;
	rrule: string;
	selectedDays: TeamworkV3Input_payload_NullableWorkingHourEntryWeekdays;
};
type TeamworkV3Input_task_Request = {
	attachmentOptions?: { removeOtherFiles?: boolean };
	attachments?: {
		files?: Array<TeamworkV3Input_task_File>;
		pendingFiles?: Array<TeamworkV3Input_task_PendingFile>;
	};
	card?: { columnId?: number };
	predecessors?: Array<TeamworkV3Input_task_Predecessor>;
	tags?: Array<TeamworkV3Input_tag_Tag>;
	task: TeamworkV3Input_task_Task;
	taskOptions: TeamworkV3Input_task_Options;
	workflows?: TeamworkV3Input_task_Workflows;
};
type TeamworkV3Input_task_CreateRequest = Omit<
	TeamworkV3Input_task_Request,
	'task'
> & { task: TeamworkV3Input_task_Task & { name: string } };
type TeamworkV3Input_task_Task = {
	allocationId?: number;
	assignees?: TeamworkV3Input_task_UserGroups;
	attachmentIds?: Array<number>;
	changeFollowers?: TeamworkV3Input_task_UserGroups;
	commentFollowers?: TeamworkV3Input_task_UserGroups;
	completeFollowers?: TeamworkV3Input_task_UserGroups;
	completedAt?: string;
	completedBy?: number;
	createdAt?: string;
	createdBy?: number;
	crmDealIds?: Array<number>;
	customFields?: TeamworkV3Input_task_CustomFields;
	description?: string;
	descriptionContentType?: string;
	dueAt?: string;
	dueDate?: string;
	estimatedMinutes?: number;
	grantAccessTo?: TeamworkV3Input_task_UserGroups;
	hasDeskTickets?: boolean;
	name?: string;
	notify?: boolean;
	originalDueDate?: string;
	parentTaskId?: number;
	priority?: TeamworkV3Input_task_Priority;
	private?: boolean;
	progress?: number;
	projectId?: number;
	reminders?: Array<TeamworkV3Input_task_Reminder>;
	repeatOptions?: TeamworkV3Input_task_RepeatOptions;
	startAt?: string;
	startDate?: string;
	status?: string;
	tagIds?: Array<number>;
	taskgroupId?: number;
	tasklistId?: number;
	templateRoleName?: string;
	ticketId?: number;
};
type TeamworkV3Input_task_Workflows = {
	positionAfterTask?: number;
	stageId?: number;
	workflowId?: number;
};
type TeamworkV3Input_task_NullableInt64Slice =
	| TeamworkV3Input_payload_NullableInt64Slice
	| Array<number>;
type TeamworkV3Input_task_UserGroups = {
	companyIds?: TeamworkV3Input_task_NullableInt64Slice;
	jobRoleIds?: TeamworkV3Input_task_NullableInt64Slice;
	teamIds?: TeamworkV3Input_task_NullableInt64Slice;
	userIds?: TeamworkV3Input_task_NullableInt64Slice;
};
type TeamworkV3Input_task_Priority =
	| TeamworkV3Input_payload_NullableTaskPriority
	| 'none'
	| ''
	| 'low'
	| 'medium'
	| 'high';
type TeamworkV3Input_timelog_Options = {
	fireWebhook?: boolean;
	logActivity?: boolean;
	markTaskComplete?: boolean;
	parseInlineTags?: boolean;
	useNotifyViaTWIM?: boolean;
};
type TeamworkV3Input_timelog_Request = {
	tags: Array<TeamworkV3Input_tag_Tag>;
	timelog: TeamworkV3Input_timelog_Timelog;
	timelogOptions: TeamworkV3Input_timelog_Options;
};
type TeamworkV3Input_timelog_Timelog = {
	date?: string;
	hasStartTime?: boolean;
	hours?: number;
	invoiceId?: number;
	isBillable?: boolean;
	isUtc: boolean;
	minutes?: number;
	projectId?: number;
	tagIds?: Array<number>;
	taskId: number;
	ticketId?: number;
	time?: string;
	userId?: number;
	verified?: boolean;
};
type TeamworkV3Input_timer_DeleteRequest = { hardDelete?: boolean };
type TeamworkV3Input_timer_Request = { timer: TeamworkV3Input_timer_Timer };
type TeamworkV3Input_timer_Timer = {
	isBillable?: boolean;
	isRunning?: boolean;
	projectId: number;
	seconds?: number;
	stopRunningTimers?: boolean;
	taskId: number;
};
type TeamworkV3Input_value_CustomFieldValue = {
	countryCode: string;
	currencySymbol: string;
	customfieldId: number;
	urlTextToDisplay: string;
	value: TeamworkJsonValue;
};
type TeamworkV3Output_access_CompanyAccess = {
	canViewFinancials: boolean;
	canViewForms: boolean;
	canViewKnowledgebase: boolean;
	canViewProjects: boolean;
	canViewTickets: boolean;
	company: TeamworkV3Output_view_Company;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_active_ProjectMetricActive = { value: number } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_active_Response = {
	data: TeamworkV3Output_active_ProjectMetricActive;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_billable_ProjectMetricBillable = {
	name: string;
	value: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_billable_ProjectMetricBillablesResponse = {
	data: Array<TeamworkV3Output_billable_ProjectMetricBillable>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_CommentsResponse = {
	comments: Array<TeamworkV3Output_comment_FullComment>;
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		files?: Record<string, TeamworkV3Output_view_ProjectFileV205>;
		fileversions?: Record<string, TeamworkV3Output_view_FileversionV205>;
		links?: Record<string, TeamworkV3Output_view_LinkItem>;
		milestones?: Record<string, TeamworkV3Output_view_Milestone>;
		notebooks?: Record<string, TeamworkV3Output_view_Notebook>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_FullComment = {
	body: string;
	commentLink: string;
	contentType: string;
	dateDeleted?: string;
	dateLastEdited?: string;
	deleted: boolean;
	deletedBy?: number;
	deletedByUserId: number;
	fileCount: number;
	fileIds: Array<number>;
	files: Array<TeamworkV3Output_view_Relationship>;
	htmlBody: string;
	id: number;
	installation?: TeamworkV3Output_view_Relationship;
	installationId: number;
	isPrivate: number;
	lastEditedBy?: number;
	lastEditedByUserId: number;
	lockdownID: number;
	meta?: TeamworkV3Output_comment_Meta;
	object?: TeamworkV3Output_view_Relationship;
	objectId: number;
	objectType: string;
	peopleNotifiedCount: number;
	postedBy?: number;
	postedByUserId: number;
	postedDateTime?: string;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
	reactions?: Array<TeamworkV3Output_view_Reaction>;
	reactionsCount: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_Meta = {
	isRead: boolean;
	permissions?: TeamworkV3Output_comment_Permissions;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_NotifiedResponse = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	people: Array<TeamworkV3Output_view_User>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_Permissions = {
	canDelete?: boolean;
	canEdit?: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_comment_Response = {
	comments: TeamworkV3Output_comment_FullComment;
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		files?: Record<string, TeamworkV3Output_view_ProjectFileV205>;
		fileversions?: Record<string, TeamworkV3Output_view_FileversionV205>;
		links?: Record<string, TeamworkV3Output_view_LinkItem>;
		milestones?: Record<string, TeamworkV3Output_view_Milestone>;
		notebooks?: Record<string, TeamworkV3Output_view_Notebook>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_company_ClientRatesResponse = {
	clientRateByRoleId: Record<string, TeamworkV3Output_view_ClientRate>;
	included: {
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
	} & Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_company_CompaniesResponse = {
	companies: Array<TeamworkV3Output_view_Company>;
	included: {
		clientPortals?: Record<string, TeamworkV3Output_view_ClientPortal>;
		countries?: Record<string, TeamworkV3Output_view_Country>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		customfieldCompanies?: Record<
			string,
			TeamworkV3Output_view_CustomFieldValueCompany
		>;
		customfields?: Record<string, TeamworkV3Output_view_CustomField>;
		domains?: Record<string, TeamworkV3Output_view_CompanyDomain>;
		industries?: Record<string, TeamworkV3Output_view_Industry>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		updates?: Record<string, TeamworkV3Output_view_CompanyUpdate>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	letters?: Array<string>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_company_Response = {
	company: TeamworkV3Output_view_Company;
	included: {
		clientPortals?: Record<string, TeamworkV3Output_view_ClientPortal>;
		countries?: Record<string, TeamworkV3Output_view_Country>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		customfieldCompanies?: Record<
			string,
			TeamworkV3Output_view_CustomFieldValueCompany
		>;
		customfields?: Record<string, TeamworkV3Output_view_CustomField>;
		domains?: Record<string, TeamworkV3Output_view_CompanyDomain>;
		industries?: Record<string, TeamworkV3Output_view_Industry>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		updates?: Record<string, TeamworkV3Output_view_CompanyUpdate>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_complete_Response = {
	data: TeamworkV3Output_complete_TaskMetricComplete;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_complete_TaskMetricComplete = { value: number } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_container_DashboardDataResponse = {
	data: Array<Record<string, TeamworkJsonValue>>;
	included?: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
		workflowStages?: Record<string, TeamworkV3Output_view_Stage>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_customfield_CustomFieldsResponse = {
	customfields: Array<TeamworkV3Output_view_CustomField>;
	included: {
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_deadline_MilestoneMetricDeadline = {
	date: string;
	value: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_deadline_MilestoneMetricDeadlinesResponse = {
	data: Array<TeamworkV3Output_deadline_MilestoneMetricDeadline>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_domain_BulkResponse = {
	domains: Array<TeamworkV3Output_view_CompanyDomain>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_domain_Response = {
	domain: TeamworkV3Output_view_CompanyDomain;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_entity_MonthDate = {
	Month: number;
	Year: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_entity_ProjectBudgetRange = {
	color?: string;
	companyId?: number;
	count: number;
	from?: number;
	to?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_entity_WeekDate = { Week: number; Year: number } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_health_ProjectMetricHealth = {
	name: string;
	value: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_health_ProjectMetricHealthsResponse = {
	data: Array<TeamworkV3Output_health_ProjectMetricHealth>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_invoice_ProjectMetricInvoicesResponse = {
	data: { value?: number } & Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_late_Response = {
	data: TeamworkV3Output_late_TaskMetricLate;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_late_TaskMetricLate = { value: number } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_me_Response2 = {
	person: TeamworkV3Output_view_UserMe;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_milestone_MilestoneDetailsResponse = {
	included?: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	milestones: Array<TeamworkV3Output_view_Milestone>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_milestone_MilestonesResponse = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklistTaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	milestones: Array<TeamworkV3Output_view_Milestone>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_milestone_Response = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklistTaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	milestone: TeamworkV3Output_view_Milestone;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_notebook_NotebooksResponse = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		notebookCategories?: Record<string, TeamworkV3Output_view_NotebookCategory>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	notebooks: Array<TeamworkV3Output_view_Notebook>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_notebook_Response = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		notebookCategories?: Record<string, TeamworkV3Output_view_NotebookCategory>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	notebook: TeamworkV3Output_view_Notebook;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_notebook_VersionResponse = {
	included: { users?: Record<string, TeamworkV3Output_view_User> } & Record<
		string,
		TeamworkJsonValue
	>;
	version: TeamworkV3Output_view_NotebookVersion;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_notebook_VersionsResponse = {
	included: { users?: Record<string, TeamworkV3Output_view_User> } & Record<
		string,
		TeamworkJsonValue
	>;
	versions: Array<TeamworkV3Output_view_NotebookVersion>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_owner_ProjectMetricOwner = {
	name: string;
	value: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_owner_ProjectMetricOwnersResponse = {
	data: Array<TeamworkV3Output_owner_ProjectMetricOwner>;
	meta: TeamworkV3Output_view_Meta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_AddPeopleToProjectResponse = {
	info?: Array<string>;
	teamIds?: Array<number>;
	usersAdded: Array<number>;
	usersAlreadyInProject: Array<number>;
	usersNotAdded: Array<number>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_Meta = {
	averageSpend?: number;
	data?: Record<string, TeamworkJsonValue>;
	financialAverageSpend?: number;
	limit?: number;
	nextCursor?: string;
	page?: TeamworkV3Output_view_MetaPage;
	prevCursor?: string;
	skillCounts?: Record<string, number>;
	timeAverageSpend?: number;
	totalCapacity?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_MultiResponse = {
	failed?: Array<TeamworkV3Output_view_BulkFailure>;
	included: {
		ProjectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		linkedClientPortalCompanies?: Record<
			string,
			TeamworkV3Output_access_CompanyAccess
		>;
		skills?: Record<string, TeamworkV3Output_view_Skill>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		userIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		workingHours?: Record<string, TeamworkV3Output_view_WorkingHour>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_people_Meta;
	people: Array<TeamworkV3Output_view_User>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_Response = {
	included: {
		ProjectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		linkedClientPortalCompanies?: Record<
			string,
			TeamworkV3Output_access_CompanyAccess
		>;
		skills?: Record<string, TeamworkV3Output_view_Skill>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		userIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		workingHours?: Record<string, TeamworkV3Output_view_WorkingHour>;
	} & Record<string, TeamworkJsonValue>;
	person: TeamworkV3Output_view_User;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_TaskCompletion = {
	activeProjects: number;
	assignedTasks: number;
	completedTasks: number;
	overdueTasks: number;
	projects: number;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_TaskCompletionResponse = {
	included: { users?: Record<string, TeamworkV3Output_view_User> } & Record<
		string,
		TeamworkJsonValue
	>;
	meta: TeamworkV3Output_view_Meta;
	taskCompletions: TeamworkV3Output_people_TaskCompletions;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_people_TaskCompletions = {
	totalActiveProjects?: number;
	totalAssignedTasks: number;
	totalCompletedTasks: number;
	totalOverdueTasks: number;
	totalProjects?: number;
	users: Array<TeamworkV3Output_people_TaskCompletion>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_performance_PeopleMetricPerformance = {
	name: string;
	value: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_performance_PeopleMetricPerformancesResponse = {
	data: Array<TeamworkV3Output_performance_PeopleMetricPerformance>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_FeatureOrder = {
	billing: number;
	board: number;
	comments: number;
	dashboard: number;
	files: number;
	finance: number;
	forms: number;
	gantt: number;
	id: number;
	installationId: number;
	links: number;
	list: number;
	messages: number;
	milestones: number;
	notebooks: number;
	numVisibleTabs: number;
	people: number;
	projectId: number;
	proofs: number;
	risks: number;
	schedule: number;
	settings: number;
	table: number;
	tickets: number;
	time: number;
	timeline: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_FeatureOrderResponse = {
	featureOrder: TeamworkV3Output_project_FeatureOrder;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_Included = {
	activities?: Record<string, TeamworkV3Output_view_ActivityLog>;
	companies?: Record<string, TeamworkV3Output_view_Company>;
	countries?: Record<string, TeamworkV3Output_view_Country>;
	currencies?: Record<string, TeamworkV3Output_view_Currency>;
	customfieldProjects?: Record<
		string,
		TeamworkV3Output_view_CustomFieldValueProject
	>;
	customfields?: Record<string, TeamworkV3Output_view_CustomField>;
	industries?: Record<string, TeamworkV3Output_view_Industry>;
	portfolioBoards?: Record<string, TeamworkV3Output_view_PortfolioBoard>;
	portfolioCards?: Record<string, TeamworkV3Output_view_PortfolioCard>;
	portfolioColumns?: Record<string, TeamworkV3Output_view_PortfolioColumn>;
	projectBudgets?: Record<string, TeamworkV3Output_view_ProjectBudget>;
	projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
	projectEmailDropboxes?: Record<
		string,
		TeamworkV3Output_view_ProjectEmailDropbox
	>;
	projectTaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
	projectUpdates?: Record<string, TeamworkV3Output_view_ProjectUpdate>;
	stages?: Record<string, TeamworkV3Output_view_Stage>;
	tags?: Record<string, TeamworkV3Output_view_Tag>;
	users?: Record<string, TeamworkV3Output_view_User>;
	workflows?: Record<string, TeamworkV3Output_view_Workflow>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_Meta = {
	averageSpend?: number;
	data?: Record<string, TeamworkJsonValue>;
	financialAverageSpend?: number;
	integrations?: Record<string, TeamworkV3Output_view_Integrations>;
	limit?: number;
	nextCursor?: string;
	page?: TeamworkV3Output_view_MetaPage;
	permissions?: Record<string, TeamworkV3Output_view_ProjectPermissions>;
	prevCursor?: string;
	projectProfitability?: Record<
		string,
		TeamworkV3Output_view_ProjectProfitabilitySummary
	>;
	projectStats?: TeamworkV3Output_view_ProjectStats;
	projects?: TeamworkV3Output_view_ProjectCounts;
	stats?: TeamworkV3Output_view_ProjectItemStats;
	timeAverageSpend?: number;
	totalCapacity?: number;
	user?: TeamworkV3Output_view_ProjectsUserMeta;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_ProjectNumberSettings = {
	autoIncrement: boolean;
	createdAt?: string;
	createdBy?: number;
	nextNumber: number;
	nextProjectNumber: string;
	projectNumberPattern: string;
	projectNumberText: string;
	startNumber: string;
	updatedAt?: string;
	updatedBy?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_ProjectNumberSettingsResponse = {
	projectNumberSettings: TeamworkV3Output_project_ProjectNumberSettings;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_SampleProjectsResponse = {
	included: {
		projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	projects: Array<TeamworkV3Output_view_SampleProject>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_projectsResponseV205 = {
	included: TeamworkV3Output_project_Included;
	meta: TeamworkV3Output_project_Meta;
	projects: Array<TeamworkV3Output_view_ProjectV205>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_project_responseV205 = {
	included: TeamworkV3Output_project_Included;
	meta: TeamworkV3Output_project_Meta;
	project: TeamworkV3Output_view_ProjectV205;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_reminder_TaskReminderResponse = {
	reminder: TeamworkV3Output_view_TaskReminder;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_reminder_TaskRemindersResponse = {
	included: { users?: Record<string, TeamworkV3Output_view_User> } & Record<
		string,
		TeamworkJsonValue
	>;
	reminders: Array<TeamworkV3Output_view_TaskReminder>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_serviceinterfaces_TimelogValidationApproval = {
	id: number;
	monthDate?: TeamworkV3Output_entity_MonthDate;
	userId: number;
	weekDate: TeamworkV3Output_entity_WeekDate;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_status_StatusesResponse = {
	included: {
		statuses?: Record<string, TeamworkV3Output_view_Status>;
		userEvents?: Record<string, TeamworkV3Output_view_UserEvents>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	userStatuses: Array<TeamworkV3Output_view_UserStatus>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_status_TimelineResponse = {
	included: {
		userEvents?: Record<string, TeamworkV3Output_view_UserEvents>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	statuses: Array<TeamworkV3Output_view_Status>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_task_Included = {
	comments?: Record<string, TeamworkV3Output_view_Comment>;
	companies?: Record<string, TeamworkV3Output_view_Company>;
	customfieldTasks?: Record<string, TeamworkV3Output_view_CustomFieldValueTask>;
	customfields?: Record<string, TeamworkV3Output_view_CustomField>;
	files?: Record<string, TeamworkV3Output_view_ProjectFileV205>;
	jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
	lockdowns?: Record<string, TeamworkV3Output_view_Lockdown>;
	milestones?: Record<string, TeamworkV3Output_view_Milestone>;
	projectCategories?: Record<string, TeamworkV3Output_view_ProjectCategory>;
	projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
	projectPermissions?: Record<string, TeamworkV3Output_view_ProjectPermissions>;
	projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
	proofs?: Record<string, TeamworkV3Output_view_Proof>;
	stages?: Record<string, TeamworkV3Output_view_Stage>;
	subtaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
	tags?: Record<string, TeamworkV3Output_view_Tag>;
	taskSequences?: Record<string, TeamworkV3Output_view_TaskSequence>;
	taskgroups?: Record<string, TeamworkV3Output_view_Taskgroup>;
	tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
	tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
	teams?: Record<string, TeamworkV3Output_view_Team>;
	timeTotals?: Record<string, TeamworkV3Output_view_TaskTimeTotals>;
	timers?: Record<string, TeamworkV3Output_view_Timer>;
	users?: Record<string, TeamworkV3Output_view_User>;
	workflows?: Record<string, TeamworkV3Output_view_Workflow>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_task_Meta = {
	averageSpend?: number;
	data?: Record<string, TeamworkJsonValue>;
	financialAverageSpend?: number;
	limit?: number;
	nextCursor?: string;
	page?: TeamworkV3Output_view_MetaPage;
	prevCursor?: string;
	tasksCount?: number;
	timeAverageSpend?: number;
	totalCapacity?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_task_responseV205 = {
	affected?: TeamworkV3Output_view_TaskAffectedV205;
	included: TeamworkV3Output_task_Included;
	meta: TeamworkV3Output_task_Meta;
	task: TeamworkV3Output_view_TaskV205;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_task_tasksResponseV205 = {
	included: TeamworkV3Output_task_Included;
	meta: TeamworkV3Output_task_Meta;
	tasks: Array<TeamworkV3Output_view_TaskV205>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_tasklist_Response = {
	included: {
		ProjectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		customfieldTasks?: Record<
			string,
			TeamworkV3Output_view_CustomFieldValueTask
		>;
		customfields?: Record<string, TeamworkV3Output_view_CustomField>;
		defaultTaskReminders?: Record<string, TeamworkV3Output_view_TaskReminder>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		lockdowns?: Record<string, TeamworkV3Output_view_Lockdown>;
		milestones?: Record<string, TeamworkV3Output_view_Milestone>;
		notifications?: Record<
			string,
			TeamworkV3Output_view_TasklistBudgetNotification
		>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklistBudgets?: Record<string, TeamworkV3Output_view_TasklistBudget>;
		tasklistTaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
		workflowStages?: Record<string, TeamworkV3Output_view_Stage>;
		workflows?: Record<string, TeamworkV3Output_view_Workflow>;
	} & Record<string, TeamworkJsonValue>;
	tasklist: TeamworkV3Output_view_Tasklist;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_tasklist_TasklistsResponse = {
	included: {
		ProjectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		customfieldTasks?: Record<
			string,
			TeamworkV3Output_view_CustomFieldValueTask
		>;
		customfields?: Record<string, TeamworkV3Output_view_CustomField>;
		defaultTaskReminders?: Record<string, TeamworkV3Output_view_TaskReminder>;
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		lockdowns?: Record<string, TeamworkV3Output_view_Lockdown>;
		milestones?: Record<string, TeamworkV3Output_view_Milestone>;
		notifications?: Record<
			string,
			TeamworkV3Output_view_TasklistBudgetNotification
		>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklistBudgets?: Record<string, TeamworkV3Output_view_TasklistBudget>;
		tasklistTaskStats?: Record<string, TeamworkV3Output_view_TaskStats>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
		workflowStages?: Record<string, TeamworkV3Output_view_Stage>;
		workflows?: Record<string, TeamworkV3Output_view_Workflow>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	tasklists: Array<TeamworkV3Output_view_Tasklist>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_CompanyTimelogsResponse = {
	included: {
		billingInvoices?: Record<string, TeamworkV3Output_view_Invoice>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		projectBudgets?: Record<string, TeamworkV3Output_view_ProjectBudget>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		userRates?: Record<string, TeamworkV3Output_view_EffectiveUserRate>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	timelogs: Record<string, Array<TeamworkV3Output_view_Timelog>>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_ReportResponse = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		projectBudgets?: Record<string, TeamworkV3Output_view_ProjectBudget>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasklistBudgets?: Record<string, TeamworkV3Output_view_TasklistBudget>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	time: TeamworkV3Output_view_TimeReportData;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_Response = {
	included: {
		billingInvoices?: Record<string, TeamworkV3Output_view_Invoice>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		projectBudgets?: Record<string, TeamworkV3Output_view_ProjectBudget>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		userRates?: Record<string, TeamworkV3Output_view_EffectiveUserRate>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	timelog: TeamworkV3Output_view_Timelog;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_TimelogsResponse = {
	included: {
		billingInvoices?: Record<string, TeamworkV3Output_view_Invoice>;
		companies?: Record<string, TeamworkV3Output_view_Company>;
		currencies?: Record<string, TeamworkV3Output_view_Currency>;
		projectBudgets?: Record<string, TeamworkV3Output_view_ProjectBudget>;
		projectIntegrations?: Record<string, TeamworkV3Output_view_Integrations>;
		projectPermissions?: Record<
			string,
			TeamworkV3Output_view_ProjectPermissions
		>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tags?: Record<string, TeamworkV3Output_view_Tag>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		userRates?: Record<string, TeamworkV3Output_view_EffectiveUserRate>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	timelogs: Array<TeamworkV3Output_view_Timelog>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_TotalsResponse = {
	financialTotals: TeamworkV3Output_view_FinancialTotals;
	subTasks: TeamworkV3Output_view_TimelogTotalsSubtasks;
	'time-totals': TeamworkV3Output_view_TimelogTotals;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timelog_ValidationResponse = {
	canCreate: boolean;
	existingApproval?: Array<TeamworkV3Output_serviceinterfaces_TimelogValidationApproval>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timer_Response = {
	included: {
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	timer: TeamworkV3Output_view_Timer;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_timer_TimersResponse = {
	included: {
		companies?: Record<string, TeamworkV3Output_view_Company>;
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		tasklists?: Record<string, TeamworkV3Output_view_Tasklist>;
		tasks?: Record<string, TeamworkV3Output_view_TaskV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	timers: Array<TeamworkV3Output_view_Timer>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_unbilled_ProjectMetricUnbilledResponse = {
	data: { value?: number } & Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_update_ProjectUpdatesResponse = {
	included: {
		projects?: Record<string, TeamworkV3Output_view_ProjectV205>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	projectUpdates: Array<TeamworkV3Output_view_ProjectUpdate>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_utilization_Response = {
	dashboardData: {
		jobRolesDashboard?: Array<TeamworkV3Output_view_JobRolesDashboard>;
		teamsDashboard?: Array<TeamworkV3Output_view_TeamsDashboard>;
		usersDashboard?: Array<TeamworkV3Output_view_UsersDashboard>;
	} & Record<string, TeamworkJsonValue>;
	included: {
		jobRoles?: Record<string, TeamworkV3Output_view_JobRole>;
		teams?: Record<string, TeamworkV3Output_view_Team>;
		users?: Record<string, TeamworkV3Output_view_User>;
	} & Record<string, TeamworkJsonValue>;
	meta: TeamworkV3Output_view_Meta;
	// The spec documents the report object; the API answers a per-user array (live run 11-16).
	utilization:
		| TeamworkV3Output_view_ReportUtilizationData
		| Array<TeamworkV3Output_view_UserUtilization>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ActivityLog = {
	datetime: string;
	extraDescription?: string;
	id: number;
	itemLink?: string;
	itemType: string;
	latestType: string;
	link?: string;
	user: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Assignee = {
	decision: 'pending' | 'approved' | 'rejected';
	id: number;
	isExternal: boolean;
	role: 'reviewer' | 'approver';
	user: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Audit = {
	after: TeamworkJsonValue;
	before: TeamworkJsonValue;
	field: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_BillableInfo = {
	rate: number;
	total: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_BudgetAllocation = {
	allocatedMinutes?: number;
	budgetId: number;
	source: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_BudgetSummary = {
	totalCapacity: number;
	totalCapacityUsed: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_BulkFailure = {
	errors: Array<TeamworkV3Output_view_Error>;
	index: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ClientPortal = {
	canCC: boolean;
	canCloseTicket: boolean;
	canSeeAgent: boolean;
	canSeeCC: boolean;
	canSeeCustomFields: boolean;
	canSeePriority: boolean;
	canSeeTags: boolean;
	canSeeType: boolean;
	canSetCustomFields: boolean;
	canSetPriority: boolean;
	canSetTags: boolean;
	canSetType: boolean;
	clientUsers: Array<TeamworkV3Output_view_Relationship>;
	createdAt: string;
	createdByUser: number;
	deletedAt?: string;
	deletedByUser?: number;
	helpDocs: Array<TeamworkV3Output_view_Relationship>;
	helpDocsEnabled: boolean;
	id: number;
	name: string;
	updatedAt?: string;
	updatedByUser?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ClientRate = {
	createdAt: string;
	createdByUser: TeamworkV3Output_view_Relationship;
	rate: TeamworkV3Output_view_Money;
	role: TeamworkV3Output_view_Relationship;
	updatedAt?: string;
	updatedByUser?: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Comment = {
	id: number;
	object: TeamworkV3Output_view_Relationship;
	objectId: number;
	objectType: string;
	postedAt?: string;
	postedBy?: TeamworkV3Output_view_Relationship;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Company = {
	accounts?: number;
	addressOne: string;
	addressTwo: string;
	budgetDistribution?: Array<TeamworkV3Output_entity_ProjectBudgetRange>;
	canSeePrivate: boolean;
	cid: string;
	city: string;
	clientManagedBy?: TeamworkV3Output_view_Relationship;
	clientPortals: Array<TeamworkV3Output_view_Relationship>;
	clients?: number;
	collaborators?: number;
	companyDomains: Array<TeamworkV3Output_view_Relationship>;
	companyNameUrl: string;
	companyUpdate?: TeamworkV3Output_view_Relationship;
	contacts?: number;
	countryCode: string;
	createdAt?: string;
	currency?: TeamworkV3Output_view_Relationship;
	emailOne: string;
	emailThree: string;
	emailTwo: string;
	fax: string;
	financialBudgetSummary?: TeamworkV3Output_view_BudgetSummary;
	id: number;
	industry?: TeamworkV3Output_view_Relationship;
	industryId?: number;
	isOwner: boolean;
	logoUrl: string;
	name: string;
	phone: string;
	privateNotes?: string;
	privateNotesText?: string;
	profileText?: string;
	profitability?: TeamworkV3Output_view_ProfitDetails;
	rates?: Array<TeamworkV3Output_view_ClientRate>;
	state: string;
	stats?: TeamworkV3Output_view_CompanyStats;
	status: string;
	tags: Array<TeamworkV3Output_view_Relationship>;
	timeBudgetSummary?: TeamworkV3Output_view_BudgetSummary;
	updatedAt?: string;
	website: string;
	zip: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CompanyDomain = {
	companyId: number;
	createdAt: string;
	createdByUser: number;
	deletedAt?: string;
	deletedByUser?: number;
	domain: string;
	id: number;
	state: 'active' | 'deleted';
	updatedAt?: string;
	updatedByUser?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CompanyStats = {
	projectCount: number;
	taskCompleteCount: number;
	taskCount: number;
	unreadEmailCount: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CompanyUpdate = {
	active: boolean;
	company: TeamworkV3Output_view_Relationship;
	health: number;
	id: number;
	text?: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CostInfo = {
	originalValue?: TeamworkV3Output_view_OriginalValue;
	rate: number;
	total: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Country = {
	code: string;
	country: string;
	eu: boolean;
	phoneCode?: string;
	vatName?: string;
	vatPercent: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Currency = {
	code: string;
	decimalPoints?: number;
	id: number;
	name: string;
	symbol?: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CustomField = {
	createdAt: string;
	createdBy: number;
	createdByUserId: number;
	currencyCode?: string;
	deleted: boolean;
	deletedAt?: string;
	deletedBy?: number;
	deletedByUserId?: number;
	entity: string;
	formula?: string;
	groupId?: number;
	id: number;
	isPrivate: boolean;
	name: string;
	options: {
		choices?: Array<
			{ color: string; value: string } & Record<string, TeamworkJsonValue>
		>;
		color?: string;
		decimals?: number;
		icon?: string;
	} & Record<string, TeamworkJsonValue>;
	project?: TeamworkV3Output_view_Relationship;
	projectId?: number;
	required: boolean;
	type:
		| 'text-short'
		| 'text-long'
		| 'number-decimal'
		| 'number-integer'
		| 'financial'
		| 'dropdown'
		| 'multiselect'
		| 'checkbox'
		| 'percentage'
		| 'url'
		| 'tw-url'
		| 'user'
		| 'rating'
		| 'date'
		| 'phone'
		| 'email'
		| 'status';
	unitId?: number;
	updatedAt?: string;
	updatedBy?: number;
	updatedByUserId?: number;
	visibilities: Array<string>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CustomFieldValueCompany = {
	company: TeamworkV3Output_view_Relationship;
	companyId: number;
	countryCode?: string;
	createdAt: string;
	createdBy: number;
	currencySymbol?: string;
	customfield: TeamworkV3Output_view_Relationship;
	customfieldId: number;
	id: number;
	urlTextToDisplay?: string;
	value: TeamworkJsonValue;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CustomFieldValueProject = {
	countryCode?: string;
	createdAt: string;
	createdBy: number;
	currencySymbol?: string;
	customfield: TeamworkV3Output_view_Relationship;
	customfieldId: number;
	id: number;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
	urlTextToDisplay?: string;
	value: TeamworkJsonValue;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_CustomFieldValueTask = {
	countryCode?: string;
	createdAt: string;
	createdBy: number;
	currencySymbol?: string;
	customfield: TeamworkV3Output_view_Relationship;
	customfieldId: number;
	id: number;
	task: TeamworkV3Output_view_Relationship;
	taskId: number;
	urlTextToDisplay?: string;
	value: TeamworkJsonValue;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_DashboardData = {
	availableMinutes: number;
	billableUtilization: number;
	estimatedBillableUtilization: number;
	estimatedUtilization: number;
	totalWorkingMinutes: number;
	unavailableMinutes: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_EffectiveUserRate = {
	effectiveRate?: number;
	user: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Error = {
	code?: string;
	detail?: string;
	id?: string;
	meta?: Record<string, TeamworkJsonValue>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ExchangeRate = {
	date: string;
	fromCurrency: TeamworkV3Output_view_Relationship;
	rate: number;
	source?: 'live' | 'custom';
	toCurrency: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_FileversionV205 = {
	commentsCount?: number;
	commentsCountRead?: number;
	displayName: string;
	file: TeamworkV3Output_view_Relationship;
	fileId: number;
	fileVersionId: number;
	name: string;
	originalName: string;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	reactions?: TeamworkV3Output_view_ReactionsForObject;
	size: number;
	status: string;
	uploadedAt: string;
	uploadedBy: number;
	versionNo: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_FinancialTotals = {
	totalCost: number;
	totalCostBillable: number;
	totalCostBilled: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Industry = {
	displayOrder: number;
	id: number;
	industryCategory?: TeamworkV3Output_view_Relationship;
	industryCategoryId?: number;
	isActive: boolean;
	isPublished: boolean;
	name: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Integrations = {
	canAccessBox: boolean;
	canAccessDropbox: boolean;
	canAccessGoogleDocs: boolean;
	canAccessOneDrive: boolean;
	canAccessOneDriveBusiness: boolean;
	canAccessSharePoint: boolean;
	projectId: number;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Invoice = {
	PONumber: string;
	company?: TeamworkV3Output_view_Relationship;
	companyId: number;
	companyName?: string;
	createdByUserFirstName?: string;
	createdByUserId: number;
	createdByUserLastName?: string;
	currency?: TeamworkV3Output_view_Relationship;
	currencyCode?: string;
	dateCreated: string;
	dateUpdated: string;
	displayDate?: string;
	dueDate?: string;
	editedByUserFirstName?: string;
	editedByUserLastName?: string;
	expenses?: Array<TeamworkV3Output_view_InvoiceExpense>;
	exportedByUserFirstName?: string;
	exportedByUserId?: number;
	exportedByUserLastName?: string;
	exportedDate?: string;
	exportedTo: TeamworkJsonValue;
	fixedCost?: number;
	id: number;
	lineItems: Array<TeamworkV3Output_view_LineItem>;
	number: string;
	pricing: string;
	project?: TeamworkV3Output_view_Relationship;
	projectId: number;
	projectName: string;
	status: string;
	totalBillable?: number;
	totalExpenses?: number;
	totalTime: number;
	totalTimeBillable?: number;
	totalTimeDecimal: number;
	updatedByUserId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_InvoiceExpense = {
	assigneeDescription: string;
	cost: number;
	count: number;
	createdByUserFirstName: string;
	createdByUserId: number;
	createdByUserLastName: string;
	date: string;
	dateDescription: string;
	datetime: string;
	id: number;
	invoiceId?: number;
	isSummarized: boolean;
	lineItemDescription: string;
	name: string;
	summarizationKey: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_JobRole = {
	billableRatesByCurrencyId?: Record<
		string,
		TeamworkV3Output_view_RoleBillableRate
	>;
	costRatesByCurrencyId?: Record<string, TeamworkV3Output_view_RoleCostRate>;
	createdAt: string;
	createdByUser: number;
	deletedAt?: string;
	deletedByUser?: number;
	id: number;
	isActive: boolean;
	name: string;
	placeholderCount: number;
	primaryUsers?: Array<TeamworkV3Output_view_Relationship>;
	updatedAt?: string;
	updatedByUser?: number;
	users?: Array<TeamworkV3Output_view_Relationship>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_JobRolesDashboard = {
	data: TeamworkV3Output_view_DashboardData;
	jobRole: TeamworkV3Output_view_Relationship;
	jobRoleId: number;
	users?: Array<TeamworkV3Output_view_Relationship>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_LineItem = {
	assigneeDescription: string;
	billable: boolean;
	billableTotal: number;
	date: string;
	dateDescription: string;
	dateLoggedUTC: string;
	decimalHours: number;
	hours: number;
	id: number;
	invoiceRate?: number;
	isSummarized: boolean;
	lineItemDescription: string;
	lineItemTitle: string;
	minutes: number;
	summarizationKey: string;
	taskDescription: string;
	taskId?: number;
	taskListId?: number;
	taskListName: string;
	taskName: string;
	totalMinutes: number;
	userFirstName: string;
	userFullName: string;
	userId: number;
	userLastName: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_LinkItem = {
	category?: TeamworkV3Output_view_Relationship;
	categoryId?: number;
	code?: string;
	createdAt?: string;
	createdBy: number;
	deleted: boolean;
	deletedAt?: string;
	deletedBy?: number;
	forceNewWindow: number;
	height: number;
	id: number;
	isPrivate: boolean;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	provider?: string;
	tags: Array<TeamworkV3Output_view_Relationship>;
	updatedAt?: string;
	updatedBy?: number;
	width: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Lockdown = {
	grantAccessTo: TeamworkV3Output_view_UserGroupsDeprecated;
	id: number;
	items?: Array<TeamworkV3Output_view_Relationship>;
	updatedAt: string;
	user?: TeamworkV3Output_view_Relationship;
	userID?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Meta = {
	averageSpend?: number;
	data?: Record<string, TeamworkJsonValue>;
	financialAverageSpend?: number;
	limit?: number;
	nextCursor?: string;
	page?: TeamworkV3Output_view_MetaPage;
	prevCursor?: string;
	timeAverageSpend?: number;
	totalCapacity?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_MetaPage = {
	count: number;
	hasMore: boolean;
	pageOffset: number;
	pageSize: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Milestone = {
	canComplete: boolean;
	canEdit: boolean;
	changeFollowerIds?: Array<number>;
	changeFollowers?: Array<TeamworkV3Output_view_Relationship>;
	commentFollowerIds?: Array<number>;
	commentFollowers?: Array<TeamworkV3Output_view_Relationship>;
	commentsCount?: number;
	completed: boolean;
	completedBy?: number;
	completedOn?: string;
	completerId?: number;
	createdBy: number;
	createdOn: string;
	creatorUserId: number;
	deadline: string;
	deletedOn?: string;
	descriptionHTML: string;
	id: number;
	isDeleted: boolean;
	lastChangedOn: string;
	latestUpdates?: Array<TeamworkV3Output_view_Audit>;
	lockdown?: TeamworkV3Output_view_Relationship;
	lockdownId?: number;
	name: string;
	numCommentsRead?: number;
	originalDueDate?: string;
	percentageComplete?: number;
	percentageTasksCompleted?: number;
	private: boolean;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	reminder: boolean;
	responsibleParties?: Array<TeamworkV3Output_view_Relationship>;
	responsiblePartyIds?: Array<number>;
	status: string;
	tagIds?: Array<number>;
	tags?: Array<TeamworkV3Output_view_Relationship>;
	tasklistIds?: Array<number>;
	tasklists?: Array<TeamworkV3Output_view_Relationship>;
	updatedBy?: number;
	userFollowingChanges: boolean;
	userFollowingComments: boolean;
	userFollowingComplete: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Money = {
	amount?: number;
	currency: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Notebook = {
	category?: TeamworkV3Output_view_Relationship;
	categoryId?: number;
	changeFollowers: TeamworkV3Output_view_UserGroupsDeprecated;
	commentFollowers: TeamworkV3Output_view_UserGroupsDeprecated;
	commentsCount?: number;
	contentHTML?: string;
	contents?: string;
	createdAt?: string;
	createdBy?: number;
	createdByUserID?: number;
	dateCreated?: string;
	dateDeleted?: string;
	dateUpdated?: string;
	deleted: boolean;
	deletedAt?: string;
	deletedBy?: number;
	deletedByUserID?: number;
	id: number;
	isFullWidth: boolean;
	isPrivate: boolean;
	latestVersionNo?: number;
	lockdown?: TeamworkV3Output_view_Relationship;
	lockdownId: number;
	locked: boolean;
	lockedAt?: string;
	lockedBy?: number;
	name?: string;
	notebookVersion?: TeamworkV3Output_view_Relationship;
	notebookVersionCreatedDateTime?: string;
	notebookVersionID?: number;
	notebookVersionUpdatedDateTime?: string;
	privacy?: TeamworkV3Output_view_UserGroupsDeprecated;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	readCommentsCount?: number;
	secureContent: boolean;
	tagIds: Array<number>;
	tags: Array<TeamworkV3Output_view_Relationship>;
	type: 'MARKDOWN' | 'HTML';
	updatedAt?: string;
	updatedBy?: number;
	updatedByUserID?: number;
	userFollowingChanges: boolean;
	userFollowingComments: boolean;
	versionCount?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_NotebookCategory = {
	color: string;
	elementsCount: number;
	id: number;
	name: string;
	parent?: TeamworkV3Output_view_Relationship;
	parentId?: number;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_NotebookVersion = {
	contentHTML?: string;
	contents?: string;
	createdAt?: string;
	createdBy?: number;
	createdByUserID?: number;
	dateCreated?: string;
	dateUpdated?: string;
	notebook: TeamworkV3Output_view_Relationship;
	notebookId: number;
	updatedAt?: string;
	versionId: number;
	versionNumber: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_OriginalValue = {
	exchangeRate: TeamworkV3Output_view_ExchangeRate;
	rate: TeamworkV3Output_view_Money;
	total: TeamworkV3Output_view_Money;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_PortfolioBoard = {
	color: string;
	id: number;
	name: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_PortfolioCard = {
	board: TeamworkV3Output_view_Relationship;
	boardId: number;
	column: TeamworkV3Output_view_Relationship;
	columnId: number;
	id: number;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_PortfolioColumn = {
	color: string;
	id: number;
	name: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProfitDetails = {
	billable?: number;
	billableTime?: number;
	billableTimeFinancial?: number;
	companyCount?: number;
	cost?: number;
	expenses?: number;
	expensesBillableTotal?: number;
	loggedTime?: number;
	nonBillableTime?: number;
	ownerCount?: number;
	profit?: number;
	profitPercentage?: number;
	profitTargetPercentage?: number;
	revenueTimeBased?: number;
	targetCostsDollars?: number;
	targetProfitDollars?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectBudget = {
	PONumber?: string;
	baselineCapacity: number;
	budgetCategory?: string;
	budgetExpectedCost?: number;
	budgetExpectedProfit?: number;
	budgetProfitMargin?: number;
	capacity: number;
	capacityUsed: number;
	carryCapacity: number;
	carryOverspend: boolean;
	carryUnderspend: boolean;
	completedAt?: string;
	completedBy?: number;
	completedByUserId?: number;
	createdAt: string;
	createdBy: number;
	createdByUserId: number;
	currencyCode?: string;
	dateCompleted?: string;
	dateCreated: string;
	dateDeleted?: string;
	dateUpdated?: string;
	defaultRate?: number;
	deletedAt?: string;
	deletedBy?: number;
	deletedByUserId?: number;
	endDate?: string;
	endDateTime?: string;
	expenseType?: string;
	finalizerEndDate?: string;
	financialBaselineCapacity?: number;
	financialCapacity?: number;
	financialCapacityUsed?: number;
	financialCarryCapacity?: number;
	financialDetailsHidden: boolean;
	financialOverspendAt?: string;
	id: number;
	isPrepaid: boolean;
	isRepeating: boolean;
	isRetainer: boolean;
	name?: string;
	notes?: string;
	notificationIds: Array<number>;
	notifications: Array<TeamworkV3Output_view_Relationship>;
	originatorBudget?: TeamworkV3Output_view_Relationship;
	originatorBudgetId?: number;
	originatorStartDate?: string;
	originatorStartDateTime?: string;
	overspendAt?: string;
	prepaidAction?: string;
	prepaidNextEndCondition?: string;
	prepaidNextName?: string;
	prepaidParentBudgetId?: number;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
	repeatPeriod?: number;
	repeatUnit?: string;
	repeatsRemaining?: number;
	sequenceEnd?: string;
	sequenceLength?: number;
	sequenceNumber: number;
	sequenceStart?: string;
	startDate?: string;
	startDateTime?: string;
	status: string;
	timeBaselineCapacity?: number;
	timeCapacity?: number;
	timeCapacityUsed?: number;
	timeCarryCapacity?: number;
	timeOverspendAt?: string;
	timelogType: string;
	type: string;
	updatedAt?: string;
	updatedBy?: number;
	updatedByUserId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectCategory = {
	color: string;
	count: number;
	id: number;
	name: string;
	parent?: TeamworkV3Output_view_Relationship;
	parentId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectCounts = {
	active: number;
	archived: number;
	completed: number;
	current: number;
	late: number;
	total: number;
	upcoming: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectEmailDropbox = {
	id: number;
	itemCode?: string;
	itemEmail?: string;
	itemType?: string;
	parent?: TeamworkV3Output_view_Relationship;
	project: TeamworkV3Output_view_Relationship;
	projectCode: string;
	projectEmails: TeamworkV3Output_view_ProjectEmails;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectEmails = {
	files: string;
	links: string;
	messages: string;
	notebooks: string;
	tasks: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectFileV205 = {
	category?: TeamworkV3Output_view_Relationship;
	categoryId?: number;
	changeFollowers: TeamworkV3Output_view_UserGroupsDeprecated;
	commentFollowers: TeamworkV3Output_view_UserGroupsDeprecated;
	commentsCount?: number;
	commentsCountRead?: number;
	deletedAt?: string;
	deletedBy?: number;
	displayName: string;
	downloadURL?: string;
	extraData?: string;
	fileSource: string;
	filenameOnDisk: string;
	id: number;
	isLocked: boolean;
	isPrivate: '0' | '1' | '2';
	latestFileVersionNo: number;
	lockdown?: TeamworkV3Output_view_Relationship;
	lockdownId?: number;
	lockedAt?: string;
	lockedBy: number;
	lockedByUserId: number;
	lockedDate?: string;
	meta?: Record<string, TeamworkJsonValue>;
	numLikes?: number;
	originalName: string;
	previewURL?: string;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	reactions?: TeamworkV3Output_view_ReactionsForObject;
	relatedItems?: TeamworkV3Output_view_RelatedItems;
	shareable?: boolean;
	size: number;
	status: 'active' | 'deleted';
	tagIds?: Array<number>;
	tags?: Array<TeamworkV3Output_view_Relationship>;
	thumbURL?: string;
	updatedAt?: string;
	uploadedAt: string;
	uploadedBy: number;
	uploadedByUserID: number;
	uploadedDate: string;
	version: TeamworkV3Output_view_Relationship;
	versionId: number;
	versions?: Array<TeamworkV3Output_view_FileversionV205>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectItemStats = {
	billing: TeamworkV3Output_view_ProjectStats;
	events: TeamworkV3Output_view_ProjectStats;
	milestones: TeamworkV3Output_view_ProjectStats;
	tasks: TeamworkV3Output_view_ProjectStats;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectMinMaxAvailableDates = {
	deadlinesFound: boolean;
	maxEndDate?: string;
	minStartDate?: string;
	suggestedEndDate: string;
	suggestedStartDate: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectPermissions = {
	active?: boolean;
	addExpenses?: boolean;
	addFiles?: boolean;
	addForms?: boolean;
	addLinks?: boolean;
	addMessages?: boolean;
	addMilestones?: boolean;
	addNotebooks?: boolean;
	addProjectUpdate?: boolean;
	addRisks?: boolean;
	addTaskLists?: boolean;
	addTasks?: boolean;
	addTime?: boolean;
	canAccess?: boolean;
	canEditWorkflows?: boolean;
	canManagePeople?: boolean;
	canManageProjectBudget?: boolean;
	canManageProjectMembership?: boolean;
	canManageProjectTemplates?: boolean;
	canManageRates?: boolean;
	canManageSchedule?: boolean;
	canViewForms?: boolean;
	canViewProjectBudget?: boolean;
	canViewProjectMembers?: boolean;
	canViewProjectProfitability?: boolean;
	canViewProjectTemplates?: boolean;
	canViewRates?: boolean;
	canViewSchedule?: boolean;
	canViewWorkflows?: boolean;
	editAllTasks?: boolean;
	inOwnerCompany?: boolean;
	isArchived?: boolean;
	isObserving?: boolean;
	manageCustomFields?: boolean;
	projectAdministrator?: boolean;
	receiveEmailNotifications?: boolean;
	setPrivacy?: boolean;
	viewAllTimeLogs?: boolean;
	viewEstimatedTime?: boolean;
	viewInvoices?: boolean;
	viewLinks?: boolean;
	viewMessagesAndFiles?: boolean;
	viewNotebooks?: boolean;
	viewProjectUpdate?: boolean;
	viewRiskRegister?: boolean;
	viewTasksAndMilestones?: boolean;
	viewTime?: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectProfitabilitySummary = {
	billableTotal?: number;
	profit?: number;
	totalCost?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectStats = {
	active: number;
	archived: number;
	complete: number;
	count: number;
	current: number;
	hasEvents?: boolean;
	late: number;
	noDate: number;
	starred: number;
	today: number;
	upcoming: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProjectUpdate = {
	color: string;
	createdAt: string;
	createdBy: number;
	deleted: boolean;
	deletedAt?: string;
	deletedBy?: number;
	health: number;
	healthLabel: string;
	id: number;
	isActive?: boolean;
	likeFromUserIDs?: Array<number>;
	likeFromUsers?: Array<TeamworkV3Output_view_Relationship>;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
	reactions?: TeamworkV3Output_view_ReactionsForObject;
	text: string;
	updatedAt: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3SelectedFields<T> = T extends Array<infer Item>
	? Array<TeamworkV3SelectedFields<Item>>
	: T extends object
		? { [Key in keyof T]?: TeamworkV3SelectedFields<T[Key]> }
		: T;
type TeamworkV3Output_view_ProjectV205 = TeamworkV3SelectedFields<
	{
		activePages: {
			billing?: boolean;
			board?: boolean;
			comments?: boolean;
			files?: boolean;
			finance?: boolean;
			forms?: boolean;
			gantt?: boolean;
			links?: boolean;
			list?: boolean;
			messages?: boolean;
			milestones?: boolean;
			notebooks?: boolean;
			proofs?: boolean;
			riskRegister?: boolean;
			schedule?: boolean;
			table?: boolean;
			tasks?: boolean;
			tickets?: boolean;
			time?: boolean;
			timeline?: boolean;
		} & Record<string, TeamworkJsonValue>;
		allowNotifyAnyone: boolean;
		announcement: string;
		archivedAt?: string;
		archivedBy?: number;
		budgetCount: number;
		category?: TeamworkV3Output_view_Relationship;
		categoryId?: number;
		company: {
			id: number;
			meta?: { name: string } & Record<string, TeamworkJsonValue>;
			type: string;
		} & Record<string, TeamworkJsonValue>;
		companyId: number;
		completedAt?: string;
		completedBy?: number;
		createdAt?: string;
		createdBy?: number;
		customFieldValueIds: Array<number>;
		customfieldValues: Array<TeamworkV3Output_view_Relationship>;
		defaultPrivacy: 'open' | 'owner company' | 'custom';
		deletedAt?: string;
		deletedBy?: number;
		directFileUploadsEnabled: boolean;
		endAt?: string;
		endDate?: string;
		financialBudget?: TeamworkV3Output_view_Relationship;
		financialBudgetId?: number;
		harvestTimersEnabled: boolean;
		id: number;
		integrations: {
			googleDrive?: {
				access?: string;
				enabled?: boolean;
				folder?: string;
				folderName?: string;
			} & Record<string, TeamworkJsonValue>;
			oneDriveBusiness?: {
				account?: string;
				enabled?: boolean;
				folder?: string;
				folderName?: string;
			} & Record<string, TeamworkJsonValue>;
			sharepoint?: {
				account?: string;
				enabled?: boolean;
				folder?: string;
				folderName?: string;
			} & Record<string, TeamworkJsonValue>;
			xero?: {
				baseCurrency?: string;
				connected?: boolean;
				countryCode?: string;
				enabled?: boolean;
				organisation?: string;
			} & Record<string, TeamworkJsonValue>;
		} & Record<string, TeamworkJsonValue>;
		isBillable: boolean;
		isOnBoardingProject: boolean;
		isProjectAdmin?: boolean;
		isSampleProject: boolean;
		isStarred?: boolean;
		lastWorkedOn?: string;
		latestActivity?: TeamworkV3Output_view_Relationship;
		logo: string;
		logoColor?: string;
		logoIcon?: string;
		minMaxAvailableDates?: TeamworkV3Output_view_ProjectMinMaxAvailableDates;
		name: string;
		notifyCommentIncludeCreator: boolean;
		notifyEveryone: boolean;
		notifyTaskAssignee: boolean;
		overviewStartPage: string;
		ownedBy?: number;
		ownerId?: number;
		portfolioCards?: Array<TeamworkV3Output_view_Relationship>;
		privacyEnabled: boolean;
		projectNumber?: string;
		projectNumberCounter?: number;
		projectOwner?: TeamworkV3Output_view_Relationship;
		projectOwnerId?: number;
		replyByEmailEnabled: boolean;
		showAnnouncement: boolean;
		skipWeekends: boolean;
		startAt?: string;
		startDate?: string;
		startPage: string;
		status: 'active' | 'inactive' | 'deleted';
		subStatus: 'current' | 'upcoming' | 'late' | 'completed';
		tagIds: Array<number>;
		tags: Array<TeamworkV3Output_view_Relationship>;
		tasksStartPage: string;
		timeBudget?: TeamworkV3Output_view_Relationship;
		timeBudgetId?: number;
		timelogRequiresTask: boolean;
		type:
			| 'normal'
			| 'tasklists-template'
			| 'projects-template'
			| 'personal'
			| 'tentative';
		update?: TeamworkV3Output_view_Relationship;
		updateId?: number;
		updatedAt?: string;
		updatedBy?: number;
		users?: Array<TeamworkV3Output_view_Relationship>;
		workflowIds: Array<number>;
		workflows?: Array<TeamworkV3Output_view_Relationship>;
	} & Record<string, TeamworkJsonValue>
>;
type TeamworkV3Output_view_ProjectsUserMeta = { hasProjects: boolean } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_view_Proof = {
	assignees: Array<TeamworkV3Output_view_Assignee>;
	company?: TeamworkV3Output_view_Relationship;
	createdAt?: string;
	createdBy?: TeamworkV3Output_view_Relationship;
	deletedAt?: string;
	deletedBy?: TeamworkV3Output_view_Relationship;
	due?: string;
	entity?: TeamworkV3Output_view_Relationship;
	errorObjectIdxs: Array<number>;
	feedbackCount: number;
	id: number;
	installationId?: TeamworkV3Output_view_Relationship;
	objects: Array<TeamworkV3Output_view_ProofObject>;
	parent?: TeamworkV3Output_view_Relationship;
	product?: string;
	state: 'active' | 'archived' | 'deleted';
	status: 'pending' | 'approved' | 'rejected';
	updatedAt?: string;
	updatedBy?: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ProofObject = {
	URL: string;
	approvalStatus: 'pending' | 'approved' | 'rejected';
	createdAt?: string;
	createdBy?: TeamworkV3Output_view_Relationship;
	deletedAt?: string;
	deletedBy?: TeamworkV3Output_view_Relationship;
	due?: string;
	format: string;
	id: number;
	installationId?: TeamworkV3Output_view_Relationship;
	size: number;
	sourceFormat: string;
	state: 'processing' | 'active' | 'error';
	stateMessage?: string;
	thumbnail: string;
	totalChunks: number;
	type: 'upload' | 'link';
	updatedAt?: string;
	updatedBy?: TeamworkV3Output_view_Relationship;
	version: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Reaction = {
	emoji: string;
	installation?: TeamworkV3Output_view_Relationship;
	installationId: number;
	object: TeamworkV3Output_view_Relationship;
	objectId: number;
	objectType:
		| 'fileVersion'
		| 'notebook'
		| 'milestone'
		| 'link'
		| 'messagereply'
		| 'comment'
		| 'projectUpdate';
	postedDateTime: string;
	type: 'like' | 'dislike' | 'joy' | 'frown' | 'heart' | '';
	user: TeamworkV3Output_view_Relationship;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ReactionCount = {
	count: number;
	emoji: string;
	mine: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ReactionsForObject = {
	counts: TeamworkV3Output_view_ReactionsForObjectCounter;
	extendedReactions: Array<TeamworkV3Output_view_ReactionCount>;
	mine: Array<'like' | 'dislike' | 'joy' | 'frown' | 'heart' | ''>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ReactionsForObjectCounter = {
	dislike: number;
	frown: number;
	heart: number;
	joy: number;
	like: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_RelatedItems = {
	comments: Array<number>;
	messages: Array<number>;
	tasks: Array<number>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Relationship = {
	id: number;
	meta?: Record<string, TeamworkJsonValue>;
	type: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_ReportUtilizationData = {
	actualUtilization?: number;
	allocatedMinutes?: number;
	allocatedMinutesAverage?: number;
	allocatedUtilization?: number;
	availableMinutes: number;
	availableMinutesAverage: number;
	availableUtilization?: number;
	averageCompanyCount?: number;
	averageUtilizationAchieved?: number;
	averageUtilizationTargets?: number;
	billableMinutes?: number;
	billableMinutesAverage?: number;
	billableUtilization: number;
	endDate?: string;
	estimatedBillableUtilization: number;
	estimatedMinutes?: number;
	estimatedMinutesAverage?: number;
	estimatedNonBillableUtilization?: number;
	estimatedUtilization: number;
	loggedMinutes?: number;
	loggedMinutesAverage?: number;
	nonBillableUtilization?: number;
	periodTotals?: Array<TeamworkV3Output_view_UtilizationTotals>;
	rowsCount: number;
	startDate?: string;
	totalWorkingMinutes: number;
	totalWorkingMinutesAverage: number;
	unavailableMinutes: number;
	unavailableMinutesAverage: number;
	unavailableUtilization?: number;
	unbillableMinutes?: number;
	unbillableMinutesAverage?: number;
	uniqueCompanyCount?: number;
	users: Array<TeamworkV3Output_view_UserUtilization>;
	usersInTarget?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_RoleBillableRate = {
	createdAt: string;
	createdByUserId: number;
	rate: TeamworkV3Output_view_Money;
	updatedAt?: string;
	updatedByUserId?: number;
	validFrom: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_RoleCostRate = {
	createdAt: string;
	createdByUserId: number;
	rate: TeamworkV3Output_view_Money;
	updatedAt?: string;
	updatedByUserId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_SampleProject = {
	category?: TeamworkV3Output_view_Relationship;
	categoryId?: number;
	code: string;
	content: TeamworkJsonValue;
	icon?: string;
	id: number;
	imagePreview?: string;
	name: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Skill = {
	createdAt: string;
	createdByUser: number;
	deletedAt?: string;
	deletedByUser?: number;
	id: number;
	name: string;
	peopleCount?: number;
	updatedAt?: string;
	updatedByUser?: number;
	users?: Array<
		{
			id: number;
			meta?: { level: number | null } & Record<string, TeamworkJsonValue>;
			type: string;
		} & Record<string, TeamworkJsonValue>
	>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Stage = {
	color?: string;
	createdAt?: string;
	createdBy?: number;
	deletedAt?: string;
	deletedBy?: number;
	displayOrder: number;
	id: number;
	name: string;
	showCompletedTasks?: boolean;
	taskIds?: Array<number>;
	updatedAt?: string;
	updatedBy?: number;
	workflow: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Status = {
	dateLastUpdated: string;
	dateTime?: string;
	deleted?: boolean;
	emoji?: string;
	id: number;
	ipAddress?: string;
	text?: string;
	updatedAt: string;
	user?: TeamworkV3Output_view_Relationship;
	userId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Tag = {
	color: string;
	count?: number;
	id: number;
	name: string;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskAffectedV205 = {
	linkedCardId?: number;
	linkedColumnId?: number;
	linkedColumnName?: string;
	taskIds: Array<number>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskCommentStats = {
	read: number;
	total: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskEmailCommentStats = {
	read: number;
	total: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskMeta = {
	commentStats?: TeamworkV3Output_view_TaskCommentStats;
	emailCommentStats?: TeamworkV3Output_view_TaskEmailCommentStats;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskPermissions = {
	canAddSubtasks: boolean;
	canComplete: boolean;
	canEdit: boolean;
	canLogTime: boolean;
	canViewEstTime: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskPredecessor = {
	id: number;
	meta: TeamworkV3Output_view_TaskPredecessorMeta;
	type:
		| 'activities'
		| 'allocations'
		| 'appsettings'
		| 'billingInvoices'
		| 'calendars'
		| 'calendarEventSequences'
		| 'calendarEventTypes'
		| 'calendarEvents'
		| 'capacities'
		| 'comments'
		| 'companies'
		| 'companyUpdates'
		| 'companyDomains'
		| 'customfieldProjects'
		| 'customfields'
		| 'customReports'
		| 'dashboardPanels'
		| 'dashboardSettings'
		| 'fileCategories'
		| 'fileVersions'
		| 'files'
		| 'forms'
		| 'industries'
		| 'industryCategories'
		| 'installations'
		| 'linkCategories'
		| 'links'
		| 'lockdowns'
		| 'messageReplies'
		| 'messages'
		| 'milestones'
		| 'notebookCategories'
		| 'notebookVersions'
		| 'notebooks'
		| 'portfolioBoards'
		| 'portfolioCards'
		| 'portfolioColumns'
		| 'columns'
		| 'cards'
		| 'projectBudgetNotifications'
		| 'projectBudgets'
		| 'tasklistBudgets'
		| 'projectCategories'
		| 'projectUpdates'
		| 'projects'
		| 'publishers'
		| 'reactions'
		| 'reportScheduleLogs'
		| 'risks'
		| 'statuses'
		| 'tags'
		| 'tasklists'
		| 'tasklistBudgetNotifications'
		| 'taskgroups'
		| 'tasks'
		| 'taskSequences'
		| 'teams'
		| 'timers'
		| 'timelogs'
		| 'userFilters'
		| 'users'
		| 'workflows'
		| 'workflowStages'
		| 'workingHourEntries'
		| 'workingHours'
		| 'timesheetCustomRows'
		| 'companyTimesheet'
		| 'emailMessages'
		| 'connectedEmails'
		| 'emailMessageAttachments'
		| 'emailMessageSentTos'
		| 'emailUsers'
		| 'badgeLevels'
		| 'proofs'
		| 'timeApprovals'
		| 'costRates'
		| 'jobRoles'
		| 'currencies'
		| 'billingExpenses'
		| 'skills'
		| 'expenseCategories'
		| 'publicHolidays'
		| 'customItemViews'
		| 'customItemFields'
		| 'customItemRecords'
		| 'customItemSections'
		| 'customItems'
		| 'userEffectiveRate'
		| 'jobRoleBillableRate'
		| 'jobRoleCostRate'
		| 'placeholders'
		| 'helpdocs'
		| 'clientPortals'
		| 'linkedClientPortalCompanies';
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskPredecessorMeta = {
	dependancyHardness: string;
	predecessorTaskMust: string;
	predecessorType: string;
	projectId: string;
	tasklistId: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskReminder = {
	createdAt: string;
	createdBy: TeamworkV3Output_view_Relationship;
	id: number;
	isRelative: boolean;
	note: string;
	relativeNumberDays: number;
	remindAt: string;
	task: TeamworkV3Output_view_Relationship;
	type: 'email' | 'sms' | 'push';
	user: TeamworkV3Output_view_Relationship;
	wasSent: boolean;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskSequence = {
	dates?: Array<string>;
	duration?: number;
	endDate?: string;
	frequency:
		| 'norepeat'
		| 'daily'
		| 'weekdays'
		| 'selecteddays'
		| 'weekly'
		| 'everyxdays'
		| 'everyxdaysweekday'
		| 'every2weeks'
		| 'every3weeks'
		| 'every4weeks'
		| 'every5weeks'
		| 'every6weeks'
		| 'monthly'
		| 'every2months'
		| 'every3months'
		| 'every4months'
		| 'every6months'
		| 'yearly';
	id: number;
	installationId?: number;
	monthlyRepeatType?: 'weekDay' | 'monthDay' | 'lastDayOfMonth';
	occurrences?: Array<TeamworkV3Output_view_TaskSequenceOccurrence>;
	rrule?: string;
	selectedWeekDays: Array<
		| 'sunday'
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
	>;
	tasks?: Array<TeamworkV3Output_view_Relationship>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskSequenceOccurrence = {
	due: string;
	estimateMinutes: number;
	start: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskStats = {
	active: number;
	complete: number;
	id: number;
	late: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskTimeTotals = {
	accumulatedBillableLoggedMinutes?: number;
	accumulatedBilledloggedMinutes?: number;
	accumulatedLoggedMinutes?: number;
	billableLoggedMinutes: number;
	billedloggedMinutes: number;
	loggedMinutes: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskV205 = {
	accumulatedEstimatedMinutes: number;
	assigneeCompanies: Array<TeamworkV3Output_view_Relationship>;
	assigneeCompanyIds: Array<number>;
	assigneeJobRoleIds: Array<number>;
	assigneeJobRoles: Array<TeamworkV3Output_view_Relationship>;
	assigneeTeamIds: Array<number>;
	assigneeTeams: Array<TeamworkV3Output_view_Relationship>;
	assigneeUserIds: Array<number>;
	assigneeUsers: Array<TeamworkV3Output_view_Relationship>;
	assignees: Array<TeamworkV3Output_view_Relationship>;
	attachments: Array<TeamworkV3Output_view_Relationship>;
	capacities: Array<TeamworkV3Output_view_Relationship>;
	changeFollowers: Array<TeamworkV3Output_view_Relationship>;
	column?: TeamworkV3Output_view_Relationship;
	commentFollowers: Array<TeamworkV3Output_view_Relationship>;
	completeFollowers: Array<TeamworkV3Output_view_Relationship>;
	completedAt?: string;
	completedBy?: number;
	completedOn?: string;
	createdAt?: string;
	createdBy?: number;
	createdByUserId?: number;
	crmDealIds: Array<number>;
	dateUpdated: string;
	decimalDisplayOrder: number;
	deletedAt?: string;
	deletedBy?: number;
	dependencyIds?: Array<number>;
	descriptionContentType?: string;
	displayOrder: number;
	dueDate?: string;
	dueDateBase?: string;
	dueDateFromMilestone: boolean;
	dueDateOffset?: number;
	estimateMinutes: number;
	hasDeskTickets: boolean;
	hasReminders?: boolean;
	hasTimeblocks?: boolean;
	id: number;
	isArchived: boolean;
	isBlocked?: boolean;
	isPrivate: number;
	latestUpdates?: Array<TeamworkV3Output_view_Audit>;
	lockdown?: TeamworkV3Output_view_Relationship;
	meta?: TeamworkV3Output_view_TaskMeta;
	name: string;
	notify: boolean;
	originalDueDate?: string;
	outOfSequence?: boolean;
	parentTask?: TeamworkV3Output_view_Relationship;
	parentTaskId: number;
	predecessorIds?: Array<number>;
	predecessors?: Array<TeamworkV3Output_view_TaskPredecessor>;
	priority?: 'none' | '' | 'low' | 'medium' | 'high';
	progress: number;
	proofs: Array<TeamworkV3Output_view_Relationship>;
	sequence?: TeamworkV3Output_view_Relationship;
	sequenceDueDate?: string;
	sequenceId?: number;
	sequenceRootTask?: boolean;
	sequenceStartDate?: string;
	startDate?: string;
	startDateOffset?: number;
	status: string;
	subTaskIds?: Array<number>;
	tagIds: Array<number>;
	tags: Array<TeamworkV3Output_view_Relationship>;
	tasklist: {
		id: number;
		meta?: {
			companyId?: number;
			companyName?: string;
			name: string;
			projectId: number;
			projectName?: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	tasklistId: number;
	templateRoleName?: string;
	timer?: TeamworkV3Output_view_Relationship;
	updatedAt: string;
	updatedBy?: number;
	userPermissions?: TeamworkV3Output_view_TaskPermissions;
	workflowStages?: Array<TeamworkV3Output_view_TaskWorkflowStageData>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TaskWorkflowStageData = {
	stageId: number;
	stageTaskDisplayOrder: number;
	workflowId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Taskgroup = {
	createdAt?: string;
	createdBy?: number;
	displayOrder: number;
	id: number;
	name: string;
	status: string;
	taskIds?: Array<number>;
	updatedAt?: string;
	updatedBy?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Tasklist = {
	calculatedDueDate?: string;
	calculatedStartDate?: string;
	createdAt?: string;
	defaultTask?: TeamworkV3Output_view_Relationship;
	defaultTaskId?: number;
	displayOrder: number;
	icon?: string;
	id: number;
	isBillable?: boolean;
	isPinned: boolean;
	isPrivate: boolean;
	lockdown?: TeamworkV3Output_view_Relationship;
	lockdownId?: number;
	milestone?: TeamworkV3Output_view_Relationship;
	milestoneId?: number;
	name: string;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectId: number;
	status: 'deleted' | 'completed' | 'reopened' | 'new' | '';
	tasklistBudget?: TeamworkV3Output_view_Relationship;
	updatedAt?: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TasklistBudget = {
	capacity: number;
	capacityUsed: number;
	createdAt: string;
	createdBy: number;
	deletedAt?: string;
	deletedBy?: number;
	financialCapacity?: number;
	financialCapacityUsed?: number;
	id: number;
	installationId: number;
	milestone?: TeamworkV3Output_view_Relationship;
	notificationIds: Array<number>;
	notifications: Array<TeamworkV3Output_view_Relationship>;
	projectBudgetId: number;
	projectId: number;
	projectbudget: TeamworkV3Output_view_Relationship;
	tasklist: TeamworkV3Output_view_Relationship;
	tasklistId: number;
	timeCapacity?: number;
	timeCapacityUsed?: number;
	type: string;
	updatedAt: string;
	updatedBy: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TasklistBudgetNotification = {
	budgetDimension: string;
	budgetId: number;
	capacityThreshold: number;
	companyId: number;
	id: number;
	notificationMedium: string;
	teamId: number;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Team = {
	company?: {
		id: number;
		meta?: { name: string } & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	createdAt: string;
	createdBy: TeamworkV3Output_view_Relationship;
	handle: string;
	id: number;
	name: string;
	teamLogo?: string;
	teamLogoColor?: string;
	teamLogoIcon?: string;
	updatedAt: string;
	updatedBy: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TeamsDashboard = {
	data: TeamworkV3Output_view_DashboardData;
	team: TeamworkV3Output_view_Relationship;
	teamId: number;
	users?: Array<TeamworkV3Output_view_Relationship>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportCompanyData = {
	billableTime: number;
	billedTime: number;
	company: TeamworkV3Output_view_Relationship;
	estimatedTime: number;
	loggedTime: number;
	nonBillableTime: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportData = {
	companies?: Array<TeamworkV3Output_view_TimeReportCompanyData>;
	projects?: Array<TeamworkV3Output_view_TimeReportProjectData>;
	tasklists?: Array<TeamworkV3Output_view_TimeReportTasklistData>;
	tasks?: Array<TeamworkV3Output_view_TimeReportTaskData>;
	teams?: Array<TeamworkV3Output_view_TimeReportTeamData>;
	users?: Array<TeamworkV3Output_view_TimeReportUserData>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportProjectData = {
	billableTime: number;
	billedTime: number;
	estimatedTime: number;
	financialBudget?: TeamworkV3Output_view_Relationship;
	loggedTime: number;
	nonBillableTime: number;
	project: TeamworkV3Output_view_Relationship;
	timeBudget?: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportTaskData = {
	billableTime: number;
	billedTime: number;
	estimatedTime: number;
	loggedTime: number;
	nonBillableTime: number;
	parentTask?: TeamworkV3Output_view_Relationship;
	task: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportTasklistData = {
	billableTime: number;
	billedTime: number;
	estimatedTime: number;
	financialBudget?: TeamworkV3Output_view_Relationship;
	loggedTime: number;
	nonBillableTime: number;
	tasklist: TeamworkV3Output_view_Relationship;
	timeBudget?: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportTeamData = {
	billableTime: number;
	billedTime: number;
	estimatedTime: number;
	loggedTime: number;
	nonBillableTime: number;
	team: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportTotal = {
	billableTime: number;
	billedTime: number;
	endDate: string;
	estimatedTime: number;
	loggedTime: number;
	nonBillableTime: number;
	startDate: string;
	timeLogged?: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportTotals = {
	billableTime: number;
	billableTimeAverage?: number;
	billedTime: number;
	billedTimeAverage?: number;
	dates: Array<TeamworkV3Output_view_TimeReportTotal>;
	estimatedTime: number;
	estimatedTimeAverage?: number;
	loggedTime: number;
	loggedTimeAverage?: number;
	nonBillableTime: number;
	nonBillableTimeAverage?: number;
	rowsCount?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimeReportUserData = {
	billableTime: number;
	billedTime: number;
	estimatedTime: number;
	loggedTime: number;
	nonBillableTime: number;
	user: TeamworkV3Output_view_Relationship;
	utilizationTarget: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Timelog = {
	assignedTeamIds?: Array<number>;
	billable: boolean;
	billableInfo?: TeamworkV3Output_view_BillableInfo;
	billableRate?: number;
	budgetAllocations?: Array<TeamworkV3Output_view_BudgetAllocation>;
	childTimelogId?: number;
	costInfo?: TeamworkV3Output_view_CostInfo;
	costRate?: number;
	createdAt: string;
	dateCreated: string;
	dateDeleted?: string;
	dateEdited?: string;
	deleted: boolean;
	deletedAt?: string;
	deletedBy?: number;
	deletedByUserId?: number;
	deskTicketId?: number;
	editedByUserId?: number;
	hasStartTime: boolean;
	id: number;
	isBillable: boolean;
	isLocked: boolean;
	loggedBy: number;
	loggedByUserId: number;
	minutes: number;
	parentTimelogId?: number;
	project: {
		id: number;
		meta?: {
			companyId: number;
			companyName?: string;
			name: string;
			projectNumber?: string;
		} & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	projectBillingInvoice?: TeamworkV3Output_view_Relationship;
	projectBillingInvoiceId?: number;
	projectId: number;
	tagIds?: Array<number>;
	tags?: Array<TeamworkV3Output_view_Relationship>;
	task?: TeamworkV3Output_view_Relationship;
	taskId?: number;
	taskIdPreMove?: number;
	taskPreMove?: TeamworkV3Output_view_Relationship;
	timeLogged: string;
	updatedAt?: string;
	updatedBy?: number;
	user: TeamworkV3Output_view_Relationship;
	userId: number;
	verified: boolean;
	verifiedAt?: string;
	verifiedBy?: TeamworkV3Output_view_Relationship;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimelogTotals = {
	estimatedMinutes: number;
	estimatedMinutesActive: number;
	estimatedMinutesCompleted: number;
	estimatedMinutesFiltered: number;
	estimatedMinutesWithLoggedTime: number;
	minutes: number;
	minutesBillable: number;
	minutesBilled: number;
	minutesNonBillable: number;
	minutesNonBilled: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimelogTotalsSubtasks = {
	estimatedMinutes: number;
	minutes: number;
	minutesBillable: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Timer = {
	billable: boolean;
	createdAt: string;
	deleted: boolean;
	deletedAt?: string;
	duration: number;
	id: number;
	intervals: Array<TeamworkV3Output_view_TimerInterval>;
	lastStartedAt: string;
	project: TeamworkV3Output_view_Relationship;
	projectId: number;
	running: boolean;
	serverTime: string;
	task?: TeamworkV3Output_view_Relationship;
	taskId?: number;
	timeLogId?: number;
	timelog?: TeamworkV3Output_view_Relationship;
	timerLastIntervalEnd?: string;
	updatedAt: string;
	user: TeamworkV3Output_view_Relationship;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_TimerInterval = {
	duration: number;
	from: string;
	id: number;
	to: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_User = {
	avatarUrl: string;
	canAccessPortfolio: boolean;
	canAddProjects: boolean;
	canManagePortfolio: boolean;
	company: {
		id: number;
		meta?: { name: string } & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	companyId: number;
	companyRoleId: number;
	createdAt: string;
	createdBy?: TeamworkV3Output_view_Relationship;
	deleted: boolean;
	email: string;
	firstName: string;
	id: number;
	inOwnerCompany: boolean;
	isAdmin: boolean;
	isClientUser: boolean;
	isPlaceholderResource: boolean;
	isServiceAccount: boolean;
	jobRoles?: Array<TeamworkV3Output_view_Relationship>;
	lastLogin?: string;
	lastName: string;
	lengthOfDay: number;
	linkedClientPortalCompany?: TeamworkV3Output_view_Relationship;
	linkedClientPortalCompanyId?: number;
	loginTarget?: 'portalOnly' | 'teamworkOnly' | 'both';
	meta?: Record<string, TeamworkJsonValue>;
	siteOwner: boolean;
	skills?: Array<
		{
			id: number;
			meta?: { level: number | null } & Record<string, TeamworkJsonValue>;
			type: string;
		} & Record<string, TeamworkJsonValue>
	>;
	teams?: Array<TeamworkV3Output_view_Relationship>;
	timezone?: string;
	type: string;
	updatedAt?: string;
	updatedBy?: TeamworkV3Output_view_Relationship;
	userCost?: number;
	userRate?: number;
	userRates?: Record<string, TeamworkV3Output_view_Money>;
	workingHour?: TeamworkV3Output_view_Relationship;
	workingHoursId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserEvents = { clockedIn?: boolean } & Record<
	string,
	TeamworkJsonValue
>;
type TeamworkV3Output_view_UserGroupsDeprecated = {
	companies: Array<TeamworkV3Output_view_Relationship>;
	companyIds: Array<number>;
	teamIds: Array<number>;
	teams: Array<TeamworkV3Output_view_Relationship>;
	userIds: Array<number>;
	users: Array<TeamworkV3Output_view_Relationship>;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserMe = {
	administrator: boolean;
	auth?: TeamworkV3Output_view_UserMeAuth;
	avatarUrl: string;
	canAccessPortfolio: boolean;
	canAddProjects: boolean;
	canManagePortfolio: boolean;
	canShareAISkills: boolean;
	company: {
		id: number;
		meta?: { name: string } & Record<string, TeamworkJsonValue>;
		type: string;
	} & Record<string, TeamworkJsonValue>;
	companyId: number;
	companyRoleId: number;
	createdAt: string;
	createdBy?: TeamworkV3Output_view_Relationship;
	deleted: boolean;
	email: string;
	emailAddress: string;
	firstName: string;
	id: number;
	inOwnerCompany: boolean;
	installationId: number;
	isAdmin: boolean;
	isClientUser: boolean;
	isPlaceholderResource: boolean;
	isServiceAccount: boolean;
	jobRoles?: Array<TeamworkV3Output_view_Relationship>;
	lastLogin?: string;
	lastName: string;
	ldHash: string;
	lengthOfDay: number;
	linkedClientPortalCompany?: TeamworkV3Output_view_Relationship;
	linkedClientPortalCompanyId?: number;
	loginTarget?: 'portalOnly' | 'teamworkOnly' | 'both';
	meta?: Record<string, TeamworkJsonValue>;
	phoneNumberMobile: string;
	siteOwner: boolean;
	skills?: Array<
		{
			id: number;
			meta?: { level: number | null } & Record<string, TeamworkJsonValue>;
			type: string;
		} & Record<string, TeamworkJsonValue>
	>;
	teams?: Array<TeamworkV3Output_view_Relationship>;
	timezone?: string;
	type: string;
	updatedAt?: string;
	updatedBy?: TeamworkV3Output_view_Relationship;
	userCost?: number;
	userName: string;
	userRate?: number;
	userRates?: Record<string, TeamworkV3Output_view_Money>;
	userType: string;
	workingHour?: TeamworkV3Output_view_Relationship;
	workingHoursId?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserMeAuth = {
	timestamp: string;
	token: string;
	userType: string;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserStatus = {
	id: number;
	reset: boolean;
	status?: TeamworkV3Output_view_Relationship;
	statusId: number;
	updatedAt: string;
	user?: TeamworkV3Output_view_Relationship;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserUtilization = {
	data: Array<TeamworkV3Output_view_UserUtilizationData>;
	user: TeamworkV3Output_view_Relationship;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UserUtilizationData = {
	actualUtilization: number;
	allocatedMinutes: number;
	allocatedUtilization: number;
	availableMinutes: number;
	availableUtilization: number;
	billableMinutes: number;
	billableUtilization: number;
	companyCount: number;
	endDate: string;
	estimatedBillableUtilization: number;
	estimatedMinutes: number;
	estimatedUtilization: number;
	loggedMinutes: number;
	nonBillableUtilization: number;
	startDate: string;
	totalWorkingMinutes: number;
	unavailableMinutes: number;
	unavailableUtilization: number;
	unbillableMinutes: number;
	utilizationAchieved: number;
	utilizationTarget?: number;
	utilizationTargetMinutes: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UsersDashboard = {
	data: TeamworkV3Output_view_DashboardData;
	jobRoles?: Array<TeamworkV3Output_view_Relationship>;
	user: TeamworkV3Output_view_Relationship;
	userId: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_UtilizationTotals = {
	actualUtilization?: number;
	allocatedMinutes?: number;
	allocatedMinutesAverage?: number;
	allocatedUtilization?: number;
	availableMinutes: number;
	availableMinutesAverage: number;
	availableUtilization?: number;
	averageCompanyCount?: number;
	averageUtilizationAchieved?: number;
	averageUtilizationTargets?: number;
	billableMinutes?: number;
	billableMinutesAverage?: number;
	billableUtilization: number;
	endDate?: string;
	estimatedBillableUtilization: number;
	estimatedMinutes?: number;
	estimatedMinutesAverage?: number;
	estimatedNonBillableUtilization?: number;
	estimatedUtilization: number;
	loggedMinutes?: number;
	loggedMinutesAverage?: number;
	nonBillableUtilization?: number;
	rowsCount: number;
	startDate?: string;
	totalWorkingMinutes: number;
	totalWorkingMinutesAverage: number;
	unavailableMinutes: number;
	unavailableMinutesAverage: number;
	unavailableUtilization?: number;
	unbillableMinutes?: number;
	unbillableMinutesAverage?: number;
	uniqueCompanyCount?: number;
	usersInTarget?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_Workflow = {
	companies: Array<TeamworkV3Output_view_Relationship>;
	createdAt?: string;
	createdBy?: number;
	defaultWorkflow?: boolean;
	id: number;
	lockdown?: TeamworkV3Output_view_Relationship;
	name: string;
	projectIds: Array<number>;
	projectSpecific?: boolean;
	stages: Array<TeamworkV3Output_view_Relationship>;
	status: 'active' | 'archived' | 'deleted';
	updatedAt?: string;
	updatedBy?: number;
} & Record<string, TeamworkJsonValue>;
type TeamworkV3Output_view_WorkingHour = {
	createdAt: string;
	dateCreated: string;
	dateUpdated?: string;
	entries: Array<TeamworkV3Output_view_Relationship>;
	entryIds: Array<number>;
	id: number;
	name: string;
	object: TeamworkV3Output_view_Relationship;
	objectId: number;
	objectType: 'user' | 'team';
	updatedAt?: string;
} & Record<string, TeamworkJsonValue>;

export type TeamworkV3Inputs = {
	v3_get_projects_api_v3_allocations_allocationid_time_json: {
		path: { allocationId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_comments_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			publishedStartDate?: string;
			publishedEndDate?: string;
			projectType?: string;
			projectStatuses?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?: 'all' | 'date' | 'project' | 'user' | 'type' | 'id';
			cursor?: string;
			commentStatus?: 'all' | 'read' | 'unread';
			pageSize?: number;
			page?: number;
			limit?: number;
			strictHTML?: boolean;
			skipCounts?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			objectTypes?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectType?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectIds?: Array<number>;
			notifiedUserIds?: Array<number>;
			include?: Array<
				| 'reactions'
				| 'users'
				| 'projects'
				| 'projects.companies'
				| 'files'
				| 'relatedFiles'
				| 'tasks'
				| 'notebooks'
				| 'milestones'
				| 'links'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[links]'?: Array<
				| 'id'
				| 'title'
				| 'description'
				| 'code'
				| 'width'
				| 'height'
				| 'isPrivate'
				| 'provider'
				| 'projectId'
				| 'createdAt'
				| 'forceNewWindow'
				| 'deleted'
				| 'deletedAt'
				| 'updatedAt'
				| 'categoryId'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'project'
			>;
			'fields[fileversions]'?: Array<
				| 'fileVersionId'
				| 'fileId'
				| 'versionNo'
				| 'name'
				| 'originalName'
				| 'size'
				| 'uploadedBy'
				| 'uploadedAt'
				| 'description'
				| 'status'
				| 'projectId'
				| 'reactions'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'displayName'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			commentIds?: Array<number>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_comments_json: {
		path?: Record<string, never>;
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_comment_Request;
	};
	v3_get_projects_api_v3_comments_id_json: {
		path: { id: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			publishedStartDate?: string;
			publishedEndDate?: string;
			projectType?: string;
			projectStatuses?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?: 'all' | 'date' | 'project' | 'user' | 'type' | 'id';
			cursor?: string;
			commentStatus?: 'all' | 'read' | 'unread';
			pageSize?: number;
			page?: number;
			limit?: number;
			strictHTML?: boolean;
			skipCounts?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			objectTypes?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectType?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectIds?: Array<number>;
			notifiedUserIds?: Array<number>;
			include?: Array<
				| 'reactions'
				| 'users'
				| 'projects'
				| 'projects.companies'
				| 'files'
				| 'relatedFiles'
				| 'tasks'
				| 'notebooks'
				| 'milestones'
				| 'links'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[links]'?: Array<
				| 'id'
				| 'title'
				| 'description'
				| 'code'
				| 'width'
				| 'height'
				| 'isPrivate'
				| 'provider'
				| 'projectId'
				| 'createdAt'
				| 'forceNewWindow'
				| 'deleted'
				| 'deletedAt'
				| 'updatedAt'
				| 'categoryId'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'project'
			>;
			'fields[fileversions]'?: Array<
				| 'fileVersionId'
				| 'fileId'
				| 'versionNo'
				| 'name'
				| 'originalName'
				| 'size'
				| 'uploadedBy'
				| 'uploadedAt'
				| 'description'
				| 'status'
				| 'projectId'
				| 'reactions'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'displayName'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			commentIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_comments_id_notified_json: {
		path: { id: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			publishedStartDate?: string;
			publishedEndDate?: string;
			projectType?: string;
			projectStatuses?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?: 'all' | 'date' | 'project' | 'user' | 'type' | 'id';
			cursor?: string;
			commentStatus?: 'all' | 'read' | 'unread';
			pageSize?: number;
			page?: number;
			limit?: number;
			strictHTML?: boolean;
			skipCounts?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			objectTypes?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectType?: Array<
				| 'task'
				| 'file'
				| 'fileversion'
				| 'notebook'
				| 'milestone'
				| 'link'
				| 'projectupdate'
				| 'customitemrecord'
			>;
			objectIds?: Array<number>;
			notifiedUserIds?: Array<number>;
			include?: Array<
				| 'reactions'
				| 'users'
				| 'projects'
				| 'projects.companies'
				| 'files'
				| 'relatedFiles'
				| 'tasks'
				| 'notebooks'
				| 'milestones'
				| 'links'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[links]'?: Array<
				| 'id'
				| 'title'
				| 'description'
				| 'code'
				| 'width'
				| 'height'
				| 'isPrivate'
				| 'provider'
				| 'projectId'
				| 'createdAt'
				| 'forceNewWindow'
				| 'deleted'
				| 'deletedAt'
				| 'updatedAt'
				| 'categoryId'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'project'
			>;
			'fields[fileversions]'?: Array<
				| 'fileVersionId'
				| 'fileId'
				| 'versionNo'
				| 'name'
				| 'originalName'
				| 'size'
				| 'uploadedBy'
				| 'uploadedAt'
				| 'description'
				| 'status'
				| 'projectId'
				| 'reactions'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'displayName'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			commentIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_companies_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			reportType?: 'company' | 'client';
			reportFormat?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'accounts'
				| 'clients'
				| 'collaborators'
				| 'contacts'
				| 'projects'
				| 'tasks'
				| 'country'
				| 'health'
				| 'website'
				| 'email'
				| 'phone'
				| 'fax'
				| 'industry'
				| 'ownercompany'
				| 'ownername'
				| 'taskscompletion'
				| 'customfield'
				| 'id'
				| 'namecaseinsensitive'
				| 'createdAt'
				| 'updatedAt';
			name?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			firstLetter?: string;
			createdAfterDate?: string;
			createdAfter?: string;
			budgetRanges?: string;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			currencyId?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchClientManagers?: boolean;
			returnLetters?: boolean;
			onlyUntaggedCompanies?: boolean;
			matchAllTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUntaggedCompanies?: boolean;
			includeTentativeProjects?: boolean;
			includeProfitability?: boolean;
			includePermissions?: boolean;
			includeCustomFields?: boolean;
			includeBudgetSummary?: boolean;
			includeBudgetDistribution?: boolean;
			getStats?: boolean;
			getEmoji?: boolean;
			fullProfile?: boolean;
			excludeOwnerCompany?: boolean;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectStatuses?: Array<string>;
			notLinkedWithClientPortalIds?: Array<number>;
			include?: Array<
				| 'tags'
				| 'countries'
				| 'industries'
				| 'clientmanagedby'
				| 'companyupdates'
				| 'jobRoles'
				| 'users'
				| 'companydomains'
				| 'currencies'
				| 'customfields'
				| 'customfieldCompanies'
				| 'clientPortals'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[industries]'?: Array<string>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			excludeTagIds?: Array<number>;
			excludeIds?: Array<number>;
			companyHealths?: Array<number>;
			clientManagedByUserIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_companies_json: {
		path?: Record<string, never>;
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_company_Request;
	};
	v3_delete_projects_api_v3_companies_domains_id_json: {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_patch_projects_api_v3_companies_domains_id_json: {
		path: { id: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_companydomain_Request;
	};
	v3_get_projects_api_v3_companies_time_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_companies_companyid_json: {
		path: { companyId: number };
		query?: { fireWebhook?: boolean };
		body?: never;
	};
	v3_get_projects_api_v3_companies_companyid_json: {
		path: { companyId: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			reportType?: 'company' | 'client';
			reportFormat?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'accounts'
				| 'clients'
				| 'collaborators'
				| 'contacts'
				| 'projects'
				| 'tasks'
				| 'country'
				| 'health'
				| 'website'
				| 'email'
				| 'phone'
				| 'fax'
				| 'industry'
				| 'ownercompany'
				| 'ownername'
				| 'taskscompletion'
				| 'customfield'
				| 'id'
				| 'namecaseinsensitive'
				| 'createdAt'
				| 'updatedAt';
			name?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			firstLetter?: string;
			createdAfterDate?: string;
			createdAfter?: string;
			budgetRanges?: string;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			currencyId?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchClientManagers?: boolean;
			returnLetters?: boolean;
			onlyUntaggedCompanies?: boolean;
			matchAllTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUntaggedCompanies?: boolean;
			includeTentativeProjects?: boolean;
			includeProfitability?: boolean;
			includePermissions?: boolean;
			includeCustomFields?: boolean;
			includeBudgetSummary?: boolean;
			includeBudgetDistribution?: boolean;
			getStats?: boolean;
			getEmoji?: boolean;
			fullProfile?: boolean;
			excludeOwnerCompany?: boolean;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectStatuses?: Array<string>;
			notLinkedWithClientPortalIds?: Array<number>;
			include?: Array<
				| 'tags'
				| 'countries'
				| 'industries'
				| 'clientmanagedby'
				| 'companyupdates'
				| 'jobRoles'
				| 'users'
				| 'companydomains'
				| 'currencies'
				| 'customfields'
				| 'customfieldCompanies'
				| 'clientPortals'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[industries]'?: Array<string>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			excludeTagIds?: Array<number>;
			excludeIds?: Array<number>;
			companyHealths?: Array<number>;
			clientManagedByUserIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_patch_projects_api_v3_companies_companyid_json: {
		path: { companyId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_company_Request;
	};
	v3_patch_projects_api_v3_companies_companyid_rates_json: {
		path: { companyId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_company_ClientRatesRequest;
	};
	v3_post_projects_api_v3_companies_id_convert_currency_json: {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_post_projects_api_v3_companies_id_domains_json: {
		path: { id: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_companydomain_BulkRequest;
	};
	v3_get_projects_api_v3_files_fileid_project_json: {
		path: { fileId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_links_linkid_comments_json: {
		path: { linkId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_post_projects_api_v3_links_linkid_comments_json: {
		path: { linkId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_comment_Request;
	};
	v3_get_projects_api_v3_links_linkid_project_json: {
		path: { linkId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_me_json: {
		path?: Record<string, never>;
		query?: {
			userId?: number;
			includeAuth?: boolean;
			include?: Array<'projects' | 'users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_me_personaltasks_json: {
		path?: Record<string, never>;
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_me_personaltasks_json: {
		path?: Record<string, never>;
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_CreateRequest;
	};
	v3_get_projects_api_v3_me_personaltasks_id_json: {
		path: { id: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_me_timers_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			userId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			runningTimersOnly?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'users'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_me_timers_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body: TeamworkV3Input_timer_Request;
	};
	v3_delete_projects_api_v3_me_timers_timerid_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_timer_DeleteRequest;
	};
	v3_put_projects_api_v3_me_timers_timerid_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_timer_Request;
	};
	v3_put_projects_api_v3_me_timers_timerid_complete_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_me_timers_timerid_pause_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_me_timers_timerid_resume_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_me_timers_timerid_undelete_json: {
		path: { timerId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_milestones_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'calendar' | 'agenda';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			projectStatus?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'date'
				| 'dateonly'
				| 'name'
				| 'project'
				| 'user'
				| 'dateCreated'
				| 'dateUpdated'
				| 'id'
				| 'completion'
				| 'originalDueDate'
				| 'dateCompleted'
				| 'completedBy'
				| 'status'
				| 'variance';
			dueBeforeDate?: string;
			dueBefore?: string;
			dueAfterDate?: string;
			dueAfter?: string;
			deletedAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showAttachedTasklists?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			progress?: boolean;
			onlyWithoutTasklists?: boolean;
			onlyStarredProjects?: boolean;
			onlyMyProjects?: boolean;
			onlyAdminProjects?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTags?: boolean;
			includeProgress?: boolean;
			includePercentageComplete?: boolean;
			includeCompleted?: boolean;
			includeCompanyUserIds?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			emoji?: boolean;
			countUnreadComments?: boolean;
			calendar?: boolean;
			tagIds?: Array<number>;
			status?: Array<
				| 'all'
				| 'new'
				| 'reopened'
				| 'completed'
				| 'deleted'
				| 'pending'
				| 'incomplete'
				| 'late'
				| 'today'
				| 'upcoming'
			>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<string>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<number>;
			projectHealth?: Array<number>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'users'
				| 'completedBy'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'tags'
				| 'tasklists'
				| 'tasklisttaskstats'
				| 'teams'
				| 'companies'
			>;
			ids?: Array<number>;
			followerIds?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			creatorIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_milestones_metrics_deadlines_json: {
		path?: Record<string, never>;
		query: { startDate: string; endDate: string };
		body?: never;
	};
	v3_get_projects_api_v3_milestones_milestoneid_json: {
		path: { milestoneId: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'calendar' | 'agenda';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			projectStatus?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'date'
				| 'dateonly'
				| 'name'
				| 'project'
				| 'user'
				| 'dateCreated'
				| 'dateUpdated'
				| 'id'
				| 'completion'
				| 'originalDueDate'
				| 'dateCompleted'
				| 'completedBy'
				| 'status'
				| 'variance';
			dueBeforeDate?: string;
			dueBefore?: string;
			dueAfterDate?: string;
			dueAfter?: string;
			deletedAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showAttachedTasklists?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			progress?: boolean;
			onlyWithoutTasklists?: boolean;
			onlyStarredProjects?: boolean;
			onlyMyProjects?: boolean;
			onlyAdminProjects?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTags?: boolean;
			includeProgress?: boolean;
			includePercentageComplete?: boolean;
			includeCompleted?: boolean;
			includeCompanyUserIds?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			emoji?: boolean;
			countUnreadComments?: boolean;
			calendar?: boolean;
			tagIds?: Array<number>;
			status?: Array<
				| 'all'
				| 'new'
				| 'reopened'
				| 'completed'
				| 'deleted'
				| 'pending'
				| 'incomplete'
				| 'late'
				| 'today'
				| 'upcoming'
			>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<string>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<number>;
			projectHealth?: Array<number>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'users'
				| 'completedBy'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'tags'
				| 'tasklists'
				| 'tasklisttaskstats'
				| 'teams'
				| 'companies'
			>;
			ids?: Array<number>;
			followerIds?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			creatorIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_milestones_milestoneid_project_json: {
		path: { milestoneId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_notebooks_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			projectStatuses?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'project'
				| 'dateCreated'
				| 'dateUpdated'
				| 'category'
				| 'id';
			createdAfterDate?: string;
			createdAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			secureOnly?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			lockedOnly?: boolean;
			includeContents?: boolean;
			includeArchivedProjects?: boolean;
			getEmoji?: boolean;
			tagIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'users'
				| 'users.teams'
				| 'notebookCategories'
				| 'companies'
				| 'teams'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[notebookCategories]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			creatorIds?: Array<number>;
			categoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_notebooks_notebookid_json: {
		path: { notebookId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_notebooks_notebookid_json: {
		path: { notebookId: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			showDeleted?: boolean;
			getEmoji?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'users'
				| 'users.teams'
				| 'notebookCategories'
				| 'companies'
				| 'teams'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[notebookCategories]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
		};
		body?: never;
	};
	v3_patch_projects_api_v3_notebooks_notebookid_json: {
		path: { notebookId: number };
		query?: {
			getEmoji?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'users'
				| 'users.teams'
				| 'notebookCategories'
				| 'companies'
				| 'teams'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[notebookCategories]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
		};
		body: TeamworkV3Input_notebook_Request;
	};
	v3_get_projects_api_v3_notebooks_notebookid_compare_json: {
		path: { notebookId: number };
		query?: {
			include?: Array<'users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_notebooks_notebookid_project_json: {
		path: { notebookId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_notebooks_notebookid_versions_json: {
		path: { notebookId: number };
		query?: { versionIds?: Array<number> };
		body?: never;
	};
	v3_get_projects_api_v3_notebooks_notebookid_versions_json: {
		path: { notebookId: number };
		query?: {
			include?: Array<'users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json: {
		path: { versionId: number; notebookId: number };
		query?: {
			include?: Array<'users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_people_json: {
		path?: Record<string, never>;
		query?: {
			userType?: 'account' | 'collaborator' | 'contact' | 'client';
			updatedAfter?: string;
			searchTerm?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'namecaseinsensitive'
				| 'company'
				| 'id'
				| 'providedids'
				| 'dateupdated';
			lastLoginAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			searchUserSkill?: boolean;
			searchUserJobRole?: boolean;
			orderPrioritiseCurrentUser?: boolean;
			onlySiteOwner?: boolean;
			onlyPlaceholders?: boolean;
			onlyOwnerCompany?: boolean;
			inclusiveFilter?: boolean;
			includeStandardUsers?: boolean;
			includeServiceAccounts?: boolean;
			includePlaceholders?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			filterByNoCostRate?: boolean;
			excludeContacts?: boolean;
			clientPortalEligible?: boolean;
			adminsOnly?: boolean;
			teamIds?: Array<number>;
			skillIds?: Array<number>;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			notLinkedWithClientPortalIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'workingHours'
				| 'currencies'
				| 'teams'
				| 'jobRoles'
				| 'skills'
				| 'linkedClientPortalCompanies'
				| 'skillCounts'
			>;
			ids?: Array<number>;
			'fields[userIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[people]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeProjectIds?: Array<number>;
			excludeIds?: Array<number>;
			excludeAllocatedUsersProjectIDs?: Array<number>;
			emails?: Array<string>;
			companyIds?: Array<number>;
			SkillLevels?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_people_metrics_performance_json: {
		path?: Record<string, never>;
		query: {
			startDate: string;
			orderMode?: 'asc' | 'desc';
			endDate: string;
		};
		body?: never;
	};
	v3_get_projects_api_v3_people_utilization_json: {
		path?: Record<string, never>;
		query: {
			zoom?:
				| 'week'
				| 'month'
				| 'last3months'
				| 'quarterbyweek'
				| 'quarterbymonth';
			startDate: string;
			sortOrder?: 'asc' | 'desc';
			sort?:
				| 'name'
				| 'percentutilization'
				| 'percentestimatedutilization'
				| 'availableminutes'
				| 'unavailableminutes'
				| 'loggedminutes'
				| 'billableminutes'
				| 'unbillableminutes'
				| 'billableutilization'
				| 'nonbillableutilization'
				| 'companycount'
				| 'utilizationachieved'
				| 'utilizationtarget'
				| 'allocatedutilization'
				| 'totalworkingminutes'
				| 'availableutilization'
				| 'unavailableutilization'
				| 'companyname'
				| 'allocatedminutes'
				| 'estimatedbillableminutes'
				| 'percentestimatedbillableutilization'
				| 'estimatedminutes';
			searchTerm?: string;
			reportFormat?: 'pdf' | 'html' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'percentutilization'
				| 'percentestimatedutilization'
				| 'availableminutes'
				| 'unavailableminutes'
				| 'loggedminutes'
				| 'billableminutes'
				| 'unbillableminutes'
				| 'companycount'
				| 'utilizationachieved'
				| 'utilizationTarget'
				| 'allocatedutilization'
				| 'totalworkingminutes'
				| 'availableutilization'
				| 'unavailableutilization'
				| 'billableUtilization'
				| 'nonBillableUtilization'
				| 'companyname'
				| 'allocatedMinutes'
				| 'estimatedbillableminutes'
				| 'percentEstimatedBillableUtilization'
				| 'estimatedMinutes';
			groupBy?: '' | 'day' | 'week' | 'month' | 'quarter';
			endDate: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			legacyResponse?: boolean;
			isReportDownload?: boolean;
			isCustomDateRange?: boolean;
			includeUtilizations?: boolean;
			includeTotals?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			includeCalendarEvents?: boolean;
			includeArchivedProjects?: boolean;
			IncludeCompletedTasks?: boolean;
			userTypes?: Array<'standard' | 'placeholder'>;
			userIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<'users' | 'jobroles' | 'teams'>;
			'fields[utilizations]'?: Array<
				| 'userId'
				| 'unavailableMinutes'
				| 'availableMinutes'
				| 'billableMinutes'
				| 'unbillableMinutes'
				| 'loggedMinutes'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_people_personid_json: {
		path: { personId: number };
		query?: { fireWebhook?: boolean };
		body?: never;
	};
	v3_get_projects_api_v3_people_personid_json: {
		path: { personId: number };
		query?: {
			userType?: 'account' | 'collaborator' | 'contact' | 'client';
			updatedAfter?: string;
			searchTerm?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'namecaseinsensitive'
				| 'company'
				| 'id'
				| 'providedids'
				| 'dateupdated';
			lastLoginAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			searchUserSkill?: boolean;
			searchUserJobRole?: boolean;
			orderPrioritiseCurrentUser?: boolean;
			onlySiteOwner?: boolean;
			onlyPlaceholders?: boolean;
			onlyOwnerCompany?: boolean;
			inclusiveFilter?: boolean;
			includeStandardUsers?: boolean;
			includeServiceAccounts?: boolean;
			includePlaceholders?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			filterByNoCostRate?: boolean;
			excludeContacts?: boolean;
			clientPortalEligible?: boolean;
			adminsOnly?: boolean;
			teamIds?: Array<number>;
			skillIds?: Array<number>;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			notLinkedWithClientPortalIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'workingHours'
				| 'currencies'
				| 'teams'
				| 'jobRoles'
				| 'skills'
				| 'linkedClientPortalCompanies'
				| 'skillCounts'
			>;
			ids?: Array<number>;
			'fields[userIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[people]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeProjectIds?: Array<number>;
			excludeIds?: Array<number>;
			excludeAllocatedUsersProjectIDs?: Array<number>;
			emails?: Array<string>;
			companyIds?: Array<number>;
			SkillLevels?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			timeMode?: 'timelogs' | 'estimated';
			searchTerm?: string;
			reportType?: 'project' | 'health';
			reportTimezone?: string;
			reportFormat?: 'csv' | 'html' | 'pdf' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'creatorname'
				| 'companyname'
				| 'datecreated'
				| 'startdate'
				| 'duedate'
				| 'lastactivity'
				| 'name'
				| 'namecaseinsensitive'
				| 'ownercompany'
				| 'ownername'
				| 'health'
				| 'taskcompletion'
				| 'budgetused'
				| 'starred'
				| 'starredcompanyname'
				| 'starredfirst'
				| 'mobilespecial'
				| 'lastworkedon'
				| 'categoryname'
				| 'customfield'
				| 'status'
				| 'id'
				| 'projectnumber';
			notCompletedBefore?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			userId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			minBudgetCapacityUsedPercent?: number;
			maxBudgetCapacityUsedPercent?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchCompanies?: boolean;
			searchByLetter?: boolean;
			searchBudgets?: boolean;
			onlyStarredProjects?: boolean;
			onlyProjectsWithExplicitMembership?: boolean;
			onlyProjectsWithAdminAccess?: boolean;
			onlyProjectsThatCanLogTime?: boolean;
			onlyProjectsThatCanAddTasks?: boolean;
			onlyArchivedProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeTabSystemStatus?: boolean;
			includeSubCategories?: boolean;
			includeStats?: boolean;
			includeProjectUserInfo?: boolean;
			includeProjectProfitability?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCounts?: boolean;
			includeCompletedStatus?: boolean;
			includeArchivedProjects?: boolean;
			hideObservedProjects?: boolean;
			alwaysIncludeFiltering?: boolean;
			usersWithExplicitMembershipIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				| 'active'
				| 'inactive'
				| 'archived'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectNumbers?: Array<string>;
			projectNumberCounters?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			filter?: Array<TeamworkJsonValue>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
			'fields[projectBudgets]'?: Array<
				| 'id'
				| 'projectId'
				| 'type'
				| 'status'
				| 'capacityUsed'
				| 'capacity'
				| 'originatorBudgetId'
				| 'isRepeating'
				| 'repeatPeriod'
				| 'repeatUnit'
				| 'repeatsRemaining'
				| 'sequenceNumber'
				| 'startDateTime'
				| 'endDateTime'
				| 'currencyCode'
				| 'timelogType'
				| 'expenseType'
				| 'defaultRate'
				| 'notificationIds'
				| 'createdByUserId'
				| 'dateCreated'
				| 'updatedUserId'
				| 'dateUpdated'
				| 'completedByUserId'
				| 'dateCompleted'
				| 'deletedByUserId'
				| 'dateDeleted'
			>;
			'fields[portfolioColumns]'?: Array<'id' | 'name' | 'color'>;
			'fields[portfolioCards]'?: Array<'id' | 'columnId' | 'projectId'>;
			'fields[portfolioBoards]'?: Array<'id' | 'name' | 'color'>;
			'fields[industries]'?: Array<string>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldProjects]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			featuresEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
				| 'tasks'
			>;
			excludeTagIds?: Array<number>;
			excludeProjectIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_active_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_billable_json: {
		path?: Record<string, never>;
		query: {
			startDate: string;
			orderMode?: 'asc' | 'desc';
			endDate: string;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_healths_json: {
		path?: Record<string, never>;
		query?: {
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_invoices_json: {
		path?: Record<string, never>;
		query?: {
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeArchivedProjects?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_owners_json: {
		path?: Record<string, never>;
		query?: {
			orderMode?: 'asc' | 'desc';
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_metrics_unbilled_json: {
		path?: Record<string, never>;
		query?: {
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeArchivedProjects?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_number_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_projects_number_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body: TeamworkV3Input_project_ProjectNumberSettingsRequest;
	};
	v3_put_projects_api_v3_projects_people_userid_enqueue_json: {
		path: { userId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_projects_starred_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			timeMode?: 'timelogs' | 'estimated';
			searchTerm?: string;
			reportType?: 'project' | 'health';
			reportTimezone?: string;
			reportFormat?: 'csv' | 'html' | 'pdf' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'creatorname'
				| 'companyname'
				| 'datecreated'
				| 'startdate'
				| 'duedate'
				| 'lastactivity'
				| 'name'
				| 'namecaseinsensitive'
				| 'ownercompany'
				| 'ownername'
				| 'health'
				| 'taskcompletion'
				| 'budgetused'
				| 'starred'
				| 'starredcompanyname'
				| 'starredfirst'
				| 'mobilespecial'
				| 'lastworkedon'
				| 'categoryname'
				| 'customfield'
				| 'status'
				| 'id'
				| 'projectnumber';
			notCompletedBefore?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			userId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			minBudgetCapacityUsedPercent?: number;
			maxBudgetCapacityUsedPercent?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchCompanies?: boolean;
			searchByLetter?: boolean;
			searchBudgets?: boolean;
			onlyStarredProjects?: boolean;
			onlyProjectsWithExplicitMembership?: boolean;
			onlyProjectsWithAdminAccess?: boolean;
			onlyProjectsThatCanLogTime?: boolean;
			onlyProjectsThatCanAddTasks?: boolean;
			onlyArchivedProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeTabSystemStatus?: boolean;
			includeSubCategories?: boolean;
			includeStats?: boolean;
			includeProjectUserInfo?: boolean;
			includeProjectProfitability?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCounts?: boolean;
			includeCompletedStatus?: boolean;
			includeArchivedProjects?: boolean;
			hideObservedProjects?: boolean;
			alwaysIncludeFiltering?: boolean;
			usersWithExplicitMembershipIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				| 'active'
				| 'inactive'
				| 'archived'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectNumbers?: Array<string>;
			projectNumberCounters?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			filter?: Array<TeamworkJsonValue>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
			'fields[projectBudgets]'?: Array<
				| 'id'
				| 'projectId'
				| 'type'
				| 'status'
				| 'capacityUsed'
				| 'capacity'
				| 'originatorBudgetId'
				| 'isRepeating'
				| 'repeatPeriod'
				| 'repeatUnit'
				| 'repeatsRemaining'
				| 'sequenceNumber'
				| 'startDateTime'
				| 'endDateTime'
				| 'currencyCode'
				| 'timelogType'
				| 'expenseType'
				| 'defaultRate'
				| 'notificationIds'
				| 'createdByUserId'
				| 'dateCreated'
				| 'updatedUserId'
				| 'dateUpdated'
				| 'completedByUserId'
				| 'dateCompleted'
				| 'deletedByUserId'
				| 'dateDeleted'
			>;
			'fields[portfolioColumns]'?: Array<'id' | 'name' | 'color'>;
			'fields[portfolioCards]'?: Array<'id' | 'columnId' | 'projectId'>;
			'fields[portfolioBoards]'?: Array<'id' | 'name' | 'color'>;
			'fields[industries]'?: Array<string>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldProjects]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			featuresEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
				| 'tasks'
			>;
			excludeTagIds?: Array<number>;
			excludeProjectIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_teamwork_samples_json: {
		path?: Record<string, never>;
		query?: {
			searchTerm?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			ids?: Array<number>;
			'fields[sampleprojects]'?: Array<
				| 'id'
				| 'name'
				| 'code'
				| 'description'
				| 'icon'
				| 'imagePreview'
				| 'categoryId'
				| 'category'
				| 'content'
			>;
			categoryIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_templates_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			timeMode?: 'timelogs' | 'estimated';
			searchTerm?: string;
			reportType?: 'project' | 'health';
			reportTimezone?: string;
			reportFormat?: 'csv' | 'html' | 'pdf' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'creatorname'
				| 'companyname'
				| 'datecreated'
				| 'startdate'
				| 'duedate'
				| 'lastactivity'
				| 'name'
				| 'namecaseinsensitive'
				| 'ownercompany'
				| 'ownername'
				| 'health'
				| 'taskcompletion'
				| 'budgetused'
				| 'starred'
				| 'starredcompanyname'
				| 'starredfirst'
				| 'mobilespecial'
				| 'lastworkedon'
				| 'categoryname'
				| 'customfield'
				| 'status'
				| 'id'
				| 'projectnumber';
			notCompletedBefore?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			userId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			minBudgetCapacityUsedPercent?: number;
			maxBudgetCapacityUsedPercent?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchCompanies?: boolean;
			searchByLetter?: boolean;
			searchBudgets?: boolean;
			onlyStarredProjects?: boolean;
			onlyProjectsWithExplicitMembership?: boolean;
			onlyProjectsWithAdminAccess?: boolean;
			onlyProjectsThatCanLogTime?: boolean;
			onlyProjectsThatCanAddTasks?: boolean;
			onlyArchivedProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeTabSystemStatus?: boolean;
			includeSubCategories?: boolean;
			includeStats?: boolean;
			includeProjectUserInfo?: boolean;
			includeProjectProfitability?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCounts?: boolean;
			includeCompletedStatus?: boolean;
			includeArchivedProjects?: boolean;
			hideObservedProjects?: boolean;
			alwaysIncludeFiltering?: boolean;
			usersWithExplicitMembershipIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				| 'active'
				| 'inactive'
				| 'archived'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectNumbers?: Array<string>;
			projectNumberCounters?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			filter?: Array<TeamworkJsonValue>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
			'fields[projectBudgets]'?: Array<
				| 'id'
				| 'projectId'
				| 'type'
				| 'status'
				| 'capacityUsed'
				| 'capacity'
				| 'originatorBudgetId'
				| 'isRepeating'
				| 'repeatPeriod'
				| 'repeatUnit'
				| 'repeatsRemaining'
				| 'sequenceNumber'
				| 'startDateTime'
				| 'endDateTime'
				| 'currencyCode'
				| 'timelogType'
				| 'expenseType'
				| 'defaultRate'
				| 'notificationIds'
				| 'createdByUserId'
				| 'dateCreated'
				| 'updatedUserId'
				| 'dateUpdated'
				| 'completedByUserId'
				| 'dateCompleted'
				| 'deletedByUserId'
				| 'dateDeleted'
			>;
			'fields[portfolioColumns]'?: Array<'id' | 'name' | 'color'>;
			'fields[portfolioCards]'?: Array<'id' | 'columnId' | 'projectId'>;
			'fields[portfolioBoards]'?: Array<'id' | 'name' | 'color'>;
			'fields[industries]'?: Array<string>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldProjects]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			featuresEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
				| 'tasks'
			>;
			excludeTagIds?: Array<number>;
			excludeProjectIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_templates_id_json: {
		path: { id: number };
		query?: {
			updatedAfter?: string;
			timeMode?: 'timelogs' | 'estimated';
			searchTerm?: string;
			reportType?: 'project' | 'health';
			reportTimezone?: string;
			reportFormat?: 'csv' | 'html' | 'pdf' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'creatorname'
				| 'companyname'
				| 'datecreated'
				| 'startdate'
				| 'duedate'
				| 'lastactivity'
				| 'name'
				| 'namecaseinsensitive'
				| 'ownercompany'
				| 'ownername'
				| 'health'
				| 'taskcompletion'
				| 'budgetused'
				| 'starred'
				| 'starredcompanyname'
				| 'starredfirst'
				| 'mobilespecial'
				| 'lastworkedon'
				| 'categoryname'
				| 'customfield'
				| 'status'
				| 'id'
				| 'projectnumber';
			notCompletedBefore?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			userId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			minBudgetCapacityUsedPercent?: number;
			maxBudgetCapacityUsedPercent?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchCompanies?: boolean;
			searchByLetter?: boolean;
			searchBudgets?: boolean;
			onlyStarredProjects?: boolean;
			onlyProjectsWithExplicitMembership?: boolean;
			onlyProjectsWithAdminAccess?: boolean;
			onlyProjectsThatCanLogTime?: boolean;
			onlyProjectsThatCanAddTasks?: boolean;
			onlyArchivedProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeTabSystemStatus?: boolean;
			includeSubCategories?: boolean;
			includeStats?: boolean;
			includeProjectUserInfo?: boolean;
			includeProjectProfitability?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCounts?: boolean;
			includeCompletedStatus?: boolean;
			includeArchivedProjects?: boolean;
			hideObservedProjects?: boolean;
			alwaysIncludeFiltering?: boolean;
			usersWithExplicitMembershipIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				| 'active'
				| 'inactive'
				| 'archived'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectNumbers?: Array<string>;
			projectNumberCounters?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			filter?: Array<TeamworkJsonValue>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
			'fields[projectBudgets]'?: Array<
				| 'id'
				| 'projectId'
				| 'type'
				| 'status'
				| 'capacityUsed'
				| 'capacity'
				| 'originatorBudgetId'
				| 'isRepeating'
				| 'repeatPeriod'
				| 'repeatUnit'
				| 'repeatsRemaining'
				| 'sequenceNumber'
				| 'startDateTime'
				| 'endDateTime'
				| 'currencyCode'
				| 'timelogType'
				| 'expenseType'
				| 'defaultRate'
				| 'notificationIds'
				| 'createdByUserId'
				| 'dateCreated'
				| 'updatedUserId'
				| 'dateUpdated'
				| 'completedByUserId'
				| 'dateCompleted'
				| 'deletedByUserId'
				| 'dateDeleted'
			>;
			'fields[portfolioColumns]'?: Array<'id' | 'name' | 'color'>;
			'fields[portfolioCards]'?: Array<'id' | 'columnId' | 'projectId'>;
			'fields[portfolioBoards]'?: Array<'id' | 'name' | 'color'>;
			'fields[industries]'?: Array<string>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldProjects]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			featuresEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
				| 'tasks'
			>;
			excludeTagIds?: Array<number>;
			excludeProjectIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_templates_id_customfields_required_json: {
		path: { id: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_projects_tentative_projectid_convert_json: {
		path: { projectId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_projects_updates_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			projectStatus?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?: 'date' | 'color' | 'health' | 'project' | 'user' | 'id';
			createdAfter?: string;
			projectId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			reactions?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeArchivedProjects?: boolean;
			emoji?: boolean;
			activeOnly?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<string>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<number>;
			projectHealth?: Array<number>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<'projects' | 'createdBy' | 'deletedBy' | 'likes.users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectids_updates_json: {
		path: { projectIds: number };
		query?: {
			updatedAfter?: string;
			projectStatus?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?: 'date' | 'color' | 'health' | 'project' | 'user' | 'id';
			createdAfter?: string;
			projectId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			reactions?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			includeArchivedProjects?: boolean;
			emoji?: boolean;
			activeOnly?: boolean;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<string>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<number>;
			projectHealth?: Array<number>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<'projects' | 'createdBy' | 'deletedBy' | 'likes.users'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectid_json: {
		path: { projectId: number };
		query?: {
			updatedAfter?: string;
			timeMode?: 'timelogs' | 'estimated';
			searchTerm?: string;
			reportType?: 'project' | 'health';
			reportTimezone?: string;
			reportFormat?: 'csv' | 'html' | 'pdf' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'creatorname'
				| 'companyname'
				| 'datecreated'
				| 'startdate'
				| 'duedate'
				| 'lastactivity'
				| 'name'
				| 'namecaseinsensitive'
				| 'ownercompany'
				| 'ownername'
				| 'health'
				| 'taskcompletion'
				| 'budgetused'
				| 'starred'
				| 'starredcompanyname'
				| 'starredfirst'
				| 'mobilespecial'
				| 'lastworkedon'
				| 'categoryname'
				| 'customfield'
				| 'status'
				| 'id'
				| 'projectnumber';
			notCompletedBefore?: string;
			minLastActivityDate?: string;
			maxLastActivityDate?: string;
			userId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			minBudgetCapacityUsedPercent?: number;
			maxBudgetCapacityUsedPercent?: number;
			useFormulaFields?: boolean;
			skipCounts?: boolean;
			searchCompanies?: boolean;
			searchByLetter?: boolean;
			searchBudgets?: boolean;
			onlyStarredProjects?: boolean;
			onlyProjectsWithExplicitMembership?: boolean;
			onlyProjectsWithAdminAccess?: boolean;
			onlyProjectsThatCanLogTime?: boolean;
			onlyProjectsThatCanAddTasks?: boolean;
			onlyArchivedProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeTabSystemStatus?: boolean;
			includeSubCategories?: boolean;
			includeStats?: boolean;
			includeProjectUserInfo?: boolean;
			includeProjectProfitability?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCounts?: boolean;
			includeCompletedStatus?: boolean;
			includeArchivedProjects?: boolean;
			hideObservedProjects?: boolean;
			alwaysIncludeFiltering?: boolean;
			usersWithExplicitMembershipIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				| 'active'
				| 'inactive'
				| 'archived'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectNumbers?: Array<string>;
			projectNumberCounters?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			filter?: Array<TeamworkJsonValue>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectUpdates]'?: Array<
				| 'id'
				| 'projectId'
				| 'text'
				| 'isActive'
				| 'health'
				| 'color'
				| 'dateCreated'
				| 'deleted'
				| 'deletedDate'
				| 'numLikes'
				| 'reactions'
			>;
			'fields[projectBudgets]'?: Array<
				| 'id'
				| 'projectId'
				| 'type'
				| 'status'
				| 'capacityUsed'
				| 'capacity'
				| 'originatorBudgetId'
				| 'isRepeating'
				| 'repeatPeriod'
				| 'repeatUnit'
				| 'repeatsRemaining'
				| 'sequenceNumber'
				| 'startDateTime'
				| 'endDateTime'
				| 'currencyCode'
				| 'timelogType'
				| 'expenseType'
				| 'defaultRate'
				| 'notificationIds'
				| 'createdByUserId'
				| 'dateCreated'
				| 'updatedUserId'
				| 'dateUpdated'
				| 'completedByUserId'
				| 'dateCompleted'
				| 'deletedByUserId'
				| 'dateDeleted'
			>;
			'fields[portfolioColumns]'?: Array<'id' | 'name' | 'color'>;
			'fields[portfolioCards]'?: Array<'id' | 'columnId' | 'projectId'>;
			'fields[portfolioBoards]'?: Array<'id' | 'name' | 'color'>;
			'fields[industries]'?: Array<string>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldProjects]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[countries]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			featuresEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
				| 'tasks'
			>;
			excludeTagIds?: Array<number>;
			excludeProjectIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectid_featureorder_json: {
		path: { projectId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_put_projects_api_v3_projects_projectid_featureorder_json: {
		path: { projectId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_project_FeatureOrderRequest;
	};
	v3_get_projects_api_v3_projects_projectid_milestones_json: {
		path: { projectId: number };
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'calendar' | 'agenda';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			projectStatus?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'date'
				| 'dateonly'
				| 'name'
				| 'project'
				| 'user'
				| 'dateCreated'
				| 'dateUpdated'
				| 'id'
				| 'completion'
				| 'originalDueDate'
				| 'dateCompleted'
				| 'completedBy'
				| 'status'
				| 'variance';
			dueBeforeDate?: string;
			dueBefore?: string;
			dueAfterDate?: string;
			dueAfter?: string;
			deletedAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showAttachedTasklists?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			progress?: boolean;
			onlyWithoutTasklists?: boolean;
			onlyStarredProjects?: boolean;
			onlyMyProjects?: boolean;
			onlyAdminProjects?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTags?: boolean;
			includeProgress?: boolean;
			includePercentageComplete?: boolean;
			includeCompleted?: boolean;
			includeCompanyUserIds?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			emoji?: boolean;
			countUnreadComments?: boolean;
			calendar?: boolean;
			tagIds?: Array<number>;
			status?: Array<
				| 'all'
				| 'new'
				| 'reopened'
				| 'completed'
				| 'deleted'
				| 'pending'
				| 'incomplete'
				| 'late'
				| 'today'
				| 'upcoming'
			>;
			selectedColumns?: Array<string>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<string>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<number>;
			projectHealth?: Array<number>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'users'
				| 'completedBy'
				| 'createdBy'
				| 'deletedBy'
				| 'updatedBy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'tags'
				| 'tasklists'
				| 'tasklisttaskstats'
				| 'teams'
				| 'companies'
			>;
			ids?: Array<number>;
			followerIds?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			creatorIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_projects_projectid_notebooks_json: {
		path: { projectId: number };
		query?: {
			getEmoji?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'users'
				| 'users.teams'
				| 'notebookCategories'
				| 'companies'
				| 'teams'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[notebooks]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'contents'
				| 'type'
				| 'isPrivate'
				| 'locked'
				| 'lockdownId'
				| 'secureContent'
				| 'projectId'
				| 'createdByUserID'
				| 'updatedByUserID'
				| 'deletedByUserID'
				| 'dateUpdated'
				| 'dateCreated'
				| 'dateDeleted'
				| 'deleted'
				| 'categoryId'
				| 'notebookVersionID'
				| 'notebookVersionCreatedDateTime'
				| 'notebookVersionUpdatedDateTime'
				| 'latestVersionNo'
				| 'commentsCount'
				| 'readCommentsCount'
				| 'contentHTML'
				| 'privacy'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'tagIds'
				| 'updatedAt'
				| 'project'
			>;
			'fields[notebookCategories]'?: Array<string>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
		};
		body: TeamworkV3Input_notebook_Request;
	};
	v3_get_projects_api_v3_projects_projectid_people_json: {
		path: { projectId: number };
		query?: {
			userType?: 'account' | 'collaborator' | 'contact' | 'client';
			updatedAfter?: string;
			searchTerm?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'namecaseinsensitive'
				| 'company'
				| 'id'
				| 'providedids'
				| 'dateupdated';
			lastLoginAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			searchUserSkill?: boolean;
			searchUserJobRole?: boolean;
			orderPrioritiseCurrentUser?: boolean;
			onlySiteOwner?: boolean;
			onlyPlaceholders?: boolean;
			onlyOwnerCompany?: boolean;
			inclusiveFilter?: boolean;
			includeStandardUsers?: boolean;
			includeServiceAccounts?: boolean;
			includePlaceholders?: boolean;
			includeObservers?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			filterByNoCostRate?: boolean;
			excludeContacts?: boolean;
			clientPortalEligible?: boolean;
			adminsOnly?: boolean;
			teamIds?: Array<number>;
			skillIds?: Array<number>;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			notLinkedWithClientPortalIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'workingHours'
				| 'currencies'
				| 'teams'
				| 'jobRoles'
				| 'skills'
				| 'linkedClientPortalCompanies'
				| 'projects.permissions'
				| 'permissions'
				| 'users.integrations'
				| 'skillCounts'
			>;
			ids?: Array<number>;
			'fields[userIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[people]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeProjectIds?: Array<number>;
			excludeIds?: Array<number>;
			excludeAllocatedUsersProjectIDs?: Array<number>;
			emails?: Array<string>;
			companyIds?: Array<number>;
			SkillLevels?: Array<string>;
		};
		body?: never;
	};
	v3_put_projects_api_v3_projects_projectid_people_json: {
		path: { projectId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_people_UsersPayload;
	};
	v3_get_projects_api_v3_projects_projectid_people_personid_json: {
		path: { projectId: number; personId: number };
		query?: {
			userType?: 'account' | 'collaborator' | 'contact' | 'client';
			updatedAfter?: string;
			searchTerm?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'name'
				| 'namecaseinsensitive'
				| 'company'
				| 'id'
				| 'providedids'
				| 'dateupdated';
			lastLoginAfter?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			searchUserSkill?: boolean;
			searchUserJobRole?: boolean;
			orderPrioritiseCurrentUser?: boolean;
			onlySiteOwner?: boolean;
			onlyPlaceholders?: boolean;
			onlyOwnerCompany?: boolean;
			inclusiveFilter?: boolean;
			includeStandardUsers?: boolean;
			includeServiceAccounts?: boolean;
			includePlaceholders?: boolean;
			includeObservers?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			filterByNoCostRate?: boolean;
			excludeContacts?: boolean;
			clientPortalEligible?: boolean;
			adminsOnly?: boolean;
			teamIds?: Array<number>;
			skillIds?: Array<number>;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			notLinkedWithClientPortalIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'workingHours'
				| 'currencies'
				| 'teams'
				| 'jobRoles'
				| 'skills'
				| 'linkedClientPortalCompanies'
				| 'projects.permissions'
				| 'permissions'
				| 'users.integrations'
				| 'skillCounts'
			>;
			ids?: Array<number>;
			'fields[userIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[people]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeProjectIds?: Array<number>;
			excludeIds?: Array<number>;
			excludeAllocatedUsersProjectIDs?: Array<number>;
			emails?: Array<string>;
			companyIds?: Array<number>;
			SkillLevels?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectid_tasklists_json: {
		path: { projectId: number };
		query?: {
			updatedAfter?: string;
			searchTerm?: string;
			projectType?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'displayorder'
				| 'name'
				| 'status'
				| 'createdat'
				| 'updatedat'
				| 'project'
				| 'id';
			projectBudgetId?: number;
			pageSize?: number;
			page?: number;
			useFormulaFields?: boolean;
			sortDefaultListFirst?: boolean;
			sortActiveListsFirst?: boolean;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showCompleted?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			getEmptyLists?: boolean;
			completedOnly?: boolean;
			calculateDates?: boolean;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			include?: Array<
				| 'defaultTasks'
				| 'defaultTasks.users'
				| 'defaultTasks.teams'
				| 'defaultTasks.reminders'
				| 'defaultTasks.customfields'
				| 'defaultTasks.companies'
				| 'defaultTasks.jobRoles'
				| 'defaultTasks.tags'
				| 'defaultTasks.changeFollowers'
				| 'defaultTasks.commentFollowers'
				| 'defaultTasks.completeFollowers'
				| 'defaultTasks.lockdowns'
				| 'defaultTasks.lockdowns.users'
				| 'defaultTasks.lockdowns.companies'
				| 'defaultTasks.lockdowns.teams'
				| 'createdBy'
				| 'updatedBy'
				| 'companies'
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'milestones'
				| 'defaultCustomfields'
				| 'defaultCustomfieldTasks'
				| 'defaultColumns'
				| 'defaultWorkflowStages'
				| 'defaultWorkflows'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'tasklisttaskstats'
				| 'tasklistBudgets'
				| 'tasklistBudgets.notifications'
				| 'tasklistBudgets.notifications.users'
				| 'tasklistBudgets.notifications.teams'
				| 'tasklistBudgets.notifications.companies'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectid_tasks_json: {
		path: { projectId: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_projects_projectid_time_json: {
		path: { projectId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_projects_projectid_time_json: {
		path: { projectId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_timelog_Request;
	};
	v3_get_projects_api_v3_projects_projectid_time_total_json: {
		path: { projectId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			userId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			deskTicketId?: number;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			subTaskStatuses?: Array<
				'all' | 'completed' | 'incomplete' | 'new' | 'reopened' | 'deleted'
			>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			companyIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_reporting_dashboards_data_milestones_json: {
		path?: Record<string, never>;
		query?: {
			startDate?: string;
			splitBy?: string;
			searchTerm?: string;
			orderMode?: string;
			orderBy?: string;
			metric?: string;
			groupBy?: string;
			endDate?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			projectIds?: Array<number>;
			include?: Array<string>;
			filter?: Array<TeamworkJsonValue>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_reporting_dashboards_details_milestones_json: {
		path?: Record<string, never>;
		query?: {
			startDate?: string;
			searchTerm?: string;
			orderMode?: string;
			orderBy?: string;
			endDate?: string;
			pageSize?: number;
			page?: number;
			projectIds?: Array<number>;
			include?: Array<string>;
			filter?: Array<TeamworkJsonValue>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_reporting_precanned_companytime_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_reporting_precanned_tasktime_json: {
		path?: Record<string, never>;
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json: {
		path?: Record<string, never>;
		query: {
			userType?: 'account' | 'collaborator' | 'contact' | 'client';
			updatedAfter?: string;
			startDate: string;
			searchTerm?: string;
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'name'
				| 'namecaseinsensitive'
				| 'overduetasks'
				| 'assignedtasks'
				| 'completedtasks'
				| 'projects'
				| 'activeprojects';
			lastLoginAfter?: string;
			endDate: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			searchUserSkill?: boolean;
			searchUserJobRole?: boolean;
			orderPrioritiseCurrentUser?: boolean;
			onlySiteOwner?: boolean;
			onlyPlaceholders?: boolean;
			onlyOwnerCompany?: boolean;
			isReportDownload?: boolean;
			inclusiveFilter?: boolean;
			includeServiceAccounts?: boolean;
			includePlaceholders?: boolean;
			includeCollaborators?: boolean;
			includeClients?: boolean;
			includeArchivedProjects?: boolean;
			filterByNoCostRate?: boolean;
			excludeContacts?: boolean;
			clientPortalEligible?: boolean;
			adminsOnly?: boolean;
			userProjectIds?: Array<number>;
			teamIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			notLinkedWithClientPortalIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<'users'>;
			ids?: Array<number>;
			'fields[userIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[person]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[people]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeProjectIds?: Array<number>;
			excludeIds?: Array<number>;
			excludeAllocatedUsersProjectIDs?: Array<number>;
			emails?: Array<string>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_statuses_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			searchTerm?: string;
			teamId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showEveryone?: boolean;
			showDeleted?: boolean;
			includeSubteams?: boolean;
			include?: Array<'statuses' | 'users' | 'userevents'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[statuses]'?: Array<
				| 'id'
				| 'userId'
				| 'emoji'
				| 'text'
				| 'dateTime'
				| 'ipAddress'
				| 'dateLastUpdated'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_statuses_timeline_json: {
		path?: Record<string, never>;
		query?: {
			searchTerm?: string;
			teamId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			includeSubteams?: boolean;
			include?: Array<'users' | 'userevents'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[statuses]'?: Array<
				| 'id'
				| 'userId'
				| 'emoji'
				| 'text'
				| 'dateTime'
				| 'ipAddress'
				| 'dateLastUpdated'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		path: { taskgroupId: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json: {
		path: { taskgroupId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_CreateRequest;
	};
	v3_get_projects_api_v3_tasklists_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			searchTerm?: string;
			projectType?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'displayorder'
				| 'name'
				| 'status'
				| 'createdat'
				| 'updatedat'
				| 'project'
				| 'id';
			projectBudgetId?: number;
			pageSize?: number;
			page?: number;
			useFormulaFields?: boolean;
			sortDefaultListFirst?: boolean;
			sortActiveListsFirst?: boolean;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showCompleted?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			getEmptyLists?: boolean;
			completedOnly?: boolean;
			calculateDates?: boolean;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			include?: Array<
				| 'defaultTasks'
				| 'defaultTasks.users'
				| 'defaultTasks.teams'
				| 'defaultTasks.reminders'
				| 'defaultTasks.customfields'
				| 'defaultTasks.companies'
				| 'defaultTasks.jobRoles'
				| 'defaultTasks.tags'
				| 'defaultTasks.changeFollowers'
				| 'defaultTasks.commentFollowers'
				| 'defaultTasks.completeFollowers'
				| 'defaultTasks.lockdowns'
				| 'defaultTasks.lockdowns.users'
				| 'defaultTasks.lockdowns.companies'
				| 'defaultTasks.lockdowns.teams'
				| 'createdBy'
				| 'updatedBy'
				| 'companies'
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'milestones'
				| 'defaultCustomfields'
				| 'defaultCustomfieldTasks'
				| 'defaultColumns'
				| 'defaultWorkflowStages'
				| 'defaultWorkflows'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'tasklisttaskstats'
				| 'tasklistBudgets'
				| 'tasklistBudgets.notifications'
				| 'tasklistBudgets.notifications.users'
				| 'tasklistBudgets.notifications.teams'
				| 'tasklistBudgets.notifications.companies'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_tasklists_templates_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			searchTerm?: string;
			projectType?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'displayorder'
				| 'name'
				| 'status'
				| 'createdat'
				| 'updatedat'
				| 'project'
				| 'id';
			projectBudgetId?: number;
			pageSize?: number;
			page?: number;
			useFormulaFields?: boolean;
			sortDefaultListFirst?: boolean;
			sortActiveListsFirst?: boolean;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showCompleted?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			getEmptyLists?: boolean;
			completedOnly?: boolean;
			calculateDates?: boolean;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			include?: Array<
				| 'defaultTasks'
				| 'defaultTasks.users'
				| 'defaultTasks.teams'
				| 'defaultTasks.reminders'
				| 'defaultTasks.customfields'
				| 'defaultTasks.companies'
				| 'defaultTasks.jobRoles'
				| 'defaultTasks.tags'
				| 'defaultTasks.changeFollowers'
				| 'defaultTasks.commentFollowers'
				| 'defaultTasks.completeFollowers'
				| 'defaultTasks.lockdowns'
				| 'defaultTasks.lockdowns.users'
				| 'defaultTasks.lockdowns.companies'
				| 'defaultTasks.lockdowns.teams'
				| 'createdBy'
				| 'updatedBy'
				| 'companies'
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'milestones'
				| 'defaultCustomfields'
				| 'defaultCustomfieldTasks'
				| 'defaultColumns'
				| 'defaultWorkflowStages'
				| 'defaultWorkflows'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'tasklisttaskstats'
				| 'tasklistBudgets'
				| 'tasklistBudgets.notifications'
				| 'tasklistBudgets.notifications.users'
				| 'tasklistBudgets.notifications.teams'
				| 'tasklistBudgets.notifications.companies'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeIds?: Array<number>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_tasklists_tasklistid_json: {
		path: { tasklistId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_tasklists_tasklistid_json: {
		path: { tasklistId: number };
		query?: {
			updatedAfter?: string;
			searchTerm?: string;
			projectType?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'displayorder'
				| 'name'
				| 'status'
				| 'createdat'
				| 'updatedat'
				| 'project'
				| 'id';
			projectBudgetId?: number;
			pageSize?: number;
			page?: number;
			useFormulaFields?: boolean;
			sortDefaultListFirst?: boolean;
			sortActiveListsFirst?: boolean;
			skipCounts?: boolean;
			showPrivate?: boolean;
			showDeleted?: boolean;
			showCompleted?: boolean;
			isReportDownload?: boolean;
			includeTentativeProjects?: boolean;
			includeArchivedProjects?: boolean;
			getEmptyLists?: boolean;
			completedOnly?: boolean;
			calculateDates?: boolean;
			projectIds?: Array<number>;
			projectCompanyIds?: Array<number>;
			include?: Array<
				| 'defaultTasks'
				| 'defaultTasks.users'
				| 'defaultTasks.teams'
				| 'defaultTasks.reminders'
				| 'defaultTasks.customfields'
				| 'defaultTasks.companies'
				| 'defaultTasks.jobRoles'
				| 'defaultTasks.tags'
				| 'defaultTasks.changeFollowers'
				| 'defaultTasks.commentFollowers'
				| 'defaultTasks.completeFollowers'
				| 'defaultTasks.lockdowns'
				| 'defaultTasks.lockdowns.users'
				| 'defaultTasks.lockdowns.companies'
				| 'defaultTasks.lockdowns.teams'
				| 'createdBy'
				| 'updatedBy'
				| 'companies'
				| 'projects'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'milestones'
				| 'defaultCustomfields'
				| 'defaultCustomfieldTasks'
				| 'defaultColumns'
				| 'defaultWorkflowStages'
				| 'defaultWorkflows'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'tasklisttaskstats'
				| 'tasklistBudgets'
				| 'tasklistBudgets.notifications'
				| 'tasklistBudgets.notifications.users'
				| 'tasklistBudgets.notifications.teams'
				| 'tasklistBudgets.notifications.companies'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_tasklists_tasklistid_project_json: {
		path: { tasklistId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_tasklists_tasklistid_tasks_json: {
		path: { tasklistId: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_tasklists_tasklistid_tasks_json: {
		path: { tasklistId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_CreateRequest;
	};
	v3_get_projects_api_v3_tasklists_tasklistid_time_total_json: {
		path: { tasklistId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			userId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			deskTicketId?: number;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			subTaskStatuses?: Array<
				'all' | 'completed' | 'incomplete' | 'new' | 'reopened' | 'deleted'
			>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			companyIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_tasks_json: {
		path?: Record<string, never>;
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_tasks_metrics_complete_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_tasks_metrics_late_json: {
		path?: Record<string, never>;
		query?: Record<string, never>;
		body?: never;
	};
	v3_get_projects_api_v3_tasks_id_reminders_json: {
		path: { id: number };
		query?: {
			include?: Array<'users' | 'createdBy'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
		};
		body?: never;
	};
	v3_delete_projects_api_v3_tasks_taskid_json: {
		path: { taskId: number };
		query?: { fireWebhook?: boolean };
		body?: never;
	};
	v3_get_projects_api_v3_tasks_taskid_json: {
		path: { taskId: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_patch_projects_api_v3_tasks_taskid_json: {
		path: { taskId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_Request;
	};
	v3_put_projects_api_v3_tasks_taskid_json: {
		path: { taskId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_Request;
	};
	v3_get_projects_api_v3_tasks_taskid_project_json: {
		path: { taskId: number };
		query?: {
			includeProjectUserInfo?: boolean;
			includeProjectDates?: boolean;
			includeCustomFields?: boolean;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projectOwners'
				| 'projectUpdates'
				| 'companies'
				| 'companies.countries'
				| 'companies.industries'
				| 'companies.currencies'
				| 'projectCategories'
				| 'portfolioCards'
				| 'portfolioBoards'
				| 'portfolioColumns'
				| 'tags'
				| 'customfields'
				| 'customfieldProjects'
				| 'projectBudgets'
				| 'activities.latest'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'completedBy'
				| 'deletedBy'
				| 'archivedBy'
				| 'projectEmailDropboxes'
				| 'workflows'
				| 'workflows.stages'
				| 'projecttaskstats'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_tasks_taskid_reminders_json: {
		path: { taskId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_reminder_Request;
	};
	v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		path: { taskId: number; reminderId: number };
		query?: Record<string, never>;
		body?: never;
	};
	v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json: {
		path: { taskId: number; reminderId: number };
		query?: Record<string, never>;
		body: TeamworkV3Input_reminder_Request;
	};
	v3_get_projects_api_v3_tasks_taskid_subtasks_json: {
		path: { taskId: number };
		query?: {
			updatedBefore?: string;
			updatedAfter?: string;
			today?: string;
			taskFilter?:
				| 'all'
				| 'anytime'
				| 'completed'
				| 'created'
				| 'overdue'
				| 'today'
				| 'yesterday'
				| 'started'
				| 'tomorrow'
				| 'thisweek'
				| 'within7'
				| 'within14'
				| 'within30'
				| 'within365'
				| 'nodate'
				| 'noduedate'
				| 'nostartdate'
				| 'newTaskDefaults'
				| 'hasDate'
				| 'upcoming'
				| 'within'
				| 'withinprev';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'plannedvsactual' | 'task' | 'tasktime';
			reportFormat?: 'html' | 'pdf' | 'csv' | 'xls' | 'xlsx' | 'google-sheets';
			projectType?:
				| 'all'
				| 'normal'
				| 'tentative'
				| 'personal'
				| 'projects-template'
				| 'tasklists-template';
			priority?: string;
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'id'
				| 'startdate'
				| 'createdat'
				| 'priority'
				| 'project'
				| 'flattenedtasklist'
				| 'company'
				| 'manual'
				| 'active'
				| 'completedat'
				| 'duestartdate'
				| 'alldates'
				| 'tasklistname'
				| 'tasklistdisplayorder'
				| 'tasklistid'
				| 'duedate'
				| 'updatedat'
				| 'taskname'
				| 'createdby'
				| 'completedby'
				| 'assignedto'
				| 'taskstatus'
				| 'taskduedate'
				| 'customfield'
				| 'estimatedtime'
				| 'taskgroupid'
				| 'taskgroupname'
				| 'projectmanual'
				| 'stagedisplayorder'
				| 'stage'
				| 'parenttask'
				| 'dateadded'
				| 'datecompleted'
				| 'completedatdesc'
				| 'completeddatedesc'
				| 'duestartdatedesc'
				| 'alldatesdesc'
				| 'duedatedesc'
				| 'taskgroupdisplayorder'
				| 'dateupdated'
				| 'originalduedate'
				| 'tags';
			notCompletedBefore?: string;
			endDate?: string;
			dueBefore?: string;
			dueAfter?: string;
			deletedAfter?: string;
			createdFilter?: 'anytime' | 'today' | 'yesterday' | 'custom';
			createdDateCode?: string;
			createdBefore?: string;
			createdAfter?: string;
			completedBefore?: string;
			completedAfter?: string;
			updatedByUserId?: number;
			parentTaskId?: number;
			pageSize?: number;
			page?: number;
			orderByCustomFieldId?: number;
			includeTaskId?: number;
			filterId?: number;
			completedByUserId?: number;
			useTaskDateRange?: boolean;
			useStartDatesForTodaysTasks?: boolean;
			useFormulaFields?: boolean;
			useAllProjects?: boolean;
			sortActiveFirst?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			showCompletedLists?: boolean;
			searchJobRoles?: boolean;
			searchCompaniesTeams?: boolean;
			searchAssignees?: boolean;
			onlyUntaggedTasks?: boolean;
			onlyUnplanned?: boolean;
			onlyUnassignedTasks?: boolean;
			onlyTasksWithUnreadComments?: boolean;
			onlyTasksWithTickets?: boolean;
			onlyTasksWithEstimatedTime?: boolean;
			onlyStarredProjects?: boolean;
			onlyAssignedTasks?: boolean;
			onlyAssignedRoleTasks?: boolean;
			onlyAdminProjects?: boolean;
			nestSubTasks?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTags?: boolean;
			isReportDownload?: boolean;
			includeUpdate?: boolean;
			includeUntaggedTasks?: boolean;
			includeTomorrow?: boolean;
			includeToday?: boolean;
			includeTentativeProjects?: boolean;
			includeTeamUserIds?: boolean;
			includeTasksWithoutDueDates?: boolean;
			includeTasksFromDeletedLists?: boolean;
			includeTasksCount?: boolean;
			includeRelatedTasks?: boolean;
			includePrivateItems?: boolean;
			includeOverdueTasks?: boolean;
			includeOriginalDueDate?: boolean;
			includeJobRoleUserIds?: boolean;
			includeEmailCommentStats?: boolean;
			includeCustomFields?: boolean;
			includeCompletedTasks?: boolean;
			includeCompletedPredecessors?: boolean;
			includeCompanyUserIds?: boolean;
			includeCommentStats?: boolean;
			includeBlocked?: boolean;
			includeAttachmentCommentStats?: boolean;
			includeAssigneeTeams?: boolean;
			includeAssigneeJobRoles?: boolean;
			includeAssigneeCompanies?: boolean;
			includeArchivedProjects?: boolean;
			includeAllComments?: boolean;
			includeAccumulatedTimeTotals?: boolean;
			hideDeleted?: boolean;
			groupByTasklist?: boolean;
			groupByTaskgroup?: boolean;
			getSubTasks?: boolean;
			getFiles?: boolean;
			fallbackToMilestoneDueDate?: boolean;
			extractTemplateRoleName?: boolean;
			excludeAssigneeNotOnProjectTeams?: boolean;
			excludeAssignedToMe?: boolean;
			deletedOnly?: boolean;
			completedOnly?: boolean;
			checkForTimeblocks?: boolean;
			checkForReminders?: boolean;
			calculateTasklistDates?: boolean;
			allowAssigneesOutsideProject?: boolean;
			workflowIds?: Array<number>;
			tasksSelectedColumns?: Array<string>;
			tasklistIds?: Array<number>;
			taskgroupIds?: Array<number>;
			taskIncludedSet?: Array<
				| 'overdue'
				| 'nodate'
				| 'nostartdate'
				| 'noduedate'
				| 'nostartwithfutureduedate'
				| 'taskListNames'
				| 'projectNames'
			>;
			tags?: Array<string>;
			tagIds?: Array<number>;
			status?: Array<'upcoming' | 'late' | 'all'>;
			stageIds?: Array<number>;
			sort?: Array<string>;
			skipCRMDealIds?: Array<number>;
			selectedColumns?: Array<string>;
			responsiblePartyIds?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectFeaturesEnabled?: Array<
				| 'list'
				| 'board'
				| 'gantt'
				| 'table'
				| 'dashboard'
				| 'milestones'
				| 'messages'
				| 'files'
				| 'time'
				| 'notebooks'
				| 'risks'
				| 'links'
				| 'billing'
				| 'comments'
				| 'people'
				| 'settings'
			>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			portfolioBoardIds?: Array<number>;
			includeCustomFieldIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tasklists'
				| 'parentTasks'
				| 'companies'
				| 'teams'
				| 'users'
				| 'milestones'
				| 'comments'
				| 'comments.users'
				| 'tags'
				| 'timeTotals'
				| 'accumulatedTimeTotals'
				| 'taskSequences'
				| 'commentFollowers'
				| 'changeFollowers'
				| 'completeFollowers'
				| 'lockdowns'
				| 'lockdowns.users'
				| 'lockdowns.companies'
				| 'lockdowns.teams'
				| 'lockdowns.users.companies'
				| 'lockdowns.companies.users'
				| 'lockdowns.teams.users'
				| 'attachments'
				| 'attachments.users'
				| 'subtaskStats'
				| 'timers'
				| 'predecessors'
				| 'permissions'
				| 'jobRoles'
				| 'proofs'
				| 'taskgroups'
				| 'workflows'
				| 'workflows.stages'
				| 'customfields'
				| 'customfieldTasks'
				| 'tasks'
			>;
			ids?: Array<number>;
			followedByUserIds?: Array<number>;
			'fields[workflows]'?: Array<'id' | 'name' | 'statusId'>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[teams]'?: Array<
				'id' | 'name' | 'teamLogo' | 'teamLogoIcon' | 'teamLogoColor'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[taskgroups]'?: Array<
				'id' | 'name' | 'description' | 'displayOrder' | 'projectId' | 'status'
			>;
			'fields[taskSequences]'?: Array<
				| 'id'
				| 'installationId'
				| 'frequency'
				| 'selectedWeekDays'
				| 'endDate'
				| 'monthlyRepeatType'
				| 'duration'
				| 'rrule'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[stages]'?: Array<'id' | 'name' | 'stage'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[milestones]'?: Array<
				| 'id'
				| 'name'
				| 'description'
				| 'deadline'
				| 'completed'
				| 'projectId'
				| 'createdOn'
				| 'lastChangedOn'
				| 'creatorUserId'
				| 'reminder'
				| 'private'
				| 'lockdownId'
				| 'status'
				| 'completedOn'
				| 'completerId'
				| 'percentageComplete'
				| 'project'
			>;
			'fields[lockdowns]'?: Array<
				'id' | 'userID' | 'updatedAt' | 'itemType' | 'itemID' | 'grantAccessTo'
			>;
			'fields[jobroles]'?: Array<'id' | 'name'>;
			'fields[groups]'?: Array<
				| 'late'
				| 'today'
				| 'tomorrow'
				| 'later-this-week'
				| 'next-week'
				| 'later'
				| 'no-due-date'
			>;
			'fields[files]'?: Array<
				| 'isPrivate'
				| 'latestFileVersionNo'
				| 'versionId'
				| 'status'
				| 'description'
				| 'lockdownId'
				| 'tagIds'
				| 'changeFollowers'
				| 'commentFollowers'
				| 'originalName'
				| 'displayName'
				| 'isLocked'
				| 'lockedByUserId'
				| 'lockedDate'
				| 'size'
				| 'uploadedDate'
				| 'uploadedByUserID'
				| 'updatedAt'
				| 'deletedAt'
				| 'deletedBy'
				| 'fileSource'
				| 'projectId'
				| 'numLikes'
				| 'reactions'
				| 'versions'
				| 'downloadURL'
				| 'previewURL'
				| 'thumbURL'
				| 'relatedItems'
				| 'commentsCount'
				| 'commentsCountRead'
				| 'categoryId'
			>;
			'fields[customfields]'?: Array<
				| 'id'
				| 'projectId'
				| 'entity'
				| 'name'
				| 'description'
				| 'type'
				| 'options'
				| 'visibilities'
				| 'isPrivate'
				| 'required'
				| 'createdAt'
				| 'createdByUserId'
				| 'updatedAt'
				| 'updatedByUserId'
				| 'deleted'
				| 'deletedAt'
				| 'deletedByUserId'
			>;
			'fields[customfieldTasks]'?: Array<
				'id' | 'customfieldId' | 'value' | 'createdAt' | 'createdBy'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[comments]'?: Array<
				| 'id'
				| 'objectType'
				| 'objectId'
				| 'title'
				| 'postedAt'
				| 'postedBy'
				| 'object'
				| 'project'
			>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			expandedIds?: Array<number>;
			excludeTagIds?: Array<number>;
			excludeResponsiblePartyIds?: Array<number>;
			crmDealIds?: Array<number>;
			createdByUserIds?: Array<number>;
			assigneeTypes?: Array<
				| 'user'
				| 'company'
				| 'team'
				| 'jobrole'
				| 'placeholder'
				| 'assigned'
				| 'unassigned'
			>;
			assigneeTeamIds?: Array<number>;
			assigneeJobRoleIds?: Array<number>;
			assigneeCompanyIds?: Array<number>;
			CustomFields?: Array<string>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_tasks_taskid_subtasks_json: {
		path: { taskId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_task_CreateRequest;
	};
	v3_get_projects_api_v3_tasks_taskid_time_json: {
		path: { taskId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_post_projects_api_v3_tasks_taskid_time_json: {
		path: { taskId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_timelog_Request;
	};
	v3_get_projects_api_v3_tasks_taskid_time_total_json: {
		path: { taskId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			userId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			deskTicketId?: number;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			subTaskStatuses?: Array<
				'all' | 'completed' | 'incomplete' | 'new' | 'reopened' | 'deleted'
			>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			companyIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_report_json: {
		path?: Record<string, never>;
		query: {
			type: 'company' | 'project' | 'user' | 'tasklist' | 'task' | 'team';
			startDate: string;
			searchTerm?: string;
			reportType?: 'time' | 'loggedtime' | 'userloggedtime' | 'projecttime';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| ''
				| 'name'
				| 'loggedtime'
				| 'billabletime'
				| 'nonbillabletime'
				| 'billedtime'
				| 'budget'
				| 'estimatedtime'
				| 'utilizationtarget'
				| 'project'
				| 'user';
			groupBy?: 'day' | 'week' | 'month';
			expandedType?: string;
			endDate: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			matchAllTags?: boolean;
			isReportDownload?: boolean;
			includeCompletedTasks?: boolean;
			includeArchivedProjects?: boolean;
			expandAllGroups?: boolean;
			addChart?: boolean;
			userIds?: Array<number>;
			timelogTagIds?: Array<number>;
			teamIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<
				| 'company'
				| 'project'
				| 'user'
				| 'tasklist'
				| 'task'
				| 'team'
				| 'loggedtime'
				| 'billabletime'
				| 'billedtime'
				| 'nonbillabletime'
				| 'billablenonbillablesplit'
				| 'budget'
				| 'budgetname'
				| 'estimatedtime'
				| 'projectType'
				| 'utilizationTarget'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'projects'
				| 'projects.companies'
				| 'projectBudgets'
				| 'tasklists'
				| 'tasklistBudgets'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'teams'
				| 'users'
			>;
			expandedGroupIds?: Array<number>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_report_totals_json: {
		path?: Record<string, never>;
		query: {
			type?: 'company' | 'project' | 'user' | 'tasklist' | 'task' | 'team';
			startDate: string;
			searchTerm?: string;
			reportType?: 'time' | 'loggedtime' | 'userloggedtime' | 'projecttime';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| ''
				| 'name'
				| 'loggedtime'
				| 'billabletime'
				| 'nonbillabletime'
				| 'billedtime'
				| 'budget'
				| 'estimatedtime'
				| 'utilizationtarget'
				| 'project'
				| 'user';
			groupBy?: 'day' | 'week' | 'month';
			expandedType?: string;
			endDate: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			matchAllTags?: boolean;
			isReportDownload?: boolean;
			includeCompletedTasks?: boolean;
			includeArchivedProjects?: boolean;
			expandAllGroups?: boolean;
			addChart?: boolean;
			userIds?: Array<number>;
			timelogTagIds?: Array<number>;
			teamIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<
				| 'company'
				| 'project'
				| 'user'
				| 'tasklist'
				| 'task'
				| 'team'
				| 'loggedtime'
				| 'billabletime'
				| 'billedtime'
				| 'nonbillabletime'
				| 'billablenonbillablesplit'
				| 'budget'
				| 'budgetname'
				| 'estimatedtime'
				| 'projectType'
				| 'utilizationTarget'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'projects'
				| 'projects.companies'
				| 'projectBudgets'
				| 'tasklists'
				| 'tasklistBudgets'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'teams'
				| 'users'
			>;
			expandedGroupIds?: Array<number>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_report_type_json: {
		path: { type: string };
		query?: {
			type?: 'company' | 'project' | 'user' | 'tasklist' | 'task' | 'team';
			startDate?: string;
			searchTerm?: string;
			reportType?: 'time' | 'loggedtime' | 'userloggedtime' | 'projecttime';
			reportFormat?: string;
			projectType?:
				| ''
				| 'normal'
				| 'tasklists-template'
				| 'projects-template'
				| 'personal'
				| 'tentative';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| ''
				| 'name'
				| 'loggedtime'
				| 'billabletime'
				| 'nonbillabletime'
				| 'billedtime'
				| 'budget'
				| 'estimatedtime'
				| 'utilizationtarget'
				| 'project'
				| 'user';
			groupBy?: 'day' | 'week' | 'month';
			expandedType?: string;
			endDate?: string;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			matchAllTags?: boolean;
			isReportDownload?: boolean;
			includeCompletedTasks?: boolean;
			includeArchivedProjects?: boolean;
			expandAllGroups?: boolean;
			addChart?: boolean;
			userIds?: Array<number>;
			timelogTagIds?: Array<number>;
			teamIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<
				| 'company'
				| 'project'
				| 'user'
				| 'tasklist'
				| 'task'
				| 'team'
				| 'loggedtime'
				| 'billabletime'
				| 'billedtime'
				| 'nonbillabletime'
				| 'billablenonbillablesplit'
				| 'budget'
				| 'budgetname'
				| 'estimatedtime'
				| 'projectType'
				| 'utilizationTarget'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			jobRoleIds?: Array<number>;
			include?: Array<
				| 'companies'
				| 'projects'
				| 'projects.companies'
				| 'projectBudgets'
				| 'tasklists'
				| 'tasklistBudgets'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'teams'
				| 'users'
			>;
			expandedGroupIds?: Array<number>;
			companyIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_total_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			userId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			deskTicketId?: number;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			includeTentativeProjects?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			userIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			subTaskStatuses?: Array<
				'all' | 'completed' | 'incomplete' | 'new' | 'reopened' | 'deleted'
			>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			companyIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_time_validate_json: {
		path?: Record<string, never>;
		query?: { date?: string; userIds?: Array<number> };
		body?: never;
	};
	v3_delete_projects_api_v3_time_timelogid_json: {
		path: { timelogId: number };
		query?: { fireWebhook?: boolean };
		body?: never;
	};
	v3_get_projects_api_v3_time_timelogid_json: {
		path: { timelogId: number };
		query?: {
			updatedAfter?: string;
			startDate?: string;
			searchTerm?: string;
			reportFormat?: string;
			projectStatus?:
				| 'active'
				| 'current'
				| 'late'
				| 'upcoming'
				| 'completed'
				| 'deleted';
			orderMode?: 'asc' | 'desc';
			orderBy?:
				| 'company'
				| 'date'
				| 'dateupdated'
				| 'project'
				| 'task'
				| 'tasklist'
				| 'user'
				| 'description'
				| 'billed'
				| 'billable'
				| 'timespent'
				| 'id';
			invoicedType?: 'all' | 'invoiced' | 'noninvoiced';
			endDate?: string;
			deletedAfter?: string;
			budgetedType?: 'all' | 'budgeted' | 'nonbudgeted';
			billableType?: 'all' | 'billable' | 'nonbillable';
			updatedBy?: number;
			ticketId?: number;
			tasklistId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			invoiceId?: number;
			budgetId?: number;
			allocationId?: number;
			useFallbackMethod?: boolean;
			unattachedTimelogs?: boolean;
			skipCounts?: boolean;
			showDeleted?: boolean;
			returnSplitInfo?: boolean;
			returnCostInfo?: boolean;
			returnBillableInfo?: boolean;
			onlyStarredProjects?: boolean;
			matchAllTaskTags?: boolean;
			matchAllTags?: boolean;
			matchAllProjectTags?: boolean;
			matchAllExcludedTaskTags?: boolean;
			matchAllExcludedProjectTags?: boolean;
			isReportDownload?: boolean;
			includeTotals?: boolean;
			includeTentativeProjects?: boolean;
			includePermissions?: boolean;
			includeDescendants?: boolean;
			includeArchivedProjects?: boolean;
			deletedOnly?: boolean;
			checkLocking?: boolean;
			budgetAllocations?: boolean;
			ticketIds?: Array<number>;
			tasklistIds?: Array<number>;
			taskTagIds?: Array<number>;
			taskStatuses?: Array<string>;
			taskIds?: Array<number>;
			tagIds?: Array<number>;
			selectedColumns?: Array<string>;
			projectsFromCompanyId?: Array<number>;
			projectTagIds?: Array<number>;
			projectStatuses?: Array<
				'active' | 'current' | 'late' | 'upcoming' | 'completed' | 'deleted'
			>;
			projectOwnerIds?: Array<number>;
			projectIds?: Array<number>;
			projectHealths?: Array<'0' | '1' | '2' | '3'>;
			projectCompanyIds?: Array<number>;
			projectCategoryIds?: Array<number>;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'projects.companies.currencies'
				| 'projects.categories'
				| 'projects.permissions'
				| 'projects.integrations'
				| 'tags'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'tasks.users'
				| 'tasks.tags'
				| 'users'
				| 'createdBy'
				| 'updatedBy'
				| 'deletedBy'
				| 'project.billing'
				| 'project.billing.currencies'
				| 'projectBudgets'
				| 'currencies'
				| 'userRates'
			>;
			ids?: Array<number>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timelogs]'?: Array<
				| 'id'
				| 'dateCreated'
				| 'minutes'
				| 'description'
				| 'timeLogged'
				| 'billable'
				| 'deleted'
				| 'dateDeleted'
				| 'hasStartTime'
				| 'dateEdited'
				| 'deskTicketId'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'loggedByUserId'
				| 'deletedByUserId'
				| 'editedByUserId'
				| 'taskIdPreMove'
				| 'projectBillingInvoiceId'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[tags]'?: Array<'id' | 'name' | 'color' | 'count'>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
			'fields[projectcategories]'?: Array<
				'id' | 'name' | 'color' | 'count' | 'parent' | 'parentId'
			>;
			'fields[projectIntegrations]'?: Array<
				| 'userId'
				| 'projectId'
				| 'canAccessBox'
				| 'canAccessDropbox'
				| 'canAccessGoogleDocs'
				| 'canAccessOneDrive'
				| 'canAccessOneDriveBusiness'
				| 'canAccessSharePoint'
			>;
			'fields[companies]'?: Array<'id' | 'name' | 'logoUrl'>;
			'fields[ProjectPermissions]'?: Array<
				| 'viewMessagesAndFiles'
				| 'viewTasksAndMilestones'
				| 'viewTime'
				| 'viewNotebooks'
				| 'viewRiskRegister'
				| 'viewEstimatedTime'
				| 'viewInvoices'
				| 'addTasks'
				| 'addRisks'
				| 'manageCustomFields'
				| 'addExpenses'
				| 'editAllTasks'
				| 'addMilestones'
				| 'addTaskLists'
				| 'addMessages'
				| 'addFiles'
				| 'addTime'
				| 'addNotebooks'
				| 'viewLinks'
				| 'addLinks'
				| 'canViewForms'
				| 'addForms'
				| 'viewAllTimeLogs'
				| 'setPrivacy'
				| 'projectAdministrator'
				| 'viewProjectUpdate'
				| 'addProjectUpdate'
				| 'canViewProjectMembers'
				| 'canViewProjectBudget'
				| 'canManageProjectBudget'
				| 'canViewRates'
				| 'canManageRates'
				| 'canViewSchedule'
				| 'canManageSchedule'
				| 'receiveEmailNotifications'
				| 'isObserving'
				| 'isArchived'
				| 'active'
				| 'canAccess'
				| 'inOwnerCompany'
				| 'canManagePeople'
				| 'canViewProjectTemplates'
				| 'canManageProjectTemplates'
			>;
			excludeTaskTagIds?: Array<number>;
			excludeProjectTagIds?: Array<number>;
			assignedToUserIds?: Array<number>;
			assignedToTeamIds?: Array<number>;
			assignedToCompanyIds?: Array<number>;
			assignedTeamIds?: Array<number>;
		};
		body?: never;
	};
	v3_patch_projects_api_v3_time_timelogid_json: {
		path: { timelogId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_timelog_Request;
	};
	v3_put_projects_api_v3_time_timelogid_json: {
		path: { timelogId: number };
		query?: { fireWebhook?: boolean };
		body: TeamworkV3Input_timelog_Request;
	};
	v3_get_projects_api_v3_timers_json: {
		path?: Record<string, never>;
		query?: {
			updatedAfterDate?: string;
			updatedAfter?: string;
			userId?: number;
			taskId?: number;
			projectId?: number;
			pageSize?: number;
			page?: number;
			skipCounts?: boolean;
			showDeleted?: boolean;
			runningTimersOnly?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'users'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
	v3_get_projects_api_v3_timers_timerid_json: {
		path: { timerId: number };
		query?: {
			userId?: number;
			showDeleted?: boolean;
			include?: Array<
				| 'projects'
				| 'projects.companies'
				| 'tasks'
				| 'tasks.parentTasks'
				| 'tasks.tasklists'
				| 'users'
			>;
			'fields[users]'?: Array<
				| 'id'
				| 'firstName'
				| 'lastName'
				| 'title'
				| 'email'
				| 'companyId'
				| 'company'
				| 'isAdmin'
				| 'isClientUser'
				| 'isServiceAccount'
				| 'type'
				| 'deleted'
				| 'avatarUrl'
				| 'lengthOfDay'
				| 'workingHoursId'
				| 'workingHour'
				| 'userRate'
				| 'userCost'
				| 'canAddProjects'
				| 'updatedAt'
				| 'teams'
			>;
			'fields[timers]'?: Array<
				| 'id'
				| 'userId'
				| 'taskId'
				| 'projectId'
				| 'description'
				| 'running'
				| 'billable'
				| 'deleted'
				| 'dateCreated'
				| 'dateDeleted'
				| 'duration'
				| 'lastStartedAt'
				| 'serverTime'
				| 'intervals'
			>;
			'fields[tasks]'?: Array<
				| 'id'
				| 'name'
				| 'dateUpdated'
				| 'parentTaskId'
				| 'isPrivate'
				| 'status'
				| 'tasklistId'
				| 'startDate'
				| 'dueDate'
				| 'estimateMinutes'
				| 'accumulatedEstimatedMinutes'
				| 'updatedAt'
				| 'tasklist'
			>;
			'fields[tasklists]'?: Array<
				'id' | 'name' | 'projectId' | 'milestoneId' | 'project' | 'updatedAt'
			>;
			'fields[projects]'?: Array<
				| 'id'
				| 'name'
				| 'type'
				| 'status'
				| 'company'
				| 'companyId'
				| 'categoryId'
				| 'startPage'
				| 'logoIcon'
				| 'logoColor'
				| 'updatedAt'
				| 'isStarred'
				| 'allowNotifyAnyone'
				| 'notifyTaskAssignee'
				| 'isBillable'
				| 'timelogRequiresTask'
				| 'activePages'
				| 'projectNumber'
				| 'projectNumberCounter'
			>;
		};
		body?: never;
	};
};

export type TeamworkV3Outputs = {
	v3_get_projects_api_v3_allocations_allocationid_time_json: TeamworkV3Output_timelog_TimelogsResponse;
	v3_get_projects_api_v3_comments_json: TeamworkV3Output_comment_CommentsResponse;
	v3_post_projects_api_v3_comments_json: TeamworkV3Output_comment_Response;
	v3_get_projects_api_v3_comments_id_json: TeamworkV3Output_comment_Response;
	v3_get_projects_api_v3_comments_id_notified_json: TeamworkV3Output_comment_NotifiedResponse;
	v3_get_projects_api_v3_companies_json: TeamworkV3Output_company_CompaniesResponse;
	v3_post_projects_api_v3_companies_json: TeamworkV3Output_company_Response;
	v3_delete_projects_api_v3_companies_domains_id_json: undefined;
	v3_patch_projects_api_v3_companies_domains_id_json: TeamworkV3Output_domain_Response;
	v3_get_projects_api_v3_companies_time_json: TeamworkV3Output_timelog_CompanyTimelogsResponse;
	v3_delete_projects_api_v3_companies_companyid_json: undefined;
	v3_get_projects_api_v3_companies_companyid_json: TeamworkV3Output_company_Response;
	v3_patch_projects_api_v3_companies_companyid_json: TeamworkV3Output_company_Response;
	v3_patch_projects_api_v3_companies_companyid_rates_json: TeamworkV3Output_company_ClientRatesResponse;
	v3_post_projects_api_v3_companies_id_convert_currency_json: undefined;
	v3_post_projects_api_v3_companies_id_domains_json: TeamworkV3Output_domain_BulkResponse;
	v3_get_projects_api_v3_files_fileid_project_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_links_linkid_comments_json: TeamworkV3Output_comment_CommentsResponse;
	v3_post_projects_api_v3_links_linkid_comments_json: TeamworkV3Output_comment_Response;
	v3_get_projects_api_v3_links_linkid_project_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_me_json: TeamworkV3Output_me_Response2;
	v3_get_projects_api_v3_me_personaltasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_post_projects_api_v3_me_personaltasks_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_me_personaltasks_id_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_me_timers_json: TeamworkV3Output_timer_TimersResponse;
	v3_post_projects_api_v3_me_timers_json: TeamworkV3Output_timer_Response;
	v3_delete_projects_api_v3_me_timers_timerid_json: undefined;
	v3_put_projects_api_v3_me_timers_timerid_json: TeamworkV3Output_timer_Response;
	v3_put_projects_api_v3_me_timers_timerid_complete_json: TeamworkV3Output_timer_Response;
	v3_put_projects_api_v3_me_timers_timerid_pause_json: TeamworkV3Output_timer_Response;
	v3_put_projects_api_v3_me_timers_timerid_resume_json: TeamworkV3Output_timer_Response;
	v3_put_projects_api_v3_me_timers_timerid_undelete_json: undefined;
	v3_get_projects_api_v3_milestones_json: TeamworkV3Output_milestone_MilestonesResponse;
	v3_get_projects_api_v3_milestones_metrics_deadlines_json: TeamworkV3Output_deadline_MilestoneMetricDeadlinesResponse;
	v3_get_projects_api_v3_milestones_milestoneid_json: TeamworkV3Output_milestone_Response;
	v3_get_projects_api_v3_milestones_milestoneid_project_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_notebooks_json: TeamworkV3Output_notebook_NotebooksResponse;
	v3_delete_projects_api_v3_notebooks_notebookid_json: undefined;
	v3_get_projects_api_v3_notebooks_notebookid_json: TeamworkV3Output_notebook_Response;
	v3_patch_projects_api_v3_notebooks_notebookid_json: TeamworkV3Output_notebook_Response;
	v3_get_projects_api_v3_notebooks_notebookid_compare_json: TeamworkV3Output_notebook_VersionResponse;
	v3_get_projects_api_v3_notebooks_notebookid_project_json: TeamworkV3Output_project_responseV205;
	v3_delete_projects_api_v3_notebooks_notebookid_versions_json: undefined;
	v3_get_projects_api_v3_notebooks_notebookid_versions_json: TeamworkV3Output_notebook_VersionsResponse;
	v3_get_projects_api_v3_notebooks_notebookid_versions_versionid_json: TeamworkV3Output_notebook_VersionResponse;
	v3_get_projects_api_v3_people_json: TeamworkV3Output_people_MultiResponse;
	v3_get_projects_api_v3_people_metrics_performance_json: TeamworkV3Output_performance_PeopleMetricPerformancesResponse;
	v3_get_projects_api_v3_people_utilization_json: TeamworkV3Output_utilization_Response;
	v3_delete_projects_api_v3_people_personid_json: undefined;
	v3_get_projects_api_v3_people_personid_json: TeamworkV3Output_people_Response;
	v3_get_projects_api_v3_projects_json: TeamworkV3Output_project_projectsResponseV205;
	v3_get_projects_api_v3_projects_metrics_active_json: TeamworkV3Output_active_Response;
	v3_get_projects_api_v3_projects_metrics_billable_json: TeamworkV3Output_billable_ProjectMetricBillablesResponse;
	v3_get_projects_api_v3_projects_metrics_healths_json: TeamworkV3Output_health_ProjectMetricHealthsResponse;
	v3_get_projects_api_v3_projects_metrics_invoices_json: TeamworkV3Output_invoice_ProjectMetricInvoicesResponse;
	v3_get_projects_api_v3_projects_metrics_owners_json: TeamworkV3Output_owner_ProjectMetricOwnersResponse;
	v3_get_projects_api_v3_projects_metrics_unbilled_json: TeamworkV3Output_unbilled_ProjectMetricUnbilledResponse;
	v3_get_projects_api_v3_projects_number_json: TeamworkV3Output_project_ProjectNumberSettingsResponse;
	v3_put_projects_api_v3_projects_number_json: TeamworkV3Output_project_ProjectNumberSettingsResponse;
	v3_put_projects_api_v3_projects_people_userid_enqueue_json: TeamworkV3Output_people_AddPeopleToProjectResponse;
	v3_get_projects_api_v3_projects_starred_json: TeamworkV3Output_project_projectsResponseV205;
	v3_get_projects_api_v3_projects_teamwork_samples_json: TeamworkV3Output_project_SampleProjectsResponse;
	v3_get_projects_api_v3_projects_templates_json: TeamworkV3Output_project_projectsResponseV205;
	v3_get_projects_api_v3_projects_templates_id_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_projects_templates_id_customfields_required_json: TeamworkV3Output_customfield_CustomFieldsResponse;
	v3_put_projects_api_v3_projects_tentative_projectid_convert_json: TeamworkV3Output_project_SampleProjectsResponse;
	v3_get_projects_api_v3_projects_updates_json: TeamworkV3Output_update_ProjectUpdatesResponse;
	v3_get_projects_api_v3_projects_projectids_updates_json: TeamworkV3Output_update_ProjectUpdatesResponse;
	v3_get_projects_api_v3_projects_projectid_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_projects_projectid_featureorder_json: TeamworkV3Output_project_FeatureOrderResponse;
	v3_put_projects_api_v3_projects_projectid_featureorder_json: TeamworkV3Output_project_FeatureOrderResponse;
	v3_get_projects_api_v3_projects_projectid_milestones_json: TeamworkV3Output_milestone_MilestonesResponse;
	v3_post_projects_api_v3_projects_projectid_notebooks_json: TeamworkV3Output_notebook_Response;
	v3_get_projects_api_v3_projects_projectid_people_json: TeamworkV3Output_people_MultiResponse;
	v3_put_projects_api_v3_projects_projectid_people_json: TeamworkV3Output_people_AddPeopleToProjectResponse;
	v3_get_projects_api_v3_projects_projectid_people_personid_json: TeamworkV3Output_people_Response;
	v3_get_projects_api_v3_projects_projectid_tasklists_json: TeamworkV3Output_tasklist_TasklistsResponse;
	v3_get_projects_api_v3_projects_projectid_tasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_get_projects_api_v3_projects_projectid_time_json: TeamworkV3Output_timelog_TimelogsResponse;
	v3_post_projects_api_v3_projects_projectid_time_json: TeamworkV3Output_timelog_Response;
	v3_get_projects_api_v3_projects_projectid_time_total_json: TeamworkV3Output_timelog_TotalsResponse;
	v3_get_projects_api_v3_reporting_dashboards_data_milestones_json: TeamworkV3Output_container_DashboardDataResponse;
	v3_get_projects_api_v3_reporting_dashboards_details_milestones_json: TeamworkV3Output_milestone_MilestoneDetailsResponse;
	v3_get_projects_api_v3_reporting_precanned_companytime_json: TeamworkV3Output_timelog_CompanyTimelogsResponse;
	v3_get_projects_api_v3_reporting_precanned_tasktime_json: TeamworkV3Output_task_tasksResponseV205;
	v3_get_projects_api_v3_reporting_precanned_usertaskcompletion_json: TeamworkV3Output_people_TaskCompletionResponse;
	v3_get_projects_api_v3_statuses_json: TeamworkV3Output_status_StatusesResponse;
	v3_get_projects_api_v3_statuses_timeline_json: TeamworkV3Output_status_TimelineResponse;
	v3_get_projects_api_v3_taskgroups_taskgroupid_tasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_tasklists_json: TeamworkV3Output_tasklist_TasklistsResponse;
	v3_get_projects_api_v3_tasklists_templates_json: TeamworkV3Output_tasklist_TasklistsResponse;
	v3_delete_projects_api_v3_tasklists_tasklistid_json: undefined;
	v3_get_projects_api_v3_tasklists_tasklistid_json: TeamworkV3Output_tasklist_Response;
	v3_get_projects_api_v3_tasklists_tasklistid_project_json: TeamworkV3Output_project_responseV205;
	v3_get_projects_api_v3_tasklists_tasklistid_tasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_post_projects_api_v3_tasklists_tasklistid_tasks_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_tasklists_tasklistid_time_total_json: TeamworkV3Output_timelog_TotalsResponse;
	v3_get_projects_api_v3_tasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_get_projects_api_v3_tasks_metrics_complete_json: TeamworkV3Output_complete_Response;
	v3_get_projects_api_v3_tasks_metrics_late_json: TeamworkV3Output_late_Response;
	v3_get_projects_api_v3_tasks_id_reminders_json: TeamworkV3Output_reminder_TaskRemindersResponse;
	v3_delete_projects_api_v3_tasks_taskid_json: undefined;
	v3_get_projects_api_v3_tasks_taskid_json: TeamworkV3Output_task_responseV205;
	v3_patch_projects_api_v3_tasks_taskid_json: TeamworkV3Output_task_responseV205;
	v3_put_projects_api_v3_tasks_taskid_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_tasks_taskid_project_json: TeamworkV3Output_project_responseV205;
	v3_post_projects_api_v3_tasks_taskid_reminders_json: TeamworkV3Output_reminder_TaskRemindersResponse;
	v3_delete_projects_api_v3_tasks_taskid_reminders_reminderid_json: undefined;
	v3_patch_projects_api_v3_tasks_taskid_reminders_reminderid_json: TeamworkV3Output_reminder_TaskReminderResponse;
	v3_get_projects_api_v3_tasks_taskid_subtasks_json: TeamworkV3Output_task_tasksResponseV205;
	v3_post_projects_api_v3_tasks_taskid_subtasks_json: TeamworkV3Output_task_responseV205;
	v3_get_projects_api_v3_tasks_taskid_time_json: TeamworkV3Output_timelog_TimelogsResponse;
	v3_post_projects_api_v3_tasks_taskid_time_json: TeamworkV3Output_timelog_Response;
	v3_get_projects_api_v3_tasks_taskid_time_total_json: TeamworkV3Output_timelog_TotalsResponse;
	v3_get_projects_api_v3_time_json: TeamworkV3Output_timelog_TimelogsResponse;
	v3_get_projects_api_v3_time_report_json: TeamworkV3Output_timelog_TimelogsResponse;
	v3_get_projects_api_v3_time_report_totals_json: TeamworkV3Output_view_TimeReportTotals;
	v3_get_projects_api_v3_time_report_type_json: TeamworkV3Output_timelog_ReportResponse;
	v3_get_projects_api_v3_time_total_json: TeamworkV3Output_timelog_TotalsResponse;
	v3_get_projects_api_v3_time_validate_json: TeamworkV3Output_timelog_ValidationResponse;
	v3_delete_projects_api_v3_time_timelogid_json: undefined;
	v3_get_projects_api_v3_time_timelogid_json: TeamworkV3Output_timelog_Response;
	v3_patch_projects_api_v3_time_timelogid_json: TeamworkV3Output_timelog_Response;
	v3_put_projects_api_v3_time_timelogid_json: TeamworkV3Output_timelog_Response;
	v3_get_projects_api_v3_timers_json: TeamworkV3Output_timer_TimersResponse;
	v3_get_projects_api_v3_timers_timerid_json: TeamworkV3Output_timer_Response;
};

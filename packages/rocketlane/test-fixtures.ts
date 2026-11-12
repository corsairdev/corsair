// Fixtures are built from the OpenAPI definitions Rocketlane publishes inside
// each reference page (https://developer.rocketlane.com/llms.txt), and from the
// live error envelope a bad key returns.

export const TASK_ID = 9001;
export const PROJECT_ID = 201;
export const COMPANY_ID = 301;
export const USER_ID = 401;
export const TIME_ENTRY_ID = 501;

/** The live 401 envelope, verbatim from a call with a bogus key. */
export const AUTH_ERROR = {
	errors: [
		{
			errorCode: 'NOT_AUTHORIZED',
			errorMessage: 'Not Authorized: User not authorized',
		},
	],
};

/** A 400 listing more than one bad field. */
export const VALIDATION_ERROR = {
	errors: [
		{
			errorCode: 'BAD_REQUEST',
			errorMessage: 'projectName must not be blank',
		},
		{
			errorCode: 'BAD_REQUEST',
			errorMessage: 'dueDate must be on or after startDate',
		},
	],
};

export const NOT_FOUND_ERROR = {
	errors: [
		{
			errorCode: 'NOT_FOUND',
			errorMessage: 'Task with the given id does not exist',
		},
	],
};

export const PAGINATION = {
	pageSize: 100,
	hasMore: false,
	totalRecordCount: 1,
	nextPage: null,
	nextPageToken: null,
};

export const PAGINATION_MORE = {
	pageSize: 1,
	hasMore: true,
	totalRecordCount: 3,
	nextPage: 'https://api.rocketlane.com/api/1.0/tasks?pageToken=abc',
	nextPageToken: 'abc',
};

export const USER_REF = {
	userId: USER_ID,
	emailId: 'sam@example.com',
	firstName: 'Sam',
	lastName: 'Rivera',
};

export const TASK = {
	taskId: TASK_ID,
	taskName: 'Kickoff workshop',
	taskDescription: 'Run the discovery session',
	startDate: '2026-11-10',
	dueDate: '2026-11-14',
	archived: false,
	effortInMinutes: 240,
	progress: 40,
	atRisk: false,
	createdAt: 1794300000,
	updatedAt: 1794344670,
	revenueRecognitionTask: false,
	totalAllocatedMins: 120,
	type: 'TASK',
	externalReferenceId: 'ext-1',
	billable: true,
	csatEnabled: false,
	private: false,
	createdBy: USER_REF,
	updatedBy: USER_REF,
	project: {
		projectId: PROJECT_ID,
		projectName: 'Acme onboarding',
	},
	status: { value: 2, label: 'In progress' },
	phase: { phaseId: 11, phaseName: 'Discover' },
	priority: { value: 2, label: 'High' },
	fields: [
		{
			fieldId: 7,
			fieldLabel: 'Effort estimate',
			fieldValue: 3,
			fieldValueLabel: '3',
		},
	],
	assignees: { members: [USER_REF], placeholders: [] },
	followers: { members: [], placeholders: [] },
	dependencies: [],
	parent: null,
};

export const TASK_PAGE = { data: [TASK], pagination: PAGINATION };
export const TASK_PAGE_MORE = { data: [TASK], pagination: PAGINATION_MORE };

export const PROJECT = {
	projectId: PROJECT_ID,
	projectName: 'Acme onboarding',
	startDate: '2026-11-01',
	dueDate: '2027-01-31',
	createdAt: 1794200000,
	updatedAt: 1794344670,
	visibility: 'EVERYONE',
	// The reference's status is an object, not a string.
	status: { value: 2, label: 'In progress' },
	currency: 'USD',
	annualizedRecurringRevenue: 120000,
	projectFee: 45000,
	budgetedHours: 320,
	allocatedHours: 180,
	inferredProgress: 'RUNNING_LATE',
	progressPercentage: 55,
	archived: false,
	owner: USER_REF,
	customer: {
		companyId: COMPANY_ID,
		companyName: 'Acme Inc',
		companyUrl: 'https://acme.example.com',
	},
	fields: [
		{
			fieldId: 8,
			fieldLabel: 'Region',
			fieldValue: 'EMEA',
			fieldValueLabel: 'EMEA',
		},
	],
	teamMembers: {
		members: [USER_REF],
		customers: [],
		customerChampion: null,
	},
	sources: [],
	partnerCompanies: [],
	financials: { contractType: 'FIXED_FEE' },
};

export const PROJECT_PAGE = { data: [PROJECT], pagination: PAGINATION };

export const COMPANY = {
	companyId: COMPANY_ID,
	companyName: 'Acme Inc',
	companyUrl: 'https://acme.example.com',
	visibility: 'EVERYONE',
	description: 'Enterprise customer',
	createdAt: 1794100000,
	updatedAt: 1794344670,
	accountOwner: USER_REF,
	createdBy: USER_REF,
	updatedBy: USER_REF,
	fields: [],
	notes: [
		{
			noteId: 12,
			fieldId: 13,
			fieldLabel: 'Account notes',
			noteTitle: 'Renewal',
			noteText: 'Renews in March',
			tags: [{ tagId: 1, label: 'sales', color: 'blue' }],
			createdAt: 1794100000,
			updatedAt: 1794100000,
		},
	],
};

export const COMPANY_PAGE = { data: [COMPANY], pagination: PAGINATION };

export const USER = {
	userId: USER_ID,
	email: 'sam@example.com',
	firstName: 'Sam',
	lastName: 'Rivera',
	type: 'TEAM_MEMBER',
	status: 'ACTIVE',
	profilePictureUrl: 'https://cdn.example.com/sam.png',
	capacityInMinutes: 2400,
	createdAt: 1794000000,
	updatedAt: 1794344670,
	role: { roleId: 1, roleName: 'Project manager' },
	company: { companyId: COMPANY_ID, companyName: 'Acme Inc' },
	fields: [],
	permission: { permissionId: 3, permissionName: 'Admin' },
	// The reference spells it `calender`.
	holidayCalendar: { calenderId: 2, calenderName: 'US holidays' },
};

export const USER_PAGE = { data: [USER], pagination: PAGINATION };

export const TIME_ENTRY = {
	timeEntryId: TIME_ENTRY_ID,
	date: '2026-11-10',
	minutes: 90,
	activityName: 'Discovery workshop',
	notes: 'Ran the session with the customer team',
	billable: true,
	sourceType: 'TASK',
	status: 'APPROVED',
	deleted: false,
	createdAt: 1794300000,
	updatedAt: 1794344670,
	submittedAt: 1794300100,
	approvedAt: 1794300200,
	project: { projectId: PROJECT_ID, projectName: 'Acme onboarding' },
	task: { taskId: TASK_ID, taskName: 'Kickoff workshop' },
	projectPhase: { phaseId: 11, phaseName: 'Discover' },
	user: USER_REF,
	category: { categoryId: 5, categoryName: 'Delivery' },
	createdBy: USER_REF,
	updatedBy: USER_REF,
	submittedBy: USER_REF,
	approvedBy: USER_REF,
	fields: [],
	costRate: { rate: 50, currency: 'USD' },
	billRate: { rate: 150, currency: 'USD' },
	budget: { budgetId: 9, budgetName: 'Delivery' },
};

export const TIME_ENTRY_PAGE = { data: [TIME_ENTRY], pagination: PAGINATION };

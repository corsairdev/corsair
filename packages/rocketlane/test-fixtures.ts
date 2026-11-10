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
		status: 'ACTIVE',
	},
	status: { statusId: 1, statusName: 'In progress' },
	phase: { phaseId: 11, phaseName: 'Discover' },
	priority: { priorityId: 2, priorityName: 'High' },
	fields: [
		{ fieldId: 7, fieldName: 'Effort estimate', fieldType: 'NUMBER', value: 3 },
	],
	// The assignee wrapper differs between the create and the read response.
	assignees: { users: [USER_REF] },
	followers: { users: [] },
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
	visibility: 'CUSTOMER',
	status: 'ACTIVE',
	currency: 'USD',
	annualizedRecurringRevenue: 120000,
	projectFee: 45000,
	budgetedHours: 320,
	allocatedHours: 180,
	inferredProgress: 55,
	archived: false,
	contractType: 'FIXED_FEE',
	owner: USER_REF,
	customer: { companyId: COMPANY_ID, companyName: 'Acme Inc' },
	fields: [],
	teamMembers: [USER_REF],
	sources: [],
	partners: [],
};

export const PROJECT_PAGE = { data: [PROJECT], pagination: PAGINATION };

export const COMPANY = {
	companyId: COMPANY_ID,
	companyName: 'Acme Inc',
	companyUrl: 'https://acme.example.com',
	visibility: 'CUSTOMER',
	description: 'Enterprise customer',
	createdAt: 1794100000,
	updatedAt: 1794344670,
	accountOwner: USER_REF,
	createdBy: USER_REF,
	updatedBy: USER_REF,
	fields: [],
	notes: [],
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
	// Provider-shaped blobs.
	permission: { canEdit: true },
	holidayCalendar: { calendarId: 2 },
};

export const USER_PAGE = { data: [USER], pagination: PAGINATION };

export const TIME_ENTRY = {
	timeEntryId: TIME_ENTRY_ID,
	date: '2026-11-10',
	minutes: 90,
	activityName: 'Discovery workshop',
	notes: 'Ran the session with the customer team',
	billable: true,
	sourceType: 'WEB',
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
	// Rate blocks are provider-shaped and differ by plan.
	costRate: { amount: 50, currency: 'USD' },
	billRate: { amount: 150, currency: 'USD' },
	budget: { budgetId: 9 },
};

export const TIME_ENTRY_PAGE = { data: [TIME_ENTRY], pagination: PAGINATION };

// Shapes taken from Kadoa's OpenAPI document (https://api.kadoa.com/openapi)
// and its API reference pages, not from the dashboard.

export const workflow = {
	id: 'wf_01HZX6',
	name: 'Product Catalog',
	description: 'Prices and stock for the whole catalogue',
	state: 'ACTIVE',
	displayState: 'ACTIVE',
	userId: 'u_01',
	userEmail: 'ops@acme.example',
	createdAt: '2026-04-02T09:12:04.000Z',
	updateInterval: 'DAILY',
	isRealTime: false,
	urls: ['https://acme.example/products'],
	tags: ['pricing'],
	runState: 'FINISHED',
	jobId: 'job_01HZX7',
	totalRecords: 412,
	schemaName: 'Product',
	schemaId: 'sch_01HZX8',
	inSupport: false,
	awaitingUserInput: null,
};

export const workflowDetail = {
	...workflow,
	schedules: ['0 6 * * *'],
	scheduleTimezone: 'UTC',
	nextInvocation: '2026-11-13T06:00:00.000Z',
	entity: 'Product',
	isSchemaEditable: true,
	dataQualityIssues: 0,
	limit: 1000,
	schema: [
		{
			name: 'title',
			description: 'Product title',
			example: 'Blue Widget',
			dataType: 'STRING',
			isKey: true,
			isRequired: true,
			isUnique: true,
		},
	],
	pendingFields: [],
};

export const workflowsList = {
	workflows: [workflow, { ...workflow, id: 'wf_02', state: 'PAUSED' }],
	pagination: { totalCount: 2, page: 1, totalPages: 1, limit: 25 },
};

export const runStarted = {
	message: 'Workflow started',
	jobId: 'job_01HZX7',
	status: 'running',
};

export const jobStatus = {
	id: 'job_01HZX7',
	state: 'IN_PROGRESS',
	startedAt: '2026-11-12T10:00:00.000Z',
	workflowId: 'wf_01HZX6',
	limit: 1000,
	errors: [],
};

export const jobFinished = {
	...jobStatus,
	state: 'FINISHED',
	finishedAt: '2026-11-12T10:02:31.000Z',
};

export const jobFailed = {
	...jobStatus,
	state: 'FAILED',
	finishedAt: '2026-11-12T10:01:07.000Z',
	errors: [
		{
			errorCode: 'NAVIGATION_FAILED',
			message: 'The listings page answered 503',
			occurredAt: '2026-11-12T10:01:02.000Z',
		},
	],
};

export const history = {
	workflowId: 'wf_01HZX6',
	workflowRuns: [
		{
			id: 'run_01',
			state: 'FINISHED',
			startedAt: '2026-11-11T06:00:01.000Z',
			finishedAt: '2026-11-11T06:03:12.000Z',
			records: 412,
			errors: [],
		},
		{
			id: 'run_02',
			state: 'FAILED',
			startedAt: '2026-11-10T06:00:00.000Z',
			finishedAt: '2026-11-10T06:00:44.000Z',
			records: 0,
			errors: [{ errorCode: 'ZERO_RESULTS', message: 'No records found' }],
		},
	],
	totalCount: 2,
	pagination: { page: 1, limit: 25, totalPages: 1, totalCount: 2 },
};

export const workflowData = {
	workflowId: 'wf_01HZX6',
	runId: 'run_01',
	executedAt: '2026-11-11T06:03:12.000Z',
	data: [
		{ title: 'Blue Widget', price: '19.00', 'listing-count': 12 },
		{ title: 'Red Widget', price: '21.50', 'listing-count': 4 },
	],
	pagination: { totalCount: 2, page: 1, totalPages: 1, limit: 25 },
};

export const changes = {
	timestamp: '2026-11-12T10:05:00.000Z',
	changesCount: 1,
	changes: [
		{
			id: 'chg_01',
			workflowId: 'wf_01HZX6',
			dataPending: false,
			data: [{ title: 'Blue Widget', price: '17.00' }],
			differences: [
				{
					type: 'changed',
					fields: [{ key: 'price', value: '17.00', previousValue: '19.00' }],
				},
			],
			differencesCounts: { added: 0, removed: 0, changed: 1 },
			url: 'https://acme.example/products',
			summary: 'Blue Widget fell by two units.',
			createdAt: '2026-11-12T10:04:58.000Z',
		},
	],
	pagination: { totalCount: 1, page: 1, totalPages: 1, limit: 25 },
};

export const schemaDefinition = {
	id: 'sch_01HZX8',
	name: 'Product',
	isPublic: false,
	entity: 'Product',
	schema: [
		{
			name: 'title',
			description: 'Product title',
			example: 'Blue Widget',
			dataType: 'STRING',
			isKey: true,
			isRequired: true,
			isUnique: true,
		},
	],
	description: { hintText: 'One row per product' },
};

export const schemasList = { error: false, data: [schemaDefinition] };

export const variables = [
	{
		id: 'var_01',
		key: 'region',
		value: 'eu-west',
		dataType: 'STRING',
		createdAt: '2026-05-01T12:00:00.000Z',
		updatedAt: '2026-05-01T12:00:00.000Z',
	},
	{
		id: 'var_02',
		key: 'apiLogin',
		dataType: 'SECRET',
		provider: 'GOOGLE_SECRET_MANAGER',
		managementMode: 'KADOA_MANAGED',
		status: 'ACTIVE',
		createdAt: '2026-05-02T12:00:00.000Z',
	},
];

export const variablesList = { variables, error: null };

export const variable = { variable: variables[0], error: null };

export const triggers = {
	triggers: [
		{
			id: 'trg_01',
			sourceWorkflowId: 'wf_01HZX6',
			targetWorkflowId: 'wf_02',
			targetWorkflowName: 'Price watch',
			eventType: 'workflow_data_change',
			enabled: true,
		},
	],
	incoming: [],
};

export const locations = {
	locations: [
		{ countryName: 'United States', isoCode: 'US' },
		{ countryName: 'Germany', isoCode: 'DE' },
	],
};

/** The 401 body Kadoa answers a request with no key, or a wrong one. */
export const unauthorized = { error: 'Unauthorized' };

/** The generic validation body most v4 routes send. */
export const validationError = {
	error: true,
	message: 'name must be longer than or equal to 1 characters',
	details: [{ path: 'name', message: 'name should not be empty' }],
};

/** The 409 body the run route sends for a workflow in a bad state. */
export const runConflict = {
	error: 'Workflow is not ready to run',
	reason: 'PREVIEW_AWAITS_CUSTOMER_CONFIRMATION',
	recoveryHint: 'Approve the preview or pass preview=true.',
	existingState: 'PREVIEW',
};

/** The 429 body the run route sends when the pipeline is busy. */
export const pipelineCrowded = {
	error: 'Too many concurrent jobs',
	reason: 'PIPELINE_CROWDED',
};

/** The 409 body the data route sends before a run is published. */
export const dataNotPublished = {
	code: 'DATA_NOT_PUBLISHED',
	error: 'No workflow run is published',
	runId: 'run_02',
};

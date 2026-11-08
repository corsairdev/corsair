// Response bodies copied from the examples in
// https://developers.databox.com/docs, with made-up names and companies. They
// were not captured from the live API.

const requestId = 'b0eac937-c25c-47a5-bb7e-552f6b860458';

export const dataSource = {
	id: 1234567,
	name: 'Sales',
	integrationKey: 'DataboxAPI',
	timezone: 'Europe/Ljubljana',
	statusInfo: { status: 'active', statusCode: 'active' },
	connectionId: 7654321,
	managedBy: { id: 123456, name: 'Anna Lytics' },
	createdAt: '2026-09-18T12:00:00+00:00',
	lastActivityAt: '2026-09-18T12:00:00.000000+00:00',
	syncInterval: 1440,
};

export const dataSourceList = {
	requestId,
	status: 'success',
	data: {
		items: [dataSource],
		pagination: { page: 0, pageSize: 100, totalItems: 1000 },
	},
};

export const dataset = {
	id: 2345678,
	type: 'dataset',
	dataSourceId: 1234567,
	name: 'Transactions',
	timezone: 'Europe/Ljubljana',
	ingestionSupported: true,
	statusInfo: { status: 'pending', statusCode: 'readyForFirstFetch' },
	syncInfo: {
		status: 'success',
		type: 'initialSync',
		initiatedAt: '2026-09-18T12:00:00.000000+00:00',
		lastSuccessfulSyncAt: '2026-09-18T12:00:00.000000+00:00',
	},
	verificationInfo: { isVerified: true },
	createdAt: '2026-09-18T12:00:00+00:00',
	lastActivityAt: '2026-09-18T12:00:00.000000+00:00',
};

export const datasetList = {
	requestId,
	status: 'success',
	data: {
		items: [dataset],
		pagination: { page: 0, pageSize: 100, totalItems: 1000 },
	},
};

export const datasetData = {
	requestId,
	status: 'success',
	data: {
		items: [
			{
				transaction_id: 'T-10024',
				transaction_date: '2026-09-18T09:12:00+00:00',
				product_name: 'Standing Desk',
				quantity: 2,
				unit_price: 249,
				calculated_column_1: 498,
			},
		],
		pagination: { page: 0, pageSize: 100, totalItems: 1000 },
		schema: [
			{
				id: 'transaction_id',
				displayName: 'Transaction ID',
				dataType: 'string',
				order: 1,
				visible: false,
			},
		],
		lastUpdatedAt: '2026-09-18T12:00:00.000+00:00',
	},
};

export const ingestQueued = {
	requestId,
	status: 'success',
	data: {
		ingestionId: 'a4283796-bfde-42cf-aa65-1830d6692966',
		status: 'queued',
		message: 'Ingestion submitted.',
	},
};

export const ingestionDetail = {
	requestId,
	status: 'success',
	data: {
		id: 'a4283796-bfde-42cf-aa65-1830d6692966',
		initiatedAt: '2026-09-18T12:00:00.000000+00:00',
		status: 'completed',
		duration: 200,
		initiatedBy: { id: 123456, name: 'Anna Lytics' },
		summary: {
			ingestion: {
				receivedRecordCount: 500,
				appendedRecordCount: 500,
				overwrittenRecordCount: 10,
				rejectedRecordCount: 0,
			},
			dataset: { columnCount: 6, rowCount: 1000, size: 104857600 },
		},
		errors: [],
	},
};

export const metric = {
	id: 'GoogleAnalytics4@sessions',
	name: 'Sessions',
	description: null,
	sourceId: 1234567,
	dimensions: [
		{
			id: 'sessionDefaultChannelGroup',
			displayName: 'Session Default Channel Group',
		},
	],
	supportsDrilldown: true,
	verificationInfo: { isVerified: true },
};

export const metricList = {
	requestId,
	status: 'success',
	data: {
		items: [metric],
		pagination: { page: 0, pageSize: 100, totalItems: 1000 },
	},
};

export const metricData = {
	requestId,
	status: 'success',
	data: {
		metric: {
			id: 'GoogleAnalytics4@sessions',
			name: 'Sessions',
			sourceId: 1234567,
		},
		dataPoints: [
			{ date: '2026-09-18T12:00:00+00:00', value: 12500, dimensions: {} },
			{ date: '2026-09-19T12:00:00+00:00', value: null, dimensions: {} },
		],
		syncInfo: {
			status: 'synced',
			lastSyncedAt: '2026-09-18T12:00:00+00:00',
			message:
				'Synced for this request, and the data is current as of 2026-09-18T12:00:00Z.',
		},
	},
};

export const dashboard = {
	id: 123456,
	name: 'Sales Overview',
	tags: ['Sales', 'Marketing'],
	integrationKeys: ['GoogleAnalytics4', 'Facebook'],
};

export const dashboardList = {
	requestId,
	status: 'success',
	data: {
		items: [dashboard],
		pagination: { page: 0, pageSize: 100, totalItems: 1000 },
	},
};

export function validationError(field?: string) {
	return {
		requestId,
		status: 'error',
		errors: [
			{
				code: 'invalid_input',
				message: 'The provided parameter is invalid.',
				...(field !== undefined ? { field } : {}),
				type: 'validation',
			},
		],
	};
}

export const conflictInProgress = {
	requestId,
	status: 'error',
	errors: [
		{
			code: 'modification_in_progress',
			message: 'A dataset modification is in progress.',
			type: 'conflict',
		},
	],
};

export const conflictFailed = {
	requestId,
	status: 'error',
	errors: [
		{
			code: 'modification_failed',
			message: 'The dataset modification failed.',
			type: 'conflict',
		},
	],
};

export const unauthorized = {
	requestId,
	status: 'error',
	errors: [
		{
			code: 'unauthorized',
			message: 'The API key is missing or invalid.',
			type: 'authentication',
		},
	],
};

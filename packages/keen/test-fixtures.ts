// Shapes taken from Keen's API reference (https://keen.io/docs/api/), and the
// error bodies from live probes of api.keen.io.

export const collection = {
	name: 'purchases',
	properties: {
		'item.id': 'num',
		'item.on_sale': 'bool',
		'item.price': 'num',
		quantity: 'num',
		'screen.name': 'string',
		'user.id': 'num',
	},
	url: '/3.0/projects/523b527836bf5a3216000006/events/purchases',
};

export const collections = [
	collection,
	{
		name: 'level_ups',
		properties: { from_level: 'num', level: 'num', to_level: 'num' },
		url: '/3.0/projects/523b527836bf5a3216000006/events/level_ups',
	},
];

export const collectionDetail = {
	properties: { 'item.price': 'num', quantity: 'num' },
	url: '/3.0/projects/523b527836bf5a3216000006/events/purchases',
};

export const property = { property_name: 'item.price', type: 'num' };

export const eventCreated = { created: true };

export const eventsCreated = {
	purchases: [{ success: true }, { success: true }],
	signups: [{ success: true }, { success: false }],
};

export const countResult = { result: 42 };

export const groupedResult = {
	result: [
		{ platform: 'Mobile', result: 1283.04 },
		{ platform: 'Web', result: 323.73 },
	],
};

export const intervalResult = {
	result: [
		{
			timeframe: {
				start: '2026-11-01T00:00:00.000Z',
				end: '2026-11-02T00:00:00.000Z',
			},
			value: 12,
		},
		{
			timeframe: {
				start: '2026-11-02T00:00:00.000Z',
				end: '2026-11-03T00:00:00.000Z',
			},
			value: 18,
		},
	],
};

export const multiAnalysisResult = {
	result: { purchases: 42, revenue: 1283.04 },
};

export const savedQuery = {
	updated: false,
	refresh_rate: 0,
	created: true,
	query_name: 'weekly-purchases',
	created_date: '2026-11-01T14:44:56.034766+00:00',
	last_modified_date: '2026-11-01T14:44:56.034766+00:00',
	metadata: null,
	run_information: null,
	urls: {
		cached_query_url:
			'/3.0/projects/523b527836bf5a3216000006/queries/saved/weekly-purchases',
		cached_query_results_url:
			'/3.0/projects/523b527836bf5a3216000006/queries/saved/weekly-purchases/result',
	},
	query: {
		analysis_type: 'count',
		event_collection: 'purchases',
		timeframe: 'this_7_days',
	},
};

// Keen answers GET /queries/saved with a bare array of definitions.
export const savedQueries = [
	savedQuery,
	{ ...savedQuery, query_name: 'daily-signups' },
];

export const savedQueryResult = {
	...savedQuery,
	result: [
		{ platform: 'Mobile', result: 1283.04 },
		{ platform: 'Web', result: 323.73 },
	],
};

export const dataset = {
	project_id: '523b527836bf5a3216000006',
	organization_id: '5f1b2c3d4e5f6a7b8c9d0e1f',
	dataset_name: 'count-purchases-by-country-daily',
	display_name: 'Purchases by country',
	query: {
		project_id: '523b527836bf5a3216000006',
		analysis_type: 'count',
		event_collection: 'purchases',
		timeframe: 'this_500_days',
		timezone: 'UTC',
		interval: 'daily',
		group_by: ['country'],
	},
	index_by: ['country'],
	last_scheduled_date: '2026-11-04T18:03:38.430Z',
	latest_subtimeframe_available: '2026-11-04T19:00:00.000Z',
	milliseconds_behind: 3600000,
	status: 'OK',
};

export const datasets = {
	datasets: [dataset],
	next_page_url:
		'https://api.keen.io/3.0/projects/523b527836bf5a3216000006/datasets?limit=1&after_name=count-purchases-by-country-daily',
};

export const lastDatasetsPage = { datasets: [dataset] };

export const datasetResult = {
	result: [
		{ timeframe: { start: '2026-11-01T00:00:00.000Z' }, value: 14 },
		{ timeframe: { start: '2026-11-02T00:00:00.000Z' }, value: 21 },
	],
};

/** The 401 body Keen sends for a bad key, which echoes the key it rejected. */
export const invalidKey = (key: string) => ({
	message: `Specified API Key is invalid. API Key: '${key}'.`,
	error_code: 'InvalidApiKeyError',
});

/** An unknown project answers this rather than a 401. */
export const resourceNotFound = {
	message: 'Resource not found.',
	error_code: 'ResourceNotFoundError',
};

/** A malformed analysis. */
export const badRequest = {
	message: 'The property does not exist in this collection.',
	error_code: 'PropertyDoesNotExistError',
};

/** A key without the permission for this call. */
export const forbidden = {
	message: 'The API Key used does not permit this operation.',
	error_code: 'ForbiddenError',
};

/** A query that ran past the five minute ceiling. */
export const queryIncomplete = {
	message:
		'Your query did not finish in 300 seconds. Most likely something is wrong on our side. Please let us know at team@keen.io.',
	error_code: 'QueryIncompleteError',
};

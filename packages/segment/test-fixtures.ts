// Shapes the live API sent, from the spec examples (docs.segmentapis.com
// bundle, v74.1.0). Extra keys are kept: the output schemas are `.loose()`
// and Segment ships more fields than any one page documents.

export const WORKSPACE = {
	id: '9aQ1Lj62S4bomZKLF4DPqW',
	name: 'papi e2e',
	slug: 'papi-e2e',
};

export const workspaceEnvelope = { data: { workspace: WORKSPACE } };

export const METADATA = {
	id: 'dZeHygTSD4',
	slug: 'swift',
	name: 'Apple',
	categories: ['Mobile'],
	description:
		'The hassle-free way to add Segment analytics to your swift app (iOS, macOS, tvOS).',
	logos: {
		default: 'https://cdn.filepicker.io/api/file/qWgSP5cpS7eeW2voq13u',
		alt: 'https://cdn.filepicker.io/api/file/qWgSP5cpS7eeW2voq13u',
		mark: 'https://cdn.filepicker.io/api/file/CoPDNKCgSlyYVeQow6JW',
	},
	options: [],
	isCloudEventSource: false,
};

export const SOURCE = {
	id: 'qQEHquLrjRDN9j1ByrChyn',
	slug: 'swift',
	name: '',
	workspaceId: '9aQ1Lj62S4bomZKLF4DPqW',
	enabled: true,
	writeKeys: ['bEj5MzDqCkHYRqreZgbPuH'],
	metadata: METADATA,
	settings: {},
	labels: [],
};

export const sourceEnvelope = {
	data: { source: SOURCE, trackingPlanId: null },
};

export const PAGINATION = { current: 'MA==', totalEntries: 2 };

export const paginated = <T>(items: T[], key: string) => ({
	data: { [key]: items, pagination: PAGINATION },
});

export const DESTINATION = {
	id: 'rh5BDZp6QDHvXFCkibm1pR',
	name: 'Webhook',
	enabled: true,
	metadata: {
		id: '5gPpjD6ikn',
		name: 'Webhook',
		slug: 'webhook',
	},
	sourceId: 'qQEHquLrjRDN9j1ByrChyn',
	settings: {},
};

export const WAREHOUSE = {
	id: 'kjU72LCJexvrqL7G4TMHHN',
	workspaceId: '9aQ1Lj62S4bomZKLF4DPqW',
	enabled: true,
	metadata: {
		id: '55d3d3aea3c',
		slug: 'postgres',
		name: 'Postgres',
		description: 'Open source data warehouse',
		logos: {
			default: 'https://d3hotuclm6if1r.cloudfront.net/logos/postgres-default.svg',
			mark: '',
			alt: '',
		},
		options: [{ name: 'port', required: true, type: 'string' }],
	},
	settings: {
		database: 'analytics',
		host: 'db.example.com',
		port: 5432,
		username: 'loader',
	},
};

export const TRACKING_PLAN = {
	id: 'tp_sprout_rVGCC6WdrNxjCf6JpCHP',
	name: 'New TP',
	resourceSchemaId: 'rs_1yVwS3zy60dONy9UhCyDqMmVvAE',
	slug: '',
	description: '',
	type: 'LIVE',
	updatedAt: '2006-01-02T15:04:05.000Z',
	createdAt: '2006-01-02T15:04:05.000Z',
};

export const RULE = {
	id: 'rh5BDZp6QDHvXFCkibm1pR',
	type: 'TRACK',
	key: 'Order Completed',
	name: 'Order Completed',
	description: 'A completed order',
	version: 1,
	jsonSchema: { type: 'object' },
};

export const FUNCTION_ITEM = {
	id: 'sfnc_wXzcDGFR3KmjLDrtSawNHf',
	resourceType: 'SOURCE',
	createdAt: '2006-01-02T15:04:05.000Z',
	createdBy: 'sgJDWk3K21k6LE3tLU9nRK',
	displayName: 'PAPI Source Function',
	description: 'My source function',
	logoUrl: 'https://placekitten.com/200/139',
	catalogId: 'wXzcDGFR3KmjLDrtSawNHf',
};

export const FUNCTION = {
	...FUNCTION_ITEM,
	workspaceId: '9aQ1Lj62S4bomZKLF4DPqW',
	code: '// source function',
	deployedAt: null,
	settings: [
		{
			name: 'apiKey',
			label: 'api key',
			description: 'api key',
			type: 'STRING',
			required: false,
			sensitive: false,
		},
	],
	buildpack: '',
	previewWebhookUrl: '',
	batchMaxCount: 0,
	isLatestVersion: true,
};

export const VERSION = {
	id: '2Ma03fahSqLoEzQfV5o2aSfVEHs',
	author: 'sgJDWk3K21k6LE3tLU9nRK',
	code: '// source function',
	isDeployed: true,
	createdAt: '2006-01-02T15:04:05.000Z',
	updatedAt: '2006-01-02T15:04:05.000Z',
	deployedAt: '2006-01-02T15:04:05.000Z',
};

export const REGULATION_ENTRY = {
	id: '1qJkfE1tpwvQcklImGksLN629wn',
	subjectType: 'USER_ID',
	subjects: ['user_123'],
	status: 'RUNNING',
	createdAt: '2006-01-02T15:04:05.000Z',
	regulationType: 'DELETE_ONLY',
};

export const REGULATION = {
	id: '1qJkfE1tpwvQcklImGksLN629wn',
	workspaceId: '9aQ1Lj62S4bomZKLF4DPqW',
	overallStatus: 'RUNNING',
	createdAt: '2006-01-02T15:04:05.000Z',
	finishedAt: null,
	streamStatus: [
		{
			sourceId: 'qQEHquLrjRDN9j1ByrChyn',
			collection: 'users',
			status: 'PENDING',
		},
	],
};

export const SOURCE_METADATA = {
	id: 'dZeHygTSD4',
	slug: 'swift',
	name: 'Apple',
};

export const DESTINATION_METADATA = {
	id: '5gPpjD6ikn',
	name: 'Webhook',
	slug: 'webhook',
};

export const errorBody = (
	type: string,
	message: string,
	field?: string,
) => ({
	errors: field ? [{ type, message, field }] : [{ type, message }],
});

/** 403: an invalid token. Segment answers this before routing, on any path. */
export const forbiddenBody = errorBody(
	'forbidden',
	'Not authorized to perform this operation',
);

/** 401: a missing Authorization header. */
export const unauthorizedBody = errorBody(
	'unauthorized',
	'Authorization header is required',
);

/** 429 with a body ms value (per-endpoint limit; token-level has a header). */
export const rateLimitedBody = {
	errors: [{ type: 'RateLimited', message: 'Rate limit exceeded' }],
	data: {
		msBeforeNext: 2500,
		remainingPoints: 0,
		consumedPoints: 10,
	},
};

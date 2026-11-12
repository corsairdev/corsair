/**
 * Response bodies for the tests, from the Platform API OpenAPI document
 * (https://docs.roboflow.com/reference/platform/rest-api/platform-api-openapi), the
 * Serverless API spec, and the live refusals captured from both hosts.
 */

/** The root answer for a valid key. */
export const AUTHENTICATED = {
	welcome: 'Welcome to the Roboflow API.',
	instructions: 'You are successfully authenticated.',
	docs: 'https://docs.roboflow.com',
	workspace: 'my-workspace',
	workspaceId: 'Xy7AbCdEfGhIjKlMnOpQ',
};

/**
 * The root answer with no key at all, captured live: still a 200, with the welcome
 * text but no `workspace`.
 */
export const UNATTENDED = {
	welcome: 'Welcome to the Roboflow API.',
	instructions:
		'Retrieve your API Key from your workspace settings and pass it as `api_key` in the request body or query parameters, or through an `Authorization: Bearer <api_key>` header.',
	docs: 'https://docs.roboflow.com',
};

export const PROJECT_SUMMARY = {
	id: 'roboflow/chess-sample-4ckfl',
	type: 'object-detection',
	name: 'Chess Sample',
	created: 1630335544.592,
	updated: 1630335741.988,
	images: 12,
	unannotated: 3,
	annotation: 'pieces',
	versions: 3,
	public: false,
	multilabel: false,
	license: 'Private',
	splits: { train: 9, valid: 2, test: 1 },
	colors: { 'white-king': '#C7FC00', 'black-king': '#8622FF' },
	classes: { 'white-king': 8, 'black-king': 8 },
	preprocessing: { 'auto-orient': { enabled: true } },
	augmentation: {},
};

export const WORKSPACE = {
	workspace: {
		name: 'Roboflow',
		url: 'roboflow',
		members: 7,
		projects: [PROJECT_SUMMARY],
	},
};

export const VERSION_SUMMARY = {
	id: 'roboflow/chess-sample-4ckfl/3',
	name: 'v3',
	created: 1630335741.988,
	images: 12,
	splits: { train: 9, valid: 2, test: 1 },
	generating: false,
	progress: 1,
};

export const PROJECT = {
	workspace: { name: 'Roboflow', url: 'roboflow', members: 7 },
	project: PROJECT_SUMMARY,
	versions: [VERSION_SUMMARY],
};

export const VERSION = {
	workspace: { name: 'Roboflow', url: 'roboflow' },
	project: PROJECT_SUMMARY,
	version: {
		...VERSION_SUMMARY,
		preprocessing: { 'auto-orient': { enabled: true } },
		augmentation: {},
	},
};

export const PROJECT_CREATED = {
	id: 'roboflow/sharks-dataset-abc12',
	name: 'Sharks Dataset',
	type: 'object-detection',
};

export const MODELS = [
	{
		url: 'chess-sample-4ckfl/3',
		version: '3',
		train: { status: 'finished' },
		taskType: 'object-detection',
		modelType: 'rfdetr-base',
		name: 'Chess Sample v3',
		created: '2023-02-16T01:11:11.586Z',
		metrics: {
			map50: 92.4,
			map5095: 78.1,
			precision: 91.2,
			recall: 88.7,
			f1: 89.9,
		},
	},
	{
		url: 'chess-sample-4ckfl/2',
		train: { status: 'failed' },
		taskType: 'object-detection',
		modelType: 'yolov8s',
		name: 'Chess Sample v2',
	},
];

export const IMAGE_UPLOADED = { success: true, id: 'YbNIgavTIk2xOOmJsHv5' };

// A duplicate is a success: no new image, and id names the existing one.
export const IMAGE_DUPLICATE = {
	success: false,
	duplicate: true,
	id: 'YbNIgavTIk2xOOmJsHv5',
};

export const INFERENCE = {
	image: { width: 640, height: 480 },
	predictions: [
		{
			x: 320,
			y: 240,
			width: 100,
			height: 120,
			confidence: 0.92,
			class: 'white-king',
			class_id: 0,
			detection_id: 'abc',
		},
		{
			x: 100,
			y: 100,
			width: 80,
			height: 80,
			confidence: 0.71,
			class: 'black-king',
			class_id: 1,
		},
	],
	time: 0.12,
};

export const INFERENCE_CLASSIFICATION = {
	image: { width: 224, height: 224 },
	predictions: [{ class: 'cat', confidence: 0.98, class_id: 0 }],
	time: 0.05,
};

// Live, on the management host with a bad key.
export const BAD_KEY = {
	error: {
		message: 'This API key does not exist (or has been revoked).',
		status: 401,
		type: 'OAuthException',
		hint: 'You may retrieve your API key via the Roboflow Dashboard. Go to Account > Roboflow Keys to retrieve yours.',
	},
};

// Live, on the inference host with no key at all.
export const INFERENCE_UNAUTHORIZED = {
	status: 401,
	message: 'Unauthorized api_key',
};

export const NOT_FOUND = {
	error: { message: 'Project not found', status: 404, type: 'NotFound' },
};

export const BAD_REQUEST = {
	error: { message: 'Invalid project type', status: 400, type: 'BadRequest' },
};

export const SERVER_ERROR = {
	error: { message: 'Internal server error', status: 500 },
};

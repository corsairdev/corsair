/**
 * Fixtures for the SwaggerHub shapes.
 *
 * Bodies come from the registry's own OpenAPI document at
 * https://api.swaggerhub.com/openapi.json. Two details there matter for the
 * tests: every listing is either an APIs.json object with an `apis` array or a
 * `Page` with an `items` array, and a few routes answer a **bare array**.
 */

/** The smallest definition that the save and compare routes take as a body. */
export const definition = `openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths: {}
`;

export const apiProperty = {
	type: 'Swagger',
	url: 'https://api.swaggerhub.com/apis/admin/example/1.0.0',
};

export const apiEntry = {
	name: 'example',
	description: 'An example API',
	summary: 'An example',
	tags: ['example'],
	properties: [apiProperty],
};

export const apisJson = {
	name: 'admin',
	description: 'APIs for admin',
	url: 'https://api.swaggerhub.com/apis/admin',
	created: '2024-01-01T00:00:00.000+0000',
	modified: '2024-01-02T00:00:00.000+0000',
	specificationVersion: '3.0.0',
	defaultVersion: '1.0.0',
	offset: 0,
	totalCount: 1,
	blocked: false,
	apis: [apiEntry],
};

export const specItem = {
	type: 'API',
	owner: 'admin',
	name: 'example',
	version: '1.0.0',
	title: 'An example API',
	visibility: 'PUBLIC',
	state: 'PUBLISHED',
	specification: 'OpenAPI',
	created: '2024-01-01T00:00:00.000+0000',
	modified: '2024-01-02T00:00:00.000+0000',
	defaultVersion: true,
};

export const specsPage = {
	offset: 0,
	totalCount: 1,
	items: [specItem],
};

export const validationResult = {
	valid: false,
	recognized: true,
	spec: {
		namespace: 'openapi',
		version: '3.0.0',
		format: 'yaml',
		mediaType: 'application/yaml',
	},
	summary: { errors: 1, warnings: 0, total: 1, durationMs: 12 },
	findings: [
		{
			severity: 'error',
			message: "must have required property 'paths'",
			path: '#/',
			range: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 2, offset: 1 },
			},
		},
	],
};

export const comment = {
	id: 'c1',
	user: { id: 'u1', email: 'admin@example.com', name: 'Admin' },
	created: '2024-01-01T00:00:00.000+0000',
	body: 'This operation needs a summary',
};

export const closableComment = {
	...comment,
	status: 'OPEN',
	replies: [],
	range: {
		startLine: 1,
		startColumn: 1,
		startOffset: 0,
		endLine: 1,
		endColumn: 2,
		endOffset: 1,
	},
};

export const capabilities = { canViewStandardizationErrors: true };

export const lifecycle = { published: false };

export const visibility = { private: false };

export const project = {
	owner: 'admin',
	name: 'API Project',
	description: 'Project description',
	apis: ['example'],
	domains: [],
	templates: [],
};

export const projectsJson = {
	offset: 0,
	totalCount: 1,
	projects: [project],
};

export const templateWrapper = {
	id: 'template-1',
	title: 'A template',
	specification: 'OpenAPI',
	builtIn: false,
	defaultVersion: '1.0.0',
};

export const integration = {
	id: 'i1',
	name: 'GitHub',
	pluginIdentifier: 'github',
	enabled: true,
};

export const comparison = [
	{ description: 'Added GET /pets', breaking: false },
	{ description: 'Removed POST /pets', breaking: true },
];

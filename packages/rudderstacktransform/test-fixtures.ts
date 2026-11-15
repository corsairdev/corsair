/**
 * Response bodies for the tests, transcribed from the examples in
 * https://www.rudderstack.com/docs/api/transformation-api/ and the live refusals
 * captured from https://api.rudderstack.com and https://api.eu.rudderstack.com.
 */

/** A transformation as the create, get, update and connect routes return it. */
export const TRANSFORMATION = {
	id: '2LnbcGgKON5BbHHuyYVesZ24uqu',
	versionId: '2LnbcImcBqOTkm4FFVCpIakptZJ',
	name: 'Get metadata',
	description: 'Gets the metadata for an event',
	code: 'export function transformEvent(message, metadata) { const met = metadata(message); return met; }',
	codeVersion: '1',
	language: 'javascript',
	createdAt: '2023-02-16T01:11:11.586Z',
	updatedAt: '2023-02-16T01:11:11.586Z',
};

export const TRANSFORMATION_CONNECTED = {
	...TRANSFORMATION,
	name: 'Cool transformation',
	description: 'A test description',
	code: 'export function transformEvent(event) { return event; }',
	destinations: [
		{
			id: '2C8YtptB4KF2eL3KRi9mCFkY3BF',
			name: 'My destination',
			enabled: true,
		},
	],
};

export const TRANSFORMATIONS = {
	transformations: [
		{
			id: 'sedrftg',
			versionId: 'edrtv',
			name: 'new Transformations-2',
			description: '',
			code: 'export function transformEvent(event) { return event; }',
			codeVersion: '1',
			language: 'javascript',
			createdAt: '2021-03-04T04:48:27.288Z',
			updatedAt: '2021-03-04T04:48:27.288Z',
			destinations: [],
		},
		{
			id: 'xcgvhcfdx',
			versionId: 'dtvbyutbvc',
			name: 'Update Transformations and Publish',
			description: '',
			code: 'function transformEvent(event) { return event; } ',
			codeVersion: '1',
			language: 'javascript',
			createdAt: '2021-03-04T10:07:25.513Z',
			updatedAt: '2021-03-04T10:07:25.513Z',
			destinations: [],
		},
	],
};

// The container key is capitalised on this route alone.
export const TRANSFORMATION_VERSIONS = {
	TransformationVersions: [
		{
			id: '1pIYoILGZTNYZP4YYkeyNIKlitl',
			versionId: '1pIYoLfEzcMK3D3M1ihjqI02wnx',
			name: 'Update Transformations and Publish',
			description: '',
			code: 'export function transformEvent(event) { return event; }\n',
			codeVersion: '1',
			language: 'javascript',
			createdAt: '2021-03-04T10:07:24.562Z',
			updatedAt: '2021-03-04T10:07:24.562Z',
		},
		{
			id: '1pIYoILGZTNYZP4YYkeyNIKlitl',
			versionId: '1pIhxFXd7NR7XDA914rLAn5f7wq',
			name: 'Update Transformations and Publish',
			description: 'Hey I am updated again',
			code: 'export default function cube(x) { return x * x * x ; }',
			codeVersion: '1',
			language: 'javascript',
			createdAt: '2021-03-04T11:22:36.102Z',
			updatedAt: '2021-03-08T04:22:42.646Z',
		},
	],
};

export const LIBRARY = {
	id: '2M1HnI40CGbHb4FxjjRBj1aFRZK',
	versionId: '2M1HnJoHwL4zXE91pEwZaAHQp8F',
	name: 'cool library',
	description: 'cool description',
	code: 'export function add(a,b) {return a+b; } export function sub(a,b) {return a-b; }',
	language: 'javascript',
	createdAt: '2023-02-20T21:25:33.380Z',
	updatedAt: '2023-02-20T21:25:33.380Z',
	importName: 'coolLibrary',
};

export const LIBRARIES = {
	libraries: [
		{
			id: '1pHx15j5rXvmmQUIMBaQdIyrpr2',
			versionId: '1pHxdlGL8IyoP7WfvRil4Qs88cp',
			name: 'Get Cube',
			description: 'First Library using apiCall',
			code: 'export default function cube(x) { return x * x ; }',
			language: 'javascript',
			createdAt: '2021-03-04T05:01:46.985Z',
			updatedAt: '2021-03-04T05:01:47.141Z',
			importName: 'getCube',
		},
		{
			id: '1pT7933tHRBPlEMIZt5Zi3VIht1',
			versionId: '1pT793mcqQkcyHdqwXkxHmtgMMg',
			name: 'User Defined Library',
			description: 'Get User context',
			code: '    export default function cube(x) { return x * x * x; }',
			language: 'javascript',
			createdAt: '2021-03-08T03:47:51.512Z',
			updatedAt: '2021-03-08T03:47:51.512Z',
			importName: 'userDefinedLibrary',
		},
	],
};

/** Revision rows carry `isPublished`; the published one is true. */
export const LIBRARY_VERSIONS = {
	libraryVersions: [
		{
			id: '1pT7933tHRBPlEMIZt5Zi3VIht1',
			versionId: '1pT793mcqQkcyHdqwXkxHmtgMMg',
			name: 'userDefinedLibrary',
			description: 'Get User context',
			code: 'export default function cube(x) { return x * x * x; }',
			language: 'javascript',
			createdAt: '2021-03-08T03:47:51.686Z',
			updatedAt: '2021-03-08T03:47:51.686Z',
			isPublished: false,
		},
		{
			id: '1pT7933tHRBPlEMIZt5Zi3VIht1',
			versionId: '1pT8KDAD66mQxnaUQxJpNs9qLFn',
			name: 'userDefinedLibrary',
			description: 'Get Divisible by 2',
			code: 'export default function cube(x) { return 2 * x; }',
			language: 'javascript',
			createdAt: '2021-03-08T03:57:33.738Z',
			updatedAt: '2021-03-08T03:57:33.738Z',
			isPublished: true,
		},
	],
};

/**
 * What `GET /libraries/{id}/versions` actually answered live on 11-12: the rows
 * sit under `libraries`, not the documented `libraryVersions`, and carry no
 * `isPublished`.
 */
export const LIBRARY_VERSIONS_LIVE = {
	libraries: [
		{
			id: '3LzaHTAfowdyqKeb8ZxMrWUXQMd',
			versionId: '3LzaHQewLTaIJxAd2cuYLaScuAs',
			name: 'corsair-plugin-test',
			description: 'corsair plugin live test',
			code: 'export function corsairPluginTest(value) {\n  return value;\n}',
			language: 'javascript',
			handleName: 'corsairPluginTest',
			createdAt: '2026-11-12T04:54:21.101Z',
			updatedAt: '2026-11-12T04:54:21.101Z',
			importName: 'corsairPluginTest',
			externalId: null,
		},
	],
};

export const PUBLISHED = { published: true };

// Live against api.rudderstack.com with an unrecognised bearer token.
export const INVALID_TOKEN = { message: 'Invalid Access Token' };

// Live against api.rudderstack.com with no Authorization header at all.
export const UNAUTHORISED = { message: 'Unauthorised' };

// Documented: connecting a transformation that was never published.
export const NOT_PUBLISHED = { message: 'Transformation is not published' };

// Documented for the Publish API when the code fails its server-side test run.
export const PUBLISH_TEST_FAILED = {
	message: 'Publish failed: transformation code threw an exception',
};

export const NOT_FOUND = { message: 'Transformation not found' };

export const FORBIDDEN = {
	message: 'You do not have permission to perform this action',
};

export const RATE_LIMITED = { message: 'Too many requests' };

export const SERVER_ERROR = { message: 'Internal server error' };

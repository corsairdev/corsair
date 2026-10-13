import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { celigo } from './index';

const mockRequest = jest.fn<
	Promise<Json | undefined>,
	[OpenAPIConfig, ApiRequestOptions]
>();
const mockLogEvent = jest.fn<Promise<void>, never[]>(async () => undefined);

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: [OpenAPIConfig, ApiRequestOptions]) =>
		mockRequest(...args),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: (...args: never[]) => mockLogEvent(...args),
}));

const plugin = celigo({ key: 'test-api-key' });

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

const entityNames = Object.keys(plugin.schema?.entities ?? {});

const tables = Object.fromEntries(
	entityNames.map((name) => [
		name,
		{ upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	]),
);

type TestContext = {
	key: string;
	options: { region?: 'us' | 'eu' | 'au' | 'ca' };
	db: typeof tables;
};

function ctx(region?: 'us' | 'eu' | 'au' | 'ca'): TestContext {
	return { key: 'test-api-key', options: { region }, db: tables };
}

type Endpoint = (ctx: TestContext, input: JsonObject) => Promise<Json>;

function endpoint(path: string): Endpoint {
	const [group = '', name = ''] = path.split('.');
	const fn = Reflect.get(
		Reflect.get(plugin.endpoints ?? {}, group) ?? {},
		name,
	);
	if (typeof fn !== 'function') throw new Error(`no endpoint ${path}`);
	return (c, input) => fn(c, input);
}

function errorContext(error: Error) {
	return {
		pluginId: 'celigo',
		operation: 'flows.list',
		input: {},
		originalError: error,
	};
}

function sentRequest() {
	const call = mockRequest.mock.calls[0];
	if (!call) throw new Error('Celigo was not called');
	return { config: call[0], options: call[1] };
}

type Case = {
	path: string;
	input: JsonObject;
	response: Json | undefined;
	method: string;
	url: string;
	query?: JsonObject;
	body?: Json;
	result: Json;
};

// One row per endpoint: the request Celigo should receive and the value the
// caller should get back for a canned response.
const cases: Case[] = [
	{
		path: 'account.getTokenInfo',
		input: {},
		response: { _userId: 'u1' },
		method: 'GET',
		url: 'tokenInfo',
		result: { _userId: 'u1' },
	},
	{
		path: 'account.listLicenses',
		input: { type: 'io' },
		response: [{ _id: 'l1', type: 'integrator' }],
		method: 'GET',
		url: 'licenses',
		query: { type: 'io' },
		result: [{ _id: 'l1', type: 'integrator' }],
	},
	{
		path: 'audit.list',
		input: { resourceType: 'flow', limit: 10 },
		response: [{ _id: 'a1', resourceType: 'flow', source: 'api' }],
		method: 'GET',
		url: 'audit',
		query: { resourceType: 'flow', limit: 10 },
		result: [{ _id: 'a1', resourceType: 'flow', source: 'api' }],
	},
	{
		path: 'connections.list',
		input: { limit: 5 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'connections',
		query: { limit: 5 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'connections.get',
		input: { id: 'c1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'connections/c1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'connections.create',
		input: { name: 'Shop', type: 'http', http: { baseURI: 'https://x.test' } },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'connections',
		body: { name: 'Shop', type: 'http', http: { baseURI: 'https://x.test' } },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'connections.update',
		input: { id: 'c1', name: 'Shop', type: 'http' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'connections/c1',
		body: { name: 'Shop', type: 'http' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'connections.patch',
		input: {
			id: 'c1',
			operations: [{ op: 'replace', path: '/name', value: 'New' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'connections/c1',
		body: [{ op: 'replace', path: '/name', value: 'New' }],
		result: { success: true },
	},
	{
		path: 'connections.delete',
		input: { id: 'c1' },
		response: undefined,
		method: 'DELETE',
		url: 'connections/c1',
		result: { success: true },
	},
	{
		path: 'connections.ping',
		input: { id: 'c1' },
		response: { code: 200 },
		method: 'GET',
		url: 'connections/c1/ping',
		result: { code: 200 },
	},
	{
		path: 'connections.testVirtual',
		input: { name: 'Probe', type: 'http' },
		response: { code: 200 },
		method: 'POST',
		url: 'connections/ping',
		body: { name: 'Probe', type: 'http' },
		result: { code: 200 },
	},
	{
		path: 'connections.getDebugLogs',
		input: { id: 'c1' },
		response: 'GET /ping 200',
		method: 'GET',
		url: 'connections/c1/debug',
		result: { logs: 'GET /ping 200' },
	},
	{
		path: 'connections.getDependencies',
		input: { id: 'c1' },
		response: { flows: [{ id: 'f1', name: 'Sync' }] },
		method: 'GET',
		url: 'connections/c1/dependencies',
		result: { flows: [{ id: 'f1', name: 'Sync' }] },
	},
	{
		path: 'connections.getAudit',
		input: { id: 'c1', action: 'update' },
		response: [{ _id: 'a1', resourceType: 'connection', source: 'ui' }],
		method: 'GET',
		url: 'connections/c1/audit',
		query: { action: 'update' },
		result: [{ _id: 'a1', resourceType: 'connection', source: 'ui' }],
	},
	{
		path: 'connections.executeVirtualExport',
		input: { id: 'c1', export: { http: { relativeURI: '/orders' } } },
		response: { data: [{ id: 1 }], dataURIs: [null] },
		method: 'POST',
		url: 'connections/c1/export',
		body: { export: { http: { relativeURI: '/orders' } } },
		result: { data: [{ id: 1 }], dataURIs: [null] },
	},
	{
		path: 'connections.executeVirtualExportPaged',
		input: {
			id: 'c1',
			export: { pageSize: 5 },
			pagedExportState: { pageIndex: 2 },
		},
		response: {
			data: [{ id: 1 }],
			pagedExportState: { pageIndex: 3, done: false },
		},
		method: 'POST',
		url: 'connections/c1/export/pages',
		body: { export: { pageSize: 5 }, pagedExportState: { pageIndex: 2 } },
		result: {
			data: [{ id: 1 }],
			pagedExportState: { pageIndex: 3, done: false },
		},
	},
	{
		path: 'connections.executeVirtualImport',
		input: {
			id: 'c1',
			import: { http: { method: ['POST'] } },
			data: [{ a: 1 }],
		},
		response: [{ statusCode: 200, id: 'r1' }],
		method: 'POST',
		url: 'connections/c1/import',
		body: { import: { http: { method: ['POST'] } }, data: [{ a: 1 }] },
		result: [{ statusCode: 200, id: 'r1' }],
	},
	{
		path: 'connections.evaluateVirtualImportMap',
		input: { id: 'c1', import: { mapping: { fields: [] } }, data: [{ a: 1 }] },
		response: [{ b: 1 }],
		method: 'POST',
		url: 'connections/c1/import/map',
		body: { import: { mapping: { fields: [] } }, data: [{ a: 1 }] },
		result: [{ b: 1 }],
	},
	{
		path: 'ediProfiles.list',
		input: {},
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'ediprofiles',
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'errors.list',
		input: { id: 'f1', stepId: 'e1', tags: ['t1'] },
		response: { errors: [{ errorId: 'x1', message: 'bad' }] },
		method: 'GET',
		url: 'flows/f1/e1/errors',
		query: { tags: ['t1'] },
		result: { errors: [{ errorId: 'x1', message: 'bad' }] },
	},
	{
		path: 'errors.listResolved',
		input: { id: 'f1', stepId: 'e1' },
		response: { resolved: [{ errorId: 'x1' }] },
		method: 'GET',
		url: 'flows/f1/e1/resolved',
		result: { resolved: [{ errorId: 'x1' }] },
	},
	{
		path: 'errors.resolve',
		input: { id: 'f1', stepId: 'e1', errors: ['x1'] },
		response: undefined,
		method: 'PUT',
		url: 'flows/f1/e1/resolved',
		body: { errors: ['x1'] },
		result: { success: true },
	},
	{
		path: 'errors.deleteResolved',
		input: { id: 'f1', stepId: 'e1', selectAll: true },
		response: undefined,
		method: 'DELETE',
		url: 'flows/f1/e1/resolved',
		body: { selectAll: true },
		result: { success: true },
	},
	{
		path: 'errors.retry',
		input: { id: 'f1', stepId: 'e1', retryDataKeys: ['k1'] },
		response: { retryErrorCount: 1 },
		method: 'POST',
		url: 'flows/f1/e1/retry',
		body: { retryDataKeys: ['k1'] },
		result: { retryErrorCount: 1 },
	},
	{
		path: 'errors.assign',
		input: { id: 'f1', stepId: 'e1', errorIds: ['x1'], email: 'a@b.test' },
		response: { errorsToReturn: [] },
		method: 'PUT',
		url: 'flows/f1/e1/errors/assign',
		body: { errorIds: ['x1'], email: 'a@b.test' },
		result: { errorsToReturn: [] },
	},
	{
		path: 'errors.updateTags',
		input: { id: 'f1', stepId: 'e1', errors: [{ id: 'x1' }], tagIds: ['t1'] },
		response: { errorsToReturn: { errors: [], resolved: [] } },
		method: 'PUT',
		url: 'flows/f1/e1/tags',
		body: { errors: [{ id: 'x1' }], tagIds: ['t1'] },
		result: { errorsToReturn: { errors: [], resolved: [] } },
	},
	{
		path: 'exports.list',
		input: { limit: 2 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'exports',
		query: { limit: 2 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'exports.get',
		input: { id: 'r1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'exports/r1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'exports.create',
		input: { name: 'New' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'exports',
		body: { name: 'New' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'exports.update',
		input: { id: 'r1', name: 'Renamed' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'exports/r1',
		body: { name: 'Renamed' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'exports.patch',
		input: {
			id: 'r1',
			operations: [{ op: 'replace', path: '/name', value: 'N' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'exports/r1',
		body: [{ op: 'replace', path: '/name', value: 'N' }],
		result: { success: true },
	},
	{
		path: 'exports.delete',
		input: { id: 'r1' },
		response: undefined,
		method: 'DELETE',
		url: 'exports/r1',
		result: { success: true },
	},
	{
		path: 'exports.clone',
		input: { id: 'r1', name: 'Copy' },
		response: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
		method: 'POST',
		url: 'exports/r1/clone',
		body: { name: 'Copy' },
		result: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
	},
	{
		path: 'exports.getAudit',
		input: { id: 'r1', limit: 1 },
		response: [{ _id: 'a1', source: 'api' }],
		method: 'GET',
		url: 'exports/r1/audit',
		query: { limit: 1 },
		result: [{ _id: 'a1', source: 'api' }],
	},
	{
		path: 'imports.list',
		input: { externalId: 'x' },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'imports',
		query: { externalId: 'x' },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'imports.get',
		input: { id: 'r1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'imports/r1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'imports.create',
		input: { name: 'New' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'imports',
		body: { name: 'New' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'imports.update',
		input: { id: 'r1', name: 'Renamed' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'imports/r1',
		body: { name: 'Renamed' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'imports.patch',
		input: {
			id: 'r1',
			operations: [{ op: 'replace', path: '/name', value: 'N' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'imports/r1',
		body: [{ op: 'replace', path: '/name', value: 'N' }],
		result: { success: true },
	},
	{
		path: 'imports.delete',
		input: { id: 'r1' },
		response: undefined,
		method: 'DELETE',
		url: 'imports/r1',
		result: { success: true },
	},
	{
		path: 'imports.clone',
		input: { id: 'r1', name: 'Copy' },
		response: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
		method: 'POST',
		url: 'imports/r1/clone',
		body: { name: 'Copy' },
		result: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
	},
	{
		path: 'imports.getAudit',
		input: { id: 'r1', limit: 1 },
		response: [{ _id: 'a1', source: 'api' }],
		method: 'GET',
		url: 'imports/r1/audit',
		query: { limit: 1 },
		result: [{ _id: 'a1', source: 'api' }],
	},
	{
		path: 'imports.getDependencies',
		input: { id: 'r1' },
		response: { flows: [] },
		method: 'GET',
		url: 'imports/r1/dependencies',
		result: { flows: [] },
	},
	{
		path: 'imports.invoke',
		input: { id: 'r1', data: [{ a: 1 }] },
		response: [{ statusCode: 200 }],
		method: 'POST',
		url: 'imports/r1/invoke',
		body: { data: [{ a: 1 }] },
		result: [{ statusCode: 200 }],
	},
	{
		path: 'flows.list',
		input: { limit: 2 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'flows',
		query: { limit: 2 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'flows.get',
		input: { id: 'r1', mergeInstance: true },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'flows/r1',
		query: { mergeInstance: true },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'flows.create',
		input: { name: 'New' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'flows',
		body: { name: 'New' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'flows.update',
		input: { id: 'r1', name: 'Renamed' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'flows/r1',
		body: { name: 'Renamed' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'flows.patch',
		input: {
			id: 'r1',
			operations: [{ op: 'replace', path: '/name', value: 'N' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'flows/r1',
		body: [{ op: 'replace', path: '/name', value: 'N' }],
		result: { success: true },
	},
	{
		path: 'flows.delete',
		input: { id: 'r1' },
		response: undefined,
		method: 'DELETE',
		url: 'flows/r1',
		result: { success: true },
	},
	{
		path: 'flows.clone',
		input: { id: 'r1', _integrationId: 'i1' },
		response: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
		method: 'POST',
		url: 'flows/r1/clone',
		body: { _integrationId: 'i1' },
		result: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
	},
	{
		path: 'flows.getAudit',
		input: { id: 'r1', limit: 1 },
		response: [{ _id: 'a1', source: 'api' }],
		method: 'GET',
		url: 'flows/r1/audit',
		query: { limit: 1 },
		result: [{ _id: 'a1', source: 'api' }],
	},
	{
		path: 'flows.getDependencies',
		input: { id: 'r1' },
		response: { flows: [] },
		method: 'GET',
		url: 'flows/r1/dependencies',
		result: { flows: [] },
	},
	{
		path: 'flows.getDescendants',
		input: { id: 'r1' },
		response: { exports: [{ _id: 'e1' }], imports: [] },
		method: 'GET',
		url: 'flows/r1/descendants',
		result: { exports: [{ _id: 'e1' }], imports: [] },
	},
	{
		path: 'flows.getLastExportDateTime',
		input: { id: 'r1' },
		response: { lastExportDateTime: '2026-01-01T00:00:00.000Z' },
		method: 'GET',
		url: 'flows/r1/lastExportDateTime',
		result: { lastExportDateTime: '2026-01-01T00:00:00.000Z' },
	},
	{
		path: 'flows.getLatestJobs',
		input: { id: 'r1', include: 'status' },
		response: [{ _id: 'j1', status: 'completed' }],
		method: 'GET',
		url: 'flows/r1/jobs/latest',
		query: { include: 'status' },
		result: [{ _id: 'j1', status: 'completed' }],
	},
	{
		path: 'flows.getTemplate',
		input: { id: 'r1' },
		response: { signedURL: 'https://s3.test/f.zip' },
		method: 'GET',
		url: 'flows/r1/template',
		result: { signedURL: 'https://s3.test/f.zip' },
	},
	{
		path: 'integrations.list',
		input: { limit: 2 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations',
		query: { limit: 2 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.get',
		input: { id: 'r1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'integrations/r1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'integrations.create',
		input: { name: 'New' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'integrations',
		body: { name: 'New' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'integrations.update',
		input: { id: 'r1', name: 'Renamed' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'integrations/r1',
		body: { name: 'Renamed' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'integrations.patch',
		input: {
			id: 'r1',
			operations: [{ op: 'replace', path: '/name', value: 'N' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'integrations/r1',
		body: [{ op: 'replace', path: '/name', value: 'N' }],
		result: { success: true },
	},
	{
		path: 'integrations.delete',
		input: { id: 'r1' },
		response: undefined,
		method: 'DELETE',
		url: 'integrations/r1',
		result: { success: true },
	},
	{
		path: 'integrations.clone',
		input: { id: 'r1', connectionMap: { c1: 'c2' } },
		response: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
		method: 'POST',
		url: 'integrations/r1/clone',
		body: { connectionMap: { c1: 'c2' } },
		result: [{ model: 'Flow', _id: 'n1', name: 'Copy' }],
	},
	{
		path: 'integrations.getAudit',
		input: { id: 'r1', limit: 1 },
		response: [{ _id: 'a1', source: 'api' }],
		method: 'GET',
		url: 'integrations/r1/audit',
		query: { limit: 1 },
		result: [{ _id: 'a1', source: 'api' }],
	},
	{
		path: 'integrations.getDependencies',
		input: { id: 'r1' },
		response: { flows: [] },
		method: 'GET',
		url: 'integrations/r1/dependencies',
		result: { flows: [] },
	},
	{
		path: 'integrations.listFlows',
		input: { id: 'i1', limit: 3 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations/i1/flows',
		query: { limit: 3 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.listExports',
		input: { id: 'i1', limit: 3 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations/i1/exports',
		query: { limit: 3 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.listImports',
		input: { id: 'i1', limit: 3 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations/i1/imports',
		query: { limit: 3 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.listConnections',
		input: { id: 'i1', limit: 3 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations/i1/connections',
		query: { limit: 3 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.listUsers',
		input: { id: 'i1' },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'integrations/i1/ashares',
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'integrations.listErrors',
		input: { id: 'i1' },
		response: [{ _flowId: 'f1', numError: 2 }],
		method: 'GET',
		url: 'integrations/i1/errors',
		result: [{ _flowId: 'f1', numError: 2 }],
	},
	{
		path: 'integrations.getTemplate',
		input: { id: 'i1' },
		response: { signedURL: 'https://s3.test/i.zip', key: 'k' },
		method: 'GET',
		url: 'integrations/i1/template',
		result: { signedURL: 'https://s3.test/i.zip', key: 'k' },
	},
	{
		path: 'integrations.createRevision',
		input: { id: 'i1', description: 'before release' },
		response: { _id: 'rv1', type: 'snapshot', status: 'completed' },
		method: 'POST',
		url: 'integrations/i1/revisions/create',
		body: { description: 'before release' },
		result: { _id: 'rv1', type: 'snapshot', status: 'completed' },
	},
	{
		path: 'integrations.registerConnection',
		input: { id: 'i1', connectionId: 'c1' },
		response: undefined,
		method: 'PUT',
		url: 'integrations/i1/connections/c1/register',
		result: { success: true },
	},
	{
		path: 'integrations.registerConnections',
		input: { id: 'i1', _connectionId: 'c1' },
		response: undefined,
		method: 'PUT',
		url: 'integrations/i1/connections/register',
		body: { _connectionId: 'c1' },
		result: { success: true },
	},
	{
		path: 'integrations.unregisterConnection',
		input: { id: 'i1', connectionId: 'c1' },
		response: undefined,
		method: 'DELETE',
		url: 'integrations/i1/connections/c1/register',
		result: { success: true },
	},
	{
		path: 'fileDefinitions.list',
		input: { limit: 2 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'filedefinitions',
		query: { limit: 2 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'fileDefinitions.get',
		input: { id: 'd1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'filedefinitions/d1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'fileDefinitions.create',
		input: { name: 'X12 850', format: 'delimited/x12' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'filedefinitions',
		body: { name: 'X12 850', format: 'delimited/x12' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'iClients.list',
		input: { limit: 2 },
		response: [{ _id: 'abc123', name: 'Thing' }],
		method: 'GET',
		url: 'iclients',
		query: { limit: 2 },
		result: [{ _id: 'abc123', name: 'Thing' }],
	},
	{
		path: 'iClients.get',
		input: { id: 'ic1' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'GET',
		url: 'iclients/ic1',
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'iClients.create',
		input: { name: 'App', provider: 'custom_oauth2' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'POST',
		url: 'iclients',
		body: { name: 'App', provider: 'custom_oauth2' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'iClients.update',
		input: { id: 'ic1', name: 'App' },
		response: { _id: 'abc123', name: 'Thing' },
		method: 'PUT',
		url: 'iclients/ic1',
		body: { name: 'App' },
		result: { _id: 'abc123', name: 'Thing' },
	},
	{
		path: 'iClients.patch',
		input: {
			id: 'ic1',
			operations: [{ op: 'replace', path: '/oauth2/failPath', value: 'error' }],
		},
		response: undefined,
		method: 'PATCH',
		url: 'iclients/ic1',
		body: [{ op: 'replace', path: '/oauth2/failPath', value: 'error' }],
		result: { success: true },
	},
	{
		path: 'iClients.delete',
		input: { id: 'ic1' },
		response: undefined,
		method: 'DELETE',
		url: 'iclients/ic1',
		result: { success: true },
	},
	{
		path: 'jobs.list',
		input: { _flowId: 'f1', status: 'failed' },
		response: [{ _id: 'j1', status: 'failed' }],
		method: 'GET',
		url: 'jobs',
		query: { _flowId: 'f1', status: 'failed' },
		result: [{ _id: 'j1', status: 'failed' }],
	},
	{
		path: 'jobs.getErrors',
		input: { id: 'j1' },
		response: [{ code: '422', message: 'missing field', _jobId: 'j1' }],
		method: 'GET',
		url: 'jobs/j1/joberrors',
		result: [{ code: '422', message: 'missing field', _jobId: 'j1' }],
	},
	{
		path: 'processors.parseCsv',
		input: { data: 'a,b\n1,2', rules: { hasHeaderRow: true } },
		response: { mediaType: 'json', data: [{ a: '1', b: '2' }] },
		method: 'POST',
		url: 'processors/csvParser',
		body: { data: 'a,b\n1,2', rules: { hasHeaderRow: true } },
		result: { mediaType: 'json', data: [{ a: '1', b: '2' }] },
	},
	{
		path: 'processors.parseXml',
		input: { data: '<a><b>1</b></a>', rules: { resourcePath: '/a' } },
		response: { mediaType: 'json', data: [{ b: '1' }] },
		method: 'POST',
		url: 'processors/xmlParser',
		body: { data: '<a><b>1</b></a>', rules: { resourcePath: '/a' } },
		result: { mediaType: 'json', data: [{ b: '1' }] },
	},
	{
		path: 'processors.parseStructuredFile',
		input: { data: 'ISA*00~', rules: { _fileDefinitionId: 'd1' } },
		response: { mediaType: 'json', data: [{ isa: {} }] },
		method: 'POST',
		url: 'processors/structuredFileParser',
		body: { data: 'ISA*00~', rules: { _fileDefinitionId: 'd1' } },
		result: { mediaType: 'json', data: [{ isa: {} }] },
	},
	{
		path: 'processors.generateStructuredFile',
		input: {
			data: [{ a: 1 }],
			rules: { name: 'Out', version: '1', format: 'fixed', rules: [] },
		},
		response: { mediaType: 'text', data: '1' },
		method: 'POST',
		url: 'processors/structuredFileGenerator',
		body: {
			data: [{ a: 1 }],
			rules: { name: 'Out', version: '1', format: 'fixed', rules: [] },
		},
		result: { mediaType: 'text', data: '1' },
	},
	{
		path: 'scripts.get',
		input: { id: 's1' },
		response: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
		method: 'GET',
		url: 'scripts/s1',
		result: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
	},
	{
		path: 'scripts.create',
		input: { name: 'hook', content: 'function preSavePage(o) { return o }' },
		response: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
		method: 'POST',
		url: 'scripts',
		body: { name: 'hook', content: 'function preSavePage(o) { return o }' },
		result: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
	},
	{
		path: 'scripts.update',
		input: { id: 's1', name: 'hook', content: 'x' },
		response: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
		method: 'PUT',
		url: 'scripts/s1',
		body: { name: 'hook', content: 'x' },
		result: { _id: 's1', name: 'hook', createdAt: 't', lastModified: 't' },
	},
	{
		path: 'scripts.delete',
		input: { id: 's1' },
		response: undefined,
		method: 'DELETE',
		url: 'scripts/s1',
		result: { success: true },
	},
	{
		path: 'scripts.getLogs',
		input: { id: 's1', _flowId: 'f1' },
		response: { logs: [{ time: 1, logLevel: 'info', message: 'hi' }] },
		method: 'GET',
		url: 'scripts/s1/logs',
		query: { _flowId: 'f1' },
		result: { logs: [{ time: 1, logLevel: 'info', message: 'hi' }] },
	},
	{
		path: 'state.list',
		input: {},
		response: { keys: ['k1'] },
		method: 'GET',
		url: 'state',
		result: { keys: ['k1'] },
	},
	{
		path: 'state.get',
		input: { key: 'cursor' },
		response: { last: 5 },
		method: 'GET',
		url: 'state/cursor',
		result: { last: 5 },
	},
	{
		path: 'state.set',
		input: { key: 'cursor', value: { last: 6 } },
		response: 'OK',
		method: 'PUT',
		url: 'state/cursor',
		body: { last: 6 },
		result: { result: 'OK' },
	},
	{
		path: 'state.delete',
		input: { key: 'cursor' },
		response: undefined,
		method: 'DELETE',
		url: 'state/cursor',
		result: { success: true },
	},
	{
		path: 'state.deleteAll',
		input: {},
		response: undefined,
		method: 'DELETE',
		url: 'state',
		result: { success: true },
	},
	{
		path: 'state.listForResource',
		input: { resourceType: 'exports', resourceId: 'e1' },
		response: { keys: ['k1'] },
		method: 'GET',
		url: 'exports/e1/state',
		result: { keys: ['k1'] },
	},
	{
		path: 'state.getForResource',
		input: { resourceType: 'imports', resourceId: 'm1', key: 'k' },
		response: [1, 2],
		method: 'GET',
		url: 'imports/m1/state/k',
		result: [1, 2],
	},
	{
		path: 'state.setForResource',
		input: {
			resourceType: 'integrations',
			resourceId: 'i1',
			key: 'k',
			value: { a: 1 },
		},
		response: 'Created',
		method: 'PUT',
		url: 'integrations/i1/state/k',
		body: { a: 1 },
		result: { result: 'Created' },
	},
	{
		path: 'state.deleteForResource',
		input: { resourceType: 'exports', resourceId: 'e1', key: 'k' },
		response: undefined,
		method: 'DELETE',
		url: 'exports/e1/state/k',
		result: { success: true },
	},
	{
		path: 'state.deleteAllForResource',
		input: { resourceType: 'exports', resourceId: 'e1' },
		response: undefined,
		method: 'DELETE',
		url: 'exports/e1/state',
		result: { success: true },
	},
	{
		path: 'tags.list',
		input: { limit: 2 },
		response: [{ _id: 't1', tag: 'urgent' }],
		method: 'GET',
		url: 'tags',
		query: { limit: 2 },
		result: [{ _id: 't1', tag: 'urgent' }],
	},
	{
		path: 'tags.get',
		input: { id: 't1' },
		response: { _id: 't1', tag: 'urgent' },
		method: 'GET',
		url: 'tags/t1',
		result: { _id: 't1', tag: 'urgent' },
	},
	{
		path: 'tags.create',
		input: { tag: 'urgent' },
		response: { _id: 't1', tag: 'urgent' },
		method: 'POST',
		url: 'tags',
		body: { tag: 'urgent' },
		result: { _id: 't1', tag: 'urgent' },
	},
	{
		path: 'tags.update',
		input: { id: 't1', tag: 'urgent' },
		response: { _id: 't1', tag: 'urgent' },
		method: 'PUT',
		url: 'tags/t1',
		body: { tag: 'urgent' },
		result: { _id: 't1', tag: 'urgent' },
	},
	{
		path: 'tags.delete',
		input: { id: 't1' },
		response: undefined,
		method: 'DELETE',
		url: 'tags/t1',
		result: { success: true },
	},
	{
		path: 'users.list',
		input: { userType: 'workspace' },
		response: [{ _id: 'u1', accessLevel: 'monitor', accepted: true }],
		method: 'GET',
		url: 'ashares',
		query: { userType: 'workspace' },
		result: [{ _id: 'u1', accessLevel: 'monitor', accepted: true }],
	},
	{
		path: 'users.get',
		input: { id: 'u1' },
		response: { _id: 'u1', accessLevel: 'monitor', accepted: true },
		method: 'GET',
		url: 'ashares/u1',
		result: { _id: 'u1', accessLevel: 'monitor', accepted: true },
	},
	{
		path: 'users.invite',
		input: { email: 'a@b.test', accessLevel: 'monitor' },
		response: { _id: 'u1', accessLevel: 'monitor', accepted: true },
		method: 'POST',
		url: 'invite',
		body: { email: 'a@b.test', accessLevel: 'monitor' },
		result: { _id: 'u1', accessLevel: 'monitor', accepted: true },
	},
	{
		path: 'users.inviteMultiple',
		input: { emails: ['a@b.test'], accessLevel: 'manage' },
		response: [
			{
				statusCode: 201,
				doc: { _id: 'u1', accessLevel: 'monitor', accepted: true },
			},
		],
		method: 'POST',
		url: 'invite/multiple',
		body: { emails: ['a@b.test'], accessLevel: 'manage' },
		result: [
			{
				statusCode: 201,
				doc: { _id: 'u1', accessLevel: 'monitor', accepted: true },
			},
		],
	},
	{
		path: 'users.update',
		input: { id: 'u1', accessLevel: 'manage' },
		response: undefined,
		method: 'PUT',
		url: 'ashares/u1',
		body: { accessLevel: 'manage' },
		result: { success: true },
	},
	{
		path: 'users.delete',
		input: { id: 'u1' },
		response: undefined,
		method: 'DELETE',
		url: 'ashares/u1',
		result: { success: true },
	},
];

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Celigo endpoints', () => {
	it('has one case per registered endpoint', () => {
		expect(cases.map((c) => c.path).sort()).toEqual(
			Object.keys(plugin.endpointSchemas ?? {}).sort(),
		);
		expect(cases).toHaveLength(118);
	});

	it.each(cases)('$path sends $method /$url', async (c) => {
		mockRequest.mockResolvedValueOnce(c.response);

		const result = await endpoint(c.path)(ctx(), c.input);

		const { config, options } = sentRequest();
		expect(config.BASE).toBe('https://api.integrator.io/v1');
		expect(config.TOKEN).toBe('test-api-key');
		expect(options.method).toBe(c.method);
		expect(options.url).toBe(c.url);
		expect(options.query ?? {}).toEqual(c.query ?? {});
		expect(options.body).toEqual(c.body);
		expect(result).toEqual(c.result);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			`celigo.${c.path}`,
			{},
			'completed',
		);
	});
});

describe('Celigo request handling', () => {
	it('routes to the regional host', async () => {
		mockRequest.mockResolvedValueOnce({ _userId: 'u1' });

		await endpoint('account.getTokenInfo')(ctx('eu'), {});

		expect(sentRequest().config.BASE).toBe('https://api.eu.integrator.io/v1');
	});

	it('encodes each id as a single path segment', async () => {
		mockRequest.mockResolvedValueOnce({ _id: 'a b' });

		await endpoint('flows.get')(ctx(), { id: 'a b' });

		expect(sentRequest().options.url).toBe('flows/a%20b');
	});

	it.each(['..', '.', 'a/b', 'a?b', 'a#b', ''])(
		'rejects id %p before calling Celigo',
		async (id) => {
			await expect(endpoint('flows.get')(ctx(), { id })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);

	it('rejects a response missing _id', async () => {
		mockRequest.mockResolvedValueOnce({ name: 'no id' });

		await expect(endpoint('flows.get')(ctx(), { id: 'f1' })).rejects.toThrow();
	});

	it('keeps adaptor fields Celigo returns beyond the named ones', async () => {
		mockRequest.mockResolvedValueOnce({
			_id: 'e1',
			http: { relativeURI: '/orders' },
		});

		const result = await endpoint('exports.get')(ctx(), { id: 'e1' });

		expect(result).toEqual({ _id: 'e1', http: { relativeURI: '/orders' } });
	});

	it('rethrows ApiError so the 429 handler sees status and retryAfter', async () => {
		const rateLimited = new ApiError(
			{ method: 'GET', url: 'flows' },
			{
				body: { message: 'Too Many Requests' },
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.integrator.io/v1/flows',
			},
			'Too Many Requests',
			{ retryAfter: 3000 },
		);
		mockRequest.mockRejectedValueOnce(rateLimited);

		await expect(endpoint('flows.list')(ctx(), {})).rejects.toBe(rateLimited);
		expect(
			await plugin.errorHandlers?.RATE_LIMIT_ERROR?.handler(
				rateLimited,
				errorContext(rateLimited),
			),
		).toEqual({ maxRetries: 5, headersRetryAfterMs: 3000 });
	});

	it('rethrows a 401 and maps it to the auth handler', async () => {
		const unauthorized = new ApiError(
			{ method: 'GET', url: 'flows' },
			{
				body: { message: 'Unauthorized' },
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				url: 'https://api.integrator.io/v1/flows',
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValueOnce(unauthorized);

		await expect(endpoint('flows.list')(ctx(), {})).rejects.toBe(unauthorized);
		expect(
			plugin.errorHandlers?.AUTH_ERROR?.match(
				unauthorized,
				errorContext(unauthorized),
			),
		).toBe(true);
	});
});

describe('Celigo plugin metadata', () => {
	it('marks every delete as destructive and irreversible', () => {
		const deletes = Object.entries(plugin.endpointMeta ?? {}).filter(([k]) =>
			/\.delete/.test(k),
		);
		expect(deletes.length).toBeGreaterThan(10);
		for (const [, meta] of deletes) {
			expect(meta).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
	});
});

describe('Celigo database persistence', () => {
	const stamp = '2024-05-01T10:00:00.000Z';
	const when = new Date(stamp);

	const saves: {
		path: string;
		input: JsonObject;
		response: Json;
		entity: string;
		id: string;
		row: JsonObject;
	}[] = [
		{
			path: 'integrations.get',
			input: { id: 'i1' },
			response: {
				_id: 'i1',
				name: 'ERP',
				_connectorId: 'c9',
				lastModified: stamp,
			},
			entity: 'integrations',
			id: 'i1',
			row: { id: 'i1', name: 'ERP', connectorId: 'c9' },
		},
		{
			path: 'flows.get',
			input: { id: 'f1' },
			response: {
				_id: 'f1',
				name: 'Sync',
				_integrationId: 'i1',
				disabled: false,
			},
			entity: 'flows',
			id: 'f1',
			row: { id: 'f1', name: 'Sync', integrationId: 'i1', disabled: false },
		},
		{
			path: 'connections.create',
			input: { type: 'http', name: 'API' },
			response: { _id: 'c1', name: 'API', type: 'http', offline: false },
			entity: 'connections',
			id: 'c1',
			row: { id: 'c1', name: 'API', type: 'http', offline: false },
		},
		{
			path: 'exports.update',
			input: { id: 'e1', name: 'Orders', adaptorType: 'HTTPExport' },
			response: {
				_id: 'e1',
				name: 'Orders',
				adaptorType: 'HTTPExport',
				_connectionId: 'c1',
			},
			entity: 'exports',
			id: 'e1',
			row: { id: 'e1', adaptorType: 'HTTPExport', connectionId: 'c1' },
		},
		{
			path: 'imports.get',
			input: { id: 'm1' },
			response: { _id: 'm1', adaptorType: 'HTTPImport', ignoreExisting: true },
			entity: 'imports',
			id: 'm1',
			row: { id: 'm1', adaptorType: 'HTTPImport', ignoreExisting: true },
		},
		{
			path: 'scripts.get',
			input: { id: 's1' },
			response: {
				_id: 's1',
				name: 'Hook',
				content: 'function f(){}',
				createdAt: stamp,
				lastModified: stamp,
			},
			entity: 'scripts',
			id: 's1',
			row: { id: 's1', name: 'Hook', content: 'function f(){}' },
		},
		{
			path: 'tags.create',
			input: { tag: 'prod' },
			response: { _id: 't1', tag: 'prod', tagId: 'tg1' },
			entity: 'tags',
			id: 't1',
			row: { id: 't1', tag: 'prod', tagId: 'tg1' },
		},
		{
			path: 'iClients.get',
			input: { id: 'ic1' },
			response: { _id: 'ic1', provider: 'custom_oauth2', published: true },
			entity: 'iclients',
			id: 'ic1',
			row: { id: 'ic1', provider: 'custom_oauth2', published: true },
		},
		{
			path: 'users.get',
			input: { id: 'u1' },
			response: { _id: 'u1', accessLevel: 'manage', accepted: true },
			entity: 'users',
			id: 'u1',
			row: { id: 'u1', accessLevel: 'manage', accepted: true },
		},
		{
			path: 'jobs.list',
			input: {},
			response: [
				{
					_id: 'j1',
					type: 'flow',
					status: 'completed',
					_flowId: 'f1',
					numError: 2,
				},
			],
			entity: 'jobs',
			id: 'j1',
			row: { id: 'j1', status: 'completed', flowId: 'f1', numError: 2 },
		},
		{
			path: 'flows.getLatestJobs',
			input: { id: 'f1' },
			response: [{ _id: 'j2', status: 'running', _flowId: 'f1' }],
			entity: 'jobs',
			id: 'j2',
			row: { id: 'j2', status: 'running', flowId: 'f1' },
		},
		{
			path: 'integrations.listFlows',
			input: { id: 'i1' },
			response: [{ _id: 'f7', name: 'Nested', _integrationId: 'i1' }],
			entity: 'flows',
			id: 'f7',
			row: { id: 'f7', name: 'Nested', integrationId: 'i1' },
		},
	];

	it.each(saves)('$path upserts into $entity', async (c) => {
		mockRequest.mockResolvedValueOnce(c.response);

		await endpoint(c.path)(ctx(), c.input);

		expect(tables[c.entity]?.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(tables[c.entity]?.upsertByEntityId).toHaveBeenCalledWith(
			c.id,
			expect.objectContaining(c.row),
		);
	});

	it('stores timestamps as dates', async () => {
		mockRequest.mockResolvedValueOnce({ _id: 'i1', lastModified: stamp });

		await endpoint('integrations.get')(ctx(), { id: 'i1' });

		expect(tables.integrations?.upsertByEntityId).toHaveBeenCalledWith(
			'i1',
			expect.objectContaining({ lastModified: when }),
		);
	});

	it('upserts every row of a list', async () => {
		mockRequest.mockResolvedValueOnce([{ _id: 'f1' }, { _id: 'f2' }]);

		await endpoint('flows.list')(ctx(), {});

		expect(tables.flows?.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(tables.flows?.upsertByEntityId).toHaveBeenCalledWith(
			'f2',
			expect.objectContaining({ id: 'f2' }),
		);
	});

	it.each([
		['flows.delete', 'flows'],
		['connections.delete', 'connections'],
		['exports.delete', 'exports'],
		['imports.delete', 'imports'],
		['integrations.delete', 'integrations'],
		['scripts.delete', 'scripts'],
		['tags.delete', 'tags'],
		['iClients.delete', 'iclients'],
		['users.delete', 'users'],
	])('%s removes the stored %s row', async (path, entity) => {
		mockRequest.mockResolvedValueOnce(undefined);

		await endpoint(path)(ctx(), { id: 'x1' });

		expect(tables[entity]?.deleteByEntityId).toHaveBeenCalledWith('x1');
	});

	it('does not store anything for a patch', async () => {
		mockRequest.mockResolvedValueOnce(undefined);

		await endpoint('flows.patch')(ctx(), {
			id: 'f1',
			operations: [{ op: 'replace', path: '/name', value: 'x' }],
		});

		expect(tables.flows?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('returns the response when the database write fails', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		tables.flows?.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockRequest.mockResolvedValueOnce({ _id: 'f1', name: 'Sync' });

		const result = await endpoint('flows.get')(ctx(), { id: 'f1' });

		expect(result).toEqual({ _id: 'f1', name: 'Sync' });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

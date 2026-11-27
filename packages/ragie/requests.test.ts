import { logEventFromContext } from 'corsair/core';
import {
	Connections,
	Documents,
	Responses,
	Retrievals,
	WebhookEndpoints,
} from './endpoints';
import {
	cancelledResponse,
	completedResponse,
	connection,
	connectionsList,
	deepSearchResponse,
	document,
	documentChunks,
	documentContent,
	documentsList,
	oauthRedirectUrl,
	readyDocument,
	retrieval,
	sourceTypes,
	webhookEndpoint,
	webhookEndpointsList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ragie-test-key';

// unknown: tests send values no schema accepts, so the input stays unknown;
// each call infers its output type from the endpoint.
async function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 200) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body:
			typeof init.body === 'string'
				? (JSON.parse(init.body) as unknown) // unknown: the request's own serialization
				: undefined,
		form: init.body instanceof FormData ? (init.body as FormData) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.ragie.ai');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('documents requests', () => {
	it('documents.list GETs /documents with the paging query', async () => {
		respond(documentsList);

		const result = await invoke(Documents.list, {
			filter: '{"department":"sales"}',
			partition: 'acme',
			cursor: 'doc_cursor_1',
			page_size: 50,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/documents',
			query: {
				filter: '{"department":"sales"}',
				partition: 'acme',
				cursor: 'doc_cursor_1',
				page_size: '50',
			},
		});
		expect(result).toEqual(documentsList);
	});

	it('documents.create uploads multipart with a JSON metadata field', async () => {
		respond(document);
		const file = new Blob(['pdf-bytes'], { type: 'application/pdf' });

		const result = await invoke(Documents.create, {
			file,
			mode: 'hi_res',
			metadata: { department: 'sales' },
			name: 'handbook.pdf',
			external_id: 'handbook-1',
			partition: 'acme',
		});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/documents');
		expect(sent.form).toBeDefined();
		const form = sent.form as FormData;
		expect(form.get('file')).toBeInstanceOf(Blob);
		// Ragie wants a metadata object as JSON inside the form field; corsair's
		// formData builder JSON-stringifies non-string values, matching the SDK.
		expect(form.get('metadata')).toBe('{"department":"sales"}');
		expect(form.get('mode')).toBe('hi_res');
		expect(form.get('name')).toBe('handbook.pdf');
		expect(form.get('external_id')).toBe('handbook-1');
		expect(form.get('partition')).toBe('acme');
		expect(result).toEqual(document);
	});

	it('documents.createRaw POSTs /documents/raw with the text body', async () => {
		respond(readyDocument);

		const result = await invoke(Documents.createRaw, {
			data: 'The refund window is thirty days.',
			name: 'refunds',
			partition: 'acme',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/documents/raw',
			body: {
				data: 'The refund window is thirty days.',
				name: 'refunds',
				partition: 'acme',
			},
		});
		expect(result).toEqual(readyDocument);
	});

	it('documents.createFromUrl POSTs /documents/url', async () => {
		respond(readyDocument);

		await invoke(Documents.createFromUrl, {
			url: 'https://example.com/handbook.pdf',
			mode: 'fast',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/documents/url',
			body: {
				url: 'https://example.com/handbook.pdf',
				mode: 'fast',
			},
		});
	});

	it('documents.get GETs the document by id', async () => {
		respond(readyDocument);

		const result = await invoke(Documents.get, {
			document_id: readyDocument.id,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/documents/${readyDocument.id}`,
		});
		expect(result.status).toBe('ready');
	});

	it('documents.delete DELETEs the document and accepts an empty 200', async () => {
		respondEmpty();

		await invoke(Documents.remove, { document_id: readyDocument.id });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/documents/${readyDocument.id}`,
		});
	});

	it('documents.updateFile PUTs the replacement file as multipart', async () => {
		respond(readyDocument);
		const file = new Blob(['new-pdf-bytes'], { type: 'application/pdf' });

		await invoke(Documents.updateFile, {
			document_id: readyDocument.id,
			file,
			partition: 'acme',
		});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/documents/${readyDocument.id}/file`);
		expect(sent.query).toEqual({ partition: 'acme' });
		expect((sent.form as FormData).get('file')).toBeInstanceOf(Blob);
	});

	it('documents.updateRaw PUTs raw text to /raw', async () => {
		respond(readyDocument);

		await invoke(Documents.updateRaw, {
			document_id: readyDocument.id,
			data: 'Updated text.',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/documents/${readyDocument.id}/raw`,
			body: { data: 'Updated text.' },
		});
	});

	it('documents.updateFromUrl PUTs the url to /url', async () => {
		respond(readyDocument);

		await invoke(Documents.updateFromUrl, {
			document_id: readyDocument.id,
			url: 'https://example.com/v2.pdf',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/documents/${readyDocument.id}/url`,
			body: { url: 'https://example.com/v2.pdf' },
		});
	});

	it('documents.patchMetadata PATCHes metadata with a null delete', async () => {
		respond(readyDocument);

		await invoke(Documents.patchMetadata, {
			document_id: readyDocument.id,
			metadata: { department: 'support', tags: null },
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: `/documents/${readyDocument.id}/metadata`,
			body: { metadata: { department: 'support', tags: null } },
		});
	});

	it('documents.getChunks GETs /chunks with paging', async () => {
		respond(documentChunks);

		const result = await invoke(Documents.getChunks, {
			document_id: readyDocument.id,
			cursor: 'chunk_cursor_1',
			page_size: 100,
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/documents/${readyDocument.id}/chunks`,
			query: { cursor: 'chunk_cursor_1', page_size: '100' },
		});
		expect(result.chunks).toEqual(documentChunks.chunks);
	});

	it('documents.getContent GETs /content as JSON', async () => {
		respond(documentContent);

		const result = await invoke(Documents.getContent, {
			document_id: readyDocument.id,
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/documents/${readyDocument.id}/content`,
		});
		expect(result.content).toContain('refund');
	});

	it('documents.getSummary GETs /summary', async () => {
		respond({ summary: 'A sales handbook describing refunds.' });

		const result = await invoke(Documents.getSummary, {
			document_id: readyDocument.id,
		});

		expect(lastRequest().path).toBe(`/documents/${readyDocument.id}/summary`);
		expect(result.summary).toContain('handbook');
	});
});

describe('retrievals requests', () => {
	it('retrievals.retrieve POSTs the query with its options', async () => {
		respond(retrieval);

		const result = await invoke(Retrievals.retrieve, {
			query: 'refund window',
			top_k: 8,
			filter: { department: { $eq: 'sales' } },
			rerank: true,
			max_chunks_per_document: 4,
			partition: 'acme',
			recency_bias: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/retrievals',
			body: {
				query: 'refund window',
				top_k: 8,
				filter: { department: { $eq: 'sales' } },
				rerank: true,
				max_chunks_per_document: 4,
				partition: 'acme',
				recency_bias: true,
			},
		});
		expect(result.scored_chunks).toHaveLength(1);
		expect(result.scored_chunks[0]?.document_id).toBe(readyDocument.id);
	});
});

describe('connections requests', () => {
	it('connections.list GETs /connections with paging', async () => {
		respond(connectionsList);

		const result = await invoke(Connections.list, {
			cursor: 'c1',
			page_size: 25,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/connections',
			query: { cursor: 'c1', page_size: '25' },
		});
		expect(result.connections).toEqual(connectionsList.connections);
	});

	it('connections.get GETs one connection', async () => {
		respond(connection);

		const result = await invoke(Connections.get, {
			connection_id: connection.id,
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/connections/${connection.id}`,
		});
		expect(result.name).toBe(connection.name);
	});

	it('connections.listSourceTypes GETs /connections/source-type', async () => {
		respond(sourceTypes);

		const result = await invoke(Connections.listSourceTypes, {});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/connections/source-type',
		});
		expect(result.source_types).toHaveLength(2);
	});

	it('connections.create POSTs /connection with the nested connection body', async () => {
		respond(connection);

		const result = await invoke(Connections.create, {
			connection: {
				provider: 'gcs',
				data: { bucket: 'acme-docs' },
				credentials: { service_account_json: '{}' },
			},
			partition_strategy: { strategy: 'none' },
			page_limit: 1000,
		});

		expectAuthenticated();
		// The create path is singular; every other connection route is plural.
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/connection',
			body: {
				connection: {
					provider: 'gcs',
					data: { bucket: 'acme-docs' },
					credentials: { service_account_json: '{}' },
				},
				partition_strategy: { strategy: 'none' },
				page_limit: 1000,
			},
		});
		expect(result.id).toBe(connection.id);
	});

	it('connections.createOAuthRedirectUrl POSTs /connections/oauth', async () => {
		respond(oauthRedirectUrl);

		const result = await invoke(Connections.createOAuthRedirectUrl, {
			redirect_uri: 'https://app.example.com/oauth/ragie',
			source_type: 'google_drive',
			partition: 'acme',
			page_limit: 500,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/connections/oauth',
			body: {
				redirect_uri: 'https://app.example.com/oauth/ragie',
				source_type: 'google_drive',
				partition: 'acme',
				page_limit: 500,
			},
		});
		expect(result.url).toContain('oauth');
	});

	it('connections.update PUTs the connection', async () => {
		respond(connection);

		await invoke(Connections.update, {
			connection_id: connection.id,
			metadata: { team: 'support' },
			page_limit: 2000,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/connections/${connection.id}`,
			body: { metadata: { team: 'support' }, page_limit: 2000 },
		});
	});

	it('connections.sync POSTs /sync with no body', async () => {
		respond({});

		await invoke(Connections.sync, { connection_id: connection.id });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/connections/${connection.id}/sync`,
			body: undefined,
		});
	});

	it('connections.delete POSTs /delete with keep_files, not a DELETE method', async () => {
		respond({ detail: 'ok' });

		await invoke(Connections.remove, {
			connection_id: connection.id,
			keep_files: false,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/connections/${connection.id}/delete`,
			body: { keep_files: false },
		});
	});

	it('connections.setEnabled PUTs /enabled with the flag', async () => {
		respond({ ...connection, enabled: false });

		await invoke(Connections.setEnabled, {
			connection_id: connection.id,
			enabled: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/connections/${connection.id}/enabled`,
			body: { enabled: false },
		});
	});

	it('connections.setLimits PUTs /limit, null removing the limit', async () => {
		respond(connection);

		await invoke(Connections.setLimits, {
			connection_id: connection.id,
			page_limit: null,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/connections/${connection.id}/limit`,
			body: { page_limit: null },
		});
	});
});

describe('responses requests', () => {
	it('responses.create POSTs the input', async () => {
		respond(deepSearchResponse);

		const result = await invoke(Responses.create, {
			input: 'What is the refund window?',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/responses',
			body: { input: 'What is the refund window?' },
		});
		expect(result.status).toBe('in_progress');
	});

	it('responses.get GETs the response by id', async () => {
		respond(completedResponse);

		const result = await invoke(Responses.get, {
			response_id: deepSearchResponse.id,
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/responses/${deepSearchResponse.id}`,
		});
		expect(result.status).toBe('completed');
	});

	it('sorts cancelled as a terminal status', async () => {
		respond(cancelledResponse);

		const result = await invoke(Responses.get, {
			response_id: deepSearchResponse.id,
		});

		expect(result.status).toBe('cancelled');
	});
});

describe('webhookEndpoints requests', () => {
	it('webhookEndpoints.list GETs /webhook_endpoints', async () => {
		respond(webhookEndpointsList);

		const result = await invoke(WebhookEndpoints.list, { page_size: 100 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/webhook_endpoints',
			query: { page_size: '100' },
		});
		expect(result.webhook_endpoints).toEqual(
			webhookEndpointsList.webhook_endpoints,
		);
	});

	it('webhookEndpoints.create POSTs name, url and pattern', async () => {
		respond(webhookEndpoint);

		const result = await invoke(WebhookEndpoints.create, {
			name: 'document status',
			url: 'https://example.com/hooks/ragie',
			partition_pattern: 'acme-*',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/webhook_endpoints',
			body: {
				name: 'document status',
				url: 'https://example.com/hooks/ragie',
				partition_pattern: 'acme-*',
			},
		});
		// The answer carries the signing secret.
		expect(result.secret).toBe(webhookEndpoint.secret);
	});

	it('webhookEndpoints.get GETs one endpoint', async () => {
		respond(webhookEndpoint);

		await invoke(WebhookEndpoints.get, { endpoint_id: webhookEndpoint.id });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/webhook_endpoints/${webhookEndpoint.id}`,
		});
	});

	it('webhookEndpoints.update PATCHes the endpoint', async () => {
		respond(webhookEndpoint);

		await invoke(WebhookEndpoints.update, {
			endpoint_id: webhookEndpoint.id,
			active: false,
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: `/webhook_endpoints/${webhookEndpoint.id}`,
			body: { active: false },
		});
	});

	it('webhookEndpoints.delete DELETEs the endpoint', async () => {
		respond({});

		await invoke(WebhookEndpoints.remove, { endpoint_id: webhookEndpoint.id });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/webhook_endpoints/${webhookEndpoint.id}`,
		});
	});
});

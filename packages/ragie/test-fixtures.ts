/**
 * Wire-format fixtures in Ragie's snake_case spelling. Shapes follow the
 * official Speakeasy SDK models (github.com/ragieai/ragie-typescript) in
 * /tmp/corsair-work/ragie/evidence/sdk-models and examples; none has been
 * verified against the live API, because api.ragie.ai blocks non-browser
 * clients. If a live answer disagrees, fix the fixture and the schema
 * together.
 */

export const document = {
	id: 'b5331205-e0ee-4bb9-9d01-6d9a01d9e882',
	status: 'pending',
	name: 'handbook.pdf',
	external_id: null,
	metadata: { department: 'sales', year: 2025, reviewed: true, tags: ['q1'] },
	partition: 'default',
	chunk_count: null,
	page_count: 12,
	created_at: '2026-11-27T10:15:30.000Z',
	updated_at: '2026-11-27T10:15:31.000Z',
};

export const readyDocument = {
	...document,
	id: '7a17cf2e-4c22-4b73-8bf2-16c4c19c50b1',
	status: 'ready',
	chunk_count: 42,
	page_count: 12,
};

export const documentsList = {
	documents: [document, readyDocument],
	cursor: 'doc_cursor_2',
};

export const link = {
	href: 'https://api.ragie.ai/documents/b5331205-e0ee-4bb9-9d01-6d9a01d9e882/chunks/12',
};

export const documentChunk = {
	id: 'chunk-12',
	index: 12,
	text: 'The refund window is thirty days.',
	metadata: { page: 3 },
	links: { self: link },
};

export const documentChunks = {
	chunks: [documentChunk],
	cursor: null,
};

export const documentContent = {
	...readyDocument,
	content: 'The refund window is thirty days. Returns ship free.',
};

export const documentSummary = {
	summary: 'A sales handbook describing refunds.',
};

export const scoredChunk = {
	text: 'The refund window is thirty days.',
	score: 0.873,
	id: 'chunk-12',
	index: 12,
	metadata: { page: 3 },
	document_id: readyDocument.id,
	document_name: 'handbook.pdf',
	document_metadata: { department: 'sales' },
	links: { self: link },
};

export const retrieval = { scored_chunks: [scoredChunk] };

export const connection = {
	id: 'f83f5c92-1fae-4a37-8f3e-23914e2b9c1d',
	created_at: '2026-11-20T08:00:00.000Z',
	updated_at: '2026-11-26T12:30:00.000Z',
	metadata: { team: 'growth' },
	type: 'gcs',
	name: 'Acme GCS bucket',
	source: { bucket: 'acme-docs' },
	enabled: true,
	disabled_by_system_reason: null,
	last_synced_at: '2026-11-26T12:29:40.000Z',
	syncing: false,
	partition: 'default',
	page_limit: 1000,
	sync_filter: {},
	disabled_by_system: false,
};

export const connectionsList = {
	connections: [connection],
	cursor: 'conn_cursor_2',
};

export const sourceTypes = {
	source_types: [
		{ name: 'gcs', requires_oauth: false },
		{ name: 'google_drive', requires_oauth: true },
	],
};

export const oauthRedirectUrl = {
	url: 'https://secure.ragie.ai/oauth/authorize?state=abc123',
};

export const connectionDeleted = { detail: 'ok' };

export const responseOK = {};

export const deepSearchResponse = {
	id: 'e613d0b7-4c9a-45ed-b32c-302d7f1c5daf',
	object: 'response',
	created_at: 1764240000,
	status: 'in_progress',
	error: null,
	instructions: null,
	max_output_tokens: null,
	model: 'deep-search',
	output: [],
	output_parsed: null,
	tools: [{ type: 'retrieve', partition: 'default' }],
	reasoning: { effort: 'medium' },
	parallel_tool_calls: false,
	store: false,
	temperature: 1,
	previous_response_id: null,
	tool_choice: 'auto',
	top_p: 1,
	truncation: 'disabled',
	usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
	user: null,
	metadata: {},
};

export const completedResponse = {
	...deepSearchResponse,
	status: 'completed',
	usage: { input_tokens: 1200, output_tokens: 340, total_tokens: 1540 },
};

export const cancelledResponse = {
	...deepSearchResponse,
	status: 'cancelled',
};

export const webhookEndpoint = {
	id: '70a542b9-871a-42f4-a4a2-9f03a857e785',
	created_at: '2026-11-25T09:00:00.000Z',
	updated_at: '2026-11-25T09:00:00.000Z',
	name: 'document status',
	url: 'https://example.com/hooks/ragie',
	partition_pattern: null,
	active: true,
	secret: 'whsec_9f2b7c1d4e5a6b8c0d2e3f4a5b6c7d8e',
};

export const webhookEndpointsList = {
	webhook_endpoints: [webhookEndpoint],
	cursor: null,
};

export const tooManyRequests = { detail: 'Too many requests' };

export const unauthorized = { detail: 'Invalid request token' };

export const paymentRequired = {
	detail: 'Plan limit reached or payment required',
};

export const validationDetail = {
	detail: [
		{
			loc: ['body', 'data'],
			msg: 'field required',
			type: 'value_error.missing',
		},
	],
};

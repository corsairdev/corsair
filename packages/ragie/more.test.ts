import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import * as More from './endpoints/more';
import type { RagieContext } from './index';
import {
	isRagieDelivery,
	ragieWebhooksNested,
	verifyRagieWebhook,
} from './webhooks';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

let fetchMock: jest.SpyInstance;
const ctx = { key: 'ragie-test-key' } as unknown as RagieContext;

function respond(body: unknown, contentType = 'application/json') {
	fetchMock.mockResolvedValueOnce(
		new Response(
			body instanceof Uint8Array
				? body
				: body === undefined
					? null
					: JSON.stringify(body),
			{ status: 200, headers: { 'Content-Type': contentType } },
		),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		method: init.method,
		path: parsed.pathname,
		query: parsed.searchParams,
		headers: new Headers(init.headers),
		body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});
afterEach(() => fetchMock.mockRestore());

const PAGINATION = { next_cursor: null, total_count: 0 };
const PARTITION = {
	name: 'acme',
	is_default: false,
	description: null,
	context_aware: false,
	metadata_schema: null,
	limits: {},
};
const INSTRUCTION = {
	id: 'ins_1',
	name: 'Invoice totals',
	prompt: 'Extract totals',
	entity_schema: { type: 'object' },
};

// [name, call, answer, method, path] for every operation added in review.
const CASES: Array<[string, () => Promise<unknown>, unknown, string, string]> =
	[
		[
			'partitions.list',
			() => More.partitionsList(ctx, { page_size: 5 }),
			{ partitions: [PARTITION], pagination: PAGINATION },
			'GET',
			'/partitions',
		],
		[
			'partitions.create',
			() =>
				More.partitionsCreate(ctx, {
					name: 'acme',
					pages_processed_limit_monthly: 100,
				}),
			PARTITION,
			'POST',
			'/partitions',
		],
		[
			'partitions.get',
			() => More.partitionsGet(ctx, { partition_id: 'acme' }),
			{ ...PARTITION, stats: {} },
			'GET',
			'/partitions/acme',
		],
		[
			'partitions.update',
			() =>
				More.partitionsUpdate(ctx, { partition_id: 'acme', description: 'x' }),
			PARTITION,
			'PATCH',
			'/partitions/acme',
		],
		[
			'partitions.setLimits',
			() =>
				More.partitionsSetLimits(ctx, {
					partition_id: 'acme',
					pages_hosted_limit_max: 10,
				}),
			PARTITION,
			'PUT',
			'/partitions/acme/limits',
		],
		[
			'partitions.delete',
			() => More.partitionsDelete(ctx, { partition_id: 'acme', async: true }),
			{ status: 'ok' },
			'DELETE',
			'/partitions/acme',
		],
		[
			'instructions.list',
			() => More.instructionsList(ctx, {}),
			[INSTRUCTION],
			'GET',
			'/instructions',
		],
		[
			'instructions.create',
			() =>
				More.instructionsCreate(ctx, {
					name: 'Invoice totals',
					prompt: 'Extract totals',
					entity_schema: { type: 'object' },
					scope: 'document',
				}),
			INSTRUCTION,
			'POST',
			'/instructions',
		],
		[
			'instructions.update',
			() =>
				More.instructionsUpdate(ctx, {
					instruction_id: 'ins_1',
					active: false,
				}),
			INSTRUCTION,
			'PATCH',
			'/instructions/ins_1',
		],
		[
			'instructions.delete',
			() => More.instructionsDelete(ctx, { instruction_id: 'ins_1' }),
			{ status: 'ok' },
			'DELETE',
			'/instructions/ins_1',
		],
		[
			'instructions.listEntities',
			() =>
				More.instructionsListEntities(ctx, {
					instruction_id: 'ins_1',
					partition: 'acme',
				}),
			{ entities: [], pagination: PAGINATION },
			'GET',
			'/instructions/ins_1/entities',
		],
		[
			'instructions.listExtractionLogs',
			() =>
				More.instructionsListExtractionLogs(ctx, {
					instruction_id: 'ins_1',
					status: 'error',
					document_ids: ['d1', 'd2'],
				}),
			{ logs: [{ id: 'l1', status: 'error' }], pagination: PAGINATION },
			'GET',
			'/instructions/ins_1/entity-extraction-logs',
		],
		[
			'documents.listEntities',
			() => More.documentsListEntities(ctx, { document_id: 'd1' }),
			{
				entities: [
					{ id: 'e1', instruction_id: 'ins_1', document_id: 'd1', data: {} },
				],
				pagination: PAGINATION,
			},
			'GET',
			'/documents/d1/entities',
		],
		[
			'documents.listElements',
			() =>
				More.documentsListElements(ctx, {
					document_id: 'd1',
					type: ['table', 'title'],
				}),
			{
				document_elements: [{ id: 'el1', type: 'table' }],
				pagination: PAGINATION,
			},
			'GET',
			'/documents/d1/elements',
		],
		[
			'elements.get',
			() => More.elementsGet(ctx, { element_id: 'el1' }),
			{ id: 'el1', type: 'title' },
			'GET',
			'/elements/el1',
		],
		[
			'documents.getChunk',
			() =>
				More.documentsGetChunk(ctx, {
					document_id: 'd1',
					chunk_id: 'c1',
					partition: 'acme',
				}),
			{ id: 'c1', text: 'hello', links: {} },
			'GET',
			'/documents/d1/chunks/c1',
		],
		[
			'connections.getStats',
			() => More.connectionsGetStats(ctx, { connection_id: 'con_1' }),
			{ document_count: 3, page_count: 9 },
			'GET',
			'/connections/con_1/stats',
		],
		[
			'authenticators.list',
			() => More.authenticatorsList(ctx, {}),
			{
				authenticators: [{ id: 'a1', name: 'Mine', provider: 'google' }],
				pagination: PAGINATION,
			},
			'GET',
			'/authenticators',
		],
		[
			'authenticators.create',
			() =>
				More.authenticatorsCreate(ctx, {
					provider: 'google',
					name: 'Mine',
					client_id: 'cid',
					client_secret: 'secret',
				}),
			{ id: 'a1', name: 'Mine', provider: 'google' },
			'POST',
			'/authenticators',
		],
		[
			'authenticators.createConnection',
			() =>
				More.authenticatorsCreateConnection(ctx, {
					authenticator_id: 'a1',
					partition_strategy: 'fast',
					connection: { provider: 'google_drive', data: {} },
				}),
			{ id: 'con_1' },
			'POST',
			'/authenticators/a1/connection',
		],
		[
			'authenticators.delete',
			() => More.authenticatorsDelete(ctx, { authenticator_id: 'a1' }),
			{ status: 'ok' },
			'DELETE',
			'/authenticators/a1',
		],
	];

describe('operations added in review', () => {
	it.each(CASES)(
		'%s sends the right method and path',
		async (_, run, answer, method, path) => {
			respond(answer);
			await run();
			const sent = lastRequest();
			expect(sent.method).toBe(method);
			expect(sent.path).toBe(path);
			expect(sent.headers.get('authorization')).toBe('Bearer ragie-test-key');
		},
	);

	it('sends partition as a header and arrays as repeated query keys', async () => {
		respond({ logs: [], pagination: PAGINATION });
		await More.instructionsListExtractionLogs(ctx, {
			instruction_id: 'ins_1',
			partition: 'acme',
			document_ids: ['d1', 'd2'],
		});
		const sent = lastRequest();
		expect(sent.headers.get('partition')).toBe('acme');
		expect(sent.query.getAll('document_ids')).toEqual(['d1', 'd2']);
		expect(sent.query.has('partition')).toBe(false);
	});

	it('puts snake_case fields in the create bodies', async () => {
		respond(PARTITION);
		await More.partitionsCreate(ctx, {
			name: 'acme',
			pages_processed_limit_monthly: 100,
		});
		expect(lastRequest().body).toEqual({
			name: 'acme',
			pages_processed_limit_monthly: 100,
		});
	});

	it('returns a document source and chunk media as files', async () => {
		respond(new Uint8Array([37, 80, 68, 70]), 'application/pdf');
		const source = (await More.documentsGetSource(ctx, {
			document_id: 'd1',
		})) as { contentType: string; byteLength: number };
		expect(lastRequest().path).toBe('/documents/d1/source');
		expect(source).toMatchObject({
			contentType: 'application/pdf',
			byteLength: 4,
		});

		respond(new TextEncoder().encode('chunk text'), 'text/plain');
		const chunk = (await More.documentsGetChunkContent(ctx, {
			document_id: 'd1',
			chunk_id: 'c1',
			media_type: 'text/plain',
		})) as { text?: string };
		expect(lastRequest().path).toBe('/documents/d1/chunks/c1/content');
		expect(lastRequest().query.get('media_type')).toBe('text/plain');
		expect(chunk.text).toBe('chunk text');
	});

	it('refuses an unknown extraction status before any request', async () => {
		await expect(
			More.instructionsListExtractionLogs(ctx, {
				instruction_id: 'ins_1',
				status: 'pending' as 'error',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

// ── webhooks ────────────────────────────────────────────────────────────────

const SECRET = 'ragie-signing-secret';
type Delivery = WebhookRequest<never> & RawWebhookRequest;

function delivery(payload: object, signature?: string): Delivery {
	const rawBody = JSON.stringify(payload);
	return {
		headers: {
			'x-signature':
				signature ?? createHmac('sha256', SECRET).update(rawBody).digest('hex'),
		},
		body: rawBody,
		rawBody,
		payload,
	} as unknown as Delivery;
}

const STATUS_UPDATED = {
	type: 'document_status_updated',
	payload: {
		document_id: 'd1',
		external_id: null,
		partition: 'default',
		status: 'ready',
		metadata: {},
	},
	nonce: 'n-1',
};

describe('webhooks', () => {
	it('verifies the X-Signature HMAC of the raw body', () => {
		expect(verifyRagieWebhook(delivery(STATUS_UPDATED), SECRET)).toEqual({
			valid: true,
		});
		expect(
			verifyRagieWebhook(delivery(STATUS_UPDATED), 'other-secret').valid,
		).toBe(false);
		expect(verifyRagieWebhook(delivery(STATUS_UPDATED), undefined).valid).toBe(
			false,
		);
		const tampered = {
			...delivery(STATUS_UPDATED),
			rawBody: JSON.stringify({ ...STATUS_UPDATED, nonce: 'n-2' }),
		} as Delivery;
		expect(verifyRagieWebhook(tampered, SECRET).valid).toBe(false);
	});

	it('matches by type and returns the parsed event', async () => {
		const request = delivery(STATUS_UPDATED);
		expect(isRagieDelivery(request)).toBe(true);
		expect(ragieWebhooksNested.documents.statusUpdated.match(request)).toBe(
			true,
		);
		expect(ragieWebhooksNested.documents.deleted.match(request)).toBe(false);
		const result = await ragieWebhooksNested.documents.statusUpdated.handler(
			{ key: SECRET } as unknown as RagieContext,
			request,
		);
		expect(result.success).toBe(true);
		expect(result.data?.payload.status).toBe('ready');
	});

	it('answers 401 for a bad signature', async () => {
		const result = await ragieWebhooksNested.documents.statusUpdated.handler(
			{ key: SECRET } as unknown as RagieContext,
			delivery(STATUS_UPDATED, 'deadbeef'),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it.each([
		[
			ragieWebhooksNested.documents.deleted,
			{ type: 'document_deleted', payload: { document_id: 'd1' }, nonce: 'n' },
		],
		[
			ragieWebhooksNested.entities.extracted,
			{
				type: 'entity_extracted',
				payload: {
					entity_id: 'e1',
					document_id: 'd1',
					instruction_id: 'i1',
					data: {},
				},
				nonce: 'n',
			},
		],
		[
			ragieWebhooksNested.connections.syncStarted,
			{
				type: 'connection_sync_started',
				payload: { connection_id: 'c1' },
				nonce: 'n',
			},
		],
		[
			ragieWebhooksNested.connections.syncProgress,
			{
				type: 'connection_sync_progress',
				payload: { connection_id: 'c1' },
				nonce: 'n',
			},
		],
		[
			ragieWebhooksNested.connections.syncFinished,
			{
				type: 'connection_sync_finished',
				payload: { connection_id: 'c1' },
				nonce: 'n',
			},
		],
		[
			ragieWebhooksNested.connections.limitExceeded,
			{
				type: 'connection_limit_exceeded',
				payload: { connection_id: 'c1' },
				nonce: 'n',
			},
		],
		[
			ragieWebhooksNested.partitions.limitExceeded,
			{
				type: 'partition_limit_exceeded',
				payload: { partition: 'acme' },
				nonce: 'n',
			},
		],
	])('handles %#', async (webhook, payload) => {
		const request = delivery(payload);
		expect(webhook.match(request)).toBe(true);
		const result = await webhook.handler(
			{ key: SECRET } as unknown as RagieContext,
			request,
		);
		expect(result.success).toBe(true);
	});

	it('does not claim unsigned or foreign deliveries', () => {
		expect(
			isRagieDelivery({
				headers: {},
				body: JSON.stringify(STATUS_UPDATED),
			} as RawWebhookRequest),
		).toBe(false);
		expect(isRagieDelivery(delivery({ type: 'invoice.paid' }))).toBe(false);
	});
});

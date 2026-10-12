import { createHmac } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import type { CodaContext } from './index';
import { DocWebhooks, PageWebhooks } from './webhooks';
import type { CodaAuditBatch } from './webhooks/types';
import { isCodaWebhook } from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const SECRET = 'whsec-test';

function entityClient() {
	return {
		findByEntityId: jest.fn(),
		existsByEntityId: jest.fn(),
		findIdByEntityId: jest.fn(),
		findById: jest.fn(),
		findManyByEntityIds: jest.fn(),
		list: jest.fn(),
		search: jest.fn(),
		upsertByEntityId: jest.fn(),
		deleteById: jest.fn(),
		deleteByEntityId: jest.fn(),
		count: jest.fn(),
	};
}

const documents = entityClient();
const tables = entityClient();

// Safe: the webhook handlers only read `key` and `db` from the context, and logEventFromContext is mocked.
// A narrower type is not practical because CodaContext also requires the database adapter, tenant and options wiring of a full Corsair instance.
const ctx = {
	key: SECRET,
	$getAccountId: async () => 'test-account-id',
	options: { authType: 'api_key' },
	keys: {
		get_dek: jest.fn(),
		issue_new_dek: jest.fn(),
		get_api_key: jest.fn(),
		get_webhook_signature: jest.fn(),
		set_api_key: jest.fn(),
		set_webhook_signature: jest.fn(),
	},
	endpoints: {},
	db: { documents, tables },
} as CodaContext;

const base = {
	timestamp: 1614175261,
	result: 'Success',
	organizationId: 'org-1AbcdeFgh1',
	user: { type: 'user', id: 42, email: 'maker@example.com' },
	userContext: { source: 'browser' },
} as const;

const doc = {
	id: 'AbCDeFGH',
	type: 'doc',
	docType: 'doc',
	name: 'Launch plan',
	href: 'https://coda.io/apis/v1/docs/AbCDeFGH',
	browserLink: 'https://coda.io/d/_dAbCDeFGH',
	folderId: 'fl-1Ab234',
	workspaceId: 'ws-1Ab234',
} as const;

const page = {
	id: 'canvas-IjkLmnO',
	type: 'page',
	name: 'Launch Status',
	href: 'https://coda.io/apis/v1/docs/AbCDeFGH/pages/canvas-IjkLmnO',
	browserLink: 'https://coda.io/d/_dAbCDeFGH/Launch-Status_sumnO',
} as const;

const batch: CodaAuditBatch = {
	events: [
		{
			...base,
			eventId: 'ev-1',
			action: 'CreateDoc',
			entity: { type: 'doc', doc },
		},
		{
			...base,
			eventId: 'ev-2',
			action: 'DeleteDoc',
			entity: { type: 'doc', doc },
		},
		{
			...base,
			eventId: 'ev-3',
			action: 'CreatePage',
			entity: { type: 'page', page },
		},
		{
			...base,
			eventId: 'ev-4',
			action: 'EditPage',
			entity: { type: 'page', page },
		},
		{
			...base,
			eventId: 'ev-5',
			action: 'OpenDoc',
			entity: { type: 'doc', doc },
		},
	],
};

const rawBody = JSON.stringify(batch);
const signature = createHmac('sha256', SECRET).update(rawBody).digest('hex');

function delivery(sig = signature) {
	return {
		payload: batch,
		rawBody,
		headers: { 'x-webhook-signature': sig, 'content-type': 'application/json' },
	};
}

function eventIds(data: { events: { eventId: string }[] } | undefined) {
	return data?.events.map((event) => event.eventId);
}

describe('Coda webhooks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('echoes X-Webhook-Code on the ownership handshake', async () => {
		const handshake = {
			payload: { events: [] },
			headers: { 'x-webhook-code': 'code-123' },
		};

		expect(isCodaWebhook({ headers: handshake.headers, body: {} })).toBe(true);
		expect(
			DocWebhooks.created.match({ headers: handshake.headers, body: {} }),
		).toBe(true);
		await expect(DocWebhooks.created.handler(ctx, handshake)).resolves.toEqual({
			success: true,
			statusCode: 200,
			responseHeaders: { 'X-Webhook-Code': 'code-123' },
		});
	});

	it('matches each webhook only to batches containing its events', () => {
		const signed = { headers: delivery().headers, body: batch };
		const onlyOpen = {
			headers: delivery().headers,
			body: { events: [batch.events[4]] },
		};
		const unsigned = { headers: {}, body: batch };

		expect(DocWebhooks.created.match(signed)).toBe(true);
		expect(DocWebhooks.created.match(onlyOpen)).toBe(false);
		expect(DocWebhooks.created.match(unsigned)).toBe(false);
		expect(PageWebhooks.updated.match(signed)).toBe(true);
		expect(isCodaWebhook(unsigned)).toBe(false);
	});

	it('docs.created returns created docs and saves them', async () => {
		const response = await DocWebhooks.created.handler(ctx, delivery());

		expect(response.success).toBe(true);
		expect(eventIds(response.data)).toEqual(['ev-1']);
		expect(documents.upsertByEntityId.mock.calls).toEqual([
			[
				'AbCDeFGH',
				{
					id: 'AbCDeFGH',
					name: 'Launch plan',
					type: 'doc',
					href: 'https://coda.io/apis/v1/docs/AbCDeFGH',
					browserLink: 'https://coda.io/d/_dAbCDeFGH',
				},
			],
		]);
		expect(jest.mocked(logEventFromContext).mock.calls[0]?.slice(1)).toEqual([
			'coda.webhook.docs.created',
			{ eventIds: ['ev-1'] },
			'completed',
		]);
	});

	it('docs.deleted returns deleted docs and removes them', async () => {
		const response = await DocWebhooks.deleted.handler(ctx, delivery());

		expect(eventIds(response.data)).toEqual(['ev-2']);
		expect(documents.deleteByEntityId.mock.calls).toEqual([['AbCDeFGH']]);
	});

	it('pages.created and pages.updated return their page events', async () => {
		const created = await PageWebhooks.created.handler(ctx, delivery());
		const updated = await PageWebhooks.updated.handler(ctx, delivery());

		expect(eventIds(created.data)).toEqual(['ev-3']);
		expect(created.data?.events[0]?.entity.page.name).toBe('Launch Status');
		expect(eventIds(updated.data)).toEqual(['ev-4']);
	});

	it('rejects a delivery whose signature does not match', async () => {
		const response = await DocWebhooks.created.handler(
			ctx,
			delivery('0'.repeat(64)),
		);

		expect(response).toEqual({
			success: false,
			statusCode: 401,
			error: 'Signature mismatch',
		});
		expect(documents.upsertByEntityId).not.toHaveBeenCalled();
	});
});

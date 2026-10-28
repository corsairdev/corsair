import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { InstantlyAPIError } from './client';
import { instantly } from './index';
import {
	bulkAddResult,
	CAMPAIGN_ID,
	EMAIL_ID,
	errorBody,
	LEAD_ID,
	lead,
	replyPayload,
	SENDER,
	workspace,
} from './test-fixtures';
import { INSTANTLY_WEBHOOK_SECRET_HEADER } from './webhooks/types';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient(options: Parameters<typeof instantly>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'instantly', 'default');
	const corsair = createCorsair({
		plugins: [instantly(options)],
		database: testDb.db,
		kek: KEK,
	});
	await corsair.instantly.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

const reply = {
	reply_to_uuid: EMAIL_ID,
	eaccount: SENDER,
	subject: 'Re: Quick question, Jordan',
	body: { text: 'Tuesday 10am works.' },
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Instantly plugin through createCorsair', () => {
	it('fails with an auth error before calling Instantly when no key is set', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.instantly.api.workspace.get({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.instantly.keys.set_api_key('in-stored-key');
			respond(workspace);

			const result = await corsair.instantly.api.workspace.get({});

			expect(result.plan_id).toBe('pid_g_v2');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.instantly.ai/api/v2/workspaces/current');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer in-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited read and returns the next page', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			respond(errorBody(429, 'Too many requests'), 429, { 'Retry-After': '1' });
			respond({ items: [lead] });

			const result = await corsair.instantly.api.leads.list({
				campaign: CAMPAIGN_ID,
			});

			expect(result.items[0]?.id).toBe(LEAD_ID);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a reply, even after a 429', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			respond(errorBody(429, 'Too many requests'), 429, { 'Retry-After': '1' });

			// unknown: a rejection can be any value until toMatchObject checks it.
			const error = await corsair.instantly.api.emails
				.reply(reply)
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(InstantlyAPIError);
			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never retries a bulk lead add after a 500', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			respond(errorBody(500, 'Internal'), 500);

			await expect(
				corsair.instantly.api.leads.addBulk({
					campaign_id: CAMPAIGN_ID,
					leads: [{ email: 'jordan@acme-logistics.com' }],
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('defaults skip_if_in_workspace to true on a bulk add', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			respond(bulkAddResult);

			const result = await corsair.instantly.api.leads.addBulk({
				campaign_id: CAMPAIGN_ID,
				leads: [{ email: 'jordan@acme-logistics.com' }],
			});

			expect(result.remaining_in_plan).toBe(998);
			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(JSON.parse(String(init.body))).toMatchObject({
				skip_if_in_workspace: true,
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('stores listed leads and logs the call', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			respond({ items: [lead] });

			await corsair.instantly.api.leads.list({ campaign: CAMPAIGN_ID });

			const stored = await corsair.instantly.db.leads.findByEntityId(LEAD_ID);
			expect(stored?.data).toMatchObject({
				email: 'jordan@acme-logistics.com',
				company_name: 'Acme Logistics',
				campaign: CAMPAIGN_ID,
			});
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'instantly.leads.list' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Instantly webhooks through processWebhook', () => {
	const SECRET = 'instantly-hook-secret';

	it('routes a verified reply to emails.replyReceived', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			await corsair.instantly.keys.set_webhook_signature(SECRET);

			const result = await processWebhook(
				corsair,
				{ [INSTANTLY_WEBHOOK_SECRET_HEADER]: SECRET },
				JSON.stringify(replyPayload),
			);

			expect(result.plugin).toBe('instantly');
			expect(result.action).toBe('emails.replyReceived');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'instantly.webhook.replyReceived' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a delivery with the wrong secret and logs nothing', async () => {
		const { corsair, testDb } = await createClient({ key: 'in-key' });
		try {
			await corsair.instantly.keys.set_webhook_signature(SECRET);

			const response =
				await corsair.instantly.webhooks.emails.replyReceived.handler({
					payload: replyPayload,
					headers: { [INSTANTLY_WEBHOOK_SECRET_HEADER]: 'wrong' },
					rawBody: JSON.stringify(replyPayload),
				});

			expect(response).toMatchObject({ success: false, statusCode: 401 });
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'instantly.webhook.replyReceived' },
			});
			expect(events).toHaveLength(0);
		} finally {
			testDb.cleanup();
		}
	});
});

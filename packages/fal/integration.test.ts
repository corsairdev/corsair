import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { fal } from './index';
import { completedBody, createFalSigner, REQUEST_ID } from './test-fixtures';
import {
	FAL_JWKS_URL,
	fetchFalJwks,
	RequestCompletedEventSchema,
	resetFalJwksCache,
} from './webhooks/types';

async function createClient(options: Parameters<typeof fal>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'fal', 'default');
	const corsair = createCorsair({
		plugins: [fal(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const { jwks, sign } = createFalSigner();
let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockImplementationOnce(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' },
			}),
	);
}

const queued = {
	status: 'IN_QUEUE',
	request_id: REQUEST_ID,
	response_url: `https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
	queue_position: 0,
};

beforeEach(() => {
	resetFalJwksCache();
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('fal plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.fal.keys.issue_new_dek();
			await expect(
				corsair.fal.api.models.pricing({ endpointIds: ['fal-ai/flux/dev'] }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key as "Key <key>" to the queue', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.fal.keys.issue_new_dek();
			await corsair.fal.keys.set_api_key('fal-stored-key');
			respond(queued);

			const submitted = await corsair.fal.api.queue.submit({
				endpointId: 'fal-ai/flux/schnell',
				input: { prompt: 'a lighthouse' },
			});

			expect(submitted.request_id).toBe(REQUEST_ID);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://queue.fal.run/fal-ai/flux/schnell');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Key fal-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('follows a request to SUCCEEDED with its output', async () => {
		const { corsair, testDb } = await createClient({ key: 'fal-key' });
		try {
			respond({
				...queued,
				status: 'COMPLETED',
				metrics: { inference_time: 0.7 },
			});
			respond(completedBody.payload);

			const status = await corsair.fal.api.queue.status({
				responseUrl: queued.response_url,
			});

			expect(status.state).toBe('SUCCEEDED');
			expect(status.output).toEqual(completedBody.payload);
			expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
				`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/status`,
				`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
			]);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a bad input to models.run as FAILED, read once', async () => {
		const { corsair, testDb } = await createClient({ key: 'fal-key' });
		try {
			respond(queued);
			// fal's status stream: one event, then it closes.
			fetchMock.mockImplementationOnce(
				async () =>
					new Response('data: {"status":"COMPLETED"}\n\n', {
						status: 200,
						headers: { 'Content-Type': 'text/event-stream' },
					}),
			);
			respond({ ...queued, status: 'COMPLETED' });
			respond(
				{ detail: [{ loc: ['body', 'prompt'], msg: 'Field required' }] },
				422,
			);
			const response = await corsair.fal.api.models.run({
				endpointId: 'fal-ai/flux/schnell',
				input: {},
			});
			expect(response).toMatchObject({
				state: 'FAILED',
				error: '422: body.prompt: Field required',
			});
			expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
				'https://queue.fal.run/fal-ai/flux/schnell',
				`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/status/stream`,
				`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/status`,
				`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
			]);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('fal webhooks through processWebhook', () => {
	function serveJwks() {
		fetchMock.mockImplementation(async (url: string | URL | Request) => {
			if (String(url) === FAL_JWKS_URL) {
				return new Response(JSON.stringify({ keys: jwks }), { status: 200 });
			}
			throw new Error(`unexpected fetch ${String(url)}`);
		});
	}

	it('routes a signed delivery to requests.completed and logs it', async () => {
		const { corsair, testDb } = await createClient({ key: 'fal-key' });
		try {
			serveJwks();
			const delivery = sign();

			const result = await processWebhook(
				corsair,
				delivery.headers,
				delivery.rawBody,
			);

			expect(result.plugin).toBe('fal');
			expect(result.action).toBe('requests.completed');
			expect(result.response?.statusCode ?? 200).toBe(200);
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'fal.webhook.requests.completed' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('verifies a delivery passed as parsed JSON, as the generic handler does', async () => {
		const { corsair, testDb } = await createClient({ key: 'fal-key' });
		try {
			serveJwks();
			const delivery = sign();

			const result = await processWebhook(
				corsair,
				delivery.headers,
				// unknown: the parsed webhook body, as a JSON route handler would pass it.
				delivery.body as Record<string, unknown>,
			);

			expect(result.action).toBe('requests.completed');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'fal.webhook.requests.completed' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses a delivery made for a different fal account than the one stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			serveJwks();
			await corsair.fal.keys.issue_new_dek();
			await corsair.fal.keys.set_api_key('fal-key');
			// unknown: set_user_id comes from falAuthConfig's account fields, which
			// the generic key manager type does not list.
			const keys = corsair.fal.keys as unknown as {
				set_user_id: (value: string) => Promise<void>;
			};
			await keys.set_user_id('github|someone-else');
			const delivery = sign();

			const response = await corsair.fal.webhooks.requests.completed.handler({
				payload: RequestCompletedEventSchema.parse(delivery.body),
				headers: delivery.headers,
				rawBody: delivery.rawBody,
			});

			expect(response).toMatchObject({ success: false, statusCode: 403 });

			// Through processWebhook the refusal shows only as nothing logged:
			// it answers the sender the same either way.
			const routed = await processWebhook(
				corsair,
				delivery.headers,
				delivery.rawBody,
			);
			expect(routed.action).toBe('requests.completed');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'fal.webhook.requests.completed' },
			});
			expect(events).toHaveLength(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses a delivery whose body was changed in transit', async () => {
		const { corsair, testDb } = await createClient({ key: 'fal-key' });
		try {
			serveJwks();
			const delivery = sign();
			const tampered = delivery.rawBody.replace('35683856', '1');

			// processWebhook answers the sender the same either way; what shows
			// the refusal is that nothing was logged and the handler said 401.
			const result = await processWebhook(corsair, delivery.headers, tampered);
			expect(result.plugin).toBe('fal');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'fal.webhook.requests.completed' },
			});
			expect(events).toHaveLength(0);

			// Keys loaded over a minute ago, so the miss refetches and is final.
			resetFalJwksCache();
			await fetchFalJwks(Date.now() - 120_000);
			const response = await corsair.fal.webhooks.requests.completed.handler({
				payload: JSON.parse(tampered),
				headers: delivery.headers,
				rawBody: tampered,
			});
			expect(response).toMatchObject({ success: false, statusCode: 401 });
		} finally {
			testDb.cleanup();
		}
	});
});

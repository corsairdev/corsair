import { logEventFromContext } from 'corsair/core';
import { Lists, Subscribers } from './endpoints';
import {
	invalidKeyEnvelope,
	mailingList,
	paging,
	subscriber,
	unknownListEnvelope,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'moosend-key-123';

const ctx = { key: API_KEY, options: {}, keys: {} };

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON envelopes.
function respond(envelope: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(envelope), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a Context can be any JSON value the endpoint returns.
const ok = (context: unknown) => ({ Code: 0, Error: null, Context: context });

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('lists', () => {
	it('lists every active mailing list and wraps the context', async () => {
		respond(ok([mailingList]));

		const result = await invoke(Lists.list, {});

		expect(lastRequest()).toMatchObject({
			path: '/v3/lists.json',
			method: 'GET',
		});
		expect(result).toEqual({ mailingLists: [mailingList] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'moosend.lists.list',
			{ lists: 1 },
			'completed',
		);
	});

	it('lists paged and maps the snake_case context keys', async () => {
		respond(ok({ mailing_lists: [mailingList], paging }));

		const result = await invoke(Lists.listPaged, { page: 2, pageSize: 10 });

		expect(lastRequest().path).toBe('/v3/lists/2/10.json');
		expect(result).toEqual({
			mailingLists: [mailingList],
			paging,
		});
	});

	it('gets details with the statistics flag', async () => {
		respond(ok(mailingList));

		const result = await invoke(Lists.get, {
			mailingListId: mailingList.id as string,
			withStatistics: false,
		});

		expect(lastRequest().path).toBe(`/v3/lists/${mailingList.id}/details.json`);
		expect(lastRequest().query).toEqual({
			apikey: API_KEY,
			withStatistics: 'false',
		});
		expect(result).toEqual({ mailingList });
	});

	it('creates with the model keys', async () => {
		respond(ok(mailingList));

		await invoke(Lists.create, {
			name: 'Newsletter',
			confirmationPage: 'https://example.com/confirmed',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v3/lists/create.json',
		});
		expect(lastRequest().body).toEqual({
			name: 'Newsletter',
			confirmation_page: 'https://example.com/confirmed',
			redirect_after_unsubscribe_page: undefined,
		});
	});

	it('updates and deletes', async () => {
		respond(ok(mailingList));
		await invoke(Lists.update, {
			mailingListId: mailingList.id as string,
			name: 'Renamed',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/lists/${mailingList.id}/update.json`,
		});
		expect(lastRequest().body).toEqual({
			name: 'Renamed',
			confirmation_page: undefined,
			redirect_after_unsubscribe_page: undefined,
		});

		respond(ok(null));
		await invoke(Lists.remove, { mailingListId: mailingList.id as string });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/v3/lists/${mailingList.id}/delete.json`,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'moosend.lists.delete',
			{ mailingListId: mailingList.id },
			'completed',
		);
	});

	it('rejects a sort method the API does not define', async () => {
		await expect(
			invoke(Lists.list, { sortMethod: 'SIDEWAYS' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('throws the envelope error for an unknown list', async () => {
		respond(unknownListEnvelope);

		// unknown: a promise can reject with any value, so the rejection
		// reason has no static type; the assertions narrow it.
		const error = await invoke(Lists.get, {
			mailingListId: 'missing',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({
			code: 209,
			moosendError: 'MAILING_LIST_NOT_FOUND',
		});
	});
});

describe('subscribers', () => {
	it('lists by status with paging', async () => {
		respond(ok({ subscribers: [subscriber], paging }));

		const result = await invoke(Subscribers.list, {
			mailingListId: mailingList.id as string,
			status: 'subscribed',
			page: 1,
			pageSize: 10,
		});

		expect(lastRequest().path).toBe(
			`/v3/lists/${mailingList.id}/subscribers/subscribed.json`,
		);
		expect(lastRequest().query).toEqual({
			apikey: API_KEY,
			page: '1',
			pageSize: '10',
		});
		expect(result).toEqual({ subscribers: [subscriber], paging });
	});

	it('rejects an unknown status', async () => {
		await expect(
			invoke(Subscribers.list, {
				mailingListId: 'x',
				status: 'archived',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('finds by email and by id', async () => {
		respond(ok(subscriber));

		const byEmail = await invoke(Subscribers.getByEmail, {
			mailingListId: mailingList.id as string,
			email: 'jana.berger@beachy.example',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/v3/subscribers/${mailingList.id}/view.json`,
		});
		expect(lastRequest().query).toEqual({
			email: 'jana.berger@beachy.example',
			apikey: API_KEY,
		});
		expect(byEmail).toEqual({ subscriber });

		respond(ok(subscriber));
		await invoke(Subscribers.getById, {
			mailingListId: mailingList.id as string,
			subscriberId: subscriber.id as string,
		});
		expect(lastRequest().path).toBe(
			`/v3/subscribers/${mailingList.id}/find/${subscriber.id}.json`,
		);
	});

	it('subscribes with the model keys', async () => {
		respond(ok(subscriber));

		const result = await invoke(Subscribers.subscribe, {
			mailingListId: mailingList.id as string,
			email: 'jana.berger@beachy.example',
			name: 'Jana Berger',
			customFields: { Country: 'NL' },
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/subscribers/${mailingList.id}/subscribe.json`,
		});
		expect(lastRequest().body).toEqual({
			email: 'jana.berger@beachy.example',
			name: 'Jana Berger',
			custom_fields: { Country: 'NL' },
		});
		expect(result).toEqual({ subscriber });
	});

	it('subscribes many in one call', async () => {
		respond(ok(null));

		const result = await invoke(Subscribers.subscribeMany, {
			mailingListId: mailingList.id as string,
			subscribers: [
				{ email: 'a@example.com' },
				{ email: 'b@example.com', name: 'B' },
			],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/subscribers/${mailingList.id}/subscribe_many.json`,
		});
		expect(lastRequest().body).toEqual({
			subscribers: [
				{ email: 'a@example.com', name: undefined, custom_fields: undefined },
				{ email: 'b@example.com', name: 'B', custom_fields: undefined },
			],
		});
		expect(result).toBeNull();
	});

	it('unsubscribes and removes', async () => {
		respond(ok(null));
		await invoke(Subscribers.unsubscribe, {
			mailingListId: mailingList.id as string,
			email: 'jana.berger@beachy.example',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/subscribers/${mailingList.id}/unsubscribe.json`,
		});
		expect(lastRequest().body).toEqual({
			email: 'jana.berger@beachy.example',
		});

		respond(ok(null));
		await invoke(Subscribers.remove, {
			mailingListId: mailingList.id as string,
			email: 'jana.berger@beachy.example',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/v3/subscribers/${mailingList.id}/remove.json`,
		});
	});

	it('rejects a malformed email before sending', async () => {
		await expect(
			invoke(Subscribers.subscribe, {
				mailingListId: mailingList.id as string,
				email: 'not-an-email',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('envelope errors', () => {
	it('throws the invalid-key envelope with its code', async () => {
		respond(invalidKeyEnvelope);

		const error = await invoke(Lists.list, {}).catch(
			(caught: unknown) => caught,
		);

		expect(error).toMatchObject({
			code: 104,
			moosendError: 'API_KEY_NOT_VALID',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

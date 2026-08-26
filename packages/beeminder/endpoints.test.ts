import { logEventFromContext } from 'corsair/core';
import { Charges, Goals, User } from './endpoints';
import { beeminderEndpointMeta, beeminderEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Ctx = Parameters<typeof User.get>[0];

function makeCtx(overrides: { username?: string; authType?: string } = {}) {
	return {
		key: 'test-token',
		options: {
			username: overrides.username,
			authType: overrides.authType ?? 'api_key',
		},
	} as unknown as Ctx;
}

let captured: { url: string; method: string; body?: string } | undefined;

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function pathAndQuery(): { path: string; query: URLSearchParams } {
	const url = new URL(captured?.url ?? 'http://invalid');
	return { path: url.pathname, query: url.searchParams };
}

describe('Beeminder endpoints', () => {
	it('user.get calls GET /users/{username}.json', async () => {
		mockFetch({ username: 'alice', timezone: 'UTC', goals: ['weight'] });
		const out = await User.get(makeCtx({ username: 'alice' }), {});
		const { path, query } = pathAndQuery();
		expect(path).toBe('/api/v1/users/alice.json');
		expect(query.get('auth_token')).toBe('test-token');
		expect(out.username).toBe('alice');
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'beeminder.user.get',
			expect.any(Object),
			'completed',
		);
	});

	it('user.get falls back to me and forwards documented query params', async () => {
		mockFetch({ username: 'alice', goals: [] });
		await User.get(makeCtx(), {
			associations: true,
			diff_since: 1,
			skinny: true,
			emaciated: true,
			datapoints_count: 3,
		});
		const { path, query } = pathAndQuery();
		expect(path).toBe('/api/v1/users/me.json');
		expect(query.get('associations')).toBe('true');
		expect(query.get('diff_since')).toBe('1');
		expect(query.get('skinny')).toBe('true');
		expect(query.get('emaciated')).toBe('true');
		expect(query.get('datapoints_count')).toBe('3');
	});

	it('goals.list calls GET /users/{u}/goals.json', async () => {
		mockFetch([{ slug: 'weight', title: 'Weight' }]);
		const out = await Goals.list(makeCtx({ username: 'alice' }), {
			emaciated: true,
		});
		const { path, query } = pathAndQuery();
		expect(path).toBe('/api/v1/users/alice/goals.json');
		expect(query.get('emaciated')).toBe('true');
		expect(out).toHaveLength(1);
		expect(out[0]?.slug).toBe('weight');
	});

	it('goals.listArchived calls GET /users/{u}/goals/archived.json', async () => {
		mockFetch([]);
		await Goals.listArchived(makeCtx({ username: 'alice' }), {});
		expect(pathAndQuery().path).toBe('/api/v1/users/alice/goals/archived.json');
	});

	it('charges.create POSTs /charges.json as form fields', async () => {
		mockFetch({ id: 'ch1', amount: 1, username: 'alice' });
		const out = await Charges.create(makeCtx(), {
			user_id: 'alice',
			amount: 1,
			note: 'test',
			dryrun: true,
		});
		expect(captured?.method).toBe('POST');
		expect(new URL(captured?.url ?? '').pathname).toBe('/api/v1/charges.json');
		expect(captured?.body).toContain('user_id=alice');
		expect(captured?.body).toContain('dryrun=true');
		expect(out.id).toBe('ch1');
	});

	it('covers every registered operation', () => {
		expect(Object.keys(beeminderEndpointMeta).sort()).toEqual([
			'charges.create',
			'goals.list',
			'goals.listArchived',
			'user.get',
		]);
		expect(Object.keys(beeminderEndpointSchemas).sort()).toEqual(
			Object.keys(beeminderEndpointMeta).sort(),
		);
	});
});

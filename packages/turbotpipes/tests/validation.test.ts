import { createCorsair } from 'corsair/core';
import { turbotpipes } from '../index';

type Sent = { method: string; path: string; search: string; body: unknown };
// unknown is necessary: each fake route answers with its own JSON body.
type Answer = { status?: number; body?: unknown };

const originalFetch = globalThis.fetch;
let sent: Sent[] = [];
let answers: Record<string, Answer> = {};

beforeAll(() => {
	globalThis.fetch = async (
		input: Parameters<typeof fetch>[0],
		init?: RequestInit,
	) => {
		const url = new URL(String(input));
		const method = init?.method ?? 'GET';
		sent.push({
			method,
			path: url.pathname.replace('/api/v1/', ''),
			search: url.search,
			body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
		});
		const answer = answers[`${method} ${url.pathname}`];
		if (!answer)
			throw new Error(`unexpected request ${method} ${url.pathname}`);
		if (answer.status === 204) return new Response(null, { status: 204 });
		return new Response(JSON.stringify(answer.body), {
			status: answer.status ?? 200,
			headers: { 'Content-Type': 'application/json' },
		});
	};
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

beforeEach(() => {
	sent = [];
	answers = {};
});

const api = () =>
	createCorsair({ plugins: [turbotpipes({ key: 'tpt_test' })] }).turbotpipes
		.api;

describe('input validation through createCorsair', () => {
	it('rejects a missing required field before any request', async () => {
		await expect(
			// as is necessary: the call deliberately breaks the typed input.
			api().users.get({} as unknown as { user_handle: string }),
		).rejects.toThrow(/user_handle/);
		expect(sent).toHaveLength(0);
	});

	it('rejects a wrong type', async () => {
		await expect(
			api().actor.listWorkspaces({
				// as is necessary: the call deliberately breaks the typed input.
				limit: 'ten' as unknown as number,
			}),
		).rejects.toThrow(/limit/);
		expect(sent).toHaveLength(0);
	});

	it('rejects a path traversal value before any request', async () => {
		await expect(
			api().connections.deleteOrgConnectionPermission({
				org_handle: 'acme',
				connection_handle: 'aws',
				permission_id: '../../../../acme',
			}),
		).rejects.toThrow(/path segment/);
		expect(sent).toHaveLength(0);
	});

	it('drops unknown keys so they never reach the query or body', async () => {
		answers['GET /api/v1/user/bob/workspace'] = { body: { items: [] } };
		await api().users.listWorkspaces({
			user_handle: 'bob',
			// as is necessary: the call deliberately adds an undeclared key.
			...({ injected: 'x' } as object),
		} as { user_handle: string });
		expect(sent[0]?.search).toBe('');
	});
});

describe('output validation through createCorsair', () => {
	it('fails when the response does not match the output schema', async () => {
		answers['GET /api/v1/actor'] = { body: { unexpected: true } };
		await expect(api().actor.get({})).rejects.toThrow(
			/actor\.get: Turbot Pipes returned a response that does not match/,
		);
	});

	it('returns the original response, keeping provider fields', async () => {
		answers['GET /api/v1/user/bob'] = {
			body: {
				id: 'u_1',
				handle: 'bob',
				status: 'accepted',
				tenant: { handle: 'turbot-pipes' },
			},
		};
		const user = await api().users.get({ user_handle: 'bob' });
		expect(user).toMatchObject({
			status: 'accepted',
			tenant: { handle: 'turbot-pipes' },
		});
	});

	it('a delete returns the deleted record', async () => {
		answers['DELETE /api/v1/org/acme'] = {
			body: { id: 'o_1', handle: 'acme' },
		};
		await expect(api().orgs.delete({ org_handle: 'acme' })).resolves.toEqual({
			id: 'o_1',
			handle: 'acme',
		});
	});

	it('a 204 delete returns an empty object', async () => {
		answers['DELETE /api/v1/user/bob/integration/aws'] = { status: 204 };
		await expect(
			api().integrations.deleteUserIntegration({
				user_handle: 'bob',
				integration_handle: 'aws',
			}),
		).resolves.toEqual({});
	});

	it('an upcoming invoice can be null', async () => {
		answers['GET /api/v1/user/bob/billing/invoice/upcoming'] = { body: null };
		await expect(
			api().billing.getUserBillingUpcomingInvoice({ user_handle: 'bob' }),
		).resolves.toBeNull();
	});
});

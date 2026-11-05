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

describe('list pagination through createCorsair', () => {
	it('forwards paging and filter params, and only those', async () => {
		answers['GET /api/v1/user/bob/constraint'] = {
			body: { items: [{ id: 'c_1' }], next_token: 'page2' },
		};
		const page = await api().users.listConstraints({
			user_handle: 'bob',
			where: "name = 'x'",
			limit: 1,
			next_token: 'page1',
		});
		expect(page.next_token).toBe('page2');
		expect(sent[0]?.path).toBe('user/bob/constraint');
		expect(Object.fromEntries(new URLSearchParams(sent[0]?.search))).toEqual({
			where: "name = 'x'",
			limit: '1',
			next_token: 'page1',
		});
	});

	it('sends no query when no paging params are given', async () => {
		answers['GET /api/v1/user/bob/workspace/dev/process'] = {
			body: { items: [] },
		};
		await api().workspaces.listUserWorkspaceProcesses({
			user_handle: 'bob',
			workspace_handle: 'dev',
		});
		expect(sent[0]?.search).toBe('');
	});

	it('forwards list-specific params (q, include, prefix)', async () => {
		answers['GET /api/v1/identity'] = { body: { items: [] } };
		answers['GET /api/v1/org/acme/service_account'] = { body: { items: [] } };
		answers['GET /api/v1/user/bob/workspace/dev/connection_tree'] = {
			body: { items: [] },
		};
		await api().identities.listIdentities({ q: 'pranay', limit: 5 });
		await api().orgs.listServiceAccounts({
			org_handle: 'acme',
			include: 'tokens',
			limit: 500,
		});
		await api().workspaces.listUserWorkspaceConnectionTree({
			user_handle: 'bob',
			workspace_handle: 'dev',
			prefix: 'aws',
		});
		expect(sent.map((s) => s.search)).toEqual([
			'?q=pranay&limit=5',
			'?limit=500&include=tokens',
			'?prefix=aws',
		]);
	});

	it('pages permissions only when listing them', async () => {
		answers['GET /api/v1/org/acme/connection/aws/permission'] = {
			body: { items: [] },
		};
		answers['GET /api/v1/org/acme/connection/aws/permission/p_1'] = {
			body: { id: 'p_1' },
		};
		await api().connections.getOrgConnectionPermission({
			org_handle: 'acme',
			connection_handle: 'aws',
			limit: 10,
		});
		await api().connections.getOrgConnectionPermission({
			org_handle: 'acme',
			connection_handle: 'aws',
			permission_id: 'p_1',
			limit: 10,
		});
		expect(sent.map((s) => s.search)).toEqual(['?limit=10', '']);
	});

	it('rejects page sizes outside what Pipes accepts', async () => {
		for (const limit of [0, 101, 2.5]) {
			await expect(
				api().users.listConstraints({ user_handle: 'bob', limit }),
			).rejects.toThrow(/limit/);
		}
		expect(sent).toHaveLength(0);
	});
});

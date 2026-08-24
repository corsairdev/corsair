import {
	ApiKeySchema,
	InviteSchema,
	OrganizationSchema,
	UserSchema,
	WorkspaceSchema,
} from './endpoints/types';
import type { AnthropicAdministratorContext } from './index';

/**
 * Live suite against api.anthropic.com. Requires an Admin API key
 * (`sk-ant-admin…`) — a standard API key is rejected by these endpoints.
 * Excluded from CI by path; enable with:
 *
 *   ANTHROPIC_ADMIN_API_KEY=sk-ant-admin-… LIVE_TEST=1 pnpm test
 *
 * Read-only operations only: this suite never creates, updates, archives or
 * deletes anything in a real organization.
 */
const ADMIN_KEY = process.env.ANTHROPIC_ADMIN_API_KEY;
const LIVE = process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';

type Ops = Record<
	string,
	Record<
		string,
		(
			c: AnthropicAdministratorContext,
			i: Record<string, unknown>,
		) => Promise<unknown>
	>
>;

let ops: Ops;

function op(group: string, name: string) {
	const fn = ops[group]?.[name];
	if (!fn) throw new Error(`missing endpoint ${group}.${name}`);
	return fn;
}

function ctx(key = ADMIN_KEY): AnthropicAdministratorContext {
	return {
		key,
		options: {},
		db: {},
	} as unknown as AnthropicAdministratorContext;
}

const suite = ADMIN_KEY && LIVE ? describe : describe.skip;

suite('Anthropic Admin API (live)', () => {
	beforeAll(async () => {
		const mod = await import('./index');
		ops = mod.anthropicAdministratorEndpointsNested as unknown as Ops;
	});

	it('getOrganization returns the organization for the key', async () => {
		const org = await op('organization', 'getOrganization')(ctx(), {});
		expect(() => OrganizationSchema.parse(org)).not.toThrow();
	});

	it('listUsers returns members matching the documented shape', async () => {
		const res = (await op('users', 'listUsers')(ctx(), { limit: 5 })) as {
			data: unknown[];
			has_more: boolean;
		};
		expect(typeof res.has_more).toBe('boolean');
		for (const user of res.data) {
			expect(() => UserSchema.parse(user)).not.toThrow();
		}
	});

	it('listInvites returns invites matching the documented shape', async () => {
		const res = (await op('invites', 'listInvites')(ctx(), { limit: 5 })) as {
			data: unknown[];
		};
		for (const invite of res.data) {
			expect(() => InviteSchema.parse(invite)).not.toThrow();
		}
	});

	it('listWorkspaces returns workspaces matching the documented shape', async () => {
		const res = (await op('workspaces', 'listWorkspaces')(ctx(), {
			limit: 5,
		})) as { data: unknown[] };
		for (const workspace of res.data) {
			expect(() => WorkspaceSchema.parse(workspace)).not.toThrow();
		}
	});

	it('listApiKeys returns API keys matching the documented shape', async () => {
		const res = (await op('apiKeys', 'listApiKeys')(ctx(), { limit: 5 })) as {
			data: unknown[];
		};
		for (const key of res.data) {
			expect(() => ApiKeySchema.parse(key)).not.toThrow();
		}
	});

	it('honours cursor pagination on listUsers', async () => {
		const page = (await op('users', 'listUsers')(ctx(), { limit: 1 })) as {
			data: unknown[];
			last_id: string | null;
			has_more: boolean;
		};
		expect(page.data.length).toBeLessThanOrEqual(1);

		if (page.has_more && page.last_id) {
			const next = (await op('users', 'listUsers')(ctx(), {
				limit: 1,
				after_id: page.last_id,
			})) as { data: unknown[] };
			expect(next.data).not.toEqual(page.data);
		}
	});

	it('rejects a non-admin key', async () => {
		await expect(
			op('users', 'listUsers')(ctx('sk-ant-not-an-admin-key'), {}),
		).rejects.toThrow();
	});
});

/**
 * Reachability check that needs no credentials: a bogus key must produce a 401
 * `authentication_error` from Anthropic. A 404 or a network error would mean
 * the base URL, path or auth header name is wrong. Enable with LIVE_TEST=1.
 */
const reachability = LIVE ? describe : describe.skip;

reachability('Anthropic Admin API reachability (no key required)', () => {
	beforeAll(async () => {
		const mod = await import('./index');
		ops = mod.anthropicAdministratorEndpointsNested as unknown as Ops;
	});

	it.each([
		['organization', 'getOrganization', {}],
		['users', 'listUsers', { limit: 1 }],
		['workspaces', 'listWorkspaces', { limit: 1 }],
		['apiKeys', 'listApiKeys', { limit: 1 }],
	] as const)(
		'%s.%s resolves to a real endpoint',
		async (group, name, input) => {
			const error = (await op(group, name)(
				ctx('sk-ant-admin-not-a-real-key'),
				input as Record<string, unknown>,
			).catch((e: unknown) => e)) as { status?: number; errorType?: string };

			expect(error.status).toBe(401);
			expect(error.errorType).toBe('authentication_error');
		},
	);
});

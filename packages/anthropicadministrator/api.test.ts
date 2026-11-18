import { AnthropicAdministratorAPIError } from './client';
import { anthropicAdministratorEndpointsNested as api } from './index';
import { makeContext } from './test-helpers';

/**
 * Live suite against api.anthropic.com. Requires an Admin API key
 * (`sk-ant-admin…`); a standard API key is rejected by these endpoints.
 * Skipped unless enabled:
 *
 *   ANTHROPIC_ADMIN_API_KEY=sk-ant-admin-… LIVE_TEST=1 pnpm test
 *
 * Read-only operations only: this suite never creates, updates, archives or
 * deletes anything in a real organization. Responses are validated against the
 * documented schemas by the endpoints themselves, so a resolved call proves
 * the shape.
 */
const ADMIN_KEY = process.env.ANTHROPIC_ADMIN_API_KEY;
const LIVE = process.env.LIVE_TEST === '1' || process.env.LIVE_TEST === 'true';

const live = ADMIN_KEY && LIVE ? describe : describe.skip;

live('Anthropic Admin API (live)', () => {
	const { ctx } = makeContext({ admin: ADMIN_KEY, withDb: false });

	it('getOrganization returns the organization for the key', async () => {
		const org = await api.organization.getOrganization(ctx, {});
		expect(org.type).toBe('organization');
	});

	it('lists users, invites, workspaces and API keys', async () => {
		expect(typeof (await api.users.listUsers(ctx, { limit: 5 })).has_more).toBe(
			'boolean',
		);
		expect(
			Array.isArray((await api.invites.listInvites(ctx, { limit: 5 })).data),
		).toBe(true);
		expect(
			Array.isArray(
				(await api.workspaces.listWorkspaces(ctx, { limit: 5 })).data,
			),
		).toBe(true);
		expect(
			Array.isArray((await api.apiKeys.listApiKeys(ctx, { limit: 5 })).data),
		).toBe(true);
	});

	it('honours cursor pagination on listUsers', async () => {
		const first = await api.users.listUsers(ctx, { limit: 1 });
		expect(first.data.length).toBeLessThanOrEqual(1);

		if (first.has_more && first.last_id) {
			const next = await api.users.listUsers(ctx, {
				limit: 1,
				after_id: first.last_id,
			});
			expect(next.data).not.toEqual(first.data);
		}
	});
});

/**
 * Reachability check that needs no credentials: a bogus key must produce a 401
 * `authentication_error` from Anthropic. A 404 or a network error would mean
 * the base URL, path or auth header name is wrong. Enable with LIVE_TEST=1.
 */
const reachability = LIVE ? describe : describe.skip;

reachability('Anthropic Admin API reachability (no key required)', () => {
	const { ctx } = makeContext({
		admin: 'sk-ant-admin-not-a-real-key',
		withDb: false,
	});

	it.each([
		[
			'organization.getOrganization',
			() => api.organization.getOrganization(ctx, {}),
		],
		['users.listUsers', () => api.users.listUsers(ctx, { limit: 1 })],
		[
			'workspaces.listWorkspaces',
			() => api.workspaces.listWorkspaces(ctx, { limit: 1 }),
		],
		['apiKeys.listApiKeys', () => api.apiKeys.listApiKeys(ctx, { limit: 1 })],
	] as const)('%s resolves to a real endpoint', async (_op, run) => {
		const error = await run().then(
			() => undefined,
			(e: Error) => e,
		);

		expect(error).toBeInstanceOf(AnthropicAdministratorAPIError);
		expect(error).toMatchObject({
			status: 401,
			errorType: 'authentication_error',
		});
	});
});

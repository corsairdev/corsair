const getManagedAccessToken = jest.fn();
const attachManagedRefreshAuth = jest.fn();
jest.mock('../../hub/managed-auth', () => ({
	getManagedAccessToken: (...a: unknown[]) => getManagedAccessToken(...a),
	attachManagedRefreshAuth: (...a: unknown[]) => attachManagedRefreshAuth(...a),
}));

import { bindWebhooksRecursively } from '../webhooks/bind';

beforeEach(() => {
	getManagedAccessToken
		.mockReset()
		.mockResolvedValue({
			accessToken: 'managed-token',
			expiresAt: 0,
			refreshed: false,
		});
	attachManagedRefreshAuth.mockReset().mockResolvedValue(undefined);
});

test('bound webhook handler receives the managed token as ctx.key', async () => {
	let seenKey: unknown;
	const webhooks = {
		onEvent: {
			match: () => true,
			handler: (callCtx: Record<string, unknown>) => {
				seenKey = callCtx.key;
				return 'ok';
			},
		},
	};
	const tree: Record<string, unknown> = {};
	bindWebhooksRecursively({
		webhooks,
		hooks: undefined,
		ctx: {
			authType: 'managed',
			keys: {},
			hub: { apiUrl: 'h' },
			tenantId: 't1',
		},
		webhooksTree: tree,
		keyBuilder: undefined,
		plugin: { id: 'gmail' },
	} as never);

	// bindWebhooksRecursively stores { match, handler } — invoke the bound handler
	await (tree.onEvent as { handler: (r: unknown) => Promise<unknown> }).handler(
		{},
	);
	expect(seenKey).toBe('managed-token');
	expect(getManagedAccessToken).toHaveBeenCalledWith(
		expect.objectContaining({ plugin: 'gmail', tenantId: 't1' }),
	);
});

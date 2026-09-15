import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';
import { startMockRuntime } from './mock-runtime';

describe('cloud client against a mock runtime', () => {
	let mock: ReturnType<typeof startMockRuntime>;

	beforeEach(() => {
		mock = startMockRuntime();
	});

	afterEach(async () => {
		await mock.close();
	});

	it('round-trips tenant create, connect link, and a plugin call', async () => {
		const corsair = createCorsair({
			plugins: [slack()],
			multiTenancy: true,
			hub: { projectApiKey: 'ck_cloud_test', baseUrl: mock.url },
		});

		const tenant = await corsair.manage.tenants.create({ id: 'acme' });
		expect(tenant).toEqual({ id: 'acme' });

		const link = await corsair.manage.connect.createLink({
			plugin: 'slack',
			tenantId: 'acme',
		});
		expect(link.connectUrl).toBe('https://mock.local/oauth');

		const status = await corsair.manage.connectionStatus.get({
			tenantId: 'acme',
		});
		expect(status).toEqual({ slack: 'connected' });

		const result = await corsair
			.withTenant('acme')
			.slack.api.messages.post({ channel: '#g', text: 'hi' });
		expect(result).toEqual({ op: 'messages.post', tenantId: 'acme' });

		expect(mock.calls.map((c) => `${c.method} ${c.path}`)).toEqual([
			'POST /tenants',
			'POST /connect/links',
			'GET /connection-status?tenantId=acme',
			'POST /acme/slack/call/messages.post',
		]);
		expect(mock.calls[0]?.body).toEqual({ id: 'acme' });
	});

	it('surfaces a typed unauthorized error for a wrong key', async () => {
		const corsair = createCorsair({
			plugins: [slack()],
			multiTenancy: true,
			hub: { projectApiKey: 'ck_cloud_wrong', baseUrl: mock.url },
		});

		await expect(
			corsair.manage.tenants.create({ id: 'acme' }),
		).rejects.toMatchObject({ status: 401, code: 'unauthorized' });
	});
});

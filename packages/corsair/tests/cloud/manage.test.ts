import type { CloudTransport } from '../../core/cloud/http';
import { buildCloudManagement } from '../../core/cloud/manage';

function transportWith(res: Response): CloudTransport & { fetch: jest.Mock } {
	return {
		baseUrl: 'https://vm/p/api/corsair',
		apiKey: 'ck_cloud_x',
		fetch: jest.fn().mockResolvedValue(res),
	};
}

function ok(body: unknown) {
	return new Response(JSON.stringify(body), { status: 200 });
}

describe('buildCloudManagement', () => {
	it('connect.createLink posts to /connect/links and returns connectUrl', async () => {
		const t = transportWith(
			ok({ connectUrl: 'https://connect/x', tenantId: 'acme' }),
		);
		const m = buildCloudManagement(t);
		const out = await m.connect.createLink({
			plugin: 'slack',
			tenantId: 'acme',
		});
		expect(out.connectUrl).toBe('https://connect/x');
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/connect/links');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body)).toEqual({
			plugin: 'slack',
			tenantId: 'acme',
		});
	});

	it('connect.createLink throws before issuing a request when plugin is missing', async () => {
		const t = transportWith(ok({}));
		const m = buildCloudManagement(t);
		expect(() => m.connect.createLink({ tenantId: 'acme' } as never)).toThrow(
			/plugin/,
		);
		expect(t.fetch).not.toHaveBeenCalled();
	});

	it('connect.createLink throws before issuing a request when tenantId is missing', async () => {
		const t = transportWith(ok({}));
		const m = buildCloudManagement(t);
		expect(() => m.connect.createLink({ plugin: 'slack' } as never)).toThrow(
			/tenantId/,
		);
		expect(t.fetch).not.toHaveBeenCalled();
	});

	it('tenants.create posts to /tenants', async () => {
		const t = transportWith(ok({ id: 'acme' }));
		const m = buildCloudManagement(t);
		await m.tenants.create({ id: 'acme' });
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/tenants');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body)).toEqual({ id: 'acme' });
	});

	it('tenants.list gets /tenants', async () => {
		const t = transportWith(ok([{ id: 'acme' }]));
		const m = buildCloudManagement(t);
		await m.tenants.list();
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/tenants');
		expect(init.method).toBe('GET');
	});

	it('tenants.get hits /tenants/:id with the id encoded', async () => {
		const t = transportWith(ok({ id: 'a/b' }));
		const m = buildCloudManagement(t);
		await m.tenants.get('a/b');
		const [url] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/tenants/a%2Fb');
	});

	it('connectionStatus.get hits the query route', async () => {
		const t = transportWith(ok({ slack: 'connected' }));
		const m = buildCloudManagement(t);
		const status = await m.connectionStatus.get({ tenantId: 'acme' });
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://vm/p/api/corsair/connection-status?tenantId=acme',
		);
		expect(status).toEqual({ slack: 'connected' });
	});

	it('connectionStatus.get URL-encodes a special-char tenantId in the query string', async () => {
		const t = transportWith(ok({}));
		const m = buildCloudManagement(t);
		await m.connectionStatus.get({ tenantId: 'a b&c' });
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://vm/p/api/corsair/connection-status?tenantId=a%20b%26c',
		);
	});

	it('disconnect posts to /disconnect', async () => {
		const t = transportWith(ok({ ok: true }));
		const m = buildCloudManagement(t);
		await m.disconnect({ tenantId: 'acme', plugin: 'slack' });
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/disconnect');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body)).toEqual({
			tenantId: 'acme',
			plugin: 'slack',
		});
	});

	it('permissions.get by id hits /permissions/:id encoded', async () => {
		const t = transportWith(ok({ id: 'perm/1', status: 'approved' }));
		const m = buildCloudManagement(t);
		await m.permissions.get({ id: 'perm/1' });
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/permissions/perm%2F1');
		expect(init.method).toBe('GET');
	});

	it('permissions.get by token posts to /permissions/lookup-by-token', async () => {
		const t = transportWith(ok({ id: 'perm1', status: 'pending' }));
		const m = buildCloudManagement(t);
		await m.permissions.get({ token: 'tok_abc' });
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/permissions/lookup-by-token');
		expect(init.method).toBe('POST');
		expect(JSON.parse(init.body)).toEqual({ token: 'tok_abc' });
	});
});

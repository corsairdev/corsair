import type { CloudTransport } from '../../core/cloud/http';
import { buildCloudV1Management } from '../../core/cloud/management';
import { ManagementApiError } from '../../core/management/errors';

function transportWith(res: Response): CloudTransport & { fetch: jest.Mock } {
	return {
		baseUrl: 'https://api.corsair.cloud/v1',
		apiKey: 'ck_cloud_x.secret',
		fetch: jest.fn().mockResolvedValue(res),
	};
}

function ok(body: unknown) {
	return new Response(JSON.stringify(body), { status: 200 });
}

describe('buildCloudV1Management', () => {
	it('project.get hits GET /v1/project and maps snake_case', async () => {
		const t = transportWith(
			ok({
				object: 'project',
				id: 'proj_1',
				status: 'active',
				instances: 2,
				mcp_oauth_url: 'https://mcp/oauth',
				created: '2026-01-01',
			}),
		);
		const m = buildCloudV1Management(t);
		const project = await m.project.get();
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://api.corsair.cloud/v1/project');
		expect(init.method).toBe('GET');
		expect(init.headers.authorization).toBe('Bearer ck_cloud_x.secret');
		expect(project).toEqual({
			id: 'proj_1',
			status: 'active',
			instances: 2,
			mcpOauthUrl: 'https://mcp/oauth',
			created: '2026-01-01',
		});
	});

	it('keys.get hits GET /v1/keys and maps project_key', async () => {
		const t = transportWith(ok({ object: 'key', project_key: 'ck_proj_x' }));
		const m = buildCloudV1Management(t);
		const keys = await m.keys.get();
		expect(t.fetch.mock.calls[0][0]).toBe('https://api.corsair.cloud/v1/keys');
		expect(keys).toEqual({ projectKey: 'ck_proj_x' });
	});

	it('instances.list hits GET /v1/instances and maps the list envelope', async () => {
		const t = transportWith(
			ok({
				object: 'list',
				data: [
					{
						object: 'instance',
						id: 'inst_1',
						instance_key: 'users',
						writable: true,
						credential_source: 'byo',
						quota_limit: 1000,
						quota_window: 'day',
					},
				],
				has_more: false,
				next_cursor: null,
			}),
		);
		const m = buildCloudV1Management(t);
		const list = await m.instances.list();
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/instances',
		);
		expect(list).toEqual({
			data: [
				{
					id: 'inst_1',
					instanceKey: 'users',
					writable: true,
					credentialSource: 'byo',
					quotaLimit: 1000,
					quotaWindow: 'day',
				},
			],
			hasMore: false,
			nextCursor: null,
		});
	});

	it('instances.get hits GET /v1/instances/:key with the key encoded', async () => {
		const t = transportWith(
			ok({
				object: 'instance',
				id: 'inst_1',
				instance_key: 'a/b',
				writable: false,
				credential_source: 'managed',
				quota_limit: null,
				quota_window: null,
			}),
		);
		const m = buildCloudV1Management(t);
		await m.instances.get('a/b');
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/instances/a%2Fb',
		);
	});

	it('connections.list hits GET /v1/connections with filters as a query string', async () => {
		const t = transportWith(
			ok({
				object: 'list',
				data: [
					{
						object: 'connection',
						instance: 'users',
						tenant: 'acme',
						integration: 'slack',
						status: 'connected',
					},
				],
				has_more: false,
				next_cursor: null,
			}),
		);
		const m = buildCloudV1Management(t);
		const rows = await m.connections.list({
			instance: 'users',
			tenant: 'acme',
			integration: 'slack',
		});
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/connections?instance=users&tenant=acme&integration=slack',
		);
		expect(rows).toEqual([
			{
				instance: 'users',
				tenant: 'acme',
				integration: 'slack',
				status: 'connected',
			},
		]);
	});

	it('connections.list omits the query string when no filters are given', async () => {
		const t = transportWith(
			ok({ object: 'list', data: [], has_more: false, next_cursor: null }),
		);
		const m = buildCloudV1Management(t);
		await m.connections.list();
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/connections',
		);
	});

	it('grants.list hits GET /v1/grants?tenant= and maps each grant', async () => {
		const t = transportWith(
			ok({
				object: 'list',
				data: [
					{
						object: 'grant',
						id: 'grant_1',
						recipient: 'user@x.com',
						tenant: 'acme',
						instances: [
							{ instance: 'users', tenant: 'acme', permission: 'readonly' },
						],
						url: 'https://grant/1',
						created: '2026-01-01',
					},
				],
				has_more: false,
				next_cursor: null,
			}),
		);
		const m = buildCloudV1Management(t);
		const grants = await m.grants.list({ tenant: 'acme' });
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/grants?tenant=acme',
		);
		expect(grants).toEqual([
			{
				id: 'grant_1',
				recipient: 'user@x.com',
				tenant: 'acme',
				instances: [{ instance: 'users', tenant: 'acme', permission: 'readonly' }],
				url: 'https://grant/1',
				created: '2026-01-01',
			},
		]);
	});

	it('grants.get hits GET /v1/grants/:id with the id encoded', async () => {
		const t = transportWith(
			ok({
				object: 'grant',
				id: 'a/b',
				recipient: null,
				tenant: null,
				instances: [],
				url: null,
				created: '2026-01-01',
			}),
		);
		const m = buildCloudV1Management(t);
		await m.grants.get('a/b');
		expect(t.fetch.mock.calls[0][0]).toBe(
			'https://api.corsair.cloud/v1/grants/a%2Fb',
		);
	});

	it('grants.mint posts to /v1/grants and passes an Idempotency-Key header when given', async () => {
		const t = transportWith(
			ok({
				object: 'grant',
				id: 'grant_2',
				recipient: null,
				tenant: null,
				instances: [{ instance: 'users', permission: 'readwrite' }],
				url: 'https://grant/2',
				created: '2026-01-02',
			}),
		);
		const m = buildCloudV1Management(t);
		const grant = await m.grants.mint({
			instances: [{ instance: 'users', permission: 'readwrite' }],
			idempotencyKey: 'idem_1',
		});
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://api.corsair.cloud/v1/grants');
		expect(init.method).toBe('POST');
		expect(init.headers['idempotency-key']).toBe('idem_1');
		expect(JSON.parse(init.body)).toEqual({
			instances: [{ instance: 'users', permission: 'readwrite' }],
		});
		expect(grant.id).toBe('grant_2');
	});

	it('grants.update patches /v1/grants/:id', async () => {
		const t = transportWith(
			ok({
				object: 'grant',
				id: 'grant_1',
				recipient: null,
				tenant: null,
				instances: [{ instance: 'users', permission: 'readonly' }],
				url: null,
				created: '2026-01-01',
			}),
		);
		const m = buildCloudV1Management(t);
		await m.grants.update('grant_1', {
			instances: [{ instance: 'users', permission: 'readonly' }],
		});
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://api.corsair.cloud/v1/grants/grant_1');
		expect(init.method).toBe('PATCH');
	});

	it('grants.revoke deletes /v1/grants/:id and maps revoked', async () => {
		const t = transportWith(
			ok({ object: 'grant', id: 'grant_1', revoked: true }),
		);
		const m = buildCloudV1Management(t);
		const result = await m.grants.revoke('grant_1');
		const [url, init] = t.fetch.mock.calls[0];
		expect(url).toBe('https://api.corsair.cloud/v1/grants/grant_1');
		expect(init.method).toBe('DELETE');
		expect(result).toEqual({ id: 'grant_1', revoked: true });
	});

	it('maps the nested v1 error envelope into a ManagementApiError', async () => {
		const envelope = {
			error: {
				type: 'invalid_request',
				code: 'instance_not_found',
				message: 'No such instance',
				param: 'instance',
			},
		};
		const t: CloudTransport & { fetch: jest.Mock } = {
			baseUrl: 'https://api.corsair.cloud/v1',
			apiKey: 'ck_cloud_x.secret',
			fetch: jest
				.fn()
				.mockImplementation(
					async () => new Response(JSON.stringify(envelope), { status: 404 }),
				),
		};
		const m = buildCloudV1Management(t);
		const err = await m.instances.get('nope').catch((e) => e);
		expect(err).toBeInstanceOf(ManagementApiError);
		expect(err).toMatchObject({
			status: 404,
			code: 'instance_not_found',
			message: 'No such instance',
		});
	});
});

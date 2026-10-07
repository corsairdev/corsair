import type { CloudTransport } from '../../core/cloud/http';
import { buildCloudV1Management } from '../../core/cloud/management';
import { ManagementApiError } from '../../core/management/errors';

// The transport's baseUrl carries /v1/projects/<slug>, so a path here is
// relative to one project — the same shape corsairCloud() builds from the key.
const BASE = 'https://auth.corsair.dev/v1/projects/acme';

function transportWith(res: Response): CloudTransport & { fetch: jest.Mock } {
	return {
		baseUrl: BASE,
		apiKey: 'ck_cloud_acme.secret',
		fetch: jest.fn().mockResolvedValue(res),
	};
}

function ok(body: unknown) {
	return new Response(JSON.stringify(body), { status: 200 });
}

function list(data: unknown[], nextCursor: string | null = null) {
	return ok({
		object: 'list',
		data,
		has_more: nextCursor !== null,
		next_cursor: nextCursor,
	});
}

const called = (t: { fetch: jest.Mock }) => t.fetch.mock.calls[0];

describe('buildCloudV1Management', () => {
	it('project.get maps the project, managed_integrations included', async () => {
		const t = transportWith(
			ok({
				object: 'project',
				id: 'acme',
				status: 'active',
				instance_count: 2,
				managed_integrations: { limit: 3, used: 1 },
				mcp_oauth_url: 'https://mcp/oauth',
				created: '2026-01-01',
				instances: { object: 'list', data: [], has_more: false },
				tenants: { object: 'list', data: [], has_more: false },
				access: { object: 'list', data: [], has_more: false },
				connections: { object: 'list', data: [], has_more: false },
				links: { object: 'list', data: [], has_more: false },
			}),
		);
		const project = await buildCloudV1Management(t).project.get();
		const [url, init] = called(t);
		expect(url).toBe(`${BASE}/project`);
		expect(init.method).toBe('GET');
		expect(init.headers.authorization).toBe('Bearer ck_cloud_acme.secret');
		expect(project).toMatchObject({
			id: 'acme',
			status: 'active',
			instanceCount: 2,
			managedIntegrations: { limit: 3, used: 1 },
			mcpOauthUrl: 'https://mcp/oauth',
			created: '2026-01-01',
		});
	});

	// The embeds are previews of the collection endpoints, so they carry
	// has_more but never a cursor to pass back.
	it('project.get maps the embedded previews without a cursor', async () => {
		const t = transportWith(
			ok({
				object: 'project',
				id: 'acme',
				instance_count: 1,
				managed_integrations: { limit: null, used: 0 },
				instances: {
					object: 'list',
					data: [{ object: 'instance', id: 'prod', instance_key: 'prod' }],
					has_more: true,
					next_cursor: 'cur_2',
				},
				tenants: { object: 'list', data: [], has_more: false },
			}),
		);
		const project = await buildCloudV1Management(t).project.get();
		expect(project.instances.data[0]?.instanceKey).toBe('prod');
		expect(project.instances.hasMore).toBe(true);
		expect(project.instances.nextCursor).toBeNull();
		// An absent embed is an empty page, not a crash.
		expect(project.links).toEqual({
			data: [],
			hasMore: false,
			nextCursor: null,
		});
	});

	it('keys.get maps project_key', async () => {
		const t = transportWith(ok({ object: 'key', project_key: 'ck_proj_x' }));
		const keys = await buildCloudV1Management(t).keys.get();
		expect(called(t)[0]).toBe(`${BASE}/keys`);
		expect(keys).toEqual({ projectKey: 'ck_proj_x' });
	});

	describe('instances', () => {
		const raw = {
			object: 'instance',
			id: 'prod',
			instance_key: 'prod',
			description: 'Production',
			writable: true,
			credential_source: 'user_owned',
			quota_limit: 1000,
			quota_window: 'day',
			url: 'https://api.corsair.cloud/acme/api/corsair',
		};

		it('list pages and maps, url included', async () => {
			const t = transportWith(list([raw], 'cur_2'));
			const page = await buildCloudV1Management(t).instances.list({ limit: 1 });
			expect(called(t)[0]).toBe(`${BASE}/instances?limit=1`);
			expect(page).toEqual({
				data: [
					{
						id: 'prod',
						instanceKey: 'prod',
						description: 'Production',
						writable: true,
						credentialSource: 'user_owned',
						quotaLimit: 1000,
						quotaWindow: 'day',
						url: 'https://api.corsair.cloud/acme/api/corsair',
					},
				],
				hasMore: true,
				nextCursor: 'cur_2',
			});
		});

		it('list passes starting_after as the cursor', async () => {
			const t = transportWith(list([]));
			await buildCloudV1Management(t).instances.list({
				startingAfter: 'cur_2',
			});
			expect(called(t)[0]).toBe(`${BASE}/instances?starting_after=cur_2`);
		});

		it('get encodes the key', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).instances.get('a/b');
			expect(called(t)[0]).toBe(`${BASE}/instances/a%2Fb`);
		});

		// Create takes the key and credential model only — the hub rejects
		// anything else, so sending description here would 400.
		it('create sends snake_case and an Idempotency-Key when given', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).instances.create({
				instanceKey: 'prod',
				credentialSource: 'user_owned',
				idempotencyKey: 'idem_1',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/instances`);
			expect(init.method).toBe('POST');
			expect(init.headers['idempotency-key']).toBe('idem_1');
			expect(JSON.parse(init.body)).toEqual({
				instance_key: 'prod',
				credential_source: 'user_owned',
			});
		});

		it('create omits the idempotency header when no key is given', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).instances.create({ instanceKey: 'prod' });
			expect(called(t)[1].headers['idempotency-key']).toBeUndefined();
		});

		// A clearing PATCH has to reach the wire as an explicit null; dropping it
		// as "falsy" would answer 200 for an update that never happened.
		it('update sends description: null rather than dropping it', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).instances.update('prod', {
				description: null,
				writable: false,
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/instances/prod`);
			expect(init.method).toBe('PATCH');
			expect(JSON.parse(init.body)).toEqual({
				description: null,
				writable: false,
			});
		});

		it('delete maps the deleted envelope', async () => {
			const t = transportWith(
				ok({ object: 'instance', id: 'prod', deleted: true }),
			);
			const result = await buildCloudV1Management(t).instances.delete('prod');
			expect(called(t)[1].method).toBe('DELETE');
			expect(result).toEqual({ id: 'prod', deleted: true });
		});
	});

	describe('integrations', () => {
		it('list filters by instance alongside the page params', async () => {
			const t = transportWith(list([]));
			await buildCloudV1Management(t).integrations.list({
				instance: 'prod',
				limit: 10,
			});
			expect(called(t)[0]).toBe(`${BASE}/integrations?instance=prod&limit=10`);
		});

		it('catalog maps managed_available', async () => {
			const t = transportWith(
				list([
					{
						object: 'catalog_integration',
						id: 'slack',
						name: 'Slack',
						auth_types: ['managed', 'bot_token'],
						managed_available: true,
					},
				]),
			);
			const page = await buildCloudV1Management(t).integrations.catalog();
			expect(called(t)[0]).toBe(`${BASE}/integrations/catalog`);
			expect(page.data).toEqual([
				{
					id: 'slack',
					name: 'Slack',
					authTypes: ['managed', 'bot_token'],
					managedAvailable: true,
				},
			]);
		});

		it('set PUTs the ref and maps has_credentials', async () => {
			const t = transportWith(
				ok({
					object: 'integration',
					id: 'prod:slack',
					instance: 'prod',
					integration: 'slack',
					auth_type: 'bot_token',
					has_credentials: true,
				}),
			);
			const integration = await buildCloudV1Management(t).integrations.set(
				'prod:slack',
				{ authType: 'bot_token', credentials: { bot_token: 'xoxb-1' } },
			);
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/integrations/prod%3Aslack`);
			expect(init.method).toBe('PUT');
			expect(JSON.parse(init.body)).toEqual({
				auth_type: 'bot_token',
				credentials: { bot_token: 'xoxb-1' },
			});
			expect(integration.hasCredentials).toBe(true);
		});
	});

	describe('tenants', () => {
		const raw = {
			object: 'tenant',
			id: 'usr_8841',
			email: 'dave@acme.com',
			label: 'Dave',
			created: '2026-01-01',
		};

		it('create sends tenant_id', async () => {
			const t = transportWith(ok(raw));
			const tenant = await buildCloudV1Management(t).tenants.create({
				tenantId: 'usr_8841',
				email: 'dave@acme.com',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/tenants`);
			expect(JSON.parse(init.body)).toEqual({
				tenant_id: 'usr_8841',
				email: 'dave@acme.com',
			});
			expect(tenant).toEqual({
				id: 'usr_8841',
				email: 'dave@acme.com',
				label: 'Dave',
				created: '2026-01-01',
			});
		});

		it('get encodes an id that contains a colon', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).tenants.get('usr_123:work');
			expect(called(t)[0]).toBe(`${BASE}/tenants/usr_123%3Awork`);
		});
	});

	describe('connections', () => {
		it('list sends all three filters', async () => {
			const t = transportWith(list([]));
			await buildCloudV1Management(t).connections.list({
				instance: 'prod',
				tenant: 'usr_8841',
				integration: 'slack',
			});
			expect(called(t)[0]).toBe(
				`${BASE}/connections?instance=prod&tenant=usr_8841&integration=slack`,
			);
		});

		it('list omits the query string entirely when unfiltered', async () => {
			const t = transportWith(list([]));
			await buildCloudV1Management(t).connections.list();
			expect(called(t)[0]).toBe(`${BASE}/connections`);
		});

		it('get maps the instance:integration:tenant ref', async () => {
			const t = transportWith(
				ok({
					object: 'connection',
					id: 'prod:slack:usr_8841',
					instance: 'prod',
					tenant: 'usr_8841',
					integration: 'slack',
					status: 'connected',
				}),
			);
			const connection = await buildCloudV1Management(t).connections.get(
				'prod:slack:usr_8841',
			);
			expect(called(t)[0]).toBe(`${BASE}/connections/prod%3Aslack%3Ausr_8841`);
			expect(connection).toEqual({
				id: 'prod:slack:usr_8841',
				instance: 'prod',
				tenant: 'usr_8841',
				integration: 'slack',
				status: 'connected',
			});
		});
	});

	describe('connect.sessions', () => {
		it('create maps deliveryUrl to delivery_url and returns the expiry', async () => {
			const t = transportWith(
				ok({
					object: 'connect_session',
					url: 'https://connect.corsair.dev/s/abc',
					expires_at: '2026-01-01T00:10:00.000Z',
					instance: 'prod',
					tenant: 'usr_8841',
					integrations: ['slack'],
				}),
			);
			const session = await buildCloudV1Management(t).connect.sessions.create({
				instance: 'prod',
				tenant: 'usr_8841',
				integrations: ['slack'],
				deliveryUrl: 'https://acme.com/done',
				idempotencyKey: 'idem_2',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/connect/sessions`);
			expect(init.headers['idempotency-key']).toBe('idem_2');
			expect(JSON.parse(init.body)).toEqual({
				instance: 'prod',
				tenant: 'usr_8841',
				integrations: ['slack'],
				delivery_url: 'https://acme.com/done',
			});
			// `integrations` is what the session actually offers, which the hub
			// narrows — dropping it hid that from the caller.
			expect(session).toEqual({
				url: 'https://connect.corsair.dev/s/abc',
				expiresAt: '2026-01-01T00:10:00.000Z',
				instance: 'prod',
				tenant: 'usr_8841',
				integrations: ['slack'],
			});
		});
	});

	describe('access', () => {
		const raw = {
			object: 'access',
			id: 'prod:usr_8841',
			instance: 'prod',
			tenant: 'usr_8841',
			label: 'Dave',
			permission: 'readwrite',
			connected: ['slack'],
			expired: [],
		};

		it('set PUTs the ref and maps connected/expired as lists', async () => {
			const t = transportWith(ok(raw));
			const line = await buildCloudV1Management(t).access.set('prod:usr_8841', {
				permission: 'readwrite',
				email: 'dave@acme.com',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/access/prod%3Ausr_8841`);
			expect(init.method).toBe('PUT');
			expect(JSON.parse(init.body)).toEqual({
				permission: 'readwrite',
				email: 'dave@acme.com',
			});
			expect(line.connected).toEqual(['slack']);
			expect(line.expired).toEqual([]);
		});

		it('list filters by tenant', async () => {
			const t = transportWith(list([raw]));
			await buildCloudV1Management(t).access.list({ tenant: 'usr_8841' });
			expect(called(t)[0]).toBe(`${BASE}/access?tenant=usr_8841`);
		});
	});

	describe('mcp.links', () => {
		const raw = {
			object: 'link',
			id: 'mcpg_1',
			recipient: 'dave@acme.com',
			instances: [
				{
					instance: 'prod',
					tenant: 'usr_8841',
					permission: 'readwrite',
					lost_access: false,
				},
			],
			url: 'https://mcp.corsair.cloud/acme/mcpg_1/mcp',
			created: '2026-01-01',
		};

		it('mint posts the instance lines and maps lost_access', async () => {
			const t = transportWith(ok(raw));
			const link = await buildCloudV1Management(t).mcp.links.mint({
				recipient: 'dave@acme.com',
				instances: [
					{ instance: 'prod', tenant: 'usr_8841', permission: 'readwrite' },
				],
				idempotencyKey: 'idem_3',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/mcp/links`);
			expect(init.method).toBe('POST');
			expect(init.headers['idempotency-key']).toBe('idem_3');
			expect(JSON.parse(init.body)).toEqual({
				recipient: 'dave@acme.com',
				instances: [
					{ instance: 'prod', tenant: 'usr_8841', permission: 'readwrite' },
				],
			});
			expect(link.instances).toEqual([
				{
					instance: 'prod',
					tenant: 'usr_8841',
					permission: 'readwrite',
					lostAccess: false,
				},
			]);
			expect(link.url).toBe('https://mcp.corsair.cloud/acme/mcpg_1/mcp');
		});

		// Renaming a link must not re-send every line: an absent `instances`
		// leaves the grant's lines alone on the hub side.
		it('update sends only recipient when no instances are given', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).mcp.links.update('mcpg_1', {
				recipient: 'new@acme.com',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/mcp/links/mcpg_1`);
			expect(init.method).toBe('PATCH');
			expect(JSON.parse(init.body)).toEqual({ recipient: 'new@acme.com' });
		});

		it('update sends recipient: null to clear it', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).mcp.links.update('mcpg_1', {
				recipient: null,
			});
			expect(JSON.parse(called(t)[1].body)).toEqual({ recipient: null });
		});

		it('rotate posts to /rotate with no body', async () => {
			const t = transportWith(ok(raw));
			await buildCloudV1Management(t).mcp.links.rotate('mcpg_1', {
				idempotencyKey: 'idem_4',
			});
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/mcp/links/mcpg_1/rotate`);
			expect(init.method).toBe('POST');
			expect(init.headers['idempotency-key']).toBe('idem_4');
			expect(init.body).toBeUndefined();
		});

		it('revoke deletes and maps the deleted envelope', async () => {
			const t = transportWith(
				ok({ object: 'link', id: 'mcpg_1', deleted: true }),
			);
			const result = await buildCloudV1Management(t).mcp.links.revoke('mcpg_1');
			const [url, init] = called(t);
			expect(url).toBe(`${BASE}/mcp/links/mcpg_1`);
			expect(init.method).toBe('DELETE');
			expect(result).toEqual({ id: 'mcpg_1', deleted: true });
		});
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
			baseUrl: BASE,
			apiKey: 'ck_cloud_acme.secret',
			fetch: jest
				.fn()
				.mockImplementation(
					async () => new Response(JSON.stringify(envelope), { status: 404 }),
				),
		};
		const err = await buildCloudV1Management(t)
			.instances.get('nope')
			.catch((e) => e);
		expect(err).toBeInstanceOf(ManagementApiError);
		expect(err).toMatchObject({
			status: 404,
			code: 'instance_not_found',
			message: 'No such instance',
		});
	});
});

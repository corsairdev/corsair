import type { V1Transport } from '../../core/cloud/v1/http';
import { buildInstancePlane } from '../../core/cloud/v1/instance';
import contract from '../../core/cloud/v1/openapi.yaml';
import { buildProjectPlane } from '../../core/cloud/v1/project';

// Sentinels the planes put into a path, mapped back to the spec's parameter
// name. The spec is pinned against the paths the client really builds, so a
// declared route table can't drift from the calls that use it.
const INSTANCE = 'app';
const PLUGIN = 'slack';
const TENANT = 'acme';
const ID = 'id-1';

const SENTINEL_TO_PARAM: Array<[string, string]> = [
	[`${INSTANCE}:${PLUGIN}:${TENANT}`, 'ref'],
	[`${INSTANCE}:${PLUGIN}`, 'ref'],
	[`${INSTANCE}:${TENANT}`, 'ref'],
	[ID, 'id'],
	[INSTANCE, 'key'],
];

function templatize(path: string): string {
	const withoutQuery = path.split('?')[0]!;
	return withoutQuery
		.split('/')
		.map((seg) => {
			const decoded = decodeURIComponent(seg);
			const hit = SENTINEL_TO_PARAM.find(([value]) => value === decoded);
			return hit ? `{${hit[1]}}` : seg;
		})
		.join('/');
}

function recorder() {
	const seen = new Set<string>();
	const bodies = new Map<string, string>();
	const transport: V1Transport = {
		baseUrl: 'https://api.corsair.cloud/v1/projects/acme',
		apiKey: 'ck_cloud_acme.secret',
		fetch: (async (url: string, init: RequestInit) => {
			const path = new URL(url).pathname.replace('/v1/projects/acme', '');
			const call = `${String(init.method).toLowerCase()} ${templatize(path)}`;
			seen.add(call);
			if (init.body) bodies.set(call, String(init.body));
			return new Response('{}', { status: 200 });
		}) as unknown as typeof fetch,
	};
	return { seen, bodies, transport };
}

async function callEveryMethod(transport: V1Transport): Promise<void> {
	const manage = buildProjectPlane(transport);
	await manage.project.get();
	await manage.keys.get();
	await manage.keys.rotate();
	await manage.instances.list();
	await manage.instances.create({ instance_key: INSTANCE });
	await manage.instances.get(INSTANCE);
	await manage.instances.update(INSTANCE, { writable: true });
	await manage.instances.delete(INSTANCE);
	await manage.integrations.catalog();
	await manage.mcp.links.list();
	await manage.mcp.links.mint({
		admin: { instance: INSTANCE, tenant: TENANT },
		context: [{ instance: INSTANCE, tenant: TENANT }],
		mode: 'strict',
		can_mint_links: true,
		can_add_plugins: false,
	});
	await manage.mcp.links.get(ID);
	// Policy alone, no lines: ticking a capability in the console sends exactly
	// this, and the request type has to admit it.
	await manage.mcp.links.update(ID, { can_add_plugins: true });
	await manage.mcp.links.delete(ID);
	await manage.mcp.links.rotate(ID);
	await manage.mcp.tokens.mint({ instance: INSTANCE, tenant: TENANT });

	const instance = buildInstancePlane(transport, INSTANCE);
	await instance.tenants.list();
	await instance.tenants.create({ tenant_id: TENANT });
	await instance.tenants.get(TENANT);
	await instance.tenants.update(TENANT, {});
	await instance.tenants.delete(TENANT);
	await instance.access.list();
	await instance.access.get(TENANT);
	await instance.access.set(TENANT, { permission: 'readonly' });
	await instance.access.revoke(TENANT);
	await instance.connections.list();
	await instance.connections.get(PLUGIN, TENANT);
	await instance.connections.delete(PLUGIN, TENANT);
	await instance.connect.createSession({ tenant: TENANT });
	await instance.integrations.list();
	await instance.integrations.get(PLUGIN);
	await instance.integrations.put(PLUGIN, {});
	await instance.integrations.delete(PLUGIN);
	await instance.integrations.operations(PLUGIN);
	await instance.integrations.oauthApp.get(PLUGIN);
	await instance.integrations.oauthApp.put(PLUGIN, {
		client_id: 'c',
		client_secret: 's',
	});
	await instance.integrations.oauthApp.delete(PLUGIN);
	await instance.webhooks.list();
	await instance.webhooks.create({ integration: PLUGIN });
	await instance.webhooks.get(PLUGIN);
	await instance.webhooks.delete(PLUGIN);
	await instance.webhooks.rotateSecret(PLUGIN, { signing_secret: 'whsec' });
	await instance.webhooks.deliveries.list(PLUGIN);
	await instance.webhooks.deliveries.get(PLUGIN, ID);
	await instance.webhooks.deliveries.retry(PLUGIN, ID);
	await instance.signingSecret.get();
	await instance.signingSecret.rotate();
	await instance.apply();
	await instance.removeFromRuntime();
	await instance.reconcile();
}

function specOperations(): Set<string> {
	const paths = (contract as { paths: Record<string, Record<string, unknown>> })
		.paths;
	const out = new Set<string>();
	for (const [path, item] of Object.entries(paths)) {
		for (const method of Object.keys(item)) {
			if (method !== 'parameters') out.add(`${method} ${path}`);
		}
	}
	return out;
}

describe('management contract', () => {
	let called: Set<string>;
	let sent: Map<string, string>;

	beforeAll(async () => {
		const { seen, bodies, transport } = recorder();
		await callEveryMethod(transport);
		called = seen;
		sent = bodies;
	});

	// Parsed, not string-compared: what matters is that the policy reaches the
	// wire, not the order the keys serialize in.
	it('sends a policy-only link update as the body', () => {
		expect(JSON.parse(sent.get('patch /mcp/links/{id}') ?? 'null')).toEqual({
			can_add_plugins: true,
		});
	});

	it('documents every operation the client calls', () => {
		const spec = specOperations();
		expect([...called].filter((op) => !spec.has(op)).sort()).toEqual([]);
	});

	it('is called by the client for every operation it documents', () => {
		expect(
			[...specOperations()].filter((op) => !called.has(op)).sort(),
		).toEqual([]);
	});

	it('covers all 50 operations', () => {
		expect(specOperations().size).toBe(50);
		expect(called.size).toBe(50);
	});
});

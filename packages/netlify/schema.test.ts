import {
	netlifyEndpointMeta,
	netlifyEndpointSchemas,
} from './endpoints/catalog';
import {
	NetlifyManifestSchema,
	netlifyDefinitions,
	netlifyManifest,
	netlifyOperations,
	netlifyWebhookDefinitions,
} from './endpoints/manifest';
import {
	getNetlifyInputSchema,
	getNetlifyOutputSchema,
	getNetlifyWebhookPayloadSchema,
} from './endpoints/openapi-schema';
import { NETLIFY_OPERATION_IDS } from './endpoints/operation-types';

const ids = netlifyOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = netlifyOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('netlify-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			NetlifyManifestSchema.safeParse(netlifyManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 185 operations, one per id and route', () => {
		expect(ids).toHaveLength(185);
		expect(new Set(ids).size).toBe(185);
		expect([...NETLIFY_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			netlifyOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(185);
		expect(netlifyManifest.version).toBe('2.63.1');
	});

	it('leaves out the x-internal build plugin routes', () => {
		const routes = netlifyOperations.map((o) => `${o.method} ${o.path}`);
		for (const left of [
			'PUT /sites/{site_id}/plugins/{package}',
			'GET /sites/{site_id}/plugin_runs/latest',
			'POST /deploys/{deploy_id}/plugin_runs',
		]) {
			expect(routes).not.toContain(left);
		}
	});

	it('drops the base path the swagger repeats on the site env route', () => {
		expect(operation('env.listForSite').path).toBe('/sites/{site_id}/env');
		expect(
			netlifyOperations.filter((o) => o.path.startsWith('/api/v1')),
		).toEqual([]);
	});

	it('resolves every schema reference', () => {
		const missing = new Set<string>();
		// `unknown` because the walk covers raw JSON Schema documents.
		const visit = (value: unknown) => {
			if (Array.isArray(value)) return value.forEach(visit);
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === '$ref' &&
					typeof inner === 'string' &&
					!(inner in netlifyDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(netlifyManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('deploys.uploadFile').request).toBe('binary');
		expect(operation('deploys.uploadFunction').request).toBe('binary');
		expect(operation('sites.builds.create').request).toBe('multipart');
		expect(operation('env.create').request).toBe('json');
		expect(operation('agentRunners.getDiff').response).toBe('text');
		expect(operation('sites.delete').response).toBe('empty');
		expect(operation('sites.list').paginated).toBe(true);
		expect(operation('sites.deploys.list').paginated).toBe(true);
		expect(operation('sites.forms.list').paginated).toBeUndefined();
	});

	it('marks where each field goes', () => {
		const field = (id: string, name: string) =>
			(
				operation(id).input.properties as Record<
					string,
					Record<string, unknown>
				>
			)[name] ?? {};
		expect(field('deploys.uploadFile', 'path')['x-corsair-slashes']).toBe(true);
		expect(field('deploys.uploadFile', 'file')['x-corsair-in']).toBe(
			'bodyRoot',
		);
		expect(field('env.create', 'env_vars')['x-corsair-in']).toBe('bodyRoot');
		expect(field('deploys.uploadFunction', 'retry_count')).toMatchObject({
			'x-corsair-in': 'header',
			'x-corsair-wire': 'X-Nf-Retry-Count',
		});
		// Same value in the query (or path) and the body.
		expect(field('hooks.create', 'site_id')).toMatchObject({
			'x-corsair-in': 'query',
			'x-corsair-body': true,
		});
		expect(field('env.update', 'key')['x-corsair-body']).toBe(true);
		expect(field('sites.get', 'site_id')['x-corsair-slashes']).toBeUndefined();
	});
});

describe('catalog', () => {
	it('has meta and schemas for every operation', () => {
		expect(Object.keys(netlifyEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(netlifyEndpointSchemas).sort()).toEqual([...ids].sort());
		for (const meta of Object.values(netlifyEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(getNetlifyInputSchema(id)).toBeDefined();
			expect(getNetlifyOutputSchema(id)).toBeDefined();
		}
		for (const webhook of netlifyWebhookDefinitions) {
			expect(getNetlifyWebhookPayloadSchema(webhook.id)).toBeDefined();
		}
	});

	it('rates reads, writes and destructive calls (R8)', () => {
		const risk = (id: string) =>
			netlifyEndpointMeta[id as keyof typeof netlifyEndpointMeta].riskLevel;
		for (const id of [
			'sites.get',
			'sites.deploys.list',
			'env.list',
			'sites.identity.users.lookup',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of [
			'sites.create',
			'sites.deploys.create',
			'deploys.uploadFile',
			'sites.builds.create',
			'hooks.create',
			'env.setValue',
			'agentRunners.delete',
		]) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
		for (const id of [
			'sites.delete',
			'env.delete',
			'accounts.cancel',
			'accounts.create',
			'accounts.update',
			'accounts.members.add',
			'agentRunners.create',
			'agentRunners.commitToBranch',
			'dns.zones.transfer',
			'sites.database.snapshots.restore',
			'sites.disable',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
		const irreversible = (id: string) =>
			(
				netlifyEndpointMeta[id as keyof typeof netlifyEndpointMeta] as {
					irreversible?: boolean;
				}
			).irreversible;
		expect(irreversible('sites.delete')).toBe(true);
		expect(irreversible('accounts.members.remove')).toBeUndefined();
		expect(
			Object.entries(netlifyEndpointMeta).filter(
				([id, meta]) =>
					operation(id).method === 'DELETE' &&
					meta.riskLevel !== 'destructive' &&
					!id.startsWith('agentRunners.') &&
					id !== 'sites.devServers.deleteAll',
			),
		).toEqual([]);
	});

	it('takes the required fields and refuses a wrong type', () => {
		const upload = getNetlifyInputSchema('deploys.uploadFile');
		expect(upload.safeParse({ deploy_id: 'd', path: 'a.html' }).success).toBe(
			false,
		);
		expect(
			upload.safeParse({
				deploy_id: 'd',
				path: 'a.html',
				file: { base64: 'PGgxPg==' },
			}).success,
		).toBe(true);
		expect(
			getNetlifyInputSchema('sites.get').safeParse({ site_id: '' }).success,
		).toBe(false);
		expect(
			getNetlifyInputSchema('sites.get').safeParse({ site_id: 's1' }).success,
		).toBe(true);
		expect(
			getNetlifyInputSchema('sites.list').safeParse({ page: 'two' }).success,
		).toBe(false);
	});

	it('refuses values outside a documented enum', () => {
		const list = getNetlifyInputSchema('sites.list');
		expect(list.safeParse({ filter: 'owner' }).success).toBe(true);
		expect(list.safeParse({ filter: 'everyone' }).success).toBe(false);
		const deploys = getNetlifyInputSchema('sites.deploys.list');
		expect(deploys.safeParse({ site_id: 's', state: 'ready' }).success).toBe(
			true,
		);
		expect(deploys.safeParse({ site_id: 's', state: 'done' }).success).toBe(
			false,
		);
	});

	it('parses responses leniently: unknown fields kept, missing ones fine', () => {
		const out = getNetlifyOutputSchema('sites.get').parse({
			id: 's1',
			name: 'site',
			brand_new_field: { x: 1 },
		}) as Record<string, unknown>;
		expect(out.brand_new_field).toEqual({ x: 1 });
		expect(
			getNetlifyOutputSchema('sites.get').safeParse({ name: 7 }).success,
		).toBe(false);
	});
});

import { giteaEndpointMeta, giteaEndpointSchemas } from './endpoints/catalog';
import {
	GiteaManifestSchema,
	giteaDefinitions,
	giteaManifest,
	giteaOperations,
	giteaWebhookDefinitions,
} from './endpoints/manifest';
import {
	getGiteaInputSchema,
	getGiteaOutputSchema,
	getGiteaWebhookPayloadSchema,
} from './endpoints/openapi-schema';
import { GITEA_OPERATION_IDS } from './endpoints/operation-types';

const ids = giteaOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = giteaOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

// The first version's 18 operations keep their names.
const FIRST_VERSION = [
	'user.me',
	'repos.list',
	'repos.get',
	'repos.create',
	'repos.delete',
	'branches.list',
	'commits.list',
	'issues.list',
	'issues.get',
	'issues.create',
	'issues.update',
	'comments.list',
	'comments.create',
	'releases.list',
	'releases.create',
	'webhooks.list',
	'webhooks.create',
	'webhooks.delete',
];

describe('gitea-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			GiteaManifestSchema.safeParse(giteaManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 530 operations, one per id and route', () => {
		expect(ids).toHaveLength(530);
		expect(new Set(ids).size).toBe(530);
		expect([...GITEA_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(giteaOperations.map((o) => `${o.method} ${o.path}`));
		expect(routes.size).toBe(530);
		expect(giteaManifest.version).toBe('28.4.0');
	});

	it('keeps the first version operation names (18)', () => {
		expect(FIRST_VERSION).toHaveLength(18);
		expect(FIRST_VERSION.filter((id) => !ids.includes(id))).toEqual([]);
		expect(operation('repos.list').path).toBe('/user/repos');
		expect(operation('comments.list').path).toBe(
			'/repos/{owner}/{repo}/issues/{index}/comments',
		);
	});

	it('leaves out the deprecated routes and the password-only token routes', () => {
		const routes = giteaOperations.map((o) => `${o.method} ${o.path}`);
		for (const left of [
			'POST /org/{org}/repos',
			'DELETE /repos/{owner}/{repo}/issues/{index}/comments/{id}',
			'PATCH /repos/{owner}/{repo}/issues/{index}/comments/{id}',
			'GET /repos/{owner}/{repo}/times/{user}',
			'GET /users/{username}/tokens',
			'POST /users/{username}/tokens',
			'DELETE /users/{username}/tokens/{token}',
		]) {
			expect(routes).not.toContain(left);
		}
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
					!(inner in giteaDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(giteaManifest);
		expect([...missing]).toEqual([]);
	});

	it('maps routes to the right kinds', () => {
		expect(operation('contents.raw').response).toBe('file');
		expect(operation('repos.downloadArchive').response).toBe('file');
		expect(operation('actions.artifacts.download').response).toBe('file');
		expect(operation('pulls.downloadDiff').response).toBe('text');
		expect(operation('misc.markdown.renderRaw').request).toBe('text');
		expect(operation('releases.assets.create').request).toBe('multipart');
		expect(operation('repos.delete').response).toBe('empty');
		expect(operation('comments.get').emptyOk).toBe(true);
		expect(operation('notifications.threads.markRead').emptyOk).toBe(true);
		expect(operation('repos.list').paginated).toBe(true);
		expect(operation('comments.list').paginated).toBeUndefined();
		expect(operation('user.gpgKeys.verify').request).toBe('json');
		expect(
			operation('actions.runners.createRegistrationToken').output,
		).toMatchObject({ properties: { token: { type: 'string' } } });
	});

	it('marks branch, ref and file path values as keeping their slashes', () => {
		const slashes = (id: string, field: string) =>
			(
				operation(id).input.properties as Record<
					string,
					Record<string, unknown>
				>
			)[field]?.['x-corsair-slashes'];
		expect(slashes('branches.get', 'branch')).toBe(true);
		expect(slashes('contents.get', 'filepath')).toBe(true);
		expect(slashes('commits.compare', 'basehead')).toBe(true);
		expect(slashes('branchProtections.get', 'name')).toBe(true);
		expect(slashes('repos.get', 'owner')).toBeUndefined();
		expect(slashes('packages.versions.get', 'name')).toBeUndefined();
	});
});

describe('catalog', () => {
	it('has meta and schemas for every operation', () => {
		expect(Object.keys(giteaEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(giteaEndpointSchemas).sort()).toEqual([...ids].sort());
		for (const meta of Object.values(giteaEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(getGiteaInputSchema(id)).toBeDefined();
			expect(getGiteaOutputSchema(id)).toBeDefined();
		}
		for (const webhook of giteaWebhookDefinitions) {
			expect(getGiteaWebhookPayloadSchema(webhook.id)).toBeDefined();
		}
	});

	it('rates reads, writes and destructive calls (R8)', () => {
		const risk = (id: string) =>
			giteaEndpointMeta[id as keyof typeof giteaEndpointMeta].riskLevel;
		for (const id of [
			'repos.get',
			'issues.list',
			'misc.markdown.render',
			'contents.getManyByPost',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of [
			'issues.create',
			'comments.create',
			'webhooks.create',
			'labels.update',
		]) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
		for (const id of [
			'repos.delete',
			'webhooks.delete',
			'pulls.merge',
			'branches.setCommit',
			'repos.transfer',
			'admin.users.create',
			'admin.users.update',
			'orgs.rename',
			'actions.secrets.set',
			'user.token.delete',
			'user.starred.unstar',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
		const irreversible = (id: string) =>
			(
				giteaEndpointMeta[id as keyof typeof giteaEndpointMeta] as {
					irreversible?: boolean;
				}
			).irreversible;
		expect(irreversible('repos.delete')).toBe(true);
		expect(irreversible('user.starred.unstar')).toBeUndefined();
		expect(
			Object.entries(giteaEndpointMeta).filter(
				([id, meta]) =>
					operation(id).method === 'DELETE' && meta.riskLevel !== 'destructive',
			),
		).toEqual([]);
	});

	it('takes the required fields and refuses a wrong type', () => {
		expect(
			getGiteaInputSchema('issues.create').safeParse({ owner: 'a', repo: 'b' })
				.success,
		).toBe(false);
		expect(
			getGiteaInputSchema('issues.create').safeParse({
				owner: 'a',
				repo: 'b',
				title: 't',
			}).success,
		).toBe(true);
		expect(
			getGiteaInputSchema('pulls.merge').safeParse({
				owner: 'a',
				repo: 'b',
				index: 1,
				do: 'yolo',
			}).success,
		).toBe(false);
		expect(
			getGiteaInputSchema('wiki.update').safeParse({
				owner: 'a',
				repo: 'b',
				pageName: 'Home',
			}).success,
		).toBe(false);
	});

	it('refuses values outside a documented enum', () => {
		const repo = { owner: 'gitea', repo: 'tea' };
		const list = getGiteaInputSchema('issues.list');
		expect(
			list.safeParse({ ...repo, state: 'open', type: 'issues' }).success,
		).toBe(true);
		expect(list.safeParse({ ...repo, state: 'merged' }).success).toBe(false);
		expect(list.safeParse({ ...repo, type: 'discussions' }).success).toBe(
			false,
		);
	});

	it('parses responses leniently: unknown fields kept, missing ones fine', () => {
		const out = getGiteaOutputSchema('repos.get').parse({
			id: 1,
			name: 'site',
			brand_new_field: { x: 1 },
		}) as Record<string, unknown>;
		expect(out.brand_new_field).toEqual({ x: 1 });
		expect(
			getGiteaOutputSchema('repos.get').safeParse({ id: 'one' }).success,
		).toBe(false);
	});
});

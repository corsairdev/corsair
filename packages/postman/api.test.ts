// Live API tests — skipped unless POSTMAN_API_KEY resolves (environment
// variable first, then the gitignored .env candidates below). They hit the
// real Postman API and prove the endpoint output schemas accept the shapes
// the provider actually returns.
//
// Run: cd packages/postman && POSTMAN_API_KEY=<key> pnpm test -- api.test
// Write tests additionally require POSTMAN_WRITE_ENABLED=true.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
	AccessKeys,
	Account,
	Collections,
	Environments,
	Groups,
	Mocks,
	Monitors,
	Scim,
	Users,
	Workspaces,
} from './endpoints';
import { PostmanEndpointOutputSchemas } from './endpoints/types';

function loadKey(): string | undefined {
	if (process.env.POSTMAN_API_KEY) return process.env.POSTMAN_API_KEY;
	const candidates = [
		resolve(process.cwd(), '.env'),
		resolve(process.cwd(), '../../.env'),
		resolve(process.cwd(), '../../demo/testing/.env'),
		resolve(process.cwd(), '../../demo/.env'),
	];
	for (const candidate of candidates) {
		try {
			for (const line of readFileSync(candidate, 'utf8').split(/\r?\n/)) {
				const match = /^POSTMAN_API_KEY=(.*)$/.exec(line.trim());
				if (match?.[1]) return match[1].replace(/^['"]|['"]$/g, '');
			}
		} catch {
			continue;
		}
	}
	return undefined;
}

const POSTMAN_API_KEY = loadKey();

// Collection create/delete mutate a real Postman workspace, so they only run
// when explicitly opted in via POSTMAN_WRITE_ENABLED=true. Read-only tests
// only need the API key.
const POSTMAN_WRITE_ENABLED = process.env.POSTMAN_WRITE_ENABLED === 'true';

type EndpointCtx = Parameters<typeof Collections.list>[0];

// Live context: real API key only; the stub is intentionally narrower than
// CorsairPluginContext.
const ctx = {
	key: POSTMAN_API_KEY ?? '',
} as unknown as EndpointCtx;

// Everything below touches the network, so the whole suite skips cleanly
// whenever no API key resolves.
const describeOrSkip = POSTMAN_API_KEY ? describe : describe.skip;

describeOrSkip('Postman API Type Tests', () => {
	it('account.me returns the authenticated user', async () => {
		const result = await Account.me(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.accountMe.parse(result);
		expect(parsed.user).toBeDefined();
	});

	it('collections.list returns collections', async () => {
		const result = await Collections.list(ctx, { limit: 1 });

		const parsed = PostmanEndpointOutputSchemas.collectionsList.parse(result);
		expect(Array.isArray(parsed.collections)).toBe(true);
	});

	it('workspaces.list returns workspaces', async () => {
		const result = await Workspaces.list(ctx, { limit: 1 });

		const parsed = PostmanEndpointOutputSchemas.workspacesList.parse(result);
		expect(Array.isArray(parsed.workspaces)).toBe(true);
	});

	it('environments.list returns environments', async () => {
		const result = await Environments.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.environmentsList.parse(result);
		expect(Array.isArray(parsed.environments)).toBe(true);
	});

	it('monitors.list returns monitors', async () => {
		const result = await Monitors.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.monitorsList.parse(result);
		expect(Array.isArray(parsed.monitors)).toBe(true);
	});

	it('mocks.list returns mock servers', async () => {
		const result = await Mocks.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.mocksList.parse(result);
		expect(Array.isArray(parsed.mocks)).toBe(true);
	});

	it('groups.list returns groups', async () => {
		const result = await Groups.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.groupsList.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('users.list returns team users', async () => {
		const result = await Users.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.usersList.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('accessKeys.list returns collection access keys', async () => {
		const result = await AccessKeys.list(ctx, {});

		const parsed = PostmanEndpointOutputSchemas.accessKeysList.parse(result);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('scim.getResourceTypes returns SCIM resource types', async () => {
		const result = await Scim.getResourceTypes(ctx, {});

		const parsed =
			PostmanEndpointOutputSchemas.scimGetResourceTypes.parse(result);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('workspaces.get fetches the first workspace', async () => {
		const listed = await Workspaces.list(ctx, { limit: 1 });
		const workspaceId =
			PostmanEndpointOutputSchemas.workspacesList.parse(listed).workspaces?.[0]
				?.id;
		expect(workspaceId).toBeDefined();

		const result = await Workspaces.get(ctx, {
			workspaceId: workspaceId ?? '',
		});

		const parsed = PostmanEndpointOutputSchemas.workspacesGet.parse(result);
		expect(parsed.workspace?.id).toBe(workspaceId);
	});
});

// Write operations mutate a real Postman workspace, so they only run when
// explicitly opted in via POSTMAN_WRITE_ENABLED=true.
const describeWriteOrSkip =
	POSTMAN_API_KEY && POSTMAN_WRITE_ENABLED ? describe : describe.skip;

describeWriteOrSkip('Postman API write tests', () => {
	let workspaceId: string | undefined;
	let collectionId: string | undefined;

	afterAll(async () => {
		// Best-effort cleanup so a mid-chain failure does not leave scratch
		// data behind in the real account.
		if (!ctx.key || !collectionId) return;
		try {
			await Collections.remove(ctx, { collectionId });
			collectionId = undefined;
		} catch (error) {
			console.warn(`cleanup: collection delete failed: ${String(error)}`);
		}
	});

	it('collections.create creates a scratch collection', async () => {
		const listed = await Workspaces.list(ctx, { limit: 1 });
		workspaceId =
			PostmanEndpointOutputSchemas.workspacesList.parse(listed).workspaces?.[0]
				?.id;
		expect(workspaceId).toBeDefined();

		const result = await Collections.create(ctx, {
			workspace: workspaceId ?? '',
			collection: {
				info: {
					name: `corsair-live-test-${Date.now()}`,
					schema:
						'https://schema.postman.com/json/collection/v2.1.0/collection.json',
				},
				item: [],
			},
		});

		const parsed = PostmanEndpointOutputSchemas.collectionsCreate.parse(result);
		collectionId = parsed.collection?.id;
		expect(collectionId).toBeTruthy();
	});

	it('collections.remove deletes the scratch collection', async () => {
		expect(collectionId).toBeDefined();

		const result = await Collections.remove(ctx, {
			collectionId: collectionId ?? '',
		});

		expect(
			PostmanEndpointOutputSchemas.collectionsRemove.parse(result),
		).toBeDefined();
		collectionId = undefined;
	});
});

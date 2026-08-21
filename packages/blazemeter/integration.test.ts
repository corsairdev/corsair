/**
 * Live checks against a real BlazeMeter account.
 *
 * Skipped unless `BLAZEMETER_API_KEY_ID` and `BLAZEMETER_API_KEY_SECRET`
 * are set. Reads only, plus one disposable project that is deleted before
 * the suite finishes.
 */
import { blazemeterEndpointsNested } from './endpoints';
import {
	BlazemeterAccountEntity,
	BlazemeterProjectEntity,
	BlazemeterUserEntity,
	BlazemeterWorkspaceEntity,
} from './schema/database';

const apiKeyId = process.env.BLAZEMETER_API_KEY_ID;
const apiKeySecret = process.env.BLAZEMETER_API_KEY_SECRET;
const live = Boolean(apiKeyId && apiKeySecret);
const describeLive = live ? describe : describe.skip;

type Ctx = Parameters<(typeof blazemeterEndpointsNested.user)['get']>[0];

function unwrap(response: unknown): unknown {
	if (response && typeof response === 'object' && 'result' in response) {
		return (response as { result: unknown }).result;
	}
	return response;
}

function makeCtx(): Ctx {
	return {
		key: `${apiKeyId}:${apiKeySecret}`,
		db: undefined,
		$getAccountId: async () => 'live',
	} as unknown as Ctx;
}

describeLive('BlazeMeter live API', () => {
	const ctx = makeCtx();
	let accountId: number | undefined;
	let workspaceId: number | undefined;
	let createdProjectId: number | undefined;

	afterAll(async () => {
		if (createdProjectId == null) return;
		await blazemeterEndpointsNested.projects.remove(ctx, {
			id: createdProjectId,
			force: true,
		});
	});

	it('returns the authenticated user matching the official GET /user shape', async () => {
		const response = await blazemeterEndpointsNested.user.get(ctx, {});
		const user = unwrap(response);
		expect(BlazemeterUserEntity.safeParse(user).success).toBe(true);
		expect((user as { id: number }).id).toBeGreaterThan(0);
	});

	it('lists accounts and workspaces with official field names', async () => {
		const accountsResponse = await blazemeterEndpointsNested.accounts.list(
			ctx,
			{ limit: 10 },
		);
		const accounts = unwrap(accountsResponse);
		expect(Array.isArray(accounts)).toBe(true);
		expect((accounts as unknown[]).length).toBeGreaterThan(0);
		expect(
			BlazemeterAccountEntity.safeParse((accounts as unknown[])[0]).success,
		).toBe(true);
		accountId = (accounts as { id: number }[])[0]?.id;

		const workspacesResponse = await blazemeterEndpointsNested.workspaces.list(
			ctx,
			{ accountId: accountId!, limit: 10 },
		);
		const workspaces = unwrap(workspacesResponse);
		expect(Array.isArray(workspaces)).toBe(true);
		expect((workspaces as unknown[]).length).toBeGreaterThan(0);
		expect(
			BlazemeterWorkspaceEntity.safeParse((workspaces as unknown[])[0]).success,
		).toBe(true);
		workspaceId = (workspaces as { id: number }[])[0]?.id;
	});

	it('lists projects in the workspace', async () => {
		expect(workspaceId).toBeDefined();
		const response = await blazemeterEndpointsNested.projects.list(ctx, {
			workspaceId,
			limit: 10,
		});
		const projects = unwrap(response);
		expect(Array.isArray(projects)).toBe(true);
		if ((projects as unknown[]).length > 0) {
			expect(
				BlazemeterProjectEntity.safeParse((projects as unknown[])[0]).success,
			).toBe(true);
		}
	});

	it('creates a disposable project and reads it back', async () => {
		expect(workspaceId).toBeDefined();
		const created = unwrap(
			await blazemeterEndpointsNested.projects.create(ctx, {
				name: `corsair-pr814-${Date.now()}`,
				description: 'disposable verification project',
				workspaceId,
			}),
		);
		const rawId =
			created && typeof created === 'object' && 'id' in created
				? (created as { id: unknown }).id
				: undefined;
		if (typeof rawId === 'number' && rawId > 0) createdProjectId = rawId;
		expect(BlazemeterProjectEntity.safeParse(created).success).toBe(true);
		expect(createdProjectId).toBeGreaterThan(0);

		const fetched = unwrap(
			await blazemeterEndpointsNested.projects.get(ctx, {
				id: createdProjectId,
			}),
		);
		expect(BlazemeterProjectEntity.safeParse(fetched).success).toBe(true);
		expect((fetched as { id: number }).id).toBe(createdProjectId);
	});
});

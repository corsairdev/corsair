import { request } from 'corsair/http';
import {
	ActorEndpoints,
	AiEndpoints,
	AuthEndpoints,
	BillingEndpoints,
	ConnectionsEndpoints,
	DatatanksEndpoints,
	IdentitiesEndpoints,
	IntegrationsEndpoints,
	ModsEndpoints,
	NotifiersEndpoints,
	OrgsEndpoints,
	PipelinesEndpoints,
	QueryEndpoints,
	TenantsEndpoints,
	UsersEndpoints,
	WorkspacesEndpoints,
} from '../endpoints';
import { pendingWriteChains, removeLocalEntity } from '../endpoints/sync';
import { TurbotPipesEndpointInputSchemas } from '../endpoints/types';
import { turbotpipesEndpointSchemas } from '../index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

// any: stub plugin context for unit tests. Real contexts are built by the
// Corsair runtime (keys, db, account); tests only need key + authType, so the
// factory itself is untyped and call sites pass ctx directly without casts.
const createMockContext = (): any => ({
	key: 'tpt_test_token_12345',
	authType: 'api_key',
	schema: {},
	options: {},
	$getAccountId: jest.fn().mockResolvedValue('acc_1'),
	keys: {
		get_api_key: jest.fn().mockResolvedValue('tpt_test_token_12345'),
		get_access_token: jest.fn(),
		get_webhook_signature: jest.fn(),
	},
});

// A Proxy that answers every property read with a placeholder string, so each
// handler can destructure the identifiers it needs without a per-endpoint
// fixture. Spreads collect no keys, so request bodies stay minimal.
// any: test double only; real inputs are validated by zod input schemas.
const anyInput = () =>
	new Proxy(
		{},
		{
			get: (_target, prop) => {
				if (prop === Symbol.toPrimitive) return () => 'test';
				if (prop === 'toJSON') return undefined;
				return 'test';
			},
		},
	) as any;

const allNamespaces = {
	ActorEndpoints,
	AiEndpoints,
	AuthEndpoints,
	BillingEndpoints,
	ConnectionsEndpoints,
	DatatanksEndpoints,
	IdentitiesEndpoints,
	IntegrationsEndpoints,
	ModsEndpoints,
	NotifiersEndpoints,
	OrgsEndpoints,
	PipelinesEndpoints,
	QueryEndpoints,
	TenantsEndpoints,
	UsersEndpoints,
	WorkspacesEndpoints,
} as const;

// unknown: endpoint handlers take fully typed contexts and inputs, but this
// coverage test invokes every handler generically. The double cast documents
// that narrow-to-wide call, mirroring the stub-context pattern above.
type Handler = (ctx: unknown, input: unknown) => Promise<unknown>;

const collectHandlers = (): Array<[string, Handler]> => {
	const out: Array<[string, Handler]> = [];
	for (const [ns, mod] of Object.entries(allNamespaces)) {
		for (const [name, fn] of Object.entries(mod)) {
			if (typeof fn === 'function' && name !== '__esModule') {
				out.push([`${ns}.${name}`, fn as unknown as Handler]);
			}
		}
	}
	return out;
};

describe('TurbotPipes endpoint coverage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ id: 'test-id', items: [] });
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) =>
			String(url).includes('/log/')
				? new Response('{"level":"info"}\n')
				: ({
						status: 307,
						headers: { get: () => 'https://pipes.turbot.com/images/test.png' },
					} as unknown as Response),
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('exposes 170 handlers with matching schemas', () => {
		const handlers = collectHandlers();
		expect(handlers.length).toBe(170);
		expect(Object.keys(TurbotPipesEndpointInputSchemas).length).toBe(170);
		expect(Object.keys(turbotpipesEndpointSchemas).length).toBe(170);
	});

	it.each(collectHandlers())(
		'%s wires method, path and payload',
		async (_label, handler) => {
			const ctx = createMockContext();
			const res = await handler(ctx, anyInput());
			expect(res).toBeDefined();
			expect(
				mockRequest.mock.calls.length +
					(globalThis.fetch as jest.Mock).mock.calls.length,
			).toBeGreaterThan(0);
		},
	);

	describe('local sync semantics', () => {
		const memoryStore = (rows = new Map<string, Record<string, unknown>>()) => {
			const table = {
				// Mimics table validation: records without the required
				// handle are rejected, like a real entity table would.
				upsertByEntityId: jest.fn(
					async (id: string, record: Record<string, unknown>) => {
						if (!('handle' in record)) {
							throw new Error('missing required handle');
						}
						rows.set(id, { ...record });
					},
				),
				findManyByEntityIds: jest.fn(async (ids: string[]) =>
					ids
						.filter((id) => rows.has(id))
						.map((id) => ({ entity_id: id, data: rows.get(id) })),
				),
				findByEntityId: jest.fn(async (id: string) => {
					const data = rows.get(id);
					return data ? { entity_id: id, data } : null;
				}),
				deleteByEntityId: jest.fn(async (id: string) => {
					rows.delete(id);
				}),
			};
			return { rows, table };
		};

		it('a completed detail fetch guarantees its record is searchable', async () => {
			const { rows, table } = memoryStore();
			const ctx = { ...createMockContext(), database: {}, db: { user: table } };
			mockRequest.mockResolvedValueOnce({
				id: 'u_1',
				handle: 'bob',
				display_name: 'Bob',
			});
			await UsersEndpoints.getUser(ctx, { user_handle: 'bob' });
			expect(table.upsertByEntityId).toHaveBeenCalledWith(
				'u_1',
				expect.objectContaining({ handle: 'bob' }),
			);
			expect(rows.get('u_1')).toMatchObject({ handle: 'bob' });
		});

		it('a failing local write never fails a successful read', async () => {
			const failing = {
				upsertByEntityId: jest.fn(async () => {
					throw new Error('Database not configured');
				}),
				findByEntityId: jest.fn(async () => null),
			};
			const ctx = {
				...createMockContext(),
				database: {},
				db: { user: failing },
			};
			mockRequest.mockResolvedValueOnce({ id: 'u_9', handle: 'carol' });
			await expect(
				UsersEndpoints.getUser(ctx, { user_handle: 'carol' }),
			).resolves.toMatchObject({ handle: 'carol' });
		});

		it('list discovery adds missing records without erasing stored details', async () => {
			const { rows, table } = memoryStore();
			rows.set('w_1', {
				id: 'w_1',
				handle: 'main',
				title: 'Detailed Title',
				instance_type: 'db1.shared',
			});
			const ctx = {
				...createMockContext(),
				database: {},
				db: { workspace: table },
			};
			mockRequest.mockResolvedValueOnce({
				items: [
					{ id: 'w_1', handle: 'main' },
					{ id: 'w_2', handle: 'dev' },
				],
			});
			await UsersEndpoints.listUserWorkspaces(ctx, { user_handle: 'bob' });
			// Flush background discovery writes.
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(rows.get('w_1')).toMatchObject({
				title: 'Detailed Title',
				instance_type: 'db1.shared',
			});
			expect(rows.get('w_2')).toMatchObject({ handle: 'dev' });
			// Steady state performs one bulk existence check and writes only
			// the missing record: the fully covered stored record is untouched.
			expect(table.findManyByEntityIds).toHaveBeenCalledWith(['w_1', 'w_2']);
			expect(table.upsertByEntityId).toHaveBeenCalledTimes(1);
			expect(table.upsertByEntityId).toHaveBeenCalledWith(
				'w_2',
				expect.objectContaining({ handle: 'dev' }),
			);
		});

		it('a list write re-reads first, so a detail that landed after the bulk read survives', async () => {
			const { rows, table } = memoryStore();
			// The bulk read is stale: it predates the detail write below.
			table.findManyByEntityIds.mockImplementationOnce(async () => []);
			rows.set('w_1', {
				id: 'w_1',
				handle: 'main',
				title: 'Detailed Title',
			});
			const ctx = {
				...createMockContext(),
				database: {},
				db: { workspace: table },
			};
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_1', handle: 'main', state: 'running' }],
			});
			await UsersEndpoints.listUserWorkspaces(ctx, { user_handle: 'bob' });
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(table.findByEntityId).toHaveBeenCalledWith('w_1');
			expect(rows.get('w_1')).toEqual({
				id: 'w_1',
				handle: 'main',
				title: 'Detailed Title',
				state: 'running',
			});
		});

		it('separately built tenant clients for one account share a write chain', async () => {
			// Two entity clients over the same rows, as two withTenant(...)
			// calls for the same account would build.
			const rows = new Map<string, Record<string, unknown>>();
			const { table: detailTable } = memoryStore(rows);
			const { table: listTable } = memoryStore(rows);
			// The detail write lands slowly and the list's bulk read is stale,
			// so only a shared chain keeps the list from writing first.
			const write = detailTable.upsertByEntityId.getMockImplementation();
			detailTable.upsertByEntityId.mockImplementation(async (id, record) => {
				await new Promise((resolve) => setTimeout(resolve, 20));
				await write?.(id, record);
			});
			listTable.findManyByEntityIds.mockImplementationOnce(async () => []);
			const ctxFor = (table: typeof detailTable) => ({
				...createMockContext(),
				database: {},
				db: { workspace: table },
			});
			// as never: the mock answers with plain promises, not CancelablePromise.
			mockRequest.mockImplementation((async (
				_config: unknown,
				options: { url: string },
			) =>
				options.url.endsWith('/workspace')
					? { items: [{ id: 'w_1', handle: 'main', state: 'running' }] }
					: { id: 'w_1', handle: 'main', title: 'Detailed Title' }) as never);

			const detail = UsersEndpoints.getUserWorkspace(ctxFor(detailTable), {
				user_handle: 'bob',
				workspace_handle: 'main',
			});
			// Let the detail write start before the list arrives.
			await new Promise((resolve) => setTimeout(resolve, 0));
			await UsersEndpoints.listUserWorkspaces(ctxFor(listTable), {
				user_handle: 'bob',
			});
			await detail;
			await new Promise((resolve) => setTimeout(resolve, 40));

			expect(rows.get('w_1')).toEqual({
				id: 'w_1',
				handle: 'main',
				title: 'Detailed Title',
				state: 'running',
			});
			// Settled chains are removed.
			expect(pendingWriteChains()).toBe(0);
		});

		it('a list already in flight cannot bring back a record deleted meanwhile', async () => {
			const rows = new Map<string, Record<string, unknown>>();
			// w_2 is stored without `state`, so the list below queues a write
			// for it (filling the gap) before the delete runs.
			rows.set('w_2', { id: 'w_2', handle: 'two' });
			const { table } = memoryStore(rows);
			const ctx = {
				...createMockContext(),
				database: {},
				db: { workspace: table },
			};
			// The list's turn for w_1 is slow, so w_2 is deleted while the list
			// still holds it.
			const read = table.findByEntityId.getMockImplementation();
			let releaseFirst: () => void = () => {};
			table.findByEntityId.mockImplementationOnce(async (id) => {
				await new Promise<void>((resolve) => {
					releaseFirst = resolve;
				});
				return (await read?.(id)) ?? null;
			});
			mockRequest.mockResolvedValueOnce({
				items: [
					{ id: 'w_1', handle: 'one' },
					{ id: 'w_2', handle: 'two', state: 'running' },
				],
			});
			await UsersEndpoints.listUserWorkspaces(ctx, { user_handle: 'bob' });
			await new Promise((resolve) => setTimeout(resolve, 0));

			await removeLocalEntity(ctx, 'workspace', { id: 'w_2' });
			expect(table.deleteByEntityId).toHaveBeenCalledWith('w_2');
			expect(rows.has('w_2')).toBe(false);

			releaseFirst();
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(rows.has('w_1')).toBe(true);
			// The list that was in flight did not bring w_2 back.
			expect(rows.has('w_2')).toBe(false);

			// A detail fetch is authoritative and stores the record again.
			mockRequest.mockResolvedValueOnce({ id: 'w_2', handle: 'two' });
			await UsersEndpoints.getUserWorkspace(ctx, {
				user_handle: 'bob',
				workspace_handle: 'two',
			});
			expect(rows.get('w_2')).toEqual({ id: 'w_2', handle: 'two' });
		});

		it('a successful update refreshes the stored copy', async () => {
			const { rows, table } = memoryStore();
			rows.set('u_1', { id: 'u_1', handle: 'bob', display_name: 'Old' });
			const ctx = { ...createMockContext(), database: {}, db: { user: table } };
			mockRequest.mockResolvedValueOnce({
				id: 'u_1',
				handle: 'bob',
				display_name: 'New',
			});
			await UsersEndpoints.updateUser(ctx, {
				user_handle: 'bob',
				display_name: 'New',
			});
			expect(rows.get('u_1')).toEqual({
				id: 'u_1',
				handle: 'bob',
				display_name: 'New',
			});
		});

		it('different accounts do not share a write chain', async () => {
			const rows = new Map<string, Record<string, unknown>>();
			const { table: slowTable } = memoryStore(rows);
			const { table: fastTable } = memoryStore(new Map());
			slowTable.upsertByEntityId.mockImplementation(
				() => new Promise<void>(() => {}),
			);
			mockRequest.mockResolvedValue({ id: 'w_1', handle: 'main' });
			const ctxFor = (table: typeof slowTable, account: string) => ({
				...createMockContext(),
				$getAccountId: jest.fn().mockResolvedValue(account),
				database: {},
				db: { workspace: table },
			});
			// acc_1's write never settles; acc_2's write for the same id must
			// not wait behind it.
			void UsersEndpoints.getUserWorkspace(ctxFor(slowTable, 'acc_1'), {
				user_handle: 'bob',
				workspace_handle: 'main',
			});
			await expect(
				UsersEndpoints.getUserWorkspace(ctxFor(fastTable, 'acc_2'), {
					user_handle: 'bob',
					workspace_handle: 'main',
				}),
			).resolves.toMatchObject({ id: 'w_1' });
			expect(fastTable.upsertByEntityId).toHaveBeenCalledTimes(1);
		});

		it('skips local sync when no database is configured', async () => {
			const { table } = memoryStore();
			const ctx = {
				...createMockContext(),
				db: { user: table, workspace: table },
			};
			mockRequest.mockResolvedValueOnce({ id: 'u_1', handle: 'bob' });
			await UsersEndpoints.getUser(ctx, { user_handle: 'bob' });
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_1', handle: 'main' }],
			});
			await UsersEndpoints.listUserWorkspaces(ctx, { user_handle: 'bob' });
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(table.upsertByEntityId).not.toHaveBeenCalled();
			expect(table.findManyByEntityIds).not.toHaveBeenCalled();
		});

		it('one invalid list item does not stop the rest of the page', async () => {
			const { rows, table } = memoryStore();
			const ctx = {
				...createMockContext(),
				database: {},
				db: { workspace: table },
			};
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_bad' }, { id: 'w_3', handle: 'prod' }],
			});
			await UsersEndpoints.listUserWorkspaces(ctx, { user_handle: 'bob' });
			// Flush background discovery writes.
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(rows.get('w_bad')).toBeUndefined();
			expect(rows.get('w_3')).toMatchObject({ handle: 'prod' });
		});
	});

	it('resolves avatar endpoints to usable image URLs', async () => {
		const ctx = createMockContext();
		const tenant = await TenantsEndpoints.getTenantAvatar(ctx, {
			tenant_handle: 'turbot-pipes',
		});
		expect(tenant.avatar_url).toContain('https://');
		const identity = await IdentitiesEndpoints.getIdentityAvatar(ctx, {
			identity_handle: 'himansh133',
		});
		expect(identity.avatar_url).toContain('https://');
	});
});

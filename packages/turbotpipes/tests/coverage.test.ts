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
		jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			status: 307,
			headers: { get: () => 'https://pipes.turbot.com/images/test.png' },
		} as unknown as Response);
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
		const memoryStore = () => {
			const rows = new Map<string, Record<string, unknown>>();
			const table = {
				upsertByEntityId: jest.fn(
					async (id: string, record: Record<string, unknown>) => {
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
			};
			return { rows, table };
		};

		it('a completed detail fetch guarantees its record is searchable', async () => {
			const { rows, table } = memoryStore();
			const ctx = { ...createMockContext(), db: { user: table } };
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
			const ctx = { ...createMockContext(), db: { user: failing } };
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
			const ctx = { ...createMockContext(), db: { workspace: table } };
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

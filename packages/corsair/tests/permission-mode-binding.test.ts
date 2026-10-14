import { bindEndpointsRecursively } from '../core/endpoints/bind';
import { PermissionRequiredError, runWithMode } from '../core/permissions';
import type {
	EndpointMetaEntry,
	PermissionMode,
	PermissionPolicy,
} from '../core/plugins';
import type { CorsairDatabase } from '../db/kysely/database';
import { createTestDatabase } from './setup-db';

const META: Record<string, EndpointMetaEntry> = {
	list: { riskLevel: 'read' },
	post: { riskLevel: 'write' },
	purge: { riskLevel: 'destructive' },
};

type Api = {
	list: () => Promise<string>;
	post: () => Promise<string>;
	purge: () => Promise<string>;
};

function bind(
	config?: {
		mode: PermissionMode;
		overrides?: Record<string, PermissionPolicy>;
	},
	database?: CorsairDatabase,
): Api {
	// bindEndpointsRecursively declares `tree` an out-param of exactly this
	// shape and writes the endpoints into it.
	const tree: Record<string, unknown> = {};
	bindEndpointsRecursively({
		endpoints: {
			list: async () => 'listed',
			post: async () => 'posted',
			purge: async () => 'purged',
		},
		hooks: undefined,
		ctx: {},
		tree,
		pluginId: 'demo',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: META,
		permissionsConfig: config,
		database,
	});
	return tree as Api;
}

describe("the caller's mode on a bound endpoint", () => {
	describe('a plugin carrying no config of its own', () => {
		it('allows everything with no scope open', async () => {
			const api = bind();
			await expect(api.post()).resolves.toBe('posted');
			await expect(api.purge()).resolves.toBe('purged');
		});

		it('blocks a write under strict and still serves a read', async () => {
			const api = bind();
			await runWithMode('strict', async () => {
				await expect(api.post()).rejects.toThrow(PermissionRequiredError);
				await expect(api.list()).resolves.toBe('listed');
			});
		});

		it('blocks a destructive call under cautious but not a write', async () => {
			const api = bind();
			await runWithMode('cautious', async () => {
				await expect(api.purge()).rejects.toThrow(PermissionRequiredError);
				await expect(api.post()).resolves.toBe('posted');
			});
		});

		it('allows everything under open', async () => {
			const api = bind();
			await runWithMode('open', async () => {
				await expect(api.post()).resolves.toBe('posted');
				await expect(api.purge()).resolves.toBe('purged');
			});
		});
	});

	describe('against a plugin that carries its own config', () => {
		it('keeps gating on the config when no scope is open', async () => {
			const api = bind({ mode: 'strict' });
			await expect(api.post()).rejects.toThrow(PermissionRequiredError);
		});

		it("takes the caller's mode over a wider config", async () => {
			const api = bind({ mode: 'open' });
			await runWithMode('strict', async () => {
				await expect(api.post()).rejects.toThrow(PermissionRequiredError);
			});
		});

		// A caller naming a mode must not be able to relax the server's own. The
		// two compose to whichever forbids more, in both directions.
		it('keeps a stricter config when the caller asks for less', async () => {
			const api = bind({ mode: 'strict' });
			await runWithMode('open', async () => {
				await expect(api.post()).rejects.toThrow(PermissionRequiredError);
			});
		});

		it('refuses a destructive call a readonly config forbids', async () => {
			const api = bind({ mode: 'readonly' });
			await runWithMode('open', async () => {
				await expect(api.purge()).rejects.toThrow();
				await expect(api.list()).resolves.toBe('listed');
			});
		});

		// The caller tightened nothing, so the plugin's own exception stands.
		it('leaves an override standing when the caller matches the config', async () => {
			const api = bind({ mode: 'strict', overrides: { post: 'allow' } });
			await expect(api.post()).resolves.toBe('posted');
			await runWithMode('strict', async () => {
				await expect(api.post()).resolves.toBe('posted');
			});
		});

		it('leaves an override standing when the caller asks for less', async () => {
			const api = bind({ mode: 'strict', overrides: { post: 'allow' } });
			await runWithMode('open', async () => {
				await expect(api.post()).resolves.toBe('posted');
			});
		});

		it('overrules an override when the caller tightens past the config', async () => {
			const api = bind({ mode: 'open', overrides: { purge: 'allow' } });
			await expect(api.purge()).resolves.toBe('purged');
			await runWithMode('readonly', async () => {
				await expect(api.purge()).rejects.toThrow();
			});
		});

		it('keeps an override that is stricter than the scope', async () => {
			const api = bind({ mode: 'open', overrides: { list: 'deny' } });
			await runWithMode('open', async () => {
				await expect(api.list()).rejects.toThrow(PermissionRequiredError);
			});
		});
	});
});

// Without a database require_approval fails closed as a deny, so the cases
// above never reach the record-keeping path.
describe('require_approval against a database', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		env = createTestDatabase();
		await env.db.schema
			.createTable('corsair_permissions')
			.ifNotExists()
			.addColumn('id', 'text', (c) => c.primaryKey())
			.addColumn('created_at', 'integer', (c) => c.notNull())
			.addColumn('updated_at', 'integer', (c) => c.notNull())
			.addColumn('token', 'text', (c) => c.notNull())
			.addColumn('plugin', 'text', (c) => c.notNull())
			.addColumn('endpoint', 'text', (c) => c.notNull())
			.addColumn('args', 'text', (c) => c.notNull())
			.addColumn('tenant_id', 'text', (c) => c.notNull())
			.addColumn('status', 'text', (c) => c.notNull())
			.addColumn('expires_at', 'text', (c) => c.notNull())
			.addColumn('error', 'text')
			.execute();
	});

	afterEach(() => env?.cleanup?.());

	it('records a pending approval for a write under strict', async () => {
		const api = bind(undefined, env.database);

		await runWithMode('strict', async () => {
			await expect(api.post()).rejects.toThrow(PermissionRequiredError);
		});

		const rows = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			plugin: 'demo',
			endpoint: 'post',
			status: 'pending',
		});
		expect(rows[0]?.token).toBeTruthy();
	});

	it('does not record anything for a read', async () => {
		const api = bind(undefined, env.database);

		await runWithMode('strict', async () => {
			await expect(api.list()).resolves.toBe('listed');
		});

		const rows = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(0);
	});

	it('denies a destructive call under strict without recording one', async () => {
		const api = bind(undefined, env.database);

		await runWithMode('strict', async () => {
			await expect(api.purge()).rejects.toThrow(PermissionRequiredError);
		});

		const rows = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(0);
	});

	it('reuses the pending record instead of opening a second one', async () => {
		const api = bind(undefined, env.database);

		await runWithMode('strict', async () => {
			await expect(api.post()).rejects.toThrow(PermissionRequiredError);
			await expect(api.post()).rejects.toThrow(PermissionRequiredError);
		});

		const rows = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.execute();
		expect(rows).toHaveLength(1);
	});
});

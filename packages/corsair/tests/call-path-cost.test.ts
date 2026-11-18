import { z } from 'zod';

// Counts real scrypt derivations regardless of who calls decryptDEK.
const scryptCalls = { n: 0 };
jest.mock('crypto', () => {
	const actual = jest.requireActual('crypto');
	return {
		...actual,
		scrypt: (...args: unknown[]) => {
			scryptCalls.n++;
			return actual.scrypt(...args);
		},
	};
});

import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { createAccountKeyManager } from '../core/auth/key-manager';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { logEventFromContext } from '../plugins/utils/events';
import { setupCorsair } from '../setup';
import type { EndpointCtx } from './multi-account-fixtures';
import { dynamic } from './multi-account-fixtures';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

type EventCtx = Parameters<typeof logEventFromContext>[0];

const demo = {
	id: 'demo',
	options: { authType: 'oauth_2' as const },
	authConfig: { oauth_2: { account: [] as const } },
	schema: {
		version: '1',
		entities: { notes: z.object({ title: z.string() }) },
	},
	endpoints: {
		// the real oauth path reads both together
		token: async (ctx: EndpointCtx) => {
			const keys = ctx.keys as unknown as Record<
				string,
				() => Promise<string | null>
			>;
			const [token] = await Promise.all([
				keys.get_access_token?.(),
				keys.get_expires_at?.(),
			]);
			return token;
		},
		note: async (ctx: EndpointCtx) => {
			await ctx.db.notes.upsertByEntityId('n1', { title: 'hi' });
			return true;
		},
		event: async (ctx: EndpointCtx) =>
			logEventFromContext(ctx as unknown as EventCtx, 'demo.ping', { a: 1 }),
	},
} as unknown as CorsairPlugin;

describe('bound-account call path cost', () => {
	let env: ReturnType<typeof createTestDatabase>;
	let queries = 0;
	const cost = async (fn: () => Promise<unknown>) => {
		queries = 0;
		scryptCalls.n = 0;
		await fn();
		return { queries, scrypt: scryptCalls.n };
	};

	beforeEach(() => {
		env = createTestDatabase();
	});
	afterEach(() => env.cleanup());

	async function boot() {
		const counted = env.db.withPlugin({
			transformQuery: (args) => {
				queries++;
				return args.node;
			},
			transformResult: async (args) => args.result,
		});
		const corsair = createCorsair({
			plugins: [demo],
			database: counted,
			kek: KEK,
			multiTenancy: true,
			multiAccount: true,
			encryptDataAtRest: true,
		});
		getCorsairInternal(corsair).database!.isPg = false;
		await setupCorsair(corsair, { tenantId: 't1' });
		await env.db.deleteFrom('corsair_accounts').execute();
		const integ = await env.db
			.selectFrom('corsair_integrations')
			.select('id')
			.where('name', '=', 'demo')
			.executeTakeFirstOrThrow();
		const dek = generateDEK();
		const now = new Date();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: 'acct-a',
				created_at: now,
				updated_at: now,
				tenant_id: 't1',
				integration_id: integ.id,
				config: encryptConfig(
					{ account_ref: 'a', account_label: 'a@x.com' },
					dek,
				),
				dek: await encryptDEK(dek, KEK),
			})
			.execute();
		await createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			account: { ref: 'a' },
		}).set_access_token('tok-a');

		const t = dynamic<'demo'>(corsair).withTenant('t1', {
			accounts: { demo: 'a' },
		});
		// first call pins the account; measure the steady state after it
		await t.demo.api.token();
		return { t, corsair };
	}

	it('costs this many queries and scrypts per operation', async () => {
		const { t } = await boot();
		const token = await cost(() => t.demo.api.token());
		const upsert = await cost(() => t.demo.api.note());
		const event = await cost(() =>
			(t.demo.api as unknown as { event(): Promise<unknown> }).event(),
		);
		expect({ token, upsert, event }).toEqual({
			token: { queries: 1, scrypt: 0 },
			upsert: { queries: 6, scrypt: 0 },
			event: { queries: 3, scrypt: 0 },
		});
	});

	it('concurrent calls share one account revalidation', async () => {
		const { t } = await boot();
		const one = await cost(() => t.demo.api.note());
		const three = await cost(() =>
			Promise.all([t.demo.api.note(), t.demo.api.note(), t.demo.api.note()]),
		);
		expect(three.queries).toBe(13);
	});

	it('a settled read is never reused: a rotated token is seen by the next call', async () => {
		const { t, corsair } = await boot();
		expect(await t.demo.api.token()).toBe('tok-a');
		await createAccountKeyManager({
			authType: 'oauth_2',
			integrationName: 'demo',
			tenantId: 't1',
			kek: KEK,
			database: getCorsairInternal(corsair).database!,
			account: { ref: 'a' },
		}).set_access_token('tok-b');
		expect(await t.demo.api.token()).toBe('tok-b');
	});
});

import {
	TURSO_API_BASE,
	TURSO_REGION_BASE,
	tursoFetchJson,
	tursoPipelineHealthCheck,
} from './client';
import { Changes, Tokens } from './endpoints';
import { TursoEndpointOutputSchemas } from './endpoints/types';
import type { TursoContext } from './index';

const API_KEY = process.env.TURSO_API_KEY;
const DATABASE_URL = process.env.TURSO_DATABASE_URL;
const DATABASE_TOKEN = process.env.TURSO_DATABASE_TOKEN;

const describeLive = API_KEY ? describe : describe.skip;

describeLive('Turso live API integration tests', () => {
	it('1. TURSO_CLOSEST_REGION - gets closest region without authentication', async () => {
		const raw = await tursoFetchJson(TURSO_REGION_BASE);
		const parsed = TursoEndpointOutputSchemas.closestRegion.parse(raw);

		expect(typeof parsed.server).toBe('string');
		expect(parsed.server.length).toBeGreaterThan(0);
		expect(typeof parsed.client).toBe('string');
		expect(parsed.client.length).toBeGreaterThan(0);
	});

	it('2. TURSO_VALIDATE_API_TOKEN - validates API token and retrieves expiry', async () => {
		const key = API_KEY as string;
		const raw = await tursoFetchJson(`${TURSO_API_BASE}/v1/auth/validate`, {
			apiKey: key,
		});
		const parsed = TursoEndpointOutputSchemas.validateApiToken.parse(raw);

		expect(typeof parsed.exp).toBe('number');
		expect(Number.isInteger(parsed.exp)).toBe(true);

		const liveCtx = {
			id: 'turso',
			key,
			options: { key },
			keys: {
				get_api_key: async () => key,
				get_database_token: async () => null,
				get_webhook_signature: async () => null,
				set_api_key: async () => undefined,
				set_database_token: async () => undefined,
				set_webhook_signature: async () => undefined,
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'new-dek',
			},
			$getAccountId: async () => 'acc_test',
			db: {
				changeEvents: {
					findByEntityId: async () => null,
					existsByEntityId: async () => false,
					findIdByEntityId: async () => null,
					findById: async () => null,
					findManyByEntityIds: async () => [],
					list: async () => [],
					search: async () => [],
					upsertByEntityId: async () => ({}) as never,
					deleteById: async () => true,
					deleteByEntityId: async () => true,
					count: async () => 0,
				},
			},
			endpoints: {},
		} as TursoContext;

		const endpointResult = await Tokens.validate(liveCtx, {});
		expect(endpointResult.exp).toBe(parsed.exp);
	});

	if (DATABASE_URL) {
		it('3. TURSO_LISTEN_TO_CHANGES - queries database changes or health check fallback', async () => {
			const key = API_KEY as string;
			const liveCtx = {
				id: 'turso',
				key,
				options: {
					key,
					databaseToken: DATABASE_TOKEN,
				},
				keys: {
					get_api_key: async () => key,
					get_database_token: async () => DATABASE_TOKEN ?? null,
					get_webhook_signature: async () => null,
					set_api_key: async () => undefined,
					set_database_token: async () => undefined,
					set_webhook_signature: async () => undefined,
					get_dek: async () => 'test-dek',
					issue_new_dek: async () => 'new-dek',
				},
				$getAccountId: async () => 'acc_test',
				db: {
					changeEvents: {
						findByEntityId: async () => null,
						existsByEntityId: async () => false,
						findIdByEntityId: async () => null,
						findById: async () => null,
						findManyByEntityIds: async () => [],
						list: async () => [],
						search: async () => [],
						upsertByEntityId: async () => ({}) as never,
						deleteById: async () => true,
						deleteByEntityId: async () => true,
						count: async () => 0,
					},
				},
				endpoints: {},
			} as TursoContext;

			const endpointResult = await Changes.listen(liveCtx, {
				databaseUrl: DATABASE_URL,
				table: 'users',
				action: 'insert',
				maxEvents: 5,
				timeoutMs: 5000,
			});

			const parsed =
				TursoEndpointOutputSchemas.listenToChanges.parse(endpointResult);
			expect(parsed.table).toBe('users');
			expect(parsed.action).toBe('insert');

			if (parsed.mode === 'stream') {
				expect(Array.isArray(parsed.events)).toBe(true);
				expect(['max_events', 'timeout', 'stream_closed']).toContain(
					parsed.stoppedBy,
				);
			} else {
				expect(parsed.mode).toBe('health_check');
				expect(parsed.listenAvailable).toBe(false);
				expect(typeof parsed.reason).toBe('string');
			}
		});

		it('4. Pipeline Health Check helper verifies database connectivity when database token is provided', async () => {
			if (!DATABASE_TOKEN) return;
			const reachable = await tursoPipelineHealthCheck(
				DATABASE_URL,
				DATABASE_TOKEN,
			);
			expect(reachable).toBe(true);
		});
	}
});

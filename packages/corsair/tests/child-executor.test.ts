import { fork } from 'node:child_process';
import { join } from 'node:path';
import { CORSAIR_INTERNAL } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import type { RunResultPayload } from '../hub/contracts/tunnel';
import { createChildProcessExecutor as fromTunnel } from '../tunnel';
import {
	createChildProcessExecutor,
	safeChildEnv,
} from '../workflows/child-executor';
import { collectTenantCredentials } from '../workflows/collect-credentials';
import { createTestDatabase } from './setup-db';

const FIXTURE = join(__dirname, 'workflow-child-fixture.ts');

function runInChild(message: unknown): Promise<{
	result: RunResultPayload;
	childPid: number;
	parentPid: number;
}> {
	return new Promise((resolve, reject) => {
		const child = fork(FIXTURE, [], { execArgv: ['--import', 'tsx'] });
		let settled = false;
		const settle = (fn: () => void) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			fn();
		};
		const timer = setTimeout(() => {
			settle(() => reject(new Error('child timed out')));
			child.kill('SIGKILL');
		}, 8000);
		child.on(
			'message',
			(m: { type: string; result?: RunResultPayload; message?: string }) => {
				if (m.type === 'done' && m.result) {
					settle(() =>
						resolve({
							result: m.result!,
							childPid: child.pid!,
							parentPid: process.pid,
						}),
					);
				} else {
					settle(() => reject(new Error(m.message ?? 'child error')));
				}
				child.kill();
			},
		);
		child.on('error', (e) => settle(() => reject(e)));
		// A child that dies before sending a result (e.g. a fixture that fails to
		// load under tsx) emits 'exit' but never 'message' — surface that instead
		// of stalling until the timeout fires with a misleading message.
		child.on('exit', (code) =>
			settle(() =>
				reject(new Error(`child exited without a result (code ${code})`)),
			),
		);
		child.send(message);
	});
}

describe('runWorkflowChild (forked)', () => {
	it('runs a workflow in a separate process and reads the injected credential', async () => {
		const { result, childPid, parentPid } = await runInChild({
			type: 'run',
			tenantId: 't1',
			code: "module.exports.main = async (corsair, payload, step) => { await step('readkey', async () => corsair.testkey.keys.get_api_key()); };",
			payload: null,
			credentialMap: { testkey: { api_key: 'injected-secret' } },
			integrationCredentialMap: {},
		});
		expect(childPid).not.toBe(parentPid);
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toBe('injected-secret');
	}, 20000);

	it('exposes no master key to workflow code (symbol escape returns nothing)', async () => {
		const { result } = await runInChild({
			type: 'run',
			tenantId: 't1',
			code: "module.exports.main = async (corsair, payload, step) => { await step('leak', async () => { const internal = corsair[Symbol.for('corsair:internal')]; return internal ? String(internal.kek) : 'no-internal'; }); };",
			payload: null,
			credentialMap: { testkey: { api_key: 'injected-secret' } },
			integrationCredentialMap: {},
		});
		expect(result.status).toBe('completed');
		expect(result.steps[0].output).toBe('no-internal');
	}, 20000);
});

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedAccountConfig(
	database: ReturnType<typeof createTestDatabase>['database'],
	config: Record<string, string>,
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-testkey',
			created_at: now,
			updated_at: now,
			name: 'testkey',
			config: encryptConfig({}, dek),
			dek: encryptedDek,
		})
		.execute();
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: 'account-t1',
			created_at: now,
			updated_at: now,
			tenant_id: 't1',
			integration_id: 'integration-testkey',
			config: encryptConfig(config, dek),
			dek: encryptedDek,
		})
		.execute();
}

function seedApiKeyAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
	apiKey: string,
) {
	return seedAccountConfig(database, { api_key: apiKey });
}

function rootCorsair(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [{ id: 'testkey', options: { authType: 'api_key' } }],
			database,
			kek: KEK,
			multiTenancy: true,
		},
	};
}

const executor = createChildProcessExecutor({
	childModulePath: join(__dirname, 'workflow-child-fixture.ts'),
	execArgv: ['--import', 'tsx'],
});

describe('createChildProcessExecutor', () => {
	it('decrypts in the parent and runs against real creds in the child', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedApiKeyAccount(database, 'vault-secret');
			const result = await executor.run({
				corsair: rootCorsair(database),
				code: "module.exports.main = async (corsair, payload, step) => { await step('readkey', async () => corsair.testkey.keys.get_api_key()); };",
				payload: null,
				tenantId: 't1',
			});
			expect(result.status).toBe('completed');
			expect(result.steps[0].output).toBe('vault-secret');
		} finally {
			cleanup();
		}
	});

	it('denies workflow code any access to process (no env reachable in the sandbox)', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const result = await executor.run({
				corsair: rootCorsair(database),
				code: "module.exports.main = async (corsair, payload, step) => { await step('env', async () => (typeof process === 'undefined' ? 'no-process' : 'has-process')); };",
				payload: null,
				tenantId: 't1',
			});
			expect(result.status).toBe('completed');
			expect(result.steps[0].output).toBe('no-process');
		} finally {
			cleanup();
		}
	}, 20000);

	it('kills a runaway workflow and reports failure without hanging', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedApiKeyAccount(database, 'vault-secret');
			const result = await executor.run({
				corsair: rootCorsair(database),
				code: 'module.exports.main = async () => { while (true) {} };',
				payload: null,
				tenantId: 't1',
				timeoutMs: 500,
			});
			expect(result.status).toBe('failed');
		} finally {
			cleanup();
		}
	}, 15000);
});

describe('public API surface', () => {
	it('re-exports the child executor from the tunnel entry', () => {
		expect(typeof fromTunnel).toBe('function');
	});
});

describe('collectTenantCredentials', () => {
	it('collects plugin-specific account fields declared in authConfig', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccountConfig(database, { api_key: 'k', subdomain: 'acme' });
			const corsair = {
				[CORSAIR_INTERNAL]: {
					plugins: [
						{
							id: 'testkey',
							options: { authType: 'api_key' },
							authConfig: { api_key: { account: ['subdomain'] } },
						},
					],
					database,
					kek: KEK,
					multiTenancy: true,
				},
			};
			const { credentialMap } = await collectTenantCredentials(corsair, 't1');
			expect(credentialMap.testkey).toEqual({
				api_key: 'k',
				subdomain: 'acme',
			});
		} finally {
			cleanup();
		}
	});
});

describe('safeChildEnv', () => {
	it('keeps allow-listed vars and drops everything else (KEK, DB, keys)', () => {
		const env = safeChildEnv({
			PATH: '/usr/bin',
			CORSAIR_KEK: 'master-kek-value',
			DATABASE_URL: 'postgres://secret',
			AGENTQL_API_KEY: 'k',
		} as NodeJS.ProcessEnv);
		expect(env.PATH).toBe('/usr/bin');
		expect(env.CORSAIR_KEK).toBeUndefined();
		expect(env.DATABASE_URL).toBeUndefined();
		expect(env.AGENTQL_API_KEY).toBeUndefined();
	});

	it('drops NODE_OPTIONS so an inherited preload cannot re-inject secrets', () => {
		const env = safeChildEnv({
			PATH: '/usr/bin',
			NODE_OPTIONS: '--require /tmp/restore-secrets.js',
		} as NodeJS.ProcessEnv);
		expect(env.PATH).toBe('/usr/bin');
		expect(env.NODE_OPTIONS).toBeUndefined();
	});

	it('never forwards protected names, even requested via the allow-list (any case)', () => {
		const env = safeChildEnv(
			{
				NODE_OPTIONS: '--require /tmp/evil.js',
				CORSAIR_KEK: 'master-kek',
				DATABASE_URL: 'postgres://secret',
				Database_Url: 'postgres://also-secret',
				PATH: '/usr/bin',
			} as NodeJS.ProcessEnv,
			['NODE_OPTIONS', 'CORSAIR_KEK', 'DATABASE_URL', 'Database_Url'],
		);
		expect(env.NODE_OPTIONS).toBeUndefined();
		expect(env.CORSAIR_KEK).toBeUndefined();
		expect(env.DATABASE_URL).toBeUndefined();
		expect((env as Record<string, unknown>).Database_Url).toBeUndefined();
		expect(env.PATH).toBe('/usr/bin');
	});

	it('passes through an app-declared extra var, still dropping secrets', () => {
		const env = safeChildEnv(
			{
				FEATURE_FLAG: 'on',
				DATABASE_URL: 'postgres://secret',
			} as NodeJS.ProcessEnv,
			['FEATURE_FLAG'],
		);
		expect(env.FEATURE_FLAG).toBe('on');
		expect(env.DATABASE_URL).toBeUndefined();
	});
});

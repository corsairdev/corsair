import { fork } from 'node:child_process';
import { join } from 'node:path';
import { CORSAIR_INTERNAL } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import type { RunResultPayload } from '../hub/contracts/tunnel';
import { createChildProcessExecutor as fromTunnel } from '../tunnel/index';
import { createChildProcessExecutor } from '../workflows/child-executor';
import { createTestDatabase } from './setup-db';

const FIXTURE = join(__dirname, 'workflow-child-fixture.ts');

function runInChild(message: unknown): Promise<{
	result: RunResultPayload;
	childPid: number;
	parentPid: number;
}> {
	return new Promise((resolve, reject) => {
		const child = fork(FIXTURE, [], { execArgv: ['--import', 'tsx'] });
		const timer = setTimeout(() => {
			child.kill('SIGKILL');
			reject(new Error('child timed out'));
		}, 8000);
		child.on(
			'message',
			(m: { type: string; result?: RunResultPayload; message?: string }) => {
				clearTimeout(timer);
				if (m.type === 'done' && m.result) {
					resolve({
						result: m.result,
						childPid: child.pid!,
						parentPid: process.pid,
					});
				} else {
					reject(new Error(m.message ?? 'child error'));
				}
				child.kill();
			},
		);
		child.on('error', (e) => {
			clearTimeout(timer);
			reject(e);
		});
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
	});

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
	});
});

const KEK = 'test-kek-with-at-least-32-characters!!';

async function seedApiKeyAccount(
	database: ReturnType<typeof createTestDatabase>['database'],
	apiKey: string,
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
			config: encryptConfig({ api_key: apiKey }, dek),
			dek: encryptedDek,
		})
		.execute();
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

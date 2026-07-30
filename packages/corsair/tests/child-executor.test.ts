import { fork } from 'node:child_process';
import { join } from 'node:path';
import type { RunResultPayload } from '../hub/contracts/tunnel';

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

import { inProcessVmExecutor } from '../workflows/executor';

describe('inProcessVmExecutor', () => {
	it('runs a workflow through node:vm and reports the step completed', async () => {
		const result = await inProcessVmExecutor.run({
			corsair: {},
			code: "module.exports.main = async (corsair, payload, step) => { await step('noop', async () => 'ok'); };",
			payload: null,
			timeoutMs: 200,
		});
		expect(result.status).toBe('completed');
		expect(result.steps[0]).toMatchObject({
			name: 'noop',
			status: 'completed',
			output: 'ok',
		});
	});
});

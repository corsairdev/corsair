import { isReadonlyScopeActive } from '../core/permissions';
import { runReadonlyProbe } from '../workflows/probe';

describe('runReadonlyProbe', () => {
	it('returns the script value, reading through the client', async () => {
		const corsair = {
			db: { query: async (x: unknown) => ({ rows: [x] }) },
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'const r = await corsair.db.query("ping"); return r.rows[0];',
		});
		expect(result).toEqual({ status: 'ok', value: 'ping' });
	});

	it('runs the client calls inside a readonly scope', async () => {
		// The endpoint sees the active readonly scope, proving runReadonly reaches
		// the client calls the script makes (this is what makes writes throw).
		const corsair = {
			probe: { check: async () => isReadonlyScopeActive() },
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'return await corsair.probe.check();',
		});
		expect(result).toEqual({ status: 'ok', value: true });
	});

	it('has no host globals in scope', async () => {
		const result = await runReadonlyProbe({
			corsair: {},
			code: 'return typeof process + "," + typeof require + "," + typeof fetch;',
		});
		expect(result).toEqual({
			status: 'ok',
			value: 'undefined,undefined,undefined',
		});
	});

	it('returns an error instead of throwing when the script fails', async () => {
		const result = await runReadonlyProbe({
			corsair: {},
			code: 'throw new Error("boom");',
		});
		expect(result).toEqual({ status: 'error', error: 'boom' });
	});
});

import { makeDeskTimeRequest } from './client';
import {
	DeskTimeEndpointOutputSchemas as Outputs,
	withBuckets,
} from './endpoints/types';

/**
 * Live smoke tests. CI ignores this file, and it skips without a key:
 *
 *   DESKTIME_API_KEY=... pnpm --filter @corsair-dev/desktime test api.test.ts
 *
 * Read-only: these four calls only read. Well under the
 * documented 600 per window.
 */
const describeIfKey = process.env.DESKTIME_API_KEY ? describe : describe.skip;

const key = process.env.DESKTIME_API_KEY ?? '';

describeIfKey('live DeskTime API', () => {
	it('answers ping', async () => {
		const body = await makeDeskTimeRequest(key, 'ping');
		const result = Outputs.ping.parse(body);
		expect(result.pong).toMatch(/^\d+$/);
	});

	it('reads the account settings', async () => {
		const body = await makeDeskTimeRequest(key, 'company');
		const result = Outputs.company.parse(body);
		expect(typeof result.name).toBe('string');
	});

	it('lists employees and validates the nested shape', async () => {
		const body = await makeDeskTimeRequest(key, 'employees', { period: 'day' });
		// The endpoint derives `buckets` before parsing, so the test does the same
		// rather than hand-building it.
		const result = Outputs.employees.parse(withBuckets(body));
		expect(Array.isArray(result.buckets)).toBe(true);
	});

	it('reads one employee against the output schema', async () => {
		const body = await makeDeskTimeRequest(key, 'employee/basic');
		// The boolean `false` arrivals only appear before someone clocks in, so
		// this is the assertion that catches a schema assuming a timestamp.
		expect(() => Outputs.employeeBasic.parse(body)).not.toThrow();
	});
});

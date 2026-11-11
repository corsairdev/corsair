import { makeCodereadrRequest } from './client';
import {
	shapeDatabases,
	shapeLimits,
	shapeScans,
	shapeServices,
} from './endpoints/shape';
import { CodereadrEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke tests. CI ignores this file, and it skips without a key:
 *
 *   CODEREADR_API_KEY=... pnpm --filter @corsair-dev/codereadr test api.test.ts
 *
 * Read-only, and deliberately few calls: a free account allows 10 requests a
 * minute, so adding calls here can trip error 111 on its own.
 */
const describeIfKey = process.env.CODEREADR_API_KEY ? describe : describe.skip;

const key = process.env.CODEREADR_API_KEY ?? '';

describeIfKey('live CodeREADr API', () => {
	it('reads the account API limits', async () => {
		const root = await makeCodereadrRequest(key, {
			section: 'limits',
			action: 'retrieve',
		});

		const result = Outputs.limitsRetrieve.parse(shapeLimits(root));

		// -1 means unlimited, so the limit being defined is the real assertion.
		expect(result.minute?.limit ?? result.day?.limit).toBeDefined();
	});

	it('lists scans and validates the response against the output schema', async () => {
		const root = await makeCodereadrRequest(key, {
			section: 'scans',
			action: 'retrieve',
			limit: 5,
		});

		const result = Outputs.scansList.parse(shapeScans(root));

		expect(Array.isArray(result.scans)).toBe(true);
	});

	it('lists services and databases against their output schemas', async () => {
		const servicesRoot = await makeCodereadrRequest(key, {
			section: 'services',
			action: 'retrieve',
		});
		expect(() =>
			Outputs.servicesList.parse(shapeServices(servicesRoot)),
		).not.toThrow();

		const databasesRoot = await makeCodereadrRequest(key, {
			section: 'databases',
			action: 'retrieve',
		});
		expect(() =>
			Outputs.databasesList.parse(shapeDatabases(databasesRoot)),
		).not.toThrow();
	});
});

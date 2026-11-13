import { e2bOperationRoutes } from './endpoints/routes';
import {
	E2bEndpointInputSchemas,
	E2bEndpointOutputSchemas,
} from './endpoints/types';

describe('E2B operation schemas', () => {
	it('declares schemas for every registered route', () => {
		const routeIds = Object.keys(e2bOperationRoutes).sort();
		expect(Object.keys(E2bEndpointInputSchemas).sort()).toEqual(routeIds);
		expect(Object.keys(E2bEndpointOutputSchemas).sort()).toEqual(routeIds);
	});

	it('rejects undocumented top-level request fields', () => {
		for (const schema of Object.values(E2bEndpointInputSchemas)) {
			expect(schema.safeParse({ undocumented: true }).success).toBe(false);
		}
	});

	it('enforces required sandbox creation fields and list-state enums', () => {
		expect(
			E2bEndpointInputSchemas['sandboxes.create'].safeParse({ body: {} })
				.success,
		).toBe(false);
		expect(
			E2bEndpointInputSchemas['sandboxes.create'].safeParse({
				body: { templateID: 'template-test' },
			}).success,
		).toBe(true);
		expect(
			E2bEndpointInputSchemas['sandboxes.list'].safeParse({
				query: { state: ['deleted'] },
			}).success,
		).toBe(false);
	});

	it('validates secret names and rejects undocumented nested body fields', () => {
		expect(
			E2bEndpointInputSchemas['secrets.create'].safeParse({
				body: { name: 'not valid', value: 'sample-secret' },
			}).success,
		).toBe(false);
		expect(
			E2bEndpointInputSchemas['secrets.create'].safeParse({
				body: {
					name: 'sample_secret',
					value: 'sample-secret',
					undocumented: true,
				},
			}).success,
		).toBe(false);
	});

	it('validates representative response and no-content shapes', () => {
		expect(
			E2bEndpointOutputSchemas['sandboxes.list'].safeParse([]).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['sandboxes.list'].safeParse({ sandboxes: [] })
				.success,
		).toBe(false);
		expect(
			E2bEndpointOutputSchemas['sandboxes.kill'].safeParse(undefined).success,
		).toBe(true);
		expect(
			E2bEndpointOutputSchemas['sandboxes.kill'].safeParse({}).success,
		).toBe(false);
	});
});

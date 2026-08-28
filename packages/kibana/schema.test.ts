import {
	KibanaEndpointInputSchemas,
	KibanaEndpointOutputSchemas,
} from './endpoints/types';
import { KibanaSchema } from './schema';

describe('Kibana schema', () => {
	it('declares a semver version', () => {
		expect(KibanaSchema.version).toBeDefined();
		expect(KibanaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof KibanaSchema.entities).toBe('object');
		expect(KibanaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(KibanaSchema.entities))).toBe(true);
		for (const entity of Object.values(KibanaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Kibana endpoints', () => {
	it('validates savedObjectsFind input schema', () => {
		const valid = KibanaEndpointInputSchemas.savedObjectsFind.safeParse({
			type: 'dashboard',
		});
		expect(valid.success).toBe(true);
	});

	it('validates savedObjectsGet input schema', () => {
		const valid = KibanaEndpointInputSchemas.savedObjectsGet.safeParse({
			type: 'dashboard',
			id: '123',
		});
		expect(valid.success).toBe(true);
	});
});

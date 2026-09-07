import { SafetyCultureSchema } from './schema';

describe('SafetyCulture schema', () => {
	it('declares a semver version', () => {
		expect(SafetyCultureSchema.version).toBeDefined();
		expect(SafetyCultureSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SafetyCultureSchema.entities).toBe('object');
		expect(SafetyCultureSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SafetyCultureSchema.entities))).toBe(true);
		for (const entity of Object.values(SafetyCultureSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('SafetyCulture endpoint schemas', () => {
	it('exports input schemas for all endpoints', async () => {
		const { SafetyCultureEndpointInputSchemas } = await import(
			'./endpoints/types'
		);
		expect(SafetyCultureEndpointInputSchemas.inspectionsList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.inspectionsGet).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.templatesList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.actionsList).toBeDefined();
		expect(SafetyCultureEndpointInputSchemas.usersList).toBeDefined();
	});

	it('exports output schemas for all endpoints', async () => {
		const { SafetyCultureEndpointOutputSchemas } = await import(
			'./endpoints/types'
		);
		expect(SafetyCultureEndpointOutputSchemas.inspectionsList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.inspectionsGet).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.templatesList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.actionsList).toBeDefined();
		expect(SafetyCultureEndpointOutputSchemas.usersList).toBeDefined();
	});
});

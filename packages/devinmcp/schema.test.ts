import { DevinMcpSchema } from './schema';

describe('DevinMcp schema', () => {
	it('declares a semver version', () => {
		expect(DevinMcpSchema.version).toBeDefined();
		expect(DevinMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(DevinMcpSchema.entities).toEqual({});
	});
});

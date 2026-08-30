import { ContextSevenMcpSchema } from './schema';

describe('ContextSevenMcp schema', () => {
	it('declares a semver version', () => {
		expect(ContextSevenMcpSchema.version).toBeDefined();
		expect(ContextSevenMcpSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(ContextSevenMcpSchema.entities).toEqual({});
	});
});

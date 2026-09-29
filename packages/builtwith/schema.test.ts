import { BuiltWithEndpointInputSchemas } from './endpoints/types';
import { BuiltWithSchema } from './schema';

describe('BuiltWith schema', () => {
	it('declares a semver version', () => {
		expect(BuiltWithSchema.version).toBeDefined();
		expect(BuiltWithSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BuiltWithSchema.entities).toBe('object');
		expect(BuiltWithSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BuiltWithSchema.entities))).toBe(true);
		for (const entity of Object.values(BuiltWithSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('BuiltWith endpoint input schemas', () => {
	it('createDomainListFile accepts only txt and zip formats', () => {
		expect(
			BuiltWithEndpointInputSchemas.createDomainListFile.parse({
				domains: ['example.com'],
				format: 'txt',
			}).format,
		).toBe('txt');
		expect(
			BuiltWithEndpointInputSchemas.createDomainListFile.parse({
				domains: ['example.com'],
				format: 'zip',
			}).format,
		).toBe('zip');
		expect(() =>
			BuiltWithEndpointInputSchemas.createDomainListFile.parse({
				domains: ['example.com'],
				format: 'pdf',
			}),
		).toThrow();
	});

	it('createDomainListFile rejects whitespace-only domains', () => {
		expect(() =>
			BuiltWithEndpointInputSchemas.createDomainListFile.parse({
				domains: ['   '],
			}),
		).toThrow();
	});
});

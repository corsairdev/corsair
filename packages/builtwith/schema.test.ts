import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './endpoints/types';
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

describe('BuiltWith entities', () => {
	it('registers one entity per durable BuiltWith object', () => {
		expect(Object.keys(BuiltWithSchema.entities).sort()).toEqual([
			'companyFinancials',
			'domainCoverage',
			'domainTechnologies',
			'domains',
			'listSites',
			'mcpServers',
			'products',
			'recommendations',
			'redirects',
			'socialLinks',
			'technologies',
		]);
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

	it('listsApiGetList rejects all combined with since', () => {
		expect(() =>
			BuiltWithEndpointInputSchemas.listsApiGetList.parse({
				tech: 'Shopify',
				all: true,
				since: '30 Days Ago',
			}),
		).toThrow('all cannot be combined with since');
		expect(
			BuiltWithEndpointInputSchemas.listsApiGetList.parse({
				tech: 'Shopify',
				offset: 'abc',
			}).offset,
		).toBe('abc');
	});

	it('mcpApiLookup requires search or category', () => {
		expect(() => BuiltWithEndpointInputSchemas.mcpApiLookup.parse({})).toThrow(
			'search or category is required',
		);
		expect(
			BuiltWithEndpointInputSchemas.mcpApiLookup.parse({
				category: 'ecommerce',
			}).category,
		).toBe('ecommerce');
	});

	it('productApiLookup accepts page 0 and caps limit at 500', () => {
		expect(
			BuiltWithEndpointInputSchemas.productApiLookup.parse({
				query: 'shoes',
				page: 0,
			}).page,
		).toBe(0);
		expect(() =>
			BuiltWithEndpointInputSchemas.productApiLookup.parse({
				query: 'shoes',
				limit: 501,
			}),
		).toThrow();
	});

	it('mcpApiLookup output accepts the documented array response', () => {
		const parsed = BuiltWithEndpointOutputSchemas.mcpApiLookup.parse([
			{ Domain: 'example.com', Category: 'Developer Tools', Endpoints: [] },
		]);
		expect(parsed[0]?.Domain).toBe('example.com');
	});

	it('createDomainListFile rejects whitespace-only domains', () => {
		expect(() =>
			BuiltWithEndpointInputSchemas.createDomainListFile.parse({
				domains: ['   '],
			}),
		).toThrow();
	});
});

import {
	WhoisfreaksEndpointInputSchemas,
	WhoisfreaksEndpointOutputSchemas,
} from './endpoints/types';
import { whoisfreaksEndpointSchemas } from './index';
import { WhoisfreaksSchema } from './schema';

describe('Whoisfreaks schema', () => {
	it('declares a semver version', () => {
		expect(WhoisfreaksSchema.version).toBeDefined();
		expect(WhoisfreaksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WhoisfreaksSchema.entities).toBe('object');
		expect(WhoisfreaksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WhoisfreaksSchema.entities))).toBe(true);
		for (const entity of Object.values(WhoisfreaksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers input and output schemas for every endpoint', () => {
		const inputKeys = Object.keys(WhoisfreaksEndpointInputSchemas);
		const outputKeys = Object.keys(WhoisfreaksEndpointOutputSchemas);
		expect(inputKeys.length).toBeGreaterThan(0);
		expect(outputKeys).toEqual(inputKeys);
		const registered = Object.values(whoisfreaksEndpointSchemas);
		expect(registered.length).toBe(inputKeys.length);
		const registeredInputs = new Set(registered.map((s) => s.input));
		const registeredOutputs = new Set(registered.map((s) => s.output));
		for (const key of inputKeys) {
			const input =
				WhoisfreaksEndpointInputSchemas[
					key as keyof typeof WhoisfreaksEndpointInputSchemas
				];
			const output =
				WhoisfreaksEndpointOutputSchemas[
					key as keyof typeof WhoisfreaksEndpointOutputSchemas
				];
			expect(registeredInputs.has(input)).toBe(true);
			expect(registeredOutputs.has(output)).toBe(true);
			expect(typeof input.parse).toBe('function');
			expect(typeof output.parse).toBe('function');
		}
	});

	it('publishes domain_registered as the documented string type', () => {
		const parsed = WhoisfreaksEndpointOutputSchemas.whoisLiveLookupV2.parse({
			status: true,
			domain_name: 'example.com',
			domain_registered: 'yes',
		});
		expect(parsed.domain_registered).toBe('yes');
		expect(() =>
			WhoisfreaksEndpointOutputSchemas.whoisLiveLookupV2.parse({
				domain_registered: true,
			}),
		).toThrow();
	});

	it('rejects empty and oversized bulk inputs', () => {
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkWhoisLookup.parse({
				domainNames: [],
			}),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkWhoisLookup.parse({
				domainNames: Array.from({ length: 101 }, (_, i) => `d${i}.com`),
			}),
		).toThrow();
		expect(
			WhoisfreaksEndpointInputSchemas.bulkWhoisLookup.parse({
				domainNames: ['example.com'],
			}).domainNames,
		).toEqual(['example.com']);
	});

	it('requires exactly one bulk availability mode, with domain for tld mode', () => {
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({}),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({
				domainNames: [],
			}),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({
				domain: 'example',
				tld: [],
			}),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({
				domainNames: ['example.com'],
				tld: ['com'],
			}),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({
				tld: ['com'],
			}),
		).toThrow();
		const parsed =
			WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck.parse({
				domain: 'example',
				tld: ['com'],
			});
		expect(parsed.tld).toEqual(['com']);
	});

	it('requires a target for dns live and typosquatting lookups', () => {
		expect(() =>
			WhoisfreaksEndpointInputSchemas.dnsLiveLookup.parse({ type: 'all' }),
		).toThrow();
		expect(() =>
			WhoisfreaksEndpointInputSchemas.typosquattingLookup.parse({}),
		).toThrow();
		const dns = WhoisfreaksEndpointInputSchemas.dnsLiveLookup.parse({
			domainName: 'example.com',
		});
		expect(dns.type).toBe('all');
		const typos = WhoisfreaksEndpointInputSchemas.typosquattingLookup.parse({
			keyword: 'example',
		});
		expect(typos.keyword).toBe('example');
	});

	it('applies documented pagination defaults', () => {
		expect(
			WhoisfreaksEndpointInputSchemas.dnsHistoricalLookup.parse({
				domainName: 'example.com',
			}),
		).toMatchObject({ type: 'all', page: 1 });
		expect(
			WhoisfreaksEndpointInputSchemas.subdomainsLookup.parse({
				domain: 'example.com',
			}).page,
		).toBe(1);
		expect(
			WhoisfreaksEndpointInputSchemas.domainAvailabilityCheck.parse({
				domain: 'example.com',
			}),
		).toMatchObject({ sug: false, count: 5 });
	});
});

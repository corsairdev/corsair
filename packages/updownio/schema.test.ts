import {
	UpdownIOEndpointInputSchemas,
	UpdownIOEndpointOutputSchemas,
} from './endpoints/types';
import { UpdownIOCheck, UpdownIONode, UpdownIOSchema } from './schema';

describe('UpdownIO schema', () => {
	it('declares a semver version', () => {
		expect(UpdownIOSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entity for every documented resource', () => {
		expect(Object.keys(UpdownIOSchema.entities)).toEqual(
			expect.arrayContaining(['checks', 'checkSsl', 'checkDomain', 'nodes']),
		);
	});
});

describe('entity shapes match the documented responses', () => {
	it('parses the example check from GET /api/checks', () => {
		const parsed = UpdownIOCheck.parse({
			token: 'ngg8',
			url: 'https://updown.io',
			type: 'https',
			last_status: 200,
			uptime: 100,
			down: false,
			period: 15,
			apdex_t: 0.5,
			ssl: { valid: true, expires_at: '2022-02-21T15:57:36Z' },
			domain: { remaining_days: 758, source: 'RDAP' },
		});

		expect(parsed.token).toBe('ngg8');
		expect(parsed.ssl?.valid).toBe(true);
		expect(parsed.domain?.source).toBe('RDAP');
	});

	it('parses a pulse check, which has no url and a null status', () => {
		const parsed = UpdownIOCheck.parse({
			token: 'pulse1',
			type: 'pulse',
			last_status: null,
		});

		expect(parsed.last_status).toBeNull();
		expect(parsed.url).toBeUndefined();
	});

	it('requires a token, the identifier every check is addressed by', () => {
		expect(() => UpdownIOCheck.parse({ type: 'https' })).toThrow();
	});

	it('parses the example node from GET /api/nodes', () => {
		const parsed = UpdownIONode.parse({
			ip: '45.76.104.117',
			ip6: '2001:19f0:7001:45a::1',
			city: 'Tokyo',
			country: 'Japan',
			country_code: 'jp',
			lat: 35.5833,
			lng: 139.7483,
		});

		expect(parsed.city).toBe('Tokyo');
		expect(parsed.country_code).toBe('jp');
	});

	it('keeps undocumented fields instead of stripping them', () => {
		const parsed = UpdownIONode.parse({
			ip: '1.2.3.4',
			some_future_field: 'kept',
		}) as Record<string, unknown>;

		expect(parsed.some_future_field).toBe('kept');
	});
});

describe('endpoint schema registries', () => {
	it('declares an input and output schema for the same 5 operations', () => {
		const inputs = Object.keys(UpdownIOEndpointInputSchemas).sort();
		const outputs = Object.keys(UpdownIOEndpointOutputSchemas).sort();

		expect(inputs).toHaveLength(5);
		expect(inputs).toEqual(outputs);
	});

	it('rejects unknown input fields on every operation', () => {
		for (const schema of Object.values(UpdownIOEndpointInputSchemas)) {
			expect(() => schema.parse({ nope: 1 })).toThrow();
		}
	});
});

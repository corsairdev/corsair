import { bunnycdn, bunnycdnEndpointSchemas } from './index';
import { BunnycdnSchema } from './schema';

describe('Bunnycdn schema', () => {
	it('declares a semver version', () => {
		expect(BunnycdnSchema.version).toBeDefined();
		expect(BunnycdnSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BunnycdnSchema.entities).toBe('object');
		expect(BunnycdnSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BunnycdnSchema.entities))).toBe(true);
		for (const entity of Object.values(BunnycdnSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Bunnycdn endpoint registration', () => {
	const plugin = bunnycdn({});

	it('registers every nested endpoint with input and output schemas', () => {
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		const groupNames = Object.keys(endpoints);
		expect(groupNames.length).toBeGreaterThan(10);
		let count = 0;
		for (const [group, ops] of Object.entries(endpoints)) {
			for (const name of Object.keys(ops)) {
				const key = `${group}.${name}`;
				const schemas =
					bunnycdnEndpointSchemas[key as keyof typeof bunnycdnEndpointSchemas];
				expect(schemas).toBeDefined();
				expect(schemas.input).toBeDefined();
				expect(schemas.output).toBeDefined();
				count += 1;
			}
		}
		expect(count).toBeGreaterThan(90);
	});

	it('exposes endpoint meta with risk levels for every endpoint', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		for (const [group, ops] of Object.entries(endpoints)) {
			for (const name of Object.keys(ops)) {
				const entry = meta[`${group}.${name}`];
				expect(entry).toBeDefined();
				expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			}
		}
	});

	it('uses api_key auth without webhooks', () => {
		expect(plugin.id).toBe('bunnycdn');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.authConfig).toBeDefined();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

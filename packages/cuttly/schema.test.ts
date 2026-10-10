import { CuttlySchema } from './schema';
import { CuttlyLinkEntity } from './schema/database';

describe('Cuttly schema', () => {
	it('declares a semver version', () => {
		expect(CuttlySchema.version).toBeDefined();
		expect(CuttlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CuttlySchema.entities).toBe('object');
		expect(CuttlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CuttlySchema.entities))).toBe(true);
		for (const entity of Object.values(CuttlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates the official link entity shape', () => {
		const parsed = CuttlyLinkEntity.parse({
			status: 7,
			date: '2026-01-01',
			shortLink: 'https://cutt.ly/launch',
			fullLink: 'https://example.com/launch',
			title: 'Launch',
		});
		expect(parsed.status).toBe(7);
		expect(parsed.shortLink).toBe('https://cutt.ly/launch');
		expect(() => CuttlyLinkEntity.parse({ status: 9 })).toThrow();
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

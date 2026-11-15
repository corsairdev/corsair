import { PloidSchema } from './schema';
import { Person } from './schema/database';

describe('Ploid schema', () => {
	it('declares a semver version and a people entity', () => {
		expect(PloidSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PloidSchema.entities)).toEqual(['people']);
	});

	it('round-trips a person planted by resolve and deepened by enrich', () => {
		const planted = Person.parse({
			personId: 'per_1',
			name: 'Example Person',
			company: 'Acme',
			linkedinUrl: 'https://linkedin.com/in/example',
			identityVerified: false,
			sources: ['https://acme.com'],
			updatedAt: '2026-10-17T00:00:00Z',
		});
		expect(planted.updatedAt).toBeInstanceOf(Date);

		// The merge in endpoints/cache.ts spreads the stored row first.
		const deepened = Person.parse({
			...planted,
			workEmail: {
				value: 'example@acme.com',
				status: 'found',
				confidence: 'verified',
			},
			updatedAt: new Date(),
		});
		expect(deepened.workEmail?.value).toBe('example@acme.com');
		expect(deepened.name).toBe('Example Person');
		expect(deepened.sources).toEqual(['https://acme.com']);
	});

	it('accepts a minimal row with only the stable key', () => {
		const row = Person.parse({ personId: 'per_2' });
		expect(row.identityVerified).toBeUndefined();
		expect(row.workEmail).toBeUndefined();
	});

	it('rejects a row without a person id', () => {
		expect(() => Person.parse({ name: 'No Key' })).toThrow();
	});
});

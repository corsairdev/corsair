import { PdlSchema } from './schema';

describe('Pdl schema', () => {
	it('declares a semver version', () => {
		expect(PdlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares the people and companies entities', () => {
		expect(Object.keys(PdlSchema.entities)).toEqual(['people', 'companies']);
	});

	it('round-trips a stored person row', () => {
		const parsed = PdlSchema.entities.people.parse({
			pdlId: 'person_abc',
			name: 'grace hopper',
			jobTitle: 'rear admiral',
			jobCompanyName: 'us navy',
			email: 'grace@navy.mil',
			phone: '+14155550100',
			country: 'us',
			locality: 'new york city',
			likelihood: 7,
			enrichedAt: '2026-10-16T00:00:00.000Z',
		});

		expect(parsed.pdlId).toBe('person_abc');
		expect(parsed.likelihood).toBe(7);
		expect(parsed.enrichedAt).toBeInstanceOf(Date);
	});

	it('rejects a person row without the pdl id', () => {
		expect(() =>
			PdlSchema.entities.people.parse({ name: 'grace hopper' }),
		).toThrow();
	});

	it('bounds the stored likelihood', () => {
		expect(
			PdlSchema.entities.people.safeParse({
				pdlId: 'person_abc',
				likelihood: 11,
			}).success,
		).toBe(false);
	});

	it('round-trips a stored company row', () => {
		const parsed = PdlSchema.entities.companies.parse({
			companyId: 'co_9',
			name: 'people data labs',
			website: 'peopledatalabs.com',
			ticker: 'PDL',
			industry: 'computer software',
			employeeCount: 150,
			foundedYear: 2015,
			likelihood: 9,
			enrichedAt: '2026-10-16T00:00:00.000Z',
		});

		expect(parsed.companyId).toBe('co_9');
		expect(parsed.employeeCount).toBe(150);
		expect(parsed.enrichedAt).toBeInstanceOf(Date);
	});

	it('accepts a company row keyed by website only', () => {
		const parsed = PdlSchema.entities.companies.parse({
			website: 'peopledatalabs.com',
		});
		expect(parsed.website).toBe('peopledatalabs.com');
	});
});

import { RevAISchema } from './schema';

describe('RevAI schema', () => {
	it('declares a semver version', () => {
		expect(RevAISchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers the job entity and coerces its timestamps', () => {
		expect(Object.keys(RevAISchema.entities)).toEqual(['job']);
		const job = RevAISchema.entities.job.parse({
			id: 'abc',
			created_on: '2026-10-12T23:00:00Z',
		});
		expect(job.created_on).toEqual(new Date('2026-10-12T23:00:00Z'));
	});
});

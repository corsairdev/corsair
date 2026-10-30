import { BouncerSchema } from './schema';

describe('Bouncer schema', () => {
	it('declares a semver version', () => {
		expect(BouncerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entity for every persisted result type', () => {
		expect(Object.keys(BouncerSchema.entities).sort()).toEqual([
			'batchVerifications',
			'domainVerifications',
			'emailVerifications',
			'toxicityJobs',
			'toxicityResults',
		]);
	});

	it('stores a verification using the documented enums', () => {
		const record = BouncerSchema.entities.emailVerifications.parse({
			email: 'john@usebouncer.com',
			status: 'deliverable',
			reason: 'accepted_email',
			domainName: 'usebouncer.com',
			domainAcceptAll: 'no',
			score: 100,
			toxicity: 0,
		});
		expect(record.status).toBe('deliverable');
		expect(record.domainAcceptAll).toBe('no');
	});

	it('rejects a status Bouncer never returns', () => {
		expect(() =>
			BouncerSchema.entities.emailVerifications.parse({
				email: 'a@b.com',
				status: 'bounced',
				reason: 'accepted_email',
			}),
		).toThrow();
	});

	it('rejects a toxicity score outside the documented 0-5 range', () => {
		expect(() =>
			BouncerSchema.entities.toxicityResults.parse({
				jobId: 'j1',
				email: 'a@b.com',
				toxicity: 9,
			}),
		).toThrow();
	});
});

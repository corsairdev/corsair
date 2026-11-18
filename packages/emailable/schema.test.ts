import { EmailableSchema } from './schema';
import { EmailableVerificationEntity } from './schema/database';

describe('Emailable schema', () => {
	it('declares accounts, verifications, and batches', () => {
		expect(EmailableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(EmailableSchema.entities).sort()).toEqual([
			'accounts',
			'batches',
			'verifications',
		]);
	});

	it('rejects a verification with no id', () => {
		expect(
			EmailableVerificationEntity.safeParse({ state: 'deliverable' }).success,
		).toBe(false);
	});
});

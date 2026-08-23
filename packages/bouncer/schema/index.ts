import {
	BouncerBatchVerification,
	BouncerDomainVerification,
	BouncerEmailVerification,
	BouncerToxicityJob,
} from './database';

export const BouncerSchema = {
	version: '1.0.0',
	entities: {
		emailVerifications: BouncerEmailVerification,
		domainVerifications: BouncerDomainVerification,
		batchVerifications: BouncerBatchVerification,
		toxicityJobs: BouncerToxicityJob,
	},
} as const;

export * from './database';

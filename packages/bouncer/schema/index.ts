import {
	BouncerBatchVerification,
	BouncerDomainVerification,
	BouncerEmailVerification,
	BouncerToxicityJob,
	BouncerToxicityResult,
} from './database';

export const BouncerSchema = {
	version: '1.0.0',
	entities: {
		emailVerifications: BouncerEmailVerification,
		domainVerifications: BouncerDomainVerification,
		batchVerifications: BouncerBatchVerification,
		toxicityJobs: BouncerToxicityJob,
		toxicityResults: BouncerToxicityResult,
	},
} as const;

export * from './database';

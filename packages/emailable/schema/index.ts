import {
	EmailableAccountEntity,
	EmailableBatchEntity,
	EmailableVerificationEntity,
} from './database';

export const EmailableSchema = {
	version: '1.0.0',
	entities: {
		accounts: EmailableAccountEntity,
		verifications: EmailableVerificationEntity,
		batches: EmailableBatchEntity,
	},
} as const;

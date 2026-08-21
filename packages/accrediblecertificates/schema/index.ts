import { AccredibleCredentialEntity } from './database';

export const AccredibleCertificatesSchema = {
	version: '1.0.0',
	entities: {
		credentials: AccredibleCredentialEntity,
	},
} as const;

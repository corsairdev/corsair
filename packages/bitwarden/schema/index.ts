import {
	BitwardenCipherMetadata,
	BitwardenCollection,
	BitwardenMember,
	BitwardenOrganization,
} from './database';

export const BitwardenSchema = {
	version: '1.0.0',
	entities: {
		organizations: BitwardenOrganization,
		collections: BitwardenCollection,
		members: BitwardenMember,
		ciphers: BitwardenCipherMetadata,
	},
} as const;

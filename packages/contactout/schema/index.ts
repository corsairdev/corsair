import { ContactOutCompany, ContactOutProfile } from './database';

export const ContactOutSchema = {
	version: '1.0.0',
	entities: {
		profiles: ContactOutProfile,
		companies: ContactOutCompany,
	},
} as const;

export type { ContactOutCompany, ContactOutProfile } from './database';

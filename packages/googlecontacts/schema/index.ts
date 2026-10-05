import { GoogleContact, GoogleContactGroup } from './database';

export const GoogleContactsSchema = {
	version: '1.0.0',
	entities: {
		contacts: GoogleContact,
		contactGroups: GoogleContactGroup,
	},
} as const;

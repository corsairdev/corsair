import {
	WhatsappBusinessProfile,
	WhatsappContact,
	WhatsappMessage,
	WhatsappPhoneNumber,
} from './database';

export const WhatsappSchema = {
	version: '1.0.0',
	entities: {
		messages: WhatsappMessage,
		contacts: WhatsappContact,
		phoneNumbers: WhatsappPhoneNumber,
		businessProfiles: WhatsappBusinessProfile,
	},
} as const;

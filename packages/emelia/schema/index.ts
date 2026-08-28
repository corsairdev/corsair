import { EmeliaCampaign, EmeliaContactList } from './database';

export * from './database';

export const EmeliaSchema = {
	version: '1.0.0',
	entities: {
		campaign: EmeliaCampaign,
		contactList: EmeliaContactList,
	},
} as const;

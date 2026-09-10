import { BrevoCampaign, BrevoContact } from './database';

export const BrevoSchema = {
	version: '1.0.0',
	entities: {
		contacts: BrevoContact,
		campaigns: BrevoCampaign,
	},
} as const;

export { BrevoCampaign, BrevoContact } from './database';

import {
	InstantlyAccount,
	InstantlyCampaign,
	InstantlyEmail,
	InstantlyLead,
} from './database';

export const InstantlySchema = {
	version: '1.0.0',
	entities: {
		accounts: InstantlyAccount,
		campaigns: InstantlyCampaign,
		leads: InstantlyLead,
		emails: InstantlyEmail,
	},
} as const;

export type {
	InstantlyAccount,
	InstantlyCampaign,
	InstantlyEmail,
	InstantlyLead,
} from './database';

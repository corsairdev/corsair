import { MailchimpCampaign, MailchimpList, MailchimpMember } from './database';

export const MailchimpSchema = {
	version: '1.0.0',
	entities: {
		lists: MailchimpList,
		members: MailchimpMember,
		campaigns: MailchimpCampaign,
	},
} as const;

import {
	MailtrapContactEntity,
	MailtrapContactFieldEntity,
	MailtrapContactListEntity,
	MailtrapEmailTemplateEntity,
	MailtrapInboxEntity,
	MailtrapProjectEntity,
	MailtrapSendingDomainEntity,
} from './database';

export const MailtrapSchema = {
	version: '1.0.0',
	entities: {
		contacts: MailtrapContactEntity,
		contactLists: MailtrapContactListEntity,
		contactFields: MailtrapContactFieldEntity,
		emailTemplates: MailtrapEmailTemplateEntity,
		sendingDomains: MailtrapSendingDomainEntity,
		projects: MailtrapProjectEntity,
		inboxes: MailtrapInboxEntity,
	},
} as const;

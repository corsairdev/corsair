import { contactCreated, contactDeleted, contactUpdated } from './contacts';
import { domainCreated, domainDeleted, domainUpdated } from './domains';
import {
	emailBounced,
	emailClicked,
	emailComplained,
	emailDelivered,
	emailFailed,
	emailOpened,
	emailReceived,
	emailScheduled,
	emailSent,
	emailSuppressed,
} from './emails';

export const EmailWebhooks = {
	sent: emailSent,
	delivered: emailDelivered,
	bounced: emailBounced,
	opened: emailOpened,
	clicked: emailClicked,
	complained: emailComplained,
	failed: emailFailed,
	received: emailReceived,
	scheduled: emailScheduled,
	suppressed: emailSuppressed,
};

export const DomainWebhooks = {
	created: domainCreated,
	updated: domainUpdated,
	deleted: domainDeleted,
};

export const ContactWebhooks = {
	created: contactCreated,
	updated: contactUpdated,
	deleted: contactDeleted,
};

export * from './types';

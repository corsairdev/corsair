import { domainCreated, domainUpdated } from './domains';
import {
	emailBounced,
	emailClicked,
	emailComplained,
	emailDelivered,
	emailFailed,
	emailOpened,
	emailReceived,
	emailSent,
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
};

export const DomainWebhooks = {
	created: domainCreated,
	updated: domainUpdated,
};

export * from './types';

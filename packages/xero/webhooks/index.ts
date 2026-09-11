import { ContactWebhooks } from './contacts';
import { eventWebhook } from './event';
import { InvoiceWebhooks } from './invoices';

export { ContactWebhooks, InvoiceWebhooks, eventWebhook };

export const XeroWebhooksMap = {
	invoices: InvoiceWebhooks,
	contacts: ContactWebhooks,
	event: eventWebhook,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';

import { createContact } from './create-contact';
import { getApiUsageInfo } from './get-api-usage-info';
import { listContacts } from './list-contacts';
import { listWebhooks } from './list-webhooks';
import { testApiKey } from './test-api-key';

export const Contacts = { createContact, listContacts };
export const Account = { getApiUsageInfo, testApiKey };
export const Webhooks = { listWebhooks };

export * from './types';

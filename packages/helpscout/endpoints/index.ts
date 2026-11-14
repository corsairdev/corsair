import * as conversations from './conversations';
import * as customFields from './custom-fields';
import * as customers from './customers';
import * as folders from './folders';
import * as mailboxes from './mailboxes';
import * as reports from './reports';
import * as savedReplies from './saved-replies';
import * as tags from './tags';
import * as threads from './threads';

export const Mailboxes = mailboxes;
export const Folders = folders;
export const CustomFields = customFields;
export const Conversations = conversations;
export const Threads = threads;
export const Customers = customers;
export const Tags = tags;
export const SavedReplies = savedReplies;
export const Reports = reports;

export * from './types';

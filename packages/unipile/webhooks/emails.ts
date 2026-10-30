import { defineUnipileWebhook } from './define';
import {
	EmailBounceEventSchema,
	EmailDeleteEventSchema,
	EmailDraftDeleteEventSchema,
	EmailDraftNewEventSchema,
	EmailFolderCreateEventSchema,
	EmailFolderDeleteEventSchema,
	EmailFolderUpdateEventSchema,
	EmailNewEventSchema,
} from './types';

// An email was added to a folder: received, sent, or moved in. Gmail, Outlook and IMAP can report it up to 10 seconds late.
export const emailNew = defineUnipileWebhook(
	'emailNew',
	'email.new',
	EmailNewEventSchema,
);

// A bounce notice arrived; sent instead of email.new for it.
export const emailBounce = defineUnipileWebhook(
	'emailBounce',
	'email.new.bounce',
	EmailBounceEventSchema,
);

// An email left a folder (deleted, or moved to another folder).
export const emailDelete = defineUnipileWebhook(
	'emailDelete',
	'email.delete',
	EmailDeleteEventSchema,
);

export const emailDraftNew = defineUnipileWebhook(
	'emailDraftNew',
	'email.draft.new',
	EmailDraftNewEventSchema,
);

export const emailDraftDelete = defineUnipileWebhook(
	'emailDraftDelete',
	'email.draft.delete',
	EmailDraftDeleteEventSchema,
);

export const emailFolderCreate = defineUnipileWebhook(
	'emailFolderCreate',
	'email.folder.create',
	EmailFolderCreateEventSchema,
);

export const emailFolderUpdate = defineUnipileWebhook(
	'emailFolderUpdate',
	'email.folder.update',
	EmailFolderUpdateEventSchema,
);

export const emailFolderDelete = defineUnipileWebhook(
	'emailFolderDelete',
	'email.folder.delete',
	EmailFolderDeleteEventSchema,
);

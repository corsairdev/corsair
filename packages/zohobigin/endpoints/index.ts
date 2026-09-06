import * as attachments from './attachments';
import * as bulk from './bulk';
import * as metadata from './metadata';
import * as notes from './notes';
import * as notifications from './notifications';
import * as records from './records';
import * as tags from './tags';
import * as users from './users';

export {
	records,
	notes,
	tags,
	attachments,
	bulk,
	notifications,
	metadata,
	users,
};

export const zohoBiginEndpoints = {
	records,
	notes,
	tags,
	attachments,
	bulk,
	notifications,
	metadata,
	users,
} as const;

export * from './types';

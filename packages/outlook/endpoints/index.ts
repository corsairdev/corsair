import {
	createCalendar,
	deleteCalendar,
	getCalendar,
	listCalendars,
} from './calendars';
import {
	createContact,
	deleteContact,
	listContacts,
	updateContact,
} from './contacts';
import {
	cancelEvent,
	createEvent,
	declineEvent,
	deleteEvent,
	findMeetingTimes,
	getEvent,
	getSchedule,
	listEvents,
	updateEvent,
} from './events';
import {
	createFolder,
	deleteFolder,
	getFolder,
	listFolders,
	updateFolder,
} from './folders';
import {
	addMailAttachment,
	batchMoveMessages,
	batchUpdateMessages,
	createDraft,
	deleteMessage,
	forwardMessage,
	getMessage,
	listMessages,
	moveMessage,
	queryEmails,
	replyEmail,
	searchMessages,
	send,
	sendDraft,
	updateEmail,
} from './messages';

export const Messages = {
	send,
	createDraft,
	get: getMessage,
	list: listMessages,
	query: queryEmails,
	search: searchMessages,
	reply: replyEmail,
	forward: forwardMessage,
	delete: deleteMessage,
	move: moveMessage,
	update: updateEmail,
	sendDraft,
	batchMove: batchMoveMessages,
	batchUpdate: batchUpdateMessages,
	addAttachment: addMailAttachment,
};

export const Events = {
	create: createEvent,
	get: getEvent,
	list: listEvents,
	update: updateEvent,
	delete: deleteEvent,
	cancel: cancelEvent,
	decline: declineEvent,
	findMeetingTimes,
	getSchedule,
};

export const Calendars = {
	create: createCalendar,
	get: getCalendar,
	list: listCalendars,
	delete: deleteCalendar,
};

export const Contacts = {
	create: createContact,
	list: listContacts,
	update: updateContact,
	delete: deleteContact,
};

export const Folders = {
	create: createFolder,
	get: getFolder,
	list: listFolders,
	update: updateFolder,
	delete: deleteFolder,
};

export * from './types';

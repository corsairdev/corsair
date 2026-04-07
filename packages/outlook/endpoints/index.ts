import {
	send,
	createDraft,
	getMessage,
	listMessages,
	queryEmails,
	searchMessages,
	replyEmail,
	forwardMessage,
	deleteMessage,
	moveMessage,
	updateEmail,
	sendDraft,
	batchMoveMessages,
	batchUpdateMessages,
	addMailAttachment,
} from './messages';
import {
	createEvent,
	getEvent,
	listEvents,
	updateEvent,
	deleteEvent,
	cancelEvent,
	declineEvent,
	findMeetingTimes,
	getSchedule,
} from './events';
import {
	createCalendar,
	getCalendar,
	listCalendars,
	deleteCalendar,
} from './calendars';
import {
	createContact,
	listContacts,
	updateContact,
	deleteContact,
} from './contacts';
import {
	createFolder,
	getFolder,
	listFolders,
	updateFolder,
	deleteFolder,
} from './folders';

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

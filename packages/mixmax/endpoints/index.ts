import {
	messagesList,
	messagesCreate,
	messagesGet,
	messagesUpdate,
	messagesSend,
	messagesSchedule,
	messagesUnschedule,
	messagesTest,
	messagesSendPlain,
} from './messages';
import {
	sequencesList,
	sequencesGetRecipients,
	sequencesAddRecipients,
	sequencesGet,
	sequencesCreate,
	sequencesUpdate,
	sequencesDelete,
	sequencesPause,
	sequencesResume,
} from './sequences';
import {
	snippetsList,
	snippetsGet,
	snippetsCreate,
	snippetsUpdate,
	snippetsDelete,
} from './snippets';
import {
	usersGetMe,
	usersGet,
	usersUpdatePassword,
	usersUpdateSubscription,
	userPreferencesGet,
	userPreferencesUpdate,
} from './users';

export const Messages = {
	list: messagesList,
	create: messagesCreate,
	get: messagesGet,
	update: messagesUpdate,
	send: messagesSend,
	schedule: messagesSchedule,
	unschedule: messagesUnschedule,
	test: messagesTest,
	sendPlain: messagesSendPlain,
};

export const Sequences = {
	list: sequencesList,
	getRecipients: sequencesGetRecipients,
	addRecipients: sequencesAddRecipients,
	get: sequencesGet,
	create: sequencesCreate,
	update: sequencesUpdate,
	delete: sequencesDelete,
	pause: sequencesPause,
	resume: sequencesResume,
};

export const Snippets = {
	list: snippetsList,
	get: snippetsGet,
	create: snippetsCreate,
	update: snippetsUpdate,
	delete: snippetsDelete,
};

export const Users = {
	getMe: usersGetMe,
	get: usersGet,
	updatePassword: usersUpdatePassword,
	updateSubscription: usersUpdateSubscription,
	preferences: {
		get: userPreferencesGet,
		update: userPreferencesUpdate,
	},
};

export * from './types';

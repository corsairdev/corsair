import { livefeedEvents, livefeedList } from './livefeed';
import {
	messagesCreate,
	messagesGet,
	messagesList,
	messagesSchedule,
	messagesSend,
	messagesSendPlain,
	messagesTest,
	messagesUnschedule,
	messagesUpdate,
} from './messages';
import {
	sequenceFoldersAddSequences,
	sequenceFoldersCreate,
	sequenceFoldersDelete,
	sequenceFoldersGet,
	sequenceFoldersList,
	sequenceFoldersRename,
	sequencesCancel,
	sequencesCancelAll,
	sequencesList,
	sequencesRecipientsAdd,
	sequencesRecipientsList,
	sequencesSearch,
} from './sequences';
import {
	snippetsDelete,
	snippetsGet,
	snippetsList,
	snippetsSend,
	snippetsUpdate,
	snippetTagsAddSnippets,
	snippetTagsCreate,
	snippetTagsDelete,
	snippetTagsGet,
	snippetTagsList,
	snippetTagsListSnippets,
	snippetTagsUpdate,
} from './snippets';
import {
	unsubscribesCreate,
	unsubscribesList,
	unsubscribesRemove,
} from './unsubscribes';
import {
	userPreferencesAutoBccAdd,
	userPreferencesAutoBccExists,
	userPreferencesAutoBccList,
	userPreferencesGet,
	userPreferencesUpdate,
	usersGetMe,
} from './users';

export const Users = {
	getMe: usersGetMe,
	preferences: {
		get: userPreferencesGet,
		update: userPreferencesUpdate,
		autoBccExcludedEmails: {
			list: userPreferencesAutoBccList,
			add: userPreferencesAutoBccAdd,
			exists: userPreferencesAutoBccExists,
		},
	},
};

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

export const Snippets = {
	list: snippetsList,
	get: snippetsGet,
	update: snippetsUpdate,
	delete: snippetsDelete,
	send: snippetsSend,
};

export const SnippetTags = {
	list: snippetTagsList,
	create: snippetTagsCreate,
	get: snippetTagsGet,
	update: snippetTagsUpdate,
	delete: snippetTagsDelete,
	listSnippets: snippetTagsListSnippets,
	addSnippets: snippetTagsAddSnippets,
};

export const Sequences = {
	list: sequencesList,
	search: sequencesSearch,
	cancelAll: sequencesCancelAll,
	cancel: sequencesCancel,
	recipients: {
		list: sequencesRecipientsList,
		add: sequencesRecipientsAdd,
	},
};

export const SequenceFolders = {
	list: sequenceFoldersList,
	create: sequenceFoldersCreate,
	get: sequenceFoldersGet,
	rename: sequenceFoldersRename,
	delete: sequenceFoldersDelete,
	addSequences: sequenceFoldersAddSequences,
};

export const Unsubscribes = {
	list: unsubscribesList,
	create: unsubscribesCreate,
	remove: unsubscribesRemove,
};

export const Livefeed = {
	list: livefeedList,
	events: livefeedEvents,
};

export * from './types';

import {
	appointmentLinksGetMe,
	appointmentLinksList,
	appointmentLinksUpdateMe,
	meetingInvitesGet,
	meetingInvitesList,
	meetingTypesCreate,
	meetingTypesDelete,
	meetingTypesGet,
	meetingTypesList,
	meetingTypesUpdate,
} from './calendar';
import {
	codeSnippetsCreate,
	codeSnippetsGet,
	codeSnippetsList,
} from './codesnippets';
import { fileRequestsGet, fileRequestsList } from './filerequests';
import {
	insightsReportsCreate,
	insightsReportsDelete,
	insightsReportsList,
	insightsReportsUpdate,
	reportsRunDataTable,
} from './insights';
import { livefeedEvents, livefeedList } from './livefeed';
import { meetingsGetTranscript, meetingsSearchSummaries } from './meetings';
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
import { pollsGet, pollsList } from './polls';
import { qaGet, qaList } from './qa';
import {
	rulesCreate,
	rulesCreateAction,
	rulesDelete,
	rulesDeleteAction,
	rulesDeleteBulk,
	rulesGet,
	rulesGetEvent,
	rulesList,
	rulesListActions,
	rulesListEvents,
	rulesUpdate,
	rulesUpdateAction,
} from './rules';
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
import { tasksList } from './tasks';
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
import { yesnoGet, yesnoList } from './yesno';

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

export const Rules = {
	list: rulesList,
	create: rulesCreate,
	get: rulesGet,
	update: rulesUpdate,
	delete: rulesDelete,
	deleteBulk: rulesDeleteBulk,
	actions: {
		list: rulesListActions,
		create: rulesCreateAction,
		update: rulesUpdateAction,
		delete: rulesDeleteAction,
	},
	events: {
		list: rulesListEvents,
		get: rulesGetEvent,
	},
};

export const CodeSnippets = {
	list: codeSnippetsList,
	create: codeSnippetsCreate,
	get: codeSnippetsGet,
};

export const AppointmentLinks = {
	list: appointmentLinksList,
	getMe: appointmentLinksGetMe,
	updateMe: appointmentLinksUpdateMe,
};

export const MeetingTypes = {
	list: meetingTypesList,
	create: meetingTypesCreate,
	get: meetingTypesGet,
	update: meetingTypesUpdate,
	delete: meetingTypesDelete,
};

export const MeetingInvites = {
	list: meetingInvitesList,
	get: meetingInvitesGet,
};

export const Meetings = {
	searchSummaries: meetingsSearchSummaries,
	getTranscript: meetingsGetTranscript,
};

export const Tasks = {
	list: tasksList,
};

export const FileRequests = {
	list: fileRequestsList,
	get: fileRequestsGet,
};

export const InsightsReports = {
	list: insightsReportsList,
	create: insightsReportsCreate,
	update: insightsReportsUpdate,
	delete: insightsReportsDelete,
};

export const Reports = {
	runDataTable: reportsRunDataTable,
};

export const Qa = {
	list: qaList,
	get: qaGet,
};

export const YesNo = {
	list: yesnoList,
	get: yesnoGet,
};

export const Polls = {
	list: pollsList,
	get: pollsGet,
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

import { createBorneoEndpoint } from './factory';

export const listFilteredSortedCategories = createBorneoEndpoint(
	'listFilteredSortedCategories',
	'BORNEO_LIST_FILTERED_SORTED_CATEGORIES',
	'borneo.misc.listFilteredSortedCategories',
);

export const listIssuesWithFilters = createBorneoEndpoint(
	'listIssuesWithFilters',
	'BORNEO_LIST_ISSUES_WITH_FILTERS',
	'borneo.misc.listIssuesWithFilters',
);

export const retrieveErrorDetailsById = createBorneoEndpoint(
	'retrieveErrorDetailsById',
	'BORNEO_RETRIEVE_ERROR_DETAILS_BY_ID',
	'borneo.misc.retrieveErrorDetailsById',
);

export const retrieveIssueById = createBorneoEndpoint(
	'retrieveIssueById',
	'BORNEO_RETRIEVE_ISSUE_BY_ID',
	'borneo.misc.retrieveIssueById',
);

export const submitChatFeedback = createBorneoEndpoint(
	'submitChatFeedback',
	'BORNEO_SUBMIT_CHAT_FEEDBACK',
	'borneo.misc.submitChatFeedback',
);

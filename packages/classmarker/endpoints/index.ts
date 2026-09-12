import { addAccessCodes, deleteAccessCodes } from './access-lists';
import {
	createCategory,
	createParentCategory,
	getAllCategories,
	updateCategory,
	updateParentCategory,
} from './categories';
import {
	deleteApiKey,
	deleteWebhook,
	getInitialFinishedAfterTimestamp,
	listCertificates,
	listWebhooks,
} from './certificates-webhooks';
import { getAllGroupsLinksExams } from './groups-links-exams';
import {
	createQuestion,
	getQuestion,
	listQuestions,
	updateQuestion,
} from './questions';
import {
	getRecentResultsForAllGroups,
	getRecentResultsForAllLinks,
	getRecentResultsForGroupExam,
	getRecentResultsForLinkExam,
} from './recent-results';
import {
	createGroup,
	createUser,
	deleteGroup,
	deleteTestLink,
	deleteUser,
	getGroupDetails,
	getTestDetails,
	getUserDetails,
	listTests,
	listUsers,
} from './users-groups-tests';

export const GroupsLinksExams = {
	getAll: getAllGroupsLinksExams,
};

export const RecentResults = {
	forAllGroups: getRecentResultsForAllGroups,
	forAllLinks: getRecentResultsForAllLinks,
	forGroupExam: getRecentResultsForGroupExam,
	forLinkExam: getRecentResultsForLinkExam,
};

export const AccessLists = {
	addCodes: addAccessCodes,
	deleteCodes: deleteAccessCodes,
};

export const Categories = {
	list: getAllCategories,
	createParent: createParentCategory,
	updateParent: updateParentCategory,
	create: createCategory,
	update: updateCategory,
};

export const Questions = {
	list: listQuestions,
	get: getQuestion,
	create: createQuestion,
	update: updateQuestion,
};

export const Users = {
	list: listUsers,
	get: getUserDetails,
	create: createUser,
	delete: deleteUser,
};

export const Groups = {
	create: createGroup,
	delete: deleteGroup,
	get: getGroupDetails,
};

export const Tests = {
	list: listTests,
	get: getTestDetails,
	deleteLink: deleteTestLink,
};

export const Certificates = {
	list: listCertificates,
};

export const Webhooks = {
	list: listWebhooks,
	delete: deleteWebhook,
};

export const ApiKeys = {
	delete: deleteApiKey,
};

export const Utility = {
	getInitialFinishedAfterTimestamp,
};

export * from './types';

import { addAccessCodes, deleteAccessCodes } from './access-lists';
import {
	createCategory,
	createParentCategory,
	getAllCategories,
	updateCategory,
	updateParentCategory,
} from './categories';
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

export * from './types';

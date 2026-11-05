import { defineOp } from './factory';

export const checkContent = defineOp('checkContent');
export const queryModerationRules = defineOp('queryModerationRules');
export const updateModerationRule = defineOp('updateModerationRule');
export const listGroupRequests = defineOp('listGroupRequests');
export const queryGroupRequests = defineOp('queryGroupRequests');
export const deleteFaqCategory = defineOp('deleteFaqCategory');
export const deleteQuestionEntry = defineOp('deleteQuestionEntry');
export const updateQuestionEntryLabels = defineOp('updateQuestionEntryLabels');
export const updateReviewModerationStatus = defineOp(
	'updateReviewModerationStatus',
);
export const bulkUpdateReviewModerationStatus = defineOp(
	'bulkUpdateReviewModerationStatus',
);

export const CommunityEndpoints = {
	checkContent,
	queryModerationRules,
	updateModerationRule,
	listGroupRequests,
	queryGroupRequests,
	deleteFaqCategory,
	deleteQuestionEntry,
	updateQuestionEntryLabels,
	updateReviewModerationStatus,
	bulkUpdateReviewModerationStatus,
} as const;

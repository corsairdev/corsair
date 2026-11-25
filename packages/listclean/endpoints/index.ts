import { getCredits } from './account';
import { getList, getListResults, listLists, remove } from './lists';
import {
	getAnalytics,
	getVerificationLogs,
	startBatchVerification,
	verifyEmail,
} from './verify';

export const Verify = {
	verifyEmail,
	startBatchVerification,
	getVerificationLogs,
	getAnalytics,
};

export const Lists = {
	listLists,
	getList,
	getListResults,
	delete: remove,
};

export const Account = {
	getCredits,
};

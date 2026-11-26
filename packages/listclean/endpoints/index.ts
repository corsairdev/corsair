import { getCredits, getProfile, updateProfile } from './account';
import {
	getList,
	getListResults,
	getListResultsCsv,
	listLists,
	remove,
} from './lists';
import { getUpload, listUploads, startUpload, uploadChunk } from './uploads';
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

export const Uploads = {
	listUploads,
	startUpload,
	uploadChunk,
	getUpload,
};

export const Lists = {
	listLists,
	getList,
	getListResults,
	getListResultsCsv,
	delete: remove,
};

export const Account = {
	getCredits,
	getProfile,
	updateProfile,
};

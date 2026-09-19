import { info as apiKeyInfo } from './api-keys';
import {
	changeStage as applicationChangeStage,
	create as applicationCreate,
	info as applicationInfo,
	list as applicationList,
	transfer as applicationTransfer,
	update as applicationUpdate,
} from './applications';
import {
	addTag as candidateAddTag,
	anonymize as candidateAnonymize,
	create as candidateCreate,
	createNote as candidateCreateNote,
	info as candidateInfo,
	list as candidateList,
	listNotes as candidateListNotes,
	removeTag as candidateRemoveTag,
	search as candidateSearch,
	update as candidateUpdate,
} from './candidates';
import {
	info as customFieldInfo,
	list as customFieldList,
	setValue as customFieldSetValue,
} from './custom-fields';
import {
	archive as departmentArchive,
	create as departmentCreate,
	info as departmentInfo,
	list as departmentList,
	update as departmentUpdate,
} from './departments';
import {
	info as interviewInfo,
	list as interviewList,
	scheduleInfo as interviewScheduleInfo,
	scheduleList as interviewScheduleList,
	stageList as interviewStageList,
} from './interviews';
import { info as jobPostingInfo, list as jobPostingList } from './job-postings';
import {
	create as jobCreate,
	info as jobInfo,
	list as jobList,
	search as jobSearch,
	update as jobUpdate,
} from './jobs';
import {
	archive as locationArchive,
	create as locationCreate,
	info as locationInfo,
	list as locationList,
	update as locationUpdate,
} from './locations';
import {
	create as offerCreate,
	info as offerInfo,
	list as offerList,
	update as offerUpdate,
} from './offers';
import {
	info as userInfo,
	list as userList,
	search as userSearch,
} from './users';
import {
	create as webhookCreate,
	remove as webhookDelete,
	info as webhookInfo,
} from './webhooks';

export const Candidate = {
	info: candidateInfo,
	list: candidateList,
	search: candidateSearch,
	create: candidateCreate,
	update: candidateUpdate,
	addTag: candidateAddTag,
	removeTag: candidateRemoveTag,
	createNote: candidateCreateNote,
	listNotes: candidateListNotes,
	anonymize: candidateAnonymize,
};

export const Application = {
	info: applicationInfo,
	list: applicationList,
	create: applicationCreate,
	changeStage: applicationChangeStage,
	update: applicationUpdate,
	transfer: applicationTransfer,
};

export const Job = {
	info: jobInfo,
	list: jobList,
	create: jobCreate,
	update: jobUpdate,
	search: jobSearch,
};

export const JobPosting = {
	info: jobPostingInfo,
	list: jobPostingList,
};

export const Interview = {
	info: interviewInfo,
	list: interviewList,
	scheduleInfo: interviewScheduleInfo,
	scheduleList: interviewScheduleList,
	stageList: interviewStageList,
};

export const Offer = {
	info: offerInfo,
	list: offerList,
	create: offerCreate,
	update: offerUpdate,
};

export const Department = {
	info: departmentInfo,
	list: departmentList,
	create: departmentCreate,
	update: departmentUpdate,
	archive: departmentArchive,
};

export const Location = {
	info: locationInfo,
	list: locationList,
	create: locationCreate,
	update: locationUpdate,
	archive: locationArchive,
};

export const User = {
	info: userInfo,
	list: userList,
	search: userSearch,
};

export const CustomField = {
	info: customFieldInfo,
	list: customFieldList,
	setValue: customFieldSetValue,
};

export const ApiKey = {
	info: apiKeyInfo,
};

export const Webhook = {
	info: webhookInfo,
	create: webhookCreate,
	delete: webhookDelete,
};

export * from './types';

import {
	getDetails as transcriptionsGetDetails,
	getSummary as transcriptionsGetSummary,
	list as transcriptionsList,
	create as transcriptionsCreate,
	remove as transcriptionsRemove,
	updateDetails as transcriptionsUpdateDetails,
} from './transcriptions';
import { create as exportsCreate, get as exportsGet } from './exports';
import { createTask as translationsCreateTask, getTask as translationsGetTask } from './translations';
import { create as meetingsCreate, get as meetingsGet } from './meetings';
import { getSignedUrl as uploadsGetSignedUrl } from './uploads';
import {
	addMembership as membershipsAdd,
	listGlossaries as glossariesList,
	listMemberships as membershipsList,
	listOrganizations as organizationsList,
	listStyleGuides as styleGuidesList,
	removeMembership as membershipsRemove,
	updateMembershipRole as membershipsUpdateRole,
} from './orgs';
import {
	confirm as ordersConfirm,
	create as ordersCreate,
	createTranslation as ordersCreateTranslation,
	get as ordersGet,
} from './orders';
import {
	getCompany as companiesGet,
	listCompanies as companiesList,
	getPerson as peopleGet,
	listPeople as peopleList,
} from './intelligence';

/** Transcription operations. */
export const Transcriptions = {
	list: transcriptionsList,
	create: transcriptionsCreate,
	getDetails: transcriptionsGetDetails,
	getSummary: transcriptionsGetSummary,
	updateDetails: transcriptionsUpdateDetails,
	delete: transcriptionsRemove,
};

/** Export operations. */
export const Exports = {
	create: exportsCreate,
	get: exportsGet,
};

/** Translation task operations. */
export const Translations = {
	createTask: translationsCreateTask,
	getTask: translationsGetTask,
};

/** Meeting (notetaker) operations. */
export const Meetings = {
	create: meetingsCreate,
	get: meetingsGet,
};

/** Upload operations. */
export const Uploads = {
	getSignedUrl: uploadsGetSignedUrl,
};

/** Glossary operations. */
export const Glossaries = {
	list: glossariesList,
};

/** Style guide operations. */
export const StyleGuides = {
	list: styleGuidesList,
};

/** Organization operations. */
export const Organizations = {
	list: organizationsList,
};

/** Organization membership operations. */
export const Memberships = {
	list: membershipsList,
	add: membershipsAdd,
	updateRole: membershipsUpdateRole,
	remove: membershipsRemove,
};

/** Human-service order operations. */
export const Orders = {
	create: ordersCreate,
	createTranslation: ordersCreateTranslation,
	get: ordersGet,
	confirm: ordersConfirm,
};

/** Intelligence API operations. */
export const Intelligence = {
	listCompanies: companiesList,
	getCompany: companiesGet,
	listPeople: peopleList,
	getPerson: peopleGet,
};

export * from './types';

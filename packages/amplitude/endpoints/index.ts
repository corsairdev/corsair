import {
	create as annotationsCreate,
	list as annotationsList,
} from './annotations';
import { get as chartsGet } from './charts';
import {
	create as cohortsCreate,
	get as cohortsGet,
	list as cohortsList,
	getMembers,
} from './cohorts';
import { get as dashboardsGet, list as dashboardsList } from './dashboards';
import { getList, identifyUser, upload, uploadBatch } from './events';
import { getData } from './exports';
import { getActivity, getProfile, search as usersSearch } from './users';

export const Events = {
	upload,
	uploadBatch,
	identifyUser,
	getList,
};

export const Users = {
	search: usersSearch,
	getProfile,
	getActivity,
};

export const Cohorts = {
	list: cohortsList,
	get: cohortsGet,
	create: cohortsCreate,
	getMembers,
};

export const Charts = {
	get: chartsGet,
};

export const Dashboards = {
	list: dashboardsList,
	get: dashboardsGet,
};

export const Annotations = {
	list: annotationsList,
	create: annotationsCreate,
};

export const Exports = {
	getData,
};

export * from './types';

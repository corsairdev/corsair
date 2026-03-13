import { upload, uploadBatch, identifyUser, getList } from './events';
import { search as usersSearch, getProfile, getActivity } from './users';
import { list as cohortsList, get as cohortsGet, create as cohortsCreate, getMembers } from './cohorts';
import { get as chartsGet } from './charts';
import { list as dashboardsList, get as dashboardsGet } from './dashboards';
import { list as annotationsList, create as annotationsCreate } from './annotations';
import { getData } from './exports';

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

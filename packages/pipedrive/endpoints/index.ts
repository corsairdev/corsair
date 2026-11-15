import {
	createActivity,
	deleteActivity,
	getActivity,
	listActivities,
	updateActivity,
} from './activities';
import {
	createDeal,
	deleteDeal,
	getDeal,
	listDeals,
	updateDeal,
} from './deals';
import {
	createOrganization,
	deleteOrganization,
	getOrganization,
	listOrganizations,
	updateOrganization,
} from './organizations';
import {
	createPerson,
	deletePerson,
	getPerson,
	listPersons,
	updatePerson,
} from './persons';
import {
	createTask,
	deleteTask,
	getTask,
	listTasks,
	updateTask,
} from './tasks';

export const Deals = {
	list: listDeals,
	get: getDeal,
	create: createDeal,
	update: updateDeal,
	delete: deleteDeal,
};

export const Persons = {
	list: listPersons,
	get: getPerson,
	create: createPerson,
	update: updatePerson,
	delete: deletePerson,
};

export const Organizations = {
	list: listOrganizations,
	get: getOrganization,
	create: createOrganization,
	update: updateOrganization,
	delete: deleteOrganization,
};

export const Activities = {
	list: listActivities,
	get: getActivity,
	create: createActivity,
	update: updateActivity,
	delete: deleteActivity,
};

export const Tasks = {
	list: listTasks,
	get: getTask,
	create: createTask,
	update: updateTask,
	delete: deleteTask,
};

export * from './types';

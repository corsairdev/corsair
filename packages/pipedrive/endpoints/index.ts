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

export * from './types';

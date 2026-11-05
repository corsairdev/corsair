import { defineOp } from './factory';

export const query = defineOp('queryContacts');
export const list = defineOp('listContacts');
export const bulkUpdate = defineOp('bulkUpdateContacts');
export const addLabels = defineOp('addContactLabels');
export const unlabel = defineOp('unlabelContact');
export const listFacets = defineOp('listContactsFacets');
export const queryFacets = defineOp('queryContactsFacets');

export const ContactsEndpoints = {
	query,
	list,
	bulkUpdate,
	addLabels,
	unlabel,
	listFacets,
	queryFacets,
} as const;

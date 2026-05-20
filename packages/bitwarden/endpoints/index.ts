import { get as collectionsGet, list as collectionsList } from './collections';
import { get as membersGet, list as membersList } from './members';
import {
	get as organizationsGet,
	list as organizationsList,
} from './organizations';

export const Organizations = {
	list: organizationsList,
	get: organizationsGet,
};

export const Collections = {
	list: collectionsList,
	get: collectionsGet,
};

export const Members = {
	list: membersList,
	get: membersGet,
};

export * from './types';

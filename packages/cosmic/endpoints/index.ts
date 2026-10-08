import {
	find as mediaFind,
	findOne as mediaFindOne,
	insert as mediaInsert,
	remove as mediaRemove,
	update as mediaUpdate,
} from './media';
import {
	find as objectTypesFind,
	findOne as objectTypesFindOne,
	insert as objectTypesInsert,
	remove as objectTypesRemove,
	update as objectTypesUpdate,
} from './object-types';
import {
	batch,
	find as objectsFind,
	findOne as objectsFindOne,
	getById as objectsGetById,
	insert as objectsInsert,
	remove as objectsRemove,
	update as objectsUpdate,
} from './objects';
import {
	find as revisionsFind,
	findOne as revisionsFindOne,
	insert as revisionsInsert,
} from './revisions';

export const Objects = {
	find: objectsFind,
	findOne: objectsFindOne,
	getById: objectsGetById,
	insert: objectsInsert,
	update: objectsUpdate,
	delete: objectsRemove,
	batch,
};

export const Revisions = {
	find: revisionsFind,
	findOne: revisionsFindOne,
	insert: revisionsInsert,
};

export const Media = {
	find: mediaFind,
	findOne: mediaFindOne,
	insert: mediaInsert,
	update: mediaUpdate,
	delete: mediaRemove,
};

export const ObjectTypes = {
	find: objectTypesFind,
	findOne: objectTypesFindOne,
	insert: objectTypesInsert,
	update: objectTypesUpdate,
	delete: objectTypesRemove,
};

export * from './types';

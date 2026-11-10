import { defineEndpoint } from './factory';

// The `documents` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `documents` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const create = defineEndpoint('documents.create');
export const insert = defineEndpoint('documents.insert');
export const saveDocument = defineEndpoint('documents.saveDocument');
export const saveDocs = defineEndpoint('documents.saveDocs');
export const insertMany = defineEndpoint('documents.insertMany');
export const get = defineEndpoint('documents.get');
export const getClient = defineEndpoint('documents.getClient');
export const getWithMeta = defineEndpoint('documents.getWithMeta');
export const list = defineEndpoint('documents.list');
export const getList = defineEndpoint('documents.getList');
export const update = defineEndpoint('documents.update');
// `delete` is a reserved word and cannot name a const, so the handler binding
// carries the action meaning while the tree key below stays the provider's
// `delete` operation id.
export const deleteDocument = defineEndpoint('documents.delete');
export const setValue = defineEndpoint('documents.setValue');
export const getValue = defineEndpoint('documents.getValue');
export const getCount = defineEndpoint('documents.getCount');
export const renameDoc = defineEndpoint('documents.renameDoc');
export const searchLink = defineEndpoint('documents.searchLink');
export const submit = defineEndpoint('documents.submit');
export const cancel = defineEndpoint('documents.cancel');

export const endpoints = {
	create,
	insert,
	saveDocument,
	saveDocs,
	insertMany,
	get,
	getClient,
	getWithMeta,
	list,
	getList,
	update,
	delete: deleteDocument,
	setValue,
	getValue,
	getCount,
	renameDoc,
	searchLink,
	submit,
	cancel,
} as const;

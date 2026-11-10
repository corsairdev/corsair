import { defineEndpoint } from './factory';

export const notesUndelete = defineEndpoint('notes.undelete');
export const notesGet = defineEndpoint('notes.get');
export const notesDelete = defineEndpoint('notes.delete');
export const notesList = defineEndpoint('notes.list');
export const notesCreate = defineEndpoint('notes.create');

export const endpoints = {
	notes: {
		undelete: notesUndelete,
		get: notesGet,
		delete: notesDelete,
		list: notesList,
		create: notesCreate,
	},
} as const;

import { defineEndpoint } from './factory';

// The `desk` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `desk` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const addComment = defineEndpoint('desk.addComment');
export const addTag = defineEndpoint('desk.addTag');
export const searchGlobal = defineEndpoint('desk.searchGlobal');

export const endpoints = {
	addComment,
	addTag,
	searchGlobal,
} as const;

import { defineEndpoint } from './factory';

export const create = defineEndpoint('drafts.create');
export const deleteDraft = defineEndpoint('drafts.delete');

export const endpoints = {
	create,
	delete: deleteDraft,
} as const;

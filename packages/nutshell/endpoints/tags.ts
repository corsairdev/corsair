import { defineEndpoint } from './factory';

export const tagsList = defineEndpoint('tags.list');
export const tagsDelete = defineEndpoint('tags.delete');
export const tagsCreate = defineEndpoint('tags.create');
export const tagsUndelete = defineEndpoint('tags.undelete');

export const endpoints = {
	tags: {
		list: tagsList,
		delete: tagsDelete,
		create: tagsCreate,
		undelete: tagsUndelete,
	},
} as const;

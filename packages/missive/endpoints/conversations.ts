import { defineEndpoint } from './factory';

export const list = defineEndpoint('conversations.list');
export const get = defineEndpoint('conversations.get');
export const update = defineEndpoint('conversations.update');
export const listMessages = defineEndpoint('conversations.listMessages');
export const listComments = defineEndpoint('conversations.listComments');
export const listDrafts = defineEndpoint('conversations.listDrafts');
export const listPosts = defineEndpoint('conversations.listPosts');
export const merge = defineEndpoint('conversations.merge');

export const endpoints = {
	list,
	get,
	update,
	listMessages,
	listComments,
	listDrafts,
	listPosts,
	merge,
} as const;

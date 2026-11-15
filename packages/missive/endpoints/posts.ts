import { defineEndpoint } from './factory';

export const create = defineEndpoint('posts.create');
export const deletePost = defineEndpoint('posts.delete');

export const endpoints = {
	create,
	delete: deletePost,
} as const;

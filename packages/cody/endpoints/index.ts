import { post as graphqlPost } from './graphql';
import { get as searchGet } from './search';
import { get as viewerGet } from './viewer';

export const Viewer = {
	get: viewerGet,
};

export const Search = {
	get: searchGet,
};

export const Graphql = {
	post: graphqlPost,
};

export * from './types';

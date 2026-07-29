import { listPostComments as commentListPostComments } from './comments';
import {
	create as draftCreate,
	deleteDraft as draftDeleteDraft,
	get as draftGet,
	publish as draftPublish,
	update as draftUpdate,
} from './drafts';
import { feed as feedFeed } from './feed';
import { createImageUploadURL as imageCreateImageUploadURL } from './images';
import { getPage as pageGetPage, listPages as pageListPages } from './pages';
import {
	get as postGet,
	getBySlug as postGetBySlug,
	list as postList,
	publish as postPublish,
	search as postSearch,
	update as postUpdate,
} from './posts';
import { get as publicationGet, list as publicationList } from './publications';
import {
	getSeries as seriesGetSeries,
	listSeries as seriesListSeries,
} from './series';
import { getTag as tagGetTag } from './tags';
import { me as meMe, getUser as userGetUser } from './users';

export const Posts = {
	get: postGet,
	getBySlug: postGetBySlug,
	list: postList,
	search: postSearch,
	publish: postPublish,
	update: postUpdate,
};

export const Publications = {
	get: publicationGet,
	list: publicationList,
};

export const Comments = {
	list: commentListPostComments,
};

export const Users = {
	me: meMe,
	get: userGetUser,
};

export const Tags = {
	get: tagGetTag,
};

export const Series = {
	list: seriesListSeries,
	get: seriesGetSeries,
};

export const Pages = {
	list: pageListPages,
	get: pageGetPage,
};

export const Drafts = {
	get: draftGet,
	create: draftCreate,
	update: draftUpdate,
	publish: draftPublish,
	delete: draftDeleteDraft,
};

export const Feed = {
	list: feedFeed,
};

export const Images = {
	createUploadURL: imageCreateImageUploadURL,
};

export * from './types';

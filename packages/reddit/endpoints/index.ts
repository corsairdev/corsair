import {
	getAllFeed,
	getPopularFeed,
	getSubredditsNew,
	getSubredditsPopular,
} from './feeds';
import { getById, getComments } from './posts';
import { searchGlobal, searchSubreddit, searchSubreddits } from './search';
import {
	getAbout,
	getControversial,
	getHot,
	getNew,
	getRising,
	getTop,
} from './subreddits';
import {
	getAbout as getUserAbout,
	getComments as getUserComments,
	getOverview as getUserOverview,
	getSubmitted as getUserSubmitted,
} from './users';

export const Subreddits = {
	getHot,
	getNew,
	getTop,
	getRising,
	getControversial,
	getAbout,
};

export const Posts = {
	getComments,
	getById,
};

export const Users = {
	getAbout: getUserAbout,
	getSubmitted: getUserSubmitted,
	getComments: getUserComments,
	getOverview: getUserOverview,
};

export const Search = {
	global: searchGlobal,
	subreddit: searchSubreddit,
	subreddits: searchSubreddits,
};

export const Feeds = {
	getAll: getAllFeed,
	getPopular: getPopularFeed,
};

export const Listings = {
	subredditsPopular: getSubredditsPopular,
	subredditsNew: getSubredditsNew,
};

export * from './types';

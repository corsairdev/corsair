import * as Feeds from './feeds';
import * as Posts from './posts';
import * as Profiles from './profiles';

export const PostsEndpoints = {
	create: Posts.create,
	deleteRecord: Posts.deleteRecord,
};

export const ProfilesEndpoints = {
	get: Profiles.get,
};

export const FeedsEndpoints = {
	getTimeline: Feeds.getTimeline,
};

export * from './types';

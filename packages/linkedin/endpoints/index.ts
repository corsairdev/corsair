import * as Ads from './ads';
import * as Comments from './comments';
import * as Images from './images';
import * as Organizations from './organizations';
import * as Posts from './posts';
import * as Profile from './profile';
import * as Reactions from './reactions';
import * as Videos from './videos';

export const ProfileEndpoints = {
	getMyInfo: Profile.getMyInfo,
	getPerson: Profile.getPerson,
};

export const PostsEndpoints = {
	create: Posts.createPost,
	createArticleShare: Posts.createArticleShare,
	getContent: Posts.getPostContent,
	delete: Posts.deletePost,
	deleteShare: Posts.deleteSharePost,
	deleteUgc: Posts.deleteUgcPost,
};

export const CommentsEndpoints = {
	create: Comments.createComment,
};

export const ReactionsEndpoints = {
	list: Reactions.listReactions,
};

export const ImagesEndpoints = {
	get: Images.getImage,
	list: Images.getImages,
	initializeUpload: Images.initializeImageUpload,
	registerUpload: Images.registerImageUpload,
};

export const VideosEndpoints = {
	list: Videos.getVideos,
};

export const OrganizationsEndpoints = {
	getCompanyInfo: Organizations.getCompanyInfo,
	getNetworkSize: Organizations.getNetworkSize,
	getPageStats: Organizations.getOrgPageStats,
	getShareStats: Organizations.getShareStats,
};

export const AdsEndpoints = {
	getTargetingFacets: Ads.getAdTargetingFacets,
	getAudienceCounts: Ads.getAudienceCounts,
	searchTargetingEntities: Ads.searchAdTargetingEntities,
};

export * from './types';

import {
	SharepointFile,
	SharepointFolder,
	SharepointItem,
	SharepointList,
	SharepointSite,
	SharepointUser,
} from './database';

export const SharepointSchema = {
	version: '1.0.0',
	entities: {
		lists: SharepointList,
		items: SharepointItem,
		files: SharepointFile,
		folders: SharepointFolder,
		users: SharepointUser,
		sites: SharepointSite,
	},
} as const;

import { newActivity } from './newActivity';
import { newPlaylistItem } from './newPlaylistItem';
import { newPlaylist } from './newPlaylist';
import { newSubscription } from './newSubscription';

export const ActivitiesWebhooks = {
	newActivity,
};

export const PlaylistItemsWebhooks = {
	newPlaylistItem,
};

export const PlaylistsWebhooks = {
	newPlaylist,
};

export const SubscriptionsWebhooks = {
	newSubscription,
};

export * from './types';

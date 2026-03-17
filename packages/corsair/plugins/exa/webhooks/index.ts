import { contentIndexed } from './content-indexed';
import { searchAlert } from './search-alert';
import { websetItemsFound } from './webset-items-found';
import { websetSearchCompleted } from './webset-search-completed';

export const SearchWebhooks = {
	searchAlert,
};

export const ContentWebhooks = {
	contentIndexed,
};

export const WebsetWebhooks = {
	websetItemsFound,
	websetSearchCompleted,
};

export * from './types';

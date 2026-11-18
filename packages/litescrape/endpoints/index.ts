import {
	product as appleAppStoreProduct,
	reviews as appleAppStoreReviews,
	search as appleAppStoreSearch,
} from './apple-app-store';
import {
	places as appleMapsPlaces,
	reviews as appleMapsReviews,
} from './apple-maps';
import { maps as bingMaps, search as bingSearch } from './bing';
import {
	maps as duckduckgoMaps,
	search as duckduckgoSearch,
} from './duckduckgo';
import {
	ads,
	aiMode,
	aiOverview,
	local as googleLocal,
	search as googleSearch,
	shopping as googleShopping,
	shoppingProduct,
} from './google';
import {
	contributorReviews,
	reviews as googleMapsReviews,
	search as googleMapsSearch,
	photoMeta,
	popularTimes,
	posts,
} from './google-maps';
import {
	apps,
	books,
	games,
	product as googlePlayProduct,
	reviews as googlePlayReviews,
	movies,
} from './google-play';
import { status } from './keys';
import {
	place as tripadvisorPlace,
	reviews as tripadvisorReviews,
	search as tripadvisorSearch,
} from './tripadvisor';
import { fetch, screenshot } from './web';
import { reviews as yelpReviews, search as yelpSearch } from './yelp';

export const Google = {
	search: googleSearch,
	aiOverview,
	aiMode,
	ads,
	local: googleLocal,
	shopping: googleShopping,
	shoppingProduct,
};

export const GoogleMaps = {
	search: googleMapsSearch,
	reviews: googleMapsReviews,
	contributorReviews,
	popularTimes,
	posts,
	photoMeta,
};

export const Bing = {
	search: bingSearch,
	maps: bingMaps,
};

export const Duckduckgo = {
	search: duckduckgoSearch,
	maps: duckduckgoMaps,
};

export const Yelp = {
	search: yelpSearch,
	reviews: yelpReviews,
};

export const Tripadvisor = {
	search: tripadvisorSearch,
	place: tripadvisorPlace,
	reviews: tripadvisorReviews,
};

export const AppleMaps = {
	places: appleMapsPlaces,
	reviews: appleMapsReviews,
};

export const GooglePlay = {
	apps,
	games,
	books,
	movies,
	product: googlePlayProduct,
	reviews: googlePlayReviews,
};

export const AppleAppStore = {
	search: appleAppStoreSearch,
	product: appleAppStoreProduct,
	reviews: appleAppStoreReviews,
};

export const Web = {
	fetch,
	screenshot,
};

export const Keys = {
	status,
};

export * from './types';

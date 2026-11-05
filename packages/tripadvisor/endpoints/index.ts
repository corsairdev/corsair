import { geoDetails } from './geos';
import {
	locationDetails,
	locationPhotos,
	locationReviews,
	nearby,
	nearbyLocations,
} from './locations';

export const Catalog = {
	locationsNearby: nearby,
};

export const Location = {
	details: locationDetails,
	photos: locationPhotos,
	reviews: locationReviews,
};

export const Locations = {
	nearby: nearbyLocations,
};

export const Geo = {
	details: geoDetails,
};

export * from './types';

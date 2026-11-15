import * as Places from './places';

export const PlacesEndpoints = {
	search: Places.search,
	get: Places.get,
	autocomplete: Places.autocomplete,
	tips: Places.tips,
	photos: Places.photos,
	match: Places.match,
};

export * from './types';

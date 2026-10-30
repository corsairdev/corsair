import * as Aerial from './aerial';
import * as Geocoding from './geocoding';
import * as Geolocation from './geolocation';
import * as Places from './places';
import * as Routes from './routes';
import * as Tiles from './tiles';

export const PlacesEndpoints = {
	autocomplete: Places.autocomplete,
	getPlaceDetails: Places.getPlaceDetails,
	getPlacePhoto: Places.getPlacePhoto,
	nearbySearch: Places.nearbySearch,
	textSearch: Places.textSearch,
};

export const RoutesEndpoints = {
	computeRouteMatrix: Routes.computeRouteMatrix,
	distanceMatrix: Routes.distanceMatrix,
	getDirection: Routes.getDirection,
	getRoute: Routes.getRoute,
};

export const GeocodingEndpoints = {
	geocodeAddress: Geocoding.geocodeAddress,
	geocodeAddressWithQuery: Geocoding.geocodeAddressWithQuery,
	geocodeDestinations: Geocoding.geocodeDestinations,
	geocodePlace: Geocoding.geocodePlace,
	geocodingApi: Geocoding.geocodingApi,
	reverseGeocodeLocation: Geocoding.reverseGeocodeLocation,
};

export const TilesEndpoints = {
	createTilesSession: Tiles.createTilesSession,
	get2dTile: Tiles.get2dTile,
	get3dTilesRoot: Tiles.get3dTilesRoot,
	embedMap: Tiles.embedMap,
};

export const GeolocationEndpoints = {
	geolocate: Geolocation.geolocate,
};

export const AerialEndpoints = {
	lookupAerialVideo: Aerial.lookupAerialVideo,
	renderAerialVideo: Aerial.renderAerialVideo,
};

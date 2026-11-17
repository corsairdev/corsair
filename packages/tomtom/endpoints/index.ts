import * as Routing from './routing';
import * as Search from './search';
import * as Traffic from './traffic';

export const SearchEndpoints = {
	fuzzy: Search.fuzzySearch,
	geocode: Search.geocode,
	reverseGeocode: Search.reverseGeocode,
};

export const RoutingEndpoints = {
	calculate: Routing.calculateRoute,
};

export const TrafficEndpoints = {
	incidents: Traffic.incidentDetails,
	flow: Traffic.trafficFlow,
	tile: Traffic.trafficTile,
};

export * from './types';

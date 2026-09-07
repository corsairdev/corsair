import { HERE_HOSTS, makeHereRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint } from './call';
import {
	GetDeparturesInputSchema,
	GetDeparturesResponseSchema,
	GetStationsInputSchema,
	GetStationsResponseSchema,
} from './types';

export const getStations: HereEndpoints['getStations'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.transit.getStations',
		GetStationsInputSchema,
		GetStationsResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.transit, '/v8/stations', apiKey, {
				query: validated,
			}),
	);

export const getDepartures: HereEndpoints['getDepartures'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.transit.getDepartures',
		GetDeparturesInputSchema,
		GetDeparturesResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.transit, '/v8/departures', apiKey, {
				query: validated,
			}),
	);

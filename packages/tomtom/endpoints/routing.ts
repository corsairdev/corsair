import type { TomTomEndpoints } from '..';
import { call, routePoints } from './call';
import {
	TomTomEndpointInputSchemas,
	TomTomEndpointOutputSchemas,
} from './types';

export const calculateRoute: TomTomEndpoints['routingCalculate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'routing.calculate',
			input: TomTomEndpointInputSchemas.calculateRoute,
			output: TomTomEndpointOutputSchemas.calculateRoute,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `routing/1/calculateRoute/${encodeURIComponent(routePoints(parsed.origins))}:${encodeURIComponent(routePoints(parsed.destinations))}/json`,
			query: {
				travelMode: parsed.travel_mode,
				routeType: parsed.route_type,
				traffic: parsed.traffic,
				departAt: parsed.depart_at,
				vehicleMaxSpeed: parsed.vehicle_max_speed,
				avoid: parsed.avoid?.length ? parsed.avoid.join(',') : undefined,
				language: parsed.language,
			},
		}),
		{
			log: (parsed, result) => ({
				origins: parsed.origins.length,
				destinations: parsed.destinations.length,
				travel_mode: parsed.travel_mode ?? 'car',
				routes: result.routes.length,
			}),
		},
	);

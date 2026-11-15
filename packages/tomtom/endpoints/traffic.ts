import type { TomTomEndpoints } from '..';
import { call } from './call';
import {
	TomTomEndpointInputSchemas,
	TomTomEndpointOutputSchemas,
} from './types';

export const incidentDetails: TomTomEndpoints['trafficIncidents'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'traffic.incidents',
			input: TomTomEndpointInputSchemas.incidentDetails,
			output: TomTomEndpointOutputSchemas.incidentDetails,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'traffic/services/5/incidentDetails',
			query: {
				bbox: parsed.bbox,
				language: parsed.language,
				categoryFilter: parsed.category_filter,
				timeValidityFilter: parsed.time_validity_filter,
			},
		}),
		{
			log: (parsed, result) => ({
				bbox: parsed.bbox,
				incidents: result.incidents.length,
			}),
		},
	);

export const trafficFlow: TomTomEndpoints['trafficFlow'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'traffic.flow',
			input: TomTomEndpointInputSchemas.trafficFlow,
			output: TomTomEndpointOutputSchemas.trafficFlow,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `traffic/services/4/flowSegmentData/absolute/${parsed.zoom ?? 10}/json`,
			query: {
				point: `${parsed.latitude},${parsed.longitude}`,
				unit: parsed.unit,
			},
		}),
		{
			log: (_parsed, result) => ({
				road_closure: result.flowSegmentData?.roadClosure ?? false,
			}),
		},
	);

export const trafficTile: TomTomEndpoints['trafficTile'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'traffic.tile',
			input: TomTomEndpointInputSchemas.trafficTile,
			output: TomTomEndpointOutputSchemas.trafficTile,
		},
		input,
		(parsed) => {
			// The flow layer names its style in the path; the incidents layer has
			// no style segment at all.
			const layer = parsed.layer ?? 'flow';
			const styleSegment =
				layer === 'flow' ? `${parsed.style ?? 'relative'}/` : '';
			return {
				method: 'GET',
				path: `traffic/map/4/tile/${layer}/${styleSegment}${parsed.zoom}/${parsed.x}/${parsed.y}.png`,
			};
		},
		{
			log: (parsed) => ({
				layer: parsed.layer ?? 'flow',
				zoom: parsed.zoom,
			}),
		},
	);

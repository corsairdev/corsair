import { logEventFromContext } from 'corsair/core';
import type { TomTomEndpoints } from '..';
import { fetchTomTomTile } from '../client';
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
				// Without `fields`, v5 answers only type, geometry and iconCategory.
				fields: INCIDENT_FIELDS,
				language: parsed.language,
				categoryFilter: parsed.category_filter?.join(','),
				timeValidityFilter: parsed.time_validity_filter?.join(','),
			},
		}),
		{
			// The box is exact coordinates, so only the count is logged.
			log: (_parsed, result) => ({ incidents: result.incidents.length }),
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

/**
 * The fields v5 returns per incident. Without this selection the route answers
 * only `type`, `geometry` and `properties.iconCategory`.
 */
const INCIDENT_FIELDS =
	'{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}';

export const trafficTile: TomTomEndpoints['trafficTile'] = async (
	ctx,
	input,
) => {
	const parsed = TomTomEndpointInputSchemas.trafficTile.parse(input ?? {});
	// Both raster layers name a style in the path: flow styles such as
	// `relative`, incident styles such as `s3`.
	const layer = parsed.layer ?? 'flow';
	const style =
		layer === 'flow'
			? (parsed.style ?? 'relative')
			: (parsed.incident_style ?? 's3');
	const path = `traffic/map/4/tile/${layer}/${style}/${parsed.zoom}/${parsed.x}/${parsed.y}.png`;
	const result = TomTomEndpointOutputSchemas.trafficTile.parse(
		await fetchTomTomTile(ctx.key, path),
	);
	await logEventFromContext(
		ctx,
		'tomtom.traffic.tile',
		{ layer, zoom: parsed.zoom },
		'completed',
	);
	return result;
};

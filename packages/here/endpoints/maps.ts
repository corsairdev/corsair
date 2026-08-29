import { makeHereImageRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint } from './call';
import {
	CoordinatesToTileIndicesInputSchema,
	CoordinatesToTileIndicesResponseSchema,
	GetMapImageInputSchema,
	GetMapImageResponseSchema,
} from './types';

const WEB_MERCATOR_MAX_LAT = 85.05112878;

export function webMercatorTile(lat: number, lng: number, zoom: number) {
	const n = 2 ** zoom;
	const x = ((Math.floor(((lng + 180) / 360) * n) % n) + n) % n;
	const clampedLat = Math.min(
		WEB_MERCATOR_MAX_LAT,
		Math.max(-WEB_MERCATOR_MAX_LAT, lat),
	);
	const latRad = (clampedLat * Math.PI) / 180;
	const y = Math.min(
		n - 1,
		Math.max(
			0,
			Math.floor(
				((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
					2) *
					n,
			),
		),
	);
	return { x, y, z: zoom };
}

export const getMapImage: HereEndpoints['getMapImage'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.maps.getMapImage',
		GetMapImageInputSchema,
		GetMapImageResponseSchema,
		input,
		(validated, apiKey) => {
			const format = validated.format ?? 'png';
			const style = validated.style ?? 'explore.day';
			return makeHereImageRequest(
				`/mia/v3/base/mc/center:${validated.lat},${validated.lng};zoom=${validated.zoom}/${validated.width}x${validated.height}/${format}`,
				apiKey,
				{ style },
			);
		},
	);

export const coordinatesToTileIndices: HereEndpoints['coordinatesToTileIndices'] =
	(ctx, input) =>
		runHereEndpoint(
			ctx,
			'here.maps.coordinatesToTileIndices',
			CoordinatesToTileIndicesInputSchema,
			CoordinatesToTileIndicesResponseSchema,
			input,
			(validated) =>
				webMercatorTile(validated.lat, validated.lng, validated.zoom),
		);

import { logEventFromContext } from 'corsair/core';
import { makeGoogleMapsRequest } from '../client';
import type { GoogleMapsEndpoints } from '../index';
import type {
	CreateTilesSessionResponse,
	Get3dTilesRootResponse,
} from './types';
import {
	CreateTilesSessionInputSchema,
	CreateTilesSessionResponseSchema,
	EmbedMapInputSchema,
	EmbedMapResponseSchema,
	Get2dTileInputSchema,
	Get2dTileResponseSchema,
	Get3dTilesRootInputSchema,
	Get3dTilesRootResponseSchema,
} from './types';

export const createTilesSession: GoogleMapsEndpoints['createTilesSession'] =
	async (ctx, input) => {
		const validatedInput = CreateTilesSessionInputSchema.parse(input);

		const rawResponse = await makeGoogleMapsRequest<CreateTilesSessionResponse>(
			'/v1/createSession',
			ctx,
			{
				method: 'POST',
				baseUrl: 'https://tile.googleapis.com',
				body: validatedInput as Record<string, unknown>,
			},
		);

		const response = CreateTilesSessionResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'googlemaps.tiles.createTilesSession',
			validatedInput,
			'completed',
		);

		return response;
	};

export const get2dTile: GoogleMapsEndpoints['get2dTile'] = async (
	ctx,
	input,
) => {
	const validatedInput = Get2dTileInputSchema.parse(input);
	const { session, z, x, y } = validatedInput;

	const tileUrl = `https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}?session=${encodeURIComponent(session)}`;

	const response = Get2dTileResponseSchema.parse({
		tileUrl,
	});

	await logEventFromContext(
		ctx,
		'googlemaps.tiles.get2dTile',
		validatedInput,
		'completed',
	);

	return response;
};

export const get3dTilesRoot: GoogleMapsEndpoints['get3dTilesRoot'] = async (
	ctx,
	input,
) => {
	const validatedInput = Get3dTilesRootInputSchema.parse(input);

	const rawResponse = await makeGoogleMapsRequest<Get3dTilesRootResponse>(
		'/v1/3dtiles/root.json',
		ctx,
		{
			method: 'GET',
			baseUrl: 'https://tile.googleapis.com',
			query: validatedInput.key ? { key: validatedInput.key } : undefined,
		},
	);

	const response = Get3dTilesRootResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'googlemaps.tiles.get3dTilesRoot',
		validatedInput,
		'completed',
	);

	return response;
};

export const embedMap: GoogleMapsEndpoints['embedMap'] = async (ctx, input) => {
	const validatedInput = EmbedMapInputSchema.parse(input);
	const keyParam = ctx.key ? `&key=${encodeURIComponent(ctx.key)}` : '';
	let queryStr = '';

	if (validatedInput.mode === 'place' && validatedInput.q) {
		queryStr = `&q=${encodeURIComponent(validatedInput.q)}`;
	} else if (validatedInput.mode === 'directions') {
		if (validatedInput.origin)
			queryStr += `&origin=${encodeURIComponent(validatedInput.origin)}`;
		if (validatedInput.destination)
			queryStr += `&destination=${encodeURIComponent(validatedInput.destination)}`;
	} else if (validatedInput.q) {
		queryStr = `&q=${encodeURIComponent(validatedInput.q)}`;
	}

	const embedUrl = `https://www.google.com/maps/embed/v1/${validatedInput.mode}?mode=${validatedInput.mode}${queryStr}${keyParam}`;
	const iframeHtml = `<iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen src="${embedUrl}"></iframe>`;

	const response = EmbedMapResponseSchema.parse({
		embedUrl,
		iframeHtml,
	});

	await logEventFromContext(
		ctx,
		'googlemaps.tiles.embedMap',
		validatedInput,
		'completed',
	);

	return response;
};

import { logEventFromContext } from 'corsair/core';
import { TURSO_REGION_BASE, tursoFetchJson } from '../client';
import type { TursoEndpoints } from '../index';
import { ClosestRegionInputSchema, ClosestRegionResponseSchema } from './types';

/**
 * Reports the Turso edge location closest to the caller.
 *
 * API: GET https://region.turso.io
 * Docs: https://docs.turso.tech/api-reference/locations/closest-region
 *
 * The service is unauthenticated: it answers from whichever edge location
 * received the request, so no credential is sent.
 *
 * @param ctx - Corsair plugin context.
 * @param rawInput - No parameters; validated for shape only.
 * @returns The server and client location codes.
 */
export const closest: TursoEndpoints['closestRegion'] = async (
	ctx,
	rawInput,
) => {
	ClosestRegionInputSchema.parse(rawInput ?? {});

	const raw = await tursoFetchJson(TURSO_REGION_BASE);
	const response = ClosestRegionResponseSchema.parse(raw);

	await logEventFromContext(ctx, 'turso.regions.closest', {}, 'completed');

	return response;
};

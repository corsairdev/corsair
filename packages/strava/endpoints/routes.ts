import type { StravaEndpoints } from '..';
import { makeStravaRequest } from '../client';
import type { StravaEndpointOutputs } from './types';

export const get: StravaEndpoints['routesGet'] = async (ctx, input) => {
	const result = await makeStravaRequest<StravaEndpointOutputs['routesGet']>(
		`routes/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.id && ctx.db.routes) {
		try {
			await ctx.db.routes.upsertByEntityId(String(result.id), { ...result });
		} catch (error) {
			console.warn('Failed to save route to database:', error);
		}
	}

	return result;
};

export const getStreams: StravaEndpoints['routesGetStreams'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['routesGetStreams']
	>(`routes/${input.id}/streams`, ctx.key, {
		method: 'GET',
	});

	return result;
};

export const exportGpx: StravaEndpoints['routesExportGpx'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['routesExportGpx']
	>(`routes/${input.id}/export_gpx`, ctx.key, {
		method: 'GET',
	});

	return result;
};

export const exportTcx: StravaEndpoints['routesExportTcx'] = async (
	ctx,
	input,
) => {
	const result = await makeStravaRequest<
		StravaEndpointOutputs['routesExportTcx']
	>(`routes/${input.id}/export_tcx`, ctx.key, {
		method: 'GET',
	});

	return result;
};

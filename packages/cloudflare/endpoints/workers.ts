import { logEventFromContext } from 'corsair/core';
import { makeCloudflareRequest } from '../client';
import type { CloudflareEndpoints } from '../index';
import {
	deleteWorkerRoute,
	deleteWorkerScript,
	persistWorkerRoute,
	persistWorkerScript,
} from '../persist';
import type { CloudflareEndpointOutputs } from './types';

export const list: CloudflareEndpoints['workersList'] = async (ctx, input) => {
	const { account_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workersList']
	>(`/accounts/${account_id}/workers/scripts`, ctx.key, { method: 'GET' });

	if (ctx.db.workerScripts) {
		for (const script of result) {
			await persistWorkerScript(script, account_id, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflare.workers.scripts.list',
		{ account_id },
		'completed',
	);
	return result;
};

/** Returns raw script source; not persisted locally (use list/upload metadata). */
export const get: CloudflareEndpoints['workersGet'] = async (ctx, input) => {
	const { account_id, script_name } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workersGet']
	>(`/accounts/${account_id}/workers/scripts/${script_name}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'cloudflare.workers.scripts.get',
		{ account_id, script_name },
		'completed',
	);
	return result;
};

export const upload: CloudflareEndpoints['workersUpload'] = async (
	ctx,
	input,
) => {
	const {
		account_id,
		script_name,
		script_content,
		bindings,
		compatibility_date,
	} = input;

	const path = `/accounts/${account_id}/workers/scripts/${script_name}`;
	const hasMetadata = bindings != null || compatibility_date != null;

	const result = hasMetadata
		? await makeCloudflareRequest<CloudflareEndpointOutputs['workersUpload']>(
				path,
				ctx.key,
				{
					method: 'PUT',
					formData: {
						metadata: JSON.stringify({
							...(bindings != null ? { bindings } : {}),
							...(compatibility_date != null ? { compatibility_date } : {}),
						}),
						script: script_content,
					},
				},
			)
		: await makeCloudflareRequest<CloudflareEndpointOutputs['workersUpload']>(
				path,
				ctx.key,
				{
					method: 'PUT',
					rawBody: script_content,
					mediaType: 'application/javascript',
				},
			);

	await persistWorkerScript(
		{ ...result, id: result.id ?? script_name },
		account_id,
		ctx.db,
	);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.scripts.upload',
		{ account_id, script_name },
		'completed',
	);
	return result;
};

export const deleteWorker: CloudflareEndpoints['workersDelete'] = async (
	ctx,
	input,
) => {
	const { account_id, script_name } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workersDelete']
	>(`/accounts/${account_id}/workers/scripts/${script_name}`, ctx.key, {
		method: 'DELETE',
	});

	await deleteWorkerScript(script_name, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.scripts.delete',
		{ account_id, script_name },
		'completed',
	);
	return result;
};

export const routesList: CloudflareEndpoints['workerRoutesList'] = async (
	ctx,
	input,
) => {
	const { zone_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workerRoutesList']
	>(`/zones/${zone_id}/workers/routes`, ctx.key, { method: 'GET' });

	if (ctx.db.workerRoutes) {
		for (const route of result) {
			await persistWorkerRoute(route, zone_id, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflare.workers.routes.list',
		{ zone_id },
		'completed',
	);
	return result;
};

export const routesGet: CloudflareEndpoints['workerRoutesGet'] = async (
	ctx,
	input,
) => {
	const { zone_id, route_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workerRoutesGet']
	>(`/zones/${zone_id}/workers/routes/${route_id}`, ctx.key, { method: 'GET' });

	await persistWorkerRoute(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.routes.get',
		{ zone_id, route_id },
		'completed',
	);
	return result;
};

export const routesCreate: CloudflareEndpoints['workerRoutesCreate'] = async (
	ctx,
	input,
) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workerRoutesCreate']
	>(`/zones/${zone_id}/workers/routes`, ctx.key, { method: 'POST', body });

	await persistWorkerRoute(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.routes.create',
		{ zone_id },
		'completed',
	);
	return result;
};

export const routesEdit: CloudflareEndpoints['workerRoutesEdit'] = async (
	ctx,
	input,
) => {
	const { zone_id, route_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workerRoutesEdit']
	>(`/zones/${zone_id}/workers/routes/${route_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await persistWorkerRoute(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.routes.edit',
		{ zone_id, route_id },
		'completed',
	);
	return result;
};

export const routesDelete: CloudflareEndpoints['workerRoutesDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id, route_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['workerRoutesDelete']
	>(`/zones/${zone_id}/workers/routes/${route_id}`, ctx.key, {
		method: 'DELETE',
	});

	await deleteWorkerRoute(route_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.workers.routes.delete',
		{ zone_id, route_id },
		'completed',
	);
	return result;
};

import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listDatasources: KlipfolioEndpoints['listDatasources'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listDatasources']
	>(ctx, '/datasources', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.listDatasources',
		input,
		'completed',
	);
	return response;
};

export const retrieveDatasource: KlipfolioEndpoints['retrieveDatasource'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasource']
		>(ctx, klipfolioPathParameter('/datasources/{id}', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasource',
			input,
			'completed',
		);
		return response;
	};

export const createDatasource: KlipfolioEndpoints['createDatasource'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createDatasource']
	>(ctx, '/datasources', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.createDatasource',
		input,
		'completed',
	);
	return response;
};

export const updateDatasource: KlipfolioEndpoints['updateDatasource'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateDatasource']
	>(ctx, klipfolioPathParameter('/datasources/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.updateDatasource',
		input,
		'completed',
	);
	return response;
};

export const deleteDatasource: KlipfolioEndpoints['deleteDatasource'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteDatasource']
	>(ctx, klipfolioPathParameter('/datasources/{id}', 'id', input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.deleteDatasource',
		input,
		'completed',
	);
	return response;
};

export const enableDatasource: KlipfolioEndpoints['enableDatasource'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['enableDatasource']
	>(ctx, klipfolioPathParameter('/datasources/{id}/@/enable', 'id', input.id), {
		method: 'POST',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.enableDatasource',
		input,
		'completed',
	);
	return response;
};

export const disableDatasource: KlipfolioEndpoints['disableDatasource'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['disableDatasource']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/@/disable', 'id', input.id),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.disableDatasource',
			input,
			'completed',
		);
		return response;
	};

export const importDatasource: KlipfolioEndpoints['importDatasource'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['importDatasource']
	>(ctx, klipfolioPathParameter('/datasources/{id}/@/import', 'id', input.id), {
		method: 'POST',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.datasources.importDatasource',
		input,
		'completed',
	);
	return response;
};

export const deleteInstancesDatasource: KlipfolioEndpoints['deleteInstancesDatasource'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteInstancesDatasource']
		>(
			ctx,
			klipfolioPathParameter(
				'/datasources/{id}/@/delete_instances',
				'id',
				input.id,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.deleteInstancesDatasource',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDatasourceProperties: KlipfolioEndpoints['retrieveDatasourceProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasourceProperties']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/properties', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasourceProperties',
			input,
			'completed',
		);
		return response;
	};

export const updateDatasourceProperties: KlipfolioEndpoints['updateDatasourceProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateDatasourceProperties']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/properties', 'id', input.id),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.updateDatasourceProperties',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatasourceProperties: KlipfolioEndpoints['deleteDatasourceProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteDatasourceProperties']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/properties', 'id', input.id),
			// The provider reads the property name (and client scoping) from the
			// query string.
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.deleteDatasourceProperties',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDatasourceShareRights: KlipfolioEndpoints['retrieveDatasourceShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasourceShareRights']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/share-rights', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasourceShareRights',
			input,
			'completed',
		);
		return response;
	};

export const setDatasourceShareRights: KlipfolioEndpoints['setDatasourceShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['setDatasourceShareRights']
		>(
			ctx,
			klipfolioPathParameter('/datasources/{id}/share-rights', 'id', input.id),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.setDatasourceShareRights',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatasourceShareRight: KlipfolioEndpoints['deleteDatasourceShareRight'] =
	async (ctx, input) => {
		const { id, groupId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteDatasourceShareRight']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/datasources/{id}/share-rights/{group-id}',
					'id',
					input.id,
				),
				'group-id',
				input.groupId,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.deleteDatasourceShareRight',
			input,
			'completed',
		);
		return response;
	};

export const listDatasourceInstances: KlipfolioEndpoints['listDatasourceInstances'] =
	async (ctx, input) => {
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['listDatasourceInstances']
		>(ctx, '/datasource-instances', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.listDatasourceInstances',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDatasourceInstances: KlipfolioEndpoints['retrieveDatasourceInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasourceInstances']
		>(
			ctx,
			klipfolioPathParameter('/datasource-instances/{id}', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasourceInstances',
			input,
			'completed',
		);
		return response;
	};

export const createDatasourceInstances: KlipfolioEndpoints['createDatasourceInstances'] =
	async (ctx, input) => {
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['createDatasourceInstances']
		>(ctx, '/datasource-instances', { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.createDatasourceInstances',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatasourceInstances: KlipfolioEndpoints['deleteDatasourceInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteDatasourceInstances']
		>(
			ctx,
			klipfolioPathParameter('/datasource-instances/{id}', 'id', input.id),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.deleteDatasourceInstances',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDatasourceInstancesData: KlipfolioEndpoints['retrieveDatasourceInstancesData'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasourceInstancesData']
		>(
			ctx,
			klipfolioPathParameter('/datasource-instances/{id}/data', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasourceInstancesData',
			input,
			'completed',
		);
		return response;
	};

export const updateDatasourceInstancesData: KlipfolioEndpoints['updateDatasourceInstancesData'] =
	async (ctx, input) => {
		const { id, client_id, rawContent: rawData, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateDatasourceInstancesData']
		>(
			ctx,
			klipfolioPathParameter('/datasource-instances/{id}/data', 'id', input.id),
			{
				method: 'PUT',
				// The provider takes the raw data (or file contents) as the
				// request body itself, not wrapped in a JSON object; client_id
				// scopes the update from the query string.
				body: rawData,
				mediaType: 'text/plain; charset=utf-8',
				query: { ...rest, client_id },
			},
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.updateDatasourceInstancesData',
			input,
			'completed',
		);
		return response;
	};

export const refreshDatasourceInstances: KlipfolioEndpoints['refreshDatasourceInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['refreshDatasourceInstances']
		>(
			ctx,
			klipfolioPathParameter(
				'/datasource-instances/{id}/@/refresh',
				'id',
				input.id,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.refreshDatasourceInstances',
			input,
			'completed',
		);
		return response;
	};

export const refreshDatasource: KlipfolioEndpoints['refreshDatasource'] =
	async (ctx, input) => {
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['refreshDatasource']
		>(ctx, '/datasources/@/refresh', { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.refreshDatasource',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDatasourceInstancesProperties: KlipfolioEndpoints['retrieveDatasourceInstancesProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveDatasourceInstancesProperties']
		>(
			ctx,
			klipfolioPathParameter(
				'/datasource-instances/{id}/properties',
				'id',
				input.id,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.retrieveDatasourceInstancesProperties',
			input,
			'completed',
		);
		return response;
	};

export const updateDatasourceInstancesProperties: KlipfolioEndpoints['updateDatasourceInstancesProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateDatasourceInstancesProperties']
		>(
			ctx,
			klipfolioPathParameter(
				'/datasource-instances/{id}/properties',
				'id',
				input.id,
			),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.updateDatasourceInstancesProperties',
			input,
			'completed',
		);
		return response;
	};

export const deleteDatasourceInstancesProperties: KlipfolioEndpoints['deleteDatasourceInstancesProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteDatasourceInstancesProperties']
		>(
			ctx,
			klipfolioPathParameter(
				'/datasource-instances/{id}/properties',
				'id',
				input.id,
			),
			// The provider reads the property name (and client scoping) from the
			// query string.
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.datasources.deleteDatasourceInstancesProperties',
			input,
			'completed',
		);
		return response;
	};

import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listTabs: KlipfolioEndpoints['listTabs'] = async (ctx, input) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listTabs']
	>(ctx, '/tabs', { method: 'GET', query: input });
	await logEventFromContext(ctx, 'klipfolio.tabs.listTabs', input, 'completed');
	return response;
};

export const retrieveTab: KlipfolioEndpoints['retrieveTab'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveTab']
	>(ctx, klipfolioPathParameter('/tabs/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.retrieveTab',
		input,
		'completed',
	);
	return response;
};

export const createTab: KlipfolioEndpoints['createTab'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createTab']
	>(ctx, '/tabs', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.createTab',
		input,
		'completed',
	);
	return response;
};

export const updateTab: KlipfolioEndpoints['updateTab'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateTab']
	>(ctx, klipfolioPathParameter('/tabs/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.updateTab',
		input,
		'completed',
	);
	return response;
};

export const deleteTab: KlipfolioEndpoints['deleteTab'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteTab']
	>(ctx, klipfolioPathParameter('/tabs/{id}', 'id', input.id), {
		method: 'DELETE',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.deleteTab',
		input,
		'completed',
	);
	return response;
};

export const retrieveTabKlipInstances: KlipfolioEndpoints['retrieveTabKlipInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveTabKlipInstances']
		>(
			ctx,
			klipfolioPathParameter('/tabs/{id}/klip-instances', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.retrieveTabKlipInstances',
			input,
			'completed',
		);
		return response;
	};

export const updateTabKlipInstances: KlipfolioEndpoints['updateTabKlipInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateTabKlipInstances']
		>(
			ctx,
			klipfolioPathParameter('/tabs/{id}/klip-instances', 'id', input.id),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.updateTabKlipInstances',
			input,
			'completed',
		);
		return response;
	};

export const deleteTabKlipInstance: KlipfolioEndpoints['deleteTabKlipInstance'] =
	async (ctx, input) => {
		const { id, klipInstanceId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteTabKlipInstance']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/tabs/{id}/klip-instances/{klip_instance_id}',
					'id',
					input.id,
				),
				'klip_instance_id',
				input.klipInstanceId,
			),
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.deleteTabKlipInstance',
			input,
			'completed',
		);
		return response;
	};

export const retrieveTabLayout: KlipfolioEndpoints['retrieveTabLayout'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveTabLayout']
		>(ctx, klipfolioPathParameter('/tabs/{id}/layout', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.retrieveTabLayout',
			input,
			'completed',
		);
		return response;
	};

export const updateTabLayout: KlipfolioEndpoints['updateTabLayout'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateTabLayout']
	>(ctx, klipfolioPathParameter('/tabs/{id}/layout', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.updateTabLayout',
		input,
		'completed',
	);
	return response;
};

export const retrieveTabShareRights: KlipfolioEndpoints['retrieveTabShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveTabShareRights']
		>(ctx, klipfolioPathParameter('/tabs/{id}/share-rights', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.retrieveTabShareRights',
			input,
			'completed',
		);
		return response;
	};

export const setTabShareRights: KlipfolioEndpoints['setTabShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['setTabShareRights']
		>(ctx, klipfolioPathParameter('/tabs/{id}/share-rights', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.setTabShareRights',
			input,
			'completed',
		);
		return response;
	};

export const deleteTabShareRight: KlipfolioEndpoints['deleteTabShareRight'] =
	async (ctx, input) => {
		const { id, groupId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteTabShareRight']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/tabs/{id}/share-rights/{group-id}',
					'id',
					input.id,
				),
				'group-id',
				input.groupId,
			),
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.tabs.deleteTabShareRight',
			input,
			'completed',
		);
		return response;
	};

export const importTab: KlipfolioEndpoints['importTab'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['importTab']
	>(ctx, klipfolioPathParameter('/tabs/{id}/@/import', 'id', input.id), {
		method: 'POST',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.tabs.importTab',
		input,
		'completed',
	);
	return response;
};

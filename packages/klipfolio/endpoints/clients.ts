import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listClients: KlipfolioEndpoints['listClients'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listClients']
	>(ctx, '/clients', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.clients.listClients',
		input,
		'completed',
	);
	return response;
};

export const retrieveClient: KlipfolioEndpoints['retrieveClient'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveClient']
	>(ctx, klipfolioPathParameter('/clients/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.clients.retrieveClient',
		input,
		'completed',
	);
	return response;
};

export const createClient: KlipfolioEndpoints['createClient'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createClient']
	>(ctx, '/clients', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.clients.createClient',
		input,
		'completed',
	);
	return response;
};

export const updateClient: KlipfolioEndpoints['updateClient'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateClient']
	>(ctx, klipfolioPathParameter('/clients/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.clients.updateClient',
		input,
		'completed',
	);
	return response;
};

export const deleteClient: KlipfolioEndpoints['deleteClient'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteClient']
	>(ctx, klipfolioPathParameter('/clients/{id}', 'id', input.id), {
		method: 'DELETE',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.clients.deleteClient',
		input,
		'completed',
	);
	return response;
};

export const enableDirectBillingClient: KlipfolioEndpoints['enableDirectBillingClient'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['enableDirectBillingClient']
		>(
			ctx,
			klipfolioPathParameter(
				'/clients/{id}/@/enable_direct_billing',
				'id',
				input.id,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.clients.enableDirectBillingClient',
			input,
			'completed',
		);
		return response;
	};

export const extendTrialClient: KlipfolioEndpoints['extendTrialClient'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['extendTrialClient']
		>(
			ctx,
			klipfolioPathParameter('/clients/{id}/@/extend_trial', 'id', input.id),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.clients.extendTrialClient',
			input,
			'completed',
		);
		return response;
	};

export const retrieveClientFeatures: KlipfolioEndpoints['retrieveClientFeatures'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveClientFeatures']
		>(ctx, klipfolioPathParameter('/clients/{id}/features', 'id', input.id), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.retrieveClientFeatures',
			input,
			'completed',
		);
		return response;
	};

export const updateClientFeatures: KlipfolioEndpoints['updateClientFeatures'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateClientFeatures']
		>(ctx, klipfolioPathParameter('/clients/{id}/features', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.updateClientFeatures',
			input,
			'completed',
		);
		return response;
	};

export const retrieveClientProperties: KlipfolioEndpoints['retrieveClientProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveClientProperties']
		>(ctx, klipfolioPathParameter('/clients/{id}/properties', 'id', input.id), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.retrieveClientProperties',
			input,
			'completed',
		);
		return response;
	};

export const updateClientProperties: KlipfolioEndpoints['updateClientProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateClientProperties']
		>(ctx, klipfolioPathParameter('/clients/{id}/properties', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.updateClientProperties',
			input,
			'completed',
		);
		return response;
	};

export const deleteClientProperties: KlipfolioEndpoints['deleteClientProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteClientProperties']
		>(ctx, klipfolioPathParameter('/clients/{id}/properties', 'id', input.id), {
			method: 'DELETE',
			// The provider reads the property to remove from the query string.
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.deleteClientProperties',
			input,
			'completed',
		);
		return response;
	};

export const retrieveClientResources: KlipfolioEndpoints['retrieveClientResources'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveClientResources']
		>(ctx, klipfolioPathParameter('/clients/{id}/resources', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.retrieveClientResources',
			input,
			'completed',
		);
		return response;
	};

export const updateClientResources: KlipfolioEndpoints['updateClientResources'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateClientResources']
		>(ctx, klipfolioPathParameter('/clients/{id}/resources', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.updateClientResources',
			input,
			'completed',
		);
		return response;
	};

export const retrieveClientSettings: KlipfolioEndpoints['retrieveClientSettings'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveClientSettings']
		>(ctx, klipfolioPathParameter('/clients/{id}/settings', 'id', input.id), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.retrieveClientSettings',
			input,
			'completed',
		);
		return response;
	};

export const createClientSettings: KlipfolioEndpoints['createClientSettings'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['createClientSettings']
		>(ctx, klipfolioPathParameter('/clients/{id}/settings', 'id', input.id), {
			method: 'POST',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.clients.createClientSettings',
			input,
			'completed',
		);
		return response;
	};

export const retrieveClientShareRights: KlipfolioEndpoints['retrieveClientShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveClientShareRights']
		>(
			ctx,
			klipfolioPathParameter('/clients/{id}/share-rights', 'id', input.id),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.clients.retrieveClientShareRights',
			input,
			'completed',
		);
		return response;
	};

export const setClientShareRights: KlipfolioEndpoints['setClientShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['setClientShareRights']
		>(
			ctx,
			klipfolioPathParameter('/clients/{id}/share-rights', 'id', input.id),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.clients.setClientShareRights',
			input,
			'completed',
		);
		return response;
	};

export const deleteClientShareRight: KlipfolioEndpoints['deleteClientShareRight'] =
	async (ctx, input) => {
		const { id, groupId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteClientShareRight']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/clients/{id}/share-rights/{group-id}',
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
			'klipfolio.clients.deleteClientShareRight',
			input,
			'completed',
		);
		return response;
	};

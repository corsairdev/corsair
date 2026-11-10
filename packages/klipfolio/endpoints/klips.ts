import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listKlips: KlipfolioEndpoints['listKlips'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listKlips']
	>(ctx, '/klips', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.klips.listKlips',
		input,
		'completed',
	);
	return response;
};

export const retrieveKlip: KlipfolioEndpoints['retrieveKlip'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveKlip']
	>(ctx, klipfolioPathParameter('/klips/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.klips.retrieveKlip',
		input,
		'completed',
	);
	return response;
};

export const retrieveKlipClientInstances: KlipfolioEndpoints['retrieveKlipClientInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveKlipClientInstances']
		>(
			ctx,
			klipfolioPathParameter('/klips/{id}/client-instances', 'id', input.id),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.klips.retrieveKlipClientInstances',
			input,
			'completed',
		);
		return response;
	};

export const createKlip: KlipfolioEndpoints['createKlip'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createKlip']
	>(ctx, '/klips', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.klips.createKlip',
		input,
		'completed',
	);
	return response;
};

export const updateKlip: KlipfolioEndpoints['updateKlip'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateKlip']
	>(ctx, klipfolioPathParameter('/klips/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.klips.updateKlip',
		input,
		'completed',
	);
	return response;
};

export const deleteKlip: KlipfolioEndpoints['deleteKlip'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteKlip']
	>(ctx, klipfolioPathParameter('/klips/{id}', 'id', input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'klipfolio.klips.deleteKlip',
		input,
		'completed',
	);
	return response;
};

export const retrieveKlipAnnotations: KlipfolioEndpoints['retrieveKlipAnnotations'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveKlipAnnotations']
		>(ctx, klipfolioPathParameter('/klips/{id}/annotations', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.retrieveKlipAnnotations',
			input,
			'completed',
		);
		return response;
	};

export const retrieveKlipAnnotation: KlipfolioEndpoints['retrieveKlipAnnotation'] =
	async (ctx, input) => {
		const { id, annotationId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveKlipAnnotation']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/klips/{id}/annotations/{annotation_id}',
					'id',
					input.id,
				),
				'annotation_id',
				input.annotationId,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.klips.retrieveKlipAnnotation',
			input,
			'completed',
		);
		return response;
	};

export const createKlipAnnotations: KlipfolioEndpoints['createKlipAnnotations'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['createKlipAnnotations']
		>(ctx, klipfolioPathParameter('/klips/{id}/annotations', 'id', input.id), {
			method: 'POST',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.createKlipAnnotations',
			input,
			'completed',
		);
		return response;
	};

export const updateKlipAnnotation: KlipfolioEndpoints['updateKlipAnnotation'] =
	async (ctx, input) => {
		const { id, annotationId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateKlipAnnotation']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/klips/{id}/annotations/{annotation_id}',
					'id',
					input.id,
				),
				'annotation_id',
				input.annotationId,
			),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.klips.updateKlipAnnotation',
			input,
			'completed',
		);
		return response;
	};

export const deleteKlipAnnotation: KlipfolioEndpoints['deleteKlipAnnotation'] =
	async (ctx, input) => {
		const { id, annotationId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteKlipAnnotation']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/klips/{id}/annotations/{annotation_id}',
					'id',
					input.id,
				),
				'annotation_id',
				input.annotationId,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.klips.deleteKlipAnnotation',
			input,
			'completed',
		);
		return response;
	};

export const updateFromParentKlip: KlipfolioEndpoints['updateFromParentKlip'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateFromParentKlip']
		>(
			ctx,
			klipfolioPathParameter(
				'/klips/{id}/@/update_from_parent',
				'id',
				input.id,
			),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.klips.updateFromParentKlip',
			input,
			'completed',
		);
		return response;
	};

export const retrieveKlipSchema: KlipfolioEndpoints['retrieveKlipSchema'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveKlipSchema']
		>(ctx, klipfolioPathParameter('/klips/{id}/schema', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.retrieveKlipSchema',
			input,
			'completed',
		);
		return response;
	};

export const updateKlipSchema: KlipfolioEndpoints['updateKlipSchema'] = async (
	ctx,
	input,
) => {
	const { id, wire_id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateKlipSchema']
	>(ctx, klipfolioPathParameter('/klips/{id}/schema', 'id', input.id), {
		method: 'PUT',
		body: { ...rest, id: input.wire_id },
	});
	await logEventFromContext(
		ctx,
		'klipfolio.klips.updateKlipSchema',
		input,
		'completed',
	);
	return response;
};

export const retrieveKlipShareRights: KlipfolioEndpoints['retrieveKlipShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveKlipShareRights']
		>(ctx, klipfolioPathParameter('/klips/{id}/share-rights', 'id', input.id), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.retrieveKlipShareRights',
			input,
			'completed',
		);
		return response;
	};

export const setKlipShareRights: KlipfolioEndpoints['setKlipShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['setKlipShareRights']
		>(ctx, klipfolioPathParameter('/klips/{id}/share-rights', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.setKlipShareRights',
			input,
			'completed',
		);
		return response;
	};

export const deleteKlipShareRights: KlipfolioEndpoints['deleteKlipShareRights'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteKlipShareRights']
		>(ctx, klipfolioPathParameter('/klips/{id}/share-rights', 'id', input.id), {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.klips.deleteKlipShareRights',
			input,
			'completed',
		);
		return response;
	};

export const importKlip: KlipfolioEndpoints['importKlip'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['importKlip']
	>(ctx, klipfolioPathParameter('/klips/{id}/@/import', 'id', input.id), {
		method: 'POST',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.klips.importKlip',
		input,
		'completed',
	);
	return response;
};

import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withRequisitionFieldPath = (
	requisitionFieldId: string,
	suffix = '',
): string => {
	let path = leverPathParameter(
		'/requisition_fields/{requisitionFieldId}',
		'requisitionFieldId',
		requisitionFieldId,
	);
	if (suffix) path += suffix;
	return path;
};

export const listRequisitionFields: LeverEndpoints['listRequisitionFields'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listRequisitionFields']
		>(ctx, '/requisition_fields', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.list',
			input,
			'completed',
		);
		return response;
	};

export const retrieveRequisitionField: LeverEndpoints['retrieveRequisitionField'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveRequisitionField']
		>(ctx, withRequisitionFieldPath(input.requisitionFieldId), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const createRequisitionField: LeverEndpoints['createRequisitionField'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['createRequisitionField']
		>(ctx, '/requisition_fields', { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.create',
			input,
			'completed',
		);
		return response;
	};

export const updateRequisitionField: LeverEndpoints['updateRequisitionField'] =
	async (ctx, input) => {
		const { requisitionFieldId, ...body } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['updateRequisitionField']
		>(ctx, withRequisitionFieldPath(requisitionFieldId), {
			method: 'PUT',
			body,
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.update',
			input,
			'completed',
		);
		return response;
	};

export const deleteRequisitionField: LeverEndpoints['deleteRequisitionField'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['deleteRequisitionField']
		>(ctx, withRequisitionFieldPath(input.requisitionFieldId), {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.delete',
			input,
			'completed',
		);
		return response;
	};

// Lever carries JSON bodies on option deletion, which the shared transport
// forwards for non-GET methods.
export const addRequisitionFieldOptions: LeverEndpoints['addRequisitionFieldOptions'] =
	async (ctx, input) => {
		const { requisitionFieldId, values } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['addRequisitionFieldOptions']
		>(ctx, withRequisitionFieldPath(requisitionFieldId, '/options'), {
			method: 'POST',
			body: { values },
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.addOptions',
			input,
			'completed',
		);
		return response;
	};

export const replaceRequisitionFieldOptions: LeverEndpoints['replaceRequisitionFieldOptions'] =
	async (ctx, input) => {
		const { requisitionFieldId, values } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['replaceRequisitionFieldOptions']
		>(ctx, withRequisitionFieldPath(requisitionFieldId, '/options'), {
			method: 'PUT',
			body: { values },
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.replaceOptions',
			input,
			'completed',
		);
		return response;
	};

export const deleteRequisitionFieldOptions: LeverEndpoints['deleteRequisitionFieldOptions'] =
	async (ctx, input) => {
		const { requisitionFieldId, values } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['deleteRequisitionFieldOptions']
		>(ctx, withRequisitionFieldPath(requisitionFieldId, '/options'), {
			method: 'DELETE',
			body: { values },
		});
		await logEventFromContext(
			ctx,
			'lever.requisitionFields.deleteOptions',
			input,
			'completed',
		);
		return response;
	};

import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listCustomFieldTypes: SalesflareEndpoints['listCustomFieldTypes'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listCustomFieldTypes']
		>(ctx, '/customfields/types', { method: 'GET' });
		await logEventFromContext(
			ctx,
			'salesflare.customfields.listCustomFieldTypes',
			input,
			'completed',
		);
		return response;
	};

export const listCustomFields: SalesflareEndpoints['listCustomFields'] = async (
	ctx,
	input,
) => {
	const { itemClass, ...query } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listCustomFields']
	>(
		ctx,
		salesflarePathParameter(
			'/customfields/{itemClass}',
			'itemClass',
			input.itemClass,
		),
		{ method: 'GET', query: query },
	);
	await logEventFromContext(
		ctx,
		'salesflare.customfields.listCustomFields',
		input,
		'completed',
	);
	return response;
};

export const createCustomFieldSub: SalesflareEndpoints['createCustomFieldSub'] =
	async (ctx, input) => {
		const { itemClass, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['createCustomFieldSub']
		>(
			ctx,
			salesflarePathParameter(
				'/customfields/{itemClass}',
				'itemClass',
				input.itemClass,
			),
			{ method: 'POST', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.customfields.createCustomFieldSub',
			input,
			'completed',
		);
		return response;
	};

export const retrieveCustomField: SalesflareEndpoints['retrieveCustomField'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['retrieveCustomField']
		>(
			ctx,
			salesflarePathParameter(
				salesflarePathParameter(
					'/customfields/{itemClass}/{id}',
					'itemClass',
					input.itemClass,
				),
				'id',
				input.id,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'salesflare.customfields.retrieveCustomField',
			input,
			'completed',
		);
		return response;
	};

export const updateCustomField: SalesflareEndpoints['updateCustomField'] =
	async (ctx, input) => {
		const { itemClass, id, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateCustomField']
		>(
			ctx,
			salesflarePathParameter(
				salesflarePathParameter(
					'/customfields/{itemClass}/{id}',
					'itemClass',
					input.itemClass,
				),
				'id',
				input.id,
			),
			// The provider requires the id in the body as well as the path
			// (400 '"id" is required' without it).
			{ method: 'PUT', body: { id: Number(id), ...body } },
		);
		await logEventFromContext(
			ctx,
			'salesflare.customfields.updateCustomField',
			input,
			'completed',
		);
		return response;
	};

export const deleteCustomField: SalesflareEndpoints['deleteCustomField'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['deleteCustomField']
		>(
			ctx,
			salesflarePathParameter(
				salesflarePathParameter(
					'/customfields/{itemClass}/{id}',
					'itemClass',
					input.itemClass,
				),
				'id',
				input.id,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'salesflare.customfields.deleteCustomField',
			input,
			'completed',
		);
		return response;
	};

export const listCustomFieldOptions: SalesflareEndpoints['listCustomFieldOptions'] =
	async (ctx, input) => {
		const { itemClass, customFieldApiField, ...query } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listCustomFieldOptions']
		>(
			ctx,
			salesflarePathParameter(
				salesflarePathParameter(
					'/customfields/{itemClass}/{customFieldApiField}/options',
					'itemClass',
					input.itemClass,
				),
				'customFieldApiField',
				input.customFieldApiField,
			),
			{ method: 'GET', query: query },
		);
		await logEventFromContext(
			ctx,
			'salesflare.customfields.listCustomFieldOptions',
			input,
			'completed',
		);
		return response;
	};

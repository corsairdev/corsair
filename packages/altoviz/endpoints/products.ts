import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProduct, evictEntity } from './persist';
import {
	compactBody,
	resolveProductFamilyRef,
	resolveUnitRef,
	resolveVatRef,
} from './shared';
import type { AltovizEndpointOutputs } from './types';

export const create: AltovizEndpoints['products']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({
		name: input.name,
		number: input.number,
		description: input.description,
		type: input.type,
		unitPrice: input.unitPrice,
		purchasePrice: input.purchasePrice,
		isUnitPriceTaxIncluded: input.isUnitPriceTaxIncluded,
		defaultQuantity: input.defaultQuantity,
		// { id } is silently ignored for unit/family and a 400 for vat -
		// resolve every nested reference to its value form first.
		unit: await resolveUnitRef(ctx.db.units, ctx.key, input.unitId),
		vat: await resolveVatRef(ctx.db.vats, ctx.key, input.vatId),
		family: await resolveProductFamilyRef(
			ctx.db.productFamilies,
			ctx.key,
			input.familyId,
		),
		internalId: input.internalId,
		internalNotes: input.internalNotes,
		active: input.active,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productsCreate']
	>('v1/products', ctx.key, { method: 'POST', body });

	await cacheProduct(ctx.db.products, result);

	await logEventFromContext(
		ctx,
		'altoviz.products.create',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const remove: AltovizEndpoints['products']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>(`v1/products/{id}`, ctx.key, {
		method: 'DELETE',
		path: { id: input.productId },
	});

	await evictEntity(ctx.db.products, input.productId, 'product');

	await logEventFromContext(
		ctx,
		'altoviz.products.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.productId };
};

export const get: AltovizEndpoints['products']['get'] = async (ctx, input) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productsGet']
	>(`v1/products/{id}`, ctx.key, { path: { id: input.productId } });

	await cacheProduct(ctx.db.products, result);

	await logEventFromContext(
		ctx,
		'altoviz.products.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Same route as FIND_PRODUCT_BY_NUMBER_OR_ID (`GET /v1/products/find`) - two catalog rows, one endpoint. Returns an array. */
export const find: AltovizEndpoints['products']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['productsFind']
	>('v1/products/find', ctx.key, { query: { number: input.number } });

	for (const product of result) await cacheProduct(ctx.db.products, product);

	await logEventFromContext(
		ctx,
		'altoviz.products.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Superset of FIND_PRODUCT. With neither parameter the API 400s "Number or internal ID have to be defined" - enforced client-side by the input schema first. */
export const findByNumberOrId: AltovizEndpoints['products']['findByNumberOrId'] =
	async (ctx, input) => {
		const result = await makeAltovizRequest<
			AltovizEndpointOutputs['productsFindByNumberOrId']
		>('v1/products/find', ctx.key, {
			query: { number: input.number, internalId: input.internalId },
		});

		for (const product of result) await cacheProduct(ctx.db.products, product);

		await logEventFromContext(
			ctx,
			'altoviz.products.findByNumberOrId',
			auditPayload(input),
			'completed',
		);
		return result;
	};

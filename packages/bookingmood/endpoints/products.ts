import { logEventFromContext } from 'corsair/core';
import { makeBookingmoodRequest } from '../client';
import type { BookingmoodEndpoints } from '../index';
import type {
	ProductsCreateResponse,
	ProductsDeleteResponse,
	ProductsGetResponse,
	ProductsListResponse,
	ProductsUpdateResponse,
} from './types';

export const get: BookingmoodEndpoints['productsGet'] = async (ctx, input) => {
	const res = await makeBookingmoodRequest<
		ProductsGetResponse | ProductsListResponse
	>('products', ctx.key, {
		method: 'GET',
		query: { id: `eq.${input.id}`, select: '*' },
	});

	const product = Array.isArray(res) ? res[0] : res;
	if (product && ctx.db.products) {
		try {
			await ctx.db.products.upsertByEntityId(product.id, {
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				currency: product.currency,
				created_at: product.created_at ? new Date(product.created_at) : null,
				updated_at: product.updated_at ? new Date(product.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save product to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.products.get',
		{ ...input },
		'completed',
	);
	return product ?? { id: input.id };
};

export const list: BookingmoodEndpoints['productsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		select: '*',
	};
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;

	const res = await makeBookingmoodRequest<ProductsListResponse>(
		'products',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const products = Array.isArray(res) ? res : [];
	if (ctx.db.products) {
		try {
			for (const product of products) {
				await ctx.db.products.upsertByEntityId(product.id, {
					id: product.id,
					name: product.name,
					description: product.description,
					price: product.price,
					currency: product.currency,
					created_at: product.created_at ? new Date(product.created_at) : null,
					updated_at: product.updated_at ? new Date(product.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save products to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.products.list',
		{ ...input },
		'completed',
	);
	return products;
};

export const create: BookingmoodEndpoints['productsCreate'] = async (
	ctx,
	input,
) => {
	const res = await makeBookingmoodRequest<
		ProductsCreateResponse | ProductsCreateResponse[]
	>('products', ctx.key, {
		method: 'POST',
		body: input,
	});

	const created = Array.isArray(res) ? res[0]! : res;
	if (created && ctx.db.products) {
		try {
			await ctx.db.products.upsertByEntityId(created.id, {
				id: created.id,
				name: created.name,
				description: created.description,
				price: created.price,
				currency: created.currency,
				created_at: created.created_at ? new Date(created.created_at) : null,
				updated_at: created.updated_at ? new Date(created.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save created product to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.products.create',
		{ ...input },
		'completed',
	);
	return created;
};

export const update: BookingmoodEndpoints['productsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const res = await makeBookingmoodRequest<
		ProductsUpdateResponse | ProductsUpdateResponse[]
	>('products', ctx.key, {
		method: 'PATCH',
		query: { id: `eq.${id}` },
		body,
	});

	const updated = Array.isArray(res) ? res[0]! : (res ?? { id, ...body });
	if (updated && ctx.db.products) {
		try {
			await ctx.db.products.upsertByEntityId(updated.id, {
				id: updated.id,
				name: updated.name,
				description: updated.description,
				price: updated.price,
				currency: updated.currency,
				created_at: updated.created_at ? new Date(updated.created_at) : null,
				updated_at: updated.updated_at ? new Date(updated.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save updated product to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.products.update',
		{ ...input },
		'completed',
	);
	return updated;
};

export const deleteProduct: BookingmoodEndpoints['productsDelete'] = async (
	ctx,
	input,
) => {
	await makeBookingmoodRequest<ProductsDeleteResponse>('products', ctx.key, {
		method: 'DELETE',
		query: { id: `eq.${input.id}` },
	});

	if (ctx.db.products) {
		try {
			await ctx.db.products.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete product from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.products.delete',
		{ ...input },
		'completed',
	);
	return { success: true, id: input.id };
};

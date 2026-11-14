import type { ApiRequestOptions } from 'corsair/http';
import type { z } from 'zod';
import { makeModelryRequest } from '../client';
import type { ModelryContext } from '../index';
import * as t from './types';

type Schema = z.ZodType;
function endpoint<I extends Schema, O extends Schema>(
	input: I,
	output: O,
	build: (args: z.output<I>) => ApiRequestOptions,
) {
	return async (
		ctx: ModelryContext,
		args: z.input<I>,
	): Promise<z.output<O>> => {
		const parsed = input.parse(args);
		return output.parse(await makeModelryRequest(ctx.key, build(parsed)));
	};
}
const arrayQuery = (query: Record<string, unknown>): Record<string, unknown> =>
	Object.fromEntries(
		Object.entries(query).map(([key, value]) => [
			Array.isArray(value) ? `${key}[]` : key,
			value,
		]),
	);
const body = (value: unknown) =>
	({ body: value, mediaType: 'application/json' }) as const;
export const products_list = endpoint(t.products_listInput, t.list, (a) => ({
	method: 'GET',
	url: '/v1/products',
	query: arrayQuery(a),
}));
export const products_get = endpoint(t.products_getInput, t.single, (a) => ({
	method: 'GET',
	url: '/v1/products/{id}',
	path: { id: a.id },
}));
export const products_create = endpoint(
	t.products_createInput,
	t.single,
	(a) => ({ method: 'POST', url: '/v1/products', ...body(a) }),
);
export const products_update = endpoint(
	t.products_updateInput,
	t.single,
	(a) => ({
		method: 'PUT',
		url: '/v1/products/{id}',
		path: { id: a.id },
		...body({ product: a.product }),
	}),
);
export const products_delete = endpoint(
	t.products_deleteInput,
	t.empty,
	(a) => ({ method: 'DELETE', url: '/v1/products/{id}', path: { id: a.id } }),
);
export const modelingRequests_list = endpoint(
	t.modelingRequests_listInput,
	t.list,
	(a) => ({
		method: 'GET',
		url: '/v1/modeling-requests',
		query: arrayQuery(a),
	}),
);
export const modelingRequests_get = endpoint(
	t.modelingRequests_getInput,
	t.single,
	(a) => ({ method: 'GET', url: '/v1/modeling-requests/{id_or_sku}', path: a }),
);
export const modelingRequests_approve = endpoint(
	t.modelingRequests_approveInput,
	t.single,
	(a) => ({
		method: 'PUT',
		url: '/v1/modeling-requests/{id_or_sku}/approve',
		path: a,
	}),
);
export const modelingRequests_reject = endpoint(
	t.modelingRequests_rejectInput,
	t.single,
	(a) => ({
		method: 'PUT',
		url: '/v1/modeling-requests/{id_or_sku}/reject',
		path: a,
	}),
);
export const modelingRequests_create = endpoint(
	t.modelingRequests_createInput,
	t.single,
	(a) => ({ method: 'POST', url: '/v1/modeling-requests', ...body(a) }),
);
export const modelingRequests_assets = endpoint(
	t.modelingRequests_assetsInput,
	t.list,
	(a) => ({
		method: 'GET',
		url: '/v1/modeling-requests/{modeling_request_id_or_sku}/assets',
		path: { modeling_request_id_or_sku: a.modeling_request_id_or_sku },
		query: { page: a.page, per_page: a.per_page },
	}),
);
export const productAssets_create = endpoint(
	t.productAssets_createInput,
	t.single,
	(a) => ({
		method: 'POST',
		url: '/v1/products/{product_id}/assets',
		path: { product_id: a.product_id },
		...body({ blob_id: a.blob_id, tags: a.tags }),
	}),
);
export const productAssets_delete = endpoint(
	t.productAssets_deleteInput,
	t.empty,
	(a) => ({
		method: 'DELETE',
		url: '/v1/products/{product_id}/assets/{id}',
		path: a,
	}),
);
export const embeds_list = endpoint(t.embeds_listInput, t.list, (a) => ({
	method: 'GET',
	url: '/v1/products/{product_id}/embeds',
	path: { product_id: a.product_id },
	query: { page: a.page, per_page: a.per_page },
}));
export const embeds_get = endpoint(t.embeds_getInput, t.single, (a) => ({
	method: 'GET',
	url: '/v1/products/{product_id}/embeds/{id}',
	path: a,
}));
export const embeds_delete = endpoint(t.embeds_deleteInput, t.empty, (a) => ({
	method: 'DELETE',
	url: '/v1/products/{product_id}/embeds/{id}',
	path: a,
}));
export const embeds_publish = endpoint(
	t.embeds_publishInput,
	t.single,
	(a) => ({
		method: 'PUT',
		url: '/v1/products/{product_id}/embeds/{id}/publish',
		path: a,
	}),
);
export const reviews_create = endpoint(
	t.reviews_createInput,
	t.reviewOutput,
	(a) => ({
		method: 'POST',
		url: '/v1/modeling-requests/{modeling_request_id_or_sku}/review_issues',
		path: { modeling_request_id_or_sku: a.modeling_request_id_or_sku },
		...body({ review_issues: a.review_issues }),
	}),
);
export const uploads_blob = endpoint(
	t.uploads_blobInput,
	t.blobOutput,
	(a) => ({ method: 'POST', url: '/v1/blobs', ...body(a) }),
);
export const uploads_file = endpoint(
	t.uploads_fileInput,
	t.uploadOutput,
	(a) => ({ method: 'POST', url: '/v1/uploads', ...body(a) }),
);
export const workspaces_list = endpoint(
	t.workspaces_listInput,
	t.list,
	(a) => ({ method: 'GET', url: '/v1/workspaces', query: a }),
);

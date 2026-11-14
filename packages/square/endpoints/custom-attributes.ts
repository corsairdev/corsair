import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/customers/custom-attributes/bulk-upsert (BulkUpsertCustomerCustomAttributes). */
export const customerBulkUpsert: SquareEndpoints['customAttributesCustomerBulkUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesCustomerBulkUpsert.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/customers/custom-attributes/bulk-upsert', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.customAttributesCustomerBulkUpsert,
			event: 'customAttributes.customer.bulkUpsert',
		});
	};

/** POST /v2/locations/custom-attributes/bulk-upsert (BulkUpsertLocationCustomAttributes). */
export const locationBulkUpsert: SquareEndpoints['customAttributesLocationBulkUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationBulkUpsert.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/locations/custom-attributes/bulk-upsert', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.customAttributesLocationBulkUpsert,
			event: 'customAttributes.location.bulkUpsert',
		});
	};

/** POST /v2/merchants/custom-attributes/bulk-upsert (BulkUpsertMerchantCustomAttributes). */
export const merchantBulkUpsert: SquareEndpoints['customAttributesMerchantBulkUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantBulkUpsert.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/merchants/custom-attributes/bulk-upsert', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.customAttributesMerchantBulkUpsert,
			event: 'customAttributes.merchant.bulkUpsert',
		});
	};

/** DELETE /v2/customers/{customer_id}/custom-attributes/{key} (DeleteCustomerCustomAttribute). */
export const customerRemove: SquareEndpoints['customAttributesCustomerDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesCustomerDelete.parse(rawInput);
		return callSquare(
			ctx,
			'/v2/customers/{customer_id}/custom-attributes/{key}',
			{
				method: 'DELETE',
				path: { customer_id: input.customer_id, key: input.key },
				output: SquareEndpointOutputSchemas.customAttributesCustomerDelete,
				event: 'customAttributes.customer.delete',
				logged: { customer_id: input.customer_id, key: input.key },
			},
		);
	};

/** DELETE /v2/locations/{location_id}/custom-attributes/{key} (DeleteLocationCustomAttribute). */
export const locationRemove: SquareEndpoints['customAttributesLocationDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationDelete.parse(rawInput);
		return callSquare(
			ctx,
			'/v2/locations/{location_id}/custom-attributes/{key}',
			{
				method: 'DELETE',
				path: { location_id: input.location_id, key: input.key },
				output: SquareEndpointOutputSchemas.customAttributesLocationDelete,
				event: 'customAttributes.location.delete',
				logged: { location_id: input.location_id, key: input.key },
			},
		);
	};

/** POST /v2/locations/custom-attributes/bulk-delete (BulkDeleteLocationCustomAttributes). */
export const locationBulkDelete: SquareEndpoints['customAttributesLocationBulkDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationBulkDelete.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/locations/custom-attributes/bulk-delete', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.customAttributesLocationBulkDelete,
			event: 'customAttributes.location.bulkDelete',
		});
	};

/** DELETE /v2/merchants/{merchant_id}/custom-attributes/{key} (DeleteMerchantCustomAttribute). */
export const merchantRemove: SquareEndpoints['customAttributesMerchantDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantDelete.parse(rawInput);
		return callSquare(
			ctx,
			'/v2/merchants/{merchant_id}/custom-attributes/{key}',
			{
				method: 'DELETE',
				path: { merchant_id: input.merchant_id, key: input.key },
				output: SquareEndpointOutputSchemas.customAttributesMerchantDelete,
				event: 'customAttributes.merchant.delete',
				logged: { merchant_id: input.merchant_id, key: input.key },
			},
		);
	};

/** POST /v2/merchants/custom-attributes/bulk-delete (BulkDeleteMerchantCustomAttributes). */
export const merchantBulkDelete: SquareEndpoints['customAttributesMerchantBulkDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantBulkDelete.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/merchants/custom-attributes/bulk-delete', {
			method: 'POST',
			body: input,
			output: SquareEndpointOutputSchemas.customAttributesMerchantBulkDelete,
			event: 'customAttributes.merchant.bulkDelete',
		});
	};

/** GET /v2/customers/{customer_id}/custom-attributes/{key} (RetrieveCustomerCustomAttribute). */
export const customerGet: SquareEndpoints['customAttributesCustomerGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesCustomerGet.parse(rawInput);
		const { customer_id, key, ...query } = input;
		return callSquare(
			ctx,
			'/v2/customers/{customer_id}/custom-attributes/{key}',
			{
				query,
				path: { customer_id, key },
				output: SquareEndpointOutputSchemas.customAttributesCustomerGet,
				event: 'customAttributes.customer.get',
				logged: { customer_id, key },
			},
		);
	};

/** GET /v2/customers/{customer_id}/custom-attributes (ListCustomerCustomAttributes). */
export const customerList: SquareEndpoints['customAttributesCustomerList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesCustomerList.parse(rawInput);
		const { customer_id, ...query } = input;
		return callSquare(ctx, '/v2/customers/{customer_id}/custom-attributes', {
			query,
			path: { customer_id },
			output: SquareEndpointOutputSchemas.customAttributesCustomerList,
			event: 'customAttributes.customer.list',
			logged: { customer_id },
		});
	};

/** GET /v2/locations/{location_id}/custom-attributes (ListLocationCustomAttributes). */
export const locationList: SquareEndpoints['customAttributesLocationList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationList.parse(rawInput);
		const { location_id, ...query } = input;
		return callSquare(ctx, '/v2/locations/{location_id}/custom-attributes', {
			query,
			path: { location_id },
			output: SquareEndpointOutputSchemas.customAttributesLocationList,
			event: 'customAttributes.location.list',
			logged: { location_id },
		});
	};

/** GET /v2/merchants/{merchant_id}/custom-attributes (ListMerchantCustomAttributes). */
export const merchantList: SquareEndpoints['customAttributesMerchantList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantList.parse(rawInput);
		const { merchant_id, ...query } = input;
		return callSquare(ctx, '/v2/merchants/{merchant_id}/custom-attributes', {
			query,
			path: { merchant_id },
			output: SquareEndpointOutputSchemas.customAttributesMerchantList,
			event: 'customAttributes.merchant.list',
			logged: { merchant_id },
		});
	};

/** GET /v2/locations/{location_id}/custom-attributes/{key} (RetrieveLocationCustomAttribute). */
export const locationGet: SquareEndpoints['customAttributesLocationGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationGet.parse(rawInput);
		const { location_id, key, ...query } = input;
		return callSquare(
			ctx,
			'/v2/locations/{location_id}/custom-attributes/{key}',
			{
				query,
				path: { location_id, key },
				output: SquareEndpointOutputSchemas.customAttributesLocationGet,
				event: 'customAttributes.location.get',
				logged: { location_id, key },
			},
		);
	};

/** GET /v2/merchants/{merchant_id}/custom-attributes/{key} (RetrieveMerchantCustomAttribute). */
export const merchantGet: SquareEndpoints['customAttributesMerchantGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantGet.parse(rawInput);
		const { merchant_id, key, ...query } = input;
		return callSquare(
			ctx,
			'/v2/merchants/{merchant_id}/custom-attributes/{key}',
			{
				query,
				path: { merchant_id, key },
				output: SquareEndpointOutputSchemas.customAttributesMerchantGet,
				event: 'customAttributes.merchant.get',
				logged: { merchant_id, key },
			},
		);
	};

/** POST /v2/customers/{customer_id}/custom-attributes/{key} (UpsertCustomerCustomAttribute). */
export const customerUpsert: SquareEndpoints['customAttributesCustomerUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesCustomerUpsert.parse(rawInput);
		const { customer_id, key, ...body } = input;
		return callSquare(
			ctx,
			'/v2/customers/{customer_id}/custom-attributes/{key}',
			{
				method: 'POST',
				body,
				path: { customer_id, key },
				output: SquareEndpointOutputSchemas.customAttributesCustomerUpsert,
				event: 'customAttributes.customer.upsert',
				logged: { customer_id, key },
			},
		);
	};

/** POST /v2/locations/{location_id}/custom-attributes/{key} (UpsertLocationCustomAttribute). */
export const locationUpsert: SquareEndpoints['customAttributesLocationUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesLocationUpsert.parse(rawInput);
		const { location_id, key, ...body } = input;
		return callSquare(
			ctx,
			'/v2/locations/{location_id}/custom-attributes/{key}',
			{
				method: 'POST',
				body,
				path: { location_id, key },
				output: SquareEndpointOutputSchemas.customAttributesLocationUpsert,
				event: 'customAttributes.location.upsert',
				logged: { location_id, key },
			},
		);
	};

/** POST /v2/merchants/{merchant_id}/custom-attributes/{key} (UpsertMerchantCustomAttribute). */
export const merchantUpsert: SquareEndpoints['customAttributesMerchantUpsert'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributesMerchantUpsert.parse(rawInput);
		const { merchant_id, key, ...body } = input;
		return callSquare(
			ctx,
			'/v2/merchants/{merchant_id}/custom-attributes/{key}',
			{
				method: 'POST',
				body,
				path: { merchant_id, key },
				output: SquareEndpointOutputSchemas.customAttributesMerchantUpsert,
				event: 'customAttributes.merchant.upsert',
				logged: { merchant_id, key },
			},
		);
	};

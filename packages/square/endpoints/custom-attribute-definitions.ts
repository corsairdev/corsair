import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/customers/custom-attribute-definitions (CreateCustomerCustomAttributeDefinition). */
export const customerCreate: SquareEndpoints['customAttributeDefinitionsCustomerCreate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsCustomerCreate.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/customers/custom-attribute-definitions', {
			method: 'POST',
			body: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsCustomerCreate,
			event: 'customAttributeDefinitions.customer.create',
		});
	};

/** POST /v2/locations/custom-attribute-definitions (CreateLocationCustomAttributeDefinition). */
export const locationCreate: SquareEndpoints['customAttributeDefinitionsLocationCreate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsLocationCreate.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/locations/custom-attribute-definitions', {
			method: 'POST',
			body: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsLocationCreate,
			event: 'customAttributeDefinitions.location.create',
		});
	};

/** DELETE /v2/customers/custom-attribute-definitions/{key} (DeleteCustomerCustomAttributeDefinition). */
export const customerRemove: SquareEndpoints['customAttributeDefinitionsCustomerDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsCustomerDelete.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/customers/custom-attribute-definitions/{key}', {
			method: 'DELETE',
			path: { key: input.key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsCustomerDelete,
			event: 'customAttributeDefinitions.customer.delete',
			logged: { key: input.key },
		});
	};

/** DELETE /v2/locations/custom-attribute-definitions/{key} (DeleteLocationCustomAttributeDefinition). */
export const locationRemove: SquareEndpoints['customAttributeDefinitionsLocationDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsLocationDelete.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/locations/custom-attribute-definitions/{key}', {
			method: 'DELETE',
			path: { key: input.key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsLocationDelete,
			event: 'customAttributeDefinitions.location.delete',
			logged: { key: input.key },
		});
	};

/** DELETE /v2/merchants/custom-attribute-definitions/{key} (DeleteMerchantCustomAttributeDefinition). */
export const merchantRemove: SquareEndpoints['customAttributeDefinitionsMerchantDelete'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsMerchantDelete.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/merchants/custom-attribute-definitions/{key}', {
			method: 'DELETE',
			path: { key: input.key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsMerchantDelete,
			event: 'customAttributeDefinitions.merchant.delete',
			logged: { key: input.key },
		});
	};

/** GET /v2/customers/custom-attribute-definitions/{key} (RetrieveCustomerCustomAttributeDefinition). */
export const customerGet: SquareEndpoints['customAttributeDefinitionsCustomerGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsCustomerGet.parse(
				rawInput,
			);
		const { key, ...query } = input;
		return callSquare(ctx, '/v2/customers/custom-attribute-definitions/{key}', {
			query,
			path: { key },
			output: SquareEndpointOutputSchemas.customAttributeDefinitionsCustomerGet,
			event: 'customAttributeDefinitions.customer.get',
			logged: { key },
		});
	};

/** GET /v2/customers/custom-attribute-definitions (ListCustomerCustomAttributeDefinitions). */
export const customerList: SquareEndpoints['customAttributeDefinitionsCustomerList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsCustomerList.parse(
				rawInput ?? {},
			);
		return callSquare(ctx, '/v2/customers/custom-attribute-definitions', {
			query: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsCustomerList,
			event: 'customAttributeDefinitions.customer.list',
		});
	};

/** GET /v2/locations/custom-attribute-definitions (ListLocationCustomAttributeDefinitions). */
export const locationList: SquareEndpoints['customAttributeDefinitionsLocationList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsLocationList.parse(
				rawInput ?? {},
			);
		return callSquare(ctx, '/v2/locations/custom-attribute-definitions', {
			query: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsLocationList,
			event: 'customAttributeDefinitions.location.list',
		});
	};

/** GET /v2/merchants/custom-attribute-definitions (ListMerchantCustomAttributeDefinitions). */
export const merchantList: SquareEndpoints['customAttributeDefinitionsMerchantList'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsMerchantList.parse(
				rawInput ?? {},
			);
		return callSquare(ctx, '/v2/merchants/custom-attribute-definitions', {
			query: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsMerchantList,
			event: 'customAttributeDefinitions.merchant.list',
		});
	};

/** GET /v2/locations/custom-attribute-definitions/{key} (RetrieveLocationCustomAttributeDefinition). */
export const locationGet: SquareEndpoints['customAttributeDefinitionsLocationGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsLocationGet.parse(
				rawInput,
			);
		const { key, ...query } = input;
		return callSquare(ctx, '/v2/locations/custom-attribute-definitions/{key}', {
			query,
			path: { key },
			output: SquareEndpointOutputSchemas.customAttributeDefinitionsLocationGet,
			event: 'customAttributeDefinitions.location.get',
			logged: { key },
		});
	};

/** GET /v2/merchants/custom-attribute-definitions/{key} (RetrieveMerchantCustomAttributeDefinition). */
export const merchantGet: SquareEndpoints['customAttributeDefinitionsMerchantGet'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsMerchantGet.parse(
				rawInput,
			);
		const { key, ...query } = input;
		return callSquare(ctx, '/v2/merchants/custom-attribute-definitions/{key}', {
			query,
			path: { key },
			output: SquareEndpointOutputSchemas.customAttributeDefinitionsMerchantGet,
			event: 'customAttributeDefinitions.merchant.get',
			logged: { key },
		});
	};

/** PUT /v2/customers/custom-attribute-definitions/{key} (UpdateCustomerCustomAttributeDefinition). */
export const customerUpdate: SquareEndpoints['customAttributeDefinitionsCustomerUpdate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsCustomerUpdate.parse(
				rawInput,
			);
		const { key, ...body } = input;
		return callSquare(ctx, '/v2/customers/custom-attribute-definitions/{key}', {
			method: 'PUT',
			body,
			path: { key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsCustomerUpdate,
			event: 'customAttributeDefinitions.customer.update',
			logged: { key },
		});
	};

/** PUT /v2/locations/custom-attribute-definitions/{key} (UpdateLocationCustomAttributeDefinition). */
export const locationUpdate: SquareEndpoints['customAttributeDefinitionsLocationUpdate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsLocationUpdate.parse(
				rawInput,
			);
		const { key, ...body } = input;
		return callSquare(ctx, '/v2/locations/custom-attribute-definitions/{key}', {
			method: 'PUT',
			body,
			path: { key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsLocationUpdate,
			event: 'customAttributeDefinitions.location.update',
			logged: { key },
		});
	};

/** PUT /v2/merchants/custom-attribute-definitions/{key} (UpdateMerchantCustomAttributeDefinition). */
export const merchantUpdate: SquareEndpoints['customAttributeDefinitionsMerchantUpdate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsMerchantUpdate.parse(
				rawInput,
			);
		const { key, ...body } = input;
		return callSquare(ctx, '/v2/merchants/custom-attribute-definitions/{key}', {
			method: 'PUT',
			body,
			path: { key },
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsMerchantUpdate,
			event: 'customAttributeDefinitions.merchant.update',
			logged: { key },
		});
	};

/** POST /v2/merchants/custom-attribute-definitions (CreateMerchantCustomAttributeDefinition). */
export const merchantCreate: SquareEndpoints['customAttributeDefinitionsMerchantCreate'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.customAttributeDefinitionsMerchantCreate.parse(
				rawInput,
			);
		return callSquare(ctx, '/v2/merchants/custom-attribute-definitions', {
			method: 'POST',
			body: input,
			output:
				SquareEndpointOutputSchemas.customAttributeDefinitionsMerchantCreate,
			event: 'customAttributeDefinitions.merchant.create',
		});
	};

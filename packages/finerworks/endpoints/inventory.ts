import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	InventoryDeleteInputSchema,
	InventoryDeleteOutputSchema,
	InventoryDisconnectInputSchema,
	InventoryDisconnectOutputSchema,
	InventoryListInputSchema,
	InventoryListOutputSchema,
	InventoryUpdateInputSchema,
	InventoryUpdateOutputSchema,
} from './types';

/**
 * Paginated list of the account's virtual inventory products.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_virtual_inventory
 */
export const list: FinerWorksEndpoint<'inventory.list'> = async (
	ctx,
	input = {},
) => {
	const validated = InventoryListInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_virtual_inventory',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.inventory.list',
		{
			page_number: validated.page_number ?? null,
			per_page: validated.per_page ?? null,
		},
		'completed',
	);
	return InventoryListOutputSchema.parse(res);
};

/**
 * Adjust product details such as pricing, stock and third-party integrations.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_virtual_inventory
 */
export const update: FinerWorksEndpoint<'inventory.update'> = async (
	ctx,
	input,
) => {
	const validated = InventoryUpdateInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/update_virtual_inventory',
		credentials,
		{ method: 'PUT', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.inventory.update',
		{ count: validated.virtual_inventory.length },
		'completed',
	);
	return InventoryUpdateOutputSchema.parse(res);
};

/**
 * Delete virtual inventory products by SKU. Any of those products synced to a
 * third-party platform stop being connected to FinerWorks.
 * https://v2.api.finerworks.com/Help/Api/DELETE-v3-delete_virtual_inventory
 */
export const remove: FinerWorksEndpoint<'inventory.delete'> = async (
	ctx,
	input,
) => {
	const validated = InventoryDeleteInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/delete_virtual_inventory',
		credentials,
		{ method: 'DELETE', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.inventory.delete',
		{ count: validated.skus.length },
		'completed',
	);
	return InventoryDeleteOutputSchema.parse(res);
};

/**
 * Disconnect every virtual inventory item from a third-party platform.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-disconnect_virtual_inventory
 */
export const disconnect: FinerWorksEndpoint<'inventory.disconnect'> = async (
	ctx,
	input,
) => {
	const validated = InventoryDisconnectInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/disconnect_virtual_inventory',
		credentials,
		{ method: 'PUT', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.inventory.disconnect',
		{ platform: validated.platform },
		'completed',
	);
	return InventoryDisconnectOutputSchema.parse(res);
};

export const InventoryEndpoints = {
	list,
	update,
	delete: remove,
	disconnect,
} as const;

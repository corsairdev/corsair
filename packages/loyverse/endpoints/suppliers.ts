import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseSupplierEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'supplier';

/**
 * The supplier paths carry a trailing slash in the published spec
 * (`/suppliers/`). Both forms are accepted - verified live - and the documented
 * form is used here so the plugin matches the reference.
 */
const COLLECTION = 'suppliers/';

/** Lists suppliers. */
export const list: LoyverseEndpoints['suppliersList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['suppliersList']>(
		ctx,
		COLLECTION,
		{ query: listQuery(input, { suppliers_ids: csv(input.suppliers_ids) }) },
	);

	await cacheEntities(
		ctx.db.suppliers,
		LoyverseSupplierEntity,
		result.suppliers,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.suppliers.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one supplier by id. */
export const get: LoyverseEndpoints['suppliersGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['suppliersGet']>(
		ctx,
		`suppliers/${input.supplier_id}`,
	);

	await cacheEntity(ctx.db.suppliers, LoyverseSupplierEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.suppliers.get',
		auditPayload(input, ['supplier_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a supplier.
 *
 * Supplier records hold a contact name, email and phone number, so only the id
 * is logged.
 */
export const upsert: LoyverseEndpoints['suppliersUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['suppliersUpsert']>(
		ctx,
		COLLECTION,
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				name: input.name,
				contact: input.contact,
				email: input.email,
				phone_number: input.phone_number,
				address_1: input.address_1,
				address_2: input.address_2,
				city: input.city,
				region: input.region,
				postal_code: input.postal_code,
				country_code: input.country_code,
				website: input.website,
				note: input.note,
			}),
		},
	);

	await cacheEntity(ctx.db.suppliers, LoyverseSupplierEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.suppliers.upsert',
		{ supplier_id: result.id, created: input.id === undefined },
		'completed',
	);
	return result;
};

/** Deletes a supplier and drops it from the mirror. */
export const remove: LoyverseEndpoints['suppliersDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['suppliersDelete']>(
		ctx,
		`suppliers/${input.supplier_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.suppliers, input.supplier_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.suppliers.delete',
		auditPayload(input, ['supplier_id']),
		'completed',
	);
	return result;
};

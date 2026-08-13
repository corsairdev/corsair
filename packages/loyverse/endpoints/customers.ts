import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseCustomerEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'customer';

/**
 * Customers are the one entity that is largely personal data - name, email,
 * phone, postal address, plus a free-text note and lifetime spend.
 *
 * None of it is written to the event log: every operation below logs the
 * customer id and nothing else that identifies a person.
 */

/** Lists customers, mirroring each page. */
export const list: LoyverseEndpoints['customersList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['customersList']>(
		ctx,
		'customers',
		{
			query: listQuery(input, {
				customer_ids: csv(input.customer_ids),
				email: input.email,
			}),
		},
	);

	await cacheEntities(
		ctx.db.customers,
		LoyverseCustomerEntity,
		result.customers,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.customers.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one customer by id. */
export const get: LoyverseEndpoints['customersGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['customersGet']>(
		ctx,
		`customers/${input.customer_id}`,
	);

	await cacheEntity(ctx.db.customers, LoyverseCustomerEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.customers.get',
		auditPayload(input, ['customer_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a customer.
 *
 * Only the id is logged. Every other field on this operation - name, email,
 * phone number, address, note - is personal data supplied by the caller, and
 * `auditPayload` is deliberately not used here so that not even the field names
 * suggest the log holds contact details.
 */
export const upsert: LoyverseEndpoints['customersUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['customersUpsert']>(
		ctx,
		'customers',
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				name: input.name,
				email: input.email,
				phone_number: input.phone_number,
				address: input.address,
				city: input.city,
				region: input.region,
				postal_code: input.postal_code,
				country_code: input.country_code,
				customer_code: input.customer_code,
				note: input.note,
			}),
		},
	);

	await cacheEntity(ctx.db.customers, LoyverseCustomerEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.customers.upsert',
		{ customer_id: result.id, created: input.id === undefined },
		'completed',
	);
	return result;
};

/**
 * Deletes a customer.
 *
 * Eviction is a correctness requirement here rather than tidiness. Loyverse does
 * not soft-delete customers - the API documents this as a personal-data
 * restriction, and the record carries `permanent_deletion_at` - so a mirrored row
 * left in place would outlive a record that no longer exists and would keep
 * answering reads with personal data the account has deleted.
 *
 * That is why this is the one eviction in the plugin marked `required`. Everywhere
 * else a failed cache write is swallowed so a plugin call does not fail over a
 * local mirror; here, swallowing it would report "customer deleted" while their
 * name, email, phone and address stayed queryable. A failure raises
 * `LoyverseMirrorEvictionError`, whose message says the remote record is already
 * gone so the delete does not need repeating - it is the mirror that needs
 * attention.
 *
 * The event is logged before the eviction so the deletion is recorded even when
 * the mirror write fails; the raise happens after, and cannot swallow the audit
 * trail with it.
 */
export const remove: LoyverseEndpoints['customersDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['customersDelete']>(
		ctx,
		`customers/${input.customer_id}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'loyverse.customers.delete',
		auditPayload(input, ['customer_id']),
		'completed',
	);

	// Last, and allowed to raise: see the note above.
	await evictEntity(ctx.db.customers, input.customer_id, LABEL, {
		required: true,
	});

	return result;
};

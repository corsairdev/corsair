import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
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
 * The audit event is emitted once, after the eviction, carrying the outcome of
 * both halves: `completed` when the mirror was cleared, `failed` when the remote
 * delete succeeded but the local copy could not be removed. Logging `completed`
 * before the eviction would record an operation that then threw as having
 * completed; skipping the log when the eviction fails would lose the record that a
 * customer was deleted at Loyverse at all, which is irreversible and the thing an
 * audit trail most needs to keep. Emitting it afterwards with an accurate status
 * does neither.
 *
 * A 404 from the delete is treated as success rather than surfaced, which matters
 * more than it looks. Loyverse hard-deletes customers, so a 404 is positive
 * confirmation that the record is not there - which is the outcome the caller
 * asked for. Surfacing it as a failure would abandon the call *before* the
 * eviction, leaving the customer's personal data in the mirror with nothing to
 * report it.
 *
 * That is not hypothetical. A 500 on the delete is ambiguous: Loyverse may have
 * committed it before failing. The retry replays the whole endpoint, and the second
 * DELETE answers 404 rather than repeating the 200 - verified live. The deletion is
 * still idempotent in effect, since the customer ends up absent either way; it is
 * only the status code that differs, and that difference is enough to break the
 * call. Without this branch the operation would end in a not-found error having
 * deleted the customer remotely and cleaned nothing locally. The same branch covers
 * an ordinary double delete and a customer removed in the back office.
 *
 * The distinction is deliberate and limited to customers: elsewhere a 404 on a
 * delete is surfaced, because those mirrors hold non-personal reference data where
 * a stale row is explicitly acceptable - Loyverse soft-deletes them and the row
 * keeps its value for resolving historical references.
 */
export const remove: LoyverseEndpoints['customersDelete'] = async (
	ctx,
	input,
) => {
	let result: LoyverseEndpointOutputs['customersDelete'];
	let alreadyAbsent = false;

	try {
		result = await loyverseCall<LoyverseEndpointOutputs['customersDelete']>(
			ctx,
			`customers/${input.customer_id}`,
			{ method: 'DELETE' },
		);
	} catch (error) {
		if (!(error instanceof ApiError) || error.status !== 404) throw error;

		// The record is confirmed absent, so the deletion the caller asked for has
		// happened - by this call or an earlier one. Nothing was removed now, so the
		// result says so rather than claiming an id it did not delete.
		alreadyAbsent = true;
		result = { deleted_object_ids: [] };
	}

	// Runs on the already-absent path too - that is the whole point of catching the
	// 404. Allowed to raise, but not before the event is recorded.
	//
	// The failure is held in a container rather than as a bare `unknown`, so the
	// rethrow below tests for presence instead of truthiness. A thrown falsy value
	// would otherwise be dropped, and on this path that would mean reporting a
	// customer as deleted while their data stayed in the mirror - the exact outcome
	// this function exists to prevent.
	let evictionFailure: { error: unknown } | undefined;
	try {
		await evictEntity(ctx.db.customers, input.customer_id, LABEL, {
			required: true,
		});
	} catch (error) {
		evictionFailure = { error };
	}

	const evicted = evictionFailure === undefined;

	await logEventFromContext(
		ctx,
		'loyverse.customers.delete',
		{
			...auditPayload(input, ['customer_id']),
			already_absent: alreadyAbsent,
			mirror_evicted: evicted,
		},
		evicted ? 'completed' : 'failed',
	);

	if (evictionFailure) throw evictionFailure.error;

	return result;
};

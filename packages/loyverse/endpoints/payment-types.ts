import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyversePaymentTypeEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'payment type';

/**
 * Payment types are read-only over the API and configured in the back office.
 * Every account starts with Cash and Card.
 *
 * They are mirrored because a receipt references a payment type by id, and
 * resolving that id to a name is exactly the lookup a local copy is for.
 */

/** Lists payment types. */
export const list: LoyverseEndpoints['paymentTypesList'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['paymentTypesList']
	>(ctx, 'payment_types', {
		query: listQuery(input, {
			payment_type_ids: csv(input.payment_type_ids),
		}),
	});

	await cacheEntities(
		ctx.db.paymentTypes,
		LoyversePaymentTypeEntity,
		result.payment_types,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.paymentTypes.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one payment type by id. */
export const get: LoyverseEndpoints['paymentTypesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['paymentTypesGet']>(
		ctx,
		`payment_types/${input.payment_type_id}`,
	);

	await cacheEntity(ctx.db.paymentTypes, LoyversePaymentTypeEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.paymentTypes.get',
		auditPayload(input, ['payment_type_id']),
		'completed',
	);
	return result;
};

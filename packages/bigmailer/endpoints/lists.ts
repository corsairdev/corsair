import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerListEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'list';

/**
 * A contact list's `id` is only unique *within* its brand - confirmed live
 * from `deletelist.md`'s literal path template
 * (`DELETE /brands/{brand_id}/lists/{list_id}`). Composite `brand:id` key.
 */
const entityId = (l: { brandId?: string; id: string }) =>
	`${l.brandId}:${l.id}`;

/** Lists contact lists within a brand. */
export const list: BigmailerEndpoints['listsList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['listsList']>(
		ctx,
		`brands/${seg(input.brandId)}/lists`,
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(
		ctx.db.lists,
		BigmailerListEntity,
		result.data.map((l) => ({ ...l, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.lists.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a contact list. */
export const create: BigmailerEndpoints['listsCreate'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['listsCreate']>(
		ctx,
		`brands/${seg(input.brandId)}/lists`,
		{ method: 'POST', body: { name: input.name } },
	);

	await cacheEntity(
		ctx.db.lists,
		BigmailerListEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.lists.create',
		auditPayload(input, ['brandId', 'name']),
		'completed',
	);
	return result;
};

/** Retrieves a single contact list. */
export const get: BigmailerEndpoints['listsGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['listsGet']>(
		ctx,
		`brands/${seg(input.brandId)}/lists/${seg(input.listId)}`,
	);

	await cacheEntity(
		ctx.db.lists,
		BigmailerListEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.lists.get',
		auditPayload(input, ['brandId', 'listId']),
		'completed',
	);
	return result;
};

/** Renames a contact list. Confirmed live against a real account: `POST`, not `PUT`. */
export const update: BigmailerEndpoints['listsUpdate'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['listsUpdate']>(
		ctx,
		`brands/${seg(input.brandId)}/lists/${seg(input.listId)}`,
		{ method: 'POST', body: { name: input.name } },
	);

	await cacheEntity(
		ctx.db.lists,
		BigmailerListEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.lists.update',
		auditPayload(input, ['brandId', 'listId', 'name']),
		'completed',
	);
	return result;
};

/** Deletes a contact list. Contacts within the list are not deleted, per BigMailer's own docs. */
export const remove: BigmailerEndpoints['listsDelete'] = async (ctx, input) => {
	await bigmailerCall<BigmailerEndpointOutputs['listsDelete']>(
		ctx,
		`brands/${seg(input.brandId)}/lists/${seg(input.listId)}`,
		{ method: 'DELETE' },
	);

	await evictEntity(
		ctx.db.lists,
		entityId({ brandId: input.brandId, id: input.listId }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'bigmailer.lists.delete',
		auditPayload(input, ['brandId', 'listId']),
		'completed',
	);
};

import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerSegmentEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'segment';

/** A segment's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (s: { brandId?: string; id: string }) =>
	`${s.brandId}:${s.id}`;

/** Lists segments within a brand. */
export const list: BigmailerEndpoints['segmentsList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['segmentsList']>(
		ctx,
		`brands/${seg(input.brandId)}/segments`,
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(
		ctx.db.segments,
		BigmailerSegmentEntity,
		result.data.map((s) => ({ ...s, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.segments.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a segment. */
export const create: BigmailerEndpoints['segmentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['segmentsCreate']
	>(ctx, `brands/${seg(input.brandId)}/segments`, {
		method: 'POST',
		body: {
			name: input.name,
			operator: input.operator,
			conditions: input.conditions,
		},
	});

	await cacheEntity(
		ctx.db.segments,
		BigmailerSegmentEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.segments.create',
		auditPayload(input, ['brandId', 'name', 'operator']),
		'completed',
	);
	return result;
};

/** Retrieves a single segment. */
export const get: BigmailerEndpoints['segmentsGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['segmentsGet']>(
		ctx,
		`brands/${seg(input.brandId)}/segments/${seg(input.segmentId)}`,
	);

	await cacheEntity(
		ctx.db.segments,
		BigmailerSegmentEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.segments.get',
		auditPayload(input, ['brandId', 'segmentId']),
		'completed',
	);
	return result;
};

/** Updates a segment. `POST`, not `PUT` - confirmed live from `updatesegment.md`'s own OpenAPI path/method. */
export const update: BigmailerEndpoints['segmentsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['segmentsUpdate']
	>(ctx, `brands/${seg(input.brandId)}/segments/${seg(input.segmentId)}`, {
		method: 'POST',
		body: compact({
			name: input.name,
			operator: input.operator,
			conditions: input.conditions,
		}),
	});

	await cacheEntity(
		ctx.db.segments,
		BigmailerSegmentEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.segments.update',
		auditPayload(input, ['brandId', 'segmentId', 'name']),
		'completed',
	);
	return result;
};

/** Deletes a segment. */
export const remove: BigmailerEndpoints['segmentsDelete'] = async (
	ctx,
	input,
) => {
	// `deleteSegment` returns `{id}` (the deleted segment's id), not an empty
	// body - confirmed live from `deletesegment.md`'s own `response200`
	// schema. Returned to the caller rather than discarded.
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['segmentsDelete']
	>(ctx, `brands/${seg(input.brandId)}/segments/${seg(input.segmentId)}`, {
		method: 'DELETE',
	});

	await evictEntity(
		ctx.db.segments,
		entityId({ brandId: input.brandId, id: input.segmentId }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'bigmailer.segments.delete',
		auditPayload(input, ['brandId', 'segmentId']),
		'completed',
	);
	return result;
};

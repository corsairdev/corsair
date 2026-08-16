import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerFieldEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'field';

/**
 * A field's `id` is only unique *within* its brand - confirmed live from
 * `deletefield.md`'s literal path template
 * (`DELETE /brands/{brand_id}/fields/{field_id}`). Composite `brand:id` key.
 */
const entityId = (f: { brandId?: string; id: string }) =>
	`${f.brandId}:${f.id}`;

/** Lists custom fields within a brand. */
export const list: BigmailerEndpoints['fieldsList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['fieldsList']>(
		ctx,
		`brands/${seg(input.brandId)}/fields`,
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(
		ctx.db.fields,
		BigmailerFieldEntity,
		result.data.map((f) => ({ ...f, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.fields.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a custom field. */
export const create: BigmailerEndpoints['fieldsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['fieldsCreate']>(
		ctx,
		`brands/${seg(input.brandId)}/fields`,
		{
			method: 'POST',
			body: compact({
				name: input.name,
				type: input.type,
				merge_tag_name: input.mergeTagName,
				sample_value: input.sampleValue,
			}),
		},
	);

	await cacheEntity(
		ctx.db.fields,
		BigmailerFieldEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.fields.create',
		auditPayload(input, ['brandId', 'name', 'type', 'mergeTagName']),
		'completed',
	);
	return result;
};

/** Retrieves a single custom field. */
export const get: BigmailerEndpoints['fieldsGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['fieldsGet']>(
		ctx,
		`brands/${seg(input.brandId)}/fields/${seg(input.fieldId)}`,
	);

	await cacheEntity(
		ctx.db.fields,
		BigmailerFieldEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.fields.get',
		auditPayload(input, ['brandId', 'fieldId']),
		'completed',
	);
	return result;
};

/** Updates a custom field's name, merge-tag name, or sample value. Its data `type` is fixed at creation and cannot be changed here. Confirmed live against a real account: `POST`, not `PUT`. */
export const update: BigmailerEndpoints['fieldsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['fieldsUpdate']>(
		ctx,
		`brands/${seg(input.brandId)}/fields/${seg(input.fieldId)}`,
		{
			method: 'POST',
			body: compact({
				name: input.name,
				merge_tag_name: input.mergeTagName,
				sample_value: input.sampleValue,
			}),
		},
	);

	await cacheEntity(
		ctx.db.fields,
		BigmailerFieldEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.fields.update',
		auditPayload(input, ['brandId', 'fieldId', 'name', 'mergeTagName']),
		'completed',
	);
	return result;
};

/** Deletes a custom field. */
export const remove: BigmailerEndpoints['fieldsDelete'] = async (
	ctx,
	input,
) => {
	await bigmailerCall<BigmailerEndpointOutputs['fieldsDelete']>(
		ctx,
		`brands/${seg(input.brandId)}/fields/${seg(input.fieldId)}`,
		{ method: 'DELETE' },
	);

	await evictEntity(
		ctx.db.fields,
		entityId({ brandId: input.brandId, id: input.fieldId }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'bigmailer.fields.delete',
		auditPayload(input, ['brandId', 'fieldId']),
		'completed',
	);
};

import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerBrandPropertyEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'brand property';

/**
 * A brand property's `id` is only unique *within* its brand - confirmed
 * live from `getbrandproperty.md`'s path template
 * (`/brands/{brand_id}/properties/{brand_property_id}`). Composite
 * `brand:id` key, the same fix Doppler applies to configs/environments and
 * this plugin applies to every other brand-scoped resource.
 */
const entityId = (p: { brandId?: string; id: string }) =>
	`${p.brandId}:${p.id}`;

/** Lists brand properties within a brand. */
export const list: BigmailerEndpoints['brandPropertiesList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['brandPropertiesList']
	>(ctx, `brands/${seg(input.brandId)}/properties`, {
		query: compact({ limit: input.limit, cursor: input.cursor }),
	});

	await cacheEntities(
		ctx.db.brandProperties,
		BigmailerBrandPropertyEntity,
		result.data.map((p) => ({ ...p, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.brandProperties.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a brand property. */
export const create: BigmailerEndpoints['brandPropertiesCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['brandPropertiesCreate']
	>(ctx, `brands/${seg(input.brandId)}/properties`, {
		method: 'POST',
		body: compact({
			name: input.name,
			merge_tag_name: input.mergeTagName,
			is_html: input.isHtml,
			string_value: input.stringValue,
		}),
	});

	await cacheEntity(
		ctx.db.brandProperties,
		BigmailerBrandPropertyEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.brandProperties.create',
		auditPayload(input, ['brandId', 'name', 'mergeTagName']),
		'completed',
	);
	return result;
};

/** Retrieves a single brand property. */
export const get: BigmailerEndpoints['brandPropertiesGet'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['brandPropertiesGet']
	>(
		ctx,
		`brands/${seg(input.brandId)}/properties/${seg(input.brandPropertyId)}`,
	);

	await cacheEntity(
		ctx.db.brandProperties,
		BigmailerBrandPropertyEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.brandProperties.get',
		auditPayload(input, ['brandId', 'brandPropertyId']),
		'completed',
	);
	return result;
};

/** Updates a brand property. Confirmed live against a real account: `POST`, not `PUT`. */
export const update: BigmailerEndpoints['brandPropertiesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['brandPropertiesUpdate']
	>(
		ctx,
		`brands/${seg(input.brandId)}/properties/${seg(input.brandPropertyId)}`,
		{
			method: 'POST',
			body: compact({
				name: input.name,
				merge_tag_name: input.mergeTagName,
				is_html: input.isHtml,
				string_value: input.stringValue,
			}),
		},
	);

	await cacheEntity(
		ctx.db.brandProperties,
		BigmailerBrandPropertyEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.brandProperties.update',
		auditPayload(input, ['brandId', 'brandPropertyId', 'name', 'mergeTagName']),
		'completed',
	);
	return result;
};

/** Deletes a brand property. */
export const remove: BigmailerEndpoints['brandPropertiesDelete'] = async (
	ctx,
	input,
) => {
	await bigmailerCall<BigmailerEndpointOutputs['brandPropertiesDelete']>(
		ctx,
		`brands/${seg(input.brandId)}/properties/${seg(input.brandPropertyId)}`,
		{ method: 'DELETE' },
	);

	await evictEntity(
		ctx.db.brandProperties,
		entityId({ brandId: input.brandId, id: input.brandPropertyId }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'bigmailer.brandProperties.delete',
		auditPayload(input, ['brandId', 'brandPropertyId']),
		'completed',
	);
};

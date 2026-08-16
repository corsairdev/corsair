import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerBrandEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'brand';

/** Lists brands in the account. */
export const list: BigmailerEndpoints['brandsList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['brandsList']>(
		ctx,
		'brands',
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(ctx.db.brands, BigmailerBrandEntity, result.data, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigmailer.brands.list',
		{ returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a brand. */
export const create: BigmailerEndpoints['brandsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['brandsCreate']>(
		ctx,
		'brands',
		{
			method: 'POST',
			body: compact({
				name: input.name,
				from_name: input.fromName,
				from_email: input.fromEmail,
				bounce_danger_percent: input.bounceDangerPercent,
				max_soft_bounces: input.maxSoftBounces,
				url: input.url,
				unsubscribe_text: input.unsubscribeText,
				contact_limit: input.contactLimit,
				logo: input.logo,
				connection_id: input.connectionId,
			}),
		},
	);

	await cacheEntity(ctx.db.brands, BigmailerBrandEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigmailer.brands.create',
		auditPayload(input, ['name', 'fromName', 'fromEmail', 'url']),
		'completed',
	);
	return result;
};

/** Retrieves a single brand. */
export const get: BigmailerEndpoints['brandsGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['brandsGet']>(
		ctx,
		`brands/${seg(input.brandId)}`,
	);

	await cacheEntity(ctx.db.brands, BigmailerBrandEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigmailer.brands.get',
		auditPayload(input, ['brandId']),
		'completed',
	);
	return result;
};

/** Updates a brand. Confirmed live against a real account: `POST`, not `PUT`. */
export const update: BigmailerEndpoints['brandsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['brandsUpdate']>(
		ctx,
		`brands/${seg(input.brandId)}`,
		{
			method: 'POST',
			body: compact({
				name: input.name,
				from_name: input.fromName,
				from_email: input.fromEmail,
				bounce_danger_percent: input.bounceDangerPercent,
				max_soft_bounces: input.maxSoftBounces,
				url: input.url,
				unsubscribe_text: input.unsubscribeText,
				contact_limit: input.contactLimit,
				logo: input.logo,
				connection_id: input.connectionId,
			}),
		},
	);

	await cacheEntity(ctx.db.brands, BigmailerBrandEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigmailer.brands.update',
		auditPayload(input, ['brandId', 'name', 'fromName', 'fromEmail', 'url']),
		'completed',
	);
	return result;
};

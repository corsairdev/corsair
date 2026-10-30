import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerTemplateEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'template';

/** A template's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (t: { brandId?: string; id: string }) =>
	`${t.brandId}:${t.id}`;

/** Lists email/landing-page templates within a brand. */
export const list: BigmailerEndpoints['templatesList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['templatesList']>(
		ctx,
		`brands/${seg(input.brandId)}/templates`,
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await cacheEntities(
		ctx.db.templates,
		BigmailerTemplateEntity,
		result.data.map((t) => ({ ...t, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.templates.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/** Creates a template. */
export const create: BigmailerEndpoints['templatesCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['templatesCreate']
	>(ctx, `brands/${seg(input.brandId)}/templates`, {
		method: 'POST',
		body: compact({
			name: input.name,
			type: input.type,
			shared_with_account: input.sharedWithAccount,
			html: input.html,
		}),
	});

	await cacheEntity(
		ctx.db.templates,
		BigmailerTemplateEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.templates.create',
		auditPayload(input, ['brandId', 'name', 'type']),
		'completed',
	);
	return result;
};

/** Retrieves a single template. */
export const get: BigmailerEndpoints['templatesGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['templatesGet']>(
		ctx,
		`brands/${seg(input.brandId)}/templates/${seg(input.templateId)}`,
	);

	await cacheEntity(
		ctx.db.templates,
		BigmailerTemplateEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.templates.get',
		auditPayload(input, ['brandId', 'templateId']),
		'completed',
	);
	return result;
};

/** Updates a template. `POST`, not `PATCH` - confirmed live from `updatetemplate.md`'s own OpenAPI path/method. */
export const update: BigmailerEndpoints['templatesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['templatesUpdate']
	>(ctx, `brands/${seg(input.brandId)}/templates/${seg(input.templateId)}`, {
		method: 'POST',
		body: compact({
			name: input.name,
			type: input.type,
			shared_with_account: input.sharedWithAccount,
			html: input.html,
		}),
	});

	await cacheEntity(
		ctx.db.templates,
		BigmailerTemplateEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.templates.update',
		auditPayload(input, ['brandId', 'templateId', 'name']),
		'completed',
	);
	return result;
};

/** Deletes a template. */
export const remove: BigmailerEndpoints['templatesDelete'] = async (
	ctx,
	input,
) => {
	// `deleteTemplate` returns `{id}` (the deleted template's id), not an
	// empty body - confirmed live from `deletetemplate.md`'s own `response200`
	// schema. Returned to the caller rather than discarded.
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['templatesDelete']
	>(ctx, `brands/${seg(input.brandId)}/templates/${seg(input.templateId)}`, {
		method: 'DELETE',
	});

	await evictEntity(
		ctx.db.templates,
		entityId({ brandId: input.brandId, id: input.templateId }),
		LABEL,
	);
	await logEventFromContext(
		ctx,
		'bigmailer.templates.delete',
		auditPayload(input, ['brandId', 'templateId']),
		'completed',
	);
	return result;
};

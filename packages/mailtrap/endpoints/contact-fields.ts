import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheContactField, evictEntity } from './persist';
import { accountPath, compactBody, mailtrapCall } from './shared';
import type { MailtrapContactField } from './types';

/** Lists all custom contact fields defined on the account. */
export const list: MailtrapEndpoints['contactFieldsList'] = async (ctx) => {
	const path = await accountPath(ctx, '/contacts/fields');
	const result = await mailtrapCall<MailtrapContactField[]>(ctx, path);

	await Promise.all(
		(result ?? []).map((field) =>
			cacheContactField(ctx.db?.contactFields, field),
		),
	);

	await logEventFromContext(
		ctx,
		'mailtrap.contactFields.list',
		{},
		'completed',
	);
	return result ?? [];
};

/**
 * Creates a custom contact field.
 *
 * Sent unwrapped, same rationale as `contactLists.create` — confirmed live
 * that a `contact_field` wrapper 422s and `mailtrap@4.8.0`'s
 * `ContactFieldsApi.create` passes `data` straight through.
 */
export const create: MailtrapEndpoints['contactFieldsCreate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/contacts/fields');
	const result = await mailtrapCall<MailtrapContactField>(ctx, path, {
		method: 'POST',
		body: {
			name: input.name,
			merge_tag: input.merge_tag,
			data_type: input.data_type,
		},
	});

	await cacheContactField(ctx.db?.contactFields, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactFields.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Gets a custom contact field by id. */
export const get: MailtrapEndpoints['contactFieldsGet'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/fields/${input.field_id}`);
	const result = await mailtrapCall<MailtrapContactField>(ctx, path);

	await cacheContactField(ctx.db?.contactFields, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactFields.get',
		auditPayload(input, ['field_id']),
		'completed',
	);
	return result;
};

/**
 * Updates a custom contact field's name and/or merge tag. Omitted fields
 * are left unchanged.
 *
 * `data_type` is immutable after creation - see the input schema for the
 * live-confirmed silent-no-op behavior a caller would otherwise hit.
 */
export const update: MailtrapEndpoints['contactFieldsUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/fields/${input.field_id}`);
	const result = await mailtrapCall<MailtrapContactField>(ctx, path, {
		method: 'PATCH',
		body: compactBody({
			name: input.name,
			merge_tag: input.merge_tag,
		}),
	});

	await cacheContactField(ctx.db?.contactFields, result);

	await logEventFromContext(
		ctx,
		'mailtrap.contactFields.update',
		auditPayload(input, ['field_id']),
		'completed',
	);
	return result;
};

/**
 * Permanently deletes a custom contact field. [DESTRUCTIVE]
 *
 * Also drops the field's stored values off every contact that had it set —
 * not just the field definition.
 */
export const remove: MailtrapEndpoints['contactFieldsDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/contacts/fields/${input.field_id}`);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'mailtrap.contactFields.delete',
		auditPayload(input, ['field_id']),
		'completed',
	);

	await evictEntity(
		ctx.db?.contactFields,
		String(input.field_id),
		'contact field',
	);

	return {};
};

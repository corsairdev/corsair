import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import {
	ActiveCampaignField,
	ActiveCampaignFieldOption,
	ActiveCampaignFieldRel,
	ActiveCampaignFieldValue,
	ActiveCampaignGroupMember,
} from '../schema/database';
import { auditPayload, listAuditPayload } from './logging';
import { evictChildren, evictRow, persistRow, persistRows } from './persist';
import { buildPaginationQuery, compactBody, resolveAccount } from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

// ---------------------------------------------------------------------------
// Field definitions
// ---------------------------------------------------------------------------

/**
 * Custom field *definitions*. An agent needs the account's field schema to
 * interpret the values attached to a contact, which is why the definitions are
 * mirrored.
 */
export const list: ActiveCampaignEndpoints['fieldsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldsList']
	>('fields', ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await persistRows(
		ctx.db.fields,
		ActiveCampaignField,
		response.fields,
		'field',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fields.list',
		listAuditPayload(input, ['limit', 'offset'], response.fields?.length ?? 0),
		'completed',
	);
	return response;
};

export const get: ActiveCampaignEndpoints['fieldsGet'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldsGet']
	>(`fields/${input.id}`, ctx.key, account, { method: 'GET' });

	await persistRow(ctx.db.fields, ActiveCampaignField, response.field, 'field');

	await logEventFromContext(
		ctx,
		'activecampaign.fields.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

export const create: ActiveCampaignEndpoints['fieldsCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldsCreate']
	>('fields', ctx.key, account, {
		method: 'POST',
		body: {
			field: compactBody({
				title: input.title,
				type: input.type,
				descript: input.descript,
				perstag: input.perstag,
				defval: input.defval,
				// ActiveCampaign expects its booleans as 0/1.
				isrequired:
					input.isrequired === undefined ? undefined : input.isrequired ? 1 : 0,
				visible:
					input.visible === undefined ? undefined : input.visible ? 1 : 0,
				ordernum: input.ordernum,
			}),
		},
	});

	await persistRow(ctx.db.fields, ActiveCampaignField, response.field, 'field');

	await logEventFromContext(
		ctx,
		'activecampaign.fields.create',
		auditPayload(input, ['type', 'isrequired', 'visible', 'ordernum']),
		'completed',
	);
	return response;
};

export const update: ActiveCampaignEndpoints['fieldsUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldsUpdate']
	>(`fields/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: {
			field: compactBody({
				title: input.title,
				type: input.type,
				descript: input.descript,
				perstag: input.perstag,
				defval: input.defval,
				isrequired:
					input.isrequired === undefined ? undefined : input.isrequired ? 1 : 0,
				visible:
					input.visible === undefined ? undefined : input.visible ? 1 : 0,
				ordernum: input.ordernum,
			}),
		},
	});

	await persistRow(ctx.db.fields, ActiveCampaignField, response.field, 'field');

	await logEventFromContext(
		ctx,
		'activecampaign.fields.update',
		auditPayload(input, ['id', 'type', 'isrequired', 'visible', 'ordernum']),
		'completed',
	);
	return response;
};

/**
 * Deleting a field definition also destroys every value stored against it
 * upstream, so both the field and its cached values are evicted - leaving the
 * values behind would let the mirror describe data that no longer exists.
 */
export const remove: ActiveCampaignEndpoints['fieldsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`fields/${input.id}`,
		ctx.key,
		account,
		{ method: 'DELETE' },
	);

	await evictRow(ctx.db.fields, input.id, 'field');
	await evictChildren(ctx.db.fieldValues, 'field', input.id, 'fieldValue');

	await logEventFromContext(
		ctx,
		'activecampaign.fields.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

/**
 * Creates options in bulk for a dropdown, radio, checkbox or listbox field.
 * The field must already exist.
 */
export const createOptionsBulk: ActiveCampaignEndpoints['fieldOptionsCreateBulk'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['fieldOptionsCreateBulk']
		>('fieldOption/bulk', ctx.key, account, {
			method: 'POST',
			body: {
				fieldOptions: input.options.map((o) =>
					compactBody({
						field: o.field,
						label: o.label,
						value: o.value,
						orderid: o.orderid,
						isdefault:
							o.isdefault === undefined ? undefined : o.isdefault ? 1 : 0,
					}),
				),
			},
		});

		await persistRows(
			ctx.db.fieldOptions,
			ActiveCampaignFieldOption,
			response.fieldOptions,
			'fieldOption',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.fieldOptions.createBulk',
			{ optionCount: input.options.length, fields: ['options'] },
			'completed',
		);
		return response;
	};

// ---------------------------------------------------------------------------
// Field values
// ---------------------------------------------------------------------------

export const listValues: ActiveCampaignEndpoints['fieldValuesList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldValuesList']
	>('fieldValues', ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await persistRows(
		ctx.db.fieldValues,
		ActiveCampaignFieldValue,
		response.fieldValues,
		'fieldValue',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fieldValues.list',
		listAuditPayload(
			input,
			['limit', 'offset'],
			response.fieldValues?.length ?? 0,
		),
		'completed',
	);
	return response;
};

export const getValue: ActiveCampaignEndpoints['fieldValuesGet'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldValuesGet']
	>(`fieldValues/${input.id}`, ctx.key, account, { method: 'GET' });

	await persistRow(
		ctx.db.fieldValues,
		ActiveCampaignFieldValue,
		response.fieldValue,
		'fieldValue',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fieldValues.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return response;
};

/**
 * Sets a custom field value on a contact.
 *
 * The value is caller-supplied contact data, so it is never logged - only the
 * contact and field identifiers are.
 */
export const setValueForContact: ActiveCampaignEndpoints['fieldValuesSetForContact'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['fieldValuesSetForContact']
		>('fieldValues', ctx.key, account, {
			method: 'POST',
			body: {
				fieldValue: {
					contact: input.contact,
					field: input.field,
					value: input.value,
				},
				// Sent explicitly rather than omitted, so the default-filling
				// behaviour is the caller's decision and not inherited.
				useDefaults: input.useDefaults ?? false,
			},
		});

		await persistRow(
			ctx.db.fieldValues,
			ActiveCampaignFieldValue,
			response.fieldValue,
			'fieldValue',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.fieldValues.setForContact',
			auditPayload(input, ['contact', 'field', 'useDefaults']),
			'completed',
		);
		return response;
	};

export const updateValue: ActiveCampaignEndpoints['fieldValuesUpdate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldValuesUpdate']
	>(`fieldValues/${input.id}`, ctx.key, account, {
		method: 'PUT',
		body: {
			fieldValue: { value: input.value },
			useDefaults: input.useDefaults ?? false,
		},
	});

	await persistRow(
		ctx.db.fieldValues,
		ActiveCampaignFieldValue,
		response.fieldValue,
		'fieldValue',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fieldValues.update',
		auditPayload(input, ['id', 'useDefaults']),
		'completed',
	);
	return response;
};

export const removeValue: ActiveCampaignEndpoints['fieldValuesDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`fieldValues/${input.id}`,
		ctx.key,
		account,
		{ method: 'DELETE' },
	);

	await evictRow(ctx.db.fieldValues, input.id, 'fieldValue');

	await logEventFromContext(
		ctx,
		'activecampaign.fieldValues.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

// ---------------------------------------------------------------------------
// Field relationships
// ---------------------------------------------------------------------------

export const listRels: ActiveCampaignEndpoints['fieldRelsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldRelsList']
	>('fieldRels', ctx.key, account, {
		method: 'GET',
		query: buildPaginationQuery(input),
	});

	await persistRows(
		ctx.db.fieldRels,
		ActiveCampaignFieldRel,
		response.fieldRels,
		'fieldRel',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fieldRels.list',
		listAuditPayload(
			input,
			['limit', 'offset'],
			response.fieldRels?.length ?? 0,
		),
		'completed',
	);
	return response;
};

export const createRel: ActiveCampaignEndpoints['fieldRelsCreate'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['fieldRelsCreate']
	>('fieldRels', ctx.key, account, {
		method: 'POST',
		body: { fieldRel: { field: input.field, relid: input.relid } },
	});

	await persistRow(
		ctx.db.fieldRels,
		ActiveCampaignFieldRel,
		response.fieldRel,
		'fieldRel',
	);

	await logEventFromContext(
		ctx,
		'activecampaign.fieldRels.create',
		auditPayload(input, ['field', 'relid']),
		'completed',
	);
	return response;
};

export const removeRel: ActiveCampaignEndpoints['fieldRelsDelete'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	await makeActiveCampaignRequest<unknown>(
		`fieldRels/${input.id}`,
		ctx.key,
		account,
		{ method: 'DELETE' },
	);

	await evictRow(ctx.db.fieldRels, input.id, 'fieldRel');

	await logEventFromContext(
		ctx,
		'activecampaign.fieldRels.delete',
		auditPayload(input, ['id']),
		'completed',
	);
	return { id: input.id };
};

// ---------------------------------------------------------------------------
// Field groups
// ---------------------------------------------------------------------------

export const listGroupMembers: ActiveCampaignEndpoints['groupMembersList'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['groupMembersList']
		>('groupMembers', ctx.key, account, {
			method: 'GET',
			query: buildPaginationQuery(input),
		});

		await persistRows(
			ctx.db.groupMembers,
			ActiveCampaignGroupMember,
			response.groupMembers,
			'groupMember',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.groupMembers.list',
			listAuditPayload(
				input,
				['limit', 'offset'],
				response.groupMembers?.length ?? 0,
			),
			'completed',
		);
		return response;
	};

/**
 * Adds a custom field to a display group, which is what makes it visible on
 * contact and deal pages. Takes the field *relationship* id, not the field id.
 */
export const createGroupMember: ActiveCampaignEndpoints['groupMembersCreate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['groupMembersCreate']
		>('groupMembers', ctx.key, account, {
			method: 'POST',
			body: {
				groupMember: compactBody({
					rel_id: input.rel_id,
					group_id: input.group_id,
					ordernum: input.ordernum,
				}),
			},
		});

		await persistRow(
			ctx.db.groupMembers,
			ActiveCampaignGroupMember,
			response.groupMember,
			'groupMember',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.groupMembers.create',
			auditPayload(input, ['rel_id', 'group_id', 'ordernum']),
			'completed',
		);
		return response;
	};

export const updateGroupMember: ActiveCampaignEndpoints['groupMembersUpdate'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		const response = await makeActiveCampaignRequest<
			ActiveCampaignEndpointOutputs['groupMembersUpdate']
		>(`groupMembers/${input.id}`, ctx.key, account, {
			method: 'PUT',
			body: {
				groupMember: compactBody({
					rel_id: input.rel_id,
					group_id: input.group_id,
					ordernum: input.ordernum,
				}),
			},
		});

		await persistRow(
			ctx.db.groupMembers,
			ActiveCampaignGroupMember,
			response.groupMember,
			'groupMember',
		);

		await logEventFromContext(
			ctx,
			'activecampaign.groupMembers.update',
			auditPayload(input, ['id', 'rel_id', 'group_id', 'ordernum']),
			'completed',
		);
		return response;
	};

export const removeGroupMember: ActiveCampaignEndpoints['groupMembersDelete'] =
	async (ctx, input) => {
		const account = await resolveAccount(ctx);
		await makeActiveCampaignRequest<unknown>(
			`groupMembers/${input.id}`,
			ctx.key,
			account,
			{ method: 'DELETE' },
		);

		await evictRow(ctx.db.groupMembers, input.id, 'groupMember');

		await logEventFromContext(
			ctx,
			'activecampaign.groupMembers.delete',
			auditPayload(input, ['id']),
			'completed',
		);
		return { id: input.id };
	};

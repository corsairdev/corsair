import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestContactEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'contact';

/**
 * Lists client contacts.
 *
 * The OSS catalog has no get-contact operation, so this list — optionally
 * narrowed to a single client — is the read path. Harvest itself does expose
 * GET /v2/contacts/{id}; it is out of R1 scope.
 */
export const list: HarvestEndpoints['contactsList'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['contactsList']>(
		ctx,
		'contacts',
		{
			query: compactQuery({
				client_id: input.client_id,
				updated_since: input.updated_since,
				page: input.page,
				per_page: input.per_page,
			}),
		},
	);

	await cacheEntities(ctx.db.contacts, HarvestContactEntity, result.contacts, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.contacts.list',
		auditPayload(input, ['client_id', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/** Creates a contact under an existing client. */
export const create: HarvestEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['contactsCreate']>(
		ctx,
		'contacts',
		{
			method: 'POST',
			body: compactBody({
				client_id: input.client_id,
				first_name: input.first_name,
				last_name: input.last_name,
				title: input.title,
				email: input.email,
				phone_office: input.phone_office,
				phone_mobile: input.phone_mobile,
				fax: input.fax,
				invoice_recipient_status: input.invoice_recipient_status,
			}),
		},
	);

	await cacheEntity(ctx.db.contacts, HarvestContactEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.contacts.create',
		// Names, email and phone numbers are personal data; only the ids go to
		// the event log.
		{ client_id: input.client_id, contact_id: result.id },
		'completed',
	);
	return result;
};

/** Updates a contact. Omitted fields are left unchanged. */
export const update: HarvestEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['contactsUpdate']>(
		ctx,
		`contacts/${input.contact_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				client_id: input.client_id,
				first_name: input.first_name,
				last_name: input.last_name,
				title: input.title,
				email: input.email,
				phone_office: input.phone_office,
				phone_mobile: input.phone_mobile,
				fax: input.fax,
				invoice_recipient_status: input.invoice_recipient_status,
			}),
		},
	);

	await cacheEntity(ctx.db.contacts, HarvestContactEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.contacts.update',
		auditPayload(input, ['contact_id', 'client_id']),
		'completed',
	);
	return result;
};

/** Deletes a contact. The deletion is permanent. */
export const remove: HarvestEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(ctx, `contacts/${input.contact_id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.contacts, input.contact_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.contacts.delete',
		auditPayload(input, ['contact_id']),
		'completed',
	);
	return { success: true, id: input.contact_id };
};

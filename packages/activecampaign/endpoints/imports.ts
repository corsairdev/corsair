import { logEventFromContext } from 'corsair/core';
import { makeActiveCampaignRequest } from '../client';
import type { ActiveCampaignEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, resolveAccount } from './shared';
import type { ActiveCampaignEndpointOutputs } from './types';

/**
 * Queues contacts for asynchronous import.
 *
 * ActiveCampaign accepts up to 250 contacts per call below 400 KB and returns
 * immediately with a batch id; the rows are written in the background. Nothing
 * is mirrored here, because the response carries a batch receipt rather than
 * the contacts themselves - the imported rows only become visible through the
 * contact endpoints once processing finishes.
 *
 * `exclude_automations` is sent explicitly rather than omitted. Omitting it
 * lets ActiveCampaign apply its own default, which runs every automation
 * triggered by a list subscription - for a bulk import that can mean a
 * very large amount of outbound mail. The safe value has to be chosen by the
 * caller, so the default here is to exclude.
 */
export const createBulk: ActiveCampaignEndpoints['importsCreateBulk'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['importsCreateBulk']
	>('import/bulk_import', ctx.key, account, {
		method: 'POST',
		body: compactBody({
			contacts: input.contacts,
			// List subscriptions are nested on each contact by the bulk-import API.
			exclude_automations: input.exclude_automations ?? true,
			callback: input.callback,
		}),
	});

	// The contacts array is entirely personal data - emails, names, phone
	// numbers - so only its size is recorded.
	await logEventFromContext(
		ctx,
		'activecampaign.imports.createBulk',
		{
			contactCount: input.contacts.length,
			listCount: input.contacts.reduce(
				(count, contact) => count + (contact.subscribe?.length ?? 0),
				0,
			),
			excludeAutomations: input.exclude_automations ?? true,
			hasCallback: input.callback !== undefined,
			fields: ['contacts'],
		},
		'completed',
	);
	return response;
};

/**
 * Outstanding and recently completed import batches. ActiveCampaign returns a
 * rolling window rather than full history.
 */
export const list: ActiveCampaignEndpoints['importsList'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['importsList']
	>('import/bulk_import', ctx.key, account, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'activecampaign.imports.list',
		auditPayload(input, []),
		'completed',
	);
	return response;
};

/**
 * Progress of a single batch.
 *
 * `batchId` is required - the endpoint answers 400 with
 * "'batchId' is a required field." when it is absent, so it is a required
 * input rather than an optional filter.
 */
export const getStatus: ActiveCampaignEndpoints['importsGetStatus'] = async (
	ctx,
	input,
) => {
	const account = await resolveAccount(ctx);
	const response = await makeActiveCampaignRequest<
		ActiveCampaignEndpointOutputs['importsGetStatus']
	>('import/info', ctx.key, account, {
		method: 'GET',
		query: { batchId: input.batchId },
	});

	await logEventFromContext(
		ctx,
		'activecampaign.imports.getStatus',
		auditPayload(input, ['batchId']),
		'completed',
	);
	return response;
};

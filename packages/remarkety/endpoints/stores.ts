import type { RemarketyEndpoints } from '..';
import { segment } from '../client';
import { call, storePath } from './call';
import {
	RemarketyEndpointInputSchemas as Inputs,
	RemarketyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Creates a store. The `apiKey` is the key Remarkety will sync that store with,
 * which is a different secret from the token this plugin authenticates with.
 */
export const create: RemarketyEndpoints['storesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.create',
			input: Inputs.storesCreate,
			output: Outputs.storesCreate,
		},
		input,
		({ name, apiKey, platform, domain }) => ({
			method: 'POST',
			path: '/stores',
			body: { name, apiKey, platform, domain },
			// Two creates make two stores.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				storeId: result.id ?? undefined,
				platform: result.platform ?? undefined,
			}),
		},
	);

/**
 * Updates a store.
 *
 * The route is `PUT /stores` with the `id` in the body, not
 * `PUT /stores/{storeId}`, so the id is part of the payload.
 */
export const update: RemarketyEndpoints['storesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.update',
			input: Inputs.storesUpdate,
			output: Outputs.storesUpdate,
		},
		input,
		({ id, name, apiKey, platform, domain }) => ({
			method: 'PUT',
			path: '/stores',
			body: { id, name, apiKey, platform, domain },
			// A PUT with the same body leaves the same store.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				storeId: result.id ?? parsed.id,
				platform: result.platform ?? undefined,
			}),
		},
	);

export const get: RemarketyEndpoints['storesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.get',
			input: Inputs.storesGet,
			output: Outputs.storesGet,
		},
		input,
		({ storeId }) => ({
			method: 'GET',
			path: storePath(storeId),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				name: result.name ?? undefined,
				platform: result.platform ?? undefined,
			}),
		},
	);

export const remove: RemarketyEndpoints['storesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.delete',
			input: Inputs.storesDelete,
			output: Outputs.storesDelete,
		},
		input,
		({ storeId }) => ({
			method: 'DELETE',
			path: storePath(storeId),
			// A second delete finds nothing; the store is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ storeId: parsed.storeId }),
		},
	);

/**
 * The store's sync status.
 *
 * This is the check that Remarkety is actually receiving the store's data, and the
 * one place a sync failure surfaces: `syncLastError` is set only when
 * `syncStatus` is ERROR.
 */
export const status: RemarketyEndpoints['storeStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.status',
			input: Inputs.storeStatus,
			output: Outputs.storeStatus,
		},
		input,
		({ storeId }) => ({
			method: 'GET',
			path: storePath(storeId, '/status'),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				syncStatus: result.syncStatus ?? undefined,
				hasError:
					result.syncLastError !== null && result.syncLastError !== undefined,
			}),
		},
	);

export const createContact: RemarketyEndpoints['contactsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({
			storeId,
			email,
			firstName,
			lastName,
			tags,
			properties,
			doubleOptin,
			allowedMarketing,
		}) => ({
			method: 'POST',
			path: storePath(storeId, `/contacts`),
			body: {
				email,
				firstName,
				lastName,
				tags,
				properties,
				doubleOptin,
				allowedMarketing,
			},
			// Creating the same contact twice sends two marketing permissions; there is
			// no documented upsert.
			replayable: false,
		}),
		{
			log: (_, result) => ({ keys: Object.keys(result).length }),
		},
	);

export const unsubscribe: RemarketyEndpoints['contactsUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.unsubscribe',
			input: Inputs.contactsUnsubscribe,
			output: Outputs.contactsUnsubscribe,
		},
		input,
		({ storeId, email }) => ({
			method: 'POST',
			path: storePath(storeId, '/contacts/unsubscribe'),
			body: { email },
			// Unsubscribing an already-unsubscribed address leaves it unsubscribed.
			replayable: true,
		}),
		{
			log: (_, result) => ({ keys: Object.keys(result).length }),
		},
	);

/** A one-segment path, exported so the campaign routes can reuse it. */
export function campaignPath(
	storeId: string | number,
	suffix = '',
): string {
	return storePath(storeId, `/campaigns${suffix}`);
}

/** The campaign id as a path segment, used by the per-campaign routes. */
export function campaignIdPath(
	storeId: string | number,
	campaignId: number,
): string {
	return campaignPath(storeId, `/${segment(campaignId)}`);
}

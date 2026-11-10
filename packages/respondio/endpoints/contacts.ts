import type { RespondioEndpoints } from '..';
import { contactIdentifier } from '../client';
import { call } from './call';
import {
	RespondioEndpointInputSchemas as Inputs,
	RespondioEndpointOutputSchemas as Outputs,
} from './types';

export const get: RespondioEndpoints['contactGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.get',
			input: Inputs.contactGet,
			output: Outputs.contactGet,
		},
		input,
		({ identifier }) => ({
			method: 'GET',
			path: `/contact/${contactIdentifier(identifier)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				contactId: result.id ?? undefined,
				status: result.status ?? undefined,
				tags: result.tags?.length ?? 0,
			}),
		},
	);

/**
 * A new contact needs a delay before the next action on it, because respond.io
 * finishes creating it asynchronously. The docs say so explicitly, which is why
 * this is not something a caller should chain immediately.
 */
export const create: RespondioEndpoints['contactCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.create',
			input: Inputs.contactCreate,
			output: Outputs.contactCreate,
		},
		input,
		({ identifier, ...fields }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}`,
			body: fields,
			// Creating twice at the same identifier is a conflict rather than a second
			// contact, but respond.io needs processing time, so a replay can land
			// while the first is still being created.
			replayable: false,
		}),
		{
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

export const update: RespondioEndpoints['contactUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.update',
			input: Inputs.contactUpdate,
			output: Outputs.contactUpdate,
		},
		input,
		({ identifier, ...fields }) => ({
			method: 'PUT',
			path: `/contact/${contactIdentifier(identifier)}`,
			body: fields,
			// A PUT with the same body leaves the same contact, so a replay is safe.
			replayable: true,
		}),
		{
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

export const remove: RespondioEndpoints['contactDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.delete',
			input: Inputs.contactDelete,
			output: Outputs.contactDelete,
		},
		input,
		({ identifier }) => ({
			method: 'DELETE',
			path: `/contact/${contactIdentifier(identifier)}`,
			// A second delete finds nothing; the contact is already gone.
			replayable: false,
		}),
		{
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

/**
 * Create or update in one call, which is the safe choice when you do not know
 * whether the contact exists yet. It is a different route from create, not a flag.
 */
export const upsert: RespondioEndpoints['contactUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.upsert',
			input: Inputs.contactUpsert,
			output: Outputs.contactUpsert,
		},
		input,
		({ identifier, ...fields }) => ({
			method: 'POST',
			path: `/contact/create_or_update/${contactIdentifier(identifier)}`,
			body: fields,
			// An upsert with the same body leaves the same contact, so a replay is
			// safe even though it may create on the first call.
			replayable: true,
		}),
		{
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

export const merge: RespondioEndpoints['contactMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.merge',
			input: Inputs.contactMerge,
			output: Outputs.contactMerge,
		},
		input,
		({ identifier, mergeWith }) => ({
			method: 'POST',
			path: '/contact/merge',
			body: {
				identifier: contactIdentifier(identifier),
				mergeWith: contactIdentifier(mergeWith),
			},
			// The second contact is removed by the merge, so a replay finds nothing to
			// merge.
			replayable: false,
		}),
		{
			log: (parsed) => ({
				identifier: parsed.identifier,
				mergedWith: parsed.mergeWith,
			}),
		},
	);

export const list: RespondioEndpoints['contactList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.list',
			input: Inputs.contactList,
			output: Outputs.contactList,
		},
		input,
		({ filter, search, timezone, limit, cursorId }) => ({
			method: 'POST',
			path: '/contact/list',
			body: { filter, search, timezone, limit, cursorId },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				hasNext:
					result.pagination?.next !== null &&
					result.pagination?.next !== undefined,
			}),
		},
	);

export const addTags: RespondioEndpoints['contactAddTags'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.addTags',
			input: Inputs.contactAddTags,
			output: Outputs.contactAddTags,
		},
		input,
		({ identifier, tags }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/tag`,
			body: { tags },
			// Adding a tag that is already there leaves the same set.
			replayable: true,
		}),
		{
			log: (parsed) => ({ tags: parsed.tags.length }),
		},
	);

export const deleteTags: RespondioEndpoints['contactDeleteTags'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contact.deleteTags',
			input: Inputs.contactDeleteTags,
			output: Outputs.contactDeleteTags,
		},
		input,
		({ identifier, tags }) => ({
			method: 'DELETE',
			path: `/contact/${contactIdentifier(identifier)}/tag`,
			body: { tags },
			// Removing a tag that is already gone leaves the same set.
			replayable: true,
		}),
		{
			log: (parsed) => ({ tags: parsed.tags.length }),
		},
	);

export const channels: RespondioEndpoints['contactChannels'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.channels',
			input: Inputs.contactChannels,
			output: Outputs.contactChannels,
		},
		input,
		({ identifier }) => ({
			method: 'GET',
			// Plural on this route alone: every other contact sub-route is singular.
			path: `/contact/${contactIdentifier(identifier)}/channels`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ channels: result.items?.length ?? 0 }),
		},
	);

export const lifecycle: RespondioEndpoints['contactLifecycle'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contact.lifecycle',
			input: Inputs.contactLifecycle,
			output: Outputs.contactLifecycle,
		},
		input,
		({ identifier, lifecycle: stage }) => ({
			method: 'POST',
			path: `/contact/${contactIdentifier(identifier)}/lifecycle/update`,
			body: { lifecycle: stage },
			// Setting the same stage again leaves the contact in that stage.
			replayable: true,
		}),
		{
			log: (parsed) => ({ lifecycle: parsed.lifecycle }),
		},
	);

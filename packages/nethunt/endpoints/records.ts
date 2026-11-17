import type { z } from 'zod';
import type { NethuntContext, NethuntEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NethuntEndpointInputSchemas as Inputs,
	NethuntEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Every read route answers a bare array of records. A 404 with an empty body
 * means the folder does not exist, which the client reports as a 404.
 */
function asArray(
	// unknown: the provider's array, or something that is not one.
	raw: unknown,
	name: string,
): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(`Expected a NetHunt ${name} array, got ${typeof raw}`);
	}
	return raw;
}

/**
 * Delete and link answer `{}`. The acknowledgement carries no data, but it must
 * be an object: null or a bare value means the contract changed.
 */
function expectAck(
	// unknown: the provider's answer, checked here before a success is built.
	raw: unknown,
	name: string,
): void {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
		throw new Error(`Expected NetHunt ${name} to answer an object`);
	}
}

/** Finds records by id or a text query such as `Name:Doe`. */
export const find: NethuntEndpoints['recordsFind'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.find',
			input: Inputs.recordsFind,
			output: Outputs.recordsFind,
		},
		input,
		({ folderId, recordId, query, limit }) => ({
			method: 'GET',
			path: `/zapier/searches/find-record/${segment(folderId)}`,
			query: { recordId, query, limit },
		}),
		{
			shape: (raw) => ({ records: asArray(raw, 'record') }),
			log: (_, result) => ({ count: result.records.length }),
		},
	);

/** Records created after `since`. NetHunt defaults the window to 24 hours. */
export const recent: NethuntEndpoints['recordsRecent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.recent',
			input: Inputs.recordsRecent,
			output: Outputs.recordsRecent,
		},
		input,
		({ folderId, since, limit }) => ({
			method: 'GET',
			path: `/zapier/triggers/new-record/${segment(folderId)}`,
			query: { since, limit },
		}),
		{
			shape: (raw) => ({ records: asArray(raw, 'record') }),
			log: (_, result) => ({ count: result.records.length }),
		},
	);

/**
 * Records updated after `since`, optionally narrowed to named fields. NetHunt
 * repeats the `fieldName` parameter rather than taking a list.
 */
export const updated: NethuntEndpoints['recordsUpdated'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.updated',
			input: Inputs.recordsUpdated,
			output: Outputs.recordsUpdated,
		},
		input,
		({ folderId, fieldNames, since, limit }) => ({
			method: 'GET',
			path: `/zapier/triggers/updated-record/${segment(folderId)}`,
			query: {
				fieldName: fieldNames,
				since,
				limit,
			},
		}),
		{
			shape: (raw) => ({ records: asArray(raw, 'record') }),
			log: (_, result) => ({ count: result.records.length }),
		},
	);

/**
 * The audit trail: who changed what, when, with the before and after value of
 * each field. This is the only route that reports a delete.
 */
export const changes: NethuntEndpoints['recordsChanges'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.changes',
			input: Inputs.recordsChanges,
			output: Outputs.recordsChanges,
		},
		input,
		({ folderId, recordId, fieldNames, since, limit }) => ({
			method: 'GET',
			path: `/zapier/triggers/record-change/${segment(folderId)}`,
			query: {
				recordId,
				fieldName: fieldNames,
				since,
				limit,
			},
		}),
		{
			shape: (raw) => ({ changes: asArray(raw, 'change') }),
			log: (_, result) => ({ count: result.changes.length }),
		},
	);

/**
 * Creates one record. `fields` is a flat map of the folder's field names, and
 * `timeZone` is required so NetHunt can interpret date values.
 */
export const create: NethuntEndpoints['recordsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.create',
			input: Inputs.recordsCreate,
			output: Outputs.recordsCreate,
		},
		input,
		({ folderId, timeZone, fields }) => ({
			method: 'POST',
			path: `/zapier/actions/create-record/${segment(folderId)}`,
			body: { timeZone, fields },
		}),
		{
			log: (_, result) => ({ recordId: result.recordId ?? undefined }),
		},
	);

/**
 * Updates one field at a time through `fieldActions`, not through a flat map,
 * so `remove` and `add` can express a multi-value change.
 */
export const update: NethuntEndpoints['recordsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.update',
			input: Inputs.recordsUpdate,
			output: Outputs.recordsUpdate,
		},
		input,
		({ recordId, overwrite, fieldActions }) => ({
			method: 'POST',
			path: `/zapier/actions/update-record/${segment(recordId)}`,
			query: { overwrite },
			body: { fieldActions },
		}),
		{
			log: ({ recordId }, result) => ({
				recordId,
				updatedAt: result.updatedAt ?? undefined,
			}),
		},
	);

/**
 * NetHunt deletes over POST and answers an empty object, so the success flag is
 * derived from the call that already happened rather than read from the body.
 */
export const remove: NethuntEndpoints['recordsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.delete',
			input: Inputs.recordsDelete,
			output: Outputs.recordsDelete,
		},
		input,
		({ recordId }) => ({
			method: 'POST',
			path: `/zapier/actions/delete-record/${segment(recordId)}`,
		}),
		{
			// NetHunt documents `{}`; anything that is not an object means the
			// contract changed, so the call fails instead of reporting a delete.
			shape: (raw, { recordId }) => {
				expectAck(raw, 'delete-record');
				return { deleted: true, recordId };
			},
			log: ({ recordId }) => ({ recordId }),
		},
	);

export const comment: NethuntEndpoints['recordsComment'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.comment',
			input: Inputs.recordsComment,
			output: Outputs.recordsComment,
		},
		input,
		({ recordId, text }) => ({
			method: 'POST',
			path: `/zapier/actions/create-comment/${segment(recordId)}`,
			body: { text },
		}),
		{
			log: ({ recordId }, result) => ({
				recordId,
				commentId: result.commentId ?? undefined,
			}),
		},
	);

export const callLog: NethuntEndpoints['recordsCallLog'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.callLog',
			input: Inputs.recordsCallLog,
			output: Outputs.recordsCallLog,
		},
		input,
		({ recordId, text, time, duration }) => ({
			method: 'POST',
			path: `/zapier/actions/create-call-log/${segment(recordId)}`,
			body: { text, time, duration },
		}),
		{
			log: ({ recordId }, result) => ({
				recordId,
				callLogId: result.callLogId ?? undefined,
			}),
		},
	);

/**
 * Attaches an existing Gmail thread to a record. Answers an empty object on
 * success, so the result reports the ids that were linked.
 */
export const linkThread: NethuntEndpoints['recordsLinkThread'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.linkThread',
			input: Inputs.recordsLinkThread,
			output: Outputs.recordsLinkThread,
		},
		input,
		({ recordId, gmailThreadId }) => ({
			method: 'POST',
			path: `/zapier/actions/link-gmail-thread/${segment(recordId)}`,
			body: { gmailThreadId },
		}),
		{
			shape: (raw, { recordId, gmailThreadId }) => {
				expectAck(raw, 'link-gmail-thread');
				return {
					linked: true,
					recordId,
					gmailThreadId,
				};
			},
			log: ({ recordId }) => ({ recordId }),
		},
	);

/** One timeline trigger: comments, call logs or Drive files created lately. */
function timeline<Output extends z.ZodType>(
	ctx: NethuntContext,
	event: string,
	trigger: string,
	key: string,
	// unknown: the caller's raw input, parsed by the shared timeline schema.
	input: unknown,
	output: Output,
): Promise<z.output<Output>> {
	return call(
		ctx,
		{ event, input: Inputs.recordsRecentComments, output },
		input,
		({ folderId, since, limit }) => ({
			method: 'GET',
			path: `/zapier/triggers/${trigger}/${segment(folderId)}`,
			query: { since, limit },
		}),
		{
			shape: (raw) => ({ [key]: asArray(raw, trigger) }),
			log: () => ({ trigger }),
		},
	);
}

/** Comments added to records in a folder after a timestamp. */
export const recentComments: NethuntEndpoints['recordsRecentComments'] = (
	ctx,
	input,
) =>
	timeline(
		ctx,
		'records.recentComments',
		'new-comment',
		'comments',
		input,
		Outputs.recordsRecentComments,
	);

/** Calls logged on records in a folder after a timestamp. */
export const recentCallLogs: NethuntEndpoints['recordsRecentCallLogs'] = (
	ctx,
	input,
) =>
	timeline(
		ctx,
		'records.recentCallLogs',
		'new-call-log',
		'callLogs',
		input,
		Outputs.recordsRecentCallLogs,
	);

/** Google Drive files attached to records in a folder after a timestamp. */
export const recentFiles: NethuntEndpoints['recordsRecentFiles'] = (
	ctx,
	input,
) =>
	timeline(
		ctx,
		'records.recentFiles',
		'new-gdrivefile',
		'files',
		input,
		Outputs.recordsRecentFiles,
	);

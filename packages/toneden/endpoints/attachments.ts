import type { ToneDenEndpoints } from '..';
import { segment } from '../client';
import { call, writeBody } from './call';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './types';

export const listForUser: ToneDenEndpoints['attachmentsListForUser'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.listForUser',
			input: ToneDenEndpointInputSchemas.listUserAttachments,
			output: ToneDenEndpointOutputSchemas.listUserAttachments,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `users/${segment(parsed.user_id)}/attachments`,
			query: {
				type: parsed.type,
				offset: parsed.offset,
				limit: parsed.limit,
			},
		}),
		{
			log: (parsed, result) => ({
				user_id: parsed.user_id,
				attachments: result.attachments.length,
			}),
		},
	);

export const get: ToneDenEndpoints['attachmentsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'attachments.get',
			input: ToneDenEndpointInputSchemas.getAttachment,
			output: ToneDenEndpointOutputSchemas.getAttachment,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `attachments/${segment(parsed.attachment_id)}`,
		}),
		{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
	);

export const create: ToneDenEndpoints['attachmentsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.create',
			input: ToneDenEndpointInputSchemas.createAttachment,
			output: ToneDenEndpointOutputSchemas.createAttachment,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'attachments',
			// unknown: the input schema validated every value; writeBody only copies them.
			body: writeBody(parsed as Record<string, unknown>, []),
		}),
		{ log: (parsed) => ({ type: parsed.type }) },
	);

export const update: ToneDenEndpoints['attachmentsUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.update',
			input: ToneDenEndpointInputSchemas.updateAttachment,
			output: ToneDenEndpointOutputSchemas.updateAttachment,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `attachments/${segment(parsed.attachment_id)}`,
			// unknown: the input schema validated every value; writeBody only copies them.
			body: writeBody(parsed as Record<string, unknown>, ['attachment_id']),
		}),
		{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
	);

export const remove: ToneDenEndpoints['attachmentsDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.delete',
			input: ToneDenEndpointInputSchemas.deleteAttachment,
			output: ToneDenEndpointOutputSchemas.deleteAttachment,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `attachments/${segment(parsed.attachment_id)}`,
		}),
		{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
	);

/**
 * The five analytics routes differ only in their sub-path, so they share one
 * request builder. Each exported function keeps its own name and event.
 */
function statsRequest(
	attachmentId: number,
	subPath: string,
	query?: { start_date?: string; aggregate_interval?: string },
) {
	return {
		method: 'GET' as const,
		path: `attachments/${segment(attachmentId)}/${subPath}`,
		...(query ? { query } : {}),
	};
}

export const entries: ToneDenEndpoints['attachmentsEntries'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.entries',
			input: ToneDenEndpointInputSchemas.attachmentEntries,
			output: ToneDenEndpointOutputSchemas.attachmentEntries,
		},
		input,
		(parsed) =>
			statsRequest(parsed.attachment_id, 'entries', {
				start_date: parsed.start_date,
				aggregate_interval: parsed.aggregate_interval,
			}),
		{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
	);

export const entriesTotals: ToneDenEndpoints['attachmentsEntriesTotals'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'attachments.entriesTotals',
				input: ToneDenEndpointInputSchemas.attachmentEntriesTotals,
				output: ToneDenEndpointOutputSchemas.attachmentEntriesTotals,
			},
			input,
			(parsed) => statsRequest(parsed.attachment_id, 'entries/totals'),
			{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
		);

export const unlocks: ToneDenEndpoints['attachmentsUnlocks'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.unlocks',
			input: ToneDenEndpointInputSchemas.attachmentUnlocks,
			output: ToneDenEndpointOutputSchemas.attachmentUnlocks,
		},
		input,
		(parsed) =>
			statsRequest(parsed.attachment_id, 'unlocks', {
				start_date: parsed.start_date,
				aggregate_interval: parsed.aggregate_interval,
			}),
		{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
	);

export const unlocksTotals: ToneDenEndpoints['attachmentsUnlocksTotals'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'attachments.unlocksTotals',
				input: ToneDenEndpointInputSchemas.attachmentUnlocksTotals,
				output: ToneDenEndpointOutputSchemas.attachmentUnlocksTotals,
			},
			input,
			(parsed) => statsRequest(parsed.attachment_id, 'unlocks/totals'),
			{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
		);

export const unlockPlatforms: ToneDenEndpoints['attachmentsUnlockPlatforms'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'attachments.unlockPlatforms',
				input: ToneDenEndpointInputSchemas.attachmentUnlockPlatforms,
				output: ToneDenEndpointOutputSchemas.attachmentUnlockPlatforms,
			},
			input,
			(parsed) => statsRequest(parsed.attachment_id, 'unlocks/platforms'),
			{ log: (parsed) => ({ attachment_id: parsed.attachment_id }) },
		);

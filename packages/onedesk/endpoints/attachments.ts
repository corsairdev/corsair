import { File } from 'node:buffer';
import type { OnedeskEndpoints } from '..';
import { OnedeskAPIError } from '../client';
import { call } from './call';
import { withNextOffset } from './shape';
import {
	OnedeskEndpointInputSchemas as Inputs,
	OnedeskEndpointOutputSchemas as Outputs,
} from './types';

/** The base64 alphabet, padded to a multiple of four. */
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * OneDesk takes attachment bytes as multipart, the same way for a bare upload
 * and for attaching to a record. The base64 input is decoded here so the
 * caller can pass a file straight from an agent's tool output.
 *
 * The part keeps its filename: a `Blob` has no name, and OneDesk records the
 * part name as the attachment name, so the name travels both in the part
 * metadata and as its own field.
 */
function multipartFile(parsed: {
	fileName: string;
	contentType?: string;
	contentBase64: string;
}): Record<string, string | Blob> {
	// base64 is a fixed alphabet in groups of four. A string outside it is
	// truncated silently by Buffer.from, which would upload a corrupt file.
	const normalised = parsed.contentBase64.replace(/\s+/g, '');
	if (!BASE64_PATTERN.test(normalised)) {
		throw new OnedeskAPIError(
			'The attachment is not valid base64: contentBase64 must use the base64 alphabet and be a multiple of four characters.',
		);
	}
	const bytes = Buffer.from(normalised, 'base64');
	if (bytes.length === 0) {
		throw new OnedeskAPIError(
			'The attachment is empty: contentBase64 did not decode to any bytes.',
		);
	}
	// A File, not the bare global: imported from node:buffer so the builtin is
	// resolved per runtime rather than taken from whatever global scope the
	// caller has. A File carries its name into the multipart part, which is
	// what OneDesk records; a plain Blob would arrive as "blob" and lose the
	// extension.
	return {
		file: new File([new Uint8Array(bytes)], parsed.fileName, {
			type: parsed.contentType ?? 'application/octet-stream',
		}),
	};
}

/**
 * The name also travels as its own field, because a File's name reaches the
 * server only through the part header.
 */
function fileWithName(parsed: {
	fileName: string;
	contentType?: string;
	contentBase64: string;
}): Record<string, string | Blob> {
	return { ...multipartFile(parsed), fileName: parsed.fileName };
}

export const attachmentsFilter: OnedeskEndpoints['attachmentsFilter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.filter',
			input: Inputs.attachmentsFilter,
			output: Outputs.attachmentsFilter,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/attachments/filter',
			body: parsed,
		}),
		{
			shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const attachmentsFilterDetails: OnedeskEndpoints['attachmentsFilterDetails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'attachments.filterDetails',
				input: Inputs.attachmentsFilterDetails,
				output: Outputs.attachmentsFilterDetails,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/attachments/filter/details',
				body: parsed,
			}),
			{
				shape: (raw, parsed) => withNextOffset(raw, parsed.offset),
				log: (_, result) => ({ count: result.data.length }),
			},
		);

export const attachmentsGet: OnedeskEndpoints['attachmentsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.get',
			input: Inputs.attachmentsGet,
			output: Outputs.attachmentsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/attachments/externalId/${encodeURIComponent(parsed.externalId)}`,
		}),
	);

export const attachmentsUpload: OnedeskEndpoints['attachmentsUpload'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'attachments.upload',
			input: Inputs.attachmentsUpload,
			output: Outputs.attachmentsUpload,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/attachments/',
			formData: fileWithName(parsed),
		}),
		{
			log: (parsed, result) => ({
				fileName: parsed.fileName,
				externalId: result.data ?? undefined,
			}),
		},
	);

/**
 * The four attach routes differ only in the segment before the id, so one
 * factory builds all of them. Each is `read`-free: attaching changes the
 * target record.
 */
function attachTo(segment: string, event: string) {
	return ((ctx, input) =>
		call(
			ctx,
			{
				event,
				input: Inputs.attachmentsAttachToItem,
				output: Outputs.attachmentsAttachToItem,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/attachments/${segment}/${encodeURIComponent(parsed.externalId)}`,
				formData: fileWithName(parsed),
			}),
			{
				log: (parsed, result) => ({
					targetId: parsed.externalId,
					externalId: result.data ?? undefined,
				}),
			},
		)) as OnedeskEndpoints['attachmentsAttachToItem'];
}

export const attachmentsAttachToItem = attachTo(
	'item',
	'attachments.attachToItem',
);
export const attachmentsAttachToProject = attachTo(
	'project',
	'attachments.attachToProject',
);
export const attachmentsAttachToPortfolio = attachTo(
	'portfolio',
	'attachments.attachToPortfolio',
);
export const attachmentsAttachToOrganization = attachTo(
	'customer-organization',
	'attachments.attachToOrganization',
);

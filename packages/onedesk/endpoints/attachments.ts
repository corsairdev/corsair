import type { OnedeskEndpoints } from '..';
import { OnedeskAPIError } from '../client';
import { call } from './call';
import { withNextOffset } from './shape';
import {
	OnedeskEndpointInputSchemas as Inputs,
	OnedeskEndpointOutputSchemas as Outputs,
} from './types';

/**
 * OneDesk takes attachment bytes as multipart, the same way for a bare upload
 * and for attaching to a record. The base64 input is decoded here so the
 * caller can pass a file straight from an agent's tool output.
 */
function multipartFile(parsed: {
	fileName: string;
	contentType?: string;
	contentBase64: string;
}): Record<string, string | Blob> {
	const bytes = Buffer.from(parsed.contentBase64, 'base64');
	if (bytes.length === 0) {
		throw new OnedeskAPIError(
			'The attachment is empty: contentBase64 did not decode to any bytes.',
		);
	}
	return {
		file: new Blob([new Uint8Array(bytes)], {
			type: parsed.contentType ?? 'application/octet-stream',
		}),
	};
}

/**
 * A Blob carries no filename, and OneDesk shows the name in its UI, so the
 * name is sent as an extra multipart field where the API tolerates it.
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

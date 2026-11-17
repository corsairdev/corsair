import type { SupportbeeEndpoints } from '..';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Decodes the base64 a caller passes into the bytes the upload sends. A data URI
 * prefix is accepted and dropped, so a value copied straight out of a browser
 * works.
 */
function decodeFileContent(content: string): Buffer {
	const dataUriIndex = content.indexOf(';base64,');
	const base64 = (
		dataUriIndex === -1 ? content : content.slice(dataUriIndex + 8)
	).trim();
	const clean = base64.replace(/\s+/g, '');
	if (clean.length === 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) {
		throw new Error('Invalid base64 content provided for the file upload');
	}
	return Buffer.from(clean, 'base64');
}

/**
 * Uploads one file as `multipart/form-data`. The field name is `files[]`, which
 * is what the route documents, and the reply carries an id to use in
 * `content.attachment_ids` on a reply, comment, draft or ticket.
 */
export const create: SupportbeeEndpoints['attachmentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'attachments.create',
			input: Inputs.attachmentsCreate,
			output: Outputs.attachmentsCreate,
		},
		input,
		({ filename, content, content_type }) => {
			const form = new FormData();
			const bytes = decodeFileContent(content);
			form.append(
				'files[]',
				new Blob([bytes], content_type ? { type: content_type } : undefined),
				filename,
			);
			return { method: 'POST', path: '/attachments', form };
		},
		{
			// The filename can name a person or a document, so only the id is logged.
			log: (_, result) => ({ attachmentId: result.id ?? undefined }),
		},
	);

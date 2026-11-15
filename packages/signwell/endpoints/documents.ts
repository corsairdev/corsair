import { logEventFromContext } from 'corsair/core';
import type { SignwellEndpoints } from '..';
import { makeSignwellRequest, segment } from '../client';
import { call, deletion } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignwellEndpoints['documentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.get',
			input: Inputs.documentsGet,
			output: Outputs.documentsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/documents/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				documentId: id,
				status: result.status ?? undefined,
			}),
		},
	);

export const create: SignwellEndpoints['documentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.create',
			input: Inputs.documentsCreate,
			output: Outputs.documentsCreate,
		},
		input,
		({ test_mode, ...body }) => ({
			method: 'POST',
			path: '/v1/documents',
			body: test_mode === undefined ? body : { test_mode, ...body },
			headers: testModeHeader(test_mode),
		}),
		{
			log: (parsed, result) => ({
				documentId: result.id,
				status: result.status ?? undefined,
				testMode: result.test_mode,
				recipients: parsed.recipients.length,
				draft: parsed.draft ?? false,
			}),
		},
	);

export const createFromTemplate: SignwellEndpoints['documentsCreateFromTemplate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'documents.createFromTemplate',
				input: Inputs.documentsCreateFromTemplate,
				output: Outputs.documentsCreateFromTemplate,
			},
			input,
			({ test_mode, ...body }) => ({
				method: 'POST',
				path: '/v1/document_templates/documents',
				body: test_mode === undefined ? body : { test_mode, ...body },
				headers: testModeHeader(test_mode),
			}),
			{
				log: (parsed, result) => ({
					documentId: result.id,
					status: result.status ?? undefined,
					testMode: result.test_mode,
					recipients: parsed.recipients.length,
				}),
			},
		);

export const send: SignwellEndpoints['documentsSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.send',
			input: Inputs.documentsSend,
			output: Outputs.documentsSend,
		},
		input,
		({ id, test_mode, ...body }) => ({
			method: 'POST',
			path: `/v1/documents/${segment(id)}/send`,
			body: test_mode === undefined ? body : { test_mode, ...body },
			headers: testModeHeader(test_mode),
		}),
		{
			log: ({ id }, result) => ({
				documentId: id,
				status: result.status ?? undefined,
				testMode: result.test_mode,
			}),
		},
	);

export const updateRecipients: SignwellEndpoints['documentsUpdateRecipients'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'documents.updateRecipients',
				input: Inputs.documentsUpdateRecipients,
				output: Outputs.documentsUpdateRecipients,
			},
			input,
			({ id, recipients }) => ({
				method: 'PATCH',
				path: `/v1/documents/${segment(id)}/recipients`,
				body: { recipients },
			}),
			{
				log: ({ id, recipients }) => ({
					documentId: id,
					recipients: recipients.length,
				}),
			},
		);

export const updateAuthentication: SignwellEndpoints['documentsUpdateAuthentication'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'documents.updateAuthentication',
				input: Inputs.documentsUpdateAuthentication,
				output: Outputs.documentsUpdateAuthentication,
			},
			input,
			({ id, recipients }) => ({
				method: 'PATCH',
				path: `/v1/documents/${segment(id)}/authentication`,
				body: { recipients },
			}),
			{
				// The passcodes are never logged, only how many recipients changed.
				log: ({ id, recipients }) => ({
					documentId: id,
					recipients: recipients.length,
				}),
			},
		);

export const sendReminder: SignwellEndpoints['documentsSendReminder'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.sendReminder',
			input: Inputs.documentsSendReminder,
			output: Outputs.documentsSendReminder,
		},
		input,
		({ id, recipients }) => ({
			method: 'POST',
			path: `/v1/documents/${segment(id)}/remind`,
			body: recipients === undefined ? {} : { recipients },
		}),
		{
			log: ({ id, recipients }) => ({
				documentId: id,
				requested: recipients?.length ?? 0,
			}),
		},
	);

export const remove: SignwellEndpoints['documentsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.delete',
			input: Inputs.documentsDelete,
			output: Outputs.documentsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/v1/documents/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, 'documents.delete', id),
			log: ({ id }) => ({ documentId: id }),
		},
	);

/**
 * The completed document is a PDF or ZIP. core's client reads a non-JSON body
 * with `response.text()`, which corrupts binary, so this asks for
 * `url_only=true` and returns the temporary download URL SignWell generates.
 */
export const getCompletedPdf: SignwellEndpoints['documentsGetCompletedPdf'] =
	async (ctx, input) => {
		const parsed = Inputs.documentsGetCompletedPdf.parse(input ?? {});
		const url = await downloadUrl(
			ctx,
			`/v1/documents/${segment(parsed.id)}/completed_pdf`,
			{
				url_only: true,
				audit_page: parsed.audit_page,
				file_format: parsed.file_format,
			},
			'documents.getCompletedPdf',
		);

		await logEventFromContext(
			ctx,
			'signwell.documents.getCompletedPdf',
			{ documentId: parsed.id, fileFormat: parsed.file_format ?? 'pdf' },
			'completed',
		);
		return { file_url: url, document_id: parsed.id };
	};

/** NOM-151 is the Mexican e-signature certificate, available only where enabled. */
export const getNom151Certificate: SignwellEndpoints['documentsGetNom151Certificate'] =
	async (ctx, input) => {
		const parsed = Inputs.documentsGetNom151Certificate.parse(input ?? {});
		const url = await downloadUrl(
			ctx,
			`/v1/documents/${segment(parsed.id)}/nom151_certificate`,
			{ url_only: true },
			'documents.getNom151Certificate',
		);

		await logEventFromContext(
			ctx,
			'signwell.documents.getNom151Certificate',
			{ documentId: parsed.id },
			'completed',
		);
		return { file_url: url, document_id: parsed.id };
	};

/**
 * Reads the download URL from a `url_only=true` answer. A missing URL is a real
 * failure (the document is not finished, or the feature is off), so it throws
 * rather than returning an empty string.
 */
async function downloadUrl(
	ctx: Parameters<SignwellEndpoints['documentsGetCompletedPdf']>[0],
	path: string,
	query: Record<string, string | number | boolean | undefined>,
	operation: string,
): Promise<string> {
	// unknown: the url_only answer is `{ file_url }`, checked below.
	const raw = await makeSignwellRequest(ctx.key, {
		method: 'GET',
		path,
		query,
	});

	const record =
		raw !== null && typeof raw === 'object'
			? (raw as Record<string, unknown>) // unknown: url_only answer, checked next
			: undefined;
	const fileUrl = record?.file_url;
	if (typeof fileUrl !== 'string' || fileUrl.length === 0) {
		throw new Error(
			`${operation} asked SignWell for a download URL and did not get one. The document may not be complete, or the feature is not enabled on this account.`,
		);
	}
	return fileUrl;
}

/**
 * SignWell also accepts test mode as a header, where lowercase `true` and
 * `false` are the only valid values and the header wins over the body. The body
 * field is sent too, because the draft-to-send path documents that test mode
 * does not carry over and a caller should not have to know which one applies.
 */
function testModeHeader(testMode: boolean | undefined): Record<string, string> {
	return testMode === undefined
		? {}
		: { 'X-TestMode-Enabled': testMode ? 'true' : 'false' };
}

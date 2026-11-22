import { logEventFromContext } from 'corsair/core';
import type { BinaryResponse } from 'corsair/http';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest, toLexofficeFileResponse } from '../client';
import type {
	CreditNoteDetails,
	CreditNotesListResponse,
	InvoicesRenderResponse,
	ResourceMutationResponse,
} from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['creditNotesList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.creditNotesList.parse(input);
	const response = await makeLexofficeRequest<CreditNotesListResponse>(
		'/voucherlist',
		ctx.key,
		{
			method: 'GET',
			query: {
				...parsedInput,
				voucherType: 'creditnote',
				voucherStatus: parsedInput.voucherStatus ?? 'any',
			},
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.creditNotesList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.creditNotes.list',
		{ count: parsed.content.length },
		'completed',
	);
	return parsed;
};

export const create: LexofficeEndpoints['creditNotesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.creditNotesCreate.parse(input);
	const { finalize, precedingSalesVoucherId, ...body } = parsedInput;
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		'/credit-notes',
		ctx.key,
		{
			method: 'POST',
			body,
			query: {
				...(finalize === undefined ? {} : { finalize: String(finalize) }),
				...(precedingSalesVoucherId === undefined
					? {}
					: { precedingSalesVoucherId }),
			},
		},
	);
	const parsed =
		LexofficeEndpointOutputSchemas.creditNotesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.creditNotes.create',
		{ creditNoteId: parsed.id },
		'completed',
	);
	return parsed;
};

export const get: LexofficeEndpoints['creditNotesGet'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.creditNotesGet.parse(input);
	const response = await makeLexofficeRequest<CreditNoteDetails>(
		`/credit-notes/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.creditNotesGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.creditNotes.get',
		{ creditNoteId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const render: LexofficeEndpoints['creditNotesRender'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.creditNotesRender.parse(input);
	const response = await makeLexofficeRequest<InvoicesRenderResponse>(
		`/credit-notes/${encodeURIComponent(parsedInput.id)}/document`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		LexofficeEndpointOutputSchemas.creditNotesRender.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.creditNotes.render',
		{ creditNoteId: parsedInput.id, documentFileId: parsed.documentFileId },
		'completed',
	);
	return parsed;
};

export const download: LexofficeEndpoints['creditNotesDownload'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LexofficeEndpointInputSchemas.creditNotesDownload.parse(input);
	const response = await makeLexofficeRequest<BinaryResponse>(
		`/credit-notes/${encodeURIComponent(parsedInput.id)}/file`,
		ctx.key,
		{
			method: 'GET',
			headers: { Accept: parsedInput.accept ?? '*/*' },
			responseType: 'binary',
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.creditNotesDownload.parse(
		toLexofficeFileResponse(response),
	);
	await logEventFromContext(
		ctx,
		'lexoffice.creditNotes.download',
		{ creditNoteId: parsedInput.id, sizeBytes: parsed.sizeBytes },
		'completed',
	);
	return parsed;
};

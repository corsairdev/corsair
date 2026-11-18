import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type {
	CreditNoteDetails,
	CreditNotesListResponse,
} from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['creditNotesList'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.creditNotesList.parse(input);
	const response = await makeLexofficeRequest<CreditNotesListResponse>(
		'/credit-notes',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
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

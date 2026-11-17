import { logEventFromContext } from 'corsair/core';
import type { HelpwiseEndpoint } from '..';
import { HELPWISE_APP_BASE, makeHelpwiseRequest } from '../client';
import type { NotesCreateResponse } from './types';
import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './types';

export const create: HelpwiseEndpoint<'notes.create'> = async (ctx, input) => {
	const parsedInput = HelpwiseEndpointInputSchemas['notes.create'].parse(input);
	const response = await makeHelpwiseRequest<NotesCreateResponse>(
		'/dev-apis/notes/add',
		ctx.key,
		{
			method: 'POST',
			baseUrl: HELPWISE_APP_BASE,
			body: parsedInput,
		},
	);
	const parsed = HelpwiseEndpointOutputSchemas['notes.create'].parse(response);
	await logEventFromContext(
		ctx,
		'helpwise.notes.create',
		{ threadId: parsedInput.thread_id },
		'completed',
	);
	return parsed;
};

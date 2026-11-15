import { createSevdeskEndpoint } from './operation';
import {
	SevdeskEndpointInputSchemas,
	SevdeskEndpointOutputSchemas,
} from './types';

export const CreditNotePos = {
	getcreditNotePositions: createSevdeskEndpoint(
		SevdeskEndpointInputSchemas['creditNotePos.getcreditNotePositions'],
		SevdeskEndpointOutputSchemas['creditNotePos.getcreditNotePositions'],
		'creditNotePos.getcreditNotePositions',
		'GET',
		'/CreditNotePos',
	),
} as const;

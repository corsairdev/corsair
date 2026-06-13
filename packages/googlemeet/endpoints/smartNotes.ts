import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '..';
import type { GoogleMeetEndpointOutputs } from './types';

export const get: GoogleMeetEndpoints['smartNotesGet'] = async (ctx, input) => {
	const smartNoteName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['smartNotesGet']>(
		`/v2/${smartNoteName}`,
		ctx,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'googlemeet.smartNotes.get', { ...input }, 'completed');
	return result;
};

export const list: GoogleMeetEndpoints['smartNotesList'] = async (ctx, input) => {
	const parentName = input.parent.replace('conferenceRecords/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['smartNotesList']>(
		`/v2/conferenceRecords/${parentName}/smartNotes`,
		ctx,
		{
			method: 'GET',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
		},
	);

	await logEventFromContext(ctx, 'googlemeet.smartNotes.list', { ...input }, 'completed');
	return result;
};

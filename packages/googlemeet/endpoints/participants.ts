import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '..';
import type { GoogleMeetEndpointOutputs } from './types';

export const get: GoogleMeetEndpoints['participantsGet'] = async (ctx, input) => {
	const participantName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['participantsGet']>(
		`/v2/${participantName}`,
		ctx,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'googlemeet.participants.get', { ...input }, 'completed');
	return result;
};

export const list: GoogleMeetEndpoints['participantsList'] = async (ctx, input) => {
	const parentName = input.parent.replace('conferenceRecords/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['participantsList']>(
		`/v2/conferenceRecords/${parentName}/participants`,
		ctx,
		{
			method: 'GET',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
		},
	);

	await logEventFromContext(ctx, 'googlemeet.participants.list', { ...input }, 'completed');
	return result;
};

export const getParticipantSession: GoogleMeetEndpoints['participantSessionsGet'] = async (ctx, input) => {
	const sessionName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['participantSessionsGet']>(
		`/v2/${sessionName}`,
		ctx,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'googlemeet.participantSessions.get', { ...input }, 'completed');
	return result;
};

export const listParticipantSessions: GoogleMeetEndpoints['participantSessionsList'] = async (ctx, input) => {
	const parentName = input.parent;
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['participantSessionsList']>(
		`/v2/${parentName}/participantSessions`,
		ctx,
		{
			method: 'GET',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
			},
		},
	);

	await logEventFromContext(ctx, 'googlemeet.participantSessions.list', { ...input }, 'completed');
	return result;
};

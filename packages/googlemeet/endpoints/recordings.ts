import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '../index';
import type { GoogleMeetEndpointOutputs } from './types';

export const get: GoogleMeetEndpoints['recordingsGet'] = async (ctx, input) => {
	const recordingName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['recordingsGet']
	>(`/v2/${recordingName}`, ctx, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'googlemeet.recordings.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleMeetEndpoints['recordingsList'] = async (
	ctx,
	input,
) => {
	const parentName = input.parent.replace('conferenceRecords/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['recordingsList']
	>(`/v2/conferenceRecords/${parentName}/recordings`, ctx, {
		method: 'GET',
		query: {
			pageSize: input.pageSize,
			pageToken: input.pageToken,
		},
	});

	await logEventFromContext(
		ctx,
		'googlemeet.recordings.list',
		{ ...input },
		'completed',
	);
	return result;
};

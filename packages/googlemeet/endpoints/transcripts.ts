import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '../index';
import type { GoogleMeetEndpointOutputs } from './types';

export const get: GoogleMeetEndpoints['transcriptsGet'] = async (
	ctx,
	input,
) => {
	const transcriptName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['transcriptsGet']
	>(`/v2/${transcriptName}`, ctx, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'googlemeet.transcripts.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleMeetEndpoints['transcriptsList'] = async (
	ctx,
	input,
) => {
	const parentName = input.parent.replace('conferenceRecords/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['transcriptsList']
	>(`/v2/conferenceRecords/${parentName}/transcripts`, ctx, {
		method: 'GET',
		query: {
			pageSize: input.pageSize,
			pageToken: input.pageToken,
		},
	});

	await logEventFromContext(
		ctx,
		'googlemeet.transcripts.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const getEntry: GoogleMeetEndpoints['transcriptEntriesGet'] = async (
	ctx,
	input,
) => {
	const entryName = input.name;
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['transcriptEntriesGet']
	>(`/v2/${entryName}`, ctx, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'googlemeet.transcriptEntries.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const listEntries: GoogleMeetEndpoints['transcriptEntriesList'] = async (
	ctx,
	input,
) => {
	const parentName = input.parent;
	const result = await makeAuthenticatedGoogleMeetRequest<
		GoogleMeetEndpointOutputs['transcriptEntriesList']
	>(`/v2/${parentName}/entries`, ctx, {
		method: 'GET',
		query: {
			pageSize: input.pageSize,
			pageToken: input.pageToken,
		},
	});

	await logEventFromContext(
		ctx,
		'googlemeet.transcriptEntries.list',
		{ ...input },
		'completed',
	);
	return result;
};

import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '..';
import type { GoogleMeetEndpointOutputs } from './types';

export const get: GoogleMeetEndpoints['conferenceRecordsGet'] = async (ctx, input) => {
	const recordName = input.name.replace('conferenceRecords/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['conferenceRecordsGet']>(
		`/v2/conferenceRecords/${recordName}`,
		ctx,
		{ method: 'GET' },
	);

	if (result.name && ctx.db.conferenceRecords) {
		try {
			await ctx.db.conferenceRecords.upsertByEntityId(result.name, {
				...result,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save conference record to database:', error);
		}
	}

	await logEventFromContext(ctx, 'googlemeet.conferenceRecords.get', { ...input }, 'completed');
	return result;
};

export const list: GoogleMeetEndpoints['conferenceRecordsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['conferenceRecordsList']>(
		'/v2/conferenceRecords',
		ctx,
		{
			method: 'GET',
			query: {
				pageSize: input.pageSize,
				pageToken: input.pageToken,
				filter: input.filter,
			},
		},
	);

	if (result.conferenceRecords && ctx.db.conferenceRecords) {
		try {
			for (const record of result.conferenceRecords) {
				if (record.name) {
					await ctx.db.conferenceRecords.upsertByEntityId(record.name, {
						...record,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save conference records to database:', error);
		}
	}

	await logEventFromContext(ctx, 'googlemeet.conferenceRecords.list', { ...input }, 'completed');
	return result;
};

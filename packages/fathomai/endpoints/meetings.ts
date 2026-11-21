import { logEventFromContext } from 'corsair/core';
import type { FathomAiEndpoints } from '..';
import { makeFathomAiRequest } from '../client';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './types';

export const list: FathomAiEndpoints['meetingsList'] = async (ctx, input) => {
	const { calendar_invitees_domains, recorded_by, teams, ...filters } =
		FathomAiEndpointInputSchemas.meetingsList.parse(input);
	const response = FathomAiEndpointOutputSchemas.meetingsList.parse(
		await makeFathomAiRequest('/meetings', ctx.key, {
			method: 'GET',
			query: {
				...filters,
				'calendar_invitees_domains[]': calendar_invitees_domains,
				'recorded_by[]': recorded_by,
				'teams[]': teams,
			},
		}),
	);
	for (const meeting of response.items) {
		await ctx.db.meetings.upsertByEntityId(
			String(meeting.recording_id),
			meeting,
		);
	}
	await logEventFromContext(
		ctx,
		'fathomai.meetings.list',
		{ count: response.items.length },
		'completed',
	);
	return response;
};

export const listTypes: FathomAiEndpoints['meetingTypesList'] = async (
	ctx,
	input,
) => {
	const query = FathomAiEndpointInputSchemas.meetingTypesList.parse(input);
	const response = FathomAiEndpointOutputSchemas.meetingTypesList.parse(
		await makeFathomAiRequest('/meeting_types', ctx.key, {
			method: 'GET',
			query,
		}),
	);
	for (const meetingType of response.items) {
		await ctx.db.meetingTypes.upsertByEntityId(meetingType.name, meetingType);
	}
	await logEventFromContext(
		ctx,
		'fathomai.meetingTypes.list',
		{ count: response.items.length },
		'completed',
	);
	return response;
};

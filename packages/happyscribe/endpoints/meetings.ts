import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

export const create: HappyScribeEndpoints['meetingsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.create',
			input: Inputs.meetingsCreate,
			output: Outputs.meetingsCreate,
		},
		input,
		({
			organizationId,
			meetingUrl,
			joinAt,
			language,
			participants,
			metadata,
			botName,
			recordingMode,
			summaryTemplate,
		}) => ({
			method: 'POST',
			path: '/meetings',
			// The live API reads notetaker settings at the top level and
			// answers 400 "settings is not a bot field" to a `settings` object.
			body: {
				organization_id: organizationId,
				meeting_url: meetingUrl,
				join_at: joinAt,
				language,
				participants,
				metadata,
				bot_name: botName,
				recording_mode: recordingMode,
				summary_template: summaryTemplate,
			},
		}),
		{
			log: (parsed, result) => ({
				meetingId: result.id,
				joinAt: parsed.joinAt,
				language: parsed.language,
			}),
		},
	);

export const get: HappyScribeEndpoints['meetingsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meetings.get',
			input: Inputs.meetingsGet,
			output: Outputs.meetingsGet,
		},
		input,
		({ meetingId }) => ({
			method: 'GET',
			path: `/meetings/${segment(meetingId)}`,
			replaySafe: true,
		}),
	);

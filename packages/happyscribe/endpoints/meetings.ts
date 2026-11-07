import type { HappyScribeContext, HappyScribeEndpoints } from '..';
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
			accessLevel,
		}) => ({
			method: 'POST',
			path: '/meetings',
			body: {
				organization_id: organizationId,
				meeting_url: meetingUrl,
				join_at: joinAt,
				language,
				participants,
				metadata,
				settings: {
					...(botName !== undefined ? { bot_name: botName } : {}),
					...(recordingMode !== undefined ? { recording_mode: recordingMode } : {}),
					...(summaryTemplate !== undefined ? { summary_template: summaryTemplate } : {}),
					...(accessLevel !== undefined ? { access_level: accessLevel } : {}),
				},
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

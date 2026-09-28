import { logEventFromContext } from 'corsair/core';
import { makeChMeetingsRequest, unwrapData, unwrapList } from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	AttendanceListInputSchema,
	AttendanceSchema,
	EventIdInputSchema,
	EventOccurrencesInputSchema,
	EventSchema,
	EventsListInputSchema,
	OccurrenceSchema,
} from './types';

function sid(id: string | number): string {
	return String(id);
}

export const list: ChMeetingsEndpoints['eventsList'] = async (ctx, input) => {
	const query = EventsListInputSchema.parse(input);
	const raw = await makeChMeetingsRequest('events', ctx.key, {
		query: {
			from: query.from,
			to: query.to,
			page: query.page ?? 1,
			page_size: query.page_size ?? 100,
		},
	});
	const output = unwrapList(raw, EventSchema);
	await logEventFromContext(ctx, 'chmeetings.events.list', query, 'completed');
	return output;
};

export const get: ChMeetingsEndpoints['eventsGet'] = async (ctx, input) => {
	const { event_id } = EventIdInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(`events/${sid(event_id)}`, ctx.key);
	const output = unwrapData(raw, EventSchema, `Event ${event_id}`);
	await logEventFromContext(
		ctx,
		'chmeetings.events.get',
		{ event_id },
		'completed',
	);
	return output;
};

export const listOccurrences: ChMeetingsEndpoints['eventsListOccurrences'] =
	async (ctx, input) => {
		const query = EventOccurrencesInputSchema.parse(input);
		const raw = await makeChMeetingsRequest(
			`events/${sid(query.event_id)}/occurrences`,
			ctx.key,
			{
				query: {
					from: query.from,
					to: query.to,
					page: query.page ?? 1,
					page_size: query.page_size ?? 100,
				},
			},
		);
		const output = unwrapList(raw, OccurrenceSchema);
		await logEventFromContext(
			ctx,
			'chmeetings.events.listOccurrences',
			query,
			'completed',
		);
		return output;
	};

export const listAttendance: ChMeetingsEndpoints['attendanceList'] = async (
	ctx,
	input,
) => {
	const query = AttendanceListInputSchema.parse(input);
	const raw = await makeChMeetingsRequest(
		`occurrences/${query.occurrence_id}/attendance`,
		ctx.key,
		{
			query: {
				status: query.status,
				group_id: query.group_id,
				ungrouped: query.ungrouped,
				page: query.page ?? 1,
				page_size: query.page_size ?? 100,
			},
		},
	);
	const output = unwrapList(raw, AttendanceSchema);
	await logEventFromContext(
		ctx,
		'chmeetings.attendance.list',
		query,
		'completed',
	);
	return output;
};

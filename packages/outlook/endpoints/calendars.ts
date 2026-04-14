import { logEventFromContext } from 'corsair/core';
import type { OutlookEndpoints } from '..';
import { makeOutlookRequest } from '../client';
import type { OutlookEndpointOutputs } from './types';

const userPath = (userId?: string) => (userId ? `/users/${userId}` : '/me');

// ── DB record helper ──────────────────────────────────────────────────────────

const toCalendarRecord = (cal: OutlookEndpointOutputs['calendarsGet']) => ({
	// id is asserted non-null — all callers guard with `if (result.id)` before invoking this helper
	id: cal.id!,
	name: cal.name,
	color: cal.color,
	hexColor: cal.hexColor,
	isDefaultCalendar: cal.isDefaultCalendar,
	canEdit: cal.canEdit,
	canShare: cal.canShare,
	owner: cal.owner ? JSON.stringify(cal.owner) : undefined,
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const createCalendar: OutlookEndpoints['calendarsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['calendarsCreate']
	>(`${userPath(input.user_id)}/calendars`, ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			...(input.color && { color: input.color }),
			...(input.hexColor && { hexColor: input.hexColor }),
		},
	});

	if (result.id && ctx.db.calendars) {
		try {
			await ctx.db.calendars.upsertByEntityId(
				result.id,
				toCalendarRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save calendar to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.calendars.create',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const getCalendar: OutlookEndpoints['calendarsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['calendarsGet']
	>(`/me/calendars/${input.calendar_id}`, ctx.key);

	if (result.id && ctx.db.calendars) {
		try {
			await ctx.db.calendars.upsertByEntityId(
				result.id,
				toCalendarRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save calendar to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.calendars.get',
		{ calendar_id: input.calendar_id },
		'completed',
	);
	return result;
};

export const listCalendars: OutlookEndpoints['calendarsList'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['calendarsList']
	>(`${userPath(input.user_id)}/calendars`, ctx.key, {
		query: {
			...(input.top && { $top: input.top }),
			...(input.skip && { $skip: input.skip }),
			...(input.filter && { $filter: input.filter }),
			...(input.select?.length && { $select: input.select.join(',') }),
			...(input.orderby?.length && { $orderby: input.orderby.join(',') }),
		},
	});

	if (result.value?.length && ctx.db.calendars) {
		try {
			for (const cal of result.value) {
				if (cal.id) {
					await ctx.db.calendars.upsertByEntityId(
						cal.id,
						toCalendarRecord(cal),
					);
				}
			}
		} catch (error) {
			console.warn('Failed to save calendars to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.calendars.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteCalendar: OutlookEndpoints['calendarsDelete'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/calendars/${input.calendar_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.calendars) {
		try {
			await ctx.db.calendars.deleteByEntityId(input.calendar_id);
		} catch (error) {
			console.warn('Failed to delete calendar from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.calendars.delete',
		{ calendar_id: input.calendar_id },
		'completed',
	);
	return { success: true };
};

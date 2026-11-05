import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';
import { ClickmeetingEndpointOutputSchemas } from './types';

export const getConferenceSessions: ClickmeetingEndpoints['getConferenceSessions'] =
	async (ctx, input) => {
		// unknown: ClickMeeting session JSON is untyped until the Zod schema runs.
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getConferenceSessions',
			{ roomId: input.roomId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.getConferenceSessions.parse(res);
	};

export const getSessionDetails: ClickmeetingEndpoints['getSessionDetails'] =
	async (ctx, input) => {
		// unknown: ClickMeeting session JSON is untyped until the Zod schema runs.
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionDetails',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.getSessionDetails.parse(res);
	};

export const getSessionAttendees: ClickmeetingEndpoints['getSessionAttendees'] =
	async (ctx, input) => {
		// unknown: ClickMeeting session JSON is untyped until the Zod schema runs.
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/attendees`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionAttendees',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.getSessionAttendees.parse(res);
	};

export const generateSessionPdfReport: ClickmeetingEndpoints['generateSessionPdfReport'] =
	async (ctx, input) => {
		const lang = encodeURIComponent(String(input.lang ?? 'en'));
		// unknown: ClickMeeting session JSON is untyped until the Zod schema runs.
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/generate-pdf/${lang}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.generateSessionPdfReport',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.generateSessionPdfReport.parse(
			res,
		);
	};

export const getSessionRegistrations: ClickmeetingEndpoints['getSessionRegistrations'] =
	async (ctx, input) => {
		// unknown: ClickMeeting session JSON is untyped until the Zod schema runs.
		const res = await makeClickmeetingRequest<unknown>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/registrations`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionRegistrations',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return ClickmeetingEndpointOutputSchemas.getSessionRegistrations.parse(res);
	};

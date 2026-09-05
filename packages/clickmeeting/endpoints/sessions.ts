import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getConferenceSessions: ClickmeetingEndpoints['getConferenceSessions'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionDetails: ClickmeetingEndpoints['getSessionDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionAttendees: ClickmeetingEndpoints['getSessionAttendees'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionAttendeeDetails: ClickmeetingEndpoints['getSessionAttendeeDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/attendees/${encodeURIComponent(String(input.attendeeId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionAttendeeDetails',
			{
				roomId: input.roomId,
				sessionId: input.sessionId,
				attendeeId: input.attendeeId,
			},
			'completed',
		);
		return res;
	};

export const generateSessionPdfReport: ClickmeetingEndpoints['generateSessionPdfReport'] =
	async (ctx, input) => {
		const lang = encodeURIComponent(String(input.lang ?? 'en'));
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionRegistrations: ClickmeetingEndpoints['getSessionRegistrations'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
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
		return res;
	};

export const getSessionPolls: ClickmeetingEndpoints['getSessionPolls'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/polls`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.sessions.getSessionPolls',
		{ roomId: input.roomId, sessionId: input.sessionId },
		'completed',
	);
	return res;
};

export const getSessionPollDetails: ClickmeetingEndpoints['getSessionPollDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/polls/${encodeURIComponent(String(input.pollId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionPollDetails',
			{
				roomId: input.roomId,
				sessionId: input.sessionId,
				pollId: input.pollId,
			},
			'completed',
		);
		return res;
	};

export const getSessionSurveys: ClickmeetingEndpoints['getSessionSurveys'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/surveys`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionSurveys',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return res;
	};

export const getSessionSurveyDetails: ClickmeetingEndpoints['getSessionSurveyDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/surveys/${encodeURIComponent(String(input.surveyId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionSurveyDetails',
			{
				roomId: input.roomId,
				sessionId: input.sessionId,
				surveyId: input.surveyId,
			},
			'completed',
		);
		return res;
	};

export const getSessionQaHistory: ClickmeetingEndpoints['getSessionQaHistory'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/sessions/${encodeURIComponent(String(input.sessionId))}/qa`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.sessions.getSessionQaHistory',
			{ roomId: input.roomId, sessionId: input.sessionId },
			'completed',
		);
		return res;
	};

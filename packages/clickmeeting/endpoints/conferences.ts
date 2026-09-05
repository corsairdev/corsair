import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const getConferences: ClickmeetingEndpoints['getConferences'] = async (
	ctx,
	input,
) => {
	const status = input.status ?? 'active';
	const query = input.page ? { page: input.page } : undefined;
	const res = await makeClickmeetingRequest<any>(
		`/conferences/${status}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.conferences.getConferences',
		{ status },
		'completed',
	);
	return res;
};

export const getConferenceDetails: ClickmeetingEndpoints['getConferenceDetails'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.getConferenceDetails',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const createConference: ClickmeetingEndpoints['createConference'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>('/conferences', ctx.key, {
			method: 'POST',
			body: input,
		});
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.createConference',
			{ name: input.name },
			'completed',
		);
		return res;
	};

export const updateConference: ClickmeetingEndpoints['updateConference'] =
	async (ctx, input) => {
		const { roomId, ...body } = input;
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(roomId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.updateConference',
			{ roomId },
			'completed',
		);
		return res;
	};

export const deleteConference: ClickmeetingEndpoints['deleteConference'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.deleteConference',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const getConferenceFiles: ClickmeetingEndpoints['getConferenceFiles'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/file-library/conferences/${encodeURIComponent(String(input.roomId))}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.getConferenceFiles',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const getConferenceSkins: ClickmeetingEndpoints['getConferenceSkins'] =
	async (ctx) => {
		const res = await makeClickmeetingRequest<any>(
			'/conferences/skins',
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.getConferenceSkins',
			{},
			'completed',
		);
		return res;
	};

export const sendInvitation: ClickmeetingEndpoints['sendInvitation'] = async (
	ctx,
	input,
) => {
	const { roomId, lang, ...body } = input;
	const res = await makeClickmeetingRequest<any>(
		`/conferences/${encodeURIComponent(String(roomId))}/invitation/email/${encodeURIComponent(lang)}`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.conferences.sendInvitation',
		{ roomId },
		'completed',
	);
	return res;
};

export const generateAutologinUrl: ClickmeetingEndpoints['generateAutologinUrl'] =
	async (ctx, input) => {
		const { roomId, ...body } = input;
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(roomId))}/room/autologin_hash`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.conferences.generateAutologinUrl',
			{ roomId },
			'completed',
		);
		return res;
	};

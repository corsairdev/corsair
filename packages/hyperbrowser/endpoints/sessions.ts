import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type {
	CreateSessionOutput,
	EvaluateCaptchaOutput,
	GetSessionDownloadsUrlOutput,
	GetSessionOutput,
	GetSessionRecordingUrlOutput,
	GetSessionVideoRecordingUrlOutput,
	ListSessionsOutput,
	StopSessionOutput,
	UpdateSessionOutput,
} from './types';
import {
	CreateSessionInputSchema,
	CreateSessionOutputSchema,
	EvaluateCaptchaInputSchema,
	EvaluateCaptchaOutputSchema,
	GetSessionDownloadsUrlInputSchema,
	GetSessionDownloadsUrlOutputSchema,
	GetSessionInputSchema,
	GetSessionOutputSchema,
	GetSessionRecordingUrlInputSchema,
	GetSessionRecordingUrlOutputSchema,
	GetSessionVideoRecordingUrlInputSchema,
	GetSessionVideoRecordingUrlOutputSchema,
	ListSessionsInputSchema,
	ListSessionsOutputSchema,
	StopSessionInputSchema,
	StopSessionOutputSchema,
	UpdateSessionInputSchema,
	UpdateSessionOutputSchema,
} from './types';

export const Sessions = {
	create: (async (ctx, input) => {
		const parsedInput = CreateSessionInputSchema.parse(input ?? {});
		const response = await makeHyperbrowserRequest<CreateSessionOutput>(
			'/api/session',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateSessionOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.create',
			{ sessionId: parsed.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.create'],

	get: (async (ctx, input) => {
		const parsedInput = GetSessionInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetSessionOutput>(
			`/api/session/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetSessionOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.get',
			{ sessionId: parsed.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.get'],

	stop: (async (ctx, input) => {
		const parsedInput = StopSessionInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<StopSessionOutput>(
			`/api/session/${encodeURIComponent(parsedInput.id)}/stop`,
			ctx.key,
			{
				method: 'PUT',
			},
		);
		const parsed = StopSessionOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.stop',
			{ sessionId: parsedInput.id, success: parsed.success },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.stop'],

	update: (async (ctx, input) => {
		const parsedInput = UpdateSessionInputSchema.parse(input);
		const { id, ...body } = parsedInput;
		const response = await makeHyperbrowserRequest<UpdateSessionOutput>(
			`/api/session/${encodeURIComponent(id)}/update`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
		const parsed = UpdateSessionOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.update',
			{ sessionId: id, success: parsed.success },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.update'],

	evaluateCaptcha: (async (ctx, input) => {
		const parsedInput = EvaluateCaptchaInputSchema.parse(input);
		const { id, ...body } = parsedInput;
		const response = await makeHyperbrowserRequest<EvaluateCaptchaOutput>(
			`/api/session/${encodeURIComponent(id)}/captcha/evaluate`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed = EvaluateCaptchaOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.evaluateCaptcha',
			{ sessionId: id, success: parsed.success, solved: parsed.solved },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.evaluateCaptcha'],

	list: (async (ctx, input) => {
		const parsedInput = ListSessionsInputSchema.parse(input ?? {});
		const query: Record<string, string | number | undefined> = {};
		if (parsedInput.page !== undefined) query.page = parsedInput.page;
		if (parsedInput.status !== undefined) query.status = parsedInput.status;

		const response = await makeHyperbrowserRequest<ListSessionsOutput>(
			'/api/sessions',
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);
		const parsed = ListSessionsOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.list',
			{ count: parsed.sessions?.length ?? 0, totalCount: parsed.totalCount },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.list'],

	getRecordingUrl: (async (ctx, input) => {
		const parsedInput = GetSessionRecordingUrlInputSchema.parse(input);
		const response =
			await makeHyperbrowserRequest<GetSessionRecordingUrlOutput>(
				`/api/session/${encodeURIComponent(parsedInput.id)}/recording-url`,
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed = GetSessionRecordingUrlOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.getRecordingUrl',
			{ sessionId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.getRecordingUrl'],

	getVideoRecordingUrl: (async (ctx, input) => {
		const parsedInput = GetSessionVideoRecordingUrlInputSchema.parse(input);
		const response =
			await makeHyperbrowserRequest<GetSessionVideoRecordingUrlOutput>(
				`/api/session/${encodeURIComponent(parsedInput.id)}/video-recording-url`,
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed = GetSessionVideoRecordingUrlOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.getVideoRecordingUrl',
			{ sessionId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.getVideoRecordingUrl'],

	getDownloadsUrl: (async (ctx, input) => {
		const parsedInput = GetSessionDownloadsUrlInputSchema.parse(input);
		const response =
			await makeHyperbrowserRequest<GetSessionDownloadsUrlOutput>(
				`/api/session/${encodeURIComponent(parsedInput.id)}/downloads-url`,
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed = GetSessionDownloadsUrlOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.sessions.getDownloadsUrl',
			{ sessionId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['sessions.getDownloadsUrl'],
};

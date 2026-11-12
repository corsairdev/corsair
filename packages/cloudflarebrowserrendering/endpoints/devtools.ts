import { logEventFromContext } from 'corsair/core';
import type { CloudflareBrowserRenderingEndpoints } from '..';
import {
	getCloudflareBrowserRenderingRequestTimeoutOptions,
	makeCloudflareBrowserRenderingRequest,
} from '../client';
import {
	CloudflareBrowserRenderingEndpointInputSchemas,
	CloudflareBrowserRenderingEndpointOutputSchemas,
} from './types';

function devtoolsPath(accountId: string, suffix: string): string {
	return `/accounts/${encodeURIComponent(accountId)}/browser-rendering/devtools/${suffix}`;
}

function browserPath(
	accountId: string,
	sessionId: string,
	suffix = '',
): string {
	return devtoolsPath(
		accountId,
		`browser/${encodeURIComponent(sessionId)}${suffix}`,
	);
}

function targetPath(
	accountId: string,
	sessionId: string,
	targetId: string,
	action: 'activate' | 'close' | 'list',
): string {
	return browserPath(
		accountId,
		sessionId,
		`/json/${action}/${encodeURIComponent(targetId)}`,
	);
}

export const sessionsList: CloudflareBrowserRenderingEndpoints['sessionsList'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.sessionsList.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			devtoolsPath(parsedInput.accountId, 'session'),
			ctx.key,
			{
				method: 'GET',
				query: { limit: parsedInput.limit, offset: parsedInput.offset },
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.sessionsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.sessions.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};

export const sessionsGet: CloudflareBrowserRenderingEndpoints['sessionsGet'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.sessionsGet.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			devtoolsPath(
				parsedInput.accountId,
				`session/${encodeURIComponent(parsedInput.sessionId)}`,
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.sessionsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.sessions.get',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const browserCreate: CloudflareBrowserRenderingEndpoints['browserCreate'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.browserCreate.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			devtoolsPath(parsedInput.accountId, 'browser'),
			ctx.key,
			{
				method: 'POST',
				query: {
					keep_alive: parsedInput.keepAlive,
					lab: parsedInput.lab,
					liveViewUrlExpiresInMs: parsedInput.liveViewUrlExpiresInMs,
					recording: parsedInput.recording,
					targets: parsedInput.targets,
				},
				body:
					parsedInput.guardrails === undefined
						? undefined
						: { guardrails: parsedInput.guardrails },
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.browserCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.browser.create',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const browserClose: CloudflareBrowserRenderingEndpoints['browserClose'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.browserClose.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(parsedInput.accountId, parsedInput.sessionId),
			ctx.key,
			{
				method: 'DELETE',
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.browserClose.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.browser.close',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const browserVersion: CloudflareBrowserRenderingEndpoints['browserVersion'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.browserVersion.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(
				parsedInput.accountId,
				parsedInput.sessionId,
				'/json/version',
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.browserVersion.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.browser.version',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const browserProtocol: CloudflareBrowserRenderingEndpoints['browserProtocol'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.browserProtocol.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(
				parsedInput.accountId,
				parsedInput.sessionId,
				'/json/protocol',
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.browserProtocol.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.browser.protocol',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const liveViewCreate: CloudflareBrowserRenderingEndpoints['liveViewCreate'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.liveViewCreate.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(parsedInput.accountId, parsedInput.sessionId, '/live_view'),
			ctx.key,
			{
				method: 'POST',
				body: {
					expiresInMs: parsedInput.expiresInMs,
					guardrails: parsedInput.guardrails,
					mode: parsedInput.mode,
					targetId: parsedInput.targetId,
				},
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.liveViewCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.liveView.create',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const targetsCreate: CloudflareBrowserRenderingEndpoints['targetsCreate'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.targetsCreate.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(parsedInput.accountId, parsedInput.sessionId, '/json/new'),
			ctx.key,
			{
				method: 'PUT',
				query: {
					liveViewUrlExpiresInMs: parsedInput.liveViewUrlExpiresInMs,
					url: parsedInput.url,
				},
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.targetsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.targets.create',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const targetsList: CloudflareBrowserRenderingEndpoints['targetsList'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.targetsList.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			browserPath(parsedInput.accountId, parsedInput.sessionId, '/json/list'),
			ctx.key,
			{
				method: 'GET',
				query: {
					liveViewUrlExpiresInMs: parsedInput.liveViewUrlExpiresInMs,
				},
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.targetsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.targets.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};

export const targetsGet: CloudflareBrowserRenderingEndpoints['targetsGet'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.targetsGet.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			targetPath(
				parsedInput.accountId,
				parsedInput.sessionId,
				parsedInput.targetId,
				'list',
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.targetsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.targets.get',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const targetsActivate: CloudflareBrowserRenderingEndpoints['targetsActivate'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.targetsActivate.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			targetPath(
				parsedInput.accountId,
				parsedInput.sessionId,
				parsedInput.targetId,
				'activate',
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.targetsActivate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.targets.activate',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const targetsClose: CloudflareBrowserRenderingEndpoints['targetsClose'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.targetsClose.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			targetPath(
				parsedInput.accountId,
				parsedInput.sessionId,
				parsedInput.targetId,
				'close',
			),
			ctx.key,
			getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.targetsClose.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.targets.close',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

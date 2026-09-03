import { logEventFromContext } from 'corsair/core';
import type { BrowserToolEndpoints } from '..';
import { makeBrowserToolRequest } from '../client';
import type { BrowserToolEndpointOutputs } from './types';

export const runBrowserTask: BrowserToolEndpoints['runBrowserTask'] = async (
	ctx,
	input,
) => {
	const response = await makeBrowserToolRequest<
		BrowserToolEndpointOutputs['runBrowserTask']
	>('/api/v3/tools/execute/BROWSER_TOOL_CREATE_TASK', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'browsertool.runBrowserTask',
		{ ...input },
		'completed',
	);

	return response;
};

export const downloadTaskFile: BrowserToolEndpoints['downloadTaskFile'] =
	async (ctx, input) => {
		const response = await makeBrowserToolRequest<
			BrowserToolEndpointOutputs['downloadTaskFile']
		>('/api/v3/tools/execute/BROWSER_TOOL_GET_OUTPUT_FILE', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'browsertool.downloadTaskFile',
			{ ...input },
			'completed',
		);

		return response;
	};

export const getSessionLiveUrl: BrowserToolEndpoints['getSessionLiveUrl'] =
	async (ctx, input) => {
		const response = await makeBrowserToolRequest<
			BrowserToolEndpointOutputs['getSessionLiveUrl']
		>('/api/v3/tools/execute/BROWSER_TOOL_GET_SESSION', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'browsertool.getSessionLiveUrl',
			{ ...input },
			'completed',
		);

		return response;
	};

export const stopBrowserTask: BrowserToolEndpoints['stopBrowserTask'] = async (
	ctx,
	input,
) => {
	const response = await makeBrowserToolRequest<
		BrowserToolEndpointOutputs['stopBrowserTask']
	>('/api/v3/tools/execute/BROWSER_TOOL_STOP_TASK', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'browsertool.stopBrowserTask',
		{ ...input },
		'completed',
	);

	return response;
};

export const watchBrowserTask: BrowserToolEndpoints['watchBrowserTask'] =
	async (ctx, input) => {
		const response = await makeBrowserToolRequest<
			BrowserToolEndpointOutputs['watchBrowserTask']
		>('/api/v3/tools/execute/BROWSER_TOOL_WATCH_TASK', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'browsertool.watchBrowserTask',
			{ ...input },
			'completed',
		);

		return response;
	};

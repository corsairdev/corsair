import { logEventFromContext } from 'corsair/core';
import type { BrowserToolEndpoints } from '..';
import { executeBrowserTool } from '../client';
import {
	BrowserToolEndpointInputSchemas,
	BrowserToolEndpointOutputSchemas,
} from './types';

const TOOL = {
	createTask: 'BROWSER_TOOL_CREATE_TASK',
	getOutputFile: 'BROWSER_TOOL_GET_OUTPUT_FILE',
	getSession: 'BROWSER_TOOL_GET_SESSION',
	stopTask: 'BROWSER_TOOL_STOP_TASK',
	watchTask: 'BROWSER_TOOL_WATCH_TASK',
} as const;

async function run<K extends keyof typeof TOOL>(
	ctx: { key: string },
	key: K,
	event: string,
	input: unknown,
) {
	const parsed = BrowserToolEndpointInputSchemas[key].parse(input);
	const raw = await executeBrowserTool(
		TOOL[key],
		ctx.key,
		parsed as Record<string, unknown>,
	);
	const output = BrowserToolEndpointOutputSchemas[key].parse(raw);
	await logEventFromContext(
		ctx as never,
		event,
		auditPayload(parsed),
		'completed',
	);
	return output;
}

function auditPayload(parsed: unknown): Record<string, unknown> {
	if (parsed === null || typeof parsed !== 'object') {
		return {};
	}
	const { secrets: _secrets, ...rest } = parsed as Record<string, unknown>;
	return rest;
}

/** Official: BROWSER_TOOL_CREATE_TASK — https://docs.composio.dev/toolkits/browser_tool */
export const createTask: BrowserToolEndpoints['createTask'] = (ctx, input) =>
	run(ctx, 'createTask', 'browsertool.tasks.create', input);

/** Official: BROWSER_TOOL_WATCH_TASK — https://docs.composio.dev/toolkits/browser_tool */
export const watchTask: BrowserToolEndpoints['watchTask'] = (ctx, input) =>
	run(ctx, 'watchTask', 'browsertool.tasks.watch', input);

/** Official: BROWSER_TOOL_STOP_TASK — https://docs.composio.dev/toolkits/browser_tool */
export const stopTask: BrowserToolEndpoints['stopTask'] = (ctx, input) =>
	run(ctx, 'stopTask', 'browsertool.tasks.stop', input);

/** Official: BROWSER_TOOL_GET_SESSION — https://docs.composio.dev/toolkits/browser_tool */
export const getSession: BrowserToolEndpoints['getSession'] = (ctx, input) =>
	run(ctx, 'getSession', 'browsertool.sessions.get', input);

/** Official: BROWSER_TOOL_GET_OUTPUT_FILE — https://docs.composio.dev/toolkits/browser_tool */
export const getOutputFile: BrowserToolEndpoints['getOutputFile'] = (
	ctx,
	input,
) => run(ctx, 'getOutputFile', 'browsertool.files.get', input);

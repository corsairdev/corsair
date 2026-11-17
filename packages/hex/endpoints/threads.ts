import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List agent threads in the workspace, sorted by most recently created first. Requires Manager org role or higher. Workspace admins receive every non-private thread; managers receive threads they created plus Threads-type threads on projects they have access to. Threads marked private are returned with their title redacted. */
export const threadsList: HexEndpoints['threadsList'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.threadsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['threadsList']>(
		`/v1/threads`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
				source: parsedInput.source,
				userId: parsedInput.userId,
				type: parsedInput.type,
				classification: parsedInput.classification,
				numDays: parsedInput.numDays,
				hasFeedback: parsedInput.hasFeedback,
				roles: parsedInput.roles,
				warnings: parsedInput.warnings,
				topicIds: parsedInput.topicIds,
				resourceIds: parsedInput.resourceIds,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.threadsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.threads.list',
		{ operation: 'threads.list' },
		'completed',
	);
	return parsed;
};

/** Start an agent thread with a prompt. The Hex agent will analyze data and respond to the prompt. The thread runs asynchronously — poll its status or visit the returned URL to view progress. */
export const threadsCreate: HexEndpoints['threadsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.threadsCreate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['threadsCreate']>(
		`/v1/threads`,
		ctx.key,
		{
			method: 'POST',
			body: {
				prompt: parsedInput.prompt,
				attachments: parsedInput.attachments,
				previewId: parsedInput.previewId,
				projectId: parsedInput.projectId,
				newProject: parsedInput.newProject,
				muted: parsedInput.muted,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.threadsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.threads.create',
		{ operation: 'threads.create' },
		'completed',
	);
	return parsed;
};

/** Get the response of an agent thread. Returns the current status (RUNNING, IDLE, or ERROR) and the agent's response content when available. */
export const threadsGet: HexEndpoints['threadsGet'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.threadsGet.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['threadsGet']>(
		`/v1/threads/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.threadsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.threads.get',
		{ operation: 'threads.get' },
		'completed',
	);
	return parsed;
};

/** Continue an existing agent thread with a follow-up prompt. This endpoint does not support queuing: the thread must be idle before a follow-up can be sent. */
export const threadsContinue: HexEndpoints['threadsContinue'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.threadsContinue.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['threadsContinue']>(
		`/v1/threads/${encodeURIComponent(String(parsedInput.id))}/followup`,
		ctx.key,
		{
			method: 'POST',
			body: {
				prompt: parsedInput.prompt,
				attachments: parsedInput.attachments,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.threadsContinue.parse(response);
	await logEventFromContext(
		ctx,
		'hex.threads.continue',
		{ operation: 'threads.continue' },
		'completed',
	);
	return parsed;
};

/** List the messages in an agent thread, rendered as a single flat list of text blocks. Within a page messages are chronological (oldest first); each text block is prefixed with the authoring role, and thinking and error blocks are tagged. Each block includes the creation time of its originating message. Tool-call, tool-result, and mention blocks are omitted, and inline references are left as raw tags. By default the most recent page is returned (matching the MCP get_thread tool); pass the `before` cursor to fetch older messages and `after` to fetch newer ones. Set `full` to include JSON-encoded message records with thinking, tool calls, results, and mentions. Supports cursor pagination with a maximum page size of 50. */
export const threadsGetMessages: HexEndpoints['threadsGetMessages'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.threadsGetMessages.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['threadsGetMessages']
	>(
		`/v1/threads/${encodeURIComponent(String(parsedInput.threadId))}/messages`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
				full: parsedInput.full,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.threadsGetMessages.parse(response);
	await logEventFromContext(
		ctx,
		'hex.threads.getMessages',
		{ operation: 'threads.getMessages' },
		'completed',
	);
	return parsed;
};

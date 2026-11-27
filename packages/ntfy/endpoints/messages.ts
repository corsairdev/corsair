import type { NtfyContext, NtfyEndpoints } from '..';
import { parseNtfyNdjson } from '../client';
import { call } from './call';
import {
	NtfyEndpointInputSchemas as Inputs,
	NtfyEndpointOutputSchemas as Outputs,
} from './types';

// JSON publish goes to the server root, so no path segments are built here.
// Topic and sequence ids interpolate directly into poll/clear/delete paths:
// both are schema-pinned to URL-safe characters ([-_A-Za-z0-9] plus the poll
// comma list), so no percent-encoding is needed.

function publishBody(parsed: {
	topic: string;
	message?: string;
	title?: string;
	priority?: number | 'min' | 'low' | 'default' | 'high' | 'urgent';
	tags?: string[];
	click?: string;
	markdown?: boolean;
	actions?: unknown[];
	delay?: string;
	sequenceId?: string;
}): Record<string, unknown> {
	return {
		topic: parsed.topic,
		message: parsed.message,
		title: parsed.title,
		priority: parsed.priority,
		tags: parsed.tags,
		click: parsed.click,
		markdown: parsed.markdown,
		actions: parsed.actions,
		delay: parsed.delay,
		sequence_id: parsed.sequenceId,
	};
}

export const send: NtfyEndpoints['messagesSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.send',
			input: Inputs.messagesSend,
			output: Outputs.messagesSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/',
			body: publishBody(parsed),
		}),
		{
			log: ({ topic, sequenceId }, result) => ({
				topic,
				sequenceId: sequenceId ?? result.sequence_id ?? undefined,
				messageId: result.id,
			}),
		},
	);

export const poll: NtfyEndpoints['messagesPoll'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.poll',
			input: Inputs.messagesPoll,
			output: Outputs.messagesPoll,
		},
		input,
		({ topic, since, scheduled, id, message, title, priority, tags }) => ({
			method: 'GET',
			path: `/${topic}/json`,
			query: {
				poll: 1,
				since,
				sched: scheduled ? 1 : undefined,
				id,
				message,
				title,
				priority: priority?.join(','),
				tags: tags?.join(','),
			},
		}),
		{
			// An unknown topic answers 200 with an empty body: a genuine
			// empty poll, not a missing envelope.
			shape: (raw) => ({ messages: parseNtfyNdjson(raw) }),
			log: ({ topic }, result) => ({ topic, count: result.messages.length }),
		},
	);

export const update: NtfyEndpoints['messagesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.update',
			input: Inputs.messagesUpdate,
			output: Outputs.messagesUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/',
			body: publishBody(parsed),
		}),
		{
			log: ({ topic, sequenceId }, result) => ({
				topic,
				sequenceId,
				messageId: result.id,
			}),
		},
	);

export const clear: NtfyEndpoints['messagesClear'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.clear',
			input: Inputs.messagesClear,
			output: Outputs.messagesClear,
		},
		input,
		({ topic, sequenceId }) => ({
			method: 'PUT',
			path: `/${topic}/${sequenceId}/clear`,
		}),
		{
			log: ({ topic, sequenceId }) => ({ topic, sequenceId }),
		},
	);

// `delete` is a reserved word, so the function is `remove` and the endpoint
// registers under the `delete:` key.
export const remove: NtfyEndpoints['messagesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'messages.delete',
			input: Inputs.messagesDelete,
			output: Outputs.messagesDelete,
		},
		input,
		({ topic, sequenceId }) => ({
			method: 'DELETE',
			path: `/${topic}/${sequenceId}`,
		}),
		{
			log: ({ topic, sequenceId }) => ({ topic, sequenceId }),
		},
	);

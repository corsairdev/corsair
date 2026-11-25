import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

export const list: LoomioEndpoints['threadsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'threads.list',
			input: Inputs.threadsList,
			output: Outputs.threadsList,
		},
		input,
		({ limit, offset }) => ({
			method: 'GET',
			path: '/threads',
			query: { limit, offset },
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'threads', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.threads.length }),
		},
	);

export const items: LoomioEndpoints['threadsItems'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'threads.items',
			input: Inputs.threadsItems,
			output: Outputs.threadsItems,
		},
		input,
		({ topic_id, limit, offset }) => ({
			method: 'GET',
			path: `/threads/${segment(topic_id)}/items`,
			query: { limit, offset },
			resourceScoped: true,
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'items', parsed.offset ?? 0),
			log: ({ topic_id }, result) => ({
				topicId: topic_id,
				count: result.items.length,
			}),
		},
	);

export const markdown: LoomioEndpoints['threadsMarkdown'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'threads.markdown',
			input: Inputs.threadsMarkdown,
			output: Outputs.threadsMarkdown,
		},
		input,
		({ topic_id }) => ({
			method: 'GET',
			path: `/threads/${segment(topic_id)}/markdown`,
			resourceScoped: true,
		}),
		{
			log: ({ topic_id }, result) => ({
				topicId: topic_id,
				characters: result.markdown.length,
			}),
		},
	);

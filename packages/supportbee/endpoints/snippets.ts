import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['snippetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'snippets.list',
			input: Inputs.snippetsList,
			output: Outputs.snippetsList,
		},
		input,
		() => ({ method: 'GET', path: '/snippets' }),
		{
			log: (_, result) => ({ count: result.snippets.length }),
		},
	);

export const create: SupportbeeEndpoints['snippetsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'snippets.create',
			input: Inputs.snippetsCreate,
			output: Outputs.snippetsCreate,
		},
		input,
		({ name, tags, content }) => ({
			method: 'POST',
			path: '/snippets',
			body: {
				snippet: {
					name,
					...(tags === undefined ? {} : { tags }),
					content,
				},
			},
		}),
		{
			log: (_, result) => ({ snippetId: result.snippet.id }),
		},
	);

export const update: SupportbeeEndpoints['snippetsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'snippets.update',
			input: Inputs.snippetsUpdate,
			output: Outputs.snippetsUpdate,
		},
		input,
		({ id, name, tags, content }) => ({
			method: 'PUT',
			path: `/snippets/${segment(id)}`,
			body: {
				snippet: {
					name,
					...(tags === undefined ? {} : { tags }),
					content,
				},
			},
		}),
		{
			log: (parsed) => ({ snippetId: parsed.id }),
		},
	);

export const remove: SupportbeeEndpoints['snippetsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'snippets.delete',
			input: Inputs.snippetsDelete,
			output: Outputs.snippetsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/snippets/${segment(id)}` }),
		{
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: (parsed) => ({ snippetId: parsed.id }),
		},
	);

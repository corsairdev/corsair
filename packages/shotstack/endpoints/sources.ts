import type { ShotstackEndpoints } from '..';
import {
	attributesList,
	attributesOf,
	queuedResourceId,
	segment,
} from '../client';
import { call } from './call';
import type {
	SourcesDeleteInput,
	SourcesFetchInput,
	SourcesGetInput,
} from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const fetch: ShotstackEndpoints['sourcesFetch'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'sources.fetch',
			input: ShotstackEndpointInputSchemas.sourcesFetch,
			output: ShotstackEndpointOutputSchemas.sourcesFetch,
		},
		rawInput,
		(input: SourcesFetchInput) => ({
			method: 'POST',
			service: 'ingest',
			path: '/sources',
			body: {
				url: input.url,
				outputs: input.outputs,
				destinations: input.destinations,
				callback: input.callback,
			},
		}),
		{
			// The queued response carries no attributes, only the new id.
			shape: (raw) => queuedResourceId(raw),
			log: (_input, result) => ({ sourceId: result.id }),
		},
	);
};

export const list: ShotstackEndpoints['sourcesList'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'sources.list',
			input: ShotstackEndpointInputSchemas.sourcesList,
			output: ShotstackEndpointOutputSchemas.sourcesList,
		},
		rawInput,
		() => ({ method: 'GET', service: 'ingest', path: '/sources' }),
		{
			// json:api unwrapped: attributes become the rows.
			shape: (raw) => ({ sources: attributesList(raw) }),
			log: (_input, result) => ({ count: result.sources.length }),
		},
	);
};

export const get: ShotstackEndpoints['sourcesGet'] = async (ctx, rawInput) => {
	return call(
		ctx,
		{
			event: 'sources.get',
			input: ShotstackEndpointInputSchemas.sourcesGet,
			output: ShotstackEndpointOutputSchemas.sourcesGet,
		},
		rawInput,
		(input: SourcesGetInput) => ({
			method: 'GET',
			service: 'ingest',
			path: `/sources/${segment(input.id)}`,
		}),
		{
			shape: (raw) => attributesOf(raw),
			log: (_input, result) => ({
				sourceId: result.id,
				status: result.status ?? undefined,
			}),
		},
	);
};

// `delete` is a reserved word, so the function is `remove`.
export const remove: ShotstackEndpoints['sourcesDelete'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'sources.delete',
			input: ShotstackEndpointInputSchemas.sourcesDelete,
			output: ShotstackEndpointOutputSchemas.sourcesDelete,
		},
		rawInput,
		(input: SourcesDeleteInput) => ({
			method: 'DELETE',
			service: 'ingest',
			path: `/sources/${segment(input.id)}`,
		}),
		{
			shape: (raw) => raw ?? {},
		},
	);
};

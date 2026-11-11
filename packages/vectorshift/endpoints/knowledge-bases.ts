import type { VectorshiftEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	VectorshiftEndpointInputSchemas as Inputs,
	VectorshiftEndpointOutputSchemas as Outputs,
} from './types';

export const create: VectorshiftEndpoints['knowledgeBasesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'knowledgeBases.create',
			input: Inputs.knowledgeBasesCreate,
			output: Outputs.knowledgeBasesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/knowledge-base', body }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				name: parsed.name,
			}),
		},
	);

/**
 * Fetch one knowledge base. The route is `GET /knowledge-bases` (plural) and
 * takes the id or the name as a query parameter, not a path segment.
 */
export const get: VectorshiftEndpoints['knowledgeBasesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'knowledgeBases.get',
			input: Inputs.knowledgeBasesGet,
			output: Outputs.knowledgeBasesGet,
		},
		input,
		({ id, name, username, org_name }) => ({
			method: 'GET',
			path: '/knowledge-bases',
			query: { id, name, username, org_name },
		}),
		{
			log: (parsed) => ({ id: parsed.id, name: parsed.name }),
		},
	);

/** Query is `POST /knowledge-base/{id}/query` (singular), unlike the GET. */
export const query: VectorshiftEndpoints['knowledgeBasesQuery'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'knowledgeBases.query',
			input: Inputs.knowledgeBasesQuery,
			output: Outputs.knowledgeBasesQuery,
		},
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/knowledge-base/${segment(id)}/query`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				queries: parsed.queries.length,
				result: result.result ? Object.keys(result.result).length : 0,
			}),
		},
	);

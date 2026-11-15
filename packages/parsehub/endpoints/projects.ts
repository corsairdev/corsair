import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { ParsehubContext } from '..';
import { makeParsehubRequest } from '../client';
import type { ListProjectsInput, ListProjectsResponse } from './types';
import { ListProjectsInputSchema, ListProjectsResponseSchema } from './types';

export const listProjects: CorsairEndpoint<
	ParsehubContext,
	ListProjectsInput,
	ListProjectsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('parsehub', 'api_key');
	}

	const parsed = ListProjectsInputSchema.parse(input ?? {});
	const body = await makeParsehubRequest<unknown>(ctx.key, {
		offset: parsed.offset,
		limit: parsed.limit,
		include_options:
			parsed.include_options === undefined
				? undefined
				: parsed.include_options
					? 1
					: 0,
	});
	const result = ListProjectsResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'parsehub.projects.list',
		{ offset: parsed.offset ?? 0 },
		'completed',
	);
	return result;
};

export const Projects = { list: listProjects };

import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeParsehubRequest } from '../client';
import type { ParsehubContext } from '../context';
import { ParsehubProjectEntity } from '../schema/database';
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
	await storeProjects(ctx, result.projects);
	await logEventFromContext(
		ctx,
		'parsehub.projects.list',
		{ offset: parsed.offset ?? 0 },
		'completed',
	);
	return result;
};

function projectRow(item: unknown): ParsehubProjectEntity | undefined {
	if (!item || typeof item !== 'object') return undefined;
	const record = item as { token?: unknown; title?: unknown };
	const parsed = ParsehubProjectEntity.safeParse({
		token: record.token,
		title: typeof record.title === 'string' ? record.title : undefined,
	});
	return parsed.success ? parsed.data : undefined;
}

async function storeProjects(
	ctx: ParsehubContext,
	projects: unknown[],
): Promise<void> {
	if (!ctx.db?.projects) return;
	for (const item of projects) {
		const row = projectRow(item);
		if (!row) continue;
		try {
			await ctx.db.projects.upsertByEntityId(row.token, row);
		} catch {
			console.warn('Failed to save ParseHub project');
		}
	}
}

export const Projects = { list: listProjects };

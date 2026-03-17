import { logEventFromContext } from '../../utils/events';
import type { DropboxEndpoints } from '..';
import { makeDropboxRequest } from '../client';
import type { DropboxEndpointOutputs } from './types';

export const query: DropboxEndpoints['searchQuery'] = async (ctx, input) => {
	const result = await makeDropboxRequest<
		DropboxEndpointOutputs['searchQuery']
	>('files/search_v2', ctx.key, {
		method: 'POST',
		body: {
			query: input.query,
			options: {
				path: input.path,
				max_results: input.max_results,
				filename_only: input.filename_only,
			},
		},
	});

	if (result.matches && ctx.db.files) {
		try {
			for (const match of result.matches) {
				const meta = match.metadata?.metadata;
				if (!meta || !meta.id) continue;

				if ('size' in meta) {
					await ctx.db.files.upsertByEntityId(meta.id, {
						id: meta.id,
						name: meta.name,
						path_lower: meta.path_lower,
						path_display: meta.path_display,
						// any cast needed because metadata is a union type at runtime
						size: (meta as { size?: number }).size,
					});
				} else if (ctx.db.folders) {
					await ctx.db.folders.upsertByEntityId(meta.id, {
						id: meta.id,
						name: meta.name,
						path_lower: meta.path_lower,
						path_display: meta.path_display,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'dropbox.search.query',
		{ query: input.query },
		'completed',
	);
	return result;
};

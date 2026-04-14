import { logEventFromContext } from 'corsair/core';
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
				if (!meta) continue;

				if (meta['.tag'] === 'file') {
					await ctx.db.files.upsertByEntityId(meta.id, {
						...meta,
						client_modified: meta.client_modified
							? new Date(meta.client_modified)
							: null,
						server_modified: meta.server_modified
							? new Date(meta.server_modified)
							: null,
					});
				} else if (meta['.tag'] === 'folder' && ctx.db.folders) {
					await ctx.db.folders.upsertByEntityId(meta.id, {
						...meta,
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

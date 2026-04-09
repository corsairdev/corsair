import { logEventFromContext } from 'corsair/core';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const createImport: ExaEndpoints['importsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['importsCreate']>(
		`websets/v0/websets/${input.websetId}/imports`,
		ctx.key,
		{
			method: 'POST',
			body: { urls: input.urls },
		},
	);

	if (ctx.db.imports) {
		try {
			await ctx.db.imports.upsertByEntityId(result.id, {
				...result,
				createdAt: new Date(result.createdAt),
				updatedAt: result.updatedAt ? new Date(result.updatedAt) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save import to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.imports.create',
		{ websetId: input.websetId, urlCount: input.urls.length },
		'completed',
	);
	return result;
};

export const listImports: ExaEndpoints['importsList'] = async (ctx, input) => {
	const { websetId, ...queryParams } = input;
	const result = await makeExaRequest<ExaEndpointOutputs['importsList']>(
		`websets/v0/websets/${websetId}/imports`,
		ctx.key,
		{
			method: 'GET',
			query: queryParams as Record<
				string,
				string | number | boolean | undefined
			>,
		},
	);

	if (result.data && ctx.db.imports) {
		try {
			for (const imp of result.data) {
				await ctx.db.imports.upsertByEntityId(imp.id, {
					...imp,
					createdAt: new Date(imp.createdAt),
					updatedAt: imp.updatedAt ? new Date(imp.updatedAt) : undefined,
				});
			}
		} catch (error) {
			console.warn('Failed to save imports to database:', error);
		}
	}

	await logEventFromContext(ctx, 'exa.imports.list', { websetId }, 'completed');
	return result;
};

export const deleteImport: ExaEndpoints['importsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeExaRequest<ExaEndpointOutputs['importsDelete']>(
		`websets/v0/websets/${input.websetId}/imports/${input.importId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (result.deleted && ctx.db.imports) {
		try {
			await ctx.db.imports.deleteByEntityId(input.importId);
		} catch (error) {
			console.warn('Failed to delete import from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.imports.delete',
		{ websetId: input.websetId, importId: input.importId },
		'completed',
	);
	return result;
};

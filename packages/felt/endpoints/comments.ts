import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { CommentResolved, CommentsExportResponse } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Comments = {
	export: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.commentsExport.parse(rawInput);
		const response = await makeFeltRequest<CommentsExportResponse>(
			`/maps/${encodeURIComponent(input.map_id)}/comments/export`,
			ctx.key,
			{
				method: 'GET',
				query: input.format ? { format: input.format } : undefined,
			},
		);
		// Felt serves the geojson export as text; hand it back as an object like the json export.
		// `unknown` because the body is either the response or JSON parsed from it; the schema below narrows it.
		let body: unknown = response;
		if (input.format === 'geojson' && typeof response === 'string') {
			try {
				body = JSON.parse(response);
			} catch {
				body = response;
			}
		}
		const parsed = FeltEndpointOutputSchemas.commentsExport.parse(body);
		await logEventFromContext(
			ctx,
			'felt.comments.export',
			{
				map_id: input.map_id,
				format: input.format ?? 'json',
				...(Array.isArray(parsed) ? { count: parsed.length } : {}),
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['commentsExport'],

	resolve: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.commentsResolve.parse(rawInput);
		const response = await makeFeltRequest<CommentResolved>(
			`/maps/${encodeURIComponent(input.map_id)}/comments/${encodeURIComponent(input.comment_id)}/resolve`,
			ctx.key,
			{
				method: 'POST',
			},
		);
		const parsed = FeltEndpointOutputSchemas.commentsResolve.parse(response);
		await logEventFromContext(
			ctx,
			'felt.comments.resolve',
			{ map_id: input.map_id, comment_id: input.comment_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['commentsResolve'],

	delete: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.commentsDelete.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/comments/${encodeURIComponent(input.comment_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.commentsDelete.parse({
			success: true,
			id: input.comment_id,
		});
		await logEventFromContext(
			ctx,
			'felt.comments.delete',
			{ map_id: input.map_id, comment_id: input.comment_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['commentsDelete'],
};

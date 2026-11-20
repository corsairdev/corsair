import { logEventFromContext } from 'corsair/core';
import { resolveFileInput } from 'corsair/http';
import { makeAgentQLRequest } from '../client';
import type { AgentQLEndpoints } from '../index';
import { buildQueryDocumentCacheKey, hashFileContent } from './cache-keys';
import type { AgentQLQueryDocumentResponse } from './types';

/**
 * Most bytes taken from a link, base64 or a data: URL: core's download default,
 * passed explicitly so inline base64 is held to it too (core caps it only when asked).
 */
const FILE_MAX_BYTES = 25 * 1024 * 1024;

export const queryDocument: AgentQLEndpoints['queryDocument'] = async (
	ctx,
	input,
) => {
	// A link or base64 becomes the file here; a Blob is sent as it was given.
	// AgentQL documents no size limit, so core's default download cap applies.
	let file: Blob;
	let linkedName: string | undefined;
	if (input.file instanceof Blob) {
		file = input.file;
	} else {
		const resolved = await resolveFileInput(input.file, {
			maxBytes: FILE_MAX_BYTES,
			fallbackName: 'document',
		});
		file = resolved.file;
		linkedName = resolved.filename;
	}
	const fileName = input.fileName ?? linkedName;

	// The bytes are hashed, not the input, so a link and the same file as a
	// Blob give the same cache key.
	const fileHash = await hashFileContent(file);

	const body = JSON.stringify({
		query: input.query,
		prompt: input.prompt,
		params: input.params,
	});

	const response = await makeAgentQLRequest<AgentQLQueryDocumentResponse>(
		'/v1/query-document',
		ctx.key,
		{
			method: 'POST',
			formData: {
				file,
				body,
			},
		},
	);

	if (ctx.db.documentQueryResults) {
		try {
			const entityId =
				response.metadata?.request_id ??
				buildQueryDocumentCacheKey({ ...input, fileName }, fileHash);

			await ctx.db.documentQueryResults.upsertByEntityId(entityId, {
				fileName,
				query: input.query,
				prompt: input.prompt,
				data: response.data,
				generatedQuery: response.metadata?.generated_query,
				requestId: response.metadata?.request_id,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[agentql] Failed to save document query result to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'agentql.data.queryDocument',
		{
			hasQuery: Boolean(input.query),
			hasPrompt: Boolean(input.prompt),
			fileName,
		},
		'completed',
	);

	return response;
};

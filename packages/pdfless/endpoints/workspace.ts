import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { pdflessGet } from '../client';
import type { PdfLessContext } from '../context';
import { PdfLessWorkspaceEntity } from '../schema/database';
import type { GetWorkspaceInput, GetWorkspaceResponse } from './types';
import { GetWorkspaceInputSchema, GetWorkspaceResponseSchema } from './types';

export const getWorkspace: CorsairEndpoint<
	PdfLessContext,
	GetWorkspaceInput,
	GetWorkspaceResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('pdfless', 'api_key');
	}
	GetWorkspaceInputSchema.parse(input ?? {});
	// unknown: the raw reply is untrusted until the schema parses it below.
	const body = await pdflessGet<unknown>(ctx.key, '/v1/workspaces');
	const result = GetWorkspaceResponseSchema.parse(body);
	await storeWorkspace(ctx, result);
	await logEventFromContext(ctx, 'pdfless.workspace.get', {}, 'completed');
	return result;
};

async function storeWorkspace(
	ctx: PdfLessContext,
	workspace: GetWorkspaceResponse,
): Promise<void> {
	if (!ctx.db?.workspaces || !workspace.name) return;
	const row = PdfLessWorkspaceEntity.safeParse(workspace);
	if (!row.success) return;
	try {
		await ctx.db.workspaces.upsertByEntityId(row.data.name, row.data);
	} catch {
		console.warn('Failed to save PDFLess workspace');
	}
}

import type { Api2PdfContext } from '../index';
import type { Api2PdfJobResponse } from './types';

export async function cachePdfJob(
	ctx: Api2PdfContext,
	operation: string,
	response: Api2PdfJobResponse,
): Promise<void> {
	if (!ctx.db.pdfJobs || !response.ResponseId) {
		return;
	}

	try {
		await ctx.db.pdfJobs.upsertByEntityId(response.ResponseId, {
			id: response.ResponseId,
			operation,
			responseId: response.ResponseId,
			fileUrl: response.FileUrl ?? null,
			success: response.Success,
			cost: response.Cost ?? null,
			mbOut: response.MbOut ?? null,
			seconds: response.Seconds ?? null,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('[api2pdf] Failed to save job to database:', error);
	}
}

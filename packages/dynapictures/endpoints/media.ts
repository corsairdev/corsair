import { logEventFromContext } from 'corsair/core';
import { makeDynapicturesRequest } from '../client';
import type { DynapicturesEndpoints } from '../index';
import {
	UploadMediaAssetInputSchema,
	UploadMediaAssetResponseSchema,
} from './types';

function filenameFromUrl(fileUrl: string): string {
	try {
		const pathname = new URL(fileUrl).pathname;
		const last = pathname.split('/').pop();
		return last && last.includes('.') ? last : 'upload.jpg';
	} catch {
		return 'upload.jpg';
	}
}

export const uploadMediaAsset: DynapicturesEndpoints['uploadMediaAsset'] =
	async (ctx, rawInput) => {
		const input = UploadMediaAssetInputSchema.parse(rawInput);
		const downloaded = await fetch(input.fileUrl);
		if (!downloaded.ok) {
			throw new Error(`Failed to download fileUrl (${downloaded.status})`);
		}
		const bytes = await downloaded.arrayBuffer();
		const mime =
			downloaded.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
		const filename = input.filename ?? filenameFromUrl(input.fileUrl);
		const file = new File([new Uint8Array(bytes)], filename, { type: mime });

		const response = await makeDynapicturesRequest<unknown>(
			`/media/${encodeURIComponent(input.workspaceId)}/assets`,
			ctx.key,
			{ method: 'POST', formData: { file } },
		);
		const parsed = UploadMediaAssetResponseSchema.parse(response);
		await logEventFromContext(
			ctx,
			'dynapictures.media.upload',
			{ id: parsed.id, workspaceId: input.workspaceId },
			'completed',
		);
		return parsed;
	};

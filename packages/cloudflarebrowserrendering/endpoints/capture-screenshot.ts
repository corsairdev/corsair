import { CloudflareBrowserRenderingClient } from '../client';
import type { CloudflareBrowserRenderingContext } from '../index';
import type {
	CaptureScreenshotCreateInput,
	CaptureScreenshotCreateResponse,
} from './types';

export const CaptureScreenshot = {
	create: async (
		ctx: CloudflareBrowserRenderingContext,
		input: CaptureScreenshotCreateInput,
	): Promise<CaptureScreenshotCreateResponse> => {
		const client = new CloudflareBrowserRenderingClient(ctx);
		const viewport =
			input.viewportWidth && input.viewportHeight
				? { width: input.viewportWidth, height: input.viewportHeight }
				: undefined;
		return client.captureScreenshot(input.accountId, input.url, viewport);
	},
};

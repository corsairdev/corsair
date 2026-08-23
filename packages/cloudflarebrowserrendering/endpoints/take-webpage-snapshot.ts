import { CloudflareBrowserRenderingClient } from '../client';
import type { CloudflareBrowserRenderingContext } from '../index';
import type {
	TakeWebpageSnapshotCreateInput,
	TakeWebpageSnapshotCreateResponse,
} from './types';

export const TakeWebpageSnapshot = {
	create: async (
		ctx: CloudflareBrowserRenderingContext,
		input: TakeWebpageSnapshotCreateInput,
	): Promise<TakeWebpageSnapshotCreateResponse> => {
		const client = new CloudflareBrowserRenderingClient(ctx);
		return client.takeWebpageSnapshot(input.accountId, input.url);
	},
};

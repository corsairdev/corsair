import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const getSnapshotStatus: BrightDataEndpoints['getSnapshotStatus'] =
	async (ctx, input) => {
		const response = await makeBrightDataRequest<unknown>(
			`/datasets/v3/progress/${encodeURIComponent(input.snapshot_id)}`,
			requireBrightDataKey(ctx.key),
		);
		const parsed =
			BrightDataEndpointOutputSchemas.getSnapshotStatus.parse(response);
		await logEventFromContext(
			ctx,
			'brightdata.get_snapshot_status',
			{ snapshot_id: input.snapshot_id, status: parsed.status },
			'completed',
		);
		return parsed;
	};

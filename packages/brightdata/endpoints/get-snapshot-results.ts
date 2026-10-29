import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const getSnapshotResults: BrightDataEndpoints['getSnapshotResults'] =
	async (ctx, input) => {
		const { snapshot_id, ...query } = input;
		const response = await makeBrightDataRequest<unknown>(
			`/datasets/v3/snapshot/${encodeURIComponent(snapshot_id)}`,
			requireBrightDataKey(ctx.key),
			{ query },
		);
		const parsed =
			BrightDataEndpointOutputSchemas.getSnapshotResults.parse(response);
		await logEventFromContext(
			ctx,
			'brightdata.get_snapshot_results',
			{ snapshot_id },
			'completed',
		);
		return parsed;
	};

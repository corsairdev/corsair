import { logEventFromContext } from 'corsair/core';
import type { BrightDataEndpoints } from '..';
import { makeBrightDataRequest, requireBrightDataKey } from '../client';
import { BrightDataEndpointOutputSchemas } from './types';

export const listWebUnlockerZones: BrightDataEndpoints['listWebUnlockerZones'] =
	async (ctx, input) => {
		const response = await makeBrightDataRequest<unknown>(
			'/zone/get_active_zones',
			requireBrightDataKey(ctx.key),
		);
		const parsed =
			BrightDataEndpointOutputSchemas.listWebUnlockerZones.parse(response);
		await logEventFromContext(
			ctx,
			'brightdata.list_web_unlocker_zones',
			{ ...input, count: parsed.length },
			'completed',
		);
		return parsed;
	};

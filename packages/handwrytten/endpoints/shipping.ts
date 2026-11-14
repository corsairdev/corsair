import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type { ShippingStampOptionsResponse } from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const stampOptions: HandwryttenEndpoints['shipping.stampOptions'] =
	async (ctx, input) => {
		HandwryttenEndpointInputSchemas['shipping.stampOptions'].parse(input);
		const response =
			await makeHandwryttenRequest<ShippingStampOptionsResponse>(
				'/shipping/stampOptions',
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed =
			HandwryttenEndpointOutputSchemas['shipping.stampOptions'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'handwrytten.shipping.stampOptions',
			{ count: parsed.stamp_options?.length ?? 0 },
			'completed',
		);
		return parsed;
	};

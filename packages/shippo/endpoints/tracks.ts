import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The tracking status. Shippo answers 404 for a tracking number it has never
 * seen; registering it with `register` first is what makes it lookable.
 */
export const get: ShippoEndpoints['tracksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tracks.get',
			input: Inputs.tracksGet,
			output: Outputs.tracksGet,
		},
		input,
		({ carrier, tracking_number, shippo_account_id }) => ({
			method: 'GET',
			path: `/tracks/${segment(carrier)}/${segment(tracking_number)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ carrier, tracking_number }, result) => ({
				carrier,
				trackingNumber: tracking_number,
				status: result.tracking_status?.status ?? undefined,
			}),
		},
	);

/**
 * Registers a tracking number Shippo has not seen, usually because the label
 * was bought elsewhere. It answers with the track object; from then on
 * `track_updated` webhooks fire for it.
 */
export const register: ShippoEndpoints['tracksRegister'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tracks.register',
			input: Inputs.tracksRegister,
			output: Outputs.tracksRegister,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/tracks',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				carrier: parsed.carrier,
				trackingNumber: parsed.tracking_number,
				status: result.tracking_status?.status ?? undefined,
			}),
		},
	);

import { asRecord } from 'corsair/core';
import type { WoodpeckerCoContext, WoodpeckerCoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WoodpeckerCoEndpointInputSchemas as Inputs,
	WoodpeckerCoEndpointOutputSchemas as Outputs,
} from './types';

export const list: WoodpeckerCoEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		({ status, id }) => ({
			method: 'GET',
			path: '/v1/campaign_list',
			query: { status: status?.join(','), id: id?.join(',') },
		}),
		{
			// No matching campaign is a bodyless 204.
			shape: (raw) => ({ campaigns: raw ?? [] }),
			log: (_, result) => ({ count: result.campaigns.length }),
		},
	);

/** Run, pause and stop share one request and an empty 200. */
function changeStatus(
	ctx: WoodpeckerCoContext,
	action: 'run' | 'pause' | 'stop',
	// unknown: raw caller input, parsed by call().
	input: unknown,
) {
	return call(
		ctx,
		{
			event: `campaigns.${action}`,
			input: Inputs.campaignsRun,
			output: Outputs.campaignsRun,
		},
		input,
		({ campaign_id }) => ({
			method: 'POST',
			path: `/v2/campaigns/${segment(campaign_id)}/${action}`,
		}),
		{
			shape: (_, { campaign_id }) => ({ success: true, campaign_id }),
			log: ({ campaign_id }) => ({ campaignId: campaign_id }),
		},
	);
}

export const run: WoodpeckerCoEndpoints['campaignsRun'] = (ctx, input) =>
	changeStatus(ctx, 'run', input);

export const pause: WoodpeckerCoEndpoints['campaignsPause'] = (ctx, input) =>
	changeStatus(ctx, 'pause', input);

export const stop: WoodpeckerCoEndpoints['campaignsStop'] = (ctx, input) =>
	changeStatus(ctx, 'stop', input);

export const deleteStep: WoodpeckerCoEndpoints['campaignsDeleteStep'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.deleteStep',
			input: Inputs.campaignsDeleteStep,
			output: Outputs.campaignsDeleteStep,
		},
		input,
		({ campaign_id, step_id }) => ({
			method: 'DELETE',
			path: `/v2/campaigns/${segment(campaign_id)}/steps/${segment(step_id)}`,
		}),
		{
			// The step is gone by now, so a missing campaign payload is not a failure.
			shape: (raw, { campaign_id, step_id }) => ({
				success: true,
				campaign_id,
				step_id,
				campaign: asRecord(raw) ?? undefined,
			}),
			log: ({ campaign_id, step_id }) => ({
				campaignId: campaign_id,
				stepId: step_id,
			}),
		},
	);

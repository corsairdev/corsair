import type { ToneDenEndpoints } from '..';
import { segment } from '../client';
import { call, writeBody } from './call';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './types';

export const get: ToneDenEndpoints['playbooksGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'playbooks.get',
			input: ToneDenEndpointInputSchemas.getPlaybookCampaign,
			output: ToneDenEndpointOutputSchemas.getPlaybookCampaign,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `playbooks/campaigns/${segment(parsed.campaign_id)}`,
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const create: ToneDenEndpoints['playbooksCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'playbooks.create',
			input: ToneDenEndpointInputSchemas.createPlaybookCampaign,
			output: ToneDenEndpointOutputSchemas.createPlaybookCampaign,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'playbooks/campaigns',
			// unknown: the input schema validated every value; writeBody only copies them.
			body: writeBody(parsed as Record<string, unknown>, []),
		}),
		{ log: (parsed) => ({ template_id: parsed.template_id }) },
	);

export const update: ToneDenEndpoints['playbooksUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'playbooks.update',
			input: ToneDenEndpointInputSchemas.updatePlaybookCampaign,
			output: ToneDenEndpointOutputSchemas.updatePlaybookCampaign,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `playbooks/campaigns/${segment(parsed.campaign_id)}`,
			// unknown: the input schema validated every value; writeBody only copies them.
			body: writeBody(parsed as Record<string, unknown>, ['campaign_id']),
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const remove: ToneDenEndpoints['playbooksDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'playbooks.delete',
			input: ToneDenEndpointInputSchemas.deletePlaybookCampaign,
			output: ToneDenEndpointOutputSchemas.deletePlaybookCampaign,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `playbooks/campaigns/${segment(parsed.campaign_id)}`,
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

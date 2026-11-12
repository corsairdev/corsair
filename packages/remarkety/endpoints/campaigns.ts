import type { RemarketyEndpoints } from '..';
import { segment } from '../client';
import { call, storePath } from './call';
import {
	RemarketyEndpointInputSchemas as Inputs,
	RemarketyEndpointOutputSchemas as Outputs,
} from './types';

export const create: RemarketyEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		({ storeId, type, actions, mode, testEmail }) => ({
			method: 'POST',
			path: storePath(storeId, '/campaigns'),
			body: { type, actions, mode, testEmail },
			// Two creates make two campaigns.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				campaignId: result.id ?? undefined,
				type: parsed.type,
				mode: result.mode ?? undefined,
			}),
		},
	);

/**
 * Updates a campaign.
 *
 * The route is `PUT /stores/{storeId}/campaigns` with the campaign `id` in the
 * body, not a per-campaign path. A campaign with `mode: run` is contacting
 * shoppers, so a change here can start or stop real send.
 */
export const update: RemarketyEndpoints['campaignsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: Inputs.campaignsUpdate,
			output: Outputs.campaignsUpdate,
		},
		input,
		({ storeId, id, type, actions, mode, testEmail }) => ({
			method: 'PUT',
			path: storePath(storeId, '/campaigns'),
			body: { id, type, actions, mode, testEmail },
			// A PUT with the same body leaves the same campaign, unless mode changed and
			// the campaign started sending; the caller who set mode owns that choice.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				campaignId: result.id ?? parsed.id,
				mode: result.mode ?? undefined,
			}),
		},
	);

export const get: RemarketyEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		({ storeId, campaignId }) => ({
			method: 'GET',
			path: storePath(storeId, `/campaigns/${segment(campaignId)}`),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				type: result.type ?? undefined,
				mode: result.mode ?? undefined,
			}),
		},
	);

export const remove: RemarketyEndpoints['campaignsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.delete',
			input: Inputs.campaignsDelete,
			output: Outputs.campaignsDelete,
		},
		input,
		({ storeId, campaignId }) => ({
			method: 'DELETE',
			path: storePath(storeId, `/campaigns/${segment(campaignId)}`),
			// A second delete finds nothing; the campaign is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ campaignId: parsed.campaignId }),
		},
	);

/**
 * Campaign performance.
 *
 * Revenue is reported twice: `totalOrdersUSD` normalised to dollars and
 * `totalOrders` in the store's own currency, so a store not priced in USD gets two
 * different numbers for the same orders.
 */
export const stats: RemarketyEndpoints['campaignsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.stats',
			input: Inputs.campaignsStats,
			output: Outputs.campaignsStats,
		},
		input,
		({ storeId, campaignId }) => ({
			method: 'GET',
			path: storePath(storeId, '/campaigns/stats'),
			query: { campaignId },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				campaigns: result.length,
				orders: result.reduce((total, row) => total + (row.numOrders ?? 0), 0),
			}),
		},
	);

/** The campaign types the store supports, optionally only one type's options. */
export const types: RemarketyEndpoints['campaignsTypes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.types',
			input: Inputs.campaignsTypes,
			output: Outputs.campaignsTypes,
		},
		input,
		({ storeId, type }) => ({
			method: 'GET',
			path: storePath(storeId, '/campaigns/types'),
			query: { type },
			replayable: true,
		}),
		{
			log: (_, result) => ({ types: Object.keys(result).length }),
		},
	);

// ── email templates ───────────────────────────────────────────────────────

/** The path one campaign rule's email template lives at. */
function templatePath(
	storeId: string | number,
	campaignId: number,
	ruleId: number,
	suffix = '',
): string {
	return storePath(
		storeId,
		`/campaigns/${segment(campaignId)}/rule/${segment(ruleId)}/email-template${suffix}`,
	);
}

export const template: RemarketyEndpoints['emailTemplateGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'emailTemplates.get',
			input: Inputs.emailTemplateGet,
			output: Outputs.emailTemplateGet,
		},
		input,
		({ storeId, campaignId, ruleId }) => ({
			method: 'GET',
			path: templatePath(storeId, campaignId, ruleId),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				type: result.type ?? undefined,
				htmlLength: result.html?.length ?? 0,
			}),
		},
	);

export const updateTemplate: RemarketyEndpoints['emailTemplateUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emailTemplates.update',
			input: Inputs.emailTemplateUpdate,
			output: Outputs.emailTemplateUpdate,
		},
		input,
		({ storeId, campaignId, ruleId, type, html, masterTemplate }) => ({
			method: 'POST',
			path: templatePath(storeId, campaignId, ruleId),
			body: { type, html, masterTemplate },
			// Replacing the template with the same content leaves the same template.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				type: result.type ?? undefined,
				htmlLength: result.html?.length ?? 0,
			}),
		},
	);

/**
 * The sample data a campaign's merge fields resolve against.
 *
 * Passing a `shopper` or `order` builds the data for that real record, which is the
 * most reliable way to see what a template will actually receive.
 */
export const preview: RemarketyEndpoints['emailPreview'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'emailTemplates.preview',
			input: Inputs.emailPreview,
			output: Outputs.emailPreview,
		},
		input,
		({ storeId, campaignId, ruleId, type, shopper, order }) => ({
			method: 'GET',
			path: storePath(
				storeId,
				`/campaigns/${segment(campaignId)}/rule/${segment(ruleId)}/preview`,
			),
			query: { type, shopper, order },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				type: result.type ?? undefined,
				hasShopper: result.shopper !== null && result.shopper !== undefined,
				hasOrder: result.order !== null && result.order !== undefined,
			}),
		},
	);

// ── master templates ──────────────────────────────────────────────────────

export const masterTemplates: RemarketyEndpoints['masterTemplatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'masterTemplates.list',
			input: Inputs.masterTemplatesList,
			output: Outputs.masterTemplatesList,
		},
		input,
		({ storeId, q }) => ({
			method: 'GET',
			path: storePath(storeId, '/master-templates'),
			query: { q },
			replayable: true,
		}),
		{
			log: (_, result) => ({ templates: result.length }),
		},
	);

/**
 * Converts a campaign's current HTML into a new master template, which is how an
 * existing design becomes reusable across campaigns.
 */
export const switchTemplate: RemarketyEndpoints['masterTemplateSwitch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'masterTemplates.switch',
			input: Inputs.masterTemplateSwitch,
			output: Outputs.masterTemplateSwitch,
		},
		input,
		({ storeId, masterTemplateId, type, html }) => ({
			method: 'POST',
			path: storePath(
				storeId,
				`/master-templates/switch/${segment(masterTemplateId)}`,
			),
			body: { type, html },
			// A replay re-converts the same HTML into the same template.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				type: result.type ?? undefined,
				htmlLength: result.html?.length ?? 0,
			}),
		},
	);

// ── products, rules and segments ──────────────────────────────────────────

export const products: RemarketyEndpoints['productsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		({ storeId, q, limit, page, minUpdate }) => ({
			method: 'GET',
			path: storePath(storeId, '/products'),
			query: { q, limit, page, minUpdate },
			replayable: true,
		}),
		{
			log: (_, result) => ({ products: result.length }),
		},
	);

/**
 * Every rule the store can use in a campaign action, keyed by rule type.
 *
 * This is what makes a campaign creatable without guessing: a rule's `operators`,
 * `possibleValues` and `defaultValue` are all here.
 */
export const rules: RemarketyEndpoints['rulesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rules.list',
			input: Inputs.rulesList,
			output: Outputs.rulesList,
		},
		input,
		({ storeId }) => ({
			method: 'GET',
			path: storePath(storeId, '/rules'),
			replayable: true,
		}),
		{
			log: (_, result) => ({ rules: result.length }),
		},
	);

export const rule: RemarketyEndpoints['rulesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rules.get',
			input: Inputs.rulesGet,
			output: Outputs.rulesGet,
		},
		input,
		({ storeId, ruleType }) => ({
			method: 'GET',
			path: storePath(storeId, `/rules/${segment(ruleType)}`),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				displayName: result.displayName ?? undefined,
				operators: result.operators?.length ?? 0,
			}),
		},
	);

/** How many shoppers match a segment, before a campaign is sent to them. */
export const segmentCount: RemarketyEndpoints['segmentsCount'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.count',
			input: Inputs.segmentsCount,
			output: Outputs.segmentsCount,
		},
		input,
		({ storeId }) => ({
			method: 'GET',
			path: storePath(storeId, '/segments/count'),
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.count ?? 0 }),
		},
	);

export const segmentList: RemarketyEndpoints['segmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.list',
			input: Inputs.segmentsList,
			output: Outputs.segmentsList,
		},
		input,
		({ storeId, page, limit }) => ({
			method: 'GET',
			path: storePath(storeId, '/segments/list'),
			query: { page, limit },
			replayable: true,
		}),
		{
			log: (_, result) => ({ emails: result.length }),
		},
	);

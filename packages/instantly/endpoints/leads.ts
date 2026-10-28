import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { forgetLead, saveLeads } from './store';

// POST because the filters do not fit a query string; it only reads.
export const list: InstantlyEndpoints['leadsList'] = (ctx, input) =>
	call(
		ctx,
		'leadsList',
		'leads.list',
		input,
		(body) => ({ method: 'POST', path: '/leads/list', body }),
		{
			log: ({ campaign, list_id }, result) => ({
				campaignId: campaign,
				listId: list_id,
				count: result.items.length,
			}),
			after: (result) => saveLeads(ctx, result.items),
		},
	);

export const get: InstantlyEndpoints['leadsGet'] = (ctx, input) =>
	call(
		ctx,
		'leadsGet',
		'leads.get',
		input,
		({ id }) => ({ method: 'GET', path: `/leads/${segment(id)}` }),
		{
			log: ({ id }) => ({ leadId: id }),
			after: (result) => saveLeads(ctx, [result]),
		},
	);

// Counts toward the workspace's lifetime contact limit.
export const create: InstantlyEndpoints['leadsCreate'] = (ctx, input) =>
	call(
		ctx,
		'leadsCreate',
		'leads.create',
		input,
		(body) => ({ method: 'POST', path: '/leads', body }),
		{
			log: ({ campaign, list_id }, result) => ({
				campaignId: campaign,
				listId: list_id,
				leadId: result.id,
			}),
			after: (result) => saveLeads(ctx, [result]),
		},
	);

// Every lead uploaded counts toward the lifetime contact limit, which is why
// skip_if_in_workspace defaults to true and the call is never retried.
export const addBulk: InstantlyEndpoints['leadsAddBulk'] = (ctx, input) =>
	call(
		ctx,
		'leadsAddBulk',
		'leads.addBulk',
		input,
		(body) => ({ method: 'POST', path: '/leads/add', body }),
		{
			log: ({ campaign_id, list_id, leads }, result) => ({
				campaignId: campaign_id,
				listId: list_id,
				sent: leads.length,
				uploaded: result.leads_uploaded,
				skipped: result.skipped_count,
				remainingInPlan: result.remaining_in_plan,
			}),
		},
	);

export const update: InstantlyEndpoints['leadsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'leadsUpdate',
		'leads.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/leads/${segment(id)}`,
			body,
		}),
		{
			log: ({ id, ...changes }) => ({
				leadId: id,
				fields: Object.keys(changes).join(','),
			}),
			after: (result) => saveLeads(ctx, [result]),
		},
	);

// Instantly answers 202 and applies the change in a background job. In a
// campaign this completes the lead, which stops its follow-ups.
export const updateInterestStatus: InstantlyEndpoints['leadsUpdateInterestStatus'] =
	(ctx, input) =>
		call(
			ctx,
			'leadsUpdateInterestStatus',
			'leads.updateInterestStatus',
			input,
			(body) => ({
				method: 'POST',
				path: '/leads/update-interest-status',
				body,
			}),
			{
				log: ({ interest_value, campaign_id, list_id }) => ({
					interestValue: interest_value,
					campaignId: campaign_id,
					listId: list_id,
				}),
			},
		);

export const remove: InstantlyEndpoints['leadsDelete'] = (ctx, input) =>
	call(
		ctx,
		'leadsDelete',
		'leads.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/leads/${segment(id)}` }),
		{
			log: ({ id }) => ({ leadId: id }),
			after: (_, { id }) => forgetLead(ctx, id),
		},
	);

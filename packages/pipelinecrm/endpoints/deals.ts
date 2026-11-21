import type { PipelineCrmEndpoints } from '..';
import { call } from './call';
import {
	conditionsQuery,
	PipelineCrmEndpointInputSchemas as Inputs,
	PipelineCrmEndpointOutputSchemas as Outputs,
} from './types';

const V3 = '/api/v3';

/** Maps the writable fields onto the wrapped deal body. */
function dealBody(d: {
	name?: string;
	summary?: string;
	userId?: number;
	status?: number;
	expectedCloseDate?: string;
	closedTime?: string;
	isArchived?: boolean;
	value?: number | string;
	primaryContactId?: number;
	personIds?: number[];
	sharedUserIds?: number[];
	companyId?: number;
	companyName?: string;
	probability?: number;
	dealStageId?: number;
	dealLossReasonId?: number;
	dealLossReasonNotes?: string;
	dealWonReasonId?: number;
	dealWonReasonNotes?: string;
	dealSource?: number;
	tagIds?: number[];
	// unknown: custom field values follow each field's type, keyed
	// custom_label_<id>, and the built body carries them through.
	customFields?: Record<string, unknown>;
}): Record<string, unknown> {
	return {
		name: d.name,
		summary: d.summary,
		user_id: d.userId,
		status: d.status,
		expected_close_date: d.expectedCloseDate,
		closed_time: d.closedTime,
		is_archived: d.isArchived,
		value: d.value,
		primary_contact_id: d.primaryContactId,
		person_ids: d.personIds,
		shared_user_ids: d.sharedUserIds,
		company_id: d.companyId,
		company_name: d.companyName,
		probability: d.probability,
		deal_stage_id: d.dealStageId,
		deal_loss_reason_id: d.dealLossReasonId,
		deal_loss_reason_notes: d.dealLossReasonNotes,
		deal_won_reason_id: d.dealWonReasonId,
		deal_won_reason_notes: d.dealWonReasonNotes,
		deal_source: d.dealSource,
		tag_ids: d.tagIds,
		custom_fields: d.customFields,
	};
}

export const list: PipelineCrmEndpoints['dealsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.list',
			input: Inputs.dealsList,
			output: Outputs.dealsList,
		},
		input,
		({ conditions, sort, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/deals`,
			query: { ...conditionsQuery(conditions), sort, page, per_page: perPage },
		}),
		{ log: (_, page_) => ({ count: page_.entries.length }) },
	);

export const create: PipelineCrmEndpoints['dealsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.create',
			input: Inputs.dealsCreate,
			output: Outputs.dealsCreate,
		},
		input,
		({ deliverAssignmentEmail, ...fields }) => ({
			method: 'POST',
			path: `${V3}/deals`,
			query: { deliver_assignment_email: deliverAssignmentEmail },
			body: { deal: dealBody(fields) },
		}),
		{ log: (_, deal) => ({ dealId: deal.id ?? undefined }) },
	);

export const get: PipelineCrmEndpoints['dealsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.get',
			input: Inputs.dealsGet,
			output: Outputs.dealsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/deals/${id}` }),
		{ log: (_, deal) => ({ dealId: deal.id ?? undefined }) },
	);

export const update: PipelineCrmEndpoints['dealsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.update',
			input: Inputs.dealsUpdate,
			output: Outputs.dealsUpdate,
		},
		input,
		({ id, deliverReassignmentEmail, ...fields }) => ({
			method: 'PUT',
			path: `${V3}/deals/${id}`,
			query: { deliver_reassignment_email: deliverReassignmentEmail },
			body: { deal: dealBody(fields) },
		}),
		{ log: ({ id }) => ({ dealId: id }) },
	);

export const deleteDeal: PipelineCrmEndpoints['dealsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.delete',
			input: Inputs.dealsDelete,
			output: Outputs.dealsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `${V3}/deals/${id}` }),
		{ log: ({ id }) => ({ dealId: id }) },
	);

export const totalsByStage: PipelineCrmEndpoints['dealsTotalsByStage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'deals.totalsByStage',
			input: Inputs.dealsTotalsByStage,
			output: Outputs.dealsTotalsByStage,
		},
		input,
		() => ({ method: 'GET', path: `${V3}/deals/totals_by_stage` }),
		{ log: (_, totals) => ({ stages: totals.length }) },
	);

export const listNotes: PipelineCrmEndpoints['dealsListNotes'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.listNotes',
			input: Inputs.dealsListNotes,
			output: Outputs.dealsListNotes,
		},
		input,
		({ id, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/deals/${id}/notes`,
			query: { page, per_page: perPage },
		}),
		{
			log: (parsed, page_) => ({
				dealId: parsed.id,
				count: page_.entries.length,
			}),
		},
	);

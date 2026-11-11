import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	DealInputSchemas as Inputs,
	DealOutputSchemas as Outputs,
} from './deal-types';

// Handlers are structurally typed until the central FollowUpBossEndpoints map
// gains the deals family; call() owns input parsing and output validation.

// FUB publishes the deal custom field list under the envelope key
// `dealCustomfields` (lowercase `f`), unlike the camelCase resource path; the
// camelCase spelling is accepted from the wire as well.
// unknown: raw is the response body until asRecord narrows it, and the return
// stays unknown on purpose so a malformed non-array collection reaches the
// output schema's z.array instead of being masked as an empty list.
function dealCustomFieldsMany(raw: unknown): unknown {
	const documented = envelopeMany(raw, 'dealCustomfields');
	if (!Array.isArray(documented)) return documented;
	if (documented.length > 0) return documented;
	const camel = envelopeMany(raw, 'dealCustomFields');
	return Array.isArray(camel) && camel.length > 0 ? camel : documented;
}

// Same pattern: the documented list envelope key is all lowercase.
// unknown: same open response body and deliberate opaque return as above.
function appointmentOutcomesMany(raw: unknown): unknown {
	const documented = envelopeMany(raw, 'appointmentoutcomes');
	if (!Array.isArray(documented)) return documented;
	if (documented.length > 0) return documented;
	const camel = envelopeMany(raw, 'appointmentOutcomes');
	return Array.isArray(camel) && camel.length > 0 ? camel : documented;
}

// ── deals ──────────────────────────────────────────────────────────────────

export const dealsList: FollowUpBossEndpoints['dealsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.list',
			input: Inputs.dealsList,
			output: Outputs.dealsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/deals', query }),
		{
			shape: (raw) => ({
				deals: envelopeMany(raw, 'deals'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.deals.length }),
		},
	);

export const dealsGet: FollowUpBossEndpoints['dealsGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'deals.get', input: Inputs.dealsGet, output: Outputs.dealsGet },
		input,
		({ id }) => ({ method: 'GET', path: `/deals/${segment(id)}` }),
		{
			// A single fetch arrives as `{ deals: [deal] }`.
			shape: (raw) => envelopeOne(raw, 'deals'),
			log: ({ id }) => ({ dealId: id }),
		},
	);

export const dealsCreate: FollowUpBossEndpoints['dealsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.create',
			input: Inputs.dealsCreate,
			output: Outputs.dealsCreate,
		},
		input,
		// Custom fields go out as top-level custom* keys, as for people.
		({ customFields, ...rest }) => ({
			method: 'POST',
			path: '/deals',
			body: { ...rest, ...(customFields ?? {}) },
		}),
		{
			// 200 arrives as the created deal, either bare or wrapped.
			shape: (raw) => envelopeOne(raw, 'deals'),
			log: (_, result) => ({ dealId: result.id ?? undefined }),
		},
	);

export const dealsUpdate: FollowUpBossEndpoints['dealsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.update',
			input: Inputs.dealsUpdate,
			output: Outputs.dealsUpdate,
		},
		input,
		({ id, customFields, ...rest }) => ({
			method: 'PUT',
			path: `/deals/${segment(id)}`,
			body: { ...rest, ...(customFields ?? {}) },
		}),
		{
			shape: (raw) => envelopeOne(raw, 'deals'),
			log: ({ id }) => ({ dealId: id }),
		},
	);

export const dealsDelete: FollowUpBossEndpoints['dealsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.delete',
			input: Inputs.dealsDelete,
			output: Outputs.dealsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/deals/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted deal in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ dealId: id }),
		},
	);

// ── pipelines ──────────────────────────────────────────────────────────────

export const pipelinesList: FollowUpBossEndpoints['pipelinesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pipelines.list',
			input: Inputs.pipelinesList,
			output: Outputs.pipelinesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/pipelines', query }),
		{
			shape: (raw) => ({
				pipelines: envelopeMany(raw, 'pipelines'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.pipelines.length }),
		},
	);

export const pipelinesGet: FollowUpBossEndpoints['pipelinesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pipelines.get',
			input: Inputs.pipelinesGet,
			output: Outputs.pipelinesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/pipelines/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'pipelines'),
			log: ({ id }) => ({ pipelineId: id }),
		},
	);

export const pipelinesCreate: FollowUpBossEndpoints['pipelinesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pipelines.create',
			input: Inputs.pipelinesCreate,
			output: Outputs.pipelinesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/pipelines', body }),
		{
			shape: (raw) => envelopeOne(raw, 'pipelines'),
			log: (_, result) => ({ pipelineId: result.id ?? undefined }),
		},
	);

export const pipelinesUpdate: FollowUpBossEndpoints['pipelinesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pipelines.update',
			input: Inputs.pipelinesUpdate,
			output: Outputs.pipelinesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/pipelines/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'pipelines'),
			log: ({ id }) => ({ pipelineId: id }),
		},
	);

export const pipelinesDelete: FollowUpBossEndpoints['pipelinesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'pipelines.delete',
			input: Inputs.pipelinesDelete,
			output: Outputs.pipelinesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/pipelines/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted pipeline in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ pipelineId: id }),
		},
	);

// ── stages ─────────────────────────────────────────────────────────────────

export const stagesList: FollowUpBossEndpoints['stagesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stages.list',
			input: Inputs.stagesList,
			output: Outputs.stagesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/stages', query }),
		{
			shape: (raw) => ({
				stages: envelopeMany(raw, 'stages'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.stages.length }),
		},
	);

export const stagesGet: FollowUpBossEndpoints['stagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stages.get',
			input: Inputs.stagesGet,
			output: Outputs.stagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/stages/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'stages'),
			log: ({ id }) => ({ stageId: id }),
		},
	);

export const stagesCreate: FollowUpBossEndpoints['stagesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stages.create',
			input: Inputs.stagesCreate,
			output: Outputs.stagesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/stages', body }),
		{
			shape: (raw) => envelopeOne(raw, 'stages'),
			log: (_, result) => ({ stageId: result.id ?? undefined }),
		},
	);

export const stagesUpdate: FollowUpBossEndpoints['stagesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stages.update',
			input: Inputs.stagesUpdate,
			output: Outputs.stagesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/stages/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'stages'),
			log: ({ id }) => ({ stageId: id }),
		},
	);

// Deleting a stage requires the query parameter that reassigns the action
// plans referencing it, so the operation is destructive on both resources.
export const stagesDelete: FollowUpBossEndpoints['stagesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stages.delete',
			input: Inputs.stagesDelete,
			output: Outputs.stagesDelete,
		},
		input,
		({ id, assignStageId }) => ({
			method: 'DELETE',
			path: `/stages/${segment(id)}`,
			query: { assignStageId },
		}),
		{
			// unknown: FUB may echo the deleted stage in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id, assignStageId }) => ({ stageId: id, assignStageId }),
		},
	);

// ── deal custom fields ─────────────────────────────────────────────────────

export const dealCustomFieldsList: FollowUpBossEndpoints['dealCustomFieldsList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealCustomFields.list',
				input: Inputs.dealCustomFieldsList,
				output: Outputs.dealCustomFieldsList,
			},
			input,
			(query) => ({ method: 'GET', path: '/dealCustomFields', query }),
			{
				shape: (raw) => ({
					dealCustomfields: dealCustomFieldsMany(raw),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.dealCustomfields.length }),
			},
		);

export const dealCustomFieldsGet: FollowUpBossEndpoints['dealCustomFieldsGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealCustomFields.get',
				input: Inputs.dealCustomFieldsGet,
				output: Outputs.dealCustomFieldsGet,
			},
			input,
			({ id }) => ({ method: 'GET', path: `/dealCustomFields/${segment(id)}` }),
			{
				shape: (raw) => envelopeOne(raw, 'dealCustomfields'),
				log: ({ id }) => ({ customFieldId: id }),
			},
		);

export const dealCustomFieldsCreate: FollowUpBossEndpoints['dealCustomFieldsCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealCustomFields.create',
				input: Inputs.dealCustomFieldsCreate,
				output: Outputs.dealCustomFieldsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/dealCustomFields', body }),
			{
				shape: (raw) => envelopeOne(raw, 'dealCustomfields'),
				log: (_, result) => ({ customFieldId: result.id ?? undefined }),
			},
		);

export const dealCustomFieldsUpdate: FollowUpBossEndpoints['dealCustomFieldsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealCustomFields.update',
				input: Inputs.dealCustomFieldsUpdate,
				output: Outputs.dealCustomFieldsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/dealCustomFields/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'dealCustomfields'),
				log: ({ id }) => ({ customFieldId: id }),
			},
		);

export const dealCustomFieldsDelete: FollowUpBossEndpoints['dealCustomFieldsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealCustomFields.delete',
				input: Inputs.dealCustomFieldsDelete,
				output: Outputs.dealCustomFieldsDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/dealCustomFields/${segment(id)}`,
			}),
			{
				// unknown: the 200 body is documented as empty here.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ customFieldId: id }),
			},
		);

// ── deal attachments ───────────────────────────────────────────────────────

export const dealAttachmentsCreate: FollowUpBossEndpoints['dealAttachmentsCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealAttachments.create',
				input: Inputs.dealAttachmentsCreate,
				output: Outputs.dealAttachmentsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/dealAttachments', body }),
			{
				// 201 arrives as the bare attachment.
				shape: (raw) => envelopeOne(raw, 'dealAttachments'),
				log: (_, result) => ({ attachmentId: result.id ?? undefined }),
			},
		);

export const dealAttachmentsGet: FollowUpBossEndpoints['dealAttachmentsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'dealAttachments.get',
			input: Inputs.dealAttachmentsGet,
			output: Outputs.dealAttachmentsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/dealAttachments/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'dealAttachments'),
			log: ({ id }) => ({ attachmentId: id }),
		},
	);

export const dealAttachmentsUpdate: FollowUpBossEndpoints['dealAttachmentsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealAttachments.update',
				input: Inputs.dealAttachmentsUpdate,
				output: Outputs.dealAttachmentsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/dealAttachments/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'dealAttachments'),
				log: ({ id }) => ({ attachmentId: id }),
			},
		);

export const dealAttachmentsDelete: FollowUpBossEndpoints['dealAttachmentsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'dealAttachments.delete',
				input: Inputs.dealAttachmentsDelete,
				output: Outputs.dealAttachmentsDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/dealAttachments/${segment(id)}`,
			}),
			{
				// unknown: FUB may echo the deleted attachment in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ attachmentId: id }),
			},
		);

// ── appointment outcomes ───────────────────────────────────────────────────

export const appointmentOutcomesList: FollowUpBossEndpoints['appointmentOutcomesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentOutcomes.list',
				input: Inputs.appointmentOutcomesList,
				output: Outputs.appointmentOutcomesList,
			},
			input,
			(query) => ({ method: 'GET', path: '/appointmentOutcomes', query }),
			{
				shape: (raw) => ({
					appointmentoutcomes: appointmentOutcomesMany(raw),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.appointmentoutcomes.length }),
			},
		);

export const appointmentOutcomesGet: FollowUpBossEndpoints['appointmentOutcomesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentOutcomes.get',
				input: Inputs.appointmentOutcomesGet,
				output: Outputs.appointmentOutcomesGet,
			},
			input,
			({ id }) => ({
				method: 'GET',
				path: `/appointmentOutcomes/${segment(id)}`,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentoutcomes'),
				log: ({ id }) => ({ outcomeId: id }),
			},
		);

export const appointmentOutcomesCreate: FollowUpBossEndpoints['appointmentOutcomesCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentOutcomes.create',
				input: Inputs.appointmentOutcomesCreate,
				output: Outputs.appointmentOutcomesCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/appointmentOutcomes', body }),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentoutcomes'),
				log: (_, result) => ({ outcomeId: result.id ?? undefined }),
			},
		);

export const appointmentOutcomesUpdate: FollowUpBossEndpoints['appointmentOutcomesUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentOutcomes.update',
				input: Inputs.appointmentOutcomesUpdate,
				output: Outputs.appointmentOutcomesUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/appointmentOutcomes/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'appointmentoutcomes'),
				log: ({ id }) => ({ outcomeId: id }),
			},
		);

// Deleting an outcome requires the query parameter that reassigns the
// existing appointments to another outcome, and the 200 body is an array.
export const appointmentOutcomesDelete: FollowUpBossEndpoints['appointmentOutcomesDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'appointmentOutcomes.delete',
				input: Inputs.appointmentOutcomesDelete,
				output: Outputs.appointmentOutcomesDelete,
			},
			input,
			({ id, assignOutcomeId }) => ({
				method: 'DELETE',
				path: `/appointmentOutcomes/${segment(id)}`,
				query: { assignOutcomeId },
			}),
			{
				// unknown: the 200 body is an empty array, not a record.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id, assignOutcomeId }) => ({ outcomeId: id, assignOutcomeId }),
			},
		);

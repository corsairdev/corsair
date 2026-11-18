import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	MarketingInputSchemas as Inputs,
	MarketingOutputSchemas as Outputs,
} from './marketing-types';

// ── email templates ────────────────────────────────────────────────────────

export const templatesList: FollowUpBossEndpoints['templatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/templates', query }),
		{
			shape: (raw) => ({
				templates: envelopeMany(raw, 'templates'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.templates.length }),
		},
	);

export const templatesGet: FollowUpBossEndpoints['templatesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		({ id, mergePersonId }) => ({
			method: 'GET',
			path: `/templates/${segment(id)}`,
			query: { mergePersonId },
		}),
		{
			shape: (raw) => envelopeOne(raw, 'templates'),
			log: ({ id }) => ({ templateId: id }),
		},
	);

export const templatesCreate: FollowUpBossEndpoints['templatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/templates', body }),
		{
			shape: (raw) => envelopeOne(raw, 'templates'),
			log: (_, result) => ({ templateId: result.id ?? undefined }),
		},
	);

export const templatesUpdate: FollowUpBossEndpoints['templatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.update',
			input: Inputs.templatesUpdate,
			output: Outputs.templatesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/templates/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'templates'),
			log: ({ id }) => ({ templateId: id }),
		},
	);

export const templatesDelete: FollowUpBossEndpoints['templatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesDelete,
			output: Outputs.templatesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/templates/${segment(id)}` }),
		{
			// unknown: the 200 body is an empty `{}` per the spec, but FUB may
			// echo the deleted template.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ templateId: id }),
		},
	);

export const templatesMerge: FollowUpBossEndpoints['templatesMerge'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.merge',
			input: Inputs.templatesMerge,
			output: Outputs.templatesMerge,
		},
		input,
		(body) => ({ method: 'POST', path: '/templates/merge', body }),
		{
			shape: (raw) => envelopeOne(raw, 'templates'),
			log: ({ templateId }) => ({ templateId }),
		},
	);

// ── text message templates ─────────────────────────────────────────────────

export const textMessageTemplatesList: FollowUpBossEndpoints['textMessageTemplatesList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.list',
				input: Inputs.textMessageTemplatesList,
				output: Outputs.textMessageTemplatesList,
			},
			input,
			(query) => ({ method: 'GET', path: '/textMessageTemplates', query }),
			{
				shape: (raw) => ({
					textmessagetemplates: envelopeMany(raw, 'textmessagetemplates'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.textmessagetemplates.length }),
			},
		);

// The published OAS paths this create as POST '//textMessageTemplates' with a
// doubled slash; the single-slash collection path its sibling GET uses is sent
// instead.
export const textMessageTemplatesCreate: FollowUpBossEndpoints['textMessageTemplatesCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.create',
				input: Inputs.textMessageTemplatesCreate,
				output: Outputs.textMessageTemplatesCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/textMessageTemplates', body }),
			{
				// Unlike the email template create, this one answers 200, not 201.
				shape: (raw) => envelopeOne(raw, 'textmessagetemplates'),
				log: (_, result) => ({ textMessageTemplateId: result.id ?? undefined }),
			},
		);

export const textMessageTemplatesGet: FollowUpBossEndpoints['textMessageTemplatesGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.get',
				input: Inputs.textMessageTemplatesGet,
				output: Outputs.textMessageTemplatesGet,
			},
			input,
			({ id }) => ({
				method: 'GET',
				path: `/textMessageTemplates/${segment(id)}`,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'textmessagetemplates'),
				log: ({ id }) => ({ textMessageTemplateId: id }),
			},
		);

export const textMessageTemplatesUpdate: FollowUpBossEndpoints['textMessageTemplatesUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.update',
				input: Inputs.textMessageTemplatesUpdate,
				output: Outputs.textMessageTemplatesUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/textMessageTemplates/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'textmessagetemplates'),
				log: ({ id }) => ({ textMessageTemplateId: id }),
			},
		);

export const textMessageTemplatesDelete: FollowUpBossEndpoints['textMessageTemplatesDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.delete',
				input: Inputs.textMessageTemplatesDelete,
				output: Outputs.textMessageTemplatesDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/textMessageTemplates/${segment(id)}`,
			}),
			{
				// unknown: the 200 body is an empty `{}` per the spec, but FUB may
				// echo the deleted template.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ textMessageTemplateId: id }),
			},
		);

export const textMessageTemplatesMerge: FollowUpBossEndpoints['textMessageTemplatesMerge'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'textMessageTemplates.merge',
				input: Inputs.textMessageTemplatesMerge,
				output: Outputs.textMessageTemplatesMerge,
			},
			input,
			(body) => ({ method: 'POST', path: '/textMessageTemplates/merge', body }),
			{
				shape: (raw) => envelopeOne(raw, 'textmessagetemplates'),
				log: ({ templateId }) => ({ templateId }),
			},
		);

// ── email marketing campaigns ──────────────────────────────────────────────

export const emCampaignsList: FollowUpBossEndpoints['emCampaignsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emCampaigns.list',
			input: Inputs.emCampaignsList,
			output: Outputs.emCampaignsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/emCampaigns', query }),
		{
			shape: (raw) => ({
				emCampaigns: envelopeMany(raw, 'emCampaigns'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.emCampaigns.length }),
		},
	);

export const emCampaignsCreate: FollowUpBossEndpoints['emCampaignsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emCampaigns.create',
			input: Inputs.emCampaignsCreate,
			output: Outputs.emCampaignsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/emCampaigns', body }),
		{
			// Unlike the email template create, this one answers 200, not 201.
			shape: (raw) => envelopeOne(raw, 'emCampaigns'),
			log: (_, result) => ({ emCampaignId: result.id ?? undefined }),
		},
	);

export const emCampaignsUpdate: FollowUpBossEndpoints['emCampaignsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emCampaigns.update',
			input: Inputs.emCampaignsUpdate,
			output: Outputs.emCampaignsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/emCampaigns/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'emCampaigns'),
			log: ({ id }) => ({ emCampaignId: id }),
		},
	);

// ── email marketing events ─────────────────────────────────────────────────

export const emEventsList: FollowUpBossEndpoints['emEventsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emEvents.list',
			input: Inputs.emEventsList,
			output: Outputs.emEventsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/emEvents', query }),
		{
			shape: (raw) => ({
				emEvents: envelopeMany(raw, 'emEvents'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.emEvents.length }),
		},
	);

export const emEventsCreate: FollowUpBossEndpoints['emEventsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emEvents.create',
			input: Inputs.emEventsCreate,
			output: Outputs.emEventsCreate,
		},
		input,
		({ emEvents }) => ({
			method: 'POST',
			path: '/emEvents',
			body: { emEvents },
		}),
		{
			// unknown: the notify answers 200 with the id lists; an empty body
			// passes as an empty result.
			shape: (raw) => (raw === undefined ? {} : raw),
			log: (_, result) => ({ count: result.emEventIds?.length ?? 0 }),
		},
	);

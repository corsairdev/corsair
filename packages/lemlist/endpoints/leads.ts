import { logEventFromContext } from 'corsair/core';
import type { LemlistQueryValue } from '../client';
import { makeLemlistRequest } from '../client';
import type { LemlistPluginContext } from '../index';
import type {
	LeadsAddVariablesInput,
	LeadsAddVariablesResponse,
	LeadsCreateInCampaignInput,
	LeadsCreateInCampaignResponse,
	LeadsDeleteFromCampaignInput,
	LeadsDeleteFromCampaignResponse,
	LeadsDeleteVariablesInput,
	LeadsDeleteVariablesResponse,
	LeadsGetByEmailInput,
	LeadsGetByEmailResponse,
	LeadsGetCrmFiltersInput,
	LeadsGetCrmFiltersResponse,
	LeadsGetInput,
	LeadsGetResponse,
	LeadsImportFromCrmInput,
	LeadsImportFromCrmResponse,
	LeadsListInCampaignInput,
	LeadsListInCampaignResponse,
	LeadsMarkInterestedInCampaignInput,
	LeadsMarkInterestedInCampaignResponse,
	LeadsMarkInterestedInput,
	LeadsMarkInterestedResponse,
	LeadsMarkNotInterestedInCampaignInput,
	LeadsMarkNotInterestedInCampaignResponse,
	LeadsMarkNotInterestedInput,
	LeadsMarkNotInterestedResponse,
	LeadsPauseInput,
	LeadsPauseResponse,
	LeadsPersonalizeStepInput,
	LeadsPersonalizeStepResponse,
	LeadsResetStepPersonalizationInput,
	LeadsResetStepPersonalizationResponse,
	LeadsResumeInput,
	LeadsResumeResponse,
	LeadsReviewInput,
	LeadsReviewResponse,
	LeadsSkipStepInput,
	LeadsSkipStepResponse,
	LeadsUnsubscribeFromCampaignInput,
	LeadsUnsubscribeFromCampaignResponse,
	LeadsUpdateInCampaignInput,
	LeadsUpdateInCampaignResponse,
	LeadsUpdateVariablesInput,
	LeadsUpdateVariablesResponse,
} from './types';
import {
	LemlistEndpointInputSchemas,
	LemlistEndpointOutputSchemas,
} from './types';

type LemlistCall = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	url: string;
	// `unknown` because request bodies vary per endpoint.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, LemlistQueryValue>;
};

export const Leads = {
	get: async (
		ctx: LemlistPluginContext,
		input: LeadsGetInput,
	): Promise<LeadsGetResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.leadsGet.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/leads',
			query: { ...input, version: 'v2' },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsGet.parse(response);
		const logFn: (
			_input: LeadsGetInput,
			_res: LeadsGetResponse,
		) => Record<string, string | number | boolean> = (_input, res) => ({
			count: Array.isArray(res) ? res.length : 1,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.get',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getByEmail: async (
		ctx: LemlistPluginContext,
		input: LeadsGetByEmailInput,
	): Promise<LeadsGetByEmailResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsGetByEmail.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/leads/${encodeURIComponent(input.email)}`,
			query: { version: input.version ?? 'v2' },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsGetByEmail.parse(response);
		const logFn: (
			_input: LeadsGetByEmailInput,
			_res: LeadsGetByEmailResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.leads.getByEmail',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	listInCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsListInCampaignInput,
	): Promise<LeadsListInCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsListInCampaign.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...query } = input;
			return {
				method: 'GET',
				url: `/campaigns/${encodeURIComponent(campaignId)}/leads/`,
				query,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsListInCampaign.parse(response);
		const logFn: (
			_input: LeadsListInCampaignInput,
			_res: LeadsListInCampaignResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			campaignId: input.campaignId,
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.listInCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	createInCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsCreateInCampaignInput,
	): Promise<LeadsCreateInCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsCreateInCampaign.parse(input);
		const req: LemlistCall = ((input) => {
			const {
				campaignId,
				deduplicate,
				linkedinEnrichment,
				findEmail,
				verifyEmail,
				findPhone,
				updateStrategy,
				...body
			} = input;
			return {
				method: 'POST',
				url: `/campaigns/${encodeURIComponent(campaignId)}/leads/`,
				query: {
					deduplicate,
					linkedinEnrichment,
					findEmail,
					verifyEmail,
					findPhone,
					updateStrategy,
				},
				body,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsCreateInCampaign.parse(response);
		const logFn: (
			_input: LeadsCreateInCampaignInput,
			_res: LeadsCreateInCampaignResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			campaignId: input.campaignId,
			leadId: res._id,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.createInCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	updateInCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsUpdateInCampaignInput,
	): Promise<LeadsUpdateInCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsUpdateInCampaign.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, leadId, updateStrategy, ...body } = input;
			return {
				method: 'PATCH',
				url: `/campaigns/${encodeURIComponent(campaignId)}/leads/${encodeURIComponent(leadId)}`,
				query: updateStrategy ? { updateStrategy } : undefined,
				body,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsUpdateInCampaign.parse(response);
		const logFn: (
			_input: LeadsUpdateInCampaignInput,
			_res: LeadsUpdateInCampaignResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.updateInCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	deleteFromCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsDeleteFromCampaignInput,
	): Promise<LeadsDeleteFromCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsDeleteFromCampaign.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.leadId)}`,
			query: input.action ? { action: input.action } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsDeleteFromCampaign.parse(response);
		const logFn: (
			_input: LeadsDeleteFromCampaignInput,
			_res: LeadsDeleteFromCampaignResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.deleteFromCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	unsubscribeFromCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsUnsubscribeFromCampaignInput,
	): Promise<LeadsUnsubscribeFromCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsUnsubscribeFromCampaign.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.email)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsUnsubscribeFromCampaign.parse(response);
		const logFn: (
			_input: LeadsUnsubscribeFromCampaignInput,
			_res: LeadsUnsubscribeFromCampaignResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.unsubscribeFromCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	resume: async (
		ctx: LemlistPluginContext,
		input: LeadsResumeInput,
	): Promise<LeadsResumeResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.leadsResume.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/start/${encodeURIComponent(input.leadId)}`,
			query: input.campaignId ? { campaignId: input.campaignId } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsResume.parse(response);
		const logFn: (
			_input: LeadsResumeInput,
			_res: LeadsResumeResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.resume',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	pause: async (
		ctx: LemlistPluginContext,
		input: LeadsPauseInput,
	): Promise<LeadsPauseResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.leadsPause.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/pause/${encodeURIComponent(input.leadId)}`,
			query: input.campaignId ? { campaignId: input.campaignId } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsPause.parse(response);
		const logFn: (
			_input: LeadsPauseInput,
			_res: LeadsPauseResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.pause',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	review: async (
		ctx: LemlistPluginContext,
		input: LeadsReviewInput,
	): Promise<LeadsReviewResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.leadsReview.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/review/${encodeURIComponent(input.leadId)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsReview.parse(response);
		const logFn: (
			_input: LeadsReviewInput,
			_res: LeadsReviewResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.review',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	markInterested: async (
		ctx: LemlistPluginContext,
		input: LeadsMarkInterestedInput,
	): Promise<LeadsMarkInterestedResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsMarkInterested.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/interested/${encodeURIComponent(input.leadIdOrEmail)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsMarkInterested.parse(response);
		const logFn: (
			_input: LeadsMarkInterestedInput,
			_res: LeadsMarkInterestedResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.leads.markInterested',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	markNotInterested: async (
		ctx: LemlistPluginContext,
		input: LeadsMarkNotInterestedInput,
	): Promise<LeadsMarkNotInterestedResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsMarkNotInterested.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/notinterested/${encodeURIComponent(input.leadIdOrEmail)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsMarkNotInterested.parse(response);
		const logFn: (
			_input: LeadsMarkNotInterestedInput,
			_res: LeadsMarkNotInterestedResponse,
		) => Record<string, string | number | boolean> = (input) => ({ ok: true });
		await logEventFromContext(
			ctx,
			'lemlist.leads.markNotInterested',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	markInterestedInCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsMarkInterestedInCampaignInput,
	): Promise<LeadsMarkInterestedInCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsMarkInterestedInCampaign.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.leadIdOrEmail)}/interested`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsMarkInterestedInCampaign.parse(
				response,
			);
		const logFn: (
			_input: LeadsMarkInterestedInCampaignInput,
			_res: LeadsMarkInterestedInCampaignResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.markInterestedInCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	markNotInterestedInCampaign: async (
		ctx: LemlistPluginContext,
		input: LeadsMarkNotInterestedInCampaignInput,
	): Promise<LeadsMarkNotInterestedInCampaignResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsMarkNotInterestedInCampaign.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.leadIdOrEmail)}/notinterested`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsMarkNotInterestedInCampaign.parse(
				response,
			);
		const logFn: (
			_input: LeadsMarkNotInterestedInCampaignInput,
			_res: LeadsMarkNotInterestedInCampaignResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.markNotInterestedInCampaign',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	skipStep: async (
		ctx: LemlistPluginContext,
		input: LeadsSkipStepInput,
	): Promise<LeadsSkipStepResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.leadsSkipStep.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.leadIdOrEmail)}/steps/${encodeURIComponent(input.stepId)}/skip`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.leadsSkipStep.parse(response);
		const logFn: (
			_input: LeadsSkipStepInput,
			_res: LeadsSkipStepResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			stepId: input.stepId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.skipStep',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	personalizeStep: async (
		ctx: LemlistPluginContext,
		input: LeadsPersonalizeStepInput,
	): Promise<LeadsPersonalizeStepResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsPersonalizeStep.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, leadIdOrEmail, stepId, ...body } = input;
			return {
				method: 'PUT',
				url: `/campaigns/${encodeURIComponent(campaignId)}/leads/${encodeURIComponent(leadIdOrEmail)}/steps/${encodeURIComponent(stepId)}/personalization`,
				body,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsPersonalizeStep.parse(response);
		const logFn: (
			_input: LeadsPersonalizeStepInput,
			_res: LeadsPersonalizeStepResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			stepId: input.stepId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.personalizeStep',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	resetStepPersonalization: async (
		ctx: LemlistPluginContext,
		input: LeadsResetStepPersonalizationInput,
	): Promise<LeadsResetStepPersonalizationResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsResetStepPersonalization.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/leads/${encodeURIComponent(input.leadIdOrEmail)}/steps/${encodeURIComponent(input.stepId)}/personalization`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsResetStepPersonalization.parse(
				response,
			);
		const logFn: (
			_input: LeadsResetStepPersonalizationInput,
			_res: LeadsResetStepPersonalizationResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			stepId: input.stepId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.resetStepPersonalization',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	addVariables: async (
		ctx: LemlistPluginContext,
		input: LeadsAddVariablesInput,
	): Promise<LeadsAddVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsAddVariables.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/leads/${encodeURIComponent(input.leadId)}/variables`,
			query: input.variables,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsAddVariables.parse(response);
		const logFn: (
			_input: LeadsAddVariablesInput,
			_res: LeadsAddVariablesResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.addVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	updateVariables: async (
		ctx: LemlistPluginContext,
		input: LeadsUpdateVariablesInput,
	): Promise<LeadsUpdateVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsUpdateVariables.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'PATCH',
			url: `/leads/${encodeURIComponent(input.leadId)}/variables`,
			query: input.variables,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsUpdateVariables.parse(response);
		const logFn: (
			_input: LeadsUpdateVariablesInput,
			_res: LeadsUpdateVariablesResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.updateVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	deleteVariables: async (
		ctx: LemlistPluginContext,
		input: LeadsDeleteVariablesInput,
	): Promise<LeadsDeleteVariablesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsDeleteVariables.parse(input);
		const req: LemlistCall = ((input) => {
			const query: Record<string, string> = {};
			input.variableNames.forEach((name) => {
				query[name] = '';
			});
			return {
				method: 'DELETE',
				url: `/leads/${encodeURIComponent(input.leadId)}/variables`,
				query,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsDeleteVariables.parse(response);
		const logFn: (
			_input: LeadsDeleteVariablesInput,
			_res: LeadsDeleteVariablesResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			leadId: input.leadId,
			count: input.variableNames.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.deleteVariables',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	importFromCrm: async (
		ctx: LemlistPluginContext,
		input: LeadsImportFromCrmInput,
	): Promise<LeadsImportFromCrmResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsImportFromCrm.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...body } = input;
			return {
				method: 'POST',
				url: `/campaigns/${encodeURIComponent(campaignId)}/leads/import`,
				body,
			};
		})(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsImportFromCrm.parse(response);
		const logFn: (
			_input: LeadsImportFromCrmInput,
			_res: LeadsImportFromCrmResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.importFromCrm',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getCrmFilters: async (
		ctx: LemlistPluginContext,
		input: LeadsGetCrmFiltersInput,
	): Promise<LeadsGetCrmFiltersResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.leadsGetCrmFilters.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/crm/filters',
			query: input.type ? { type: input.type } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.leadsGetCrmFilters.parse(response);
		const logFn: (
			_input: LeadsGetCrmFiltersInput,
			_res: LeadsGetCrmFiltersResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.leads.getCrmFilters',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
};

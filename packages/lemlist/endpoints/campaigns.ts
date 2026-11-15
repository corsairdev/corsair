import { logEventFromContext } from 'corsair/core';
import type { LemlistQueryValue } from '../client';
import { makeLemlistRequest } from '../client';
import type { LemlistPluginContext } from '../index';
import type {
	CampaignsAddAbmLeadsInput,
	CampaignsAddAbmLeadsResponse,
	CampaignsArchiveInput,
	CampaignsArchiveResponse,
	CampaignsCreateInput,
	CampaignsCreateResponse,
	CampaignsDuplicateInput,
	CampaignsDuplicateResponse,
	CampaignsExportLeadsInput,
	CampaignsExportLeadsResponse,
	CampaignsGetBatchStatsInput,
	CampaignsGetBatchStatsResponse,
	CampaignsGetExportStatusInput,
	CampaignsGetExportStatusResponse,
	CampaignsGetInput,
	CampaignsGetReportsInput,
	CampaignsGetReportsResponse,
	CampaignsGetResponse,
	CampaignsGetSettingsInput,
	CampaignsGetSettingsResponse,
	CampaignsGetStatsInput,
	CampaignsGetStatsResponse,
	CampaignsGetStatutesInput,
	CampaignsGetStatutesResponse,
	CampaignsListInput,
	CampaignsListResponse,
	CampaignsPauseInput,
	CampaignsPauseResponse,
	CampaignsSetExportEmailInput,
	CampaignsSetExportEmailResponse,
	CampaignsSkipStepForEveryoneInput,
	CampaignsSkipStepForEveryoneResponse,
	CampaignsSkipStepForLeadsInput,
	CampaignsSkipStepForLeadsResponse,
	CampaignsStartExportInput,
	CampaignsStartExportResponse,
	CampaignsStartInput,
	CampaignsStartResponse,
	CampaignsUnarchiveInput,
	CampaignsUnarchiveResponse,
	CampaignsUpdateInput,
	CampaignsUpdateResponse,
	CampaignsUpdateSettingsInput,
	CampaignsUpdateSettingsResponse,
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

export const Campaigns = {
	list: async (
		ctx: LemlistPluginContext,
		input: CampaignsListInput,
	): Promise<CampaignsListResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.campaignsList.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/campaigns',
			query: { ...input, version: 'v2' },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.campaignsList.parse(response);
		const logFn: (
			_input: CampaignsListInput,
			_res: CampaignsListResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.list',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	create: async (
		ctx: LemlistPluginContext,
		input: CampaignsCreateInput,
	): Promise<CampaignsCreateResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsCreate.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: '/campaigns',
			body: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.campaignsCreate.parse(response);
		const logFn: (
			_input: CampaignsCreateInput,
			_res: CampaignsCreateResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			campaignId: res._id,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.create',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	get: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetInput,
	): Promise<CampaignsGetResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.campaignsGet.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.campaignsGet.parse(response);
		const logFn: (
			_input: CampaignsGetInput,
			_res: CampaignsGetResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.get',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	update: async (
		ctx: LemlistPluginContext,
		input: CampaignsUpdateInput,
	): Promise<CampaignsUpdateResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsUpdate.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...body } = input;
			return {
				method: 'PATCH',
				url: `/campaigns/${encodeURIComponent(campaignId)}`,
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
		const parsed = LemlistEndpointOutputSchemas.campaignsUpdate.parse(response);
		const logFn: (
			_input: CampaignsUpdateInput,
			_res: CampaignsUpdateResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.update',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getSettings: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetSettingsInput,
	): Promise<CampaignsGetSettingsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetSettings.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/settings`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsGetSettings.parse(response);
		const logFn: (
			_input: CampaignsGetSettingsInput,
			_res: CampaignsGetSettingsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getSettings',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	updateSettings: async (
		ctx: LemlistPluginContext,
		input: CampaignsUpdateSettingsInput,
	): Promise<CampaignsUpdateSettingsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsUpdateSettings.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...body } = input;
			return {
				method: 'PATCH',
				url: `/campaigns/${encodeURIComponent(campaignId)}/settings`,
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
			LemlistEndpointOutputSchemas.campaignsUpdateSettings.parse(response);
		const logFn: (
			_input: CampaignsUpdateSettingsInput,
			_res: CampaignsUpdateSettingsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.updateSettings',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	pause: async (
		ctx: LemlistPluginContext,
		input: CampaignsPauseInput,
	): Promise<CampaignsPauseResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.campaignsPause.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/pause`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.campaignsPause.parse(response);
		const logFn: (
			_input: CampaignsPauseInput,
			_res: CampaignsPauseResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.pause',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	start: async (
		ctx: LemlistPluginContext,
		input: CampaignsStartInput,
	): Promise<CampaignsStartResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.campaignsStart.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/start`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.campaignsStart.parse(response);
		const logFn: (
			_input: CampaignsStartInput,
			_res: CampaignsStartResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.start',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	archive: async (
		ctx: LemlistPluginContext,
		input: CampaignsArchiveInput,
	): Promise<CampaignsArchiveResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsArchive.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/archive`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsArchive.parse(response);
		const logFn: (
			_input: CampaignsArchiveInput,
			_res: CampaignsArchiveResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.archive',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	unarchive: async (
		ctx: LemlistPluginContext,
		input: CampaignsUnarchiveInput,
	): Promise<CampaignsUnarchiveResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsUnarchive.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/unarchive`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsUnarchive.parse(response);
		const logFn: (
			_input: CampaignsUnarchiveInput,
			_res: CampaignsUnarchiveResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.unarchive',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	duplicate: async (
		ctx: LemlistPluginContext,
		input: CampaignsDuplicateInput,
	): Promise<CampaignsDuplicateResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsDuplicate.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...body } = input;
			return {
				method: 'POST',
				url: `/campaigns/${encodeURIComponent(campaignId)}/duplicate`,
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
			LemlistEndpointOutputSchemas.campaignsDuplicate.parse(response);
		const logFn: (
			_input: CampaignsDuplicateInput,
			_res: CampaignsDuplicateResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			campaignId: res._id,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.duplicate',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getStatutes: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetStatutesInput,
	): Promise<CampaignsGetStatutesResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetStatutes.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/statutes`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsGetStatutes.parse(response);
		const logFn: (
			_input: CampaignsGetStatutesInput,
			_res: CampaignsGetStatutesResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getStatutes',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getStats: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetStatsInput,
	): Promise<CampaignsGetStatsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetStats.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...query } = input;
			return {
				method: 'GET',
				url: `/v2/campaigns/${encodeURIComponent(campaignId)}/stats`,
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
			LemlistEndpointOutputSchemas.campaignsGetStats.parse(response);
		const logFn: (
			_input: CampaignsGetStatsInput,
			_res: CampaignsGetStatsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getStats',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getBatchStats: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetBatchStatsInput,
	): Promise<CampaignsGetBatchStatsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetBatchStats.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: '/v2/campaigns/stats/batch',
			body: input,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsGetBatchStats.parse(response);
		const logFn: (
			_input: CampaignsGetBatchStatsInput,
			_res: CampaignsGetBatchStatsResponse,
		) => Record<string, string | number | boolean> = (_input, res) => ({
			count: res.results.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getBatchStats',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getReports: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetReportsInput,
	): Promise<CampaignsGetReportsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetReports.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/campaigns/reports',
			query: { campaignIds: input.campaignIds },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsGetReports.parse(response);
		const logFn: (
			_input: CampaignsGetReportsInput,
			_res: CampaignsGetReportsResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getReports',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	startExport: async (
		ctx: LemlistPluginContext,
		input: CampaignsStartExportInput,
	): Promise<CampaignsStartExportResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsStartExport.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/export/start`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsStartExport.parse(response);
		const logFn: (
			_input: CampaignsStartExportInput,
			_res: CampaignsStartExportResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.startExport',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getExportStatus: async (
		ctx: LemlistPluginContext,
		input: CampaignsGetExportStatusInput,
	): Promise<CampaignsGetExportStatusResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsGetExportStatus.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/export/${encodeURIComponent(input.exportId)}/status`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsGetExportStatus.parse(response);
		const logFn: (
			_input: CampaignsGetExportStatusInput,
			_res: CampaignsGetExportStatusResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			exportId: input.exportId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.getExportStatus',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	setExportEmail: async (
		ctx: LemlistPluginContext,
		input: CampaignsSetExportEmailInput,
	): Promise<CampaignsSetExportEmailResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsSetExportEmail.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'PUT',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/export/${encodeURIComponent(input.exportId)}/email/${encodeURIComponent(input.email)}`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsSetExportEmail.parse(response);
		const logFn: (
			_input: CampaignsSetExportEmailInput,
			_res: CampaignsSetExportEmailResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			exportId: input.exportId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.setExportEmail',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	exportLeads: async (
		ctx: LemlistPluginContext,
		input: CampaignsExportLeadsInput,
	): Promise<CampaignsExportLeadsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsExportLeads.parse(input);
		const req: LemlistCall = ((input) => {
			const { campaignId, ...query } = input;
			return {
				method: 'GET',
				url: `/v2/campaigns/${encodeURIComponent(campaignId)}/export/leads`,
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
			LemlistEndpointOutputSchemas.campaignsExportLeads.parse(response);
		const logFn: (
			_input: CampaignsExportLeadsInput,
			_res: CampaignsExportLeadsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.exportLeads',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	skipStepForEveryone: async (
		ctx: LemlistPluginContext,
		input: CampaignsSkipStepForEveryoneInput,
	): Promise<CampaignsSkipStepForEveryoneResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsSkipStepForEveryone.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/steps/${encodeURIComponent(input.stepId)}/skip`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsSkipStepForEveryone.parse(response);
		const logFn: (
			_input: CampaignsSkipStepForEveryoneInput,
			_res: CampaignsSkipStepForEveryoneResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			stepId: input.stepId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.skipStepForEveryone',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	skipStepForLeads: async (
		ctx: LemlistPluginContext,
		input: CampaignsSkipStepForLeadsInput,
	): Promise<CampaignsSkipStepForLeadsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsSkipStepForLeads.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/steps/${encodeURIComponent(input.stepId)}/skip-for-leads`,
			body: { leads: input.leads },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsSkipStepForLeads.parse(response);
		const logFn: (
			_input: CampaignsSkipStepForLeadsInput,
			_res: CampaignsSkipStepForLeadsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			stepId: input.stepId,
			count: input.leads.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.skipStepForLeads',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	addAbmLeads: async (
		ctx: LemlistPluginContext,
		input: CampaignsAddAbmLeadsInput,
	): Promise<CampaignsAddAbmLeadsResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.campaignsAddAbmLeads.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'POST',
			url: `/campaigns/${encodeURIComponent(input.campaignId)}/abm-leads`,
			body: { leadIds: input.leadIds },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.campaignsAddAbmLeads.parse(response);
		const logFn: (
			_input: CampaignsAddAbmLeadsInput,
			_res: CampaignsAddAbmLeadsResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			campaignId: input.campaignId,
			count: input.leadIds.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.campaigns.addAbmLeads',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
};

import type { z } from 'zod';
import { makeDopplerMarketingAutomationRequest } from '../client';
import type { DopplerMarketingAutomationContext } from '../index';
import {
	otherInputSchemas as input,
	otherOutputSchemas as output,
} from './other-types';

const account = (name: string) => `/accounts/${encodeURIComponent(name)}`;
const get = <T>(
	ctx: DopplerMarketingAutomationContext,
	path: string,
	query?: Record<string, string | number | undefined>,
) =>
	makeDopplerMarketingAutomationRequest<T>(path, ctx.key, {
		method: 'GET',
		query,
	});

export const automations = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationList>,
	) => {
		const { accountName, ...query } = input.automationList.parse(raw);
		return output.automationList.parse(
			await get(ctx, `${account(accountName)}/automations/lists`, query),
		);
	},
	summary: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationSummary>,
	) => {
		const { accountName, scheduledTaskId, ...query } =
			input.automationSummary.parse(raw);
		return output.automationSummary.parse(
			await get(
				ctx,
				`${account(accountName)}/automations/summary/${scheduledTaskId}`,
				query,
			),
		);
	},
	opensAndClicks: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationOpensAndClicks>,
	) => {
		const { accountName, scheduledTaskId, ...query } =
			input.automationOpensAndClicks.parse(raw);
		return output.automationOpensAndClicks.parse(
			await get(
				ctx,
				`${account(accountName)}/automations/opensandclicks/${scheduledTaskId}`,
				query,
			),
		);
	},
	deliverabilityRate: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationDeliverabilityRate>,
	) => {
		const { accountName, scheduledTaskId, ...query } =
			input.automationDeliverabilityRate.parse(raw);
		return output.automationDeliverabilityRate.parse(
			await get(
				ctx,
				`${account(accountName)}/automations/deliverabilityrate/${scheduledTaskId}`,
				query,
			),
		);
	},
	linksTracking: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationLinksTracking>,
	) => {
		const { accountName, scheduledTaskId, ...query } =
			input.automationLinksTracking.parse(raw);
		return output.automationLinksTracking.parse(
			await get(
				ctx,
				`${account(accountName)}/automations/linkstracking/${scheduledTaskId}`,
				query,
			),
		);
	},
	unsubscribeActivity: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.automationUnsubscribeActivity>,
	) => {
		const { accountName, scheduledTaskId, ...query } =
			input.automationUnsubscribeActivity.parse(raw);
		return output.automationUnsubscribeActivity.parse(
			await get(
				ctx,
				`${account(accountName)}/automations/unsubscribeactivity/${scheduledTaskId}`,
				query,
			),
		);
	},
} as const;
export const templates = {
	create: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.templateCreate>,
	) => {
		const { accountName, template } = input.templateCreate.parse(raw);
		return output.templateCreate.parse(
			await makeDopplerMarketingAutomationRequest(
				`${account(accountName)}/DobleOptinTemplate`,
				ctx.key,
				{ method: 'POST', body: template },
			),
		);
	},
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.templateGet>,
	) => {
		const { accountName, templateId } = input.templateGet.parse(raw);
		return output.templateGet.parse(
			await get(
				ctx,
				`${account(accountName)}/DobleOptinTemplate/${templateId}`,
			),
		);
	},
	updateContent: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.templateUpdateContent>,
	) => {
		const { accountName, templateId, Body } =
			input.templateUpdateContent.parse(raw);
		return output.templateUpdateContent.parse(
			await makeDopplerMarketingAutomationRequest(
				`${account(accountName)}/DobleOptinTemplate/${templateId}/content`,
				ctx.key,
				{ method: 'PUT', body: Body, mediaType: 'text/html' },
			),
		);
	},
} as const;
export const fields = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.fieldsList>,
	) => {
		const { accountName } = input.fieldsList.parse(raw);
		return output.fieldsList.parse(
			await get(ctx, `${account(accountName)}/fields`),
		);
	},
} as const;
export const home = {
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.home>,
	) => {
		input.home.parse(raw);
		return output.home.parse(await get(ctx, '/'));
	},
	account: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.accountHome>,
	) => {
		const { accountName } = input.accountHome.parse(raw);
		return output.accountHome.parse(await get(ctx, account(accountName)));
	},
} as const;
export const tasks = {
	list: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.tasksList>,
	) => {
		const { accountName, ...query } = input.tasksList.parse(raw);
		return output.tasksList.parse(
			await get(ctx, `${account(accountName)}/tasks`, query),
		);
	},
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.tasksGet>,
	) => {
		const { accountName, taskId } = input.tasksGet.parse(raw);
		return output.tasksGet.parse(
			await get(
				ctx,
				`${account(accountName)}/tasks/${encodeURIComponent(taskId)}`,
			),
		);
	},
	importErrors: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.tasksImportErrors>,
	) => {
		const { accountName, taskId, ...query } =
			input.tasksImportErrors.parse(raw);
		return output.tasksImportErrors.parse(
			await get(
				ctx,
				`${account(accountName)}/tasks/${encodeURIComponent(taskId)}/import-errors`,
				query,
			),
		);
	},
} as const;
export const integrations = {
	get: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.integrationGet>,
	) => {
		const { accountName, integrationName } = input.integrationGet.parse(raw);
		return output.integrationGet.parse(
			await get(
				ctx,
				`${account(accountName)}/integrations/${encodeURIComponent(integrationName)}`,
			),
		);
	},
	update: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.integrationUpdate>,
	) => {
		const { accountName, integrationName, thirdPartyAppAccess } =
			input.integrationUpdate.parse(raw);
		return output.integrationUpdate.parse(
			await makeDopplerMarketingAutomationRequest(
				`${account(accountName)}/integrations/${encodeURIComponent(integrationName)}`,
				ctx.key,
				{ method: 'PUT', body: thirdPartyAppAccess },
			),
		);
	},
	delete: async (
		ctx: DopplerMarketingAutomationContext,
		raw: z.input<typeof input.integrationDelete>,
	) => {
		const { accountName, integrationName } = input.integrationDelete.parse(raw);
		return output.integrationDelete.parse(
			await makeDopplerMarketingAutomationRequest(
				`${account(accountName)}/integrations/${encodeURIComponent(integrationName)}`,
				ctx.key,
				{ method: 'DELETE' },
			),
		);
	},
} as const;

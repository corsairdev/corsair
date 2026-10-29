/**
 * Benchmark Email emails endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Email folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const addEmailToCommunity: BenchmarkEmailEndpoints['emailsAddEmailToCommunity'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsAddEmailToCommunity']
		>(`Emails/Community/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'PATCH',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.addEmailToCommunity',
			{ ...input },
			'completed',
		);
		return response;
	};

export const copyExistingEmail: BenchmarkEmailEndpoints['emailsCopyExistingEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsCopyExistingEmail']
		>(`Emails/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.copyExistingEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteABTestEmail: BenchmarkEmailEndpoints['emailsDeleteABTestEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsDeleteABTestEmail']
		>(`ABSplit/${encodeURIComponent(input.id)}`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.deleteABTestEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteABSplitCampaign: BenchmarkEmailEndpoints['emailsDeleteABSplitCampaign'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsDeleteABSplitCampaign']
		>(`Emails/${encodeURIComponent(input.id)}/ABSplit`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.deleteABSplitCampaign',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteEmailCampaign: BenchmarkEmailEndpoints['emailsDeleteEmailCampaign'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsDeleteEmailCampaign']
		>(`Emails/${encodeURIComponent(input.id)}`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.deleteEmailCampaign',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getABSplitDetails: BenchmarkEmailEndpoints['emailsGetABSplitDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetABSplitDetails']
		>(`Emails/${encodeURIComponent(input.id)}/ABSplit`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getABSplitDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getABSplitResults: BenchmarkEmailEndpoints['emailsGetABSplitResults'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetABSplitResults']
		>(`ABSplit/${encodeURIComponent(input.id)}/Results`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getABSplitResults',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getABTests: BenchmarkEmailEndpoints['emailsGetABTests'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['emailsGetABTests']
	>(`ABSplit/`, ctx.key, {
		method: 'GET',
		query: compactQuery({ page: input.page, pageSize: input.pageSize }),
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.emails.getABTests',
		{ ...input },
		'completed',
	);
	return response;
};

export const getCommunityCategory: BenchmarkEmailEndpoints['emailsGetCommunityCategory'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetCommunityCategory']
		>(`Emails/CommunityCategory`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getCommunityCategory',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCommunityEmailByID: BenchmarkEmailEndpoints['emailsGetCommunityEmailByID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetCommunityEmailByID']
		>(`Emails/CommunityGetEmail/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getCommunityEmailByID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailPreview: BenchmarkEmailEndpoints['emailsGetEmailPreview'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetEmailPreview']
		>(`Emails/${encodeURIComponent(input.id)}/Preview`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getEmailPreview',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailRecipientCount: BenchmarkEmailEndpoints['emailsGetEmailRecipientCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetEmailRecipientCount']
		>(`Emails/${encodeURIComponent(input.id)}/RecipientCount`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getEmailRecipientCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailSpamCheck: BenchmarkEmailEndpoints['emailsGetEmailSpamCheck'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetEmailSpamCheck']
		>(`Emails/${encodeURIComponent(input.id)}/Spam`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getEmailSpamCheck',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailTemplates: BenchmarkEmailEndpoints['emailsGetEmailTemplates'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetEmailTemplates']
		>(`Emails/Template`, ctx.key, {
			method: 'GET',
			query: compactQuery({
				page: input.page,
				pageSize: input.pageSize,
				criteria: input.criteria,
			}),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getEmailTemplates',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmails: BenchmarkEmailEndpoints['emailsGetEmails'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['emailsGetEmails']
	>(`Emails/`, ctx.key, {
		method: 'GET',
		query: compactQuery({
			page: input.page,
			pageSize: input.pageSize,
			criteria: input.criteria,
		}),
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.emails.getEmails',
		{ ...input },
		'completed',
	);
	return response;
};

export const getEmailDetails: BenchmarkEmailEndpoints['emailsGetEmailDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetEmailDetails']
		>(`Emails/${encodeURIComponent(input.id)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getEmailDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTemplateCategoryList: BenchmarkEmailEndpoints['emailsGetTemplateCategoryList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetTemplateCategoryList']
		>(`Emails/TemplateCategory`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getTemplateCategoryList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTemplateCategoryByID: BenchmarkEmailEndpoints['emailsGetTemplateCategoryByID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetTemplateCategoryByID']
		>(
			`Emails/TemplateCategory/${encodeURIComponent(input.categoryID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getTemplateCategoryByID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTemplateByID: BenchmarkEmailEndpoints['emailsGetTemplateByID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetTemplateByID']
		>(`Emails/Template/${encodeURIComponent(input.templateID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getTemplateByID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const initiateEmailScreenCapture: BenchmarkEmailEndpoints['emailsInitiateEmailScreenCapture'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsInitiateEmailScreenCapture']
		>(`Emails/${encodeURIComponent(input.id)}/ScreenCapture`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.initiateEmailScreenCapture',
			{ ...input },
			'completed',
		);
		return response;
	};

export const permanentlyDeleteEmailFromTrash: BenchmarkEmailEndpoints['emailsPermanentlyDeleteEmailFromTrash'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsPermanentlyDeleteEmailFromTrash']
		>(`Emails/${encodeURIComponent(input.id)}/Trash`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.permanentlyDeleteEmailFromTrash',
			{ ...input },
			'completed',
		);
		return response;
	};

export const restoreEmailFromTrash: BenchmarkEmailEndpoints['emailsRestoreEmailFromTrash'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsRestoreEmailFromTrash']
		>(`Emails/${encodeURIComponent(input.id)}/Trash`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.restoreEmailFromTrash',
			{ ...input },
			'completed',
		);
		return response;
	};

export const scheduleEmailCampaign: BenchmarkEmailEndpoints['emailsScheduleEmailCampaign'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsScheduleEmailCampaign']
		>(`Emails/${encodeURIComponent(input.id)}/Schedule`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.scheduleEmailCampaign',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateEmailCampaign: BenchmarkEmailEndpoints['emailsUpdateEmailCampaign'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsUpdateEmailCampaign']
		>(`Emails/${encodeURIComponent(input.id)}`, ctx.key, {
			method: 'PATCH',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.updateEmailCampaign',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getBadgesList: BenchmarkEmailEndpoints['emailsGetBadgesList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetBadgesList']
		>(`Emails/Badges`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getBadgesList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getLayoutList: BenchmarkEmailEndpoints['emailsGetLayoutList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetLayoutList']
		>(`Emails/Layout`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getLayoutList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getScheme: BenchmarkEmailEndpoints['emailsGetScheme'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['emailsGetScheme']
	>(`Emails/Scheme`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'benchmarkemail.emails.getScheme',
		{ ...input },
		'completed',
	);
	return response;
};

export const addOrUpdateScheme: BenchmarkEmailEndpoints['emailsAddOrUpdateScheme'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsAddOrUpdateScheme']
		>(`Emails/Scheme`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.addOrUpdateScheme',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRSSHistoryByEmailID: BenchmarkEmailEndpoints['emailsGetRSSHistoryByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsGetRSSHistoryByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/RSSHistory`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.getRSSHistoryByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const shareTemplateToSubAccounts: BenchmarkEmailEndpoints['emailsShareTemplateToSubAccounts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['emailsShareTemplateToSubAccounts']
		>(`Emails/${encodeURIComponent(input.id)}/ShareTemplate`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.emails.shareTemplateToSubAccounts',
			{ ...input },
			'completed',
		);
		return response;
	};

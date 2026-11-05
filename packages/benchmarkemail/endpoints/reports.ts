/**
 * Benchmark Email reports endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Email / Reports, AB Test / Reports, Engagement)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery, eventLogPayload } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const getABTestReport: BenchmarkEmailEndpoints['reportsGetABTestReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetABTestReport']
		>(`ABSplit/Report`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getABTestReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAbuseCampaignReportByEmailID: BenchmarkEmailEndpoints['reportsGetAbuseCampaignReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetAbuseCampaignReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/AbuseCampaign`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getAbuseCampaignReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAbuseReport: BenchmarkEmailEndpoints['reportsGetAbuseReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetAbuseReport']
		>(`Emails/Report/Abuse`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getAbuseReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getBouncesReportByEmailID: BenchmarkEmailEndpoints['reportsGetBouncesReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetBouncesReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Bounces`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getBouncesReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCampaignEngagementList: BenchmarkEmailEndpoints['reportsGetCampaignEngagementList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetCampaignEngagementList']
		>(`Engagement/CampaignList`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getCampaignEngagementList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getCampaignHistoryByEmailID: BenchmarkEmailEndpoints['reportsGetCampaignHistoryByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetCampaignHistoryByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/CampaignHistory`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getCampaignHistoryByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClickContactCount: BenchmarkEmailEndpoints['reportsGetClickContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClickContactCount']
		>(`Engagement/ClickContactCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClickContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClickHeatMapByEmailID: BenchmarkEmailEndpoints['reportsGetClickHeatMapByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClickHeatMapByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Click/HeatMap`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClickHeatMapByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClickPerformanceByEmailID: BenchmarkEmailEndpoints['reportsGetClickPerformanceByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClickPerformanceByEmailID']
		>(
			`Emails/${encodeURIComponent(input.id)}/Report/ClickPerformance`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClickPerformanceByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClickPerformanceDetailsByEmail: BenchmarkEmailEndpoints['reportsGetClickPerformanceDetailsByEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClickPerformanceDetailsByEmail']
		>(
			`Emails/${encodeURIComponent(input.id)}/Report/ClickPerformance/Details`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClickPerformanceDetailsByEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClickURLContactCount: BenchmarkEmailEndpoints['reportsGetClickURLContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClickURLContactCount']
		>(`Engagement/ClickURLContactCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClickURLContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getClicksReportByEmailID: BenchmarkEmailEndpoints['reportsGetClicksReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetClicksReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Clicks`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getClicksReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactReportHistory: BenchmarkEmailEndpoints['reportsGetContactReportHistory'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetContactReportHistory']
		>(
			`Contact/${encodeURIComponent(input.email)}/ContactReportHistory`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getContactReportHistory',
			eventLogPayload(input, ['email']),
			'completed',
		);
		return response;
	};

export const getDownloadReport: BenchmarkEmailEndpoints['reportsGetDownloadReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetDownloadReport']
		>(`Contact/${encodeURIComponent(input.id)}/Download`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getDownloadReport',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

export const downloadContactReport: BenchmarkEmailEndpoints['reportsDownloadContactReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsDownloadContactReport']
		>(`Contact/${encodeURIComponent(input.id)}/Download`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.downloadContactReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailOpensByCountryRegion: BenchmarkEmailEndpoints['reportsGetEmailOpensByCountryRegion'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetEmailOpensByCountryRegion']
		>(
			`Emails/${encodeURIComponent(input.id)}/Report/Opens/${encodeURIComponent(input.country)}/${encodeURIComponent(input.region)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getEmailOpensByCountryRegion',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailReport: BenchmarkEmailEndpoints['reportsGetEmailReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetEmailReport']
		>(`Emails/Report`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getEmailReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEmailReportForwards: BenchmarkEmailEndpoints['reportsGetEmailReportForwards'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetEmailReportForwards']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Forwards`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getEmailReportForwards',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getForwardsReportByEmailID: BenchmarkEmailEndpoints['reportsGetForwardsReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetForwardsReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Forwards`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getForwardsReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getLinkDetailByEmailID: BenchmarkEmailEndpoints['reportsGetLinkDetailByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetLinkDetailByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/LinkDetail`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getLinkDetailByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOpenContactCount: BenchmarkEmailEndpoints['reportsGetOpenContactCount'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetOpenContactCount']
		>(`Engagement/OpenContactCount`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getOpenContactCount',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOpensHourlyReportByEmail: BenchmarkEmailEndpoints['reportsGetOpensHourlyReportByEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetOpensHourlyReportByEmail']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Opens/Hourly`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getOpensHourlyReportByEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOpensLocationReport: BenchmarkEmailEndpoints['reportsGetOpensLocationReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetOpensLocationReport']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Opens/Location`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getOpensLocationReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOpensLocationReportByEmail: BenchmarkEmailEndpoints['reportsGetOpensLocationReportByEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetOpensLocationReportByEmail']
		>(
			`Emails/${encodeURIComponent(input.id)}/Report/Opens/Location/${encodeURIComponent(input.countryCode)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getOpensLocationReportByEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOpensReport: BenchmarkEmailEndpoints['reportsGetOpensReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetOpensReport']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Opens`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getOpensReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportDetailsByABTest: BenchmarkEmailEndpoints['reportsGetReportDetailsByABTest'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetReportDetailsByABTest']
		>(
			`ABSplit/${encodeURIComponent(input.id)}/${encodeURIComponent(input.abID)}/Report`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getReportDetailsByABTest',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportDetailsByEmailID: BenchmarkEmailEndpoints['reportsGetReportDetailsByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetReportDetailsByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getReportDetailsByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportDownload: BenchmarkEmailEndpoints['reportsGetReportDownload'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetReportDownload']
		>(
			`Emails/${encodeURIComponent(input.id)}/${encodeURIComponent(input.reportType)}/Report/Download`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getReportDownload',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getReportsForAutoresponders: BenchmarkEmailEndpoints['reportsGetReportsForAutoresponders'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetReportsForAutoresponders']
		>(`Automation/Report`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getReportsForAutoresponders',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSocialPerformanceReport: BenchmarkEmailEndpoints['reportsGetSocialPerformanceReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetSocialPerformanceReport']
		>(
			`Emails/${encodeURIComponent(input.id)}/Report/SocialPerformance`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getSocialPerformanceReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getURLEngagementList: BenchmarkEmailEndpoints['reportsGetURLEngagementList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetURLEngagementList']
		>(`Engagement/URLList`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getURLEngagementList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getURLListByEmailID: BenchmarkEmailEndpoints['reportsGetURLListByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetURLListByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/URLList`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getURLListByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUnopensReport: BenchmarkEmailEndpoints['reportsGetUnopensReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetUnopensReport']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Unopens`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getUnopensReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUnopensReportByEmailID: BenchmarkEmailEndpoints['reportsGetUnopensReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetUnopensReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Unopens`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getUnopensReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUnsubscribeReportByEmailID: BenchmarkEmailEndpoints['reportsGetUnsubscribeReportByEmailID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetUnsubscribeReportByEmailID']
		>(`Emails/${encodeURIComponent(input.id)}/Report/Unsubscribes`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getUnsubscribeReportByEmailID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSaveAsList: BenchmarkEmailEndpoints['reportsGetSaveAsList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsGetSaveAsList']
		>(`Emails/GetSaveAsList`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.getSaveAsList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateListCompilationDetails: BenchmarkEmailEndpoints['reportsUpdateListCompilationDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['reportsUpdateListCompilationDetails']
		>(`Emails/SaveAsList`, ctx.key, { method: 'PATCH', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.reports.updateListCompilationDetails',
			eventLogPayload(input),
			'completed',
		);
		return response;
	};

import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const getDashboard: SalesforceEndpoints['getDashboard'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`analytics/dashboards/${input.dashboardId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.get_dashboard',
		input,
		'completed',
	);
	return response;
};

export const listDashboards: SalesforceEndpoints['listDashboards'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<Array<Record<string, unknown>>>(
		'analytics/dashboards',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.list_dashboards',
		{},
		'completed',
	);
	return { dashboards: Array.isArray(response) ? response : [] };
};

export const listEmailTemplates: SalesforceEndpoints['listEmailTemplates'] =
	async (ctx, input) => {
		const whereStr = input.query ? ` WHERE ${input.query}` : '';
		const q = `SELECT Id, Name, DeveloperName, FolderId, Subject FROM EmailTemplate${whereStr}`;

		const response = await makeSalesforceRequest<{
			records: Array<Record<string, unknown>>;
		}>('query', ctx.key, { method: 'GET', query: { q } });

		await logEventFromContext(
			ctx,
			'salesforce.analytics.list_email_templates',
			input,
			'completed',
		);
		return { templates: response.records ?? [] };
	};

export const listReports: SalesforceEndpoints['listReports'] = async (
	ctx,
	_input,
) => {
	const response = await makeSalesforceRequest<Array<Record<string, unknown>>>(
		'analytics/reports',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.list_reports',
		{},
		'completed',
	);
	return { reports: Array.isArray(response) ? response : [] };
};

export const runReport: SalesforceEndpoints['runReport'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`analytics/reports/${input.reportId}`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.run_report',
		input,
		'completed',
	);
	return response;
};

export const listAnalyticsTemplates: SalesforceEndpoints['listAnalyticsTemplates'] =
	async (ctx, _input) => {
		const response = await makeSalesforceRequest<{
			templates: Array<Record<string, unknown>>;
		}>('wave/templates', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.analytics.list_analytics_templates',
			{},
			'completed',
		);
		return { templates: response.templates ?? [] };
	};

/** @deprecated */
export const getReportInstance: SalesforceEndpoints['getReportInstance'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`analytics/reports/${input.reportId}/instances/${input.instanceId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.analytics.get_report_instance_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const getReport: SalesforceEndpoints['getReport'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`analytics/reports/${input.reportId}/describe`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.get_report_deprecated',
		input,
		'completed',
	);
	return response;
};

/** @deprecated */
export const queryReport: SalesforceEndpoints['queryReport'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<Record<string, unknown>>(
		`analytics/reports/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.analytics.query_report_deprecated',
		input,
		'completed',
	);
	return response;
};

import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { escapeSoql } from '../utils';
import { salesforceCall } from './shared';

export const getDashboard: SalesforceEndpoints['getDashboard'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		`analytics/dashboards/${input.dashboardId}`,
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
	const response = await salesforceCall<Array<Record<string, unknown>>>(
		ctx,
		'analytics/dashboards',
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
		const terms: string[] = [];
		if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
		if (input.developerName)
			terms.push(`DeveloperName = '${escapeSoql(input.developerName)}'`);
		if (input.folderId)
			terms.push(`FolderId = '${escapeSoql(input.folderId)}'`);
		const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
		const q = `SELECT Id, Name, DeveloperName, FolderId, Subject FROM EmailTemplate${whereStr}`;

		const response = await salesforceCall<{
			records: Array<Record<string, unknown>>;
		}>(ctx, 'query', { method: 'GET', query: { q } });

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
	const response = await salesforceCall<Array<Record<string, unknown>>>(
		ctx,
		'analytics/reports',
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		`analytics/reports/${input.reportId}`,
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
		const response = await salesforceCall<{
			templates: Array<Record<string, unknown>>;
		}>(ctx, 'wave/templates', { method: 'GET' });

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			`analytics/reports/${input.reportId}/instances/${input.instanceId}`,
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		`analytics/reports/${input.reportId}/describe`,
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
	const response = await salesforceCall<Record<string, unknown>>(
		ctx,
		`analytics/reports/${input.id}`,
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

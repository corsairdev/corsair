import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistScheduledReports } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List scheduled reports - GET /v1/scheduled_reports
export const scheduledReportsList: DnsfilterEndpoints['scheduledReportsList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsList']
		>('/v1/scheduled_reports', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsList.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a scheduled report - POST /v1/scheduled_reports
export const scheduledReportsCreate: DnsfilterEndpoints['scheduledReportsCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsCreate']
		>('/v1/scheduled_reports', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report: values.scheduled_report,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsCreate.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a scheduled report - GET /v1/scheduled_reports/{id}
export const scheduledReportsGet: DnsfilterEndpoints['scheduledReportsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsGet']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsGet.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a scheduled report - PATCH /v1/scheduled_reports/{id}
export const scheduledReportsUpdate: DnsfilterEndpoints['scheduledReportsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsUpdate']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				scheduled_report: values.scheduled_report,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsUpdate.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a scheduled report - DELETE /v1/scheduled_reports/{id}
export const scheduledReportsDelete: DnsfilterEndpoints['scheduledReportsDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsDelete']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsDelete.parse(response);
		try {
			await ctx.db.scheduledReports.deleteByEntityId(String(values.id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter scheduledReports row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

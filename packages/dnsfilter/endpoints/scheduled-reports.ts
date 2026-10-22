import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List scheduled reports - GET /v1/scheduled_reports
export const scheduledReportsList: DnsfilterEndpoints['scheduledReportsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsList']
		>('/v1/scheduled_reports', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a scheduled report - POST /v1/scheduled_reports
export const scheduledReportsCreate: DnsfilterEndpoints['scheduledReportsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsCreate']
		>('/v1/scheduled_reports', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report: input.scheduled_report,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a scheduled report - GET /v1/scheduled_reports/{id}
export const scheduledReportsGet: DnsfilterEndpoints['scheduledReportsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsGet']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a scheduled report - PATCH /v1/scheduled_reports/{id}
export const scheduledReportsUpdate: DnsfilterEndpoints['scheduledReportsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsUpdate']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				scheduled_report: input.scheduled_report,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a scheduled report - DELETE /v1/scheduled_reports/{id}
export const scheduledReportsDelete: DnsfilterEndpoints['scheduledReportsDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsDelete']
		>('/v1/scheduled_reports/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReports.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

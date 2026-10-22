import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistScheduledReports } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List scheduled reports V2 - GET /v2/scheduled_reports
export const scheduledReportsV2List: DnsfilterEndpoints['scheduledReportsV2List'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2List']
		>('/v2/scheduled_reports', ctx.key, {
			method: 'GET',
			query: {
				active: input.active,
				msp_id: input.msp_id,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				page: input.page,
				search: input.search,
				sort: input.sort,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a scheduled reports V2 - POST /v2/scheduled_reports
export const scheduledReportsV2Create: DnsfilterEndpoints['scheduledReportsV2Create'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Create']
		>('/v2/scheduled_reports', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report: input.scheduled_report,
			},
		});
		await persistScheduledReports(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a scheduled reports V2 - GET /v2/scheduled_reports/{id}
export const scheduledReportsV2Get: DnsfilterEndpoints['scheduledReportsV2Get'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Get']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await persistScheduledReports(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a scheduled reports V2 - PATCH /v2/scheduled_reports/{id}
export const scheduledReportsV2Update: DnsfilterEndpoints['scheduledReportsV2Update'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Update']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				scheduled_report: input.scheduled_report,
			},
		});
		await persistScheduledReports(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a scheduled reports V2 - DELETE /v2/scheduled_reports/{id}
export const scheduledReportsV2Delete: DnsfilterEndpoints['scheduledReportsV2Delete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Delete']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await persistScheduledReports(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk update for scheduled reports V2 - POST /v2/scheduled_reports/bulk_update
export const scheduledReportsV2BulkUpdate: DnsfilterEndpoints['scheduledReportsV2BulkUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2BulkUpdate']
		>('/v2/scheduled_reports/bulk_update', ctx.key, {
			method: 'POST',
			query: {
				msp_id: input.msp_id,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				search: input.search,
				status: input.status,
			},
			body: {
				ids: input.ids,
				all: input.all,
				exclude_ids: input.exclude_ids,
				active: input.active,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.bulkUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};

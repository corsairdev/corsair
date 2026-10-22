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

// List scheduled reports V2 - GET /v2/scheduled_reports
export const scheduledReportsV2List: DnsfilterEndpoints['scheduledReportsV2List'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsV2List.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2List']
		>('/v2/scheduled_reports', ctx.key, {
			method: 'GET',
			query: {
				active: values.active,
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				page: values.page,
				search: values.search,
				sort: values.sort,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2List.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a scheduled reports V2 - POST /v2/scheduled_reports
export const scheduledReportsV2Create: DnsfilterEndpoints['scheduledReportsV2Create'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsV2Create.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Create']
		>('/v2/scheduled_reports', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report: values.scheduled_report,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2Create.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a scheduled reports V2 - GET /v2/scheduled_reports/{id}
export const scheduledReportsV2Get: DnsfilterEndpoints['scheduledReportsV2Get'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsV2Get.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Get']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2Get.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a scheduled reports V2 - PATCH /v2/scheduled_reports/{id}
export const scheduledReportsV2Update: DnsfilterEndpoints['scheduledReportsV2Update'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsV2Update.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Update']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				scheduled_report: values.scheduled_report,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2Update.parse(response);
		await persistScheduledReports(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a scheduled reports V2 - DELETE /v2/scheduled_reports/{id}
export const scheduledReportsV2Delete: DnsfilterEndpoints['scheduledReportsV2Delete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledReportsV2Delete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2Delete']
		>('/v2/scheduled_reports/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2Delete.parse(response);
		try {
			await ctx.db.scheduledReports.deleteByEntityId(String(values.id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter scheduledReports row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk update for scheduled reports V2 - POST /v2/scheduled_reports/bulk_update
export const scheduledReportsV2BulkUpdate: DnsfilterEndpoints['scheduledReportsV2BulkUpdate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.scheduledReportsV2BulkUpdate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportsV2BulkUpdate']
		>('/v2/scheduled_reports/bulk_update', ctx.key, {
			method: 'POST',
			query: {
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				search: values.search,
				status: values.status,
			},
			body: {
				ids: values.ids,
				all: values.all,
				exclude_ids: values.exclude_ids,
				active: values.active,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportsV2BulkUpdate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportsV2.bulkUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

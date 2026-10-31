// DNSFilter scheduled reports endpoints.
// One file per resource family; each endpoint keeps its own group name.
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

// Get a scheduled report preview - GET /v1/scheduled_report_previews/{id}
export const scheduledReportPreviewsGet: DnsfilterEndpoints['scheduledReportPreviewsGet'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.scheduledReportPreviewsGet.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportPreviewsGet']
		>('/v1/scheduled_report_previews/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportPreviewsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportPreviews.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a scheduled report preview - POST /v1/scheduled_report_previews
export const scheduledReportPreviewsCreate: DnsfilterEndpoints['scheduledReportPreviewsCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.scheduledReportPreviewsCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportPreviewsCreate']
		>('/v1/scheduled_report_previews', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report_preview: values.scheduled_report_preview,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledReportPreviewsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportPreviews.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

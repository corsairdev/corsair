import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

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

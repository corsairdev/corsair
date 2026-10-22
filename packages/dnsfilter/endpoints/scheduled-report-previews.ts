import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Get a scheduled report preview - GET /v1/scheduled_report_previews/{id}
export const scheduledReportPreviewsGet: DnsfilterEndpoints['scheduledReportPreviewsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportPreviewsGet']
		>('/v1/scheduled_report_previews/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportPreviews.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a scheduled report preview - POST /v1/scheduled_report_previews
export const scheduledReportPreviewsCreate: DnsfilterEndpoints['scheduledReportPreviewsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledReportPreviewsCreate']
		>('/v1/scheduled_report_previews', ctx.key, {
			method: 'POST',
			body: {
				scheduled_report_preview: input.scheduled_report_preview,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledReportPreviews.create',
			input ?? {},
			'completed',
		);
		return response;
	};

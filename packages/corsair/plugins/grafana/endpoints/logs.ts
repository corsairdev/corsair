import { logEventFromContext } from '../../utils/events';
import type { GrafanaContext, GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest } from '../client';
import type { GrafanaEndpointOutputs, LogsCreateOtlpInput } from './types';

export const createOtlp: GrafanaEndpoints['logsCreateOtlp'] = async (
	ctx,
	input,
) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['logsCreateOtlp'];

	try {
		const raw = await makeGrafanaRawRequest('/otlp/v1/logs', ctx.key, grafanaUrl, {
			method: 'POST',
			// resourceLogs is cast to unknown here because makeGrafanaRawRequest accepts unknown body
			body: { resourceLogs: input.resourceLogs } as unknown as Record<string, unknown>,
			contentType: 'application/json',
		});

		const success = raw.status_code >= 200 && raw.status_code < 300;

		result = {
			data: {
				success,
				status_code: raw.status_code,
				message: success ? 'Logs ingested successfully' : raw.content,
			},
			successful: success,
		};
	} catch (error) {
		result = {
			data: {
				success: false,
				status_code: 0,
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.logs) {
		try {
			await _persistLogRecords(ctx, input);
		} catch (err) {
			console.warn('Failed to save log records to database:', err);
		}
	}

	await logEventFromContext(
		ctx,
		'grafana.logs.createOtlp',
		{ resourceLogs_count: input.resourceLogs.length },
		'completed',
	);
	return result;
};

async function _persistLogRecords(
	ctx: GrafanaContext,
	input: LogsCreateOtlpInput,
): Promise<void> {
	if (!ctx.db.logs) return;

	for (const resourceLog of input.resourceLogs) {
		for (const scopeLog of resourceLog.scopeLogs ?? []) {
			for (const record of scopeLog.logRecords ?? []) {
				// Generate a unique log ID from timestamp + traceId to deduplicate on upsert
				const logId = `${record.timeUnixNano ?? Date.now()}-${record.traceId ?? Math.random().toString(36).slice(2)}`;

				// Build a flat resource map for DB storage; values are stringified from their AnyValue shape
				const resourceAttrs: Record<string, string> = {};
				for (const attr of resourceLog.resource?.attributes ?? []) {
					if (attr.key) {
						resourceAttrs[attr.key] = String(
							attr.value?.stringValue ??
								attr.value?.intValue ??
								attr.value?.boolValue ??
								attr.value?.doubleValue ??
								'',
						);
					}
				}

				await ctx.db.logs.upsertByEntityId(logId, {
					id: logId,
					timeUnixNano: record.timeUnixNano,
					severityText: record.severityText,
					severityNumber: record.severityNumber,
					// body.stringValue is the most common log body type; fallback to stringify the whole body
					body: record.body?.stringValue ?? JSON.stringify(record.body),
					traceId: record.traceId,
					spanId: record.spanId,
					flags: record.flags,
					resource: Object.keys(resourceAttrs).length > 0 ? resourceAttrs : undefined,
					scope: scopeLog.scope?.name,
					createdAt: new Date(),
				});
			}
		}
	}
}

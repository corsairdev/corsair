import { logEventFromContext } from 'corsair/core';
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
		const raw = await makeGrafanaRawRequest(
			'/otlp/v1/logs',
			ctx.key,
			grafanaUrl,
			{
				method: 'POST',
				body: { resourceLogs: input.resourceLogs },
				contentType: 'application/json',
			},
		);

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

		for (const scopeLog of resourceLog.scopeLogs ?? []) {
			for (const record of scopeLog.logRecords ?? []) {
				// Generate a unique log ID from timestamp + traceId to deduplicate on upsert
				const logId = crypto.randomUUID();

				await ctx.db.logs.upsertByEntityId(logId, {
					...record,
					id: logId,
					// body.stringValue is the most common log body type; fallback to stringify the whole body
					body: record.body?.stringValue ?? JSON.stringify(record.body),
					resource:
						Object.keys(resourceAttrs).length > 0 ? resourceAttrs : undefined,
					scope: scopeLog.scope?.name,
					scopeVersion: scopeLog.scope?.version,
					createdAt: new Date(),
				});
			}
		}
	}
}

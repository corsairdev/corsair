import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function alertOnPosthogAnomalies(params: {
	tenantId: string;
	hoursAgo?: number;
	baselineDays?: number;
}) {
	const { tenantId, hoursAgo = 24, baselineDays = 7 } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setHours(date.getHours() - hoursAgo);
	const timeRange = {
		start: date.toISOString(),
		end: new Date().toISOString(),
	};

	const start = new Date();
	start.setDate(start.getDate() - baselineDays);
	const end = new Date();
	end.setDate(end.getDate() - (baselineDays - 1));
	const baselineRange = {
		start: start.toISOString(),
		end: end.toISOString(),
	};

	const currentEvents = await tenant.posthog.db.events.search({
		data: {
			createdAt: {
				between: [new Date(timeRange.start), new Date(timeRange.end)],
			},
		},
	});

	const baselineEvents = await tenant.posthog.db.events.search({
		data: {
			createdAt: {
				between: [new Date(baselineRange.start), new Date(baselineRange.end)],
			},
		},
	});

	const currentCount = currentEvents.length;
	const baselineCount = baselineEvents.length;
	const baselineAvg = baselineCount / baselineDays;
	const threshold = baselineAvg * 1.5;
	const anomaly = {
		isAnomaly: currentCount > threshold,
		currentCount,
		baselineAvg: Math.round(baselineAvg),
		threshold: Math.round(threshold),
	};

	if (!anomaly.isAnomaly) {
		return {
			success: true,
			anomalyDetected: false,
			currentCount: anomaly.currentCount,
			baselineAvg: anomaly.baselineAvg,
			processedAt: new Date().toISOString(),
		};
	}

	const slackChannel = await getSlackChannel(tenantId, 'alerts');

	const alertMessage = `⚠️ *PostHog Anomaly Detected*\n\n*Current Events:* ${anomaly.currentCount}\n*Baseline Average:* ${anomaly.baselineAvg}\n*Threshold:* ${anomaly.threshold}\n*Time Range:* Last ${hoursAgo} hours\n\nAnomaly detected: Event count is significantly higher than baseline.`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: alertMessage,
	});

	return {
		success: true,
		anomalyDetected: true,
		currentCount: anomaly.currentCount,
		baselineAvg: anomaly.baselineAvg,
		processedAt: new Date().toISOString(),
	};
}

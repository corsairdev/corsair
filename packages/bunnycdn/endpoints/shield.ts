import type { BunnycdnContext } from '../index';
import { api, apiVoid } from './helpers';
import type {
	BunnycdnEndpointOutputs,
	ShieldAccessListConfigUpdateInput,
	ShieldAccessListCreateInput,
	ShieldAccessListIdInput,
	ShieldAccessListUpdateInput,
	ShieldBotDetectionUpdateInput,
	ShieldEventLogsInput,
	ShieldMetricsDetailedInput,
	ShieldPageInput,
	ShieldRateLimitCreateInput,
	ShieldRateLimitIdInput,
	ShieldRateLimitsListInput,
	ShieldRateLimitUpdateInput,
	ShieldUploadScanningUpdateInput,
	ShieldWafCustomRuleIdInput,
	ShieldWafCustomRulesListInput,
	ShieldWafRuleMetricsInput,
	ShieldWafRuleReviewInput,
	ShieldZoneByPullZoneInput,
	ShieldZoneIdInput,
	ShieldZoneUpdateInput,
} from './types';

// Spec: https://api.bunny.net/shield/docs/v1/swagger.json
// Docs: https://bunny.net/docs/api-reference/shield

export async function zonesList(
	ctx: BunnycdnContext,
	input: ShieldPageInput = {},
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/shield-zones', {
		query: { page: input.page, perPage: input.perPage },
	});
}

export async function zoneGet(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldZoneId']> {
	return api(ctx, 'shield', 'GET', `/shield-zone/${input.shieldZoneId}`);
}

export async function zoneGetByPullZone(
	ctx: BunnycdnContext,
	input: ShieldZoneByPullZoneInput,
): Promise<BunnycdnEndpointOutputs['shieldZoneByPullZone']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/get-by-pullzone/${input.pullZoneId}`,
	);
}

export async function zonesPullZoneMapping(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/shield-zones/pullzone-mapping');
}

export async function zoneUpdate(
	ctx: BunnycdnContext,
	input: ShieldZoneUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldZoneUpdate']> {
	return api(ctx, 'shield', 'PATCH', '/shield-zone', {
		body: {
			shieldZoneId: input.shieldZoneId,
			...(input.shieldZone ?? {}),
		},
	});
}

export async function rateLimitsList(
	ctx: BunnycdnContext,
	input: ShieldRateLimitsListInput,
): Promise<BunnycdnEndpointOutputs['shieldRateLimitsList']> {
	return api(ctx, 'shield', 'GET', `/rate-limits/${input.shieldZoneId}`, {
		query: { page: input.page, perPage: input.perPage },
	});
}

export async function rateLimitGet(
	ctx: BunnycdnContext,
	input: ShieldRateLimitIdInput,
): Promise<BunnycdnEndpointOutputs['shieldRateLimitId']> {
	return api(ctx, 'shield', 'GET', `/rate-limit/${input.id}`);
}

export async function rateLimitCreate(
	ctx: BunnycdnContext,
	input: ShieldRateLimitCreateInput,
): Promise<BunnycdnEndpointOutputs['shieldRateLimitCreate']> {
	const { shieldZoneId, ruleName, ruleDescription, ruleConfiguration } = input;
	return api(ctx, 'shield', 'POST', '/rate-limit', {
		body: {
			shieldZoneId,
			ruleName,
			ruleDescription,
			ruleConfiguration: ruleConfiguration ?? {},
		},
	});
}

export async function rateLimitUpdate(
	ctx: BunnycdnContext,
	input: ShieldRateLimitUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldRateLimitUpdate']> {
	const { id, ruleName, ruleDescription, ruleConfiguration } = input;
	return api(ctx, 'shield', 'PATCH', `/rate-limit/${id}`, {
		body: {
			ruleName,
			ruleDescription,
			ruleConfiguration: ruleConfiguration ?? {},
		},
	});
}

export async function rateLimitDelete(
	ctx: BunnycdnContext,
	input: ShieldRateLimitIdInput,
): Promise<BunnycdnEndpointOutputs['shieldRateLimitDelete']> {
	return apiVoid(ctx, 'shield', 'DELETE', `/rate-limit/${input.id}`);
}

export async function metricsOverview(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(ctx, 'shield', 'GET', `/metrics/overview/${input.shieldZoneId}`);
}

export async function metricsOverviewDetailed(
	ctx: BunnycdnContext,
	input: ShieldMetricsDetailedInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/metrics/overview/${input.shieldZoneId}/detailed`,
		{
			query: {
				StartDate: input.startDate,
				EndDate: input.endDate,
				Resolution: input.resolution,
			},
		},
	);
}

export async function metricsRateLimit(
	ctx: BunnycdnContext,
	input: ShieldRateLimitIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(ctx, 'shield', 'GET', `/metrics/rate-limit/${input.id}`);
}

export async function metricsRateLimits(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/metrics/rate-limits/${input.shieldZoneId}`,
	);
}

export async function metricsBotDetection(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/metrics/shield-zone/${input.shieldZoneId}/bot-detection`,
	);
}

export async function metricsUploadScanning(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/metrics/shield-zone/${input.shieldZoneId}/upload-scanning`,
	);
}

export async function metricsWafRule(
	ctx: BunnycdnContext,
	input: ShieldWafRuleMetricsInput,
): Promise<BunnycdnEndpointOutputs['shieldWafRuleMetrics']> {
	// Caller-supplied ids stay a single path segment even with `/` or `..`.
	const ruleId = encodeURIComponent(String(input.ruleId));
	return api(
		ctx,
		'shield',
		'GET',
		`/metrics/shield-zone/${input.shieldZoneId}/waf-rule/${ruleId}`,
	);
}

export async function eventLogs(
	ctx: BunnycdnContext,
	input: ShieldEventLogsInput,
): Promise<BunnycdnEndpointOutputs['shieldEventLogs']> {
	const date = encodeURIComponent(input.date);
	const continuationToken = encodeURIComponent(input.continuationToken);
	return api(
		ctx,
		'shield',
		'GET',
		`/event-logs/${input.shieldZoneId}/${date}/${continuationToken}`,
	);
}

export async function promoState(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/promo/state');
}

export async function ddosEnums(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/ddos/enums');
}

export async function botDetectionGet(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/${input.shieldZoneId}/bot-detection`,
	);
}

export async function botDetectionUpdate(
	ctx: BunnycdnContext,
	input: ShieldBotDetectionUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldBotDetectionUpdate']> {
	return api(
		ctx,
		'shield',
		'PATCH',
		`/shield-zone/${input.shieldZoneId}/bot-detection`,
		{
			body: {
				shieldZoneId: input.shieldZoneId,
				executionMode: input.executionMode,
			},
		},
	);
}

export async function uploadScanningGet(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/${input.shieldZoneId}/upload-scanning`,
	);
}

export async function uploadScanningUpdate(
	ctx: BunnycdnContext,
	input: ShieldUploadScanningUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldUploadScanningUpdate']> {
	return api(
		ctx,
		'shield',
		'PATCH',
		`/shield-zone/${input.shieldZoneId}/upload-scanning`,
		{
			body: {
				shieldZoneId: input.shieldZoneId,
				isEnabled: input.isEnabled,
				csamScanningMode: input.csamScanningMode,
				antivirusScanningMode: input.antivirusScanningMode,
			},
		},
	);
}

export async function accessListsList(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/${input.shieldZoneId}/access-lists`,
	);
}

export async function accessListGet(
	ctx: BunnycdnContext,
	input: ShieldAccessListIdInput,
): Promise<BunnycdnEndpointOutputs['shieldAccessListId']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/${input.shieldZoneId}/access-lists/${input.id}`,
	);
}

export async function accessListCreate(
	ctx: BunnycdnContext,
	input: ShieldAccessListCreateInput,
): Promise<BunnycdnEndpointOutputs['shieldAccessListCreate']> {
	const { shieldZoneId, name, type, content, description, checksum } = input;
	return api(
		ctx,
		'shield',
		'POST',
		`/shield-zone/${shieldZoneId}/access-lists`,
		{ body: { name, type, content, description, checksum } },
	);
}

export async function accessListUpdate(
	ctx: BunnycdnContext,
	input: ShieldAccessListUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldAccessListUpdate']> {
	const { shieldZoneId, id, name, content, checksum } = input;
	return api(
		ctx,
		'shield',
		'PATCH',
		`/shield-zone/${shieldZoneId}/access-lists/${id}`,
		{ body: { name, content, checksum } },
	);
}

export async function accessListConfigUpdate(
	ctx: BunnycdnContext,
	input: ShieldAccessListConfigUpdateInput,
): Promise<BunnycdnEndpointOutputs['shieldAccessListConfigUpdate']> {
	const { shieldZoneId, id, isEnabled, action } = input;
	return api(
		ctx,
		'shield',
		'PATCH',
		`/shield-zone/${shieldZoneId}/access-lists/configurations/${id}`,
		{ body: { isEnabled, action } },
	);
}

export async function accessListEnums(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldMetricsDetailed']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/shield-zone/${input.shieldZoneId}/access-lists/enums`,
	);
}

export async function wafCustomRulesList(
	ctx: BunnycdnContext,
	input: ShieldWafCustomRulesListInput,
): Promise<BunnycdnEndpointOutputs['shieldWafCustomRulesList']> {
	return api(ctx, 'shield', 'GET', `/waf/custom-rules/${input.shieldZoneId}`, {
		query: { page: input.page, perPage: input.perPage },
	});
}

export async function wafCustomRuleGet(
	ctx: BunnycdnContext,
	input: ShieldWafCustomRuleIdInput,
): Promise<BunnycdnEndpointOutputs['shieldWafCustomRuleId']> {
	const id = encodeURIComponent(String(input.id));
	return api(ctx, 'shield', 'GET', `/waf/custom-rule/${id}`);
}

export async function wafEngineConfig(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/waf/engine-config');
}

export async function wafEnums(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/waf/enums');
}

export async function wafProfiles(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/waf/profiles');
}

export async function wafRulesPlanSegmentation(
	ctx: BunnycdnContext,
): Promise<BunnycdnEndpointOutputs['shieldPage']> {
	return api(ctx, 'shield', 'GET', '/waf/rules/plan-segmentation');
}

export async function wafRulesReviewTriggered(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldWafRuleReview']> {
	return api(
		ctx,
		'shield',
		'GET',
		`/waf/rules/review-triggered/${input.shieldZoneId}`,
	);
}

export async function wafRulesByZone(
	ctx: BunnycdnContext,
	input: ShieldZoneIdInput,
): Promise<BunnycdnEndpointOutputs['shieldWafRuleReview']> {
	return api(ctx, 'shield', 'GET', `/waf/rules/${input.shieldZoneId}`);
}

export async function wafRulesReviewTriggeredPost(
	ctx: BunnycdnContext,
	input: ShieldWafRuleReviewInput,
): Promise<BunnycdnEndpointOutputs['shieldWafRuleReview']> {
	return api(
		ctx,
		'shield',
		'POST',
		`/waf/rules/review-triggered/${input.shieldZoneId}`,
		{
			body: {
				ruleId: input.ruleId,
				action: input.action,
			},
		},
	);
}

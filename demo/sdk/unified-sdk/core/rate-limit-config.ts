import type { RateLimitConfig } from './rate-limit';
import { GITHUB_RATE_LIMIT_CONFIG, DEFAULT_RATE_LIMIT_CONFIG } from './rate-limit';

export const SDK_RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
	github: GITHUB_RATE_LIMIT_CONFIG,
	slack: DEFAULT_RATE_LIMIT_CONFIG,
	posthog: DEFAULT_RATE_LIMIT_CONFIG,
	linear: DEFAULT_RATE_LIMIT_CONFIG,
	hubspot: DEFAULT_RATE_LIMIT_CONFIG,
	gmail: DEFAULT_RATE_LIMIT_CONFIG,
};

export function getRateLimitConfig(sdkName: string): RateLimitConfig {
	return SDK_RATE_LIMIT_CONFIGS[sdkName] || DEFAULT_RATE_LIMIT_CONFIG;
}


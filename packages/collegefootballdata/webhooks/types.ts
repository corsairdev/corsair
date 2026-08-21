/**
 * The OSS catalog for this integration lists zero triggers, and the
 * provider's API has no webhook capability at all - see
 * `tenant-matcher.ts`. This plugin registers no webhook handlers.
 */
export type CollegeFootballDataWebhookOutputs = Record<string, never>;

/**
 * SuiteDash is the system of record for its CRM data, and mirroring contacts and
 * companies here would duplicate a dataset the portal already serves.
 * `entities` stays empty for that reason.
 */
export const SuitedashSchema = {
	version: '1.0.0',
	entities: {},
} as const;

import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const DnsInputSchemas = {
	dnsList: z
		.object({
			workspaceId: WorkspaceId,
			domain: z
				.string()
				.optional()
				.describe('Domain name (required if uid not provided)'),
			uid: z
				.string()
				.optional()
				.describe('Domain UID (required if domain not provided)'),
		})
		.strict(),
	dnsAdd: z
		.object({
			workspaceId: WorkspaceId,
			records: z
				.array(
					z
						.object({
							host: z.string().describe('Record hostname'),
							type: z.string(),
							value: z
								.string()
								.describe('Record value (format depends on type)'),
							ttl: z
								.number()
								.int()
								.optional()
								.describe('Time to live in seconds (1-86400, default: 3600)'),
							priority: z.number().int().optional(),
							proxied: z.boolean().optional(),
						})
						.strict(),
				)
				.describe('Array of DNS records to add'),
			domain: z
				.string()
				.optional()
				.describe('Domain name (required if uid not provided)'),
			uid: z
				.string()
				.optional()
				.describe('Domain UID (required if domain not provided)'),
		})
		.strict(),
	dnsUpdate: z
		.object({
			workspaceId: WorkspaceId,
			records: z
				.array(
					z
						.object({
							record_id: z.string().describe('ID of the DNS record to update'),
							host: z.string().describe('Record hostname'),
							type: z.string(),
							value: z
								.string()
								.describe('Record value (format depends on type)'),
							ttl: z
								.number()
								.int()
								.optional()
								.describe('Time to live in seconds (1-86400, default: 3600)'),
							priority: z.number().int().optional(),
							proxied: z.boolean().optional(),
						})
						.strict(),
				)
				.describe('Array of DNS records to update'),
			domain: z
				.string()
				.optional()
				.describe('Domain name (required if uid not provided)'),
			uid: z
				.string()
				.optional()
				.describe('Domain UID (required if domain not provided)'),
		})
		.strict(),
	dnsDeleteRecords: z
		.object({
			workspaceId: WorkspaceId,
			domain: z
				.string()
				.optional()
				.describe('Domain name (required if uid not provided)'),
			uid: z
				.string()
				.optional()
				.describe('Domain UID (required if domain not provided)'),
			record_ids: z
				.array(z.string())
				.optional()
				.describe(
					'Array of DNS record IDs to delete (required if delete_all is false)',
				),
			delete_all: z
				.boolean()
				.optional()
				.describe('Delete all DNS records for the domain. Default false.'),
		})
		.strict(),
	dnsVerify: z
		.object({
			workspaceId: WorkspaceId,
			domain: z
				.string()
				.optional()
				.describe(
					'Domain name to verify. Use this when checking a single domain.',
				),
			uid: z
				.string()
				.optional()
				.describe(
					'Domain UID to verify. Use this when checking a single domain by its UID.',
				),
			domains: z
				.array(z.string())
				.optional()
				.describe(
					'Array of domain names to verify in bulk. You can include up to 50 domains per request.',
				),
			uids: z
				.array(z.string())
				.optional()
				.describe(
					'Array of domain UIDs to verify in bulk. You can include up to 50 UIDs per request.',
				),
		})
		.strict(),
	dnsRepair: z
		.object({
			workspaceId: WorkspaceId,
			domain: z
				.string()
				.optional()
				.describe(
					'Domain name to repair. Use this when fixing a single domain.',
				),
			uid: z
				.string()
				.optional()
				.describe(
					'Domain UID to repair. Use this when fixing a single domain by its UID.',
				),
			domains: z
				.array(z.string())
				.optional()
				.describe(
					'Array of domain names to repair in bulk. You can include up to 50 domains per request.',
				),
			uids: z
				.array(z.string())
				.optional()
				.describe(
					'Array of domain UIDs to repair in bulk. You can include up to 50 UIDs per request.',
				),
		})
		.strict(),
} as const;

export const DnsOutputSchemas = {
	dnsList: z
		.object({
			error: bool,
			message: str,
			dns_record: z
				.object({
					records: z
						.array(
							z
								.object({
									host: str,
									type: str,
									value: str,
									ttl: num,
									status: str,
									priority: num,
									proxied: bool,
								})
								.loose(),
						)
						.nullish()
						.describe('Array of DNS records'),
					uid: str.describe('DNS record document ID'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	dnsAdd: z
		.object({
			error: bool,
			message: str,
			added_records: num,
			dns_record: z
				.object({
					uid: str,
				})
				.loose()
				.nullish()
				.describe('Complete DNS record document'),
		})
		.loose(),
	dnsUpdate: z
		.object({
			error: bool,
			message: str,
			dns_record: obj.describe('Complete DNS record document'),
			updated_records: z
				.array(obj)
				.nullish()
				.describe('Array of updated records'),
			updated_count: num.describe('Number of records updated'),
		})
		.loose(),
	dnsDeleteRecords: z
		.object({
			error: bool,
			message: str,
			deleted_count: num.describe('Number of records deleted'),
			deleted_records: z
				.array(
					z
						.object({
							host: str,
							value: str,
							type: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of deleted records'),
			remaining_records: num.describe(
				'Number of remaining records (only for specific deletes)',
			),
			dns_record: z
				.object({
					uid: str,
				})
				.loose()
				.nullish()
				.describe('Updated DNS record document'),
			records: z
				.array(
					z
						.object({
							host: str,
							type: str,
							value: str,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	dnsVerify: z
		.object({
			error: bool.describe(
				'false when the request was processed successfully (even if some domains have issues). true only when the entire request fails.',
			),
			message: str.describe('A summary of the verification results.'),
			summary: z
				.object({
					total_requested: num.describe(
						'Total number of domains you requested to verify.',
					),
					total_verified: num.describe(
						'Number of domains that were successfully verified.',
					),
					total_failed: num.describe(
						'Number of domains that could not be verified (for example, domain not found in your workspace).',
					),
					healthy: num.describe(
						'Number of domains where all four email records are correctly configured.',
					),
					critical: num.describe(
						'Number of domains with missing or errored records that will likely cause email delivery failures.',
					),
					issues_found: num.describe(
						'Number of domains where records exist but have incorrect values.',
					),
					needs_repair: num.describe(
						'Number of domains that have fixable issues. You can pass these to the Repair DNS Records endpoint.',
					),
				})
				.loose()
				.nullish()
				.describe('Aggregated counts across all domains in this request.'),
			results: z
				.array(
					z
						.object({
							domain: str,
							domain_uid: str,
							status: str,
							error_message: str,
							platform: str,
							cloudflare_checked: bool,
							overall_health: str,
							needs_repair: bool,
							message: str,
							cloudflare_check_reason: str,
							records: z
								.array(
									z
										.object({
											label: str,
											type: str,
											host: str,
											status: str,
											current_value: str,
											expected_value: str,
											issue: str,
											fix_description: str,
										})
										.loose(),
								)
								.nullish(),
							record_summary: z
								.object({
									total_checked: num,
									ok: num,
									missing: num,
									misconfigured: num,
									errored: num,
									pending: num,
									not_applicable: num,
									out_of_sync: num,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Per-domain verification results. Each item contains the full health report for one domain.',
				),
		})
		.loose(),
	dnsRepair: z
		.object({
			error: bool.describe(
				'false when the request was processed successfully. true only when the entire request fails.',
			),
			message: str.describe('A summary of the repair results.'),
			summary: z
				.object({
					total_requested: num.describe(
						'Total number of domains you requested to repair.',
					),
					total_repaired: num.describe(
						'Number of domains that were successfully processed.',
					),
					total_failed: num.describe(
						'Number of domains that could not be repaired.',
					),
					total_actions: num.describe(
						'Total number of repair actions taken across all domains.',
					),
					total_added: num.describe('Total records added across all domains.'),
					total_reset: num.describe(
						'Total records reset for re-sync across all domains.',
					),
					total_updated: num.describe(
						'Total records updated with correct values across all domains.',
					),
					total_imported: num.describe(
						'Total records imported from Cloudflare across all domains.',
					),
					total_reconciled: num.describe(
						'Total records reconciled from Cloudflare across all domains.',
					),
					total_duplicates_removed: num.describe(
						'Total duplicate records removed across all domains.',
					),
					total_skipped: num.describe(
						'Total records skipped (already healthy) across all domains.',
					),
				})
				.loose()
				.nullish()
				.describe('Aggregated counts across all domains in this request.'),
			results: z
				.array(
					z
						.object({
							domain: str,
							domain_uid: str,
							status: str,
							error_message: str,
							platform: str,
							cloudflare_checked: bool,
							actions_taken: z
								.array(
									z
										.object({
											label: str,
											action: str,
											type: str,
											host: str,
											value: str,
										})
										.loose(),
								)
								.nullish(),
							skipped: z
								.array(
									z
										.object({
											label: str,
											reason: str,
										})
										.loose(),
								)
								.nullish(),
							message: str,
							dns_record: z
								.object({
									records: z.array(obj).nullish(),
								})
								.loose()
								.nullish(),
							repair_summary: z
								.object({
									added: num,
									reset: num,
									updated: num,
									imported: num,
									reconciled: num,
									duplicates_removed: num,
									skipped: num,
									total_actions: num,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Per-domain repair results. Each item shows what was fixed for one domain.',
				),
		})
		.loose(),
} as const;

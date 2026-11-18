import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const PrewarmInputSchemas = {
	prewarmSearchDomains: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number for pagination. Default 1.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Number of results per page. Default 10.'),
			keyword: z
				.string()
				.optional()
				.describe('Keyword to search in domain names (fuzzy search)'),
			domain_name: z
				.string()
				.optional()
				.describe('Specific domain name to search for'),
			domain_id: z
				.string()
				.optional()
				.describe('Specific domain ID to search for'),
			domain_ids: z
				.array(z.string())
				.optional()
				.describe('Array of domain IDs to search for'),
			tlds: z
				.array(z.string())
				.optional()
				.describe("Filter by TLDs (e.g., ['com', 'net', '.org'])"),
			platform: z
				.enum(['GOOGLE', 'MICROSOFT'])
				.optional()
				.describe('Filter domains by platform'),
			min_age_days: z
				.number()
				.int()
				.nullable()
				.optional()
				.describe('Minimum domain age in days'),
			max_age_days: z
				.number()
				.int()
				.nullable()
				.optional()
				.describe('Maximum domain age in days'),
			min_available_mailboxes: z
				.number()
				.int()
				.min(0)
				.optional()
				.describe('Minimum number of available mailboxes. Default 0.'),
			status: z
				.enum(['active', 'inactive'])
				.optional()
				.describe('Domain status. Default "active".'),
		})
		.strict(),
	prewarmSearchMailboxes: z
		.object({
			workspaceId: WorkspaceId,
			domain_id: z.string().optional().describe('Domain ID'),
			domain_ids: z.array(z.string()).optional().describe('Domain IDs'),
			first_name: z.string().optional().describe('Filter by first name'),
			last_name: z.string().optional().describe('Filter by last name'),
			full_name: z
				.string()
				.optional()
				.describe('Filter by full name (exact match)'),
			gender: z
				.enum(['male', 'female'])
				.optional()
				.describe('Filter by gender'),
			domain: z
				.string()
				.optional()
				.describe(
					'Filter by domain name (third priority, after domain_id/domain_ids)',
				),
			domain_age_min: z
				.number()
				.optional()
				.describe('Minimum domain age in days'),
			domain_age_max: z
				.number()
				.optional()
				.describe('Maximum domain age in days'),
			platform: z
				.enum(['GOOGLE', 'MICROSOFT'])
				.optional()
				.describe('Filter by platform'),
			page: z.number().min(1).optional().describe('Default 1.'),
			limit: z.number().min(1).max(100).optional().describe('Default 10.'),
		})
		.strict(),
	prewarmCheckAvailability: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(z.string())
				.min(1)
				.max(500)
				.describe('Array of domain names to check availability'),
		})
		.strict(),
	prewarmBuy: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(
					z
						.object({
							domain_id: z
								.string()
								.optional()
								.describe(
									"The domain's `_id` from Search Domains. Send `domain_id` or `domain_name`.",
								),
							domain_name: z
								.string()
								.optional()
								.describe(
									'The domain name. Send `domain_id` or `domain_name`.',
								),
							consent_screen_url: z
								.string()
								.optional()
								.describe(
									'An app consent link starting with `http://` or `https://`. After the handover, every mailbox on the domain signs in and approves it, so your app gets access. An empty string means none.',
								),
							domain_redirect_url: z
								.string()
								.optional()
								.describe(
									'Where visitors to the domain are forwarded. Must start with `http://` or `https://`. An empty string means none.',
								),
							mailboxes: z
								.array(
									z
										.object({
											mailbox_id: z
												.string()
												.optional()
												.describe(
													'Picks the mailbox by its `_id` or `uid` from Search Mailboxes.',
												),
											username: z
												.string()
												.optional()
												.describe(
													'Picks the mailbox by its current username (the part before the @). It does not rename the mailbox.',
												),
											email: z
												.string()
												.optional()
												.describe(
													'Picks the mailbox by its current address on this domain. It does not rename the mailbox.',
												),
											new_username: z
												.string()
												.optional()
												.describe(
													'Renames the mailbox to this username. Use lowercase letters, numbers, dots, hyphens or underscores, starting and ending with a letter or number, up to 64 characters.',
												),
											first_name: z
												.string()
												.optional()
												.describe(
													'The first name to set. Same as `new_first_name`. If you send both, `new_first_name` is used.',
												),
											new_first_name: z
												.string()
												.optional()
												.describe('The first name to set.'),
											last_name: z
												.string()
												.optional()
												.describe(
													'The last name to set. Same as `new_last_name`. If you send both, `new_last_name` is used.',
												),
											new_last_name: z
												.string()
												.optional()
												.describe('The last name to set.'),
											profile_picture: z
												.string()
												.optional()
												.describe(
													'The photo to set: a public image URL or a base64 data URI such as `data:image/png;base64,...`. Same as `new_profile_picture`. If you send both, `new_profile_picture` is used.',
												),
											new_profile_picture: z
												.string()
												.optional()
												.describe(
													'The photo to set: a public image URL or a base64 data URI.',
												),
										})
										.strict(),
								)
								.optional()
								.describe(
									'Changes for individual mailboxes. Leave it out to keep every mailbox as it is.',
								),
						})
						.strict(),
				)
				.min(1)
				.describe('The domains to buy, at least one.'),
			sequencer_uid: z
				.string()
				.optional()
				.describe(
					'Connect the mailboxes to this sequencer after the handover.',
				),
			keep_warming: z
				.boolean()
				.optional()
				.describe(
					'Keep warming the mailboxes for up to 12 weeks after the handover. Defaults to `true`.',
				),
		})
		.strict(),
	prewarmGetOrderStatus: z
		.object({
			workspaceId: WorkspaceId,
			order_uid: z.string().min(1).describe('order_uid'),
		})
		.strict(),
} as const;

export const PrewarmOutputSchemas = {
	prewarmSearchDomains: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					domains: z
						.array(
							z
								.object({
									_id: str,
									name: str,
									tld: str,
									status: str,
									platform: str,
									domain_age_days: num,
									available_mailboxes: num,
									price_per_mailbox: num,
									domain_price: num,
									total_price: num,
									mailboxes: z.array(obj).nullish(),
									createdAt: str,
									uid: str,
									price_per_tenant: num,
								})
								.loose(),
						)
						.nullish(),
					pagination: z
						.object({
							page: num,
							limit: num,
							total: num,
							pages: num,
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	prewarmSearchMailboxes: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					mailboxes: z
						.array(
							z
								.object({
									_id: str,
									email: str,
									username: str,
									first_name: str,
									last_name: str,
									full_name: str,
									gender: str,
									profile_picture: str,
									platform: str,
									status: str,
									is_admin: bool,
									domain_id: str,
									domain_name: str,
									domain_age_days: num,
									createdAt: str,
									updatedAt: str,
									uid: str,
									price_per_mailbox: num,
								})
								.loose(),
						)
						.nullish(),
					pagination: z
						.object({
							page: num,
							limit: num,
							total: num,
							pages: num,
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	prewarmCheckAvailability: z
		.object({
			error: bool.describe('Always false for successful responses'),
			total: num.describe('Total number of domains checked'),
			available: num.describe('Number of domains available for purchase'),
			unavailable: num.describe('Number of domains not available for purchase'),
			breakdown: z
				.object({
					not_in_inventory: num.describe(
						"Domains that don't exist in inventory",
					),
					already_ordered: num.describe(
						'Domains that have already been ordered',
					),
				})
				.loose()
				.nullish()
				.describe('Breakdown of unavailability reasons'),
			domains: z
				.array(
					z
						.object({
							domain: str,
							available: bool,
							reason: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Detailed availability status for each domain'),
		})
		.loose(),
	prewarmBuy: z
		.object({
			error: bool,
			message: str.describe('What happened.'),
			data: z
				.object({
					order_uid: str.describe(
						"The order's id. Use it with Check Order Status.",
					),
					order_id: str.describe('Another id of the order.'),
					status: str.describe('The order status. A new order is `pending`.'),
					total_domains: num.describe('Number of domains in the order.'),
					total_mailboxes: num.describe(
						'Number of mailboxes across all domains.',
					),
					total_price: num.describe('The amount charged to your wallet.'),
					domains: z
						.array(
							z
								.object({
									domain_id: str,
									domain_name: str,
									mailboxes_count: num,
									mailbox_ids: z.array(str).nullish(),
									consent_screen_url: str,
									domain_redirect_url: str,
								})
								.loose(),
						)
						.nullish()
						.describe('The domains in the order.'),
					sequencer_uid: str.describe('The sequencer you sent, or null.'),
					buyer: z
						.object({
							team_uid: str,
							workspace_uid: str,
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	prewarmGetOrderStatus: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Response message'),
			data: z
				.object({
					order_uid: str.describe('Unique identifier of the order'),
					status: str.describe('Current status of the order'),
					buyer: z
						.object({
							team_uid: str,
							team_name: str,
							workspace_uid: str,
							workspace_name: str,
						})
						.loose()
						.nullish(),
					domains: z
						.array(
							z
								.object({
									domain_id: str,
									domain_name: str,
									mailboxes_count: num,
									dns_records_count: num,
									consent_screen_url: str,
								})
								.loose(),
						)
						.nullish(),
					sequencer_uid: str.describe(
						'UID of the associated sequencer (if any)',
					),
					stats: z
						.object({
							total_domains: num,
							total_mailboxes: num,
							total_dns_records: num,
						})
						.loose()
						.nullish(),
					pricing: z
						.object({
							price_per_mailbox: num,
							total_price: num,
						})
						.loose()
						.nullish(),
					processing: z
						.object({
							started_at: str,
							completed_at: str,
							error_message: str,
						})
						.loose()
						.nullish(),
					createdAt: str.describe('Order creation timestamp'),
					updatedAt: str.describe('Order last update timestamp'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;

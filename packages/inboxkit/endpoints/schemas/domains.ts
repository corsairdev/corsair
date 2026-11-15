import { z } from 'zod';
import {
	bool,
	looseResult,
	num,
	numeric,
	obj,
	str,
	WorkspaceId,
} from '../schema-helpers';

export const DomainsInputSchemas = {
	domainsList: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().optional().describe('Default 1.'),
			limit: z.number().optional().describe('Default 10.'),
			uids: z.array(z.string()).optional(),
			keywords: z.string().optional(),
			status: z
				.array(z.string())
				.optional()
				.describe("Filter by domain status (e.g., ['active', 'pending'])"),
			nameserver_match_status: z
				.array(z.enum(['matched', 'moved', 'pending', 'unknown']))
				.optional()
				.describe(
					"Filter by nameserver match status. Use ['moved'] to find domains that need nameserver regeneration",
				),
		})
		.strict(),
	domainsListAssignable: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number for pagination'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Number of items per page'),
			keyword: z
				.string()
				.optional()
				.describe('Search keyword for filtering domains'),
			min_mailboxes: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Minimum number of available mailboxes'),
			uids: z.array(z.string()).optional(),
		})
		.strict(),
	domainsCheckAvailability: z
		.object({
			domain: z.string().describe('Domain name to check'),
		})
		.strict(),
	domainsCheckBanned: z
		.object({
			domain: z.string().describe('Domain name to check'),
		})
		.strict(),
	domainsSearch: z
		.object({
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number for pagination. Default 1.'),
			num: z
				.number()
				.int()
				.min(1)
				.max(100)
				.describe('Number of domains to return'),
			keyword: z
				.string()
				.optional()
				.describe('Search keyword (required if domain not provided)'),
			domain: z
				.string()
				.optional()
				.describe(
					'Specific domain to search (required if keyword not provided)',
				),
			show_unavailable: z
				.boolean()
				.optional()
				.describe('Include unavailable domains in results. Default false.'),
			check_banned: z
				.boolean()
				.optional()
				.describe(
					'Check if domains are banned from registration. Default true.',
				),
			check_google_workspace_availability: z
				.boolean()
				.optional()
				.describe('Check Google Workspace availability. Default true.'),
			check_ms365_workspace_availability: z
				.boolean()
				.optional()
				.describe('Check Microsoft 365 availability. Default true.'),
			registration_years: z
				.number()
				.int()
				.min(1)
				.max(10)
				.optional()
				.describe('Number of years for registration. Default 1.'),
			tlds: z.array(z.string()).optional().describe('Specific TLDs to search'),
		})
		.strict()
		.refine((input) => Boolean(input.keyword || input.domain), {
			message: 'Pass keyword or domain.',
		}),
	domainsCheckWorkspaceAvailability: z
		.object({
			domains: z
				.array(z.string())
				.min(1)
				.describe('List of domain names to check workspace availability'),
		})
		.strict(),
	domainsRegister: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(
					z
						.object({
							name: z.string().describe('Domain name to register'),
							registration_years: z
								.number()
								.int()
								.min(1)
								.max(10)
								.describe('Number of years to register domain'),
						})
						.strict(),
				)
				.min(1)
				.describe('List of domains to register'),
			domain_forwarding_url: z
				.string()
				.optional()
				.describe('URL for domain forwarding'),
			dmarc_email: z.string().optional().describe('Email for DMARC policy'),
			enable_mask_forwarding: z
				.boolean()
				.optional()
				.describe('Enable masked forwarding. Default false.'),
			captcha_enabled: z
				.boolean()
				.optional()
				.describe(
					'Show visitors a captcha before they are redirected to domain_forwarding_url. Requires domain_forwarding_url. Cannot be used together with enable_mask_forwarding. Default false.',
				),
			catch_all_email: z
				.string()
				.optional()
				.describe('Catch-all email address'),
			use_wallet_balance: z
				.boolean()
				.optional()
				.describe(
					'Use wallet balance for payment instead of Stripe. Default false.',
				),
			contact_details: z
				.object({
					first_name: z.string().describe('First Name'),
					last_name: z.string().describe('Last Name'),
					email: z.string().describe('Email'),
					phone: z.string().optional().describe('Phone'),
					organization: z.string().optional().describe('Organisation'),
					address_line1: z.string().describe('Address Line 1'),
					address_line2: z.string().optional().describe('Address Line 2'),
					city: z.string().describe('City'),
					state: z.string().describe('State'),
					country: z.string().describe('Country'),
					postal_code: z.string().describe('Postal/ZIP'),
				})
				.strict()
				.describe('Contact details for domain registration'),
		})
		.strict(),
	domainsRemove: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(z.string())
				.describe(
					'Array of domain names to schedule for deletion. Domain names are converted to lowercase internally.',
				),
			uids: z
				.array(z.string())
				.optional()
				.describe('Array of domain UIDs to schedule for deletion.'),
		})
		.strict(),
	domainsSetForwarding: z
		.object({
			workspaceId: WorkspaceId,
			uids: z.array(z.string()).describe('List of domain UIDs'),
			forwarding_url: z
				.string()
				.optional()
				.describe(
					'Target URL for forwarding. Use empty string "" to remove existing forwarding. Removing forwarding also turns the captcha off.',
				),
			captcha_enabled: z
				.boolean()
				.optional()
				.describe(
					"Set to true to show visitors a captcha before they are redirected to forwarding_url, or false to remove it. Leave it out to keep each domain's current setting.",
				),
		})
		.strict(),
	domainsSetCatchAll: z
		.object({
			workspaceId: WorkspaceId,
			uids: z.array(z.string()).describe('List of domain UIDs'),
			email: z.string().describe('Catch-all email address'),
		})
		.strict(),
	domainsRemoveCatchAll: z
		.object({
			workspaceId: WorkspaceId,
			uids: z.array(z.string()).describe('List of domain UIDs'),
		})
		.strict(),
	domainsSetDmarc: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.optional()
				.describe(
					"Array of domain UIDs to update (PREFERRED). Either 'uids' or 'domains' must be provided.",
				),
			domains: z
				.array(z.string())
				.min(1)
				.optional()
				.describe(
					"Array of domain names (e.g., ['example.com', 'test.org']). Use 'uids' instead when possible for better performance.",
				),
			reportingEmail: z
				.string()
				.describe(
					'Email for aggregate reports (rua) - REQUIRED. This is where DMARC aggregate reports will be sent.',
				),
			policy: z
				.enum(['none', 'quarantine', 'reject'])
				.optional()
				.describe(
					"DMARC policy - REQUIRED. Specifies how to handle emails that fail DMARC checks. Defaults to 'reject'.",
				),
			email: z
				.string()
				.optional()
				.describe(
					'Alternative field for reportingEmail. If both provided, reportingEmail takes precedence.',
				),
			subdomainPolicy: z
				.enum(['none', 'quarantine', 'reject'])
				.optional()
				.describe(
					'DMARC subdomain policy (optional). If not provided, subdomains inherit the main policy.',
				),
			percentage: z
				.number()
				.int()
				.min(0)
				.max(100)
				.optional()
				.describe(
					'Percentage of messages to apply DMARC policy to (optional, 0-100). Useful for gradual rollout.',
				),
			forensicEmail: z
				.string()
				.optional()
				.describe(
					'Email for forensic/failure reports (ruf) (optional). Receives detailed reports of individual message failures.',
				),
			reportingInterval: z
				.number()
				.int()
				.optional()
				.describe(
					'Reporting interval in seconds (optional). How often aggregate reports are sent (default: 604800 = 7 days).',
				),
			forensicOptions: z
				.string()
				.optional()
				.describe(
					'Forensic reporting options (fo tag) (optional). 0=default, 1=any failure, d=DKIM failure, s=SPF failure',
				),
			spfAlignment: z
				.enum(['r', 's'])
				.optional()
				.describe(
					"SPF alignment mode (optional). 'r'=relaxed (subdomains allowed), 's'=strict (exact match required).",
				),
			dkimAlignment: z
				.enum(['r', 's'])
				.optional()
				.describe(
					"DKIM alignment mode (optional). 'r'=relaxed (subdomains allowed), 's'=strict (exact match required).",
				),
		})
		.strict(),
	domainsRemoveDmarc: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.optional()
				.describe(
					"Array of domain UIDs to reset to default DMARC (PREFERRED). Either 'uids' or 'domains' must be provided.",
				),
			domains: z
				.array(z.string())
				.min(1)
				.optional()
				.describe(
					"Array of domain names (e.g., ['example.com', 'test.org']). Use 'uids' instead when possible for better performance.",
				),
		})
		.strict(),
	domainsConnect: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(z.string())
				.describe('Domain names to connect, for example `example.com`.'),
			mask_forwarding: z
				.boolean()
				.optional()
				.describe(
					'Deprecated and ignored. Connected domains are not masked by this call. Turn masking on for the domain after it is connected.',
				),
		})
		.strict(),
	domainsCheckPropagation: z
		.object({
			workspaceId: WorkspaceId,
			domains: z.array(z.string()).describe('List of domains to check'),
		})
		.strict(),
	domainsRegenerateNameservers: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					"Array of domain UIDs to regenerate nameservers for. Maximum 50 items. Either 'uids' or 'domains' must be provided.",
				),
			domains: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					"Array of domain names to regenerate nameservers for. Maximum 50 items. Either 'uids' or 'domains' must be provided.",
				),
		})
		.strict(),
	domainsUpdatePrivacy: z
		.object({
			workspaceId: WorkspaceId,
			uid: z
				.string()
				.describe(
					'Unique identifier of the domain to update. The domain must be active, registered through InboxKit and belong to the workspace in X-Workspace-Id.',
				),
			enable: z
				.boolean()
				.describe('true to turn privacy protection on, false to turn it off.'),
			reason: z
				.string()
				.optional()
				.describe(
					"Optional note stored alongside the change in the domain's change history.",
				),
		})
		.strict(),
	domainsUpdateContacts: z
		.object({
			workspaceId: WorkspaceId,
			uid: z
				.string()
				.describe(
					'Unique identifier of the domain to update. The domain must be active, registered through InboxKit and belong to the workspace in X-Workspace-Id.',
				),
			contact_details: z
				.object({
					first_name: z.string().describe("Contact's first name."),
					last_name: z.string().describe("Contact's last name."),
					phone: z
						.string()
						.describe(
							'Phone number in international format, country code first.',
						),
					organization: z
						.string()
						.optional()
						.describe(
							'Company or organization name. Optional — omit for an individual.',
						),
					address_line1: z.string().describe('Street address, line 1.'),
					address_line2: z
						.string()
						.optional()
						.describe('Street address, line 2. Optional.'),
					city: z.string().describe('City.'),
					state: z.string().describe('State, province or region.'),
					country: z.string().describe('Two-letter ISO 3166-1 country code.'),
					postal_code: z.string().describe('Postal or ZIP code.'),
				})
				.strict()
				.describe(
					'The contact details to apply. They are used for all four contact roles on the domain: registrant, administrative, technical and billing. An `email` field is not accepted — see the endpoint description.',
				),
		})
		.strict(),
	domainsRequestRenewal: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.array(z.string())
				.max(50)
				.optional()
				.describe(
					"Array of domain names to request renewal for. At least one of 'domains' or 'uids' must be provided. Max 50 items. Automatically lowercased.",
				),
			uids: z
				.array(z.string())
				.max(50)
				.optional()
				.describe(
					"Array of domain UIDs to request renewal for. At least one of 'domains' or 'uids' must be provided. Max 50 items.",
				),
		})
		.strict(),
	domainsGetRenewalStatus: z
		.object({
			workspaceId: WorkspaceId,
			domains: z
				.string()
				.optional()
				.describe(
					'Comma-separated list of domain names to filter (e.g., example.com,mydomain.io).',
				),
			uids: z
				.string()
				.optional()
				.describe('Comma-separated list of domain UIDs to filter.'),
			status: z
				.string()
				.optional()
				.describe(
					'Filter by renewal status. Allowed values: not_eligible, due_soon, overdue, expired, processing, completed, failed.',
				),
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number (default: 1).'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(200)
				.optional()
				.describe('Items per page (default: 50, max: 200).'),
		})
		.strict(),
	domainsMoveWorkspace: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					'UIDs of the domains to move. Get them from List domains. Send `uids`, `domains`, or both.',
				),
			domains: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					'Names of the domains to move, for example `example-outreach.com`. Send `uids`, `domains`, or both.',
				),
			target_workspace_uid: z
				.string()
				.describe(
					'UID of the workspace to move the domains into. It must be another active workspace in your team.',
				),
		})
		.strict(),
	domainsPreviewMove: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					'UIDs of the domains to check. Get them from List domains. Send `uids`, `domains`, or both.',
				),
			domains: z
				.array(z.string())
				.min(1)
				.max(50)
				.optional()
				.describe(
					'Names of the domains to check, for example `example-outreach.com`. Send `uids`, `domains`, or both.',
				),
			target_workspace_uid: z
				.string()
				.describe(
					'UID of the workspace to move the domains into. It must be another active workspace in your team.',
				),
		})
		.strict(),
	domainsGetMoveStatus: z
		.object({
			move_id: z
				.string()
				.min(1)
				.describe(
					'The `move_id` returned by Move domains to another workspace.',
				),
		})
		.strict(),
	domainsRotate: z
		.object({
			workspaceId: WorkspaceId,
			domain_uid: z
				.string()
				.optional()
				.describe(
					'UID of the domain whose mailboxes move. Get it from List domains. Send this or `domain`.',
				),
			domain: z
				.string()
				.optional()
				.describe(
					'Name of the domain whose mailboxes move, for example `example-outreach.com`. Send this or `domain_uid`.',
				),
			target_domain_uid: z
				.string()
				.optional()
				.describe(
					'UID of the replacement domain. Send this or `target_domain`.',
				),
			target_domain: z
				.string()
				.optional()
				.describe(
					'Name of the replacement domain. It must be an active domain in the same workspace with no mailboxes. Send this or `target_domain_uid`.',
				),
		})
		.strict(),
	domainsPreviewRotation: z
		.object({
			workspaceId: WorkspaceId,
			domain_uid: z
				.string()
				.optional()
				.describe(
					'UID of the domain whose mailboxes move. Get it from List domains. Send this or `domain`.',
				),
			domain: z
				.string()
				.optional()
				.describe(
					'Name of the domain whose mailboxes move, for example `example-outreach.com`. Send this or `domain_uid`.',
				),
			target_domain_uid: z
				.string()
				.optional()
				.describe(
					'UID of the replacement domain. Send this or `target_domain`.',
				),
			target_domain: z
				.string()
				.optional()
				.describe(
					'Name of the replacement domain. It must be an active domain in the same workspace with no mailboxes. Send this or `target_domain_uid`.',
				),
		})
		.strict(),
	domainsGetRotationStatus: z
		.object({
			rotation_id: z
				.string()
				.min(1)
				.describe('The `rotation_id` returned by Start a domain rotation.'),
		})
		.strict(),
} as const;

export const DomainsOutputSchemas = {
	domainsList: z
		.object({
			error: bool,
			message: str,
			domains: z
				.array(
					z
						.object({
							name: str,
							status: str,
							registration_years: num,
							created_at: str,
							uid: str,
							tld: str,
							price: numeric,
							renewal_date: str,
							whois_privacy: bool,
							forwarding_url: str,
							forwarding_email: str,
							enable_mask_forwarding: bool,
							captcha_enabled: bool,
							dmarc_email: str,
							catch_all_email: str,
							nameservers: z.array(str).nullish(),
							assigned_mailboxes: numeric,
							available_mailboxes: str,
							cf_zone_id: str,
							tags: z.array(str).nullish(),
							payment_type: str,
							connection_type: str,
							nameserver_match_status: str,
							actual_nameservers: z.array(str).nullish(),
							last_nameserver_check: str,
							createdAt: str,
							updatedAt: str,
							registration_date: str,
							dns_propagation_status: str,
							renewal_cycle: str,
							renewal_status: str,
							dns: z
								.object({
									records: z.array(obj).nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish(),
			total: num.describe('Total number of domains'),
			pages: num.describe('Total number of pages'),
			current_page: num.describe('Current page number'),
			limit: num.describe('Items per page'),
			status_counts: z
				.object({
					active: num.describe('Domains that are fully active and operational'),
					pending: num.describe('Domains pending setup or verification'),
					not_connected: num.describe(
						'Domains not yet connected - nameservers need to be configured at registrar',
					),
					expired_propagation: num.describe(
						'Domains where DNS propagation timed out - ACTION REQUIRED: regenerate nameservers',
					),
					waiting_for_dns_propagation: num.describe(
						'Domains waiting for DNS changes to propagate',
					),
					cancelled: num.describe('Cancelled domains'),
					inactive: num.describe('Inactive domains'),
				})
				.loose()
				.nullish()
				.describe(
					'Count of domains grouped by their status. Use this to display status distribution in your UI.',
				),
			nameserver_status_counts: z
				.object({
					matched: num.describe(
						'Domains with correctly configured nameservers - healthy, no action needed',
					),
					moved: num.describe(
						'Domains where nameservers changed at registrar - REQUIRES ACTION: call POST /v1/api/domains/nameservers/regenerate to fix',
					),
					pending: num.describe(
						'Domains awaiting nameserver verification - check back later',
					),
					unknown: num.describe(
						'Domains with unknown nameserver status - may need manual investigation',
					),
				})
				.loose()
				.nullish()
				.describe(
					"Count of domains by nameserver match status. Use this to show users how many domains need attention and to display alerts for 'moved' domains.",
				),
		})
		.loose(),
	domainsListAssignable: z
		.object({
			error: bool,
			message: str,
			domains: z
				.array(
					z
						.object({
							_id: str,
							name: str,
							assigned_mailboxes: num,
							uid: str,
							tld: str,
							status: str,
						})
						.loose(),
				)
				.nullish(),
			total: num.describe('Total number of domains'),
			pages: num.describe('Total number of pages'),
			current_page: numeric.describe('Current page number'),
			limit: numeric.describe('Items per page'),
		})
		.loose(),
	domainsCheckAvailability: z
		.object({
			error: bool,
			message: str,
			available: bool.describe('Whether domain is available'),
			banned: bool.describe('Whether domain is banned'),
			registration_price: num.describe('Registration price if available'),
			renewal_price: num.describe('Renewal price if available'),
		})
		.loose(),
	domainsCheckBanned: z
		.object({
			error: bool,
			message: str,
			banned: bool.describe('Whether domain is banned'),
		})
		.loose(),
	domainsSearch: z
		.object({
			error: bool,
			message: str,
			domains: z
				.array(
					z
						.object({
							name: str,
							price: num,
							available: bool,
							is_premium: bool,
							banned: bool,
							google_workspace_available: bool,
							ms365_workspace_available: bool,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	domainsCheckWorkspaceAvailability: z
		.object({
			ok: bool.describe('Indicates if the request was successful'),
			result: z
				.array(
					z
						.object({
							domain: str,
							google_workspace_available: bool,
							ms365_workspace_available: bool,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of workspace availability results for each domain'),
		})
		.loose(),
	domainsRegister: looseResult,
	domainsRemove: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Response message'),
			result: z
				.object({
					updated: z
						.array(
							z
								.object({
									name: str,
									uid: str,
									previous_status: str,
									new_status: str,
								})
								.loose(),
						)
						.nullish(),
					deleted: z
						.array(
							z
								.object({
									name: str,
									uid: str,
									previous_status: str,
									new_status: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsSetForwarding: z
		.object({
			error: bool,
			message: str,
			domains: z
				.array(
					z
						.object({
							_id: str,
							name: str,
							uid: str,
							captcha_enabled: bool,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	domainsSetCatchAll: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	domainsRemoveCatchAll: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	domainsSetDmarc: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			domains: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							tld: str,
							status: str,
							dmarc_email: str,
							dns_propagation_status: str,
							createdAt: str,
							updatedAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of updated domain objects'),
			dmarcConfig: z
				.object({
					policy: str,
					subdomainPolicy: str,
					percentage: num,
					reportingEmail: str,
					forensicEmail: str,
					reportingInterval: num,
					spfAlignment: str,
					dkimAlignment: str,
					forensicOptions: str,
				})
				.loose()
				.nullish()
				.describe('Applied DMARC configuration'),
		})
		.loose(),
	domainsRemoveDmarc: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			domains: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							tld: str,
							status: str,
							dmarc_email: str,
							dns_propagation_status: str,
							createdAt: str,
							updatedAt: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of updated domain objects'),
		})
		.loose(),
	domainsConnect: z
		.object({
			error: bool.describe('`false` when the request worked.'),
			message: str.describe('Result of the request.'),
			result: z
				.array(
					z
						.object({
							domain: str,
							nameservers: z.array(str).nullish(),
							uid: str,
						})
						.loose(),
				)
				.nullish()
				.describe('One entry for each connected domain.'),
		})
		.loose(),
	domainsCheckPropagation: z
		.object({
			error: bool.describe('Indicates if there was an error in the request'),
			message: str.describe('A message describing the result of the request'),
			result: z
				.array(
					z
						.object({
							_id: str,
							uid: str,
							name: str,
							status: str,
							createdAt: str,
							updatedAt: str,
							propagated: bool,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of domain propagation results'),
		})
		.loose(),
	domainsRegenerateNameservers: z
		.object({
			error: bool.describe('Indicates if an error occurred'),
			message: str.describe('Human-readable response message'),
			count: num.describe('Total number of domains successfully processed'),
			expired_propagation_count: num.describe(
				'Number of domains regenerated due to expired_propagation status',
			),
			moved_nameservers_count: num.describe(
				"Number of domains regenerated due to moved nameservers (nameserver_match_status='moved')",
			),
			result: z
				.array(
					z
						.object({
							name: str,
							uid: str,
							status: str,
							nameservers: z.array(str).nullish(),
							cf_zone_id: str,
							dns_propagation_status: str,
							nameservers_propagation_status: str,
							nameserver_match_status: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Array of updated domain objects with new Cloudflare nameservers',
				),
		})
		.loose(),
	domainsUpdatePrivacy: z
		.object({
			error: bool.describe('Always false on success.'),
			message: str.describe(
				'Human-readable outcome, suitable for showing to an end user.',
			),
			data: z
				.object({
					domain: str.describe(
						'Fully qualified domain name the change was applied to.',
					),
					whois_privacy: bool.describe(
						'Privacy protection state after the request.',
					),
					status: str.describe(
						'Outcome of the request. `updated` — privacy protection was changed. `no_change` — the domain was already in the requested state, so nothing was changed.',
					),
				})
				.loose()
				.nullish()
				.describe('Outcome of the change.'),
		})
		.loose(),
	domainsUpdateContacts: z
		.object({
			error: bool.describe('Always false on success.'),
			message: str.describe(
				'Human-readable outcome, suitable for showing to an end user. Reflects whether the change was applied, was already in place, or is awaiting approval.',
			),
			data: z
				.object({
					domain: str.describe(
						'Fully qualified domain name the change was applied to.',
					),
					status: str.describe(
						'Outcome of the request. `updated` — the new details are in effect. `no_change` — the details already matched, so nothing was changed.',
					),
				})
				.loose()
				.nullish()
				.describe('Outcome of the change.'),
		})
		.loose(),
	domainsRequestRenewal: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					results: z
						.array(
							z
								.object({
									domain_name: str,
									success: bool,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
					total_requested: num,
					total_failed: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsGetRenewalStatus: z
		.object({
			error: bool,
			data: z
				.object({
					renewals: z
						.array(
							z
								.object({
									uid: str,
									domain_name: str,
									tld: str,
									renewal_status: str,
									renewal_date: str,
									days_until_renewal: num,
									grace_period_days_remaining: num,
									is_eligible_for_renewal: bool,
									eligibility_reason: str,
									renewal_requested: bool,
									renewal_requested_at: str,
									renewal_price: num,
									active_mailboxes: num,
									total_mailboxes: num,
									registration_date: str,
									connection_type: str,
								})
								.loose(),
						)
						.nullish(),
					pagination: z
						.object({
							page: num,
							limit: num,
							total: num,
							totalPages: num,
						})
						.loose()
						.nullish(),
					summary: z
						.object({
							total: num,
							total_eligible: num,
							total_due_soon: num,
							total_overdue: num,
							total_already_requested: num,
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsMoveWorkspace: z
		.object({
			error: bool.describe(
				'`false` when the domains are in the target workspace.',
			),
			message: str.describe('Result of the request.'),
			result: z
				.object({
					move_id: str.describe(
						'ID of this move. Use it with Get domain move status. `null` when nothing needed to move.',
					),
					status: str.describe(
						'`processing` when domains were moved. `completed` when nothing needed to move.',
					),
					source_workspace: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The workspace the domains were in.'),
					target_workspace: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The workspace the domains are in now.'),
					summary: z
						.object({
							total: num,
							moved: num,
							already_in_target: num,
							mailboxes: num,
						})
						.loose()
						.nullish(),
					domains: z
						.array(
							z
								.object({
									domain: str,
									uid: str,
									result: str,
									mailbox_count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'One entry per domain you sent, in the same order as Preview a domain move.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsPreviewMove: z
		.object({
			error: bool.describe('`false` when the check ran.'),
			message: str.describe('How many of the domains you sent can be moved.'),
			result: z
				.object({
					can_move: bool.describe(
						'`true` when every domain you sent can move now, or is already in the target workspace.',
					),
					source_workspace: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The workspace the domains are in now.'),
					target_workspace: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The workspace the domains would move into.'),
					summary: z
						.object({
							total: num,
							movable: num,
							blocked: num,
							already_in_target: num,
							mailboxes: num,
						})
						.loose()
						.nullish(),
					domains: z
						.array(
							z
								.object({
									domain: str,
									uid: str,
									mailbox_count: num,
									can_move: bool,
									already_in_target: bool,
									error_category: str,
									message: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'One entry per domain you sent: first the domains sent in `uids`, then those sent in `domains`, each in the order you sent them.',
						),
					sequencers: z
						.array(
							z
								.object({
									name: str,
									platform: str,
									action: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Sequencer connections used by the mailboxes that would move.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsGetMoveStatus: z
		.object({
			error: bool.describe('`false` when the move was found.'),
			result: z
				.object({
					move_id: str.describe('ID of the move.'),
					status: str.describe(
						'`processing`, `completed` or `reverted`. See the table above.',
					),
					domain_count: num.describe('Domains in this move.'),
					mailbox_count: num.describe('Mailboxes moved with them.'),
					started_at: str.describe('When the move started.'),
					completed_at: str.describe(
						'When the move finished. `null` while it is still processing.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsRotate: z
		.object({
			error: bool.describe('`false` when the rotation has started.'),
			message: str.describe('Result of the request.'),
			result: z
				.object({
					rotation_id: str.describe(
						'ID of this rotation. Use it with Get domain rotation status.',
					),
					status: str.describe(
						'Where the rotation is now. `queued` for a new rotation. A repeated request can also return `preparing` or `rotating`. See Get domain rotation status.',
					),
					already_started: bool.describe(
						'`true` when this exact rotation was already running, so no new one was started and you get the existing `rotation_id`.',
					),
					domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The domain whose mailboxes are moving.'),
					target_domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The replacement domain.'),
					mailbox_count: num.describe('Number of mailboxes in this rotation.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsPreviewRotation: z
		.object({
			error: bool.describe('`false` when the check ran.'),
			message: str.describe('Whether the rotation can start now.'),
			result: z
				.object({
					can_rotate: bool.describe('`true` when the rotation can start now.'),
					domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The domain whose mailboxes would move.'),
					target_domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The replacement domain.'),
					provider: str.describe('Provider of the mailboxes on the domain.'),
					mailbox_count: num.describe('Number of mailboxes that would move.'),
					mailboxes: z
						.array(
							z
								.object({
									uid: str,
									from_email: str,
									to_email: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Every mailbox that would move, with its current and new address.',
						),
					blockers: z
						.array(
							z
								.object({
									code: str,
									domain: str,
									message: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Why the rotation cannot start now. Empty when `can_rotate` is `true`. A reason that applies to both domains is listed once for each domain.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	domainsGetRotationStatus: z
		.object({
			error: bool.describe('`false` when the rotation was found.'),
			result: z
				.object({
					rotation_id: str.describe('ID of the rotation.'),
					status: str.describe('Where the rotation is. See the table above.'),
					domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The domain whose mailboxes are moving.'),
					target_domain: z
						.object({
							uid: str,
							name: str,
						})
						.loose()
						.nullish()
						.describe('The replacement domain.'),
					provider: str.describe('Provider of the mailboxes.'),
					mailbox_count: num.describe('Number of mailboxes in this rotation.'),
					mailboxes_renamed: num.describe('Mailboxes moved so far.'),
					mailboxes_failed: num.describe('Mailboxes that could not be moved.'),
					mailboxes: z
						.array(
							z
								.object({
									uid: str,
									old_email: str,
									new_email: str,
									status: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Each mailbox in the rotation, with its old and new address. Use the new addresses to reconnect your sending tools.',
						),
					failure_reason: str.describe(
						'Returned when `status` is `failed` or `partially_completed`. `null` otherwise.',
					),
					started_at: str.describe('When the rotation was started.'),
					updated_at: str.describe('When the rotation last changed.'),
					completed_at: str.describe(
						'When the rotation ended. `null` while it is still running.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;

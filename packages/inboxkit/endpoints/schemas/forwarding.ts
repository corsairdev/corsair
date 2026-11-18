import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const ForwardingInputSchemas = {
	forwardingGetCapabilities: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	forwardingSetup: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe('Array of mailbox UIDs (Google, Microsoft or Azure)'),
			forwarding_email: z
				.string()
				.describe('Email address to forward messages to'),
		})
		.strict(),
	forwardingSetupAdvanced: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe(
					'Array of mailbox UIDs (Google, Microsoft or Azure), up to 500',
				),
			forwarding_email: z
				.string()
				.describe('Email address to forward messages to'),
			mode: z.enum(['advanced']).describe('Must be "advanced"'),
			match: z
				.enum(['all', 'any'])
				.optional()
				.describe(
					'Advanced only. all: every condition must match. any: at least one must match. Default "all".',
				),
			conditions: z
				.array(
					z
						.object({
							location: z
								.enum([
									'subject',
									'body',
									'sender',
									'recipients_header',
									'envelope_sender',
									'header',
									'full_headers',
									'message_type',
								])
								.describe(
									'Where to look in the message. Use header_name with "header". Some places work on one platform only; Get Forwarding Capabilities shows which.',
								),
							header_name: z
								.string()
								.optional()
								.describe('Only with location "header": the header to check.'),
							match: z
								.enum([
									'regex',
									'not_regex',
									'contains',
									'not_contains',
									'equals',
									'not_equals',
								])
								.describe(
									'How to compare. The not_ options skip messages that match.',
								),
							value: z
								.string()
								.min(1)
								.max(1000)
								.describe(
									'The text to look for, or a regular expression when match is regex or not_regex. Upper and lower case are treated the same.',
								),
						})
						.strict(),
				)
				.min(1)
				.describe('What a message must match to be forwarded'),
		})
		.strict(),
	forwardingUpdate: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe('Array of mailbox UIDs (Google, Microsoft or Azure)'),
			forwarding_email: z
				.string()
				.describe('New email address to forward messages to'),
		})
		.strict(),
	forwardingRemove: z
		.object({
			workspaceId: WorkspaceId,
			uids: z
				.array(z.string())
				.describe('Array of mailbox UIDs to remove forwarding from'),
		})
		.strict(),
	forwardingListJobs: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Page number (defaults to 1)'),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Number of items per page (defaults to 10, max 100)'),
			mailbox_uid: z
				.string()
				.optional()
				.describe('Filter jobs by a specific mailbox UID'),
			status: z
				.enum([
					'pending',
					'queued',
					'processing',
					'completed',
					'failed',
					'retrying',
					'cancelled',
					'switching',
				])
				.optional()
				.describe(
					'Filter jobs by status. "switching" means the new setup is working and the old one is being removed.',
				),
			action: z
				.enum(['enable', 'disable', 'update'])
				.optional()
				.describe('Filter jobs by action type'),
			mode: z
				.enum(['off', 'simple', 'advanced'])
				.optional()
				.describe('Filter jobs by requested mode'),
			rule: z.string().optional().describe('Filter jobs by rule UID'),
		})
		.strict(),
	forwardingListRules: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().optional().describe('Page number (defaults to 1)'),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Number of items per page (defaults to 25, max 100)'),
		})
		.strict(),
	forwardingGetRule: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Rule UID'),
		})
		.strict(),
	forwardingUpdateRule: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Rule UID'),
			forwarding_email: z
				.string()
				.optional()
				.describe('New address to forward to'),
			match: z
				.enum(['all', 'any'])
				.optional()
				.describe(
					'all: every condition must match. any: at least one must match.',
				),
			conditions: z
				.array(
					z
						.object({
							location: z
								.enum([
									'subject',
									'body',
									'sender',
									'recipients_header',
									'envelope_sender',
									'header',
									'full_headers',
									'message_type',
								])
								.describe(
									'Where to look in the message. Use header_name with "header". Some places work on one platform only; Get Forwarding Capabilities shows which.',
								),
							header_name: z
								.string()
								.optional()
								.describe('Only with location "header": the header to check.'),
							match: z
								.enum([
									'regex',
									'not_regex',
									'contains',
									'not_contains',
									'equals',
									'not_equals',
								])
								.describe(
									'How to compare. The not_ options skip messages that match.',
								),
							value: z
								.string()
								.min(1)
								.max(1000)
								.describe(
									'The text to look for, or a regular expression when match is regex or not_regex. Upper and lower case are treated the same.',
								),
						})
						.strict(),
				)
				.min(1)
				.optional()
				.describe("Replaces all the rule's conditions"),
			uids: z
				.array(z.string())
				.min(1)
				.optional()
				.describe(
					'The full list of mailbox UIDs for this rule (same Google domain or Microsoft account)',
				),
		})
		.strict(),
	forwardingDeleteRule: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Rule UID'),
		})
		.strict(),
} as const;

export const ForwardingOutputSchemas = {
	forwardingGetCapabilities: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			data: z
				.object({
					modes: z.array(str).nullish(),
					matches: z.array(str).nullish(),
					limits: z
						.object({
							max_mailboxes_per_request: num,
						})
						.loose()
						.nullish(),
					platforms: z
						.object({
							GOOGLE: z
								.object({
									platforms: z.array(str).nullish(),
									locations: obj,
									notes: obj,
									limits: z
										.object({
											max_conditions: num,
											max_value_length: num,
											max_regex_length: num,
											max_rules_per_domain: num,
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
							MICROSOFT: z
								.object({
									platforms: z.array(str).nullish(),
									locations: obj,
									notes: obj,
									limits: z
										.object({
											max_conditions: num,
											max_value_length: num,
											max_pattern_length: num,
											max_mailboxes_per_rule: num,
											max_rules_per_tenant: num,
										})
										.loose()
										.nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	forwardingSetup: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			jobs: z
				.array(
					z
						.object({
							mailbox_uid: str,
							forwarding_email: str,
							action: str,
							status: str,
							mode: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of forwarding job objects'),
		})
		.loose(),
	forwardingSetupAdvanced: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			jobs: z
				.array(
					z
						.object({
							mailbox_uid: str,
							forwarding_email: str,
							action: str,
							status: str,
							mode: str,
							rule: str,
							replaces: z
								.object({
									mode: str,
									forwarding_email: str,
									rule: str,
								})
								.loose()
								.nullish(),
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of forwarding job objects'),
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							mode: str,
							rule: str,
							status: str,
							replaces: z
								.object({
									mode: str,
									forwarding_email: str,
									rule: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('One entry per mailbox, with the mode it was set to'),
			rules: z
				.array(
					z
						.object({
							uid: str,
							platform: str,
							scope: str,
							match: str,
							conditions: z
								.array(
									z
										.object({
											location: str,
											header_name: str,
											match: str,
											value: str,
										})
										.loose(),
								)
								.nullish(),
							forwarding_email: str,
							mailboxes: z
								.array(
									z
										.object({
											uid: str,
											email: str,
										})
										.loose(),
								)
								.nullish(),
							status: str,
							last_error: str,
							applied_at: str,
							created_at: str,
							updated_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe(
					'Advanced only: the rules created. Mailboxes are grouped into one rule per Google domain or Microsoft account.',
				),
		})
		.loose(),
	forwardingUpdate: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			jobs: z
				.array(
					z
						.object({
							mailbox_uid: str,
							forwarding_email: str,
							action: str,
							status: str,
							mode: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of forwarding job objects'),
		})
		.loose(),
	forwardingRemove: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			jobs: z
				.array(
					z
						.object({
							mailbox_uid: str,
							action: str,
							status: str,
							mode: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of forwarding job objects'),
		})
		.loose(),
	forwardingListJobs: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			jobs: z
				.array(
					z
						.object({
							mailbox_uid: str,
							mailbox_email: str,
							forwarding_email: str,
							action: str,
							status: str,
							status_message: str,
							error_message: str,
							attempts: num,
							max_attempts: num,
							created_at: str,
							updated_at: str,
							completed_at: str,
							last_attempt_at: str,
							next_retry_at: str,
							mode: str,
							rule: str,
							cutover_after: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of forwarding job objects with full details'),
			pagination: z
				.object({
					page: num.describe('Current page number'),
					limit: num.describe('Number of items per page'),
					total: num.describe('Total number of matching jobs'),
					pages: num.describe('Total number of pages'),
				})
				.loose()
				.nullish()
				.describe('Pagination details'),
		})
		.loose(),
	forwardingListRules: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			rules: z
				.array(
					z
						.object({
							uid: str,
							platform: str,
							scope: str,
							match: str,
							conditions: z
								.array(
									z
										.object({
											location: str,
											header_name: str,
											match: str,
											value: str,
										})
										.loose(),
								)
								.nullish(),
							forwarding_email: str,
							mailboxes: z
								.array(
									z
										.object({
											uid: str,
											email: str,
										})
										.loose(),
								)
								.nullish(),
							status: str,
							last_error: str,
							applied_at: str,
							created_at: str,
							updated_at: str,
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
		.loose(),
	forwardingGetRule: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			rule: z
				.object({
					uid: str.describe('Rule UID'),
					platform: str,
					scope: str.describe(
						'Mailboxes are grouped into one rule per Google domain or Microsoft account.',
					),
					match: str.describe(
						'all: every condition must match. any: at least one must match.',
					),
					conditions: z
						.array(
							z
								.object({
									location: str,
									header_name: str,
									match: str,
									value: str,
								})
								.loose(),
						)
						.nullish(),
					forwarding_email: str,
					mailboxes: z
						.array(
							z
								.object({
									uid: str,
									email: str,
								})
								.loose(),
						)
						.nullish(),
					status: str.describe(
						'pending: being set up. active: working. failed: could not be set up, see last_error.',
					),
					last_error: str.describe(
						'Why the rule could not be set up (empty otherwise)',
					),
					applied_at: str,
					created_at: str,
					updated_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	forwardingUpdateRule: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			rule: z
				.object({
					uid: str.describe('Rule UID'),
					platform: str,
					scope: str.describe(
						'Mailboxes are grouped into one rule per Google domain or Microsoft account.',
					),
					match: str.describe(
						'all: every condition must match. any: at least one must match.',
					),
					conditions: z
						.array(
							z
								.object({
									location: str,
									header_name: str,
									match: str,
									value: str,
								})
								.loose(),
						)
						.nullish(),
					forwarding_email: str,
					mailboxes: z
						.array(
							z
								.object({
									uid: str,
									email: str,
								})
								.loose(),
						)
						.nullish(),
					status: str.describe(
						'pending: being set up. active: working. failed: could not be set up, see last_error.',
					),
					last_error: str.describe(
						'Why the rule could not be set up (empty otherwise)',
					),
					applied_at: str,
					created_at: str,
					updated_at: str,
				})
				.loose()
				.nullish(),
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							mode: str,
							rule: str,
							status: str,
							replaces: z
								.object({
									mode: str,
									forwarding_email: str,
									rule: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	forwardingDeleteRule: z
		.object({
			error: bool.describe('Indicates if there was an error'),
			message: str.describe('Human-readable response message'),
			rule: z
				.object({
					uid: str,
					status: str,
				})
				.loose()
				.nullish(),
			mailboxes: z
				.array(
					z
						.object({
							uid: str,
							mode: str,
							rule: str,
							status: str,
							replaces: z
								.object({
									mode: str,
									forwarding_email: str,
									rule: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
} as const;

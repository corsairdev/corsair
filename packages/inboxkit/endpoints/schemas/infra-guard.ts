import { z } from 'zod';
import { bool, list, num, obj, str, WorkspaceId } from '../schema-helpers';

export const InfraGuardInputSchemas = {
	infraGuardList: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.min(1)
				.optional()
				.describe('Page number. Default 1.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Items per page. Default 10.'),
			status: z
				.enum([
					'active',
					'pending_activation',
					'cancelled',
					'past_due',
					'paused',
				])
				.optional()
				.describe('Filter by subscription status'),
			include_cancelled: z
				.boolean()
				.optional()
				.describe('Include cancelled subscriptions in results. Default false.'),
			search: z
				.string()
				.max(255)
				.optional()
				.describe('Search by domain name (partial match, case-insensitive)'),
			health: z
				.enum(['healthy', 'warning', 'critical', 'unknown'])
				.optional()
				.describe('Filter by overall health status'),
		})
		.strict(),
	infraGuardGet: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Domain UID'),
		})
		.strict(),
	infraGuardEnable: z
		.object({
			workspaceId: WorkspaceId,
			domain_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe('Domain UIDs to enable InfraGuard for'),
		})
		.strict(),
	infraGuardCancel: z
		.object({
			workspaceId: WorkspaceId,
			domain_uids: z
				.array(z.string())
				.min(1)
				.max(100)
				.describe('Domain UIDs to cancel InfraGuard for'),
		})
		.strict(),
	infraGuardGetStats: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	infraGuardGetPricing: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	infraGuardGetBlacklistHistory: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Domain UID'),
			page: z.number().int().optional().describe('Page number'),
			limit: z.number().int().optional().describe('Items per page'),
		})
		.strict(),
	infraGuardGetDnsHistory: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Domain UID'),
			page: z.number().int().optional().describe('Page number'),
			limit: z.number().int().optional().describe('Items per page'),
		})
		.strict(),
	infraGuardGetBounceMetrics: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Domain UID'),
			period_days: z
				.number()
				.int()
				.optional()
				.describe('Number of days to analyze'),
		})
		.strict(),
	infraGuardGetBounceHistory: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().describe('Domain UID'),
			page: z.number().int().optional().describe('Page number'),
			limit: z.number().int().optional().describe('Items per page'),
		})
		.strict(),
	infraGuardUpdateSettings: z
		.object({
			workspaceId: WorkspaceId,
			domain_uid: z.string().describe('Domain UID'),
			alert_preferences: z
				.object({
					email_notifications: z
						.boolean()
						.optional()
						.describe('Send alert emails'),
					in_app_notifications: z
						.boolean()
						.optional()
						.describe('Show in-app alert notifications'),
				})
				.strict()
				.optional()
				.describe('Notification settings'),
			bounce_thresholds: z
				.object({
					warning: z
						.number()
						.min(0)
						.max(100)
						.optional()
						.describe('Warning threshold percentage'),
					critical: z
						.number()
						.min(0)
						.max(100)
						.optional()
						.describe('Critical threshold percentage'),
				})
				.strict()
				.optional()
				.describe(
					'Bounce rate alert thresholds (warning must be less than critical)',
				),
			ipt_enabled: z
				.boolean()
				.optional()
				.describe('Enable or disable inbox placement testing'),
			ipt_receiver_types: z
				.array(
					z.enum([
						'personal_gmail',
						'personal_outlook',
						'business_gmail',
						'business_outlook',
					]),
				)
				.min(1)
				.optional()
				.describe('Types of test inboxes to send to'),
			ipt_test_day: z
				.enum([
					'sunday',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday',
				])
				.optional()
				.describe('Day of the week to run IPT tests'),
			ipt_frequency: z
				.enum(['weekly', 'biweekly'])
				.optional()
				.describe('How often to run IPT tests'),
		})
		.strict(),
	infraGuardTriggerCheck: z
		.object({
			workspaceId: WorkspaceId,
			domain_uid: z.string().describe('Domain UID'),
			check_type: z
				.enum(['all', 'blacklist', 'dns', 'bounce'])
				.optional()
				.describe('Type of check to trigger. Default "all".'),
		})
		.strict(),
	infraGuardListAlerts: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().min(1).optional().describe('Default 1.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Default 20.'),
			domain_uid: z.string().optional().describe('Filter alerts by domain UID'),
			status: z
				.enum(['active', 'acknowledged', 'resolved', 'dismissed', 'all'])
				.optional()
				.describe(
					'Filter by status. \'active\' includes both active and acknowledged alerts. Default "active".',
				),
			severity: z
				.enum(['info', 'warning', 'critical'])
				.optional()
				.describe('Filter by severity'),
			alert_type: z
				.enum([
					'blacklist_detected',
					'dns_change_detected',
					'bounce_rate_warning',
					'bounce_rate_critical',
					'bounce_rate_recovered',
					'check_failed',
					'payment_failed',
					'ipt_failed',
					'ipt_low_score',
				])
				.optional()
				.describe('Filter by alert type'),
		})
		.strict(),
	infraGuardAcknowledgeAlert: z
		.object({
			workspaceId: WorkspaceId,
			alert_uid: z.string().describe('Alert UID to acknowledge'),
		})
		.strict(),
	infraGuardResolveAlert: z
		.object({
			workspaceId: WorkspaceId,
			alert_uid: z.string().describe('Alert UID to resolve'),
			note: z
				.string()
				.max(1000)
				.optional()
				.describe('Optional resolution note explaining what was done'),
		})
		.strict(),
	infraGuardListActionItems: z
		.object({
			workspaceId: WorkspaceId,
			page: z.number().int().min(1).optional().describe('Default 1.'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Default 20.'),
			domain_uid: z.string().optional().describe('Filter by domain UID'),
			category: z
				.enum([
					'bounce_rate',
					'inbox_placement',
					'blacklist',
					'dns_health',
					'mailbox',
					'domain',
					'trend',
				])
				.optional()
				.describe('Filter by category'),
			severity: z
				.enum(['critical', 'warning', 'advisory'])
				.optional()
				.describe('Filter by severity'),
			status: z
				.enum(['pending', 'in_progress', 'resolved', 'dismissed', 'all'])
				.optional()
				.describe(
					'Filter by status. \'pending\' includes both pending and in_progress. Default "pending".',
				),
		})
		.strict(),
	infraGuardGetActionItemStats: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	infraGuardResolveActionItem: z
		.object({
			workspaceId: WorkspaceId,
			action_item_uid: z.string().describe('Action item UID to resolve'),
		})
		.strict(),
	infraGuardDismissActionItem: z
		.object({
			workspaceId: WorkspaceId,
			action_item_uid: z.string().describe('Action item UID to dismiss'),
		})
		.strict(),
} as const;

export const InfraGuardOutputSchemas = {
	infraGuardList: z
		.object({
			error: bool,
			message: str,
			subscriptions: z
				.array(
					z
						.object({
							uid: str,
							domain_uid: str,
							domain_name: str,
							status: str,
							blacklist_status: str,
							dns_watchdog_status: str,
							bounce_status: str,
							health_score: num,
							bounce_rate: num,
							bounce_trend: str,
							price_per_month: num,
							started_at: str,
							next_billing_date: str,
							ipt_enabled: bool,
							ipt_frequency: str,
							ipt_test_day: str,
							ipt_next_scheduled_run: str,
							ipt_total_tests_run: num,
							last_blacklist_check: str,
							last_dns_watchdog_check: str,
							last_bounce_check: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardGet: z
		.object({
			error: bool,
			message: str,
			subscription: z
				.object({
					uid: str,
					domain_uid: str,
					domain_name: str,
					status: str,
					blacklist_status: str,
					dns_watchdog_status: str,
					bounce_status: str,
					health_score: num,
					bounce_rate: num,
					bounce_trend: str,
					bounce_thresholds: z
						.object({
							warning: num,
							critical: num,
						})
						.loose()
						.nullish(),
					price_per_month: num,
					next_billing_date: str,
					started_at: str,
					cancelled_at: str,
					alert_preferences: z
						.object({
							email_notifications: bool,
							in_app_notifications: bool,
						})
						.loose()
						.nullish(),
					ipt_enabled: bool,
					ipt_receiver_types: z.array(str).nullish(),
					ipt_test_day: str,
					ipt_frequency: str,
					ipt_next_scheduled_run: str,
					ipt_last_run: str,
					ipt_total_tests_run: num,
					latest_blacklist_check: z
						.object({
							uid: str,
							status: str,
							summary: obj,
							checked_at: str,
						})
						.loose()
						.nullish(),
					latest_dns_check: z
						.object({
							uid: str,
							status: str,
							expected_ns: z.array(str).nullish(),
							actual_ns: z.array(str).nullish(),
							checked_at: str,
						})
						.loose()
						.nullish(),
					latest_bounce_check: z
						.object({
							bounce_rate: num,
							total_emails: num,
							bounced_emails: num,
							status: str,
							trend: str,
							checked_at: str,
						})
						.loose()
						.nullish(),
					domain: z
						.object({
							nameservers: z.array(str).nullish(),
						})
						.loose()
						.nullish(),
					created_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardEnable: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									domain_uid: str,
									subscription_uid: str,
									domain_name: str,
									action: str,
								})
								.loose(),
						)
						.nullish(),
					failed: z
						.array(
							z
								.object({
									domain_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					success_count: num,
					failed_count: num,
					total_cost: num.describe('Total credits deducted'),
					price_per_domain: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardCancel: z
		.object({
			error: bool,
			message: str,
			results: z
				.object({
					success: z
						.array(
							z
								.object({
									domain_uid: str,
									subscription_uid: str,
									domain_name: str,
									action: str,
								})
								.loose(),
						)
						.nullish(),
					failed: z
						.array(
							z
								.object({
									domain_uid: str,
									reason: str,
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
			summary: z
				.object({
					total_requested: num,
					success_count: num,
					failed_count: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardGetStats: z
		.object({
			error: bool,
			message: str,
			stats: z
				.object({
					protected_count: num.describe('Total non-cancelled subscriptions'),
					active_count: num.describe('Active subscriptions'),
					past_due_count: num.describe('Past-due subscriptions'),
					monthly_total: num.describe('Total monthly cost (USD)'),
					healthy_count: num.describe('Domains with healthy blacklist status'),
					warning_count: num.describe('Domains with warning blacklist status'),
					critical_count: num.describe(
						'Domains with critical blacklist status',
					),
					ipt_enabled_count: num.describe(
						'Domains with inbox placement testing enabled',
					),
					total_ipt_tests: num.describe(
						'Total inbox placement tests run across all domains',
					),
					last_check_time: str.describe(
						'Timestamp of the most recent check across all domains',
					),
					active_alerts: num.describe('Number of currently active alerts'),
					price_per_domain: num.describe('Current price per domain per month'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardGetPricing: z
		.object({
			error: bool,
			price_per_domain: num.describe('Price per domain per month'),
			currency: str,
			billing_cycle: str,
			active_subscriptions: num.describe('Number of active subscriptions'),
			pending_subscriptions: num.describe('Number of pending subscriptions'),
			total_subscriptions: num.describe('Total non-cancelled subscriptions'),
			monthly_cost: num.describe(
				'Current monthly cost for active subscriptions',
			),
		})
		.loose(),
	infraGuardGetBlacklistHistory: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							uid: str,
							test_code: str,
							status: str,
							summary: obj,
							results: z
								.array(
									z
										.object({
											value: str,
											type: str,
											domain: str,
											overall_status: str,
											summary: obj,
											findings: list,
											checked_at: str,
										})
										.loose(),
								)
								.nullish(),
							checked_at: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardGetDnsHistory: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							expected_ns: z.array(str).nullish(),
							actual_ns: z.array(str).nullish(),
							added_ns: z.array(str).nullish(),
							removed_ns: z.array(str).nullish(),
							error_message: str,
							checked_at: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardGetBounceMetrics: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					bounceRate: num.describe('Current bounce rate percentage'),
					totalEmails: num.describe('Total emails sent in the period'),
					bouncedEmails: num.describe('Total bounced emails'),
					hardBounces: num.describe('Permanent delivery failures'),
					softBounces: num.describe('Temporary delivery failures'),
					status: str.describe('Status relative to thresholds'),
					thresholds: z
						.object({
							warning: num,
							critical: num,
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardGetBounceHistory: z
		.object({
			error: bool,
			message: str,
			data: z
				.array(
					z
						.object({
							bounce_rate: num,
							total_emails: num,
							bounced_emails: num,
							hard_bounces: num,
							soft_bounces: num,
							status: str,
							trend: str,
							period_start: str,
							period_end: str,
							checked_at: str,
							created_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardUpdateSettings: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str,
					domain_uid: str,
					alert_preferences: z
						.object({
							email_notifications: bool,
							in_app_notifications: bool,
						})
						.loose()
						.nullish(),
					bounce_thresholds: z
						.object({
							warning: num,
							critical: num,
						})
						.loose()
						.nullish(),
					ipt_enabled: bool,
					ipt_receiver_types: z.array(str).nullish(),
					ipt_test_day: str,
					ipt_frequency: str,
					ipt_next_scheduled_run: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardTriggerCheck: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					domain_uid: str,
					domain_name: str,
					check_type: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardListAlerts: z
		.object({
			error: bool,
			message: str,
			alerts: z
				.array(
					z
						.object({
							uid: str,
							domain_name: str,
							alert_type: str,
							severity: str,
							title: str,
							message: str,
							status: str,
							metadata: obj,
							created_at: str,
							acknowledged_at: str,
							resolved_at: str,
							resolution_note: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardAcknowledgeAlert: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str,
					status: str,
					acknowledged_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardResolveAlert: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str,
					status: str,
					resolved_at: str,
					resolution_note: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardListActionItems: z
		.object({
			error: bool,
			message: str,
			action_items: z
				.array(
					z
						.object({
							uid: str,
							domain_name: str,
							category: str,
							severity: str,
							title: str,
							description: str,
							steps: z
								.array(
									z
										.object({
											step: num,
											description: str,
											completed: bool,
										})
										.loose(),
								)
								.nullish(),
							status: str,
							trigger_rule: str,
							metadata: obj,
							created_at: str,
							resolved_at: str,
							dismissed_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
			pages: num,
			current_page: num,
			limit: num,
		})
		.loose(),
	infraGuardGetActionItemStats: z
		.object({
			error: bool,
			message: str,
			stats: z
				.object({
					total: num.describe('Total action items'),
					critical: num.describe('Critical severity count'),
					warning: num.describe('Warning severity count'),
					advisory: num.describe('Advisory severity count'),
					pending: num.describe('Pending + in-progress count'),
					resolved: num.describe('Resolved count'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardResolveActionItem: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str,
					status: str,
					resolved_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	infraGuardDismissActionItem: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str,
					status: str,
					dismissed_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;

import { z } from 'zod';
import { bool, num, str, WorkspaceId } from '../schema-helpers';

export const EmailInsightsInputSchemas = {
	emailInsightsGetOverview: z
		.object({
			workspaceId: WorkspaceId,
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxesHealth: z
		.object({
			workspaceId: WorkspaceId,
			page: z
				.number()
				.int()
				.optional()
				.describe('Page of results to return, starting at 1. Defaults to 1.'),
			limit: z
				.number()
				.int()
				.optional()
				.describe(
					'Maximum rows to return. Accepts 1 to 1000. Defaults to 100.',
				),
		})
		.strict(),
	emailInsightsGetDailyStats: z
		.object({
			workspaceId: WorkspaceId,
			days: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetHighBounceMailboxes: z
		.object({
			workspaceId: WorkspaceId,
			threshold: z
				.number()
				.optional()
				.describe('Bounce rate to filter on, as a percentage. Defaults to 7.'),
			limit: z
				.number()
				.int()
				.optional()
				.describe(
					'Maximum rows to return. Accepts 1 to 1000. Defaults to 100.',
				),
		})
		.strict(),
	emailInsightsGetCampaignReplyRate: z
		.object({
			workspaceId: WorkspaceId,
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
		})
		.strict(),
	emailInsightsGetWorkspaceActivity: z
		.object({
			workspaceId: WorkspaceId,
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
		})
		.strict(),
	emailInsightsGetMailboxStats: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxDeliverability: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxHealth: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
		})
		.strict(),
	emailInsightsGetMailboxTrends: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxBounceEvents: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe(
					'Maximum rows to return. Accepts 1 to 1000. Defaults to 100.',
				),
			offset: z
				.number()
				.int()
				.optional()
				.describe(
					'Rows to skip before returning results. Accepts 0 to 100000. Defaults to 0.',
				),
		})
		.strict(),
	emailInsightsGetMailboxActivity: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
			offset: z
				.number()
				.int()
				.optional()
				.describe(
					'Rows to skip before returning results. Accepts 0 to 100000. Defaults to 0.',
				),
			event_type: z
				.string()
				.optional()
				.describe(
					'Return only this event type. One of sent, received, reply, auto_reply, bounce_hard or bounce_soft. Returns all types when omitted.',
				),
		})
		.strict(),
	emailInsightsGetMailboxTopRecipients: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 10.'),
		})
		.strict(),
	emailInsightsGetMailboxTopRecipientDomains: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 10.'),
		})
		.strict(),
	emailInsightsGetMailboxMessageBreakdown: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxSubjectAnalysis: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 20.'),
			direction: z
				.string()
				.optional()
				.describe(
					'Which messages to analyse. One of sent, received or all. Defaults to sent.',
				),
		})
		.strict(),
	emailInsightsGetMailboxReplyTimeHeatmap: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxReplyRateByDomain: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
		})
		.strict(),
	emailInsightsGetMailboxVelocityOverlay: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxWarmupStats: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxAuthFailures: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			protocol: z
				.string()
				.optional()
				.describe(
					'Which check to report on. One of spf, dkim or dmarc. Defaults to dkim.',
				),
			warmup: z
				.string()
				.optional()
				.describe(
					'Set to true to report on warmup pool messages instead of regular mail. Defaults to false.',
				),
		})
		.strict(),
	emailInsightsGetMailboxFirstTouchFunnel: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			recent_days: z
				.number()
				.int()
				.optional()
				.describe(
					'Also return individual recipients first contacted in this many days. Accepts 1 to 90. Omit to return daily counts only.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
		})
		.strict(),
	emailInsightsGetMailboxSendingIpBreakdown: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 50.'),
		})
		.strict(),
	emailInsightsGetMailboxRecipientEspBreakdown: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
		})
		.strict(),
	emailInsightsGetMailboxBodyTemplates: z
		.object({
			workspaceId: WorkspaceId,
			uid: z.string().min(1).describe('Mailbox UID.'),
			period: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days to report on. Accepts 1 to 90. Defaults to 30. Larger values return the last 90 days.',
				),
			limit: z
				.number()
				.int()
				.optional()
				.describe('Maximum rows to return. Accepts 1 to 1000. Defaults to 30.'),
		})
		.strict(),
} as const;

export const EmailInsightsOutputSchemas = {
	emailInsightsGetOverview: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					total: num.describe(
						'Total events recorded across every mailbox in the workspace.',
					),
					sent: num.describe(
						'Emails sent in the period. Excludes warmup traffic.',
					),
					received: num.describe(
						'Inbound emails in the period, including replies, auto replies and bounces.',
					),
					reply: num.describe(
						'Replies received that match one of your sent messages.',
					),
					auto_reply: num.describe(
						'Automatic replies received, such as out of office messages.',
					),
					bounce_hard: num.describe(
						'Permanent delivery failures. Counted once per failed recipient.',
					),
					bounce_soft: num.describe(
						'Temporary delivery failures. Counted once per failed recipient.',
					),
					active_mailboxes: num.describe(
						'Mailboxes with at least one event in the period.',
					),
					bounce_rate: num.describe(
						'Bounces divided by total events, as a value between 0 and 1.',
					),
					reply_rate: num.describe(
						'Replies divided by emails sent across the workspace, as a value between 0 and 1.',
					),
					last_updated: str.describe(
						'When these figures were last recalculated.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxesHealth: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.array(
					z
						.object({
							mailbox_id: str,
							status: str,
							total_7d: num,
							sent_7d: num,
							received_7d: num,
							reply_7d: num,
							bounce_7d: num,
							reply_rate_percent: num,
							bounce_rate_percent: num,
							last_event_at: str,
							sent_non_warmup_7d: num,
							sent_with_reply_7d: num,
							attributed_reply_rate_percent: num,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	emailInsightsGetDailyStats: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					days: num.describe('Number of days covered by these results.'),
					daily: z
						.array(
							z
								.object({
									date: str,
									sent: num,
									received: num,
									replies: num,
									bounces: num,
									total: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per day, oldest first.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetHighBounceMailboxes: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailboxes: z
						.array(
							z
								.object({
									mailbox_id: str,
									bounce_rate: num,
									total_sent: num,
									total_bounces: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per mailbox.'),
					threshold: num.describe(
						'Echoes the threshold you sent, as a percentage.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetCampaignReplyRate: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					rows: z
						.array(
							z
								.object({
									campaign_id: str,
									sequence_step: num,
									sent: num,
									replied: num,
									reply_rate: num,
									replied_attribution: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per group.'),
					total: num.describe('Number of rows returned.'),
					data_available_from: str.describe(
						'Earliest date campaign data is available for. Null when none is recorded.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetWorkspaceActivity: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.array(
					z
						.object({
							event_id: str,
							mailbox_id: str,
							event_type: str,
							from: str,
							subject: str,
							received_at: str,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxStats: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					total: num.describe('Total events recorded in the period.'),
					sent: num.describe(
						'Emails sent in the period. Excludes warmup traffic.',
					),
					received: num.describe(
						'Inbound emails in the period, including replies, auto replies and bounces.',
					),
					reply: num.describe(
						'Replies received that match one of your sent messages.',
					),
					auto_reply: num.describe(
						'Automatic replies received, such as out of office messages.',
					),
					bounce_hard: num.describe(
						'Permanent delivery failures. Counted once per failed recipient.',
					),
					bounce_soft: num.describe(
						'Temporary delivery failures. Counted once per failed recipient.',
					),
					warmup_sent: num.describe(
						'Warmup pool messages sent in the period. Not included in sent.',
					),
					warmup_received: num.describe(
						'Warmup pool messages received in the period.',
					),
					first_event_at: str.describe(
						'When the earliest recorded event happened. Returns 0001-01-01T00:00:00Z when there are none.',
					),
					last_event_at: str.describe(
						'When the most recent recorded event happened. Returns 0001-01-01T00:00:00Z when there are none.',
					),
					bounce_rate: num.describe(
						'Hard and soft bounces divided by total events, as a value between 0 and 1.',
					),
					response_rate: num.describe(
						'Replies divided by received emails, as a value between 0 and 1.',
					),
					bounce_rate_percent: num,
					reply_rate_percent: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxDeliverability: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					bounce_rate_percent: num.describe(
						'Bounces divided by emails sent, as a percentage.',
					),
					hard_bounces: num.describe('Permanent delivery failures.'),
					soft_bounces: num.describe('Temporary delivery failures.'),
					total_bounces: num.describe('Hard and soft bounces combined.'),
					orphan_bounces: num.describe(
						'Bounces with no matching send inside the period. Usually historical failure notices that arrived after the mailbox was connected.',
					),
					auto_reply_count: num.describe('Automatic replies received.'),
					auto_reply_rate_percent: num.describe(
						'Automatic replies divided by emails sent, as a percentage.',
					),
					bounce_cause_breakdown: z
						.array(
							z
								.object({
									cause: str,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe('Failure reasons, most common first.'),
					bounced_recipients: z
						.array(
							z
								.object({
									recipient_email: str,
									bounce_count: num,
									hard_bounces: num,
									soft_bounces: num,
									last_bounce_timestamp: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Recipients that bounced, most bounces first.'),
					bounced_domains: z
						.array(
							z
								.object({
									domain: str,
									total_bounces: num,
									hard_bounces: num,
									soft_bounces: num,
								})
								.loose(),
						)
						.nullish()
						.describe('Domains that bounced, most bounces first.'),
					spf_pass_rate: num.describe(
						'Share of inbound mail that passed SPF, as a value between 0 and 1.',
					),
					dkim_pass_rate: num.describe(
						'Share of inbound mail that passed DKIM, as a value between 0 and 1.',
					),
					dmarc_pass_rate: num.describe(
						'Share of inbound mail that passed DMARC, as a value between 0 and 1.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxHealth: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailbox_id: str.describe('Mailbox UID.'),
					status: str.describe(
						'Activity level for the mailbox. healthy means 10 or more events in the last 7 days with activity in the last 48 hours.',
					),
					total_7d: num.describe('Events recorded in the last 7 days.'),
					total_30d: num.describe('Events recorded in the last 30 days.'),
					last_event_at: str.describe(
						'When the most recent recorded event happened. Returns 0001-01-01T00:00:00Z when there are none.',
					),
					first_event_at: str.describe(
						'When the earliest recorded event happened. Returns 0001-01-01T00:00:00Z when there are none.',
					),
					bounce_rate_30d: num.describe(
						'Bounces divided by total events over the last 30 days, as a value between 0 and 1.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxTrends: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.array(
					z
						.object({
							bucket: str,
							total: num,
							sent: num,
							received: num,
							reply: num,
							auto_reply: num,
							bounce_hard: num,
							bounce_soft: num,
							warmup_sent: num,
							warmup_received: num,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxBounceEvents: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					events: z
						.array(
							z
								.object({
									message_id: str,
									subject: str,
									from: str,
									to: str,
									failed_recipients: z.array(str).nullish(),
									received_at: str,
									event_type: str,
									bounce_cause: str,
									bounce_smtp_code: num,
									bounce_enhanced_code: str,
									bounce_reporting_mta: str,
									snippet: str,
									body_text: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per event.'),
					total: num.describe(
						'Total bounce events matching, across all pages.',
					),
					limit: num.describe('Maximum rows requested.'),
					offset: num.describe('Rows skipped before this page.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxActivity: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.array(
					z
						.object({
							event_id: str,
							mailbox_id: str,
							event_type: str,
							from: str,
							subject: str,
							received_at: str,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxTopRecipients: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailbox: z
						.object({
							uid: str,
							email: str,
							provider: str,
						})
						.loose()
						.nullish()
						.describe('The mailbox these results belong to.'),
					recipients: z
						.array(
							z
								.object({
									email: str,
									email_count: num,
									last_sent: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per recipient.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxTopRecipientDomains: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailbox: z
						.object({
							uid: str,
							email: str,
							provider: str,
						})
						.loose()
						.nullish()
						.describe('The mailbox these results belong to.'),
					domains: z
						.array(
							z
								.object({
									domain: str,
									email_count: num,
									unique_recipients: num,
									last_sent: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per domain.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxMessageBreakdown: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailbox: z
						.object({
							uid: str,
							email: str,
							provider: str,
						})
						.loose()
						.nullish()
						.describe('The mailbox these results belong to.'),
					sent: z
						.object({
							total_sent: num,
							new_emails: num,
							replies: num,
						})
						.loose()
						.nullish()
						.describe('Outbound totals for the period.'),
					received: z
						.object({
							total_received: num,
							regular: num,
							auto_replies: num,
							bounces_hard: num,
							bounces_soft: num,
						})
						.loose()
						.nullish()
						.describe(
							'Inbound emails in the period, including replies, auto replies and bounces.',
						),
					by_day: z
						.array(
							z
								.object({
									date: str,
									sent: num,
									received: num,
									replies: num,
									bounces: num,
								})
								.loose(),
						)
						.nullish()
						.describe('Daily totals, oldest first.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxSubjectAnalysis: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					period_days: num.describe('Number of days covered by these results.'),
					common_keywords: z
						.array(
							z
								.object({
									keyword: str,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Most frequent subject line keywords, most common first.',
						),
					subject_length_stats: z
						.object({
							avg_length: num,
							min_length: num,
							max_length: num,
						})
						.loose()
						.nullish()
						.describe('Subject line length in characters.'),
					warmup_messages_filtered: num.describe(
						'Warmup messages excluded from this analysis.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxReplyTimeHeatmap: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					cells: z
						.array(
							z
								.object({
									dow: num,
									hour: num,
									p50_seconds: num,
									p95_seconds: num,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'One entry per day of week and hour combination that has replies.',
						),
					total_replies: num.describe('Replies included in this heatmap.'),
					data_from_parser_v4: str.describe(
						'Earliest date this metric has data for. Activity before this date is not included.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxReplyRateByDomain: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					rows: z
						.array(
							z
								.object({
									domain: str,
									sent: num,
									replied: num,
									reply_rate: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per group.'),
					total_sent: num.describe('Emails sent in the period.'),
					total_replied: num.describe('Sent emails that received a reply.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxVelocityOverlay: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					series: z
						.array(
							z
								.object({
									hour: str,
									sent: num,
									replies: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per hour, oldest first.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxWarmupStats: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					period_days: num.describe('Number of days covered by these results.'),
					total_sent: num.describe('Emails sent in the period.'),
					warmup_sent: num.describe(
						'Warmup pool messages sent in the period. Not included in sent.',
					),
					gross_sent: num.describe(
						'All outbound messages including warmup traffic.',
					),
					warmup_share_pct: num.describe(
						'Warmup messages as a percentage of all outbound.',
					),
					daily: z
						.array(
							z
								.object({
									date: str,
									warmup_sent: num,
									real_sent: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per day, oldest first.'),
					reasons: z
						.array(
							z
								.object({
									reason: str,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Why messages were classified as warmup traffic, with a count for each.',
						),
					top_peer_domains: z
						.array(
							z
								.object({
									domain: str,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Domains exchanging the most warmup mail with this mailbox.',
						),
					sample_subjects: z
						.array(str)
						.nullish()
						.describe('Example subject lines from warmup messages.'),
					warmup_received: num.describe(
						'Warmup pool messages received in the period.',
					),
					warmup_spf_pass_rate: num.describe(
						'Share of warmup mail that passed SPF, as a value between 0 and 1.',
					),
					warmup_dkim_pass_rate: num.describe(
						'Share of warmup mail that passed DKIM, as a value between 0 and 1.',
					),
					warmup_dmarc_pass_rate: num.describe(
						'Share of warmup mail that passed DMARC, as a value between 0 and 1.',
					),
					warmup_peer_senders: z
						.array(
							z
								.object({
									domain: str,
									count: num,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Senders exchanging the most warmup mail with this mailbox.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxAuthFailures: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					protocol: str.describe(
						'Check these samples relate to, one of spf, dkim or dmarc.',
					),
					period_days: num.describe('Number of days covered by these results.'),
					total_received: num.describe('Inbound emails in the period.'),
					total_failing: num.describe(
						'Inbound emails in the period that did not pass the selected check.',
					),
					samples: z
						.array(
							z
								.object({
									received_at: str,
									from: str,
									from_domain: str,
									subject: str,
									spf_verdict: str,
									dkim_verdict: str,
									dkim_signing_domain: str,
									dmarc_verdict: str,
									dmarc_action: str,
									auth_results_raw: str,
									provider_message_id: str,
									message_id: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Individual messages that did not pass. Capped at the requested limit.',
						),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxFirstTouchFunnel: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					daily: z
						.array(
							z
								.object({
									date: str,
									recipient_count: num,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per day, oldest first.'),
					recent: z
						.array(
							z
								.object({
									recipient: str,
									first_sent: str,
								})
								.loose(),
						)
						.nullish()
						.describe(
							'Individual recipients contacted for the first time. Returned only when recent_days is set.',
						),
					data_from_parser_v4: str.describe(
						'Earliest date this metric has data for. Activity before this date is not included.',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxSendingIpBreakdown: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					rows: z
						.array(
							z
								.object({
									ip: str,
									sent: num,
									gmail_inbox_count: num,
									gmail_promotions_count: num,
									gmail_spam_count: num,
									gmail_unknown_count: num,
									inbox_rate: num,
									first_seen_at: str,
									last_seen_at: str,
									hostname: str,
									hostname_checked_at: str,
									blacklist_hits: num,
									blacklist_providers: z.array(str).nullish(),
									blacklist_checked_at: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per group.'),
					total_sent: num.describe('Emails sent in the period.'),
					unique_ips: num.describe(
						'Number of distinct sending IPs in the period.',
					),
					data_from_parser_v4: str.describe(
						'Earliest date this metric has data for. Activity before this date is not included.',
					),
					unknown_ip_excluded: bool.describe(
						'Whether messages with no recorded sending IP were left out of these results.',
					),
					notes: z
						.object({
							bounce_attribution: str,
							placement_support: str,
						})
						.loose()
						.nullish()
						.describe('Caveats that apply to these results.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxRecipientEspBreakdown: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					rows: z
						.array(
							z
								.object({
									esp_provider: str,
									esp_category: str,
									domain_count: num,
									recipient_count: num,
									send_count: num,
									replied_count: num,
									auto_replied_count: num,
									reply_rate: num,
									send_share: num,
									sample_domain: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per group.'),
					total_sends: num.describe('Emails sent in the period.'),
					total_replied: num.describe('Sent emails that received a reply.'),
					total_auto_replied: num.describe(
						'Automatic replies received in the period.',
					),
					total_reply_rate: num.describe(
						'Replies divided by emails sent, as a value between 0 and 1.',
					),
					total_domains: num.describe(
						'Distinct recipient domains in the period.',
					),
					total_recipients: num.describe('Distinct recipients in the period.'),
					classified_pct: num.describe(
						'Share of recipient domains matched to a known provider, as a percentage.',
					),
					period_days: num.describe('Number of days covered by these results.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	emailInsightsGetMailboxBodyTemplates: z
		.object({
			success: bool.describe('True when the request succeeded.'),
			data: z
				.object({
					mailbox: z
						.object({
							uid: str,
							email: str,
							provider: str,
						})
						.loose()
						.nullish()
						.describe('The mailbox these results belong to.'),
					templates: z
						.array(
							z
								.object({
									skeleton_hash: str,
									sends: num,
									warmup_sends: num,
									unique_recipients: num,
									sample_subject: str,
									sample_preview: str,
									avg_length: num,
									has_spin_tax: num,
									has_personalization: num,
									tight_variants: num,
									first_seen: str,
									last_seen: str,
								})
								.loose(),
						)
						.nullish()
						.describe('One entry per template group.'),
					total_sent: num.describe('Emails sent in the period.'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;

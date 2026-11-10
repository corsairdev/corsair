import { z } from 'zod';
import { bool, num, obj, str, WorkspaceId } from '../schema-helpers';

export const InboxPlacementInputSchemas = {
	inboxPlacementCreateTest: z
		.object({
			workspaceId: WorkspaceId,
			sender_mailbox_ids: z
				.array(z.string())
				.describe('Array of mailbox UIDs (UUID format, not MongoDB _id)'),
			test_name: z.string().describe('Name for the test (required)'),
			frequency: z
				.enum([
					'once',
					'weekly',
					'biweekly',
					'monthly',
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday',
					'sunday',
				])
				.optional()
				.describe(
					'Test frequency. Use \'once\' for one-time test, or specify recurring schedule. Default "once".',
				),
			types: z
				.array(
					z.enum([
						'personal_gmail',
						'personal_outlook',
						'business_gmail',
						'business_outlook',
					]),
				)
				.optional()
				.describe(
					'Receiver mailbox types to test against. If not specified, all types are used.',
				),
			custom_subject: z
				.string()
				.optional()
				.describe('Custom email subject line (max 500 characters)'),
			custom_body: z
				.string()
				.optional()
				.describe('Custom email body content (max 50000 characters)'),
			sending_interval: z
				.number()
				.int()
				.min(1)
				.max(60)
				.optional()
				.describe(
					'Interval between sending emails in minutes (1-60). Default 1.',
				),
			payment_method: z
				.enum(['CREDITS', 'INBOX_PLACEMENT_TOKENS'])
				.optional()
				.describe(
					'Payment method to use. CREDITS uses wallet balance ($0.05/mailbox), INBOX_PLACEMENT_TOKENS uses tokens (1 token/mailbox). Default "CREDITS".',
				),
		})
		.strict(),
	inboxPlacementListTests: z
		.object({
			page: z.number().int().optional().describe('Page number for pagination'),
			limit: z.number().int().optional().describe('Results per page (max 100)'),
			status: z.string().optional().describe('Filter by status'),
		})
		.strict(),
	inboxPlacementGetTest: z
		.object({
			testCode: z
				.string()
				.min(1)
				.describe('The test code (e.g., IPT-ABC123XYZ)'),
		})
		.strict(),
	inboxPlacementListScheduled: z
		.object({
			workspaceId: WorkspaceId,
		})
		.strict(),
	inboxPlacementGetScheduled: z
		.object({
			id: z.string().min(1).describe('The scheduled test ID'),
		})
		.strict(),
	inboxPlacementPauseScheduled: z
		.object({
			id: z.string().min(1).describe('The scheduled test ID'),
		})
		.strict(),
	inboxPlacementResumeScheduled: z
		.object({
			id: z.string().min(1).describe('The scheduled test ID'),
		})
		.strict(),
	inboxPlacementDeleteScheduled: z
		.object({
			id: z.string().min(1).describe('The scheduled test ID'),
		})
		.strict(),
} as const;

export const InboxPlacementOutputSchemas = {
	inboxPlacementCreateTest: z
		.object({
			success: bool,
			test: z
				.object({
					id: str,
					test_code: str,
					test_name: str,
					status: str,
					sender_mailboxes: z
						.array(
							z
								.object({
									email: str,
									platform: str,
									profile_picture: str,
									full_name: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Sender mailboxes used in the test'),
					receiver_mailboxes: z
						.array(
							z
								.object({
									email: str,
									type: str,
								})
								.loose(),
						)
						.nullish(),
					created_at: str,
					expires_at: str,
				})
				.loose()
				.nullish(),
			schedule: z
				.object({
					id: str,
					frequency: str,
					next_run_at: str,
					status: str,
				})
				.loose()
				.nullish()
				.describe("Only present if frequency is not 'once'"),
			billing: z
				.object({
					amount_charged: num.describe(
						'Amount charged (in dollars for CREDITS, or number of tokens for INBOX_PLACEMENT_TOKENS)',
					),
					currency: str.describe('Currency type used'),
					payment_method: str.describe('Payment method used for this test'),
					balance_remaining: num.describe('Remaining balance after charge'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	inboxPlacementListTests: z
		.object({
			success: bool,
			tests: z
				.array(
					z
						.object({
							id: str,
							test_code: str,
							test_name: str,
							status: str,
							sender_mailboxes: z
								.array(
									z
										.object({
											email: str,
											platform: str,
											profile_picture: str,
											full_name: str,
										})
										.loose(),
								)
								.nullish(),
							receiver_mailboxes: z
								.array(
									z
										.object({
											email: str,
											type: str,
										})
										.loose(),
								)
								.nullish(),
							created_at: str,
							started_at: str,
							completed_at: str,
							summary: z
								.object({
									totalFound: num,
									totalPrimary: num,
									totalSpam: num,
									totalPromotions: num,
									totalOther: num,
									totalNotFound: num,
									overallScore: num,
									byProvider: obj,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish(),
			pagination: z
				.object({
					page: num,
					limit: num,
					total: num,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	inboxPlacementGetTest: z
		.object({
			success: bool,
			test: z
				.object({
					id: str.describe('MongoDB ObjectId'),
					test_code: str.describe('Unique test code'),
					test_name: str.describe('User-provided test name'),
					status: str,
					sender_mailboxes: z
						.array(
							z
								.object({
									email: str,
									platform: str,
									mailbox_id: str,
									profile_picture: str,
									full_name: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Sender mailboxes used in this test'),
					receiver_mailboxes: z
						.array(
							z
								.object({
									email: str,
									type: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Receiver mailboxes used in this test'),
					created_at: str.describe('Test creation timestamp'),
					started_at: str.describe('When monitoring started'),
					completed_at: str.describe('When test completed'),
					expires_at: str.describe(
						'Test expiration time (1 hour from creation)',
					),
					estimated_completion_at: str.describe('Estimated completion time'),
					summary: z
						.object({
							totalFound: num,
							totalPrimary: num,
							totalSpam: num,
							totalPromotions: num,
							totalOther: num,
							totalNotFound: num,
							overallScore: num,
							byProvider: obj,
						})
						.loose()
						.nullish()
						.describe('Test summary statistics (available after completion)'),
					results: z
						.array(
							z
								.object({
									receiverEmail: str,
									receiverType: str,
									senders: z.array(obj).nullish(),
								})
								.loose(),
						)
						.nullish()
						.describe('Detailed test results per receiver'),
					errors: z
						.array(
							z
								.object({
									message: str,
									timestamp: str,
								})
								.loose(),
						)
						.nullish()
						.describe('Any errors encountered during the test'),
					emails_sent: num.describe('Number of test emails sent'),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	inboxPlacementListScheduled: z
		.object({
			success: bool,
			schedules: z
				.array(
					z
						.object({
							id: str,
							test_name: str,
							frequency: str,
							status: str,
							next_run_at: str,
							last_run_at: str,
							total_runs: num,
							sender_mailbox_ids: z.array(str).nullish(),
							created_at: str,
							updated_at: str,
						})
						.loose(),
				)
				.nullish(),
			total: num,
		})
		.loose(),
	inboxPlacementGetScheduled: z
		.object({
			success: bool,
			schedule: z
				.object({
					id: str,
					test_name: str,
					frequency: str,
					status: str,
					next_run_at: str,
					last_run_at: str,
					total_runs: num,
					sender_mailbox_ids: z
						.array(str)
						.nullish()
						.describe('Array of mailbox UIDs'),
					created_at: str,
					updated_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	inboxPlacementPauseScheduled: z
		.object({
			success: bool,
			message: str,
		})
		.loose(),
	inboxPlacementResumeScheduled: z
		.object({
			success: bool,
			message: str,
			next_run_at: str,
		})
		.loose(),
	inboxPlacementDeleteScheduled: z
		.object({
			success: bool,
			message: str,
		})
		.loose(),
} as const;

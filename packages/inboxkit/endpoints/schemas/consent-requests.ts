import { z } from 'zod';
import { bool, freeForm, num, str, WorkspaceId } from '../schema-helpers';

export const ConsentRequestsInputSchemas = {
	consentRequestsInitiate: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uid: z
				.string()
				.optional()
				.describe(
					'Unique identifier of the mailbox (optional if using username+domain)',
				),
			username: z
				.string()
				.optional()
				.describe(
					'Username of the mailbox (required with domain if not using mailbox_uid)',
				),
			domain: z
				.string()
				.optional()
				.describe(
					'Domain of the mailbox (required with username if not using mailbox_uid)',
				),
			consent_url: z.string().describe('The consent URL to be processed'),
			request_data: freeForm()
				.optional()
				.describe('Additional data for the consent request'),
		})
		.strict(),
	consentRequestsGetStatus: z
		.object({
			workspaceId: WorkspaceId,
			requestId: z
				.string()
				.min(1)
				.describe('The unique identifier of the consent request'),
		})
		.strict(),
	consentRequestsList: z
		.object({
			workspaceId: WorkspaceId,
			mailbox_uid: z.string().optional().describe('Filter by mailbox UID'),
			status: z
				.enum([
					'queued',
					'pending',
					'processing',
					'completed',
					'failed',
					'errored',
					'cancelled',
				])
				.optional()
				.describe('Filter by status'),
			limit: z
				.number()
				.int()
				.min(1)
				.max(100)
				.optional()
				.describe('Number of records to return (1-100)'),
			offset: z
				.number()
				.int()
				.min(0)
				.optional()
				.describe('Number of records to skip'),
			sortBy: z
				.enum(['createdAt', 'status'])
				.optional()
				.describe('Field to sort by'),
			sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort order'),
		})
		.strict(),
} as const;

export const ConsentRequestsOutputSchemas = {
	consentRequestsInitiate: z
		.object({
			error: bool,
			message: str,
			data: z
				.object({
					uid: str.describe('Unique identifier of the consent request'),
					status: str,
					mailbox_email: str,
					created_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	consentRequestsGetStatus: z
		.object({
			error: bool,
			data: z
				.object({
					uid: str,
					status: str,
					status_text: str,
					status_reason: str,
					retry_count: num,
					mailbox: z
						.object({
							uid: str,
							email: str,
						})
						.loose()
						.nullish(),
					created_at: str,
					completed_at: str,
					last_attempt_at: str,
					next_retry_at: str,
				})
				.loose()
				.nullish(),
		})
		.loose(),
	consentRequestsList: z
		.object({
			error: bool,
			data: z
				.array(
					z
						.object({
							uid: str,
							status: str,
							status_text: str,
							retry_count: num,
							mailbox: z
								.object({
									uid: str,
									email: str,
								})
								.loose()
								.nullish(),
							created_at: str,
							completed_at: str,
							last_attempt_at: str,
						})
						.loose(),
				)
				.nullish(),
			pagination: z
				.object({
					total: num,
					limit: num,
					offset: num,
					hasMore: bool,
				})
				.loose()
				.nullish(),
		})
		.loose(),
} as const;

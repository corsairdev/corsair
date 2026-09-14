import { z } from 'zod';

/**
 * Account quotas from GET /v3/account.
 * Official: https://developers.hellosign.com/api/account/get
 */
export const DropboxSignQuotas = z
	.object({
		api_signature_requests_left: z.number().nullable().optional(),
		documents_left: z.number().nullable().optional(),
		templates_total: z.number().nullable().optional(),
		templates_left: z.number().nullable().optional(),
		sms_verifications_left: z.number().nullable().optional(),
		num_fax_pages_left: z.number().nullable().optional(),
	})
	.loose();

/**
 * Account object from GET /v3/account.
 * Official: https://developers.hellosign.com/api/account/get
 */
export const DropboxSignAccount = z
	.object({
		account_id: z.string().optional(),
		email_address: z.string().optional(),
		is_locked: z.boolean().optional(),
		is_paid_hs: z.boolean().optional(),
		is_paid_hf: z.boolean().optional(),
		quotas: DropboxSignQuotas.optional(),
		callback_url: z.string().nullable().optional(),
		role_code: z.string().nullable().optional(),
		team_id: z.string().nullable().optional(),
		locale: z.string().nullable().optional(),
	})
	.loose();

/**
 * Signer row on a Signature Request.
 * Official: https://developers.hellosign.com/api/signature-request/get
 */
export const DropboxSignSignature = z
	.object({
		signature_id: z.string().optional(),
		signer_email_address: z.string().optional(),
		signer_name: z.string().optional(),
		signer_role: z.string().nullable().optional(),
		order: z.number().nullable().optional(),
		status_code: z.string().optional(),
		signed_at: z.number().nullable().optional(),
		last_viewed_at: z.number().nullable().optional(),
		last_reminded_at: z.number().nullable().optional(),
		has_pin: z.boolean().optional(),
	})
	.loose();

/**
 * Signature Request from GET /v3/signature_request/{signature_request_id}.
 * Official: https://developers.hellosign.com/api/signature-request/get
 */
export const DropboxSignSignatureRequest = z
	.object({
		signature_request_id: z.string().optional(),
		title: z.string().optional(),
		original_title: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		is_complete: z.boolean().optional(),
		is_declined: z.boolean().optional(),
		has_error: z.boolean().optional(),
		files_url: z.string().optional(),
		details_url: z.string().optional(),
		signing_url: z.string().nullable().optional(),
		created_at: z.number().optional(),
		signatures: z.array(DropboxSignSignature).optional(),
		template_ids: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * Template from GET /v3/template/{template_id}.
 * Official: https://developers.hellosign.com/api/template/get
 */
export const DropboxSignTemplate = z
	.object({
		template_id: z.string().optional(),
		title: z.string().optional(),
		message: z.string().optional(),
		updated_at: z.number().optional(),
		is_creator: z.boolean().optional(),
		is_embedded: z.boolean().optional(),
		can_edit: z.boolean().optional(),
		is_locked: z.boolean().optional(),
		signer_roles: z
			.array(
				z
					.object({
						name: z.string().optional(),
						order: z.number().nullable().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

/**
 * API App from GET /v3/api_app/{client_id}.
 * Official: https://developers.hellosign.com/api/api-app/get
 */
export const DropboxSignApiApp = z
	.object({
		client_id: z.string().optional(),
		name: z.string().optional(),
		domain: z.string().nullable().optional(),
		callback_url: z.string().nullable().optional(),
		is_approved: z.boolean().optional(),
		created_at: z.number().optional(),
	})
	.loose();

/**
 * Team from GET /v3/team.
 * Official: https://developers.hellosign.com/api/team/get
 */
export const DropboxSignTeam = z
	.object({
		name: z.string().optional(),
		team_id: z.string().optional(),
		num_members: z.number().optional(),
		num_sub_teams: z.number().optional(),
		accounts: z.array(DropboxSignAccount).optional(),
		invited_accounts: z.array(DropboxSignAccount).optional(),
		invited_emails: z.array(z.string()).optional(),
	})
	.loose();

/**
 * Fax from GET /v3/fax/list.
 * Official: https://developers.hellosign.com/api/fax/list
 */
export const DropboxSignFax = z
	.object({
		fax_id: z.string().optional(),
		title: z.string().optional(),
		original_title: z.string().optional(),
		message: z.string().nullable().optional(),
		created_at: z.number().optional(),
		sender: z.string().optional(),
		files_url: z.string().optional(),
		transmissions: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

/**
 * Bulk send job from GET /v3/bulk_send_job/{bulk_send_job_id}.
 * Official: https://developers.hellosign.com/api/bulk-send-job/get
 */
export const DropboxSignBulkSendJob = z
	.object({
		bulk_send_job_id: z.string().optional(),
		total: z.number().optional(),
		is_creator: z.boolean().optional(),
		created_at: z.number().optional(),
	})
	.loose();

export type DropboxSignAccount = z.infer<typeof DropboxSignAccount>;
export type DropboxSignSignatureRequest = z.infer<
	typeof DropboxSignSignatureRequest
>;
export type DropboxSignTemplate = z.infer<typeof DropboxSignTemplate>;
export type DropboxSignApiApp = z.infer<typeof DropboxSignApiApp>;
export type DropboxSignTeam = z.infer<typeof DropboxSignTeam>;
export type DropboxSignFax = z.infer<typeof DropboxSignFax>;
export type DropboxSignBulkSendJob = z.infer<typeof DropboxSignBulkSendJob>;

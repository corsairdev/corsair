import { z } from 'zod';

export const DropboxSignSchema = {
	version: '1.0.0',
	entities: {
		account: z.object({
			account_id: z.string(),
			email_address: z.string().email(),
			is_paid_hs: z.boolean().optional(),
			is_paid_hf: z.boolean().optional(),
			quotas: z.record(z.string(), z.any()).optional(),
			role_code: z.string().optional(),
		}),
		signatureRequest: z.object({
			signature_request_id: z.string(),
			title: z.string().optional(),
			subject: z.string().optional(),
			message: z.string().optional(),
			is_complete: z.boolean().optional(),
			is_declined: z.boolean().optional(),
			has_error: z.boolean().optional(),
			custom_fields: z.array(z.record(z.string(), z.any())).optional(),
			signatures: z.array(z.record(z.string(), z.any())).optional(),
			created_at: z.number().optional(),
		}),
		template: z.object({
			template_id: z.string(),
			title: z.string().optional(),
			message: z.string().optional(),
			signer_roles: z.array(z.record(z.string(), z.any())).optional(),
			cc_roles: z.array(z.record(z.string(), z.any())).optional(),
			documents: z.array(z.record(z.string(), z.any())).optional(),
			is_creator: z.boolean().optional(),
			can_edit: z.boolean().optional(),
		}),
		apiApp: z.object({
			client_id: z.string(),
			name: z.string(),
			callback_url: z.string().optional(),
			is_approved: z.boolean().optional(),
			created_at: z.number().optional(),
		}),
		team: z.object({
			name: z.string().optional(),
			accounts: z.array(z.record(z.string(), z.any())).optional(),
			invited_accounts: z.array(z.record(z.string(), z.any())).optional(),
		}),
		fax: z.object({
			fax_id: z.string(),
			title: z.string().optional(),
			original_title: z.string().optional(),
			metadata: z.record(z.string(), z.any()).optional(),
			created_at: z.number().optional(),
		}),
	},
} as const;
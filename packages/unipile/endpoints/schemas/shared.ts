import { z } from 'zod';

// Hand-written pieces the generated domain schemas share.

export const AccountId = z
	.string()
	.min(1)
	.describe(
		'Unipile account ID (acc_…) of the connected account to act as, from accounts.list',
	);

/** Default cap for downloading a file's content. */
export const DEFAULT_MAX_FILE_BYTES = 5 * 1024 * 1024;

// Pictures and attachments come back as raw bytes. By default only their
// metadata is returned, so an agent does not pull megabytes into its context.
export const BinaryFileInput = z.object({
	include_content: z
		.boolean()
		.optional()
		.describe(
			'Return the file itself as base64 in content_base64. Off by default: only the type and size come back',
		),
	max_bytes: z
		.number()
		.int()
		.min(1)
		.max(25 * 1024 * 1024)
		.optional()
		.describe(
			'Largest file to return with include_content (default 5 MB); bigger files come back without content',
		),
});

export const BinaryFileSchema = z
	.object({
		content_type: z.string().describe('MIME type Unipile sent'),
		size_bytes: z.number().describe('Size of the file in bytes'),
		filename: z
			.string()
			.nullish()
			.describe('File name from Content-Disposition, when sent'),
		content_base64: z
			.string()
			.nullish()
			.describe('The file as base64, only with include_content'),
		content_omitted: z
			.string()
			.nullish()
			.describe(
				'Why content_base64 is missing although include_content was set',
			),
	})
	.loose();

// unknown: linkedin.request forwards LinkedIn's own response, whatever it is.
export const UnknownJson = z.unknown();

// POST /v2/api-keys/ takes one of two bodies that differ only in `access`.
export const ApiKeysCreateInputSchema = z.object({
	name: z.string().min(1).max(255).describe('Internal name for the key'),
	expires_at: z
		.string()
		.describe('When the key stops working, ISO 8601 date-time'),
	access: z
		.discriminatedUnion('type', [
			z.object({
				type: z.literal('global'),
			}),
			z.object({
				type: z.literal('scope'),
				scope_id: z
					.string()
					.min(1)
					.describe('Scope the key is limited to, from scopes.list'),
			}),
		])
		.describe(
			'global: every account in the application. scope: only accounts in one scope',
		),
});

// POST /v2/auth/intent: one shape per provider, nested several allOf deep in
// the spec. The common fields are typed; provider credentials pass through.
export const AuthStartIntentInputSchema = z
	.object({
		provider: z
			.string()
			.min(1)
			.describe('Provider to connect, e.g. LINKEDIN, WHATSAPP, GOOGLE'),
		account_id: z
			.string()
			.optional()
			.describe('Existing account to reconnect. Omit to link a new one'),
		account_scope_id: z
			.string()
			.optional()
			.describe('Scope to assign a newly linked account to'),
		state: z
			.string()
			.max(255)
			.optional()
			.describe('Returned in the account.add / account.reconnect webhook'),
		unilogin: z
			.boolean()
			.optional()
			.describe(
				'LinkedIn and Instagram: connect through the UniLogin extension instead of credentials',
			),
		config: z.record(z.string(), z.unknown()).optional(),
	})
	// Provider credentials (username, password, cookies, …) pass through.
	.loose();

// 204 No Content answers (deletes, RSVPs, checkpoint resends) become
// { success: true }, so a write that worked never reads as unparsed.
export const NoContentSchema = z.object({ success: z.boolean() }).loose();

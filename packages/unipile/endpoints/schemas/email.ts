import { z } from 'zod';
import {
	AccountId,
	BinaryFileInput,
	BinaryFileSchema,
	NoContentSchema,
} from './shared';

// Generated from the per-operation OpenAPI definitions in Unipile's v2
// reference (API 2.62). Inputs follow the spec field for field; outputs
// type two levels of each response and pass the rest through.

const EmailsListShape1 = z
	.object({
		object: z.string(),
		id: z.string(),
		message_id: z.string(),
		thread_id: z.string().nullish(),
		body: z.string(),
		body_plain: z.string(),
		snippet: z.string(),
		subject: z.string(),
		headers: z.array(z.unknown()),
		from: z.array(z.unknown()).nullish(),
		to: z.array(z.unknown()).nullish(),
		cc: z.array(z.unknown()),
		bcc: z.array(z.unknown()),
		reply_to: z.array(z.unknown()),
		date: z.string(),
		attachments: z.array(z.unknown()),
		folders: z.array(z.string()),
		categories: z.array(z.string()).nullish(),
		is_unread: z.boolean(),
	})
	.loose();

const EmailsListShape2 = z
	.object({
		data: z.array(EmailsListShape1),
		total_count: z
			.number()
			.nullish()
			.describe('Total number of results if supported by the provider.'),
		next_cursor: z
			.string()
			.nullish()
			.describe(
				'Cursor to get the next page of results if supported. Else use `offset`.',
			),
	})
	.loose();

const EmailsGetShape3 = z
	.object({
		object: z.string().nullish(),
		id: z.string().nullish(),
		file_size: z.number().nullish(),
		is_inline: z.boolean().nullish(),
		content_id: z.string().nullish(),
		is_unavailable: z.boolean().nullish(),
		mimetype: z.string().nullish(),
		url: z.string().nullish(),
		url_expires_at: z.string().nullish(),
		content: z.string().nullish(),
		type: z.string().nullish(),
		duration: z.number().nullish(),
		voice_note: z.boolean().nullish(),
		size: z.record(z.string(), z.unknown()).nullish(),
		sticker: z.boolean().nullish(),
		gif: z.boolean().nullish(),
		filename: z.string().nullish(),
		media_type: z.string().nullish(),
		author: z.string().nullish(),
		description: z.string().nullish(),
		display_name: z.string().nullish(),
		organization: z.string().nullish(),
		phones: z.array(z.unknown()).nullish(),
		emails: z.array(z.unknown()).nullish(),
	})
	.loose();

const FoldersCreateShape4 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the folder for the provider.'),
		name: z.string().describe('The name of the folder.'),
		role: z
			.string()
			.nullish()
			.describe(
				'The folder role represents a supported special-use purpose (based on RFC special-use attributes where applicable); it does not indicate whether the folder is sy…',
			),
		total_count: z
			.number()
			.describe(
				'The total number of emails in the folder. For Gmail, the total number of emails assigned with this label.',
			),
		unread_count: z
			.number()
			.describe(
				'The number of unread emails in the folder. For Gmail, the number of unread emails assigned with this label.',
			),
		background_color: z
			.string()
			.nullish()
			.describe('(Gmail Only) The background color of the folder.'),
		text_color: z
			.string()
			.nullish()
			.describe('(Gmail Only) The text color of the folder.'),
		is_system: z
			.boolean()
			.nullish()
			.describe(
				'(Gmail Only) If `true`, the label is created by Google. If `false`, the label was created by the user.',
			),
		parent_id: z
			.string()
			.nullish()
			.describe('(Outlook only) The ID of the parent folder.'),
	})
	.loose();

const DraftsCreateShape5 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the draft.'),
		thread_id: z
			.string()
			.nullish()
			.describe(
				'The ID of the thread the draft belongs to. For IMAP drafts, this field is present only when the server provides a native thread ID.',
			),
		body: z.string().describe('The body of the draft.'),
		snippet: z.string().describe('The snippet (preview) of the draft.'),
		subject: z.string().describe('The subject of the draft.'),
		from: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe('The list of attendees that the email should be sent from.'),
		to: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe('The list of attendees that the email should be sent to.'),
		cc: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe("The list of attendees that the email should be CC'd to."),
		bcc: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe("The list of attendees that the email should be BCC'd to."),
		reply_to: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe('The list of attendees that the replies should be sent to.'),
		attachments: z
			.array(EmailsGetShape3)
			.describe('The attachments of the draft.'),
		folders: z
			.array(z.string())
			.describe(
				'The folder the draft is in. For Gmail, the labels assigned to the draft.',
			),
		categories: z
			.array(z.string())
			.nullish()
			.describe('List of categories assigned to the draft.'),
	})
	.loose();

const EmailsGetShape6 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the email.'),
		message_id: z
			.string()
			.describe(
				'The Message-ID header value of the email. Use `id` in Unipile requests.',
			),
		thread_id: z
			.string()
			.nullish()
			.describe(
				'The thread identifier. For IMAP, Unipile uses the server-provided thread ID when available.',
			),
		body: z
			.string()
			.describe(
				'The complete body of the email: HTML when available, otherwise plain text. An empty string when the email has no body or meta_only=true.',
			),
		body_plain: z
			.string()
			.describe(
				'The complete plain-text body of the email. Uses the original plain-text version when available, otherwise text converted from HTML.',
			),
		snippet: z
			.string()
			.describe(
				'A short preview of the email, not its complete plain-text body. Use body_plain for the full text.',
			),
		subject: z.string().describe('The subject of the email.'),
		headers: z
			.array(z.object({ name: z.string(), value: z.string() }).loose())
			.describe(
				'List of headers. A single email can sometimes have multiple headers with the same key name.',
			),
		from: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe('The list of attendees that the email was sent from.'),
		to: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.nullish()
			.describe('The list of attendees that the email was sent to.'),
		cc: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.describe(
				"The list of attendees that the email was CC'd to. An empty array when none are available.",
			),
		bcc: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.describe(
				"The list of attendees that the email was BCC'd to. An empty array when none are available.",
			),
		reply_to: z
			.array(
				z
					.object({ email: z.string(), display_name: z.string().nullish() })
					.loose(),
			)
			.describe(
				'The list of attendees that the replies should be sent to. An empty array when none are available.',
			),
		date: z
			.string()
			.describe(
				'The date the email was sent. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		attachments: z
			.array(EmailsGetShape3)
			.describe('The attachments of the email.'),
		folders: z
			.array(z.string())
			.describe(
				'The IDs of folders the email is in. For Gmail, the IDs of labels assigned to the email, excluding the UNREAD system label, which is exposed through is_unread in…',
			),
		categories: z
			.array(z.string())
			.nullish()
			.describe('List of categories assigned to the email.'),
		is_unread: z
			.boolean()
			.describe(
				'Is the email unread. For Gmail, this reflects the UNREAD system label.',
			),
	})
	.loose();

export const EmailInputSchemas = {
	emailsList: z.object({
		account_id: AccountId,
		q: z.string().optional(),
		meta_only: z.boolean().optional(),
		to: z.string().optional(),
		from: z.string().optional(),
		any_email: z.string().optional(),
		has_attachment: z.boolean().optional(),
		is_starred: z.boolean().optional(),
		is_unread: z.boolean().optional(),
		before: z.string().optional(),
		exclude_folder: z.string().optional(),
		after: z.string().optional(),
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	emailsListInFolder: z.object({
		folder_id: z
			.string()
			.min(1)
			.describe('ID of the Folder to retrieve emails from.'),
		account_id: AccountId,
		q: z.string().optional(),
		meta_only: z.boolean().optional(),
		to: z.string().optional(),
		from: z.string().optional(),
		any_email: z.string().optional(),
		has_attachment: z.boolean().optional(),
		is_starred: z.boolean().optional(),
		is_unread: z.boolean().optional(),
		before: z.string().optional(),
		exclude_folder: z.string().optional(),
		after: z.string().optional(),
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	emailsGetThread: z.object({
		thread_id: z
			.string()
			.min(1)
			.describe(
				'ID of the thread to retrieve. For IMAP, use the thread_id returned by an email; results based on header-derived IDs may be incomplete.',
			),
		account_id: AccountId,
		meta_only: z.boolean().optional(),
	}),
	emailsGet: z.object({
		email_id: z.string().min(1).describe('ID of the Email to retrieve.'),
		account_id: AccountId,
		meta_only: z.boolean().optional(),
	}),
	emailsTrash: z.object({
		email_id: z.string().min(1).describe('ID of the Email to trash.'),
		account_id: AccountId,
	}),
	emailsGetAttachment: BinaryFileInput.extend({
		email_id: z.string().min(1),
		attachment_id: z.string().min(1),
		account_id: AccountId,
	}),
	emailsModify: z.object({
		email_id: z.string().min(1).describe('ID of the Email to modify.'),
		account_id: AccountId,
		folders_ids: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'The ID(s) of the folder(s) to apply, overwriting all folders previously associated with the Email. Outlook emails can be in a single folder only. Google allows a single email to appear in multiple folders.',
			),
		specifics: z
			.object({
				outlook: z
					.object({
						categories: z
							.array(z.string())
							.optional()
							.describe(
								'Categories to assign to the email, overwriting all previously assigned categories. An empty array removes all categories.',
							),
					})
					.loose()
					.optional()
					.describe(
						'Specific options to apply if the provider of the targeted account is Outlook.',
					),
			})
			.loose()
			.optional(),
	}),
	emailsMarkRead: z.object({
		email_id: z.string().min(1).describe('ID of the Email to mark as read.'),
		account_id: AccountId,
	}),
	emailsMarkUnread: z.object({
		email_id: z.string().min(1).describe('ID of the Email to mark as unread.'),
		account_id: AccountId,
	}),
	emailsSend: z.object({
		account_id: AccountId,
		html: z
			.string()
			.optional()
			.describe('The HTML content of the email. Required for tracking.'),
		plain_text: z
			.string()
			.optional()
			.describe('The plain text content of the email.'),
		subject: z.string().optional().describe('Subject of the email.'),
		from: z
			.object({
				email: z.string().describe('The email address of the attendee.'),
				display_name: z
					.string()
					.optional()
					.describe('The display name of the attendee if any.'),
			})
			.loose()
			.optional(),
		to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.describe('List of attendees to set in `to` header.'),
		cc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe('List of attendees to set in `cc` header.'),
		bcc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe('List of attendees to set in `bcc` header.'),
		reply_to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe(
				'List of attendees to set in the standard `Reply-To` header. Recipients answering the email will reply to these addresses instead of `from`. To reply inside an existing conversation, use `reply_to_message_id` instead.',
			),
		reply_to_message_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The ID of the email message that you're replying to. For Gmail and Outlook, this is the provider ID for the email message that you're replying to.",
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
					content_id: z
						.string()
						.optional()
						.describe(
							'The Content-ID (CID) to give to the file, without the surrounding angle brackets. When set, the file is sent as an inline attachment and can be referenced from the HTML content with `cid:`, for example ``.',
						),
				}),
			)
			.optional()
			.describe('The list of file attachments to the email.'),
		custom_headers: z
			.array(z.object({ name: z.string(), value: z.string() }).loose())
			.optional()
			.describe(
				'An array of custom headers to add to the email. Each header overrides any existing header with the same name (case-insensitive), including headers set by other fields such as `to`, `cc`, `bcc`, `from`, `subject`, or `reply_to`.',
			),
		tracking_options: z
			.object({
				opens: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.open` when the email is opened by the recipient.',
					),
				clicks: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.click` when the recipient click on a link in the email content.',
					),
				label: z
					.string()
					.optional()
					.describe(
						'A label to be sent in the tracking event. This can help you to identify the sent email.',
					),
				custom_domain: z
					.string()
					.optional()
					.describe(
						'A custom domain verified for the organization, enabled for the application, and pointing to https://track.lnk-fllw.com.',
					),
			})
			.optional()
			.describe('Configuration of tracking for this email.'),
	}),
	emailsListSenders: z.object({ account_id: AccountId }),
	draftsList: z.object({
		account_id: AccountId,
		to: z.string().optional(),
		from: z.string().optional(),
		any_email: z.string().optional(),
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	draftsCreate: z.object({
		account_id: AccountId,
		html: z
			.string()
			.optional()
			.describe('The HTML content of the draft. Required for tracking.'),
		plain_text: z
			.string()
			.optional()
			.describe('The plain text content of the draft.'),
		subject: z.string().optional().describe('Subject of the draft.'),
		from: z
			.object({
				email: z.string().describe('The email address of the attendee.'),
				display_name: z
					.string()
					.optional()
					.describe('The display name of the attendee if any.'),
			})
			.loose()
			.optional(),
		to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.describe(
				'List of attendees to set in `to` header. An empty list clears the header.',
			),
		cc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe(
				'List of attendees to set in `cc` header. An empty list clears the header.',
			),
		bcc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe(
				'List of attendees to set in `bcc` header. An empty list clears the header.',
			),
		reply_to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe(
				'List of attendees to set in the standard `Reply-To` header. Recipients answering the email will reply to these addresses instead of `from`. To reply inside an existing conversation, use `reply_to_message_id` instead.',
			),
		reply_to_message_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The ID of the email message that you're replying to. For Gmail and Outlook, use the provider message ID. For IMAP, use the RFC822 Message-ID header.",
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
					content_id: z
						.string()
						.optional()
						.describe(
							'The Content-ID (CID) to give to the file, without the surrounding angle brackets. When set, the file is sent as an inline attachment and can be referenced from the HTML content with `cid:`, for example ``.',
						),
				}),
			)
			.optional()
			.describe(
				'The list of file attachments to the draft. For Outlook, each attachment must be smaller than 3 MB.',
			),
		tracking_options: z
			.object({
				opens: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.open` when the email is opened by the recipient.',
					),
				clicks: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.click` when the recipient click on a link in the email content.',
					),
				label: z
					.string()
					.optional()
					.describe(
						'A label to be sent in the tracking event. This can help you to identify the sent email.',
					),
				custom_domain: z
					.string()
					.optional()
					.describe(
						'A custom domain verified for the organization, enabled for the application, and pointing to https://track.lnk-fllw.com.',
					),
			})
			.optional()
			.describe('Configuration of tracking for this email.'),
	}),
	draftsGet: z.object({ draft_id: z.string().min(1), account_id: AccountId }),
	draftsUpdate: z.object({
		draft_id: z.string().min(1),
		account_id: AccountId,
		html: z
			.string()
			.optional()
			.describe('The HTML content of the draft. Required for tracking.'),
		plain_text: z
			.string()
			.optional()
			.describe('The plain text content of the draft.'),
		subject: z.string().optional().describe('Subject of the draft.'),
		from: z
			.object({
				email: z.string().describe('The email address of the attendee.'),
				display_name: z
					.string()
					.optional()
					.describe('The display name of the attendee if any.'),
			})
			.loose()
			.optional(),
		to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe('List of attendees to set in `to` header.'),
		cc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe('List of attendees to set in `cc` header.'),
		bcc: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe('List of attendees to set in `bcc` header.'),
		reply_to: z
			.array(
				z
					.object({
						email: z.string().describe('The email address of the attendee.'),
						display_name: z
							.string()
							.optional()
							.describe('The display name of the attendee if any.'),
					})
					.loose(),
			)
			.optional()
			.describe(
				'List of attendees to set in the standard `Reply-To` header. Recipients answering the email will reply to these addresses instead of `from`. To reply inside an existing conversation, use `reply_to_message_id` instead.',
			),
		reply_to_message_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The ID of the email message that you're replying to. For Gmail, use the provider message ID. For IMAP, use the RFC822 Message-ID header.",
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
					content_id: z
						.string()
						.optional()
						.describe(
							'The Content-ID (CID) to give to the file, without the surrounding angle brackets. When set, the file is sent as an inline attachment and can be referenced from the HTML content with `cid:`, for example ``.',
						),
				}),
			)
			.optional()
			.describe(
				'The list of file attachments to the draft. Any attachment already existing will be removed and replaced by the new ones. For Outlook, each attachment must be smaller than 3 MB.',
			),
		tracking_options: z
			.object({
				opens: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.open` when the email is opened by the recipient.',
					),
				clicks: z
					.boolean()
					.optional()
					.describe(
						'If `true`, trigger webhooks listening to `tracking.click` when the recipient click on a link in the email content.',
					),
				label: z
					.string()
					.optional()
					.describe(
						'A label to be sent in the tracking event. This can help you to identify the sent email.',
					),
				custom_domain: z
					.string()
					.optional()
					.describe(
						'A custom domain verified for the organization, enabled for the application, and pointing to https://track.lnk-fllw.com.',
					),
			})
			.optional()
			.describe('Configuration of tracking for this email.'),
		specifics: z
			.object({
				outlook: z
					.object({
						categories: z
							.array(z.string())
							.optional()
							.describe('List of categories to assign to the draft.'),
					})
					.loose()
					.optional()
					.describe(
						'Specific options to apply if the provider of the targeted account is Outlook.',
					),
			})
			.loose()
			.optional(),
	}),
	draftsDelete: z.object({
		draft_id: z.string().min(1),
		account_id: AccountId,
	}),
	draftsSend: z.object({
		draft_id: z.string().min(1).describe('ID of the draft to send.'),
		account_id: AccountId,
	}),
	foldersList: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	foldersCreate: z.object({
		account_id: AccountId,
		name: z
			.string()
			.describe('Name of the folder. For Gmail, name of the label.'),
		parent_id: z
			.string()
			.optional()
			.describe('(Outlook only) ID of the parent folder.'),
		text_color: z
			.string()
			.optional()
			.describe(
				'(Gmail only) Hexadecimal color code for the text of the label.',
			),
		background_color: z
			.string()
			.optional()
			.describe(
				'(Gmail only) Hexadecimal color code for the background of the label.',
			),
	}),
	foldersGet: z.object({
		folder_id: z
			.string()
			.min(1)
			.describe('ID of the Folder / Label to retrieve.'),
		account_id: AccountId,
	}),
	foldersUpdate: z.object({
		folder_id: z
			.string()
			.min(1)
			.describe('ID of the Folder / Label to update.'),
		account_id: AccountId,
		name: z
			.string()
			.optional()
			.describe('Name of the folder. For Gmail, name of the label.'),
		parent_id: z
			.string()
			.optional()
			.describe('(Outlook only) ID of the parent folder.'),
		text_color: z
			.string()
			.optional()
			.describe(
				'(Gmail only) Hexadecimal color code for the text of the label.',
			),
		background_color: z
			.string()
			.optional()
			.describe(
				'(Gmail only) Hexadecimal color code for the background of the label.',
			),
	}),
	foldersDelete: z.object({
		folder_id: z
			.string()
			.min(1)
			.describe('ID of the Folder / Label to delete.'),
		account_id: AccountId,
	}),
} as const;

export const EmailOutputSchemas = {
	emailsList: EmailsListShape2,
	emailsListInFolder: EmailsListShape2,
	emailsGetThread: z
		.object({
			object: z.string(),
			id: z.string().describe('The ID of the thread.'),
			emails: z.array(EmailsListShape1),
		})
		.loose(),
	emailsGet: EmailsGetShape6,
	emailsTrash: z.object({ object: z.string() }).loose(),
	emailsGetAttachment: BinaryFileSchema,
	emailsModify: EmailsGetShape6,
	emailsMarkRead: z.object({ object: z.string() }).loose(),
	emailsMarkUnread: z.object({ object: z.string() }).loose(),
	emailsSend: z
		.object({
			object: z.string(),
			id: z.string().describe('The ID of the email.'),
			message_id: z
				.string()
				.nullish()
				.describe(
					'The Message-ID header value of the email. Use `id` in Unipile requests. May be absent when the header could not be retrieved after sending (the email has been s…',
				),
		})
		.loose(),
	emailsListSenders: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						email: z.string(),
						display_name: z.string().nullish(),
						is_primary: z.boolean(),
						is_default: z.boolean().nullish(),
						verification_status: z.string(),
						signature: z.string().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	draftsList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						thread_id: z.string().nullish(),
						body: z.string(),
						snippet: z.string(),
						subject: z.string(),
						from: z.array(z.unknown()).nullish(),
						to: z.array(z.unknown()).nullish(),
						cc: z.array(z.unknown()).nullish(),
						bcc: z.array(z.unknown()).nullish(),
						reply_to: z.array(z.unknown()).nullish(),
						attachments: z.array(z.unknown()),
						folders: z.array(z.string()),
						categories: z.array(z.string()).nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	draftsCreate: DraftsCreateShape5,
	draftsGet: DraftsCreateShape5,
	draftsUpdate: DraftsCreateShape5,
	draftsDelete: NoContentSchema,
	draftsSend: z
		.object({
			object: z.string(),
			id: z.string().describe('The ID of the email.'),
			message_id: z
				.string()
				.nullish()
				.describe(
					'The Message-ID header value of the email. Use `id` in Unipile requests. May be absent when the header could not be retrieved after sending (the email has been s…',
				),
		})
		.loose(),
	foldersList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						name: z.string(),
						role: z.string().nullish(),
						total_count: z.number(),
						unread_count: z.number(),
						background_color: z.string().nullish(),
						text_color: z.string().nullish(),
						is_system: z.boolean().nullish(),
						parent_id: z.string().nullish(),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	foldersCreate: FoldersCreateShape4,
	foldersGet: FoldersCreateShape4,
	foldersUpdate: FoldersCreateShape4,
	foldersDelete: NoContentSchema,
} as const;

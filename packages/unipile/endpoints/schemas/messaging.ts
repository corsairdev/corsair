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

const MessagesGetShape1 = z
	.object({
		id: z.string(),
		object: z.string(),
		type: z.string(),
		public_identifier: z.string().nullish(),
		display_name: z.string(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		profile_url: z.string().nullish(),
		public_picture_url: z.string().nullish(),
		private_picture_download_url: z.string().nullish(),
		description: z.string().nullish(),
		specifics: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const MessagesGetShape2 = z
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

const ChatsUpdateShape3 = z
	.object({
		id: z
			.string()
			.describe(
				'Unique identifier of the user for the provider. Usually an internal identifier used by the API only.',
			),
		object: z.string(),
		type: z
			.string()
			.describe(
				'Type of the user - `individual` is an individual user. - `organization` is an organization / business entity. - `other` is an other type of entity.',
			),
		public_identifier: z
			.string()
			.nullish()
			.describe(
				'Public identifier of the user for the provider. Usually a shareable tag visible in urls and profiles.',
			),
		display_name: z
			.string()
			.describe('Display name of the user as exposed by the provider.'),
		first_name: z.string().nullish().describe('First name of the user.'),
		last_name: z.string().nullish().describe('Last name of the user.'),
		profile_url: z
			.string()
			.nullish()
			.describe('Public url to the profile of the user.'),
		public_picture_url: z
			.string()
			.nullish()
			.describe('Public url to the profile picture of the user.'),
		private_picture_download_url: z
			.string()
			.nullish()
			.describe(
				'Private url to download the profile picture of the user. This url require authentication.',
			),
		description: z.string().nullish().describe('Description of the user.'),
		specifics: z.unknown().nullish().describe('Provider-specific user data.'),
	})
	.loose();

const MessagesGetShape4 = z
	.object({
		user_id: z
			.string()
			.nullish()
			.describe(
				'ID of the participant who left or was removed from the group.',
			),
		user_name: z
			.string()
			.nullish()
			.describe(
				'Name of the participant who left or was removed from the group.',
			),
		reason: z
			.string()
			.nullish()
			.describe(
				'Specifies whether the participant left voluntarily or was removed by an admin.',
			),
		title: z.string().nullish().describe('The updated title.'),
		description: z.string().nullish().describe('The updated description.'),
		call_id: z.string().nullish().describe('Unique identifier of the call.'),
		is_video: z
			.boolean()
			.nullish()
			.describe('Indicates whether the call is a video call.'),
		link: z.string().nullish().describe('The link used to join the call.'),
		start: z
			.string()
			.nullish()
			.describe('Start date and time of the call in ISO format.'),
		end: z
			.string()
			.nullish()
			.describe('End date and time of the call in ISO format.'),
		duration: z
			.number()
			.nullish()
			.describe('Duration of the call in seconds (if applicable).'),
		message_id: z
			.string()
			.nullish()
			.describe('ID of the message that was pinned or unpinned.'),
		is_pin: z
			.boolean()
			.nullish()
			.describe(
				'Indicates whether the message is pinned (true) or unpinned (false).',
			),
		subject: z.string().nullish().describe('The updated subject.'),
		reaction: z.string().nullish().describe('The reaction added or removed.'),
	})
	.loose();

export const MessagingInputSchemas = {
	inboxesList: z.object({ account_id: AccountId }),
	inboxesListChats: z.object({
		inbox_id: z
			.string()
			.min(1)
			.describe(
				'ID of the Inbox to retrieve Chats from. Use List all Inboxes to get the ID of an inbox.',
			),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
		type: z.enum(['1to1', 'group', 'channel']).optional(),
		before: z.string().optional(),
		after: z.string().optional(),
		is_archived: z.boolean().optional(),
		is_unread: z.boolean().optional(),
	}),
	inboxesStartChat: z.object({
		inbox_id: z
			.string()
			.min(1)
			.describe(
				'ID of the Inbox to start the Chat in. Use List all Inboxes to get the ID of an inbox.',
			),
		account_id: AccountId,
		text: z
			.string()
			.describe(
				"The textual content of the first message to be sent in the chat. It's recommended not to use HTML or Markdown. Use empty string to start a chat without a message (if supported by the provider).",
			),
		name: z
			.string()
			.optional()
			.describe(
				'A custom name for the chat. Some providers allow custom names only on groups. Default is made of participant names.',
			),
		users_ids: z
			.union([z.array(z.string().min(1)).min(1), z.string().min(1)])
			.describe(
				'Participant(s) of the chat. To start a 1to1 chat, pass a single user id as a string. To start a group, pass an array of user ids. Passing an array with a single user id will attempt to start a group with that user only.',
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
					send_mode: z
						.enum(['file', 'native'])
						.optional()
						.describe(
							'Defines how the attachment should be sent, if the provider supports multiple modes. Omitted: use the provider’s native default behavior. - `file` send as a regular uploaded file.',
						),
					voice_note: z
						.boolean()
						.optional()
						.describe(
							'Deprecated compatibility flag for audio attachments. Use `send_mode: "native"` instead.',
						),
				}),
			)
			.optional()
			.describe(
				'The list of attachments (uploaded files or a shared post or job) to be sent with the message.',
			),
		specifics: z
			.object({
				linkedin: z
					.object({
						classic: z
							.object({
								inmail: z
									.boolean()
									.optional()
									.describe(
										'Whether the chat should be started with an InMail.',
									),
								company_topic: z
									.enum([
										'SERVICE_REQUEST',
										'REQUEST_A_DEMO',
										'SUPPORT',
										'CAREERS',
										'OTHER',
									])
									.optional()
									.describe('The topic for a conversation with a company.'),
								relation_request_id: z
									.string()
									.optional()
									.describe(
										"If you'd like to start a conversation with a user you received a relation request from, the ID of the request is mandatory.",
									),
								applicant: z
									.object({
										id: z
											.string()
											.describe('The applicant ID of the recipient.'),
										messaging_token: z
											.string()
											.describe(
												'The messaging token to be retrieved using the Get an Applicant endpoint.',
											),
									})
									.loose()
									.optional()
									.describe(
										'Options available when the recipient is a candidate for one of your job postings.',
									),
								shared_content: z
									.object({
										type: z
											.enum(['POST', 'JOB_POSTING'])
											.describe('The type of content.'),
										id: z
											.string()
											.describe('The ID of the content to be shared.'),
									})
									.loose()
									.optional()
									.describe(
										'A specific content to be shared in the current message.',
									),
							})
							.optional()
							.describe('Specific options for a LinkedIn classic chat.'),
						sales_navigator: z
							.object({
								subject: z.string().describe('The subject of the chat.'),
							})
							.optional()
							.describe(
								'Specific options for a LinkedIn sales navigator chat.',
							),
						recruiter: z
							.object({
								subject: z.string().describe('The subject of the chat.'),
								signature: z.string().describe('The signature of the sender.'),
								visibility: z
									.enum(['PUBLIC', 'PRIVATE', 'PROJECT'])
									.optional()
									.describe(
										'The level of visibility of the conversation within your organization.',
									),
								intent: z
									.enum(['HIRE_FOR_CLIENT', 'HIRE_FOR_OWN_COMPANY'])
									.optional()
									.describe('The purpose of the chat.'),
								send_as: z
									.enum(['INMAIL', 'EMAIL'])
									.optional()
									.describe('Whether to send the message via InMail or email.'),
								email: z
									.string()
									.optional()
									.describe(
										'The recipient email address to use when send_as is EMAIL. Takes precedence over the primary email from the recipient profile.',
									),
								channel_type: z
									.enum([
										'CAREER_SITE',
										'MANUAL_IMPORT',
										'INTERNAL_CANDIDATES',
										'RECRUITER_SEARCH',
										'REFERRAL',
										'JOB_POSTING_RECOMMENDED_MATCHES',
										'AUTOMATED_SOURCING',
										'JOB_POSTING',
									])
									.optional()
									.describe(
										'The channel from the hiring project talent pool from which to start the chat.',
									),
								follow_up: z
									.object({
										subject: z.string().describe('The subject of the message.'),
										text: z
											.string()
											.describe('The textual content of the message.'),
										attachments: z
											.array(
												z.object({
													content: z
														.unknown()
														.describe(
															'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
														),
													content_type: z
														.unknown()
														.describe('MIME type of the file.'),
													filename: z
														.unknown()
														.describe(
															'Name of the file (including extension).',
														),
													metadata: z
														.unknown()
														.optional()
														.describe('Metadata of the the file.'),
													send_mode: z
														.unknown()
														.optional()
														.describe(
															'Defines how the attachment should be sent, if the provider supports multiple modes. Omitted: use the provider’s native default behavior. - `file` send as a regular uploaded file.',
														),
													voice_note: z
														.unknown()
														.optional()
														.describe(
															'Deprecated compatibility flag for audio attachments. Use `send_mode: "native"` instead.',
														),
												}),
											)
											.optional()
											.describe(
												'The list of file attachments to the message to be sent in the chat.',
											),
										scheduled_for: z
											.union([
												z
													.object({
														days: z
															.unknown()
															.describe('Days from now to send the message.'),
														timezone: z
															.unknown()
															.optional()
															.describe(
																"The time zone from which the message is scheduled (e.g. 'Europe/Paris', 'America/Phoenix'...).",
															),
													})
													.loose(),
												z
													.object({
														weeks: z
															.unknown()
															.describe('Weeks from now to send the message.'),
														timezone: z
															.unknown()
															.optional()
															.describe(
																"The time zone from which the message is scheduled (e.g. 'Europe/Paris', 'America/Phoenix'...).",
															),
													})
													.loose(),
											])
											.describe(
												'The time frame within which to send the message.',
											),
									})
									.loose()
									.optional()
									.describe(
										'A follow-up message to be scheduled (Recruiter Pro contracts only).',
									),
							})
							.optional()
							.describe('Specific options for a LinkedIn recruiter chat.'),
					})
					.loose()
					.optional()
					.describe(
						'Specific options to apply if the provider of the targeted account is Linkedin',
					),
			})
			.loose()
			.optional()
			.describe('Object containing provider-specific chat data.'),
	}),
	chatsUpdate: z.object({
		chat_id: z.string().min(1).describe('ID of the Chat to update.'),
		account_id: AccountId,
		name: z
			.string()
			.optional()
			.describe(
				'A custom name for the chat. Some providers allow custom names only on groups.',
			),
		pin_status: z
			.boolean()
			.optional()
			.describe(
				'If supported, set to `true` to pin the chat at the top of the list, or `false` to unpin it.',
			),
		archive_status: z
			.boolean()
			.optional()
			.describe(
				'If supported, set to `true` to archive the chat, or `false` to move it back to the main inbox.',
			),
		label: z
			.string()
			.optional()
			.describe(
				'If supported, associate the chat with the given label. For Whatsapp, this is resolved by label name and created if missing.',
			),
		muted_until: z
			.union([z.boolean(), z.string()])
			.optional()
			.describe(
				'If supported, the date until which the conversation should be muted. Else `true` to mute the chat for an indefinite time, else `false` to un-mute an already muted chat.',
			),
		read_status: z
			.boolean()
			.optional()
			.describe(
				'Set to `true` to mark the chat as read. This is useful when displaying the list of messages in your app. Set to `false` to mark the chat as unread.',
			),
	}),
	chatsDelete: z.object({
		chat_id: z.string().min(1).describe('ID of the Chat to delete.'),
		account_id: AccountId,
	}),
	chatsGetPicture: BinaryFileInput.extend({
		chat_id: z.string().min(1),
		account_id: AccountId,
	}),
	chatsListParticipants: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('ID of the Chat to retrieve participants from.'),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	chatsAddParticipant: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat to add the participant to.'),
		account_id: AccountId,
		user_id: z
			.string()
			.min(1)
			.describe('The ID of the User to add as participant.'),
	}),
	chatsRemoveParticipant: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat to remove the participant from.'),
		user_id: z
			.string()
			.min(1)
			.describe('The ID of the User to remove from the chat.'),
		account_id: AccountId,
	}),
	chatsSetComposing: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('ID of the Chat where the composing action is taking place.'),
		account_id: AccountId,
		action: z.enum(['typing', 'recording']),
	}),
	messagesGet: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message to retrieve.'),
		account_id: AccountId,
	}),
	messagesDelete: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z.string().min(1).describe('The ID of the Message to delete.'),
		account_id: AccountId,
	}),
	messagesForward: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z.string().min(1).describe('The ID of the Message to forward.'),
		account_id: AccountId,
		to_chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat to forward the message to.'),
		text: z
			.string()
			.optional()
			.describe('Text to be attached to the forwarded message.'),
	}),
	messagesEdit: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z.string().min(1).describe('The ID of the Message to modify.'),
		account_id: AccountId,
		text: z
			.string()
			.describe(
				"The new textual content of the message. It's recommended not to use HTML or Markdown.",
			),
	}),
	messagesMarkRead: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message to mark as read.'),
		account_id: AccountId,
	}),
	messagesPin: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message to pin or unpin.'),
		account_id: AccountId,
		pin_status: z
			.boolean()
			.describe(
				'Set to `true` to pin the message in the chat, or `false` to unpin it.',
			),
		specifics: z
			.object({
				whatsapp: z
					.object({
						pin_duration: z
							.enum(['24_hours', '7_days', '30_days'])
							.optional()
							.describe(
								'How long the message should stay pinned, Whatsapp unpinning it by itself once elapsed. - `24_hours` for a day. - `7_days` for a week. - `30_days` for a month.',
							),
					})
					.optional()
					.describe('Specific options for pinning a WhatsApp message.'),
			})
			.loose()
			.optional()
			.describe('Object containing provider-specific pin data.'),
	}),
	messagesListReactions: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message to retrieve reactions from.'),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	messagesAddReaction: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message to add the reaction to.'),
		account_id: AccountId,
		reaction: z.string().describe('The emoji unicode.'),
	}),
	messagesRemoveReaction: z.object({
		chat_id: z
			.string()
			.min(1)
			.describe('The ID of the Chat where the message is.'),
		message_id: z
			.string()
			.min(1)
			.describe('The ID of the Message where the reaction is.'),
		account_id: AccountId,
		reaction: z.string().describe('The emoji unicode to be removed.'),
	}),
	messagesGetAttachment: BinaryFileInput.extend({
		chat_id: z.string().min(1),
		message_id: z.string().min(1),
		attachment_id: z.string().min(1),
		account_id: AccountId,
	}),
	contactsList: z.object({
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
} as const;

export const MessagingOutputSchemas = {
	inboxesList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						description: z.string().nullish(),
						disabled: z.boolean(),
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
	inboxesListChats: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						name: z.string(),
						label: z.string().nullish(),
						description: z.string().nullish(),
						public_picture_url: z.string().nullish(),
						private_picture_download_url: z.string().nullish(),
						image_url: z.string().nullish(),
						created_at: z.string().nullish(),
						updated_at: z.string().nullish(),
						last_message_timestamp: z.string().nullish(),
						muted_until: z.union([z.string(), z.boolean()]),
						creator_id: z.string().nullish(),
						user_id: z.string().nullish(),
						is_group: z.boolean(),
						is_1to1: z.boolean(),
						is_channel: z.boolean(),
						type: z.string(),
						is_pinned: z.boolean(),
						is_readonly: z.boolean(),
						is_archived: z.boolean(),
						folders: z.array(z.string()),
						participants_count: z.number().nullish(),
						unread_count: z.number(),
						restrictions: z.array(z.string()).nullish(),
						last_message: z.record(z.string(), z.unknown()).nullish(),
						provider: z.string(),
						specifics: z.unknown().nullish(),
						user: z.record(z.string(), z.unknown()).nullish(),
						participants: z.array(z.unknown()).nullish(),
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
	inboxesStartChat: z
		.object({
			object: z.string(),
			chat_id: z.string().describe('The ID of the started chat.'),
			message_id: z
				.unknown()
				.describe(
					'The ID of the message sent. Some providers send attachments separately from the text content, which can result in multiple sent message IDs.',
				),
		})
		.loose(),
	chatsUpdate: z
		.object({
			object: z.string(),
			id: z
				.string()
				.describe('The unique identifier of the chat for the provider.'),
			name: z
				.string()
				.describe(
					'The name / title of the chat. If the provider does not provide a name, name is built out of participants usernames.',
				),
			label: z
				.string()
				.nullish()
				.describe(
					'If supported by the provider, a label associated with the chat.',
				),
			description: z
				.string()
				.nullish()
				.describe('The description / subject of the chat.'),
			public_picture_url: z
				.string()
				.nullish()
				.describe('Public URL of the chat picture.'),
			private_picture_download_url: z
				.string()
				.nullish()
				.describe(
					'Private URL to download the chat picture. This URL requires authentication.',
				),
			image_url: z
				.string()
				.nullish()
				.describe(
					'The URL of the chat image. Use public_picture_url or private_picture_download_url instead.',
				),
			created_at: z
				.string()
				.nullish()
				.describe(
					'The creation date of the chat. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			updated_at: z
				.string()
				.nullish()
				.describe(
					'The last update date of the chat. Use ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ). Some providers update this field on new messages.',
				),
			last_message_timestamp: z
				.string()
				.nullish()
				.describe(
					'The timestamp of the last message in the chat. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			muted_until: z
				.union([z.string(), z.boolean()])
				.describe(
					'The date until the chat is muted. Use ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ). Is `true` if muted indefinitely.',
				),
			creator_id: z
				.string()
				.nullish()
				.describe('The ID of the user who created the chat.'),
			user_id: z
				.string()
				.nullish()
				.describe('The ID of the other participant in the chat if 1to1 chat.'),
			is_group: z.boolean().describe('Is the chat a group chat.'),
			is_1to1: z.boolean().describe('Is the chat a 1to1 chat.'),
			is_channel: z.boolean().describe('Is the chat a channel chat.'),
			type: z
				.string()
				.describe(
					'The type of the chat. - `group` is a group chat. - `1to1` is a 1to1 chat. - `channel` is a channel chat.',
				),
			is_pinned: z
				.boolean()
				.describe(
					'Is the chat pinned at the top of the list, if supported by the provider.',
				),
			is_readonly: z
				.boolean()
				.describe(
					'Is the chat read-only for the current user. Trying to send messages in read-only chats will fail.',
				),
			is_archived: z
				.boolean()
				.describe(
					'Is the chat archived. Archived chats are usually hidden from the chat list.',
				),
			folders: z
				.array(z.string())
				.describe('A list of folders the chat belongs to.'),
			participants_count: z
				.number()
				.nullish()
				.describe(
					'The number of participants in the chat if the chat is a group.',
				),
			unread_count: z
				.number()
				.describe(
					'The number of unread messages in the chat. `0` if the chat is read, `-1` if the chat was manually marked as unread by the user and does not have any unread mess…',
				),
			restrictions: z
				.array(z.string())
				.nullish()
				.describe(
					'List of action restrictions of the chat. - `send_message` is the permission to send messages.',
				),
			participants: z
				.array(
					z
						.object({
							object: z.string(),
							user: z.record(z.string(), z.unknown()),
							is_self: z.boolean(),
							is_admin: z.boolean(),
						})
						.loose(),
				)
				.nullish()
				.describe('List of participants in the chat if group chat.'),
			last_message: z
				.object({
					object: z.string().nullish(),
					id: z.string().nullish().describe('The ID of the message.'),
					text: z
						.string()
						.nullish()
						.describe('The text content of the message.'),
					sender_display_name: z
						.string()
						.nullish()
						.describe('The display name of the sender of the message.'),
					is_sender: z
						.boolean()
						.nullish()
						.describe('Is the message sent by the current user.'),
					sender_id: z
						.string()
						.nullish()
						.describe('The ID of the user who sent the message.'),
					chat_id: z
						.string()
						.nullish()
						.describe('The ID of the chat where the message was sent.'),
					timestamp: z
						.string()
						.nullish()
						.describe(
							'The timestamp of the message. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
						),
					is_hidden: z
						.boolean()
						.nullish()
						.describe(
							'Is the message hidden. Hidden messages are usually not displayed in the chat but can be as last message is chats list.',
						),
					is_seen: z
						.boolean()
						.nullish()
						.describe('Is the message seen by other participants.'),
					is_delivered: z
						.boolean()
						.nullish()
						.describe('Is the message delivered to the other participants.'),
					is_deleted: z
						.boolean()
						.nullish()
						.describe(
							'Is the message deleted. Some providers show the message as deleted in the chat.',
						),
					is_edited: z
						.boolean()
						.nullish()
						.describe(
							'Is the message edited. Some providers adds an "edited" mark on the message in the chat.',
						),
					is_pinned: z
						.boolean()
						.nullish()
						.describe(
							'Is the message pinned. Pinned messages are usually displayed at the top of the chat.',
						),
					is_event: z
						.boolean()
						.nullish()
						.describe(
							'Is the message an event. Events are special messages that are not displayed in the chat but can be used to trigger actions.',
						),
					is_mentionned: z
						.boolean()
						.nullish()
						.describe(
							'Is the message mentionning the current user. Usually to notify.',
						),
					view_mode: z
						.string()
						.nullish()
						.describe(
							'How the ephemeral content of this message may be viewed: `once` for a single opening, `replayable` when the sender allowed it to be opened again.',
						),
					event_type: z
						.number()
						.nullish()
						.describe(
							'The type of message event. 0 : Unknown (Not implemented) 1 : Chat name update 2 : Chat description update 3 : New participant added to the chat group 4 : Partic…',
						),
					event_metadata: z
						.object({
							user_id: z.string().nullish(),
							user_name: z.string().nullish(),
							reason: z.string().nullish(),
							title: z.string().nullish(),
							description: z.string().nullish(),
							call_id: z.string().nullish(),
							is_video: z.boolean().nullish(),
							link: z.string().nullish(),
							start: z.string().nullish(),
							end: z.string().nullish(),
							duration: z.number().nullish(),
							message_id: z.string().nullish(),
							is_pin: z.boolean().nullish(),
							subject: z.string().nullish(),
							reaction: z.string().nullish(),
						})
						.loose()
						.nullish(),
					content_relation: z
						.object({ type: z.string(), attachment_id: z.string().nullish() })
						.loose()
						.nullish(),
					reactions_counter: z
						.array(z.unknown())
						.nullish()
						.describe('A list of reactions to the element.'),
					sender: z
						.object({
							id: z.string(),
							object: z.string(),
							type: z.string(),
							public_identifier: z.string().nullish(),
							display_name: z.string(),
							first_name: z.string().nullish(),
							last_name: z.string().nullish(),
							profile_url: z.string().nullish(),
							public_picture_url: z.string().nullish(),
							private_picture_download_url: z.string().nullish(),
							description: z.string().nullish(),
							specifics: z.unknown().nullish(),
						})
						.loose()
						.nullish()
						.describe('The user who sent the message.'),
					provider: z
						.string()
						.nullish()
						.describe(
							"The provider's of the Account. - `mock` is mock. - `whatsapp` is WhatsApp. - `linkedin` is LinkedIn. - `instagram` is Instagram. - `google` is Google.",
						),
					attachments: z
						.array(z.unknown())
						.nullish()
						.describe('List of message attachments.'),
					hyperlinks: z
						.array(z.unknown())
						.nullish()
						.describe('List of message hyperlinks.'),
					quoted: z
						.object({
							object: z.string(),
							id: z.string(),
							text: z.string().nullish(),
							specifics: z.unknown().nullish(),
							attachments: z.array(z.unknown()),
							sender: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish()
						.describe('The quoted message.'),
					forwarded: z
						.object({
							text: z.string().nullish(),
							specifics: z.unknown().nullish(),
							attachments: z.array(z.unknown()),
							sender: z.record(z.string(), z.unknown()).nullish(),
							object: z.string(),
						})
						.loose()
						.nullish()
						.describe(
							'Contains the original message if this message was forwarded from another chat, depending on provider support.',
						),
					specifics: z.unknown().nullish(),
				})
				.loose()
				.nullish()
				.describe('The last message in the chat.'),
			user: ChatsUpdateShape3.nullish().describe(
				'The other participant if 1to1 chat.',
			),
			provider: z
				.string()
				.describe(
					"The provider's of the Account. - `mock` is mock. - `whatsapp` is WhatsApp. - `linkedin` is LinkedIn. - `instagram` is Instagram. - `google` is Google.",
				),
			specifics: z.unknown().nullish(),
		})
		.loose(),
	chatsDelete: NoContentSchema,
	chatsGetPicture: BinaryFileSchema,
	chatsListParticipants: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						is_self: z.boolean(),
						is_admin: z.boolean(),
						user: z.record(z.string(), z.unknown()),
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
	chatsAddParticipant: z.object({ object: z.string() }).loose(),
	chatsRemoveParticipant: z.object({ object: z.string() }).loose(),
	chatsSetComposing: z.object({ object: z.string() }).loose(),
	messagesGet: z
		.object({
			object: z.string(),
			id: z
				.string()
				.describe('The unique identifier of the message for the provider.'),
			text: z.string().nullish().describe('The text content of the message.'),
			sender_id: z
				.string()
				.describe('The ID of the user who sent the message.'),
			chat_id: z
				.string()
				.describe('The ID of the chat where the message was sent.'),
			timestamp: z
				.string()
				.describe(
					'The timestamp of the message. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			is_sender: z
				.boolean()
				.describe('Is the current user the sender of the message.'),
			is_hidden: z
				.boolean()
				.describe(
					'Is the message hidden. Hidden messages are usually not displayed in the chat but can be as last message is chats list.',
				),
			is_seen: z
				.boolean()
				.describe('Is the message seen by other participants.'),
			is_delivered: z
				.boolean()
				.describe('Is the message delivered to the other participants.'),
			is_deleted: z
				.boolean()
				.describe(
					'Is the message deleted. Some providers show the message as deleted in the chat.',
				),
			is_edited: z
				.boolean()
				.describe(
					'Is the message edited. Some providers adds an "edited" mark on the message in the chat.',
				),
			is_pinned: z
				.boolean()
				.describe(
					'Is the message pinned. Pinned messages are usually displayed at the top of the chat.',
				),
			is_event: z
				.boolean()
				.describe(
					'Is the message an event. Events are special messages that are not displayed in the chat but can be used to trigger actions.',
				),
			is_mentionned: z
				.boolean()
				.describe(
					'Is the message mentionning the current user. Usually to notify.',
				),
			view_mode: z
				.string()
				.nullish()
				.describe(
					'How the ephemeral content of this message may be viewed: `once` for a single opening, `replayable` when the sender allowed it to be opened again.',
				),
			event_type: z
				.number()
				.nullish()
				.describe(
					'The type of message event. 0 : Unknown (Not implemented) 1 : Chat name update 2 : Chat description update 3 : New participant added to the chat group 4 : Partic…',
				),
			event_metadata: MessagesGetShape4.nullish(),
			content_relation: z
				.object({
					type: z
						.string()
						.describe(
							'How this message relates to a piece of shared content: a normal reply to it, or a provider-generated notice that the current user was mentioned in it.',
						),
					attachment_id: z
						.string()
						.nullish()
						.describe(
							"The id of this message's shared-content attachment describing the related content, when the provider still makes it available.",
						),
				})
				.loose()
				.nullish(),
			reactions_counter: z
				.array(z.object({ reaction: z.string(), count: z.number() }).loose())
				.describe('A list of reactions to the element.'),
			provider: z
				.string()
				.describe(
					"The provider's of the Account. - `mock` is mock. - `whatsapp` is WhatsApp. - `linkedin` is LinkedIn. - `instagram` is Instagram. - `google` is Google.",
				),
			attachments: z
				.array(MessagesGetShape2)
				.describe('List of message attachments.'),
			hyperlinks: z
				.array(
					z
						.object({
							url: z.string(),
							starts_at: z.number(),
							length: z.number(),
						})
						.loose(),
				)
				.describe('List of message hyperlinks.'),
			specifics: z
				.object({
					type: z
						.string()
						.nullish()
						.describe(
							'The category of the message: a regular message, an email, a connection invitation, or an InMail lifecycle event.',
						),
					subject: z.string().nullish().describe('The subject of the message.'),
					interactive: z
						.object({
							type: z.string(),
							title: z.string().nullish(),
							footer: z.string().nullish(),
							buttons: z.array(z.unknown()),
							selected_button: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish()
						.describe(
							'WhatsApp interactive content available in the received provider payload. The body is exposed in text.',
						),
				})
				.loose()
				.nullish()
				.describe('Object containing provider-specific message data.'),
			sender: z
				.object({
					id: z
						.string()
						.describe(
							'Unique identifier of the user for the provider. Usually an internal identifier used by the API only.',
						),
					object: z.string(),
					type: z
						.string()
						.describe(
							'Type of the user - `individual` is an individual user. - `organization` is an organization / business entity. - `other` is an other type of entity.',
						),
					public_identifier: z
						.string()
						.nullish()
						.describe(
							'Public identifier of the user for the provider. Usually a shareable tag visible in urls and profiles.',
						),
					display_name: z
						.string()
						.describe('Display name of the user as exposed by the provider.'),
					first_name: z.string().nullish().describe('First name of the user.'),
					last_name: z.string().nullish().describe('Last name of the user.'),
					profile_url: z
						.string()
						.nullish()
						.describe('Public url to the profile of the user.'),
					public_picture_url: z
						.string()
						.nullish()
						.describe('Public url to the profile picture of the user.'),
					private_picture_download_url: z
						.string()
						.nullish()
						.describe(
							'Private url to download the profile picture of the user. This url require authentication.',
						),
					description: z
						.string()
						.nullish()
						.describe('Description of the user.'),
					specifics: z
						.object({
							contact_name: z.string().nullish(),
							messaging_identifier: z.string().nullish(),
							location: z.string().nullish(),
							network_distance: z.string().nullish(),
							industry: z.string().nullish(),
							is_following: z.boolean().nullish(),
							followers_count: z.number().nullish(),
							relations_count: z.number().nullish(),
							shared_relations_count: z.number().nullish(),
							website_url: z.string().nullish(),
							portfolio_url: z.string().nullish(),
							services_page_url: z.string().nullish(),
							is_premium: z.boolean().nullish(),
							is_verified: z.boolean().nullish(),
						})
						.loose()
						.nullish()
						.describe('Object containing provider-specific user profile data.'),
				})
				.loose()
				.nullish()
				.describe('The user who sent the message.'),
			quoted: z
				.object({
					object: z.string(),
					id: z
						.string()
						.describe('The unique identifier of the message for the provider.'),
					text: z
						.string()
						.nullish()
						.describe('The text content of the message.'),
					attachments: z
						.array(z.unknown())
						.describe('List of message attachments.'),
					sender: MessagesGetShape1.nullish().describe(
						'The user who sent the message.',
					),
					specifics: z
						.object({
							interactive: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish()
				.describe('The quoted message.'),
			forwarded: z
				.object({
					text: z
						.string()
						.nullish()
						.describe('The text content of the message.'),
					attachments: z
						.array(z.unknown())
						.describe('List of message attachments.'),
					object: z.string(),
					sender: MessagesGetShape1.nullish().describe(
						'The user who sent the message.',
					),
					specifics: z
						.object({
							interactive: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish(),
				})
				.loose()
				.nullish()
				.describe(
					'Contains the original message if this message was forwarded from another chat, depending on provider support.',
				),
		})
		.loose(),
	messagesDelete: NoContentSchema,
	messagesForward: z
		.object({
			object: z.string(),
			message_id: z
				.string()
				.describe('The ID of the message created in the destination chat.'),
			chat_id: z
				.string()
				.describe('The ID of the Chat where the message was forwarded to.'),
		})
		.loose(),
	messagesEdit: z
		.object({
			object: z.string().nullish(),
			id: z
				.string()
				.nullish()
				.describe('The unique identifier of the message for the provider.'),
			text: z.string().nullish().describe('The text content of the message.'),
			sender_id: z
				.string()
				.nullish()
				.describe('The ID of the user who sent the message.'),
			chat_id: z
				.string()
				.nullish()
				.describe('The ID of the chat where the message was sent.'),
			timestamp: z
				.string()
				.nullish()
				.describe(
					'The timestamp of the message. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			is_sender: z
				.boolean()
				.nullish()
				.describe('Is the current user the sender of the message.'),
			is_hidden: z
				.boolean()
				.nullish()
				.describe(
					'Is the message hidden. Hidden messages are usually not displayed in the chat but can be as last message is chats list.',
				),
			is_seen: z
				.boolean()
				.nullish()
				.describe('Is the message seen by other participants.'),
			is_delivered: z
				.boolean()
				.nullish()
				.describe('Is the message delivered to the other participants.'),
			is_deleted: z
				.boolean()
				.nullish()
				.describe(
					'Is the message deleted. Some providers show the message as deleted in the chat.',
				),
			is_edited: z
				.boolean()
				.nullish()
				.describe(
					'Is the message edited. Some providers adds an "edited" mark on the message in the chat.',
				),
			is_pinned: z
				.boolean()
				.nullish()
				.describe(
					'Is the message pinned. Pinned messages are usually displayed at the top of the chat.',
				),
			is_event: z
				.boolean()
				.nullish()
				.describe(
					'Is the message an event. Events are special messages that are not displayed in the chat but can be used to trigger actions.',
				),
			is_mentionned: z
				.boolean()
				.nullish()
				.describe(
					'Is the message mentionning the current user. Usually to notify.',
				),
			view_mode: z
				.string()
				.nullish()
				.describe(
					'How the ephemeral content of this message may be viewed: `once` for a single opening, `replayable` when the sender allowed it to be opened again.',
				),
			event_type: z
				.number()
				.nullish()
				.describe(
					'The type of message event. 0 : Unknown (Not implemented) 1 : Chat name update 2 : Chat description update 3 : New participant added to the chat group 4 : Partic…',
				),
			event_metadata: MessagesGetShape4.nullish(),
			content_relation: z
				.object({
					type: z
						.string()
						.describe(
							'How this message relates to a piece of shared content: a normal reply to it, or a provider-generated notice that the current user was mentioned in it.',
						),
					attachment_id: z
						.string()
						.nullish()
						.describe(
							"The id of this message's shared-content attachment describing the related content, when the provider still makes it available.",
						),
				})
				.loose()
				.nullish(),
			reactions_counter: z
				.array(z.object({ reaction: z.string(), count: z.number() }).loose())
				.nullish()
				.describe('A list of reactions to the element.'),
			sender: ChatsUpdateShape3.nullish().describe(
				'The user who sent the message.',
			),
			provider: z
				.string()
				.nullish()
				.describe(
					"The provider's of the Account. - `mock` is mock. - `whatsapp` is WhatsApp. - `linkedin` is LinkedIn. - `instagram` is Instagram. - `google` is Google.",
				),
			attachments: z
				.array(MessagesGetShape2)
				.nullish()
				.describe('List of message attachments.'),
			hyperlinks: z
				.array(
					z
						.object({
							url: z.string(),
							starts_at: z.number(),
							length: z.number(),
						})
						.loose(),
				)
				.nullish()
				.describe('List of message hyperlinks.'),
			quoted: z
				.object({
					object: z.string(),
					id: z
						.string()
						.describe('The unique identifier of the message for the provider.'),
					text: z
						.string()
						.nullish()
						.describe('The text content of the message.'),
					specifics: z.unknown().nullish(),
					attachments: z
						.array(z.unknown())
						.describe('List of message attachments.'),
					sender: z
						.object({
							id: z.string(),
							object: z.string(),
							type: z.string(),
							public_identifier: z.string().nullish(),
							display_name: z.string(),
							first_name: z.string().nullish(),
							last_name: z.string().nullish(),
							profile_url: z.string().nullish(),
							public_picture_url: z.string().nullish(),
							private_picture_download_url: z.string().nullish(),
							description: z.string().nullish(),
							specifics: z.unknown().nullish(),
						})
						.loose()
						.nullish()
						.describe('The user who sent the message.'),
				})
				.loose()
				.nullish()
				.describe('The quoted message.'),
			forwarded: z
				.object({
					text: z
						.string()
						.nullish()
						.describe('The text content of the message.'),
					specifics: z.unknown().nullish(),
					attachments: z
						.array(z.unknown())
						.describe('List of message attachments.'),
					sender: z
						.object({
							id: z.string(),
							object: z.string(),
							type: z.string(),
							public_identifier: z.string().nullish(),
							display_name: z.string(),
							first_name: z.string().nullish(),
							last_name: z.string().nullish(),
							profile_url: z.string().nullish(),
							public_picture_url: z.string().nullish(),
							private_picture_download_url: z.string().nullish(),
							description: z.string().nullish(),
							specifics: z.unknown().nullish(),
						})
						.loose()
						.nullish()
						.describe('The user who sent the message.'),
					object: z.string(),
				})
				.loose()
				.nullish()
				.describe(
					'Contains the original message if this message was forwarded from another chat, depending on provider support.',
				),
			specifics: z.unknown().nullish(),
		})
		.loose()
		.nullable(),
	messagesMarkRead: z.object({ object: z.string() }).loose(),
	messagesPin: z.object({ object: z.string() }).loose(),
	messagesListReactions: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						value: z.string(),
						is_sender: z.boolean(),
						sender: z.record(z.string(), z.unknown()),
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
	messagesAddReaction: z.object({ object: z.string() }).loose(),
	messagesRemoveReaction: z.object({ object: z.string() }).loose(),
	messagesGetAttachment: BinaryFileSchema,
	contactsList: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						user: z.record(z.string(), z.unknown()).nullish(),
						public_picture_url: z.string().nullish(),
						private_picture_download_url: z.string().nullish(),
						picture_url: z.string().nullish(),
						first_name: z.string().nullish(),
						middle_name: z.string().nullish(),
						last_name: z.string().nullish(),
						display_name: z.string().nullish(),
						suffix: z.string().nullish(),
						birth_date: z.string().nullish(),
						company_name: z.string().nullish(),
						job_title: z.string().nullish(),
						manager_name: z.string().nullish(),
						office_location: z.string().nullish(),
						notes: z.string().nullish(),
						emails: z.array(z.string()).nullish(),
						phone_numbers: z.array(z.string()).nullish(),
						social_handles: z.record(z.string(), z.unknown()).nullish(),
						addresses: z.array(z.unknown()).nullish(),
						websites: z.array(z.string()).nullish(),
						groups: z.array(z.unknown()).nullish(),
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
} as const;

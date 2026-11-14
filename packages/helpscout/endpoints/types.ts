import { z } from 'zod';

// ── Common HAL and Pagination schemas ────────────────────────────────────────

export const PageInfoSchema = z.object({
	size: z.number().int().optional(),
	totalElements: z.number().int().optional(),
	totalPages: z.number().int().optional(),
	number: z.number().int().optional(),
});

export const HalLinkSchema = z.object({
	href: z.string(),
});

export const HalLinksSchema = z
	.object({
		self: HalLinkSchema.optional(),
		first: HalLinkSchema.optional(),
		last: HalLinkSchema.optional(),
		next: HalLinkSchema.optional(),
		previous: HalLinkSchema.optional(),
		page: HalLinkSchema.optional(),
	})
	.passthrough()
	.optional();

// `unknown` because empty responses (201 Created or 204 No Content) return no payload or arbitrary metadata.
export const EmptyResponseSchema = z
	.record(z.string(), z.unknown())
	.optional()
	.default({});

// ── Mailboxes ────────────────────────────────────────────────────────────────

export const MailboxSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		slug: z.string().optional(),
		email: z.string(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

export const ListMailboxesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
});

export const ListMailboxesResponseSchema = z
	.object({
		_embedded: z.object({
			mailboxes: z.array(MailboxSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

export const GetMailboxInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const GetMailboxResponseSchema = MailboxSchema;

// ── Folders ──────────────────────────────────────────────────────────────────

export const FolderSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		type: z.string().optional(),
		userId: z.number().int().optional(),
		totalCount: z.number().int().optional(),
		activeCount: z.number().int().optional(),
		modifiedAt: z.string().optional(),
	})
	.passthrough();

export const ListFoldersInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	page: z.number().int().min(1).optional(),
});

export const ListFoldersResponseSchema = z
	.object({
		_embedded: z.object({
			folders: z.array(FolderSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

// ── Custom Fields ────────────────────────────────────────────────────────────

export const CustomFieldOptionSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		order: z.number().int().optional(),
	})
	.passthrough();

export const CustomFieldSchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		type: z.string().optional(),
		required: z.boolean().optional(),
		order: z.number().int().optional(),
		options: z.array(CustomFieldOptionSchema).optional(),
	})
	.passthrough();

export const ListCustomFieldsInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	page: z.number().int().min(1).optional(),
});

export const ListCustomFieldsResponseSchema = z
	.object({
		_embedded: z.object({
			fields: z.array(CustomFieldSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

// ── Conversations ────────────────────────────────────────────────────────────

export const ConversationUserRefSchema = z
	.object({
		id: z.number().int().optional(),
		type: z.string().optional(),
		first: z.string().optional(),
		last: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

export const ConversationCustomerRefSchema = z
	.object({
		id: z.number().int().optional(),
		first: z.string().optional(),
		last: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

export const ConversationSourceSchema = z
	.object({
		type: z.string().optional(),
		via: z.string().optional(),
	})
	.passthrough();

export const ConversationTagRefSchema = z
	.object({
		id: z.number().int().optional(),
		tag: z.string(),
		slug: z.string().optional(),
	})
	.passthrough();

export const ConversationSchema = z
	.object({
		id: z.number().int(),
		number: z.number().int().optional(),
		threadsCount: z.number().int().optional(),
		type: z.string().optional(),
		folderId: z.number().int().optional(),
		status: z.string().optional(),
		state: z.string().optional(),
		subject: z.string().optional(),
		preview: z.string().optional(),
		mailboxId: z.number().int().optional(),
		assignee: ConversationUserRefSchema.nullable().optional(),
		createdBy: ConversationUserRefSchema.nullable().optional(),
		createdAt: z.string().optional(),
		closedBy: z.number().int().nullable().optional(),
		closedAt: z.string().nullable().optional(),
		userUpdatedAt: z.string().optional(),
		customer: ConversationCustomerRefSchema.nullable().optional(),
		source: ConversationSourceSchema.optional(),
		tags: z.array(z.union([z.string(), ConversationTagRefSchema])).optional(),
		_embedded: z
			.object({
				// `unknown` because embedded threads can contain various sub-thread types and metadata.
				threads: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ListConversationsInputSchema = z.object({
	mailbox: z.union([z.number().int(), z.string()]).optional(),
	folder: z.union([z.number().int(), z.string()]).optional(),
	status: z
		.enum(['all', 'active', 'open', 'closed', 'pending', 'spam'])
		.optional(),
	tag: z.string().optional(),
	assigned_to: z.union([z.number().int(), z.string()]).optional(),
	modifiedSince: z.string().optional(),
	number: z.number().int().optional(),
	sortField: z.enum(['createdAt', 'modifiedAt', 'number', 'status']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	page: z.number().int().min(1).optional(),
	embed: z.enum(['threads']).optional(),
	query: z.string().optional(),
});

export const ListConversationsResponseSchema = z
	.object({
		_embedded: z.object({
			conversations: z.array(ConversationSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

export const GetConversationInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	embed: z.enum(['threads']).optional(),
});

export const GetConversationResponseSchema = ConversationSchema;

export const AttachmentInputSchema = z.object({
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
	data: z.string().min(1), // Base64-encoded file data
});

export const InitialThreadInputSchema = z.object({
	type: z.enum(['customer', 'reply', 'note', 'phone', 'chat']),
	text: z.string().min(1),
	customer: z
		.object({
			id: z.number().int().optional(),
			email: z.string().email().optional(),
		})
		.optional(),
	user: z.number().int().optional(),
	draft: z.boolean().optional(),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreateConversationInputSchema = z.object({
	subject: z.string().min(1),
	type: z.enum(['email', 'chat', 'phone']),
	mailboxId: z.number().int(),
	customer: z.object({
		id: z.number().int().optional(),
		email: z.string().email().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
	}),
	status: z.enum(['active', 'pending', 'closed', 'spam']).optional(),
	assignTo: z.number().int().optional(),
	createdAt: z.string().optional(),
	threads: z.array(InitialThreadInputSchema).min(1),
	tags: z.array(z.string()).optional(),
	fields: z
		.array(
			z.object({
				id: z.number().int(),
				value: z.string(),
			}),
		)
		.optional(),
});

export const CreateConversationResponseSchema = EmptyResponseSchema;

export const UpdateConversationInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	op: z.enum(['replace', 'add', 'remove', 'move']),
	path: z.enum([
		'/subject',
		'/primaryCustomer.id',
		'/draft',
		'/mailboxId',
		'/status',
		'/assignTo',
	]),
	value: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const UpdateConversationResponseSchema = EmptyResponseSchema;

export const DeleteConversationInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const DeleteConversationResponseSchema = EmptyResponseSchema;

export const UpdateConversationFieldsInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	fields: z.array(
		z.object({
			id: z.number().int(),
			value: z.string(),
		}),
	),
});

export const UpdateConversationFieldsResponseSchema = EmptyResponseSchema;

export const UpdateConversationTagsInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	tags: z.array(z.string()),
});

export const UpdateConversationTagsResponseSchema = EmptyResponseSchema;

// ── Threads ──────────────────────────────────────────────────────────────────

export const ThreadSchema = z
	.object({
		id: z.number().int(),
		type: z.string().optional(),
		status: z.string().optional(),
		state: z.string().optional(),
		action: z
			.object({
				type: z.string().optional(),
				text: z.string().optional(),
			})
			.passthrough()
			.optional(),
		body: z.string().optional(),
		source: ConversationSourceSchema.optional(),
		customer: ConversationCustomerRefSchema.nullable().optional(),
		createdBy: ConversationUserRefSchema.nullable().optional(),
		assignedTo: ConversationUserRefSchema.nullable().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const ListThreadsInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	page: z.number().int().min(1).optional(),
});

export const ListThreadsResponseSchema = z
	.object({
		_embedded: z.object({
			threads: z.array(ThreadSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

export const CreateReplyThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	customer: z.object({
		id: z.number().int().optional(),
		email: z.string().email().optional(),
	}),
	text: z.string().min(1),
	user: z.number().int().optional(),
	draft: z.boolean().optional(),
	status: z.enum(['active', 'pending', 'closed', 'spam']).optional(),
	assignTo: z.number().int().optional(),
	cc: z.array(z.string().email()).optional(),
	bcc: z.array(z.string().email()).optional(),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreateReplyThreadResponseSchema = EmptyResponseSchema;

export const CreateNoteThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	text: z.string().min(1),
	user: z.number().int().optional(),
	status: z.enum(['active', 'pending', 'closed', 'spam']).optional(),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreateNoteThreadResponseSchema = EmptyResponseSchema;

export const CreateChatThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	customer: z.object({
		id: z.number().int().optional(),
		email: z.string().email().optional(),
	}),
	text: z.string().min(1),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreateChatThreadResponseSchema = EmptyResponseSchema;

export const CreatePhoneThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	customer: z.object({
		id: z.number().int().optional(),
		email: z.string().email().optional(),
	}),
	text: z.string().min(1),
	user: z.number().int().optional(),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreatePhoneThreadResponseSchema = EmptyResponseSchema;

export const CreateCustomerThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	customer: z.object({
		id: z.number().int().optional(),
		email: z.string().email().optional(),
	}),
	text: z.string().min(1),
	attachments: z.array(AttachmentInputSchema).optional(),
});

export const CreateCustomerThreadResponseSchema = EmptyResponseSchema;

export const UpdateThreadInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	threadId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	op: z.literal('replace'),
	path: z.enum(['/text', '/hidden']),
	value: z.union([z.string(), z.boolean()]),
});

export const UpdateThreadResponseSchema = EmptyResponseSchema;

export const GetOriginalSourceInputSchema = z.object({
	conversationId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	threadId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const GetOriginalSourceResponseSchema = z
	.object({
		data: z.string().optional(),
	})
	.passthrough();

// ── Customers ────────────────────────────────────────────────────────────────

export const CustomerEmailSchema = z
	.object({
		id: z.number().int().optional(),
		value: z.string(),
		type: z.string().optional(),
	})
	.passthrough();

export const CustomerPhoneSchema = z
	.object({
		id: z.number().int().optional(),
		value: z.string(),
		type: z.string().optional(),
	})
	.passthrough();

export const CustomerAddressSchema = z
	.object({
		id: z.number().int().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		postalCode: z.string().optional(),
		country: z.string().optional(),
		lines: z.array(z.string()).optional(),
		address: z.string().optional(),
		address2: z.string().optional(),
	})
	.passthrough();

export const CustomerItemSchema = z
	.object({
		id: z.number().int().optional(),
		value: z.string(),
		type: z.string().optional(),
	})
	.passthrough();

export const CustomerSchema = z
	.object({
		id: z.number().int(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		jobTitle: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		photoUrl: z.string().nullable().optional(),
		photoType: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		age: z.string().nullable().optional(),
		organization: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		_embedded: z
			.object({
				emails: z.array(CustomerEmailSchema).optional(),
				phones: z.array(CustomerPhoneSchema).optional(),
				address: CustomerAddressSchema.nullable().optional(),
				chats: z.array(CustomerItemSchema).optional(),
				socialProfiles: z.array(CustomerItemSchema).optional(),
				websites: z.array(CustomerItemSchema).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const ListCustomersInputSchema = z.object({
	mailbox: z.union([z.number().int(), z.string()]).optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	query: z.string().optional(),
	sortField: z.enum(['createdAt', 'modifiedAt', 'score']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	page: z.number().int().min(1).optional(),
});

export const ListCustomersResponseSchema = z
	.object({
		_embedded: z.object({
			customers: z.array(CustomerSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

export const GetCustomerInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const GetCustomerResponseSchema = CustomerSchema;

export const CreateCustomerInputSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	jobTitle: z.string().optional(),
	company: z.string().optional(),
	photoUrl: z.string().url().optional(),
	photoType: z.string().optional(),
	organization: z.string().optional(),
	emails: z
		.array(
			z.object({
				value: z.string().email(),
				type: z.enum(['work', 'home', 'other']).optional(),
			}),
		)
		.optional(),
	phones: z
		.array(
			z.object({
				value: z.string(),
				type: z
					.enum(['work', 'home', 'mobile', 'fax', 'pager', 'other'])
					.optional(),
			}),
		)
		.optional(),
	address: z
		.object({
			address: z.string().optional(),
			address2: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			postalCode: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
});

export const CreateCustomerResponseSchema = EmptyResponseSchema;

export const UpdateCustomerInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	jobTitle: z.string().optional(),
	company: z.string().optional(),
	photoUrl: z.string().url().optional(),
	photoType: z.string().optional(),
	organization: z.string().optional(),
});

export const UpdateCustomerResponseSchema = EmptyResponseSchema;

export const PatchCustomerInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	op: z.enum(['replace', 'add', 'remove']),
	path: z.string(),
	value: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const PatchCustomerResponseSchema = EmptyResponseSchema;

export const DeleteCustomerInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const DeleteCustomerResponseSchema = EmptyResponseSchema;

export const CustomerAddressInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	address: z.string().optional(),
	address2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
});

export const CustomerAddressResponseSchema = EmptyResponseSchema;

export const DeleteCustomerAddressInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const DeleteCustomerAddressResponseSchema = EmptyResponseSchema;

export const CustomerEmailInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string().email(),
	type: z.enum(['work', 'home', 'other']).optional(),
});

export const UpdateCustomerEmailInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	emailId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string().email(),
	type: z.enum(['work', 'home', 'other']).optional(),
});

export const DeleteCustomerEmailInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	emailId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const CustomerPhoneInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.enum(['work', 'home', 'mobile', 'fax', 'pager', 'other']).optional(),
});

export const UpdateCustomerPhoneInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	phoneId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.enum(['work', 'home', 'mobile', 'fax', 'pager', 'other']).optional(),
});

export const DeleteCustomerPhoneInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	phoneId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const CustomerChatInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.string().optional(),
});

export const UpdateCustomerChatInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	chatId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.string().optional(),
});

export const DeleteCustomerChatInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	chatId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const CustomerSocialProfileInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.string().optional(),
});

export const UpdateCustomerSocialProfileInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	profileId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string(),
	type: z.string().optional(),
});

export const DeleteCustomerSocialProfileInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	profileId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const CustomerWebsiteInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string().url(),
	type: z.string().optional(),
});

export const UpdateCustomerWebsiteInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	websiteId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	value: z.string().url(),
	type: z.string().optional(),
});

export const DeleteCustomerWebsiteInputSchema = z.object({
	customerId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	websiteId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

// ── Tags ─────────────────────────────────────────────────────────────────────

export const TagSchema = z
	.object({
		id: z.number().int(),
		tag: z.string(),
		slug: z.string().optional(),
		ticketCount: z.number().int().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

export const ListTagsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
});

export const ListTagsResponseSchema = z
	.object({
		_embedded: z.object({
			tags: z.array(TagSchema),
		}),
		_links: HalLinksSchema,
		page: PageInfoSchema.optional(),
	})
	.passthrough();

export const GetTagInputSchema = z.object({
	tagId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const GetTagResponseSchema = TagSchema;

// ── Saved Replies ────────────────────────────────────────────────────────────

export const SavedReplySchema = z
	.object({
		id: z.number().int(),
		name: z.string(),
		preview: z.string().optional(),
		chatPreview: z.string().optional(),
		text: z.string().optional(),
		chatText: z.string().optional(),
	})
	.passthrough();

export const ListSavedRepliesInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	includeChatReplies: z.boolean().optional(),
	page: z.number().int().min(1).optional(),
});

export const ListSavedRepliesResponseSchema = z.union([
	z.array(SavedReplySchema),
	z
		.object({
			_embedded: z.object({
				savedReplies: z.array(SavedReplySchema),
			}),
			_links: HalLinksSchema,
			page: PageInfoSchema.optional(),
		})
		.passthrough(),
]);

export const GetSavedReplyInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	savedReplyId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const GetSavedReplyResponseSchema = SavedReplySchema;

export const CreateSavedReplyInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	name: z.string().min(1),
	text: z.string().optional(),
	chatText: z.string().optional(),
});

export const CreateSavedReplyResponseSchema = EmptyResponseSchema;

export const UpdateSavedReplyInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	savedReplyId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	name: z.string().min(1),
	text: z.string().optional(),
	chatText: z.string().optional(),
});

export const UpdateSavedReplyResponseSchema = EmptyResponseSchema;

export const DeleteSavedReplyInputSchema = z.object({
	mailboxId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
	savedReplyId: z.union([z.number().int(), z.string().regex(/^\d+$/)]),
});

export const DeleteSavedReplyResponseSchema = EmptyResponseSchema;

// ── Reports ──────────────────────────────────────────────────────────────────

export const ReportInputSchema = z.object({
	start: z.string(),
	end: z.string(),
	previousStart: z.string().optional(),
	previousEnd: z.string().optional(),
	mailboxes: z.string().optional(),
	tags: z.string().optional(),
	types: z.enum(['email', 'chat', 'phone']).optional(),
	folders: z.string().optional(),
});

// `unknown` because Help Scout reporting metrics return complex nested numerical statistical envelopes.
export const ReportResponseSchema = z.record(z.string(), z.unknown());

// ── Schemas Registry ─────────────────────────────────────────────────────────

export const HelpScoutEndpointInputSchemas = {
	// mailboxes
	'mailboxes.list': ListMailboxesInputSchema,
	'mailboxes.get': GetMailboxInputSchema,
	// folders
	'folders.list': ListFoldersInputSchema,
	// customFields
	'customFields.list': ListCustomFieldsInputSchema,
	// conversations
	'conversations.list': ListConversationsInputSchema,
	'conversations.get': GetConversationInputSchema,
	'conversations.create': CreateConversationInputSchema,
	'conversations.update': UpdateConversationInputSchema,
	'conversations.delete': DeleteConversationInputSchema,
	'conversations.updateFields': UpdateConversationFieldsInputSchema,
	'conversations.updateTags': UpdateConversationTagsInputSchema,
	// threads
	'threads.list': ListThreadsInputSchema,
	'threads.createReply': CreateReplyThreadInputSchema,
	'threads.createNote': CreateNoteThreadInputSchema,
	'threads.createChat': CreateChatThreadInputSchema,
	'threads.createPhone': CreatePhoneThreadInputSchema,
	'threads.createCustomer': CreateCustomerThreadInputSchema,
	'threads.update': UpdateThreadInputSchema,
	'threads.getOriginalSource': GetOriginalSourceInputSchema,
	// customers
	'customers.list': ListCustomersInputSchema,
	'customers.get': GetCustomerInputSchema,
	'customers.create': CreateCustomerInputSchema,
	'customers.update': UpdateCustomerInputSchema,
	'customers.patch': PatchCustomerInputSchema,
	'customers.delete': DeleteCustomerInputSchema,
	'customers.createAddress': CustomerAddressInputSchema,
	'customers.updateAddress': CustomerAddressInputSchema,
	'customers.deleteAddress': DeleteCustomerAddressInputSchema,
	'customers.createEmail': CustomerEmailInputSchema,
	'customers.updateEmail': UpdateCustomerEmailInputSchema,
	'customers.deleteEmail': DeleteCustomerEmailInputSchema,
	'customers.createPhone': CustomerPhoneInputSchema,
	'customers.updatePhone': UpdateCustomerPhoneInputSchema,
	'customers.deletePhone': DeleteCustomerPhoneInputSchema,
	'customers.createChat': CustomerChatInputSchema,
	'customers.updateChat': UpdateCustomerChatInputSchema,
	'customers.deleteChat': DeleteCustomerChatInputSchema,
	'customers.createSocialProfile': CustomerSocialProfileInputSchema,
	'customers.updateSocialProfile': UpdateCustomerSocialProfileInputSchema,
	'customers.deleteSocialProfile': DeleteCustomerSocialProfileInputSchema,
	'customers.createWebsite': CustomerWebsiteInputSchema,
	'customers.updateWebsite': UpdateCustomerWebsiteInputSchema,
	'customers.deleteWebsite': DeleteCustomerWebsiteInputSchema,
	// tags
	'tags.list': ListTagsInputSchema,
	'tags.get': GetTagInputSchema,
	// savedReplies
	'savedReplies.list': ListSavedRepliesInputSchema,
	'savedReplies.get': GetSavedReplyInputSchema,
	'savedReplies.create': CreateSavedReplyInputSchema,
	'savedReplies.update': UpdateSavedReplyInputSchema,
	'savedReplies.delete': DeleteSavedReplyInputSchema,
	// reports
	'reports.getConversations': ReportInputSchema,
	'reports.getCompany': ReportInputSchema,
	'reports.getEmail': ReportInputSchema,
	'reports.getChat': ReportInputSchema,
	'reports.getDocs': ReportInputSchema,
} as const;

export const HelpScoutEndpointOutputSchemas = {
	// mailboxes
	'mailboxes.list': ListMailboxesResponseSchema,
	'mailboxes.get': GetMailboxResponseSchema,
	// folders
	'folders.list': ListFoldersResponseSchema,
	// customFields
	'customFields.list': ListCustomFieldsResponseSchema,
	// conversations
	'conversations.list': ListConversationsResponseSchema,
	'conversations.get': GetConversationResponseSchema,
	'conversations.create': CreateConversationResponseSchema,
	'conversations.update': UpdateConversationResponseSchema,
	'conversations.delete': DeleteConversationResponseSchema,
	'conversations.updateFields': UpdateConversationFieldsResponseSchema,
	'conversations.updateTags': UpdateConversationTagsResponseSchema,
	// threads
	'threads.list': ListThreadsResponseSchema,
	'threads.createReply': CreateReplyThreadResponseSchema,
	'threads.createNote': CreateNoteThreadResponseSchema,
	'threads.createChat': CreateChatThreadResponseSchema,
	'threads.createPhone': CreatePhoneThreadResponseSchema,
	'threads.createCustomer': CreateCustomerThreadResponseSchema,
	'threads.update': UpdateThreadResponseSchema,
	'threads.getOriginalSource': GetOriginalSourceResponseSchema,
	// customers
	'customers.list': ListCustomersResponseSchema,
	'customers.get': GetCustomerResponseSchema,
	'customers.create': CreateCustomerResponseSchema,
	'customers.update': UpdateCustomerResponseSchema,
	'customers.patch': PatchCustomerResponseSchema,
	'customers.delete': DeleteCustomerResponseSchema,
	'customers.createAddress': CustomerAddressResponseSchema,
	'customers.updateAddress': CustomerAddressResponseSchema,
	'customers.deleteAddress': DeleteCustomerAddressResponseSchema,
	'customers.createEmail': EmptyResponseSchema,
	'customers.updateEmail': EmptyResponseSchema,
	'customers.deleteEmail': EmptyResponseSchema,
	'customers.createPhone': EmptyResponseSchema,
	'customers.updatePhone': EmptyResponseSchema,
	'customers.deletePhone': EmptyResponseSchema,
	'customers.createChat': EmptyResponseSchema,
	'customers.updateChat': EmptyResponseSchema,
	'customers.deleteChat': EmptyResponseSchema,
	'customers.createSocialProfile': EmptyResponseSchema,
	'customers.updateSocialProfile': EmptyResponseSchema,
	'customers.deleteSocialProfile': EmptyResponseSchema,
	'customers.createWebsite': EmptyResponseSchema,
	'customers.updateWebsite': EmptyResponseSchema,
	'customers.deleteWebsite': EmptyResponseSchema,
	// tags
	'tags.list': ListTagsResponseSchema,
	'tags.get': GetTagResponseSchema,
	// savedReplies
	'savedReplies.list': ListSavedRepliesResponseSchema,
	'savedReplies.get': GetSavedReplyResponseSchema,
	'savedReplies.create': CreateSavedReplyResponseSchema,
	'savedReplies.update': UpdateSavedReplyResponseSchema,
	'savedReplies.delete': DeleteSavedReplyResponseSchema,
	// reports
	'reports.getConversations': ReportResponseSchema,
	'reports.getCompany': ReportResponseSchema,
	'reports.getEmail': ReportResponseSchema,
	'reports.getChat': ReportResponseSchema,
	'reports.getDocs': ReportResponseSchema,
} as const;

export type HelpScoutEndpointInputs = {
	[K in keyof typeof HelpScoutEndpointInputSchemas]: z.infer<
		(typeof HelpScoutEndpointInputSchemas)[K]
	>;
};

export type HelpScoutEndpointOutputs = {
	[K in keyof typeof HelpScoutEndpointOutputSchemas]: z.infer<
		(typeof HelpScoutEndpointOutputSchemas)[K]
	>;
};

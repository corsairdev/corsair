import {
	AttachmentInputSchema,
	ConversationSchema,
	CreateConversationInputSchema,
	CreateCustomerInputSchema,
	CreateSavedReplyInputSchema,
	CustomerSchema,
	CustomFieldSchema,
	FolderSchema,
	GetConversationInputSchema,
	GetCustomerInputSchema,
	GetMailboxInputSchema,
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
	InitialThreadInputSchema,
	ListConversationsInputSchema,
	ListCustomersInputSchema,
	ListFoldersInputSchema,
	ListMailboxesInputSchema,
	ListSavedRepliesInputSchema,
	ListTagsInputSchema,
	MailboxSchema,
	PatchCustomerInputSchema,
	ReportInputSchema,
	SavedReplySchema,
	TagSchema,
	ThreadSchema,
	UpdateConversationInputSchema,
	UpdateThreadInputSchema,
} from './endpoints/types';
import { helpScoutEndpointMeta, helpScoutEndpointSchemas } from './index';
import { HelpScoutSchema } from './schema';

describe('Help Scout Schema & Types', () => {
	it('declares a valid semver version and empty entities schema', () => {
		expect(HelpScoutSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof HelpScoutSchema.entities).toBe('object');
		expect(Object.keys(HelpScoutSchema.entities)).toHaveLength(0);
	});

	it('keeps endpoint schemas and endpoint metadata in sync with equal key sets', () => {
		const schemaKeys = Object.keys(helpScoutEndpointSchemas).sort();
		const metaKeys = Object.keys(helpScoutEndpointMeta).sort();
		expect(schemaKeys).toEqual(metaKeys);
		expect(schemaKeys.length).toBe(55);
	});

	describe('Mailboxes Schemas', () => {
		it('validates ListMailboxesInputSchema', () => {
			expect(ListMailboxesInputSchema.parse({})).toEqual({});
			expect(ListMailboxesInputSchema.parse({ page: 2 })).toEqual({ page: 2 });
			expect(() => ListMailboxesInputSchema.parse({ page: -1 })).toThrow();
		});

		it('validates GetMailboxInputSchema', () => {
			expect(GetMailboxInputSchema.parse({ mailboxId: 100 })).toEqual({
				mailboxId: 100,
			});
			expect(GetMailboxInputSchema.parse({ mailboxId: '100' })).toEqual({
				mailboxId: '100',
			});
			expect(() => GetMailboxInputSchema.parse({ mailboxId: 'abc' })).toThrow();
		});

		it('validates MailboxSchema', () => {
			const valid = {
				id: 1,
				name: 'Support',
				slug: 'support',
				email: 'support@example.com',
				createdAt: '2026-01-01T00:00:00Z',
			};
			expect(MailboxSchema.parse(valid)).toMatchObject(valid);
			expect(() => MailboxSchema.parse({ id: 'bad' })).toThrow();
		});
	});

	describe('Folders & Custom Fields Schemas', () => {
		it('validates ListFoldersInputSchema & FolderSchema', () => {
			expect(ListFoldersInputSchema.parse({ mailboxId: 10 })).toEqual({
				mailboxId: 10,
			});
			const validFolder = {
				id: 5,
				name: 'Open',
				type: 'open',
				totalCount: 12,
				activeCount: 10,
			};
			expect(FolderSchema.parse(validFolder)).toMatchObject(validFolder);
		});

		it('validates CustomFieldSchema', () => {
			const validField = {
				id: 20,
				name: 'Account Tier',
				type: 'dropdown',
				required: true,
				options: [{ id: 1, name: 'VIP', order: 1 }],
			};
			expect(CustomFieldSchema.parse(validField)).toMatchObject(validField);
		});
	});

	describe('Conversations Schemas', () => {
		it('validates ListConversationsInputSchema filters and enums', () => {
			const parsed = ListConversationsInputSchema.parse({
				mailbox: 12,
				status: 'active',
				tag: 'urgent',
				sortField: 'modifiedAt',
				sortOrder: 'desc',
				embed: 'threads',
			});
			expect(parsed.status).toBe('active');
			expect(parsed.sortOrder).toBe('desc');
			expect(() =>
				ListConversationsInputSchema.parse({ status: 'invalid_status' }),
			).toThrow();
		});

		it('validates GetConversationInputSchema', () => {
			expect(
				GetConversationInputSchema.parse({
					conversationId: 50,
					embed: 'threads',
				}),
			).toEqual({ conversationId: 50, embed: 'threads' });
		});

		it('validates ConversationSchema shape', () => {
			const validConv = {
				id: 100,
				number: 42,
				type: 'email',
				status: 'active',
				subject: 'Help with login',
				mailboxId: 1,
				customer: { id: 200, first: 'Alice', email: 'alice@example.com' },
			};
			expect(ConversationSchema.parse(validConv)).toMatchObject(validConv);
		});

		it('validates CreateConversationInputSchema constraints', () => {
			const valid = {
				subject: 'Payment Question',
				type: 'email' as const,
				mailboxId: 10,
				customer: { email: 'customer@example.com', firstName: 'Bob' },
				threads: [
					{
						type: 'customer' as const,
						text: 'Where is my receipt?',
					},
				],
			};
			expect(CreateConversationInputSchema.parse(valid)).toMatchObject(valid);
			// Empty threads array should throw
			expect(() =>
				CreateConversationInputSchema.parse({ ...valid, threads: [] }),
			).toThrow();
		});

		it('validates UpdateConversationInputSchema (JSON Patch)', () => {
			const validPatch = {
				conversationId: 123,
				op: 'replace' as const,
				path: '/status' as const,
				value: 'closed',
			};
			expect(UpdateConversationInputSchema.parse(validPatch)).toEqual(
				validPatch,
			);
			expect(() =>
				UpdateConversationInputSchema.parse({
					conversationId: 123,
					op: 'invalid_op',
					path: '/status',
				}),
			).toThrow();
		});
	});

	describe('Threads Schemas', () => {
		it('validates AttachmentInputSchema', () => {
			const attachment = {
				fileName: 'invoice.pdf',
				mimeType: 'application/pdf',
				data: 'JVBERi0xLjQK...',
			};
			expect(AttachmentInputSchema.parse(attachment)).toEqual(attachment);
			expect(() =>
				AttachmentInputSchema.parse({ ...attachment, fileName: '' }),
			).toThrow();
		});

		it('validates InitialThreadInputSchema', () => {
			const thread = {
				type: 'reply' as const,
				text: 'Thank you for reaching out!',
				draft: false,
			};
			expect(InitialThreadInputSchema.parse(thread)).toMatchObject(thread);
			expect(() =>
				InitialThreadInputSchema.parse({ ...thread, text: '' }),
			).toThrow();
		});

		it('validates ThreadSchema output shape', () => {
			const validThread = {
				id: 999,
				type: 'reply',
				status: 'active',
				body: 'Reply message text',
				createdAt: '2026-01-01T12:00:00Z',
			};
			expect(ThreadSchema.parse(validThread)).toMatchObject(validThread);
		});

		it('validates UpdateThreadInputSchema (JSON Patch)', () => {
			const valid = {
				conversationId: 10,
				threadId: 20,
				op: 'replace' as const,
				path: '/text' as const,
				value: 'Updated text content',
			};
			expect(UpdateThreadInputSchema.parse(valid)).toEqual(valid);
		});
	});

	describe('Customers Schemas', () => {
		it('validates ListCustomersInputSchema & GetCustomerInputSchema', () => {
			expect(
				ListCustomersInputSchema.parse({
					email: 'test@example.com',
					sortField: 'createdAt',
					sortOrder: 'asc',
				}),
			).toMatchObject({ email: 'test@example.com' });
			expect(GetCustomerInputSchema.parse({ customerId: 55 })).toEqual({
				customerId: 55,
			});
		});

		it('validates CustomerSchema output', () => {
			const valid = {
				id: 55,
				firstName: 'Jane',
				lastName: 'Doe',
				company: 'Acme Corp',
				_embedded: {
					emails: [{ id: 1, value: 'jane@example.com', type: 'work' }],
					phones: [{ id: 2, value: '+15551234567', type: 'mobile' }],
				},
			};
			expect(CustomerSchema.parse(valid)).toMatchObject(valid);
		});

		it('validates CreateCustomerInputSchema validation', () => {
			const valid = {
				firstName: 'John',
				lastName: 'Smith',
				emails: [{ value: 'john@example.com', type: 'work' as const }],
				phones: [{ value: '555-0100', type: 'mobile' as const }],
			};
			expect(CreateCustomerInputSchema.parse(valid)).toMatchObject(valid);
			// Invalid email throws
			expect(() =>
				CreateCustomerInputSchema.parse({
					...valid,
					emails: [{ value: 'not-an-email' }],
				}),
			).toThrow();
		});

		it('validates PatchCustomerInputSchema', () => {
			const valid = {
				customerId: 77,
				op: 'replace' as const,
				path: '/firstName',
				value: 'Johnny',
			};
			expect(PatchCustomerInputSchema.parse(valid)).toEqual(valid);
		});
	});

	describe('Tags & Saved Replies Schemas', () => {
		it('validates ListTagsInputSchema & TagSchema', () => {
			expect(ListTagsInputSchema.parse({ page: 1 })).toEqual({ page: 1 });
			const validTag = {
				id: 8,
				tag: 'VIP Customer',
				slug: 'vip-customer',
				ticketCount: 15,
			};
			expect(TagSchema.parse(validTag)).toMatchObject(validTag);
		});

		it('validates SavedReplySchema & CreateSavedReplyInputSchema', () => {
			expect(ListSavedRepliesInputSchema.parse({ mailboxId: 1 })).toEqual({
				mailboxId: 1,
			});
			const validReply = {
				id: 300,
				name: 'Return Policy',
				text: 'Our return policy is 30 days.',
			};
			expect(SavedReplySchema.parse(validReply)).toMatchObject(validReply);
			expect(
				CreateSavedReplyInputSchema.parse({
					mailboxId: 1,
					name: 'Return Policy',
				}),
			).toEqual({ mailboxId: 1, name: 'Return Policy' });
		});
	});

	describe('Reports Schemas', () => {
		it('validates ReportInputSchema date strings', () => {
			const valid = {
				start: '2026-01-01T00:00:00Z',
				end: '2026-01-31T23:59:59Z',
				mailboxes: '1,2,3',
				types: 'email' as const,
			};
			expect(ReportInputSchema.parse(valid)).toEqual(valid);
		});
	});

	describe('All registered schemas pass runtime validation on representative mocks', () => {
		it('has input and output schemas registered for every operation', () => {
			for (const key of Object.keys(helpScoutEndpointSchemas)) {
				const typedKey = key as keyof typeof HelpScoutEndpointInputSchemas;
				expect(HelpScoutEndpointInputSchemas[typedKey]).toBeDefined();
				expect(HelpScoutEndpointOutputSchemas[typedKey]).toBeDefined();
			}
		});
	});
});

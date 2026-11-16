import {
	HelpwiseEndpointInputSchemas,
	HelpwiseEndpointOutputSchemas,
} from './endpoints/types';
import {
	helpwiseEndpointMeta,
	helpwiseEndpointSchemas,
	helpwiseEndpointsNested,
} from './index';
import { HelpwiseSchema } from './schema';
import { helpwiseEntities } from './schema/database';

describe('Helpwise schema metadata and registration', () => {
	it('declares semver version and empty entities', () => {
		expect(HelpwiseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(HelpwiseSchema.entities).toBe(helpwiseEntities);
		expect(HelpwiseSchema.entities).toEqual({});
	});

	it('keeps endpointSchemas and endpointMeta in exact 1:1 sync with nested endpoints', () => {
		const nestedKeys: string[] = [];
		for (const [groupName, group] of Object.entries(helpwiseEndpointsNested)) {
			for (const actionName of Object.keys(group)) {
				nestedKeys.push(`${groupName}.${actionName}`);
			}
		}

		const schemaKeys = Object.keys(helpwiseEndpointSchemas);
		const metaKeys = Object.keys(helpwiseEndpointMeta);

		expect(schemaKeys.sort()).toEqual(nestedKeys.sort());
		expect(metaKeys.sort()).toEqual(nestedKeys.sort());
	});
});

describe('Helpwise conversation schemas', () => {
	it('validates action inputs and responses', () => {
		const actionSchema = HelpwiseEndpointInputSchemas['conversations.close'];
		expect(actionSchema.safeParse({ ids: [123, 456] }).success).toBe(true);
		expect(actionSchema.safeParse({ ids: [] }).success).toBe(false);
		expect(actionSchema.safeParse({}).success).toBe(false);

		const responseSchema = HelpwiseEndpointOutputSchemas['conversations.close'];
		expect(
			responseSchema.safeParse({
				status: 'success',
				message: 'Conversations closed',
			}).success,
		).toBe(true);
	});

	it('validates conversation list input and response', () => {
		const inputSchema = HelpwiseEndpointInputSchemas['conversations.list'];
		expect(
			inputSchema.safeParse({
				inboxIds: [100],
				limit: 50,
				pageToken: 'abc',
			}).success,
		).toBe(true);
		expect(inputSchema.safeParse({ limit: 150 }).success).toBe(false);

		const responseSchema = HelpwiseEndpointOutputSchemas['conversations.list'];
		expect(
			responseSchema.safeParse({
				nextPageToken: 'next',
				threads: [
					{
						id: 1,
						subject: 'Inquiry',
						isRead: true,
					},
				],
			}).success,
		).toBe(true);
	});

	it('validates conversation get input and response', () => {
		const inputSchema = HelpwiseEndpointInputSchemas['conversations.get'];
		expect(
			inputSchema.safeParse({ inboxId: 10, conversationId: 20 }).success,
		).toBe(true);
		expect(inputSchema.safeParse({ inboxId: 10 }).success).toBe(false);

		const responseSchema = HelpwiseEndpointOutputSchemas['conversations.get'];
		expect(
			responseSchema.safeParse({
				id: 20,
				inboxId: 10,
				subject: 'Test Subject',
			}).success,
		).toBe(true);
	});

	it('validates conversation assign input', () => {
		const inputSchema = HelpwiseEndpointInputSchemas['conversations.assign'];
		expect(
			inputSchema.safeParse({
				mailbox_id: 1,
				thread_id: 2,
				assigned_to: 3,
			}).success,
		).toBe(true);
		expect(
			inputSchema.safeParse({
				mailbox_id: 1,
			}).success,
		).toBe(false);
	});
});

describe('Helpwise messages schemas', () => {
	it('validates sendEmail input and response', () => {
		const inputSchema = HelpwiseEndpointInputSchemas['messages.sendEmail'];
		expect(
			inputSchema.safeParse({
				mailbox_id: 12,
				to: 'user@example.com',
				subject: 'Hello',
				body: '<p>World</p>',
			}).success,
		).toBe(true);
		expect(
			inputSchema.safeParse({
				mailbox_id: 12,
				to: '',
				subject: 'Hello',
				body: 'text',
			}).success,
		).toBe(false);

		const responseSchema = HelpwiseEndpointOutputSchemas['messages.sendEmail'];
		expect(
			responseSchema.safeParse({
				status: 'success',
				thread_id: 100,
				message_id: 200,
			}).success,
		).toBe(true);
	});

	it('validates sendSms and sendWhatsApp input', () => {
		const smsSchema = HelpwiseEndpointInputSchemas['messages.sendSms'];
		expect(
			smsSchema.safeParse({
				inboxId: 1,
				clientNumber: '+1234567890',
				body: 'SMS message',
			}).success,
		).toBe(true);
		expect(
			smsSchema.safeParse({
				inboxId: 1,
				clientNumber: '',
				body: 'SMS message',
			}).success,
		).toBe(false);

		const waSchema = HelpwiseEndpointInputSchemas['messages.sendWhatsApp'];
		expect(
			waSchema.safeParse({
				inboxId: 1,
				clientNumber: '+1234567890',
				body: 'WA message',
				template: {
					templateId: 123,
					templateVariables: ['Var1'],
				},
			}).success,
		).toBe(true);
	});

	it('validates sendChat and listEmails schemas', () => {
		const chatSchema = HelpwiseEndpointInputSchemas['messages.sendChat'];
		expect(
			chatSchema.safeParse({
				mailbox_id: 1,
				thread_id: 2,
				message: 'Chat text',
			}).success,
		).toBe(true);

		const listEmailsSchema =
			HelpwiseEndpointInputSchemas['messages.listEmails'];
		expect(
			listEmailsSchema.safeParse({
				mailboxId: 1,
				threadId: 2,
				page: 1,
				limit: 10,
			}).success,
		).toBe(true);
	});
});

describe('Helpwise inboxes schemas', () => {
	it('validates inboxes.list and inboxes.get', () => {
		const listInput = HelpwiseEndpointInputSchemas['inboxes.list'];
		expect(listInput.safeParse({ page: 1, limit: 20 }).success).toBe(true);
		expect(listInput.safeParse({}).success).toBe(true);

		const listOutput = HelpwiseEndpointOutputSchemas['inboxes.list'];
		expect(
			listOutput.safeParse({
				status: 'success',
				mailboxes: [{ id: 1, name: 'Support' }],
			}).success,
		).toBe(true);

		const getInput = HelpwiseEndpointInputSchemas['inboxes.get'];
		expect(getInput.safeParse({ id: 123 }).success).toBe(true);
		expect(getInput.safeParse({}).success).toBe(false);
	});
});

describe('Helpwise contacts schemas', () => {
	it('validates contacts.list, get, create, update, search', () => {
		const listInput = HelpwiseEndpointInputSchemas['contacts.list'];
		expect(listInput.safeParse({ limit: 10, offset: 0 }).success).toBe(true);

		const createInput = HelpwiseEndpointInputSchemas['contacts.create'];
		expect(
			createInput.safeParse({
				firstname: 'Jane',
				lastname: 'Doe',
				emails: ['jane@example.com'],
				phones: [{ phoneTxt: '+1111', phoneNo: '+1111' }],
			}).success,
		).toBe(true);
		expect(createInput.safeParse({ firstname: '' }).success).toBe(false);

		const searchInput = HelpwiseEndpointInputSchemas['contacts.search'];
		expect(searchInput.safeParse({ term: 'Jane' }).success).toBe(true);
		expect(searchInput.safeParse({ term: '' }).success).toBe(false);
	});
});

describe('Helpwise tags schemas', () => {
	it('validates tags.list, get, apply, remove', () => {
		const listInput = HelpwiseEndpointInputSchemas['tags.list'];
		expect(listInput.safeParse({}).success).toBe(true);

		const listOutput = HelpwiseEndpointOutputSchemas['tags.list'];
		expect(
			listOutput.safeParse([
				{ id: 1, name: 'Urgent', color: '#ff0000' },
				{ id: 2, name: 'Billing' },
			]).success,
		).toBe(true);

		const applyInput = HelpwiseEndpointInputSchemas['tags.apply'];
		expect(
			applyInput.safeParse({
				threadIds: [1, 2],
				tagIds: [10],
			}).success,
		).toBe(true);
		expect(applyInput.safeParse({ threadIds: [], tagIds: [] }).success).toBe(
			false,
		);
	});
});

describe('Helpwise customFields schemas', () => {
	it('validates customFields operations', () => {
		const createInput = HelpwiseEndpointInputSchemas['customFields.create'];
		expect(
			createInput.safeParse({ name: 'Region', description: 'Sales region' })
				.success,
		).toBe(true);
		expect(createInput.safeParse({ name: '' }).success).toBe(false);

		const inboxUpdate =
			HelpwiseEndpointInputSchemas['customFields.updateByInbox'];
		expect(
			inboxUpdate.safeParse({
				inboxId: 1,
				hideIds: [2],
				unHideIds: [3],
			}).success,
		).toBe(true);
	});
});

describe('Helpwise users, notes, whatsapp, reports schemas', () => {
	it('validates users operations', () => {
		expect(
			HelpwiseEndpointInputSchemas['users.getMe'].safeParse({}).success,
		).toBe(true);
		expect(
			HelpwiseEndpointInputSchemas['users.list'].safeParse({ mailbox_id: 1 })
				.success,
		).toBe(true);
	});

	it('validates notes.create', () => {
		expect(
			HelpwiseEndpointInputSchemas['notes.create'].safeParse({
				mailbox_id: 1,
				thread_id: 2,
				message: 'Internal review note',
			}).success,
		).toBe(true);
		expect(
			HelpwiseEndpointInputSchemas['notes.create'].safeParse({
				mailbox_id: 1,
				thread_id: 2,
				message: '',
			}).success,
		).toBe(false);
	});

	it('validates whatsapp.listTemplates', () => {
		expect(
			HelpwiseEndpointInputSchemas['whatsapp.listTemplates'].safeParse({
				mailbox_id: 10,
			}).success,
		).toBe(true);
		expect(
			HelpwiseEndpointInputSchemas['whatsapp.listTemplates'].safeParse({})
				.success,
		).toBe(false);
	});

	it('validates reports schemas', () => {
		const overall = HelpwiseEndpointInputSchemas['reports.getOverall'];
		expect(
			overall.safeParse({
				start: '2025-01-01',
				end: '2025-01-31',
				inboxId: 10,
			}).success,
		).toBe(true);
		expect(overall.safeParse({ start: '' }).success).toBe(false);

		const tagsReport = HelpwiseEndpointInputSchemas['reports.getTags'];
		expect(
			tagsReport.safeParse({
				inboxId: 10,
				start: '2025-01-01',
				end: '2025-01-31',
			}).success,
		).toBe(true);
	});
});

describe('Helpwise shapes seen on a live trial account (11-16)', () => {
	it('reads empty contact and tag lists, null emails and the users envelope', () => {
		const out = HelpwiseEndpointOutputSchemas;
		expect(
			out['contacts.list'].safeParse({ nextPage: false, results: null })
				.success,
		).toBe(true);
		expect(
			out['contacts.search'].safeParse({ nextPage: false, result: null })
				.success,
		).toBe(true);
		expect(out['tags.list'].safeParse(null).success).toBe(true);
		expect(
			out['contacts.get'].safeParse({
				id: 1,
				firstname: 'corsair-plugin-test',
				emails: null,
			}).success,
		).toBe(true);
		expect(
			out['users.list'].safeParse({
				status: 'success',
				data: { users: [{ id: 1, firstname: 'Test' }] },
			}).success,
		).toBe(true);
		expect(
			out['inboxes.list'].safeParse({
				status: 'success',
				data: [],
				message: null,
			}).success,
		).toBe(true);
	});
});

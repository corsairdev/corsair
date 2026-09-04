import { logEventFromContext } from 'corsair/core';
import { makeCampaynRequest } from './client';
import {
	Contacts,
	Lists,
	Messages,
	Reports,
	Signup,
	Webforms,
} from './endpoints';
import type { CampaynContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCampaynRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeCampaynRequest as jest.MockedFunction<
	typeof makeCampaynRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = { key: 'campayn-key', options: {} } as unknown as CampaynContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('lists endpoints', () => {
	it('getLists calls GET /lists.json', async () => {
		mockRequest.mockResolvedValue([
			{ id: '1', list_name: 'Leads', contact_count: 3 },
		]);

		const result = await Lists.getLists(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('lists.json', 'campayn-key', {
			method: 'GET',
		});
		expect(result[0]?.id).toBe('1');
	});

	it('updateList calls PUT /lists/{id}.json', async () => {
		mockRequest.mockResolvedValue({
			id: '7',
			list_name: 'VIP',
			contact_count: 4,
		});

		const result = await Lists.updateList(ctx, {
			listId: 7,
			list_name: 'VIP',
		});

		expect(mockRequest).toHaveBeenCalledWith('lists/7.json', 'campayn-key', {
			method: 'PUT',
			body: { list_name: 'VIP', tags: undefined },
		});
		expect(result.list_name).toBe('VIP');
	});

	it('deleteList calls DELETE /lists/{id}.json', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const result = await Lists.deleteList(ctx, { listId: '88' });

		expect(mockRequest).toHaveBeenCalledWith('lists/88.json', 'campayn-key', {
			method: 'DELETE',
		});
		expect(result.success).toBe(true);
	});
});

describe('contacts endpoints', () => {
	it('getContacts passes optional filter query', async () => {
		mockRequest.mockResolvedValue([
			{ id: '1', email: 'a@b.com', first_name: 'A', last_name: 'B' },
		]);

		const result = await Contacts.getContacts(ctx, {
			listId: '10',
			contactFilter: 'acme',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'lists/10/contacts.json',
			'campayn-key',
			{
				method: 'GET',
				query: { 'filter[contact]': 'acme' },
			},
		);
		expect(result).toHaveLength(1);
	});

	it('getContact calls GET /contacts/{id}.json', async () => {
		mockRequest.mockResolvedValue({ id: '22', email: 'x@y.com' });

		const result = await Contacts.getContact(ctx, { contactId: 22 });

		expect(mockRequest).toHaveBeenCalledWith(
			'contacts/22.json',
			'campayn-key',
			{ method: 'GET' },
		);
		expect(result.id).toBe('22');
	});

	it('createContact calls POST /lists/{id}/contacts.json', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const result = await Contacts.createContact(ctx, {
			listId: '9',
			email: 'john@example.com',
			first_name: 'John',
			failOnDuplicate: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'lists/9/contacts.json',
			'campayn-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expect(result.success).toBe(true);
	});

	it('deleteContact calls DELETE /contacts/{id}.json', async () => {
		mockRequest.mockResolvedValue({ success: true });
		await Contacts.deleteContact(ctx, { contactId: '19' });
		expect(mockRequest).toHaveBeenCalledWith(
			'contacts/19.json',
			'campayn-key',
			{
				method: 'DELETE',
			},
		);
	});

	it('unsubscribeContact sends id or email payload', async () => {
		mockRequest.mockResolvedValue({ success: 1 });

		const result = await Contacts.unsubscribeContact(ctx, {
			listId: 3,
			id: '11',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'lists/3/unsubscribe.json',
			'campayn-key',
			{
				method: 'POST',
				body: { id: '11', email: undefined },
			},
		);
		expect(result.success).toBe(1);
	});
});

describe('messages/reports/webforms/signup endpoints', () => {
	it('getMessages calls GET /emails.json', async () => {
		mockRequest.mockResolvedValue([{ id: '500', status: 'delivered' }]);
		const result = await Messages.getMessages(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith('emails.json', 'campayn-key', {
			method: 'GET',
		});
		expect(result[0]?.id).toBe('500');
	});

	it('getMessageStatistics calls GET /emails/{id}.json', async () => {
		mockRequest.mockResolvedValue({ id: '500', unique_views: 10 });
		const result = await Messages.getMessageStatistics(ctx, {
			messageId: '500',
		});
		expect(mockRequest).toHaveBeenCalledWith('emails/500.json', 'campayn-key', {
			method: 'GET',
		});
		expect(result.id).toBe('500');
	});

	it('getReports passes from/to query', async () => {
		mockRequest.mockResolvedValue([
			{
				id: '1',
				name: 'n',
				scheduled_date: '2015-09-11 11:50:11',
				status: 'sent',
				preview_url: 'x',
				report_url: null,
			},
		]);
		await Reports.getReports(ctx, { from: 10, to: 20 });
		expect(mockRequest).toHaveBeenCalledWith(
			'reports/calendar.json',
			'campayn-key',
			{ method: 'GET', query: { from: 10, to: 20 } },
		);
	});

	it('getWebforms/getWebform/deleteWebform call forms routes', async () => {
		mockRequest
			.mockResolvedValueOnce([
				{
					id: '4',
					contact_list_id: '1',
					form_title: 'F',
					form_type: '1',
					form_html: '<f/>',
					signup_count: '1',
				},
			])
			.mockResolvedValueOnce({
				id: '4',
				contact_list_id: '1',
				form_title: 'F',
				form_type: '1',
				form_html: '<f/>',
				signup_count: '1',
			})
			.mockResolvedValueOnce({ success: true });

		await Webforms.getWebforms(ctx, { listId: '1', form_type: '1' });
		await Webforms.getWebform(ctx, { listId: '1', webformId: '4' });
		await Webforms.deleteWebform(ctx, { listId: '1', webformId: '4' });

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'lists/1/forms.json',
			'campayn-key',
			{ method: 'GET', query: { 'filter[form_type]': '1' } },
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'lists/1/forms/4.json',
			'campayn-key',
			{ method: 'GET' },
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'lists/1/forms/4.json',
			'campayn-key',
			{ method: 'DELETE' },
		);
	});

	it('signup calls POST /signup via relative path', async () => {
		mockRequest.mockResolvedValue({ success: 1, msg: 'New user created' });

		const result = await Signup.signup(ctx, {
			email: 'new@example.com',
			first_name: 'New',
			last_name: 'User',
			password: 'secret123',
		});

		expect(mockRequest).toHaveBeenCalledWith('../signup', 'campayn-key', {
			method: 'POST',
			body: {
				email: 'new@example.com',
				first_name: 'New',
				last_name: 'User',
				password: 'secret123',
				subdomain: undefined,
				site: undefined,
			},
		});
		expect(result.success).toBe(1);
	});
});

describe('logging and validation', () => {
	it('logs events on successful endpoint call', async () => {
		mockRequest.mockResolvedValue([
			{ id: '1', list_name: 'Leads', contact_count: 2 },
		]);
		await Lists.getLists(ctx, {});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'campayn.lists.getLists',
			{},
			'completed',
		);
	});

	it('rejects invalid input before HTTP call', async () => {
		await expect(
			Contacts.unsubscribeContact(ctx, { listId: 1 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

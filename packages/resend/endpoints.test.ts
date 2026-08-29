import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Contacts, Domains, Emails } from './endpoints';
import type { ResendContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeResendRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Resend endpoints routing & event logging', () => {
	const mockMakeResendRequest = client.makeResendRequest as jest.MockedFunction<
		typeof client.makeResendRequest
	>;
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const ctx = {
		key: 're_test_key',
		endpoints: {
			emails: {
				get: jest.fn().mockResolvedValue({ id: 'email_1' }),
			},
			domains: {
				get: jest.fn().mockResolvedValue({ id: 'domain_1' }),
			},
		},
	} as unknown as ResendContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('emails.send issues POST /emails and logs event', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({ id: 'email_1' } as any);
		const result = await Emails.send(ctx, {
			from: 'onboarding@resend.dev',
			to: 'delivered@resend.dev',
			subject: 'Test',
		});
		expect(result).toEqual({ id: 'email_1' });
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'emails',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
		expect(mockLogEventFromContext).toHaveBeenCalledWith(
			ctx,
			'resend.emails.send',
			expect.any(Object),
			'completed',
		);
	});

	it('emails.batch issues POST /emails/batch', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			data: [{ id: 'email_1' }, { id: 'email_2' }],
		} as any);
		const result = await Emails.batch(ctx, {
			emails: [
				{
					from: 'onboarding@resend.dev',
					to: ['delivered@resend.dev'],
					subject: 'Test 1',
				},
			],
		});
		expect(result.data).toHaveLength(2);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'emails/batch',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('emails.cancel issues POST /emails/:id/cancel', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			object: 'email',
			id: 'email_1',
		} as any);
		const result = await Emails.cancel(ctx, { id: 'email_1' });
		expect(result.id).toBe('email_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'emails/email_1/cancel',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('emails.get issues GET /emails/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'email_1',
			from: 'onboarding@resend.dev',
			to: ['delivered@resend.dev'],
		} as any);
		const result = await Emails.get(ctx, { id: 'email_1' });
		expect(result.id).toBe('email_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'emails/email_1',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('emails.list issues GET /emails', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({ data: [] } as any);
		const result = await Emails.list(ctx, { limit: 10 });
		expect(result.data).toEqual([]);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'emails',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('domains.create issues POST /domains', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'dom_1',
			name: 'example.com',
		} as any);
		const result = await Domains.create(ctx, { name: 'example.com' });
		expect(result.id).toBe('dom_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'domains',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('domains.get issues GET /domains/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'dom_1',
			name: 'example.com',
			status: 'verified',
		} as any);
		const result = await Domains.get(ctx, { id: 'dom_1' });
		expect(result.id).toBe('dom_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'domains/dom_1',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('domains.list issues GET /domains', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({ data: [] } as any);
		const result = await Domains.list(ctx, { limit: 10 });
		expect(result.data).toEqual([]);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'domains',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('domains.verify issues POST /domains/:id/verify', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'dom_1',
			status: 'verified',
		} as any);
		const result = await Domains.verify(ctx, { id: 'dom_1' });
		expect(result.id).toBe('dom_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'domains/dom_1/verify',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('domains.delete issues DELETE /domains/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'dom_1',
			object: 'domain',
			deleted: true,
		} as any);
		const result = await Domains.delete(ctx, { id: 'dom_1' });
		expect(result.deleted).toBe(true);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'domains/dom_1',
			're_test_key',
			expect.objectContaining({
				method: 'DELETE',
			}),
		);
	});

	it('contacts.create issues POST /contacts', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			object: 'contact',
			id: 'c_1',
		} as any);
		const result = await Contacts.create(ctx, { email: 'test@example.com' });
		expect(result.id).toBe('c_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'contacts',
			're_test_key',
			expect.objectContaining({
				method: 'POST',
			}),
		);
	});

	it('contacts.get issues GET /contacts/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			id: 'c_1',
			email: 'test@example.com',
		} as any);
		const result = await Contacts.get(ctx, { id: 'c_1' });
		expect(result.id).toBe('c_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'contacts/c_1',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('contacts.list issues GET /contacts', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({ data: [] } as any);
		const result = await Contacts.list(ctx, { limit: 10 });
		expect(result.data).toEqual([]);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'contacts',
			're_test_key',
			expect.objectContaining({
				method: 'GET',
			}),
		);
	});

	it('contacts.update issues PATCH /contacts/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			object: 'contact',
			id: 'c_1',
		} as any);
		const result = await Contacts.update(ctx, {
			id: 'c_1',
			first_name: 'Jane',
		});
		expect(result.id).toBe('c_1');
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'contacts/c_1',
			're_test_key',
			expect.objectContaining({
				method: 'PATCH',
			}),
		);
	});

	it('contacts.delete issues DELETE /contacts/:id', async () => {
		mockMakeResendRequest.mockResolvedValueOnce({
			object: 'contact',
			contact: 'c_1',
			deleted: true,
		} as any);
		const result = await Contacts.delete(ctx, { id: 'c_1' });
		expect(result.deleted).toBe(true);
		expect(mockMakeResendRequest).toHaveBeenCalledWith(
			'contacts/c_1',
			're_test_key',
			expect.objectContaining({
				method: 'DELETE',
			}),
		);
	});
});

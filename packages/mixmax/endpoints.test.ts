import { makeMixmaxRequest } from './client';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

const request = jest.mocked(makeMixmaxRequest);

const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as any;

describe('Mixmax endpoints', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue({});
	});

	it('messages.list calls GET /v1/messages with query params', async () => {
		const { messagesList } = await import('./messages');
		await messagesList(ctx, { limit: 20, next: 'token-1' });

		expect(request).toHaveBeenCalledWith('/v1/messages', 'mixmax_test_key', {
			method: 'GET',
			query: { limit: 20, next: 'token-1', previous: undefined, fields: undefined },
		});
	});

	it('messages.create calls POST /v1/messages with body', async () => {
		const { messagesCreate } = await import('./messages');
		const input = {
			to: [{ email: 'customer@example.com' }],
			subject: 'Hello from Corsair',
			body: '<p>Test</p>',
		};
		await messagesCreate(ctx, input);

		expect(request).toHaveBeenCalledWith('/v1/messages', 'mixmax_test_key', {
			method: 'POST',
			body: {
				from: undefined,
				to: input.to,
				cc: undefined,
				bcc: undefined,
				subject: input.subject,
				body: input.body,
				trackingEnabled: undefined,
				smartFollowupsEnabled: undefined,
			},
		});
	});

	it('messages.get calls GET /v1/messages/:id', async () => {
		const { messagesGet } = await import('./messages');
		await messagesGet(ctx, { id: 'msg-1' });

		expect(request).toHaveBeenCalledWith('/v1/messages/msg-1', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('messages.update calls PATCH /v1/messages/:id with body', async () => {
		const { messagesUpdate } = await import('./messages');
		await messagesUpdate(ctx, { id: 'msg-1', subject: 'Updated' });

		expect(request).toHaveBeenCalledWith('/v1/messages/msg-1', 'mixmax_test_key', {
			method: 'PATCH',
			body: { subject: 'Updated' },
		});
	});

	it('messages.send calls POST /v1/messages/:id/send', async () => {
		const { messagesSend } = await import('./messages');
		await messagesSend(ctx, { id: 'msg-1' });

		expect(request).toHaveBeenCalledWith('/v1/messages/msg-1/send', 'mixmax_test_key', {
			method: 'POST',
		});
	});

	it('messages.schedule calls POST /v1/messages/:id/schedule with body', async () => {
		const { messagesSchedule } = await import('./messages');
		await messagesSchedule(ctx, { id: 'msg-1', sendAt: '2026-01-01T00:00:00Z' });

		expect(request).toHaveBeenCalledWith(
			'/v1/messages/msg-1/schedule',
			'mixmax_test_key',
			{
				method: 'POST',
				body: { sendAt: '2026-01-01T00:00:00Z' },
			},
		);
	});

	it('messages.unschedule calls DELETE /v1/messages/:id/schedule', async () => {
		const { messagesUnschedule } = await import('./messages');
		await messagesUnschedule(ctx, { id: 'msg-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/messages/msg-1/schedule',
			'mixmax_test_key',
			{ method: 'DELETE' },
		);
	});

	it('messages.test calls POST /v1/messages/test with body', async () => {
		const { messagesTest } = await import('./messages');
		await messagesTest(ctx, { subject: 'Test', body: 'Hello', meetingTypeId: 'mt-1' });

		expect(request).toHaveBeenCalledWith('/v1/messages/test', 'mixmax_test_key', {
			method: 'POST',
			body: { subject: 'Test', body: 'Hello', meetingTypeId: 'mt-1' },
		});
	});

	it('messages.sendPlain calls POST /v1/send with body', async () => {
		const { messagesSendPlain } = await import('./messages');
		await messagesSendPlain(ctx, {
			to: { email: 'customer@example.com' },
			subject: 'Plain email',
			body: '<p>Hi</p>',
		});

		expect(request).toHaveBeenCalledWith('/v1/send', 'mixmax_test_key', {
			method: 'POST',
			body: {
				to: { email: 'customer@example.com' },
				subject: 'Plain email',
				body: '<p>Hi</p>',
				from: undefined,
			},
		});
	});

	it('sequences.list calls GET /v1/sequences with query params', async () => {
		const { sequencesList } = await import('./sequences');
		await sequencesList(ctx, { name: 'sales', folder: 'personal', limit: 50 });

		expect(request).toHaveBeenCalledWith('/v1/sequences', 'mixmax_test_key', {
			method: 'GET',
			query: {
				name: 'sales',
				folder: 'personal',
				expand: undefined,
				fields: undefined,
				limit: 50,
				next: undefined,
				previous: undefined,
			},
		});
	});

	it('sequences.getRecipients calls GET /v1/sequences/:id/recipients', async () => {
		const { sequencesGetRecipients } = await import('./sequences');
		await sequencesGetRecipients(ctx, { id: 'seq-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/sequences/seq-1/recipients',
			'mixmax_test_key',
			{ method: 'GET' },
		);
	});

	it('sequences.addRecipients calls POST /v1/sequences/:id/recipients with body', async () => {
		const { sequencesAddRecipients } = await import('./sequences');
		await sequencesAddRecipients(ctx, {
			id: 'seq-1',
			recipients: [{ email: 'a@example.com', name: 'Alice' }],
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/sequences/seq-1/recipients',
			'mixmax_test_key',
			{
				method: 'POST',
				body: { recipients: [{ email: 'a@example.com', name: 'Alice' }] },
			},
		);
	});

	it('snippets.list calls GET /v1/snippets with query params', async () => {
		const { snippetsList } = await import('./snippets');
		await snippetsList(ctx, { search: 'sales', expand: 'analytics', limit: 25 });

		expect(request).toHaveBeenCalledWith('/v1/snippets', 'mixmax_test_key', {
			method: 'GET',
			query: {
				search: 'sales',
				isInline: undefined,
				deletedOnly: undefined,
				archivedOnly: undefined,
				sort: undefined,
				sortAscending: undefined,
				expand: 'analytics',
				limit: 25,
				next: undefined,
				previous: undefined,
			},
		});
	});

	it('snippets.get calls GET /v1/snippets/:id', async () => {
		const { snippetsGet } = await import('./snippets');
		await snippetsGet(ctx, { id: 'snip-1' });

		expect(request).toHaveBeenCalledWith('/v1/snippets/snip-1', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('users.getMe calls GET /v1/users/me', async () => {
		const { usersGetMe } = await import('./users');
		await usersGetMe(ctx, {});

		expect(request).toHaveBeenCalledWith('/v1/users/me', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('userPreferences.get calls GET /v1/userpreferences/me', async () => {
		const { userPreferencesGet } = await import('./users');
		await userPreferencesGet(ctx, {});

		expect(request).toHaveBeenCalledWith('/v1/userpreferences/me', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('userPreferences.update calls PATCH /v1/userpreferences/me with body', async () => {
		const { userPreferencesUpdate } = await import('./users');
		await userPreferencesUpdate(ctx, {
			autoBcc: true,
			autoBccExcludedEmails: ['no-reply@example.com'],
			signature: 'Best regards',
		});

		expect(request).toHaveBeenCalledWith('/v1/userpreferences/me', 'mixmax_test_key', {
			method: 'PATCH',
			body: {
				autoBcc: true,
				autoBccExcludedEmails: ['no-reply@example.com'],
				signature: 'Best regards',
			},
		});
	});

	it('sequences.create calls POST /v1/sequences with body', async () => {
		const { sequencesCreate } = await import('./sequences');
		await sequencesCreate(ctx, { name: 'Welcome Series', folder: 'personal' });

		expect(request).toHaveBeenCalledWith('/v1/sequences', 'mixmax_test_key', {
			method: 'POST',
			body: { name: 'Welcome Series', folder: 'personal', expand: undefined, fields: undefined, limit: undefined, next: undefined, previous: undefined },
		});
	});

	it('sequences.update calls PATCH /v1/sequences/:id with body', async () => {
		const { sequencesUpdate } = await import('./sequences');
		await sequencesUpdate(ctx, { id: 'seq-1', name: 'Renamed' });

		expect(request).toHaveBeenCalledWith('/v1/sequences/seq-1', 'mixmax_test_key', {
			method: 'PATCH',
			body: { name: 'Renamed', folder: undefined, expand: undefined, fields: undefined, limit: undefined },
		});
	});

	it('sequences.delete calls DELETE /v1/sequences/:id', async () => {
		const { sequencesDelete } = await import('./sequences');
		await sequencesDelete(ctx, { id: 'seq-1' });

		expect(request).toHaveBeenCalledWith('/v1/sequences/seq-1', 'mixmax_test_key', {
			method: 'DELETE',
		});
	});

	it('sequences.pause calls POST /v1/sequences/:id/pause', async () => {
		const { sequencesPause } = await import('./sequences');
		await sequencesPause(ctx, { id: 'seq-1' });

		expect(request).toHaveBeenCalledWith('/v1/sequences/seq-1/pause', 'mixmax_test_key', {
			method: 'POST',
		});
	});

	it('sequences.resume calls POST /v1/sequences/:id/resume', async () => {
		const { sequencesResume } = await import('./sequences');
		await sequencesResume(ctx, { id: 'seq-1' });

		expect(request).toHaveBeenCalledWith('/v1/sequences/seq-1/resume', 'mixmax_test_key', {
			method: 'POST',
		});
	});

	it('sequences.get calls GET /v1/sequences/:id', async () => {
		const { sequencesGet } = await import('./sequences');
		await sequencesGet(ctx, { id: 'seq-1' });

		expect(request).toHaveBeenCalledWith('/v1/sequences/seq-1', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('snippets.create calls POST /v1/snippets with body', async () => {
		const { snippetsCreate } = await import('./snippets');
		await snippetsCreate(ctx, { name: 'Welcome', content: '<p>Hello</p>' });

		expect(request).toHaveBeenCalledWith('/v1/snippets', 'mixmax_test_key', {
			method: 'POST',
			body: { name: 'Welcome', content: '<p>Hello</p>' },
		});
	});

	it('snippets.update calls PATCH /v1/snippets/:id with body', async () => {
		const { snippetsUpdate } = await import('./snippets');
		await snippetsUpdate(ctx, { id: 'snip-1', name: 'Renamed', content: '<p>Hi</p>' });

		expect(request).toHaveBeenCalledWith('/v1/snippets/snip-1', 'mixmax_test_key', {
			method: 'PATCH',
			body: { name: 'Renamed', content: '<p>Hi</p>' },
		});
	});

	it('snippets.delete calls DELETE /v1/snippets/:id', async () => {
		const { snippetsDelete } = await import('./snippets');
		await snippetsDelete(ctx, { id: 'snip-1' });

		expect(request).toHaveBeenCalledWith('/v1/snippets/snip-1', 'mixmax_test_key', {
			method: 'DELETE',
		});
	});

	it('users.get calls GET /v1/users/:id', async () => {
		const { usersGet } = await import('./users');
		await usersGet(ctx, { id: 'user-1' });

		expect(request).toHaveBeenCalledWith('/v1/users/user-1', 'mixmax_test_key', {
			method: 'GET',
		});
	});

	it('users.updatePassword calls PATCH /v1/users/:id/password with body', async () => {
		const { usersUpdatePassword } = await import('./users');
		await usersUpdatePassword(ctx, { id: 'user-1', password: 'newpassword123' });

		expect(request).toHaveBeenCalledWith('/v1/users/user-1/password', 'mixmax_test_key', {
			method: 'PATCH',
			body: { password: 'newpassword123' },
		});
	});

	it('users.updateSubscription calls PATCH /v1/users/:id/subscription with body', async () => {
		const { usersUpdateSubscription } = await import('./users');
		await usersUpdateSubscription(ctx, { id: 'user-1', plan: 'pro' });

		expect(request).toHaveBeenCalledWith('/v1/users/user-1/subscription', 'mixmax_test_key', {
			method: 'PATCH',
			body: { plan: 'pro' },
		});
	});
});


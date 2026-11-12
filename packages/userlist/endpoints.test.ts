import { logEventFromContext } from 'corsair/core';
import { UserlistAPIError } from './client';
import { Companies, Events, Messages, Relationships, Users } from './endpoints';
import { unauthorized } from './test-fixtures';
import {
	expectAcknowledgement,
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
	respondEmpty,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('users', () => {
	it('creates or updates a user and reports what was queued', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Users.upsert, {
			identifier: 'user-123',
			email: 'user-123@example.com',
			properties: { first_name: 'Delaney' },
		});

		expectAcknowledgement(result, 'users.upsert');
		expect(result).toMatchObject({ identifier: 'user-123' });
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/users');
		expect(sent.body).toEqual({
			identifier: 'user-123',
			email: 'user-123@example.com',
			properties: { first_name: 'Delaney' },
		});
	});

	it('accepts an email alone as the identifier', async () => {
		respondEmpty(fetchMock);

		await invoke(Users.upsert, { email: 'user-123@example.com' });

		expect(lastRequest(fetchMock).body).toEqual({
			email: 'user-123@example.com',
		});
	});

	it('rejects a user with neither identifier nor email', async () => {
		await expect(
			invoke(Users.upsert, { properties: { first_name: 'Nobody' } }),
		).rejects.toThrow('A user needs an identifier, an email, or both.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends topic preferences, which only touch the topics listed', async () => {
		respondEmpty(fetchMock);

		await invoke(Users.upsert, {
			identifier: 'user-123',
			preferences: [{ topic: 'product_updates', subscribed: false }],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			preferences: [{ topic: 'product_updates', subscribed: false }],
		});
	});

	it('sends companies as a shortcut for relationships', async () => {
		respondEmpty(fetchMock);

		await invoke(Users.upsert, {
			identifier: 'user-123',
			companies: ['company-42'],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			companies: ['company-42'],
		});
	});

	it('deletes a user by identifier, with the body on the DELETE', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Users.remove, { identifier: 'user-123' });

		expectAcknowledgement(result, 'users.delete');
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/users');
		expect(sent.body).toEqual({ identifier: 'user-123' });
	});

	it('rejects a delete with nothing to identify the user', async () => {
		await expect(invoke(Users.remove, {})).rejects.toThrow(
			'A delete needs an identifier or an email',
		);
	});

	it('surfaces a bad key as a UserlistAPIError', async () => {
		respond(fetchMock, unauthorized, 401);

		await expect(
			invoke(Users.upsert, { identifier: 'user-123' }),
		).rejects.toBeInstanceOf(UserlistAPIError);
	});
});

describe('companies', () => {
	it('creates or updates a company', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Companies.upsert, {
			identifier: 'company-42',
			name: 'Acme Inc.',
			properties: { plan: 'plus' },
		});

		expectAcknowledgement(result, 'companies.upsert');
		expect(result).toMatchObject({ identifier: 'company-42' });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/companies');
		expect(sent.body).toEqual({
			identifier: 'company-42',
			name: 'Acme Inc.',
			properties: { plan: 'plus' },
		});
	});

	it('sends the users a company is pushed with', async () => {
		respondEmpty(fetchMock);

		await invoke(Companies.upsert, {
			identifier: 'company-42',
			user: 'user-123',
			users: ['user-124'],
			relationships: [{ user: 'user-125', properties: { role: 'owner' } }],
		});

		expect(lastRequest(fetchMock).body).toEqual({
			identifier: 'company-42',
			user: 'user-123',
			users: ['user-124'],
			relationships: [{ user: 'user-125', properties: { role: 'owner' } }],
		});
	});

	it('requires an identifier', async () => {
		await expect(invoke(Companies.upsert, { name: 'No id' })).rejects.toThrow();
	});

	it('deletes a company by identifier', async () => {
		respondEmpty(fetchMock);

		await invoke(Companies.remove, { identifier: 'company-42' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/companies');
		expect(sent.body).toEqual({ identifier: 'company-42' });
	});
});

describe('relationships', () => {
	it('ties a user to a company with relationship properties', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Relationships.upsert, {
			user: 'user-123',
			company: 'company-42',
			properties: { role: 'admin' },
		});

		expectAcknowledgement(result, 'relationships.upsert');
		expect(result).toMatchObject({ identifier: 'user-123:company-42' });
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/relationships');
		expect(sent.body).toEqual({
			user: 'user-123',
			company: 'company-42',
			properties: { role: 'admin' },
		});
	});

	it('accepts an embedded company object', async () => {
		respondEmpty(fetchMock);

		await invoke(Relationships.upsert, {
			user: 'user-123',
			company: { identifier: 'company-42', name: 'Acme Inc.' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			company: { identifier: 'company-42', name: 'Acme Inc.' },
		});
	});

	it('removes the link, on a DELETE with both identifiers', async () => {
		respondEmpty(fetchMock);

		await invoke(Relationships.remove, {
			user: 'user-123',
			company: 'company-42',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/relationships');
		expect(sent.body).toEqual({ user: 'user-123', company: 'company-42' });
	});

	it('requires both sides', async () => {
		await expect(
			invoke(Relationships.upsert, { user: 'user-123' }),
		).rejects.toThrow();
	});
});

describe('events', () => {
	it('records an event against a user', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Events.create, {
			name: 'subscription_activated',
			user: 'user-123',
			properties: { plan: 'plus' },
		});

		expectAcknowledgement(result, 'events.create');
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/events');
		expect(sent.body).toEqual({
			name: 'subscription_activated',
			user: 'user-123',
			properties: { plan: 'plus' },
		});
	});

	it('records an event against a company only', async () => {
		respondEmpty(fetchMock);

		await invoke(Events.create, {
			name: 'seat_added',
			company: 'company-42',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			name: 'seat_added',
			company: 'company-42',
		});
	});

	it('rejects an event with neither a user nor a company', async () => {
		await expect(invoke(Events.create, { name: 'orphan' })).rejects.toThrow(
			'An event needs a user, a company, or both.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends occurred_at for a historic event', async () => {
		respondEmpty(fetchMock);

		await invoke(Events.create, {
			name: 'subscription_activated',
			user: 'user-123',
			occurred_at: '2024-01-15T10:30:00Z',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			occurred_at: '2024-01-15T10:30:00Z',
		});
	});
});

describe('messages', () => {
	it('sends a templated email', async () => {
		respondEmpty(fetchMock);

		const result = await invoke(Messages.send, {
			template: 'welcome_email',
			user: 'user-123',
			properties: { first_name: 'Delaney' },
		});

		expectAcknowledgement(result, 'messages.send');
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/messages');
		expect(sent.body).toEqual({
			template: 'welcome_email',
			user: 'user-123',
			properties: { first_name: 'Delaney' },
		});
	});

	it('sends an inline email when no template is given', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			user: 'user-123',
			subject: 'Your receipt',
			body: { type: 'html', content: '<p>Thanks.</p>' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			subject: 'Your receipt',
			body: { type: 'html', content: '<p>Thanks.</p>' },
		});
	});

	it('requires a subject without a template', async () => {
		await expect(
			invoke(Messages.send, {
				user: 'user-123',
				body: { type: 'html', content: '<p>Thanks.</p>' },
			}),
		).rejects.toThrow('A message without a template needs a subject.');
	});

	it('requires a body without a template', async () => {
		await expect(
			invoke(Messages.send, { user: 'user-123', subject: 'Hello' }),
		).rejects.toThrow('A message without a template needs a body.');
	});

	it('sends to a bare address when there is no user', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			to: 'delaney@example.com',
			subject: 'Your receipt',
			body: { type: 'text', content: 'Thanks.' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			to: 'delaney@example.com',
		});
	});

	it('rejects an email with neither a user nor a to address', async () => {
		await expect(
			invoke(Messages.send, {
				subject: 'Nowhere',
				body: { type: 'text', content: 'Hello' },
			}),
		).rejects.toThrow('An email message needs a user or a `to` address.');
	});

	it('accepts a multipart body as an array of parts', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			user: 'user-123',
			subject: 'Your receipt',
			body: {
				type: 'multipart',
				content: [
					{ type: 'text', content: 'Thanks.' },
					{ type: 'html', content: '<p>Thanks.</p>' },
				],
			},
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			body: {
				type: 'multipart',
				content: [
					{ type: 'text', content: 'Thanks.' },
					{ type: 'html', content: '<p>Thanks.</p>' },
				],
			},
		});
	});

	it.each([
		['multipart with a string', { type: 'multipart', content: 'Thanks.' }],
		[
			'html with an array of parts',
			{ type: 'html', content: [{ type: 'html', content: '<p>Hi</p>' }] },
		],
		[
			'a part type other than html or text',
			{ type: 'multipart', content: [{ type: 'markdown', content: 'Hi' }] },
		],
	])('rejects a body that is %s before sending', async (_label, body) => {
		await expect(
			invoke(Messages.send, { user: 'user-123', subject: 'Hi', body }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs no channel when a template picks it', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, { template: 'welcome', user: 'user-123' });

		const fields = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(fields.channel).toBeUndefined();
		expect(fields.template).toBe('welcome');
	});

	it('logs email when neither a template nor a channel is given', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			user: 'user-123',
			subject: 'Hi',
			body: { type: 'text', content: 'Hi' },
		});

		const fields = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(fields.channel).toBe('email');
	});

	it('sends a web message to a user and refuses a to address', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			channel: 'web',
			user: 'user-123',
			subject: 'New feature',
			body: { type: 'text', content: 'Take a look.' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({ channel: 'web' });

		await expect(
			invoke(Messages.send, {
				channel: 'web',
				user: 'user-123',
				to: 'delaney@example.com',
				subject: 'New feature',
				body: { type: 'text', content: 'Take a look.' },
			}),
		).rejects.toThrow('A web message is delivered in-app');
	});

	it('requires a user for a web message', async () => {
		await expect(
			invoke(Messages.send, {
				channel: 'web',
				subject: 'New feature',
				body: { type: 'text', content: 'Take a look.' },
			}),
		).rejects.toThrow('A web message needs a user.');
	});

	it('accepts false to disable theming', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			user: 'user-123',
			subject: 'Plain',
			theme: false,
			body: { type: 'text', content: 'No styling.' },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({ theme: false });
	});
});

describe('logging', () => {
	it('logs the event name and never the message body', async () => {
		respondEmpty(fetchMock);

		await invoke(Messages.send, {
			template: 'welcome_email',
			user: 'user-123',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'userlist.messages.send',
			expect.objectContaining({ template: 'welcome_email' }),
			'completed',
		);
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('body');
		expect(logged).not.toHaveProperty('subject');
	});
});

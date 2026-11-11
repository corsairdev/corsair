import { logEventFromContext } from 'corsair/core';
import { WebexAPIError } from './client';
import { Messages, People, Rooms, Webhooks } from './endpoints';
import {
	badRequest,
	membership,
	memberships,
	message,
	messages,
	people,
	person,
	room,
	rooms,
	team,
	teamMembership,
	teamMemberships,
	teams,
	unauthorized,
	webhook,
	webhooks,
} from './test-fixtures';
import {
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

describe('rooms', () => {
	it('lists rooms', async () => {
		respond(fetchMock, rooms);

		const result = await invoke(Rooms.list, { max: 50 });

		expect(result).toEqual(rooms);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/rooms');
		expect(sent.query.max).toBe('50');
	});

	it('filters by type', async () => {
		respond(fetchMock, rooms);

		await invoke(Rooms.list, { type: 'group' });

		expect(lastRequest(fetchMock).query.type).toBe('group');
	});

	it('rejects a page size above 1000', async () => {
		await expect(invoke(Rooms.list, { max: 1001 })).rejects.toThrow();
	});

	it('reads one room', async () => {
		respond(fetchMock, room);

		const result = await invoke(Rooms.get, { id: room.id });

		expect(result).toEqual(room);
		expect(lastRequest(fetchMock).path).toBe(`/v1/rooms/${room.id}`);
	});

	it('creates a room', async () => {
		respond(fetchMock, room);

		const result = await invoke(Rooms.create, {
			title: 'Support triage',
			description: 'Where support questions land',
		});

		expect(result).toEqual(room);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/rooms');
		expect(sent.body).toMatchObject({ title: 'Support triage' });
	});

	it('updates a room', async () => {
		respond(fetchMock, room);

		await invoke(Rooms.update, { id: room.id, title: 'Support' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/v1/rooms/${room.id}`);
		expect(sent.body).toEqual({ title: 'Support' });
	});

	it('states what a delete did, since the answer has no body', async () => {
		respondEmpty(fetchMock, 204);

		const result = await invoke(Rooms.remove, { id: room.id });

		expect(result).toEqual({ id: room.id, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('surfaces a bad token as a WebexAPIError', async () => {
		respond(fetchMock, unauthorized, 401);

		await expect(invoke(Rooms.list, {})).rejects.toBeInstanceOf(WebexAPIError);
	});
});

describe('messages', () => {
	it('lists the messages in a room', async () => {
		respond(fetchMock, messages);

		const result = await invoke(Messages.list, { roomId: room.id });

		expect(result).toEqual(messages);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1/messages');
		expect(sent.query.roomId).toBe(room.id);
	});

	it('lists the replies in a thread', async () => {
		respond(fetchMock, messages);

		await invoke(Messages.list, { parentId: message.id });

		expect(lastRequest(fetchMock).query.parentId).toBe(message.id);
	});

	it('rejects a list with neither a room nor a thread', async () => {
		await expect(invoke(Messages.list, {})).rejects.toThrow(
			'A message list needs a roomId or a parentId.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads one message', async () => {
		respond(fetchMock, message);

		await expect(invoke(Messages.get, { id: message.id })).resolves.toEqual(
			message,
		);
		expect(lastRequest(fetchMock).path).toBe(`/v1/messages/${message.id}`);
	});

	it('posts a message to a room', async () => {
		respond(fetchMock, message);

		const result = await invoke(Messages.create, {
			roomId: room.id,
			text: 'Your order shipped.',
		});

		expect(result).toEqual(message);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/messages');
		expect(sent.body).toEqual({ roomId: room.id, text: 'Your order shipped.' });
	});

	it('posts directly to a person by email', async () => {
		respond(fetchMock, message);

		await invoke(Messages.create, {
			toPersonEmail: 'jordan@acme.example',
			text: 'Hello',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			toPersonEmail: 'jordan@acme.example',
		});
	});

	it('rejects a message with no destination', async () => {
		await expect(invoke(Messages.create, { text: 'Nowhere' })).rejects.toThrow(
			'A message needs a roomId, a toPersonId or a toPersonEmail.',
		);
	});

	it('rejects a message with no content', async () => {
		await expect(invoke(Messages.create, { roomId: room.id })).rejects.toThrow(
			'A message needs text, markdown, html or files.',
		);
	});

	it('accepts a files-only message', async () => {
		respond(fetchMock, message);

		await invoke(Messages.create, {
			roomId: room.id,
			files: ['https://files.example/invoice.pdf'],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			files: ['https://files.example/invoice.pdf'],
		});
	});

	it('posts a reply in a thread', async () => {
		respond(fetchMock, message);

		await invoke(Messages.create, {
			roomId: room.id,
			parentId: message.id,
			text: 'A reply',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			parentId: message.id,
		});
	});

	it('never logs the message text', async () => {
		respond(fetchMock, message);

		await invoke(Messages.create, {
			roomId: room.id,
			text: 'Your order shipped.',
		});

		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		// The body is the user's content, so it never reaches the event log.
		expect(logged).not.toHaveProperty('text');
		expect(logged).not.toHaveProperty('markdown');
		expect(logged).not.toHaveProperty('html');
		// Only the destination and a count of attachments.
		expect(logged.room).toBe(room.id);
		expect(logged.files).toBe(0);
	});

	it('edits a message', async () => {
		respond(fetchMock, message);

		await invoke(Messages.update, { id: message.id, text: 'Corrected' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(`/v1/messages/${message.id}`);
		expect(sent.body).toEqual({ text: 'Corrected' });
	});

	it('deletes a message', async () => {
		respondEmpty(fetchMock, 204);

		await expect(invoke(Messages.remove, { id: message.id })).resolves.toEqual({
			id: message.id,
			deleted: true,
		});
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('people', () => {
	it('reads the account behind the token', async () => {
		respond(fetchMock, person);

		const result = await invoke(People.me, {});

		expect(result).toEqual(person);
		expect(lastRequest(fetchMock).path).toBe('/v1/people/me');
	});

	it('lists people by email', async () => {
		respond(fetchMock, people);

		await invoke(People.list, { email: 'jordan@acme.example' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1/people');
		expect(sent.query.email).toBe('jordan@acme.example');
	});

	it('reads one person', async () => {
		respond(fetchMock, person);

		await expect(invoke(People.get, { id: person.id })).resolves.toEqual(
			person,
		);
		expect(lastRequest(fetchMock).path).toBe(`/v1/people/${person.id}`);
	});

	it('logs only the name and type for the account', async () => {
		respond(fetchMock, person);

		await invoke(People.me, {});

		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('emails');
		expect(logged.displayName).toBe('Jordan Ruiz');
	});
});

describe('teams', () => {
	it('lists teams', async () => {
		respond(fetchMock, teams);

		await invoke(People.teams, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/teams');
	});

	it('reads one team', async () => {
		respond(fetchMock, team);

		await expect(invoke(People.teamGet, { id: team.id })).resolves.toEqual(
			team,
		);
	});

	it('creates a team', async () => {
		respond(fetchMock, team);

		await invoke(People.teamCreate, { name: 'Support' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({ name: 'Support' });
	});

	it('deletes a team', async () => {
		respondEmpty(fetchMock, 204);

		await invoke(People.teamRemove, { id: team.id });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists team memberships by team', async () => {
		respond(fetchMock, teamMemberships);

		await invoke(People.teamMembershipsList, { teamId: team.id });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1/team/memberships');
		expect(sent.query.teamId).toBe(team.id);
	});

	it('adds a team member', async () => {
		respond(fetchMock, teamMembership);

		await invoke(People.teamMembershipsCreate, {
			teamId: team.id,
			personEmail: 'jordan@acme.example',
			isModerator: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toMatchObject({ isModerator: true });
	});

	it('removes a team member', async () => {
		respondEmpty(fetchMock, 204);

		await invoke(People.teamMembershipsRemove, { id: teamMembership.id });

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/team/memberships/${teamMembership.id}`,
		);
	});

	it('lists room memberships', async () => {
		respond(fetchMock, memberships);

		await invoke(People.membershipsList, { roomId: room.id });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v1/memberships');
		expect(sent.query.roomId).toBe(room.id);
	});

	it('adds a room member', async () => {
		respond(fetchMock, membership);

		await invoke(People.membershipsCreate, {
			roomId: room.id,
			personEmail: 'jordan@acme.example',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			roomId: room.id,
			personEmail: 'jordan@acme.example',
		});
	});

	it('removes a room member', async () => {
		respondEmpty(fetchMock, 204);

		await invoke(People.membershipsRemove, { id: membership.id });

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/memberships/${membership.id}`,
		);
	});
});

describe('webhooks', () => {
	it('lists webhooks', async () => {
		respond(fetchMock, webhooks);

		await invoke(Webhooks.list, {});

		expect(lastRequest(fetchMock).path).toBe('/v1/webhooks');
	});

	it('reads one webhook', async () => {
		respond(fetchMock, webhook);

		await invoke(Webhooks.get, { id: webhook.id });

		expect(lastRequest(fetchMock).path).toBe(`/v1/webhooks/${webhook.id}`);
	});

	it('creates a webhook and reports whether a secret was set', async () => {
		respond(fetchMock, { ...webhook, secret: 'super-secret' });

		await invoke(Webhooks.create, {
			name: 'Message hook',
			targetUrl: 'https://acme.example/hooks/webex',
			resource: 'messages',
			event: 'created',
			secret: 'super-secret',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/webhooks');
		// The secret is sent, but only its presence is logged.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged.hasSecret).toBe(true);
		expect(logged).not.toHaveProperty('secret');
	});

	it('rejects an unknown resource', async () => {
		await expect(
			invoke(Webhooks.create, {
				name: 'Hook',
				targetUrl: 'https://acme.example/hook',
				resource: 'notaresource',
				event: 'created',
			}),
		).rejects.toThrow();
	});

	it('updates a webhook status', async () => {
		respond(fetchMock, { ...webhook, status: 'inactive' });

		await invoke(Webhooks.update, { id: webhook.id, status: 'inactive' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ status: 'inactive' });
	});

	it('deletes a webhook', async () => {
		respondEmpty(fetchMock, 204);

		await invoke(Webhooks.remove, { id: webhook.id });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('a validation failure from the API', () => {
	it('keeps the per-field description on the error', async () => {
		respond(fetchMock, badRequest, 400);

		const error = (await invoke(Messages.create, {
			roomId: room.id,
			text: 'hi',
		}).catch((thrown: unknown) => thrown)) as WebexAPIError;

		expect(error.errors).toEqual(['roomId is required']);
		expect(error.message).toContain('roomId is required');
	});
});

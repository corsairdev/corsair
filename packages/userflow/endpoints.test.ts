import { UserflowAPIError } from './client';
import {
	Accounts,
	Attributes,
	Content,
	ContentSessions,
	Events,
	Groups,
	Memberships,
	Users,
	WebhookSubscriptions,
} from './endpoints';
import { userflowEndpointSchemas } from './index';
import {
	account,
	accountsPage,
	accountWithEnvironments,
	attributeDefinitionsPage,
	content,
	contentPage,
	contentSession,
	contentSessionsPage,
	contentVersion,
	contentVersionsPage,
	event,
	eventDefinitionsPage,
	group,
	groupsPage,
	invalidEnvKey,
	invite,
	invitesPage,
	member,
	membersPage,
	user,
	usersLastPage,
	usersPage,
	userWithMemberships,
	webhookSubscription,
	webhookSubscriptionsPage,
	webhookSubscriptionWithSecret,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

const fetchMock = installFetchMock();

// The accounts module exports listAccounts/getAccount; the alias keeps the test
// names readable.
const AccountsApi = {
	list: Accounts.listAccounts,
	get: Accounts.getAccount,
};

beforeEach(() => {
	fetchMock.mockReset();
});

describe('users', () => {
	it('creates or updates a user, merging the attributes', async () => {
		respond(fetchMock, user);

		const result = await invoke(Users.upsert, {
			id: user.id,
			attributes: { name: 'Evelyn Reichert', email: 'evelyn@example.com' },
		});

		expect(result).toEqual(user);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/users');
		expect(sent.body).toEqual({
			id: user.id,
			attributes: { name: 'Evelyn Reichert', email: 'evelyn@example.com' },
		});
	});

	it('accepts an attribute operation such as add', async () => {
		respond(fetchMock, user);

		await invoke(Users.upsert, {
			id: user.id,
			attributes: { widget_count: { add: 1 } },
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			attributes: { widget_count: { add: 1 } },
		});
	});

	it('sends groups when given, not memberships', async () => {
		respond(fetchMock, user);

		await invoke(Users.upsert, {
			id: user.id,
			groups: [{ id: group.id, attributes: { name: 'Acme Inc.' } }],
		});

		const body = lastRequest(fetchMock).body as Record<string, unknown>;
		expect(body.groups).toEqual([
			{ id: group.id, attributes: { name: 'Acme Inc.' } },
		]);
		expect(body.memberships).toBeUndefined();
	});

	it('rejects groups and memberships together', async () => {
		await expect(
			invoke(Users.upsert, {
				id: user.id,
				groups: [{ id: group.id }],
				memberships: [{ group: { id: group.id } }],
			}),
		).rejects.toThrow('Send either groups or memberships, not both.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects prune_memberships with no membership list', async () => {
		await expect(
			invoke(Users.upsert, { id: user.id, prune_memberships: true }),
		).rejects.toThrow('prune_memberships removes every membership');
	});

	it('reads one user with memberships expanded', async () => {
		respond(fetchMock, userWithMemberships);

		const result = await invoke(Users.get, {
			id: user.id,
			expand: 'memberships.group',
		});

		expect(result).toEqual(userWithMemberships);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(`/users/${user.id}`);
		expect(sent.query.expand).toBe('memberships.group');
	});

	it('states that a delete happened', async () => {
		respond(fetchMock, { id: user.id, object: 'user', deleted: true });

		const result = await invoke(Users.remove, { id: user.id });

		expect(result).toEqual({ id: user.id, object: 'user', deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists users, sending order_by[] for several fields', async () => {
		respond(fetchMock, usersPage);

		const result = await invoke(Users.list, {
			limit: 10,
			order_by: ['created_at', 'attributes.name'],
		});

		expect(result).toEqual(usersPage);
		const pairs = lastRequest(fetchMock).queryPairs.filter(([key]) =>
			key.startsWith('order_by'),
		);
		expect(pairs).toEqual([
			['order_by[]', 'created_at'],
			['order_by[]', 'attributes.name'],
		]);
	});

	it('sends the email, group and condition filters', async () => {
		respond(fetchMock, usersPage);

		await invoke(Users.list, {
			email: 'evelyn@example.com',
			group_id: group.id,
			segment_id: 'seg_1',
			condition: {
				type: 'attribute',
				attribute_name: 'plan',
				operator: 'eq',
				value: 'plus',
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.email).toBe('evelyn@example.com');
		expect(sent.query.group_id).toBe(group.id);
		expect(sent.query.segment_id).toBe('seg_1');
		// Live 11-12: a non-JSON condition is a 400 "Invalid JSON provided".
		expect(JSON.parse(sent.query.condition ?? '')).toEqual({
			type: 'attribute',
			attribute_name: 'plan',
			operator: 'eq',
			value: 'plus',
		});
	});

	it('passes a condition already given as a JSON string through, and refuses other text', async () => {
		respond(fetchMock, groupsPage);
		const json =
			'{"type":"attribute","attribute_name":"group/plan","operator":"eq","value":"Pro"}';

		await invoke(Groups.list, { condition: json });

		expect(lastRequest(fetchMock).query.condition).toBe(json);
		await expect(
			invoke(Groups.list, { condition: 'attributes.plan:eq:plus' }),
		).rejects.toThrow();
	});

	it('reports no more pages when has_more is false', async () => {
		respond(fetchMock, usersLastPage);

		const result = (await invoke(Users.list, {})) as {
			has_more?: boolean | null;
		};
		expect(result.has_more).toBe(false);
	});

	it('rejects an unknown order_by field', async () => {
		await expect(
			invoke(Users.list, { order_by: ['attributes.password'] }),
		).rejects.toThrow();
	});

	it('rejects a limit above 100', async () => {
		await expect(invoke(Users.list, { limit: 101 })).rejects.toThrow();
	});
});

describe('groups', () => {
	it('creates or updates a group', async () => {
		respond(fetchMock, group);

		const result = await invoke(Groups.upsert, {
			id: group.id,
			attributes: { name: 'Acme Inc.', billing_plan: 'plus' },
		});

		expect(result).toEqual(group);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/groups');
	});

	it('reads one group with its users expanded', async () => {
		respond(fetchMock, group);

		await invoke(Groups.get, { id: group.id, expand: 'users' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(`/groups/${group.id}`);
		expect(sent.query.expand).toBe('users');
	});

	it('deletes a group, leaving the users in it', async () => {
		respond(fetchMock, { id: group.id, object: 'group', deleted: true });

		await expect(invoke(Groups.remove, { id: group.id })).resolves.toEqual({
			id: group.id,
			object: 'group',
			deleted: true,
		});
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists groups', async () => {
		respond(fetchMock, groupsPage);

		await expect(invoke(Groups.list, {})).resolves.toEqual(groupsPage);
		expect(lastRequest(fetchMock).path).toBe('/groups');
	});
});

describe('memberships', () => {
	it('removes one user from one group by query parameters', async () => {
		respond(fetchMock, {
			id: 'e9b32bd0-63cb-415e-9c4f-477c85b92f97',
			object: 'group_membership',
			deleted: true,
		});

		await invoke(Memberships.remove, { user_id: user.id, group_id: group.id });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/group_memberships');
		expect(sent.query.user_id).toBe(user.id);
		expect(sent.query.group_id).toBe(group.id);
		expect(sent.body).toBeUndefined();
	});

	it('states the pair it removed, so an idempotent answer is still clear', async () => {
		respond(fetchMock, {});

		const result = await invoke(Memberships.remove, {
			user_id: user.id,
			group_id: group.id,
		});

		expect(result).toMatchObject({
			deleted: true,
			user_id: user.id,
			group_id: group.id,
		});
	});
});

describe('events', () => {
	it('tracks an event against a user', async () => {
		respond(fetchMock, event);

		const result = await invoke(Events.track, {
			name: 'subscription_activated',
			user_id: user.id,
			attributes: { plan_name: 'plus', plan_price: 199 },
		});

		expect(result).toEqual(event);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/events');
		expect(sent.body).toMatchObject({
			name: 'subscription_activated',
			user_id: user.id,
			attributes: { plan_name: 'plus', plan_price: 199 },
		});
	});

	it('tracks an event against a group only', async () => {
		respond(fetchMock, { ...event, user_id: null, group_id: group.id });

		await invoke(Events.track, { name: 'seat_added', group_id: group.id });

		expect(lastRequest(fetchMock).body).toMatchObject({
			name: 'seat_added',
			group_id: group.id,
		});
	});

	it('rejects an event with neither a user nor a group', async () => {
		await expect(
			invoke(Events.track, { name: 'orphan_event' }),
		).rejects.toThrow('An event needs a user_id, a group_id, or both.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends a past time for a historic event', async () => {
		respond(fetchMock, event);

		await invoke(Events.track, {
			name: 'subscription_activated',
			user_id: user.id,
			time: '2022-11-29T12:34:56.000+00:00',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			time: '2022-11-29T12:34:56.000+00:00',
		});
	});
});

describe('content', () => {
	it('reads one content object', async () => {
		respond(fetchMock, content);

		await expect(invoke(Content.get, { id: content.id })).resolves.toEqual(
			content,
		);
		expect(lastRequest(fetchMock).path).toBe(`/content/${content.id}`);
	});

	it('lists content filtered by type', async () => {
		respond(fetchMock, contentPage);

		await invoke(Content.list, { type: 'flow' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/content');
		expect(sent.query.type).toBe('flow');
	});

	it('reads one content version', async () => {
		respond(fetchMock, contentVersion);

		await expect(
			invoke(Content.getVersion, { id: contentVersion.id }),
		).resolves.toEqual(contentVersion);
		expect(lastRequest(fetchMock).path).toBe(
			`/content_versions/${contentVersion.id}`,
		);
	});

	it('lists versions for one content object', async () => {
		respond(fetchMock, contentVersionsPage);

		await invoke(Content.listVersions, { content_id: content.id });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/content_versions');
		expect(sent.query.content_id).toBe(content.id);
	});

	it('requires content_id when listing versions', async () => {
		await expect(invoke(Content.listVersions, {})).rejects.toThrow();
	});
});

describe('content sessions', () => {
	it('reads one session', async () => {
		respond(fetchMock, contentSession);

		await expect(
			invoke(ContentSessions.get, { id: contentSession.id }),
		).resolves.toEqual(contentSession);
		expect(lastRequest(fetchMock).path).toBe(
			`/content_sessions/${contentSession.id}`,
		);
	});

	it('ends a session', async () => {
		respond(fetchMock, contentSession);

		await invoke(ContentSessions.end, { id: contentSession.id });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/content_sessions/${contentSession.id}/end`);
	});

	it('deletes a session with the documented spelling', async () => {
		respond(fetchMock, {
			id: contentSession.id,
			object: 'content_session',
			deleted: true,
		});

		await invoke(ContentSessions.remove, { id: contentSession.id });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('DELETE');
		// The docs typo this as content_sesssions in the heading; every example
		// uses the correct spelling, which is what the plugin calls.
		expect(sent.path).toBe(`/content_sessions/${contentSession.id}`);
	});

	it('lists sessions filtered by user and content', async () => {
		respond(fetchMock, contentSessionsPage);

		await invoke(ContentSessions.list, {
			user_id: contentSession.user_id,
			content_id: contentSession.content_id,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.user_id).toBe(contentSession.user_id);
		expect(sent.query.content_id).toBe(contentSession.content_id);
	});
});

describe('definitions', () => {
	it('lists attribute definitions filtered by scope', async () => {
		respond(fetchMock, attributeDefinitionsPage);

		await invoke(Attributes.listAttributes, { scope: 'user' });

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/attribute_definitions');
		expect(sent.query.scope).toBe('user');
	});

	it('lists event definitions', async () => {
		respond(fetchMock, eventDefinitionsPage);

		await expect(invoke(Attributes.listEvents, {})).resolves.toEqual(
			eventDefinitionsPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/event_definitions');
	});
});

describe('webhook subscriptions', () => {
	it('creates a subscription', async () => {
		respond(fetchMock, webhookSubscriptionWithSecret);

		const result = await invoke(WebhookSubscriptions.create, {
			url: 'https://example.com/hooks/userflow',
			topics: ['user', 'event'],
		});

		expect(result).toEqual(webhookSubscriptionWithSecret);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/webhook_subscriptions');
		expect(sent.body).toEqual({
			url: 'https://example.com/hooks/userflow',
			topics: ['user', 'event'],
		});
	});

	it('reads a subscription, which carries no secret', async () => {
		respond(fetchMock, webhookSubscription);

		const result = await invoke(WebhookSubscriptions.get, {
			id: webhookSubscription.id,
		});

		expect(result).toEqual(webhookSubscription);
		expect(lastRequest(fetchMock).path).toBe(
			`/webhook_subscriptions/${webhookSubscription.id}`,
		);
	});

	it('disables a subscription without deleting it', async () => {
		respond(fetchMock, { ...webhookSubscription, disabled: true });

		await invoke(WebhookSubscriptions.update, {
			id: webhookSubscription.id,
			disabled: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe(`/webhook_subscriptions/${webhookSubscription.id}`);
		expect(sent.body).toEqual({ disabled: true });
	});

	it('rejects an update with nothing to change', async () => {
		await expect(
			invoke(WebhookSubscriptions.update, { id: webhookSubscription.id }),
		).rejects.toThrow('Send at least one field to change.');
	});

	it('deletes a subscription', async () => {
		respond(fetchMock, {
			id: webhookSubscription.id,
			object: 'webhook_subscription',
			deleted: true,
		});

		await invoke(WebhookSubscriptions.remove, { id: webhookSubscription.id });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists subscriptions', async () => {
		respond(fetchMock, webhookSubscriptionsPage);

		await expect(invoke(WebhookSubscriptions.list, {})).resolves.toEqual(
			webhookSubscriptionsPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/webhook_subscriptions');
	});
});

describe('accounts', () => {
	it('lists the accounts the personal key belongs to', async () => {
		respond(fetchMock, accountsPage);

		await expect(invoke(AccountsApi.list, {})).resolves.toEqual(accountsPage);
		expect(lastRequest(fetchMock).path).toBe('/accounts');
	});

	it('reads one account with its environments expanded', async () => {
		respond(fetchMock, accountWithEnvironments);

		const result = await invoke(AccountsApi.get, {
			id: account.id,
			expand: 'environments',
		});

		expect(result).toEqual(accountWithEnvironments);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(`/accounts/${account.id}`);
		expect(sent.query.expand).toBe('environments');
	});

	it('reads the region of an expanded environment', async () => {
		respond(fetchMock, accountWithEnvironments);

		const result = (await invoke(AccountsApi.get, {
			id: account.id,
			expand: 'environments',
		})) as { environments?: { region?: string | null }[] | null };

		expect(result.environments?.[0]?.region).toBe('US');
	});
});

describe('members', () => {
	it('lists the members of an account', async () => {
		respond(fetchMock, membersPage);

		await invoke(Accounts.listMembers, { account_id: account.id });

		expect(lastRequest(fetchMock).path).toBe(`/accounts/${account.id}/members`);
	});

	it('reads one member', async () => {
		respond(fetchMock, member);

		await expect(
			invoke(Accounts.getMember, { account_id: account.id, id: member.id }),
		).resolves.toEqual(member);
		expect(lastRequest(fetchMock).path).toBe(
			`/accounts/${account.id}/members/${member.id}`,
		);
	});

	it('changes a member role', async () => {
		respond(fetchMock, { ...member, role: 'admin' });

		await invoke(Accounts.updateMember, {
			account_id: account.id,
			id: member.id,
			role: 'admin',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.body).toEqual({ role: 'admin' });
	});

	it('refuses owner as a new role and an update with nothing to change', async () => {
		await expect(
			invoke(Accounts.updateMember, {
				account_id: 'a_1',
				id: 'm_1',
				role: 'owner',
			}),
		).rejects.toThrow();
		await expect(
			invoke(Accounts.updateMember, { account_id: 'a_1', id: 'm_1' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('removes a member from the account', async () => {
		respond(fetchMock, { id: member.id, object: 'member', deleted: true });

		await invoke(Accounts.removeMember, {
			account_id: account.id,
			id: member.id,
		});

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('invites', () => {
	it('lists invites', async () => {
		respond(fetchMock, invitesPage);

		await invoke(Accounts.listInvites, { account_id: account.id });

		expect(lastRequest(fetchMock).path).toBe(`/accounts/${account.id}/invites`);
	});

	it('reads one invite', async () => {
		respond(fetchMock, invite);

		await expect(
			invoke(Accounts.getInvite, { account_id: account.id, id: invite.id }),
		).resolves.toEqual(invite);
	});

	it('creates an invite', async () => {
		respond(fetchMock, invite);

		await invoke(Accounts.createInvite, {
			account_id: account.id,
			name: 'Jane Doe',
			email: 'jane@example.com',
			role: 'editor',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/accounts/${account.id}/invites`);
		expect(sent.body).toEqual({
			name: 'Jane Doe',
			email: 'jane@example.com',
			role: 'editor',
		});
	});

	it('refuses to invite someone as owner', async () => {
		await expect(
			invoke(Accounts.createInvite, {
				account_id: account.id,
				name: 'Jane Doe',
				email: 'jane@example.com',
				role: 'owner',
			}),
		).rejects.toThrow();
	});

	it('deletes an invite', async () => {
		respond(fetchMock, { id: invite.id, object: 'invite', deleted: true });

		await invoke(Accounts.deleteInvite, {
			account_id: account.id,
			id: invite.id,
		});

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('error surface', () => {
	it('surfaces a bad key as a UserflowAPIError with its code', async () => {
		respond(fetchMock, invalidEnvKey, 401);

		// unknown: a rejection can be any value until it is cast below.
		const error = (await invoke(Users.get, { id: user.id }).catch(
			(thrown: unknown) => thrown,
		)) as UserflowAPIError;

		expect(error).toBeInstanceOf(UserflowAPIError);
		expect(error.code).toBe('invalid_api_key');
		expect(error.isAuthError).toBe(true);
	});

	it('declares an output schema for every endpoint', () => {
		expect(userflowEndpointSchemas['users.get'].output).toBeDefined();
		expect(userflowEndpointSchemas['invites.delete'].output).toBeDefined();
	});
});

describe('ordering and filters', () => {
	it('accepts a scalar order_by and sends it as one bare pair', async () => {
		respond(fetchMock, usersPage);

		await invoke(Users.list, { order_by: 'created_at' });

		const pairs = lastRequest(fetchMock).queryPairs.filter(([key]) =>
			key.startsWith('order_by'),
		);
		expect(pairs).toEqual([['order_by', 'created_at']]);
	});

	it('accepts a descending order_by', async () => {
		respond(fetchMock, usersPage);

		await invoke(Users.list, { order_by: ['-created_at'] });

		const pairs = lastRequest(fetchMock).queryPairs.filter(([key]) =>
			key.startsWith('order_by'),
		);
		expect(pairs).toEqual([['order_by[]', '-created_at']]);
	});

	it('rejects an order_by field the API does not document', async () => {
		await expect(
			invoke(Users.list, { order_by: ['-password'] }),
		).rejects.toThrow();
	});

	it('sends expand when listing content versions', async () => {
		respond(fetchMock, contentVersionsPage);

		await invoke(Content.listVersions, {
			content_id: 'c_1',
			expand: 'questions',
		});

		expect(lastRequest(fetchMock).query.expand).toBe('questions');
	});

	it('sends expand when listing content', async () => {
		respond(fetchMock, contentPage);

		await invoke(Content.list, { expand: 'published_version' });

		expect(lastRequest(fetchMock).query.expand).toBe('published_version');
	});

	it.each([
		['content', () => Content.list, {}, ['-name']],
		['sessions', () => ContentSessions.list, {}, ['-last_activity_at']],
		['attributes', () => Attributes.listAttributes, {}, '-created_at'],
		['event definitions', () => Attributes.listEvents, {}, ['-name']],
		['accounts', () => Accounts.listAccounts, {}, '-name'],
		[
			'members',
			() => Accounts.listMembers,
			{ account_id: 'a_1' },
			'-created_at',
		],
		['invites', () => Accounts.listInvites, { account_id: 'a_1' }, ['-name']],
		['webhook subscriptions', () => WebhookSubscriptions.list, {}, '-url'],
	] as const)(
		'accepts a descending or scalar order_by on %s and sends it',
		async (_name, endpoint, extra, orderBy) => {
			respond(fetchMock, { object: 'list', data: [], has_more: false });

			await invoke(endpoint(), { ...extra, order_by: orderBy });

			const sent = lastRequest(fetchMock).queryPairs.filter(([key]) =>
				key.startsWith('order_by'),
			);
			const expected = typeof orderBy === 'string' ? orderBy : orderBy[0];
			expect(sent.map(([, value]) => value)).toEqual([expected]);
		},
	);

	it('forwards the documented group filters', async () => {
		respond(fetchMock, groupsPage);

		await invoke(Groups.list, { user_id: 'u_1', segment_id: 's_1' });

		const query = lastRequest(fetchMock).query;
		expect(query.user_id).toBe('u_1');
		expect(query.segment_id).toBe('s_1');
	});

	it('forwards the documented invite filters', async () => {
		respond(fetchMock, invitesPage);

		await invoke(Accounts.listInvites, {
			account_id: 'a_1',
			email: 'x@example.com',
			is_expired: false,
		});

		const query = lastRequest(fetchMock).query;
		expect(query.email).toBe('x@example.com');
		expect(query.is_expired).toBe('false');
	});
});

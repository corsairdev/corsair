import { logEventFromContext } from 'corsair/core';
import {
	CategoriesEndpoints,
	CommentsEndpoints,
	CurrenciesEndpoints,
	ExpensesEndpoints,
	FriendsEndpoints,
	GroupsEndpoints,
	NotificationsEndpoints,
	UsersEndpoints,
} from './endpoints';
import {
	comment,
	currency,
	currentUser,
	emptyGroup,
	expense,
	expenseCreated,
	friend,
	group,
	notification,
	otherUser,
	parentCategory,
	success,
} from './test-fixtures';
import { API_KEY, captureError, invoke } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined, // unknown: asserted inline.
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://secure.splitwise.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('users', () => {
	it('users.getCurrentUser GETs v3.0/get_current_user with no input', async () => {
		respond(currentUser);

		const result = (await invoke(UsersEndpoints.getCurrentUser, {})) as {
			user: { id: number };
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_current_user',
			method: 'GET',
		});
		expect(result.user.id).toBe(270896089);
	});

	it('users.get GETs v3.0/get_user/{id}', async () => {
		respond(otherUser);

		await invoke(UsersEndpoints.get, { user_id: 491923 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_user/491923',
			method: 'GET',
		});
	});

	it('users.update POSTs the id in the path and only the given fields in the body', async () => {
		respond(otherUser);

		await invoke(UsersEndpoints.update, {
			user_id: 491923,
			first_name: 'Grace',
			default_currency: 'EUR',
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/update_user/491923');
		expect(sent.method).toBe('POST');
		// `user_id` belongs in the path only; sending it in the body as well
		// would let a rename overwrite the selector.
		expect(sent.body).toEqual({
			first_name: 'Grace',
			default_currency: 'EUR',
		});
	});
});

describe('groups', () => {
	it('groups.list GETs v3.0/get_groups', async () => {
		respond({ groups: [group, emptyGroup] });

		const result = (await invoke(GroupsEndpoints.list, {})) as {
			groups: unknown[]; // unknown: only the length is asserted.
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_groups',
			method: 'GET',
		});
		expect(result.groups).toHaveLength(2);
	});

	it('groups.get GETs v3.0/get_group/{id}', async () => {
		respond({ group });

		await invoke(GroupsEndpoints.get, { group_id: 321 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_group/321',
			method: 'GET',
		});
	});

	it('groups.create POSTs the name and flattened member keys', async () => {
		respond({ group });

		await invoke(GroupsEndpoints.create, {
			name: 'Housemates 2026',
			group_type: 'home',
			simplify_by_default: false,
			users: [
				{
					first_name: 'Grace',
					last_name: 'Hopper',
					email: 'grace@example.com',
				},
				{ user_id: 491923 },
			],
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/create_group');
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			name: 'Housemates 2026',
			group_type: 'home',
			simplify_by_default: false,
			users__0__first_name: 'Grace',
			users__0__last_name: 'Hopper',
			users__0__email: 'grace@example.com',
			users__1__user_id: 491923,
		});
	});

	it('groups.create rejects a member with a name but no email', async () => {
		const error = await captureError(
			invoke(GroupsEndpoints.create, {
				name: 'Housemates',
				users: [{ first_name: 'Grace' }],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('groups.create accepts a member given only by user_id', async () => {
		respond({ group });

		await invoke(GroupsEndpoints.create, {
			name: 'Housemates',
			users: [{ user_id: 491923 }],
		});

		expect(lastRequest().body).toEqual({
			name: 'Housemates',
			users__0__user_id: 491923,
		});
	});

	it('groups.delete POSTs to delete_group/{id} and passes the success flag through', async () => {
		respond(success);

		const result = (await invoke(GroupsEndpoints.delete, {
			group_id: 321,
		})) as { success: boolean };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/delete_group/321',
			method: 'POST',
		});
		expect(result.success).toBe(true);
	});

	it('groups.delete throws when Splitwise answers 200 with success false', async () => {
		respond({ success: false });

		const error = await captureError(
			invoke(GroupsEndpoints.delete, {
				group_id: 321,
			}),
		);

		expect((error as Error).name).toBe('SplitwiseOperationError');
	});

	it('groups.undelete POSTs to undelete_group/{id}', async () => {
		respond(success);

		await invoke(GroupsEndpoints.undelete, { group_id: 321 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/undelete_group/321',
			method: 'POST',
		});
	});

	it('groups.undelete reports the provider message when it refuses', async () => {
		respond({
			success: false,
			errors: ['You do not have permission to undelete this group.'],
		});

		const error = await captureError(
			invoke(GroupsEndpoints.undelete, {
				group_id: 321,
			}),
		);

		expect((error as Error).message).toContain('did not restore the group');
	});

	it('groups.addUser POSTs group and user ids', async () => {
		respond({ success: true, user: otherUser.user, errors: {} });

		await invoke(GroupsEndpoints.addUser, { group_id: 321, user_id: 491923 });

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/add_user_to_group');
		expect(sent.body).toEqual({ group_id: 321, user_id: 491923 });
	});

	it('groups.addUser POSTs a new person by name and email', async () => {
		respond({ success: true, user: otherUser.user, errors: {} });

		await invoke(GroupsEndpoints.addUser, {
			group_id: 321,
			first_name: 'Grace',
			last_name: 'Hopper',
			email: 'grace@example.com',
		});

		expect(lastRequest().body).toEqual({
			group_id: 321,
			first_name: 'Grace',
			last_name: 'Hopper',
			email: 'grace@example.com',
		});
	});

	it('groups.addUser rejects a new person with no email before sending', async () => {
		const error = await captureError(
			invoke(GroupsEndpoints.addUser, {
				group_id: 321,
				first_name: 'Grace',
				last_name: 'Hopper',
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('groups.removeUser POSTs both ids and reports a non-zero balance', async () => {
		respond({
			success: false,
			errors: { base: ['The user has a non-zero balance'] },
		});

		const error = await captureError(
			invoke(GroupsEndpoints.removeUser, {
				group_id: 321,
				user_id: 491923,
			}),
		);

		expect(lastRequest().body).toEqual({ group_id: 321, user_id: 491923 });
		expect((error as Error).message).toContain(
			'The user has a non-zero balance',
		);
	});
});

describe('friends', () => {
	it('friends.list GETs v3.0/get_friends', async () => {
		respond({ friends: [friend] });

		await invoke(FriendsEndpoints.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_friends',
			method: 'GET',
		});
	});

	it('friends.get GETs v3.0/get_friend/{id}', async () => {
		respond({ friend });

		await invoke(FriendsEndpoints.get, { friend_id: 491923 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_friend/491923',
			method: 'GET',
		});
	});

	it('friends.add POSTs user_email and the optional name', async () => {
		respond({ friend });

		await invoke(FriendsEndpoints.add, {
			user_email: 'grace@example.com',
			user_first_name: 'Grace',
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/create_friend');
		expect(sent.body).toEqual({
			user_email: 'grace@example.com',
			user_first_name: 'Grace',
		});
	});

	it('friends.addMany flattens the people into users__{i}__{field} keys', async () => {
		respond({ users: [friend], errors: {} });

		await invoke(FriendsEndpoints.addMany, {
			users: [
				{
					email: 'grace@example.com',
					first_name: 'Grace',
					last_name: 'Hopper',
				},
				{ email: 'alan@example.com' },
			],
		});

		expect(lastRequest()).toMatchObject({ path: '/api/v3.0/create_friends' });
		expect(lastRequest().body).toEqual({
			users__0__email: 'grace@example.com',
			users__0__first_name: 'Grace',
			users__0__last_name: 'Hopper',
			users__1__email: 'alan@example.com',
		});
	});

	it('friends.delete POSTs delete_friend/{id}', async () => {
		respond(success);

		await invoke(FriendsEndpoints.delete, { friend_id: 491923 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/delete_friend/491923',
			method: 'POST',
		});
	});
});

describe('expenses', () => {
	it('expenses.list GETs v3.0/get_expenses with every filter set', async () => {
		respond({ expenses: [expense] });

		await invoke(ExpensesEndpoints.list, {
			group_id: 321,
			friend_id: 491923,
			dated_after: '2026-05-01T00:00:00Z',
			dated_before: '2026-06-01T00:00:00Z',
			updated_after: '2026-05-01T00:00:00Z',
			updated_before: '2026-06-01T00:00:00Z',
			limit: 50,
			offset: 20,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_expenses',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			group_id: '321',
			friend_id: '491923',
			dated_after: '2026-05-01T00:00:00Z',
			dated_before: '2026-06-01T00:00:00Z',
			updated_after: '2026-05-01T00:00:00Z',
			updated_before: '2026-06-01T00:00:00Z',
			limit: '50',
			offset: '20',
		});
	});

	it('expenses.list sends no query at all when no filter is given', async () => {
		respond({ expenses: [] });

		await invoke(ExpensesEndpoints.list, {});

		expect(lastRequest().query).toEqual({});
	});

	it('expenses.get GETs v3.0/get_expense/{id}', async () => {
		respond({ expense });

		await invoke(ExpensesEndpoints.get, { expense_id: 51023 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_expense/51023',
			method: 'GET',
		});
	});

	it('expenses.create sends cost as a two-decimal string with flattened shares', async () => {
		respond(expenseCreated);

		await invoke(ExpensesEndpoints.create, {
			description: 'Brunch',
			cost: 25,
			category_id: 15,
			users: [
				{ user_id: 270896089, paid_share: 25, owed_share: 12.5 },
				{ user_id: 491923, paid_share: 0, owed_share: 12.5 },
			],
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/create_expense');
		expect(sent.body).toEqual({
			description: 'Brunch',
			cost: '25.00',
			category_id: 15,
			users__0__user_id: 270896089,
			users__0__paid_share: '25.00',
			users__0__owed_share: '12.50',
			users__1__user_id: 491923,
			users__1__paid_share: '0.00',
			users__1__owed_share: '12.50',
		});
	});

	it('expenses.create supports the equal split shape inside a group', async () => {
		respond(expenseCreated);

		await invoke(ExpensesEndpoints.create, {
			description: 'Internet',
			cost: 60,
			group_id: 321,
			split_equally: true,
		});

		expect(lastRequest().body).toEqual({
			description: 'Internet',
			cost: '60.00',
			group_id: 321,
			split_equally: true,
		});
	});

	it('expenses.create rejects a share list that does not add up to the cost', async () => {
		const error = await captureError(
			invoke(ExpensesEndpoints.create, {
				description: 'Brunch',
				cost: 25,
				users: [
					{ user_id: 270896089, paid_share: 25, owed_share: 10 },
					{ user_id: 491923, paid_share: 0, owed_share: 10 },
				],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('expenses.create rejects an equal split without a group', async () => {
		const error = await captureError(
			invoke(ExpensesEndpoints.create, {
				description: 'Internet',
				cost: 60,
				split_equally: true,
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('expenses.create rejects an equal split combined with shares', async () => {
		const error = await captureError(
			invoke(ExpensesEndpoints.create, {
				description: 'Internet',
				cost: 60,
				group_id: 321,
				split_equally: true,
				users: [{ user_id: 270896089, paid_share: 60, owed_share: 60 }],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('expenses.create throws when Splitwise answers 200 with a populated errors map', async () => {
		respond({
			expenses: [],
			errors: { base: ['Cost must be greater than 0'] },
		});

		const error = await captureError(
			invoke(ExpensesEndpoints.create, {
				description: 'Brunch',
				cost: 25,
				users: [{ user_id: 270896089, paid_share: 25, owed_share: 25 }],
			}),
		);

		expect((error as Error).name).toBe('SplitwiseOperationError');
		expect((error as Error).message).toContain('Cost must be greater than 0');
	});

	it('expenses.update POSTs only the changed fields to update_expense/{id}', async () => {
		respond(expenseCreated);

		await invoke(ExpensesEndpoints.update, {
			expense_id: 51023,
			description: 'Brunch (updated)',
			cost: 30,
		});

		const sent = lastRequest();
		expectAuthenticated();
		expect(sent.path).toBe('/api/v3.0/update_expense/51023');
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			description: 'Brunch (updated)',
			cost: '30.00',
		});
	});

	it('expenses.update requires cost alongside a replacement share list', async () => {
		const error = await captureError(
			invoke(ExpensesEndpoints.update, {
				expense_id: 51023,
				users: [{ user_id: 270896089, paid_share: 30, owed_share: 30 }],
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('expenses.delete POSTs delete_expense/{id}', async () => {
		respond(success);

		await invoke(ExpensesEndpoints.delete, { expense_id: 51023 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/delete_expense/51023',
			method: 'POST',
		});
	});

	it('expenses.delete reports the provider reason when it refuses', async () => {
		respond({
			success: false,
			errors: { expense: ['does not exist, or has already been deleted'] },
		});

		const error = await captureError(
			invoke(ExpensesEndpoints.delete, {
				expense_id: 51023,
			}),
		);

		expect((error as Error).message).toContain(
			'does not exist, or has already been deleted',
		);
	});

	it('expenses.undelete POSTs undelete_expense/{id}', async () => {
		respond(success);

		await invoke(ExpensesEndpoints.undelete, { expense_id: 51023 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/undelete_expense/51023',
			method: 'POST',
		});
	});
});

describe('comments', () => {
	it('comments.list GETs get_comments with expense_id', async () => {
		respond({ comments: [comment] });

		await invoke(CommentsEndpoints.list, { expense_id: 51023 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_comments',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({ expense_id: '51023' });
	});

	it('comments.list requires expense_id', async () => {
		const error = await captureError(invoke(CommentsEndpoints.list, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('comments.create POSTs expense_id and content', async () => {
		respond({ comment });

		await invoke(CommentsEndpoints.create, {
			expense_id: 51023,
			content: 'Does this include the delivery fee?',
		});

		expectAuthenticated();
		expect(lastRequest().body).toEqual({
			expense_id: 51023,
			content: 'Does this include the delivery fee?',
		});
	});

	it('comments.delete POSTs delete_comment/{id} and returns the deleted comment', async () => {
		respond({ comment });

		const result = (await invoke(CommentsEndpoints.delete, {
			comment_id: 79800950,
		})) as { comment: { id: number } };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/delete_comment/79800950',
			method: 'POST',
		});
		expect(result.comment.id).toBe(79800950);
	});
});

describe('notifications', () => {
	it('notifications.list GETs get_notifications with the time filter', async () => {
		respond({ notifications: [notification] });

		await invoke(NotificationsEndpoints.list, {
			updated_after: '2026-05-01T00:00:00Z',
			limit: 10,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_notifications',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			updated_after: '2026-05-01T00:00:00Z',
			limit: '10',
		});
	});

	it('notifications.list omits both filters when unset', async () => {
		respond({ notifications: [] });

		await invoke(NotificationsEndpoints.list, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('reference data', () => {
	it('currencies.list GETs get_currencies', async () => {
		respond({ currencies: [currency] });

		const result = (await invoke(CurrenciesEndpoints.list, {})) as {
			currencies: unknown[]; // unknown: only the length is asserted.
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_currencies',
			method: 'GET',
		});
		expect(result.currencies).toHaveLength(1);
	});

	it('categories.list GETs get_categories and keeps subcategories', async () => {
		respond({ categories: [parentCategory] });

		const result = (await invoke(CategoriesEndpoints.list, {})) as {
			categories: { subcategories: unknown[] }[]; // unknown: length only.
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v3.0/get_categories',
			method: 'GET',
		});
		expect(result.categories[0]?.subcategories).toHaveLength(1);
	});
});

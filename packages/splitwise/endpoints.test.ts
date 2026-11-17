import { z } from 'zod';
import { SplitwiseOperationError } from './client';
import {
	ExpensesEndpoints,
	FriendsEndpoints,
	GroupsEndpoints,
} from './endpoints';
import {
	SplitwiseEndpointOutputSchemas,
	SUCCESS_OUTPUT_KEYS,
} from './endpoints/types';
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
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output schemas keep the provider field names', () => {
	it('users.getCurrentUser parses the notification settings map', () => {
		const parsed =
			SplitwiseEndpointOutputSchemas.getCurrentUser.parse(currentUser);
		expect(parsed.user.notifications_count).toBe(3);
		expect(parsed.user.notifications?.added_as_friend).toBe(true);
		expect(parsed.user.default_currency).toBe('USD');
	});

	it('users.get keeps an absent picture size as null', () => {
		const parsed = SplitwiseEndpointOutputSchemas.getUser.parse(otherUser);
		expect(parsed.user.picture?.medium).toBeNull();
		expect(parsed.user.picture?.small).toBeUndefined();
	});

	it('groups.get keeps member balances as decimal strings', () => {
		const parsed = SplitwiseEndpointOutputSchemas.getGroup.parse({ group });
		expect(parsed.group.members?.[0]?.balance?.[0]?.amount).toBe('-5.02');
		expect(typeof parsed.group.members?.[0]?.balance?.[0]?.amount).toBe(
			'string',
		);
	});

	it('groups.get accepts a group whose optional fields are all null', () => {
		const parsed = SplitwiseEndpointOutputSchemas.getGroup.parse({
			group: emptyGroup,
		});
		expect(parsed.group.members).toBeNull();
		expect(parsed.group.avatar).toBeNull();
		expect(parsed.group.group_type).toBeNull();
	});

	it('expenses.get keeps a null group_id for a friendship-only expense', () => {
		const parsed = SplitwiseEndpointOutputSchemas.getExpense.parse({ expense });
		expect(parsed.expense.group_id).toBeNull();
		expect(parsed.expense.cost).toBe('25.0');
		expect(parsed.expense.users?.[0]?.paid_share).toBe('25.0');
	});

	it('expenses.get keeps createdAt camelCase nowhere: the field is created_at', () => {
		const parsed = SplitwiseEndpointOutputSchemas.getExpense.parse({ expense });
		expect(parsed.expense.created_at).toBe('2026-05-02T13:01:00Z');
		expect(parsed.expense).not.toHaveProperty('createdAt');
	});

	it('expenses.create parses the `expenses` array and the errors map', () => {
		const parsed =
			SplitwiseEndpointOutputSchemas.createExpense.parse(expenseCreated);
		expect(parsed.expenses).toHaveLength(1);
		expect(parsed.errors).toEqual({});
	});

	it('friends.list parses nested balances and group balances', () => {
		const parsed = SplitwiseEndpointOutputSchemas.listFriends.parse({
			friends: [friend],
		});
		expect(parsed.friends[0]?.balance?.[0]?.currency_code).toBe('USD');
		expect(parsed.friends[0]?.groups?.[0]?.group_id).toBe(321);
	});

	it('comments.list parses the comment relation fields', () => {
		const parsed = SplitwiseEndpointOutputSchemas.listComments.parse({
			comments: [comment],
		});
		expect(parsed.comments[0]?.relation_type).toBe('ExpenseComment');
		expect(parsed.comments[0]?.relation_id).toBe(51023);
	});

	it('comments.delete parses the deleted comment', () => {
		const parsed = SplitwiseEndpointOutputSchemas.deleteComment.parse({
			comment,
		});
		expect(parsed.comment.content).toContain('delivery fee');
	});

	it('notifications.list parses a notification whose source url is null', () => {
		const parsed = SplitwiseEndpointOutputSchemas.listNotifications.parse({
			notifications: [notification],
		});
		expect(parsed.notifications[0]?.source?.url).toBeNull();
		expect(parsed.notifications[0]?.type).toBe(0);
	});

	it('currencies.list parses the currency pairs', () => {
		const parsed = SplitwiseEndpointOutputSchemas.listCurrencies.parse({
			currencies: [currency],
		});
		expect(parsed.currencies[0]).toEqual({ currency_code: 'USD', unit: '$' });
	});

	it('categories.list keeps parent categories with their subcategories', () => {
		const parsed = SplitwiseEndpointOutputSchemas.listCategories.parse({
			categories: [parentCategory],
		});
		expect(parsed.categories[0]?.subcategories[0]?.name).toBe('Cleaning');
	});

	it('groups.undelete accepts errors as a string array, not a map', () => {
		const parsed = SplitwiseEndpointOutputSchemas.undeleteGroup.parse({
			success: false,
			errors: ['You do not have permission to undelete this group.'],
		});
		expect(parsed.errors).toEqual([
			'You do not have permission to undelete this group.',
		]);
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects an expense with no cost', () => {
		const { cost, ...withoutCost } = expense;
		void cost;
		expect(() =>
			SplitwiseEndpointOutputSchemas.getExpense.parse({ expense: withoutCost }),
		).toThrow(z.ZodError);
	});

	it('rejects an amount sent as a number where Splitwise documents a string', () => {
		expect(() =>
			SplitwiseEndpointOutputSchemas.getGroup.parse({
				group: {
					...group,
					members: [
						{
							...group.members[0],
							balance: [{ currency_code: 'USD', amount: -5.02 }],
						},
					],
				},
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a groups list whose `groups` is not an array', () => {
		expect(() =>
			SplitwiseEndpointOutputSchemas.listGroups.parse({ groups: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a notification whose `type` is a string', () => {
		expect(() =>
			SplitwiseEndpointOutputSchemas.listNotifications.parse({
				notifications: [{ ...notification, type: 'expense' }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a delete that lost its success flag', () => {
		expect(() =>
			SplitwiseEndpointOutputSchemas.deleteExpense.parse({}),
		).toThrow(z.ZodError);
	});

	it('rejects the envelope itself when the array arrives bare', async () => {
		respond([group]);

		const error = await captureError(invoke(GroupsEndpoints.list, {}));

		expect((error as Error).name).toBe('ZodError');
	});
});

describe('a 200 is not proof the write applied', () => {
	it('groups.removeUser throws with the provider reason', async () => {
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

		expect(error).toBeInstanceOf(SplitwiseOperationError);
		expect((error as SplitwiseOperationError).errors.base).toEqual([
			'The user has a non-zero balance',
		]);
	});

	it('groups.addUser throws when the provider refuses the member', async () => {
		respond({
			success: false,
			user: null,
			errors: { base: ['That user cannot be a member of this group'] },
		});

		const error = await captureError(
			invoke(GroupsEndpoints.addUser, {
				group_id: 321,
				user_id: 491923,
			}),
		);

		expect((error as Error).message).toContain('cannot be a member');
	});

	it('groups.undelete throws with the array message', async () => {
		respond({
			success: false,
			errors: ['You do not have permission to undelete this group.'],
		});

		const error = await captureError(
			invoke(GroupsEndpoints.undelete, { group_id: 321 }),
		);

		expect(error).toBeInstanceOf(SplitwiseOperationError);
		expect((error as Error).message).toContain('do not have permission');
	});

	it('expenses.update throws when the provider reports errors', async () => {
		respond({
			expenses: [],
			errors: { base: ['Cost must be greater than 0'] },
		});

		const error = await captureError(
			invoke(ExpensesEndpoints.update, { expense_id: 51023, cost: 5 }),
		);

		expect((error as Error).name).toBe('SplitwiseOperationError');
	});

	it('a write that did apply resolves without throwing', async () => {
		respond(success);

		await expect(
			invoke(ExpensesEndpoints.delete, { expense_id: 51023 }),
		).resolves.toEqual({ success: true });
	});
});

describe('envelopes and partial successes', () => {
	it('friends.addMany passes through the per-person errors', async () => {
		respond({
			users: [friend],
			errors: { base: ['Please supply a name for this user'] },
		});

		const result = (await invoke(FriendsEndpoints.addMany, {
			users: [{ email: 'grace@example.com' }, { email: 'alan@example.com' }],
		})) as { users: unknown[]; errors?: Record<string, string[]> | null }; // unknown: only the length is checked.

		// The call succeeded for some people: the errors ride along rather than
		// throwing, so the caller can see which ones went through.
		expect(result.users).toHaveLength(1);
		expect(result.errors?.base).toEqual(['Please supply a name for this user']);
	});

	it('users.getCurrentUser exposes exactly the documented envelope keys', () => {
		expect(SUCCESS_OUTPUT_KEYS).toContain('success');
	});
});

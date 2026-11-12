import { logEventFromContext } from 'corsair/core';
import { YnabAPIError } from './client';
import {
	Accounts,
	Budgets,
	Categories,
	Months,
	Payees,
	Transactions,
	User,
} from './endpoints';
import { YnabEndpointInputSchemas } from './endpoints/types';
import {
	account,
	accountId,
	budgetDetail,
	budgetId,
	budgetsList,
	category,
	categoryGroup,
	categoryId,
	month,
	payee,
	payeeId,
	scheduledId,
	scheduledTransaction,
	transaction,
	transactionId,
	unauthorized,
	user,
	userId,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
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

describe('budgets', () => {
	it('lists budgets', async () => {
		respond(fetchMock, budgetsList);

		const result = await invoke(Budgets.list, {});

		expect(result).toEqual(budgetsList);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/v1/budgets');
	});

	it('reads a whole budget, reporting the server counter for a later delta', async () => {
		respond(fetchMock, budgetDetail);

		await invoke(Budgets.get, { budgetId });

		expect(lastRequest(fetchMock).path).toBe(`/v1/budgets/${budgetId}`);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.budgets.get',
			expect.objectContaining({ id: budgetId, serverKnowledge: 1234 }),
			'completed',
		);
	});

	it('accepts the last-used alias', async () => {
		respond(fetchMock, budgetDetail);

		await invoke(Budgets.get, { budgetId: 'last-used' });

		expect(lastRequest(fetchMock).path).toBe('/v1/budgets/last-used');
	});

	it('surfaces a bad token as a YnabAPIError', async () => {
		respond(fetchMock, unauthorized, 401);

		await expect(invoke(Budgets.list, {})).rejects.toBeInstanceOf(YnabAPIError);
	});
});

describe('accounts', () => {
	it('lists accounts, with balances in milliunits', async () => {
		respond(fetchMock, { data: { accounts: [account], server_knowledge: 5 } });

		const result = (await invoke(Accounts.list, { budgetId })) as {
			data: { accounts?: { balance?: number }[] };
		};

		// $1,234.56 is 1,234,560 milliunits.
		expect(result.data.accounts?.[0]?.balance).toBe(1_234_560);
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/budgets/${budgetId}/accounts`,
		);
	});

	it('sends the delta counter', async () => {
		respond(fetchMock, { data: { accounts: [] } });

		await invoke(Accounts.list, {
			budgetId,
			last_knowledge_of_server: 1234,
		});

		expect(lastRequest(fetchMock).query.last_knowledge_of_server).toBe('1234');
	});

	it('reads one account and logs its balance', async () => {
		respond(fetchMock, { data: { account } });

		await invoke(Accounts.get, { budgetId, accountId });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.accounts.get',
			{ id: accountId, balance: 1_234_560, onBudget: true },
			'completed',
		);
	});

	it('creates an account, wrapping the body in an account key', async () => {
		respond(fetchMock, { data: { account } });

		await invoke(Accounts.create, {
			budgetId,
			name: 'Checking',
			type: 'checking',
			balance: 1_234_560,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			account: { name: 'Checking', type: 'checking', balance: 1_234_560 },
		});
	});

	it('rejects a fractional balance, which is not a whole milliunit', async () => {
		await expect(
			invoke(Accounts.create, {
				budgetId,
				name: 'Checking',
				type: 'checking',
				balance: 12.5,
			}),
		).rejects.toThrow();
		// A milliunit is the smallest unit, so a fraction of one is not a valid
		// amount; the schema rejects it rather than rounding.
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('categories', () => {
	it('lists category groups and categories', async () => {
		respond(fetchMock, {
			data: {
				category_groups: [categoryGroup],
				categories: [category],
				server_knowledge: 9,
			},
		});

		await invoke(Categories.list, { budgetId });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.categories.list',
			{ groups: 1, categories: 1 },
			'completed',
		);
	});

	it('reads one category with its milliunit amounts', async () => {
		respond(fetchMock, { data: { category } });

		const result = (await invoke(Categories.get, {
			budgetId,
			categoryId,
		})) as { data: { category?: { budgeted?: number } } };

		expect(result.data.category?.budgeted).toBe(300_000);
	});

	it('sets a category amount, replacing rather than adding', async () => {
		respond(fetchMock, { data: { category } });

		await invoke(Categories.update, {
			budgetId,
			month: '2024-06-01',
			categoryId,
			budgeted: 500_000,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe(
			`/v1/budgets/${budgetId}/months/2024-06-01/categories/${categoryId}`,
		);
		expect(sent.body).toEqual({ category: { budgeted: 500_000 } });
	});
});

describe('payees', () => {
	it('lists payees', async () => {
		respond(fetchMock, { data: { payees: [payee], server_knowledge: 3 } });

		// unknown: this assertion only checks the array length.
		const result = (await invoke(Payees.list, { budgetId })) as {
			data: { payees?: unknown[] };
		};

		expect(result.data.payees).toHaveLength(1);
	});

	it('reads one payee without logging its name', async () => {
		respond(fetchMock, { data: { payee } });

		await invoke(Payees.get, { budgetId, payeeId });

		// unknown: event fields vary by operation; only id and absence of name are checked.
		// A payee name can be a merchant or an employer.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(logged).not.toHaveProperty('name');
		expect(logged.id).toBe(payeeId);
	});

	it('creates a payee', async () => {
		respond(fetchMock, { data: { payee } });

		await invoke(Payees.create, { budgetId, name: 'Acme Grocer' });

		expect(lastRequest(fetchMock).body).toEqual({
			payee: { name: 'Acme Grocer' },
		});
	});

	it('renames a payee', async () => {
		respond(fetchMock, { data: { payee } });

		await invoke(Payees.update, { budgetId, payeeId, name: 'Renamed' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe(`/v1/budgets/${budgetId}/payees/${payeeId}`);
	});
});

describe('months', () => {
	it('lists months', async () => {
		respond(fetchMock, { data: { months: [month], server_knowledge: 7 } });

		await invoke(Months.list, { budgetId });

		expect(lastRequest(fetchMock).path).toBe(`/v1/budgets/${budgetId}/months`);
	});

	it('reads one month, logging what is still unassigned', async () => {
		respond(fetchMock, { data: { month } });

		await invoke(Months.get, { budgetId, month: '2024-06-01' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.months.get',
			{ month: '2024-06-01', income: 5_000_000, toBeBudgeted: 800_000 },
			'completed',
		);
	});
});

describe('transactions', () => {
	it('lists transactions with a since date', async () => {
		respond(fetchMock, {
			data: { transactions: [transaction], server_knowledge: 11 },
		});

		await invoke(Transactions.list, {
			budgetId,
			since_date: '2024-06-01',
		});

		expect(lastRequest(fetchMock).query.since_date).toBe('2024-06-01');
	});

	it('filters to uncategorized', async () => {
		respond(fetchMock, { data: { transactions: [] } });

		await invoke(Transactions.list, { budgetId, type: 'uncategorized' });

		expect(lastRequest(fetchMock).query.type).toBe('uncategorized');
	});

	it('reads one transaction, keeping money and state out of the memo', async () => {
		respond(fetchMock, { data: { transaction } });

		await invoke(Transactions.get, { budgetId, transactionId });

		// unknown: event fields vary by operation; this checks the transaction log.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		// The memo can name a merchant or a person.
		expect(logged).not.toHaveProperty('memo');
		expect(logged).not.toHaveProperty('payee_name');
		expect(logged.amount).toBe(-123_450);
		expect(logged.cleared).toBe('cleared');
	});

	it('reads a split transaction, whose parent category is null', async () => {
		respond(fetchMock, {
			data: {
				transaction: {
					...transaction,
					category_id: null,
					subtransactions: [
						{ id: 's1', amount: -150_000, category_name: 'Groceries' },
						{ id: 's2', amount: -50_000, category_name: 'Household' },
					],
				},
			},
		});

		// unknown: only the split count is checked here.
		const result = (await invoke(Transactions.get, {
			budgetId,
			transactionId,
		})) as {
			data: { transaction?: { subtransactions?: unknown[] } };
		};

		expect(result.data.transaction?.subtransactions).toHaveLength(2);
	});

	it('creates a batch of transactions in one call', async () => {
		respond(fetchMock, {
			data: {
				transaction_ids: ['t1', 't2'],
				transactions: [],
				duplicate_import_ids: [],
			},
		});

		await invoke(Transactions.create, {
			budgetId,
			transactions: [
				{ account_id: accountId, date: '2024-06-01', amount: -123_450 },
				{ account_id: accountId, date: '2024-06-02', amount: -5_000 },
			],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/v1/budgets/${budgetId}/transactions`);
		expect(
			// unknown: only the length is asserted here.
			(sent.body as { transactions: unknown[] }).transactions,
		).toHaveLength(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.transactions.create',
			{ sent: 2, created: 2, duplicates: 0 },
			'completed',
		);
	});

	it('reports duplicates when an import_id repeats', async () => {
		respond(fetchMock, {
			data: {
				transaction_ids: [],
				transactions: [],
				duplicate_import_ids: ['import-1'],
			},
		});

		await invoke(Transactions.create, {
			budgetId,
			transactions: [
				{
					account_id: accountId,
					date: '2024-06-01',
					amount: -123_450,
					import_id: 'import-1',
				},
			],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.transactions.create',
			{ sent: 1, created: 0, duplicates: 1 },
			'completed',
		);
	});

	it('rejects more than 500 transactions in one call', async () => {
		await expect(
			invoke(Transactions.create, {
				budgetId,
				transactions: Array.from({ length: 501 }, () => ({
					account_id: accountId,
					date: '2024-06-01',
					amount: -1000,
				})),
			}),
		).rejects.toThrow();
	});

	it('rejects a fractional amount, which is not a whole milliunit', async () => {
		await expect(
			invoke(Transactions.create, {
				budgetId,
				transactions: [
					{ account_id: accountId, date: '2024-06-01', amount: -1234.5 },
				],
			}),
		).rejects.toThrow();
	});

	it('updates a transaction, wrapping it in a transaction key', async () => {
		respond(fetchMock, { data: { transaction } });

		await invoke(Transactions.update, {
			budgetId,
			transactionId,
			amount: -200_000,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ transaction: { amount: -200_000 } });
	});

	it('deletes a transaction', async () => {
		respond(fetchMock, { data: { transaction } });

		await invoke(Transactions.remove, { budgetId, transactionId });

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('scheduled transactions', () => {
	it('lists them with their frequency', async () => {
		respond(fetchMock, {
			data: {
				scheduled_transactions: [scheduledTransaction],
				server_knowledge: 4,
			},
		});

		await invoke(Transactions.scheduledList, { budgetId });

		expect(lastRequest(fetchMock).path).toBe(
			`/v1/budgets/${budgetId}/scheduled_transactions`,
		);
	});

	it('reads one, logging its frequency and next date', async () => {
		respond(fetchMock, {
			data: { scheduled_transaction: scheduledTransaction },
		});

		await invoke(Transactions.scheduledGet, {
			budgetId,
			scheduledTransactionId: scheduledId,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ynab.transactions.scheduledGet',
			{
				id: scheduledId,
				frequency: 'monthly',
				next: '2024-07-01',
			},
			'completed',
		);
	});

	it('creates one with a frequency', async () => {
		respond(fetchMock, {
			data: { scheduled_transaction: scheduledTransaction },
		});

		await invoke(Transactions.scheduledCreate, {
			budgetId,
			scheduled_transaction: {
				account_id: accountId,
				date: '2024-07-01',
				amount: -150_000,
				frequency: 'monthly',
			},
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toMatchObject({
			scheduled_transaction: { frequency: 'monthly' },
		});
	});

	it('rejects an unknown frequency', async () => {
		await expect(
			invoke(Transactions.scheduledCreate, {
				budgetId,
				scheduled_transaction: {
					account_id: accountId,
					date: '2024-07-01',
					amount: -150_000,
					frequency: 'fortnightly',
				},
			}),
		).rejects.toThrow();
	});

	it('deletes one', async () => {
		respond(fetchMock, {
			data: { scheduled_transaction: scheduledTransaction },
		});

		await invoke(Transactions.scheduledDelete, {
			budgetId,
			scheduledTransactionId: scheduledId,
		});

		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('user', () => {
	it('reads the user behind the token', async () => {
		respond(fetchMock, { data: { user } });

		const result = (await invoke(User.get, {})) as {
			data: { user?: { id?: string } };
		};

		expect(result.data.user?.id).toBe(userId);
		expect(lastRequest(fetchMock).path).toBe('/v1/user');
	});
});

describe('review fixes', () => {
	it('rejects a malformed transaction date before sending', async () => {
		await expect(
			invoke(Transactions.create, {
				budgetId: 'b-1',
				transactions: [
					{ account_id: 'a-1', date: '11/11/2026', amount: -1000 },
				],
			}),
		).rejects.toThrow(/yyyy-MM-dd/);
	});

	it('rejects a month that is not the first of the month', async () => {
		await expect(
			invoke(Months.get, { budgetId: 'b-1', month: '2026-11-15' }),
		).rejects.toThrow(/yyyy-MM-01/);
	});

	it('accepts null to clear a category on update', async () => {
		respond(fetchMock, { data: { transaction } });

		await invoke(Transactions.update, {
			budgetId: 'b-1',
			transactionId: 't-1',
			category_id: null,
		});

		// unknown: only the one field sent is asserted on.
		const body = lastRequest(fetchMock).body as { transaction?: unknown };
		expect(body.transaction).toMatchObject({ category_id: null });
	});

	it('rejects a loan account type on create, which is read-side only', async () => {
		await expect(
			invoke(Accounts.create, {
				budgetId: 'b-1',
				name: 'Car',
				type: 'autoLoan',
				balance: 0,
			}),
		).rejects.toThrow();
	});
});

describe('calendar and response validation', () => {
	it.each(['2026-00-01', '2026-13-01'])(
		'rejects invalid month %s before sending',
		async (month) => {
			await expect(invoke(Months.get, { budgetId, month })).rejects.toThrow();
			await expect(
				invoke(Categories.update, { budgetId, categoryId, month, budgeted: 0 }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it.each([
		'2026-02-29',
		'2026-04-31',
		'2026-00-10',
		'2026-13-10',
		'2026-11-00',
	])('rejects impossible date %s before sending', async (date) => {
		await expect(
			invoke(Transactions.create, {
				budgetId,
				transactions: [{ account_id: accountId, date, amount: 0 }],
			}),
		).rejects.toThrow();
		await expect(
			invoke(Transactions.list, { budgetId, since_date: date }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('accepts a leap day', async () => {
		respond(fetchMock, { data: { transactions: [] } });
		await invoke(Transactions.list, { budgetId, since_date: '2024-02-29' });
		expect(lastRequest(fetchMock).query.since_date).toBe('2024-02-29');
	});
	it('preserves future cleared statuses in responses', async () => {
		respond(fetchMock, {
			data: { transaction: { ...transaction, cleared: 'future-status' } },
		});
		await expect(
			invoke(Transactions.get, { budgetId, transactionId }),
		).resolves.toMatchObject({
			data: { transaction: { cleared: 'future-status' } },
		});
	});
});

describe('scheduled transaction input', () => {
	it('does not advertise fields a scheduled transaction lacks', () => {
		const shape =
			YnabEndpointInputSchemas.scheduledCreate.shape.scheduled_transaction
				.shape;
		// SaveScheduledTransaction has no cleared, approved or import_id.
		expect(Object.keys(shape)).not.toEqual(expect.arrayContaining(['cleared']));
		expect(Object.keys(shape)).not.toEqual(
			expect.arrayContaining(['approved']),
		);
		expect(Object.keys(shape)).not.toEqual(
			expect.arrayContaining(['import_id']),
		);
		expect(Object.keys(shape)).toEqual(
			expect.arrayContaining(['account_id', 'date', 'amount', 'frequency']),
		);
	});
});

describe('round 2 review fixes', () => {
	it('documents that an omitted since_date returns only the past year', () => {
		const description =
			YnabEndpointInputSchemas.transactionsList.shape.since_date.description;
		expect(description).toMatch(/one year ago/);
	});

	it('accepts the current month alias on months.get and categories.update', async () => {
		respond(fetchMock, { data: { month } });
		await invoke(Months.get, { budgetId, month: 'current' });
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/budgets/${budgetId}/months/current`,
		);

		respond(fetchMock, { data: { category } });
		await invoke(Categories.update, {
			budgetId,
			categoryId,
			month: 'current',
			budgeted: 1_000,
		});
		expect(lastRequest(fetchMock).path).toBe(
			`/v1/budgets/${budgetId}/months/current/categories/${categoryId}`,
		);
	});
});

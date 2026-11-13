import { callEndpoint } from './endpoint-caller';
import * as Org from './endpoints/org';
import * as Spend from './endpoints/spend';
import * as Transactions from './endpoints/transactions';
import {
	BILL,
	BILL_ID,
	BILL_PAGE,
	BUSINESS,
	DEPARTMENT,
	DEPARTMENT_ID,
	DEPARTMENT_PAGE,
	MEMO,
	MERCHANT_PAGE,
	REIMBURSEMENT_PAGE,
	TRANSACTION,
	TRANSACTION_ID,
	TRANSACTION_PAGE,
	TRANSACTION_PAGE_WITH_NEXT,
	USER,
	USER_ID,
	USER_PAGE,
	VIRTUAL_CARD_PAGE,
} from './test-fixtures';
import { lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('transactions.list', () => {
	it('sends every filter and paginates with the provider cursor', async () => {
		respond(fetchMock, TRANSACTION_PAGE_WITH_NEXT);

		const result = await callEndpoint(Transactions.list, {
			state: 'ALL',
			sync_status: 'SYNCED',
			from_date: '2026-05-01T00:00:00Z',
			to_date: '2026-06-01T00:00:00Z',
			user_id: USER_ID,
			merchant_id: '7e4d2c10-3b5a-4f8e-9c1d-2a3b4c5d6e7f',
			department_id: DEPARTMENT_ID,
			entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
			sk_category_id: 19,
			has_been_approved: true,
			requires_memo: true,
			min_amount: '10.50',
			max_amount: 500,
			include_count: true,
			include_merchant_data: true,
			start: TRANSACTION_ID,
			page_size: 50,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/transactions');
		expect(request.method).toBe('GET');
		expect(request.query).toEqual({
			state: 'ALL',
			sync_status: 'SYNCED',
			from_date: '2026-05-01T00:00:00Z',
			to_date: '2026-06-01T00:00:00Z',
			user_id: USER_ID,
			merchant_id: '7e4d2c10-3b5a-4f8e-9c1d-2a3b4c5d6e7f',
			department_id: DEPARTMENT_ID,
			entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
			sk_category_id: '19',
			has_been_approved: 'true',
			requires_memo: 'true',
			min_amount: '10.50',
			max_amount: '500',
			include_count: 'true',
			include_merchant_data: 'true',
			start: TRANSACTION_ID,
			page_size: '50',
		});
		expect(result.transactions).toHaveLength(1);
		expect(result.transactions[0]?.id).toBe(TRANSACTION_ID);
		expect(result.next_cursor).toBe(TRANSACTION_ID);
	});

	it('omits an unset filter rather than sending an empty value', async () => {
		respond(fetchMock, TRANSACTION_PAGE);

		const result = await callEndpoint(Transactions.list, {});

		expect(lastRequest(fetchMock).query).toEqual({});
		expect(result.next_cursor).toBeNull();
		expect(result.total_count).toBeNull();
	});

	it('turns the sort pair into exactly one ordering boolean', async () => {
		respond(fetchMock, TRANSACTION_PAGE);

		await callEndpoint(Transactions.list, {
			sort: { by: 'amount', direction: 'desc' },
		});

		expect(lastRequest(fetchMock).query).toEqual({
			order_by_amount_desc: 'true',
		});
	});

	it('rejects a page size above the documented maximum', async () => {
		await expect(
			callEndpoint(Transactions.list, { page_size: 101 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a sort direction Ramp does not accept', async () => {
		await expect(
			callEndpoint(Transactions.list, {
				sort: { by: 'date', direction: 'up' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('transactions.get', () => {
	it('reads one transaction by id', async () => {
		respond(fetchMock, TRANSACTION);

		const result = await callEndpoint(Transactions.get, {
			transaction_id: TRANSACTION_ID,
			include_merchant_data: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/developer/v1/transactions/${TRANSACTION_ID}`);
		expect(request.query).toEqual({ include_merchant_data: 'true' });
		expect(result.transaction.merchant_name).toBe('Chipotle');
		expect(result.transaction.card_holder?.first_name).toBe('Patrick');
	});

	it('keeps a null optional as null rather than inventing a value', async () => {
		respond(fetchMock, TRANSACTION);

		const result = await callEndpoint(Transactions.get, {
			transaction_id: TRANSACTION_ID,
		});

		expect(result.transaction.trip_id).toBeNull();
		expect(result.transaction.statement_id).toBeNull();
	});
});

describe('transactions.update', () => {
	it('sends the line items as minor-unit amounts', async () => {
		respond(fetchMock, TRANSACTION);

		const result = await callEndpoint(Transactions.update, {
			transaction_id: TRANSACTION_ID,
			line_items: [
				{ amount: 5000, memo: 'Entrees' },
				{ amount: 4000, memo: 'Drinks' },
			],
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/developer/v1/transactions/${TRANSACTION_ID}`);
		expect(request.json()).toEqual({
			line_items: [
				{ amount: 5000, memo: 'Entrees' },
				{ amount: 4000, memo: 'Drinks' },
			],
		});
		expect(result.transaction.id).toBe(TRANSACTION_ID);
	});

	it('sends an empty array to remove an existing split', async () => {
		respond(fetchMock, TRANSACTION);

		await callEndpoint(Transactions.update, {
			transaction_id: TRANSACTION_ID,
			line_items: [],
		});

		expect(lastRequest(fetchMock).json()).toEqual({ line_items: [] });
	});

	it('rejects a line item with no accounting field choice', async () => {
		await expect(
			callEndpoint(Transactions.update, {
				transaction_id: TRANSACTION_ID,
				line_items: [
					{
						amount: 100,
						accounting_field_selections: [{ field_id: USER_ID }],
					},
				],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a field selected by both ids at once', async () => {
		await expect(
			callEndpoint(Transactions.update, {
				transaction_id: TRANSACTION_ID,
				line_items: [
					{
						amount: 100,
						accounting_field_selections: [
							{
								field_id: USER_ID,
								field_external_id: 'GL-1',
								field_option_id: DEPARTMENT_ID,
							},
						],
					},
				],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('merchants.list', () => {
	it('sends the merchant filters', async () => {
		respond(fetchMock, MERCHANT_PAGE);

		const result = await callEndpoint(Spend.list, {
			merchant_name: 'Chip',
			merchant_url: 'chipotle.com',
			transaction_from_date: '2026-01-01T00:00:00Z',
			transaction_to_date: '2026-06-01T00:00:00Z',
			page_size: 2,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/merchants');
		expect(request.query).toEqual({
			merchant_name: 'Chip',
			merchant_url: 'chipotle.com',
			transaction_from_date: '2026-01-01T00:00:00Z',
			transaction_to_date: '2026-06-01T00:00:00Z',
			page_size: '2',
		});
		expect(result.merchants[0]?.merchant_name).toBe('Chipotle');
	});

	it('pages through the envelope without inventing an empty page', async () => {
		respond(fetchMock, { page: { next: null } });

		// `data` is required on a 200 response, so a body without it fails the
		// parse rather than returning a plausible empty list.
		await expect(callEndpoint(Spend.list, {})).rejects.toThrow();
	});
});

describe('cards.listVirtual', () => {
	it('sends the card filters', async () => {
		respond(fetchMock, VIRTUAL_CARD_PAGE);

		const result = await callEndpoint(Spend.listVirtual, {
			entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
			user_id: USER_ID,
			is_terminated: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/cards/virtual');
		expect(request.query).toEqual({
			entity_id: '24850cdb-1b3f-4eb9-bf20-967ca9f97605',
			user_id: USER_ID,
			is_terminated: 'false',
		});
		expect(result.cards[0]?.is_card_suspended).toBe(false);
	});

	it('rejects a filter that is not a uuid', async () => {
		await expect(
			callEndpoint(Spend.listVirtual, { user_id: 'not-a-uuid' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('bills.list', () => {
	it('sends the comma-separated status summaries', async () => {
		respond(fetchMock, BILL_PAGE);

		const result = await callEndpoint(Spend.billsList, {
			vendor_id: '9b1c0a4e-6f4c-4b3a-9f6d-0a1b2c3d4e5f',
			status_summaries: ['PAYMENT_COMPLETED', 'AWAITING_PAYMENT'],
			approval_status: 'APPROVED',
			payment_status: 'PAID',
			sync_status: 'BILL_SYNCED',
			is_archived: false,
			from_due_date: '2026-05-01T00:00:00Z',
			min_amount: 100,
			page_size: 10,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/bills');
		expect(request.query).toEqual({
			vendor_id: '9b1c0a4e-6f4c-4b3a-9f6d-0a1b2c3d4e5f',
			status_summaries: 'PAYMENT_COMPLETED,AWAITING_PAYMENT',
			approval_status: 'APPROVED',
			payment_status: 'PAID',
			sync_status: 'BILL_SYNCED',
			is_archived: 'false',
			from_due_date: '2026-05-01T00:00:00Z',
			min_amount: '100',
			page_size: '10',
		});
		expect(result.bills[0]?.invoice_number).toBe('INV-2026-0042');
		expect(result.bills[0]?.vendor?.name).toBe('Northwind Hosting');
	});

	it('rejects a status summary the API does not define', async () => {
		await expect(
			callEndpoint(Spend.billsList, { status_summaries: ['NOT_A_STATUS'] }),
		).rejects.toThrow();
		// PAID is a payment_status value, not a status summary.
		await expect(
			callEndpoint(Spend.billsList, { status_summaries: ['PAID'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts every status summary in the API reference', async () => {
		respond(fetchMock, BILL_PAGE);

		await callEndpoint(Spend.billsList, {
			status_summaries: ['PAYMENT_ERROR', 'WAITING_FOR_VENDOR', 'ON_HOLD'],
		});

		expect(lastRequest(fetchMock).query).toEqual({
			status_summaries: 'PAYMENT_ERROR,WAITING_FOR_VENDOR,ON_HOLD',
		});
	});
});

describe('bills.get', () => {
	it('reads one bill by id', async () => {
		respond(fetchMock, BILL);

		const result = await callEndpoint(Spend.billsGet, { bill_id: BILL_ID });

		expect(lastRequest(fetchMock).path).toBe(`/developer/v1/bills/${BILL_ID}`);
		expect(result.bill.payment?.customer_friendly_payment_id).toBe('PAY-4471');
		expect(result.bill.amount?.amount).toBe(125000);
	});
});

describe('bills.update', () => {
	it('sends only the fields the caller set', async () => {
		respond(fetchMock, BILL);

		await callEndpoint(Spend.billsUpdate, {
			bill_id: BILL_ID,
			memo: 'Q2 hosting, corrected',
			due_at: '2026-06-15',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/developer/v1/bills/${BILL_ID}`);
		expect(request.json()).toEqual({
			memo: 'Q2 hosting, corrected',
			due_at: '2026-06-15',
		});
	});
});

describe('input checks that stop a request Ramp would refuse', () => {
	it('rejects requires_memo: false, which Ramp answers with 422', async () => {
		await expect(
			callEndpoint(Transactions.list, { requires_memo: false }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each(['tomorrow', '2026-13-40', '2026-02-30', '2026-6-15'])(
		'rejects the due date %s before sending the bill update',
		async (due) => {
			await expect(
				callEndpoint(Spend.billsUpdate, { bill_id: BILL_ID, due_at: due }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('reimbursements.list', () => {
	it('sends the reimbursement filters', async () => {
		respond(fetchMock, REIMBURSEMENT_PAGE);

		const result = await callEndpoint(Org.list, {
			direction: 'BUSINESS_TO_USER',
			state: 'APPROVED',
			sync_status: 'SYNCED',
			user_id: USER_ID,
			has_been_approved: true,
			updated_after: '2026-05-01T00:00:00Z',
			page_size: 25,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/reimbursements');
		expect(request.query).toEqual({
			direction: 'BUSINESS_TO_USER',
			state: 'APPROVED',
			sync_status: 'SYNCED',
			user_id: USER_ID,
			has_been_approved: 'true',
			updated_after: '2026-05-01T00:00:00Z',
			page_size: '25',
		});
		expect(result.reimbursements[0]?.type).toBe('MILEAGE');
		expect(result.reimbursements[0]?.payee_amount?.amount).toBe(2975);
	});

	it('reads mileage waypoints as strings and the value/currency amounts', async () => {
		respond(fetchMock, REIMBURSEMENT_PAGE);

		const result = await callEndpoint(Org.list, {});

		const reimbursement = result.reimbursements[0];
		expect(reimbursement?.waypoints).toEqual([
			'Union Square, San Francisco, CA',
		]);
		expect(reimbursement?.entity_amount?.value).toBe(2975);
		expect(reimbursement?.entity_amount?.currency).toBe('USD');
	});

	it('accepts the paid-out states in the API reference', async () => {
		respond(fetchMock, REIMBURSEMENT_PAGE);

		await callEndpoint(Org.list, { state: 'REIMBURSED' });

		expect(lastRequest(fetchMock).query).toEqual({ state: 'REIMBURSED' });
	});
});

describe('memos.get', () => {
	it('reads the memo for a transaction', async () => {
		respond(fetchMock, MEMO);

		const result = await callEndpoint(Org.memoGet, {
			transaction_id: TRANSACTION_ID,
		});

		expect(lastRequest(fetchMock).path).toBe(
			`/developer/v1/memos/${TRANSACTION_ID}`,
		);
		expect(result.memo.memo).toBe('Team lunch');
	});
});

describe('memos.create', () => {
	it('posts the memo text', async () => {
		respond(fetchMock, MEMO);

		const result = await callEndpoint(Org.memoCreate, {
			transaction_id: TRANSACTION_ID,
			memo: 'Team lunch',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe(`/developer/v1/memos/${TRANSACTION_ID}`);
		expect(request.json()).toEqual({ memo: 'Team lunch' });
		expect(result.memo.id).toBe(TRANSACTION_ID);
	});

	it('rejects a memo over the documented 255 character cap', async () => {
		await expect(
			callEndpoint(Org.memoCreate, {
				transaction_id: TRANSACTION_ID,
				memo: 'x'.repeat(256),
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a memo exactly at the cap', async () => {
		respond(fetchMock, MEMO);

		await callEndpoint(Org.memoCreate, {
			transaction_id: TRANSACTION_ID,
			memo: 'x'.repeat(255),
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('departments.list', () => {
	it('reads a page of departments', async () => {
		respond(fetchMock, DEPARTMENT_PAGE);

		const result = await callEndpoint(Org.departmentsList, { page_size: 2 });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/departments');
		expect(request.query).toEqual({ page_size: '2' });
		expect(result.departments[0]?.name).toBe('Engineering');
	});
});

describe('departments.create', () => {
	it('posts the department name', async () => {
		respond(fetchMock, DEPARTMENT, 201);

		const result = await callEndpoint(Org.departmentsCreate, {
			name: 'Engineering',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/developer/v1/departments');
		expect(request.json()).toEqual({ name: 'Engineering' });
		expect(result.department.id).toBe(DEPARTMENT_ID);
	});

	it('rejects an empty name before sending anything', async () => {
		await expect(
			callEndpoint(Org.departmentsCreate, { name: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('users.list', () => {
	it('sends the user filters', async () => {
		respond(fetchMock, USER_PAGE);

		const result = await callEndpoint(Org.usersList, {
			email: 'linda@company.com',
			role: 'BUSINESS_USER',
			status: 'USER_ACTIVE',
			department_id: DEPARTMENT_ID,
			page_size: 5,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/users');
		expect(request.query).toEqual({
			email: 'linda@company.com',
			role: 'BUSINESS_USER',
			status: 'USER_ACTIVE',
			department_id: DEPARTMENT_ID,
			page_size: '5',
		});
		expect(result.users[0]?.first_name).toBe('Linda');
	});

	it('keeps a numeric phone the API sends as a number', async () => {
		respond(fetchMock, USER_PAGE);

		const result = await callEndpoint(Org.usersList, {});

		expect(result.users[0]?.phone).toBe(8004559999);
	});

	it('rejects a role the API does not define', async () => {
		await expect(
			callEndpoint(Org.usersList, { role: 'SUPERUSER' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts the roles and statuses in the API reference', async () => {
		respond(fetchMock, USER_PAGE);

		await callEndpoint(Org.usersList, {
			role: 'IT_ADMIN',
			status: 'USER_INACTIVE',
		});

		expect(lastRequest(fetchMock).query).toEqual({
			role: 'IT_ADMIN',
			status: 'USER_INACTIVE',
		});
	});
});

describe('users.get', () => {
	it('reads one user by id', async () => {
		respond(fetchMock, USER);

		const result = await callEndpoint(Org.usersGet, { user_id: USER_ID });

		expect(lastRequest(fetchMock).path).toBe(`/developer/v1/users/${USER_ID}`);
		expect(result.user.email).toBe('linda@company.com');
		expect(result.user.custom_fields).toHaveLength(1);
	});
});

describe('business.get', () => {
	it('reads the business profile with no query', async () => {
		respond(fetchMock, BUSINESS);

		const result = await callEndpoint(Org.businessGet, {});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/developer/v1/business');
		expect(request.query).toEqual({});
		expect(result.business.business_name_legal).toBe('Northwind Labs, Inc.');
		expect(result.business.billing_address?.city).toBe('San Francisco');
	});
});

describe('every write is not replayed on a 5xx', () => {
	it('tags the method so the error handler can tell a read from a write', async () => {
		respond(
			fetchMock,
			{ error_v2: { message: 'boom', error_code: 'DEVELOPER_7199' } },
			504,
		);

		const error = await callEndpoint(Org.departmentsCreate, {
			name: 'Engineering',
		}).catch((caught: Error) => caught);

		expect(error).toBeInstanceOf(Error);
		expect((error as { method?: string }).method).toBe('POST');
	});
});

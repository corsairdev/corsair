import { logEventFromContext } from 'corsair/core';
import * as Api from './endpoints';
import {
	COMPANY,
	EMPLOYEE,
	FAILED_IN_BODY,
	NEW_EMPLOYEE,
	ORDER,
	ORDER_CREATED,
	ORDER_DETAIL,
	ORDERS_ALL,
	ORDERS_ALL_WITH_NEXT,
	ORDERS_INPROGRESS,
	ORDERS_PENDING,
	ORDERS_PENDING_PAYMENT,
	PRICES,
	VALIDATED,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('validate', () => {
	it('checks the key and reads the account email', async () => {
		respond(fetchMock, VALIDATED);

		const result = (await invoke(Api.validate, {})) as {
			message?: string;
			email?: string;
			status?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v1/validate/user');
		expect(result.message).toBe('Valid Key!');
		expect(result.email).toBe('abc@example.com');
		expect(result.status).toBe('Success');
	});

	it('logs the account email', async () => {
		respond(fetchMock, VALIDATED);

		await invoke(Api.validate, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remoteretrieval.validate',
			{ email: 'abc@example.com', status: 'Success' },
			'completed',
		);
	});
});

describe('orders.create', () => {
	it('posts the batch under orders', async () => {
		respond(fetchMock, ORDER_CREATED);

		const result = (await invoke(Api.create, {
			orders: [ORDER],
		})) as { order?: string; message?: string; status?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/api/v1/create-order');
		// unknown: the sent body is plain JSON; the test reads single fields.
		const orders = request.bodyRecord?.orders as Record<string, unknown>[];
		expect(orders).toHaveLength(1);
		expect(orders[0]?.type_of_equipment).toBe('Laptop');
		// The order reference comes back as a string.
		expect(result.order).toBe('212');
		expect(result.status).toBe('Success');
	});

	it('keeps the prefixed address field names a create expects', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, { orders: [ORDER] });

		// unknown: the sent body is plain JSON; the test reads single fields.
		const orders = lastRequest(fetchMock).bodyRecord?.orders as {
			employee_info?: Record<string, unknown>;
			company_info?: Record<string, unknown>;
		}[];
		// A create uses address_city/address_state/address_zip, unlike a list.
		expect(orders[0]?.employee_info?.address_city).toBe('Houston');
		expect(orders[0]?.employee_info?.address_zip).toBe('77001');
		expect(orders[0]?.company_info?.return_address_city).toBe('San Antonio');
	});

	it('accepts Monitor_27 as a device type', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, {
			orders: [{ ...ORDER, type_of_equipment: 'Monitor_27' }],
		});

		const orders = lastRequest(fetchMock).bodyRecord?.orders as {
			type_of_equipment?: string;
		}[];
		expect(orders[0]?.type_of_equipment).toBe('Monitor_27');
	});

	it('carries the insurance amount when insured', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, {
			orders: [{ ...ORDER, ins_active: 1, ins_amount: 1200 }],
		});

		const orders = lastRequest(fetchMock).bodyRecord?.orders as {
			ins_active?: number;
			ins_amount?: number;
		}[];
		expect(orders[0]?.ins_active).toBe(1);
		expect(orders[0]?.ins_amount).toBe(1200);
	});

	it('carries the new employee for a data-wipe-and-redeliver order', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, {
			orders: [
				{ ...ORDER, return_add_srv: 2, new_employee_info: NEW_EMPLOYEE },
			],
		});

		// unknown: the sent body is plain JSON; the test reads single fields.
		const orders = lastRequest(fetchMock).bodyRecord?.orders as {
			new_employee_info?: Record<string, unknown>;
		}[];
		expect(orders[0]?.new_employee_info).toMatchObject({
			first_name: 'Jane',
			newemp_msg: 'Your new laptop is on its way.',
		});
	});

	it('rejects return_add_srv 2 without a new employee', async () => {
		await expect(
			invoke(Api.create, { orders: [{ ...ORDER, return_add_srv: 2 }] }),
		).rejects.toThrow(/new_employee_info/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects ins_active 1 without an amount', async () => {
		await expect(
			invoke(Api.create, { orders: [{ ...ORDER, ins_active: 1 }] }),
		).rejects.toThrow(/ins_amount/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects return_add_srv on a recycle order', async () => {
		await expect(
			invoke(Api.create, {
				orders: [
					{
						...ORDER,
						order_type: 'Recycle with Data Destruction',
						return_add_srv: 1,
					},
				],
			}),
		).rejects.toThrow(/Return To Company/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a data wipe on a return order', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, { orders: [{ ...ORDER, return_add_srv: 1 }] });

		expect(fetchMock).toHaveBeenCalled();
	});

	it('rejects an empty batch', async () => {
		await expect(invoke(Api.create, { orders: [] })).rejects.toThrow();
	});

	it('rejects a missing employee address line', async () => {
		await expect(
			invoke(Api.create, {
				orders: [
					{
						...ORDER,
						employee_info: { ...EMPLOYEE, address_line_1: undefined },
					},
				],
			}),
		).rejects.toThrow();
	});

	it('logs the batch size and order reference, never the address', async () => {
		respond(fetchMock, ORDER_CREATED);

		await invoke(Api.create, { orders: [ORDER] });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remoteretrieval.orders.create',
			{ orders: 1, order: '212', status: 'Success' },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('Steele Street');
	});

	it('surfaces a refused order that arrived with a 200', async () => {
		respond(fetchMock, FAILED_IN_BODY);

		await expect(invoke(Api.create, { orders: [ORDER] })).rejects.toThrow(
			'Order could not be created.',
		);
	});
});

describe('orders.pending', () => {
	it('reads the bare array and its placeholder shipment statuses', async () => {
		respond(fetchMock, ORDERS_PENDING);

		const result = (await invoke(Api.pending, {})) as {
			order_id?: number;
			shipments?: { send_status?: string; return_status?: string };
		}[];

		expect(lastRequest(fetchMock).path).toBe('/api/v1/pending-orders');
		// These routes answer an array, not an envelope.
		expect(Array.isArray(result)).toBe(true);
		// --- is what the API sends before a shipment starts.
		expect(result[0]?.shipments?.send_status).toBe('---');
	});

	it('passes the page number', async () => {
		respond(fetchMock, ORDERS_PENDING);

		await invoke(Api.pending, { page: 2 });

		expect(lastRequest(fetchMock).query.page).toBe('2');
	});

	it('rejects a page below 1', async () => {
		await expect(invoke(Api.pending, { page: 0 })).rejects.toThrow();
	});
});

describe('orders.new', () => {
	it('reads the new orders', async () => {
		respond(fetchMock, ORDERS_PENDING);

		// unknown: only the array length is checked.
		const result = (await invoke(Api.newOrders, {})) as unknown[];

		expect(lastRequest(fetchMock).path).toBe('/api/v1/new-orders');
		expect(result).toHaveLength(1);
	});
});

describe('orders.inprogress', () => {
	it('reads the in-progress orders with both shipment legs moving', async () => {
		respond(fetchMock, ORDERS_INPROGRESS);

		const result = (await invoke(Api.inprogress, {})) as {
			shipments?: { send_status?: string; return_status?: string };
		}[];

		expect(lastRequest(fetchMock).path).toBe('/api/v1/inprogress-orders');
		expect(result[0]?.shipments?.send_status).toBe('TRANSIT');
		expect(result[0]?.shipments?.return_status).toBe('TRANSIT');
	});

	it('logs the order count', async () => {
		respond(fetchMock, ORDERS_INPROGRESS);

		await invoke(Api.inprogress, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remoteretrieval.orders.inprogress',
			{ orders: 1 },
			'completed',
		);
	});
});

describe('orders.list', () => {
	it('reads the paginated envelope with both statuses', async () => {
		respond(fetchMock, ORDERS_ALL);

		const result = (await invoke(Api.list, {})) as {
			next?: string | null;
			results?: {
				payment_status?: string;
				order_status?: string;
			}[];
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v1/orders');
		expect(result.results?.[0]?.payment_status).toBe('Completed');
		expect(result.results?.[0]?.order_status).toContain('DELIVERED');
	});

	it('passes the cursor', async () => {
		respond(fetchMock, ORDERS_ALL_WITH_NEXT);

		await invoke(Api.list, { cursor: 'abc123' });

		expect(lastRequest(fetchMock).query.cursor).toBe('abc123');
	});

	it("reads the next page from the previous response's next link", async () => {
		respond(fetchMock, ORDERS_ALL_WITH_NEXT);
		const first = (await invoke(Api.list, {})) as { next?: string | null };
		respond(fetchMock, ORDERS_ALL);

		await invoke(Api.list, { cursor: first.next ?? undefined });

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://www.remoteretrieval.com');
		expect(request.path).toBe('/api/v1/orders');
		expect(request.query).toEqual({ cursor: 'abc' });
	});

	it('keeps the API host when the link names another one', async () => {
		respond(fetchMock, ORDERS_ALL);

		await invoke(Api.list, {
			cursor: 'https://evil.example/steal?cursor=abc',
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://www.remoteretrieval.com');
		expect(request.query).toEqual({ cursor: 'abc' });
	});

	it('reports whether another page exists', async () => {
		respond(fetchMock, ORDERS_ALL_WITH_NEXT);

		await invoke(Api.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remoteretrieval.orders.list',
			{ orders: 1, hasNext: true },
			'completed',
		);
	});

	it('keeps a pending payment distinct from a completed one', async () => {
		respond(fetchMock, ORDERS_PENDING_PAYMENT);

		const result = (await invoke(Api.list, {})) as {
			results?: { payment_status?: string; order_status?: string }[];
		};

		expect(result.results?.[0]?.payment_status).toBe('Pending');
		expect(result.results?.[0]?.order_status).toBe('Ship to Employee: Pending');
	});
});

describe('orders.get', () => {
	it('takes the id as the oid query parameter, not a path segment', async () => {
		respond(fetchMock, ORDER_DETAIL);

		const result = (await invoke(Api.get, { oid: 148 })) as {
			order_id?: number;
		}[];

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/device_returns');
		expect(request.query.oid).toBe('148');
		// An array even for one id.
		expect(result[0]?.order_id).toBe(148);
	});

	it('logs whether the order was found', async () => {
		respond(fetchMock, ORDER_DETAIL);

		await invoke(Api.get, { oid: 148 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'remoteretrieval.orders.get',
			{ oid: 148, found: true },
			'completed',
		);
	});

	it('rejects a non-integer id', async () => {
		await expect(invoke(Api.get, { oid: 1.5 })).rejects.toThrow();
	});
});

describe('company.get', () => {
	it('reads the company record', async () => {
		respond(fetchMock, COMPANY);

		const result = (await invoke(Api.company, {})) as {
			company_name?: string;
			city?: string;
			created_date?: string;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v1/company-details');
		expect(result.company_name).toBe('company HB');
		// The date is not ISO 8601, which the field description notes.
		expect(result.created_date).toBe('24-Jun-2024');
	});

	it('keeps a null second address line', async () => {
		respond(fetchMock, COMPANY);

		const result = (await invoke(Api.company, {})) as {
			address_2?: string | null;
		};

		expect(result.address_2).toBeNull();
	});
});

describe('prices', () => {
	it('reads the live prices', async () => {
		respond(fetchMock, PRICES);

		const result = (await invoke(Api.prices, {})) as {
			equipment_type?: string;
			order_amount?: number;
		}[];

		expect(lastRequest(fetchMock).path).toBe('/api/v1/get-device-prices');
		expect(result).toHaveLength(5);
		expect(result[0]?.order_amount).toBe(77);
	});

	it('distinguishes Monitor_27 from Monitor, which the docs explain', async () => {
		respond(fetchMock, PRICES);

		const result = (await invoke(Api.prices, {})) as {
			equipment_type?: string;
			order_amount?: number;
		}[];

		const plain = result.find((row) => row.equipment_type === 'Monitor');
		const large = result.find((row) => row.equipment_type === 'Monitor_27');
		expect(plain?.order_amount).toBe(99);
		expect(large?.order_amount).toBe(149);
	});
});

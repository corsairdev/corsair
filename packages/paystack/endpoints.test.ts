import { logEventFromContext } from 'corsair/core';
import {
	Customers,
	Plans,
	Refunds,
	Subscriptions,
	Transactions,
} from './endpoints';
import {
	customer,
	initializedTransaction,
	refund,
	subscription,
	transaction,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sk_test_paystack';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses an initialized checkout', async () => {
		respond(initializedTransaction);
		const result = (await invoke(Transactions.initialize, {
			amount: '10000',
			email: 'john.doe@example.com',
		})) as { data: { authorization_url?: string } };
		expect(result.data.authorization_url).toContain('checkout.paystack.com');
	});

	it('parses a verified transaction with its authorization', async () => {
		respond({ status: true, message: 'ok', data: transaction });
		const result = (await invoke(Transactions.verify, {
			reference: '7PVGX8MEk85tgeEpVDtD',
		})) as { data: { status?: string } };
		expect(result.data.status).toBe('success');
	});

	it('parses a customer with its code', async () => {
		respond({ status: true, message: 'ok', data: customer });
		const result = (await invoke(Customers.get, {
			emailOrCode: 'john.doe@example.com',
		})) as { data: { customer_code?: string } };
		expect(result.data.customer_code).toBe('CUS_1idh4psjybv');
	});

	it('parses a subscription with its plan', async () => {
		respond({ status: true, message: 'ok', data: subscription });
		const result = (await invoke(Subscriptions.get, {
			idOrCode: 'SUB_vsy260vl9vvrcv9',
		})) as { data: { plan?: { plan_code?: string } } };
		expect(result.data.plan?.plan_code).toBe('PLN_0peioxfhpn');
	});

	it('parses a refund', async () => {
		respond({ status: true, message: 'ok', data: refund });
		const result = (await invoke(Refunds.get, { refundId: 1088 })) as {
			data: { status?: string };
		};
		expect(result.data.status).toBe('pending');
	});

	it('rejects a customer with no id', async () => {
		respond({ status: true, message: 'ok', data: { email: 'x@example.com' } });
		await rejects(Customers.get, { emailOrCode: 'x@example.com' }, 'id');
	});
});

describe('input validation', () => {
	it('rejects a plan whose interval the API does not document', async () => {
		await rejects(
			Plans.create,
			{ name: 'X', amount: 1000, interval: 'every_now_and_then' },
			'interval',
		);
	});

	it('rejects a refund reference with the wrong characters', async () => {
		await rejects(
			Refunds.create,
			{ transaction: '1', reference: 'short!ref' },
			'8-64 characters',
		);
	});

	it('rejects a risk action outside the documented values', async () => {
		await rejects(
			Customers.setRiskAction,
			{ customer: 'CUS_1', risk_action: 'ban' },
			'risk_action',
		);
	});
});

describe('status-false 200 answers', () => {
	it('rejects a 200 whose body says status false', async () => {
		respond({ status: false, message: 'Plan not found' });
		await rejects(Plans.get, { idOrCode: 'PLN_missing' }, 'Plan not found');
	});

	it('rejects a subscription enable that reports failure inside a 200', async () => {
		respond({ status: false, message: 'Invalid token' });
		await rejects(
			Subscriptions.enable,
			{ code: 'SUB_x', token: 'bad' },
			'Invalid token',
		);
	});
});

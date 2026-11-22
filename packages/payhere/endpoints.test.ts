import { logEventFromContext } from 'corsair/core';
import { Company, Customers, Payments, Refunds } from './endpoints';
import {
	company,
	companyStats,
	customer,
	customerDetail,
	payment,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ph-test-key';

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
	it('parses a customer page with its pagination meta', async () => {
		respond({
			data: [customer],
			meta: { current_page: 1, next_page: 2, total_count: 42 },
		});
		const page = (await invoke(Customers.list, {})) as {
			data: Array<{ id: number }>;
			meta: { next_page?: number | null };
		};
		expect(page.data[0]?.id).toBe(989899294);
		expect(page.meta.next_page).toBe(2);
	});

	it('parses a payment with refund amounts', async () => {
		respond({ data: [payment], meta: {} });
		const page = (await invoke(Payments.list, {})) as {
			data: Array<{ status?: string; refund_amount?: number }>;
		};
		expect(page.data[0]?.status).toBe('part_refund');
		expect(page.data[0]?.refund_amount).toBe(2.99);
	});

	it('parses the company stats as a bare object', async () => {
		respond(companyStats);
		const stats = (await invoke(Company.stats, {})) as { currency?: string };
		expect(stats.currency).toBe('gbp');
	});

	it('parses a company record', async () => {
		respond({ data: company });
		const result = (await invoke(Company.get, {})) as { data: { id: number } };
		expect(result.data.id).toBe(1);
	});

	it('parses a customer with embedded history', async () => {
		respond({ data: customerDetail });
		const result = (await invoke(Customers.get, { customerId: 989899294 })) as {
			// unknown: embedded subscription records are provider-shaped, so the
			// cast keeps them open.
			data: { subscriptions?: unknown[] };
		};
		expect(Array.isArray(result.data.subscriptions)).toBe(true);
	});

	it('rejects a customer with no id', async () => {
		respond({ data: { name: 'No id' } });
		await rejects(Customers.get, { customerId: 1 }, 'id');
	});

	it('rejects a list page whose data are bare strings', async () => {
		respond({ data: ['row'], meta: {} });
		await rejects(Payments.list, {}, 'expected object');
	});
});

describe('input validation', () => {
	it('rejects a per_page above the documented maximum', async () => {
		await rejects(Customers.list, { per_page: 101 }, '100');
	});

	it('rejects a refund whose reason is not documented', async () => {
		await rejects(
			Refunds.create,
			{ payment_id: 1, amount: 1, reason: 'because' },
			'reason',
		);
	});

	it('rejects a refund with a non-positive amount', async () => {
		await rejects(
			Refunds.create,
			{ payment_id: 1, amount: 0, reason: 'duplicate' },
			'Too small',
		);
	});
});

describe('204 responses', () => {
	it('rejects a refund that answers a body instead of the documented 204', async () => {
		respond({ refunded: true });
		await rejects(
			Refunds.create,
			{ payment_id: 1, amount: 1, reason: 'duplicate' },
			'unexpected body',
		);
	});

	it('accepts an empty 204 for a refund', async () => {
		respond(undefined, 204);
		const result = (await invoke(Refunds.create, {
			payment_id: 1,
			amount: 1,
			reason: 'duplicate',
		})) as { success: boolean };
		expect(result.success).toBe(true);
	});
});

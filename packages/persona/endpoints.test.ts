import { logEventFromContext } from 'corsair/core';
import { Accounts, Inquiries, InquirySessions } from './endpoints';
import { account, inquiry, inquirySession } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'persona-test-key';

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
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
	it('parses an account with its attributes', async () => {
		respond({ data: account });
		const result = (await invoke(Accounts.get, { accountId: account.id })) as {
			data: { id?: string; attributes?: { 'email-address'?: string } };
		};
		expect(result.data.id).toBe(account.id);
		expect(result.data.attributes?.['email-address']).toBe('jane@example.com');
	});

	it('parses an inquiry with its status', async () => {
		respond({ data: inquiry });
		const result = (await invoke(Inquiries.get, { inquiryId: inquiry.id })) as {
			data: { attributes?: { status?: string } };
		};
		expect(result.data.attributes?.status).toBe('completed');
	});

	it('parses an inquiry session', async () => {
		respond({ data: inquirySession });
		const result = (await invoke(InquirySessions.get, {
			inquirySessionId: inquirySession.id,
		})) as { data: { id?: string } };
		expect(result.data.id).toBe(inquirySession.id);
	});

	it('rejects an inquiry with no id', async () => {
		respond({ data: { type: 'inquiry', attributes: {} } });
		await rejects(Inquiries.get, { inquiryId: 'x' }, 'id');
	});

	it('rejects a list whose data is an object instead of an array', async () => {
		respond({ data: { id: 'x' } });
		await rejects(Accounts.list, {}, 'array');
	});
});

describe('input validation', () => {
	it('rejects a create-inquiry without any template id', async () => {
		await rejects(Inquiries.create, { attributes: {} }, 'inquiry-template-id');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a legacy template-id on create-inquiry', async () => {
		respond({ data: inquiry, meta: {} }, 201);
		await invoke(Inquiries.create, { attributes: { 'template-id': 'tmpl_1' } });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('accepts Persona inquiry ids (inq_...), which are not UUIDs', async () => {
		respond({ data: inquiry });
		await invoke(Inquiries.get, { inquiryId: 'inq_ABC123' });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('refuses . and .. as ids so the path cannot change route', async () => {
		await rejects(Inquiries.get, { inquiryId: '..' }, 'not a valid id');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error envelope passthrough', () => {
	it('surfaces the documented authentication error', async () => {
		respond(authRequired, 401);
		await rejects(Accounts.list, {}, 'Must be authenticated');
	});
});

// Referenced by client error tests.
import { authRequired } from './test-fixtures';

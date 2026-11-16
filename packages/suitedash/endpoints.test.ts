import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SuitedashAPIError, segment } from './client';
import { Companies, Contacts, Marketing, Projects, Worlds } from './endpoints';
import type { UnknownJson } from './json';
import {
	authProblem,
	businessFailure,
	company,
	companyMetaLive,
	contact,
	metaAttribute,
	pagination,
	project,
} from './test-fixtures';
import { lastRequest, respond } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const PUBLIC_ID = '11111111-2222-4333-8444-555555555555';
const SECRET_KEY = 'suitedash-secret-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{
			// The key builder packs both credentials into ctx.key.
			key: JSON.stringify({ publicId: PUBLIC_ID, secretKey: SECRET_KEY }),
			options: {},
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

/** Both credentials travel on every call, each in its own header. */
function expectBothCredentials() {
	const sent = lastRequest(fetchMock);
	expect(sent.origin).toBe('https://app.suitedash.com');
	expect(sent.path.startsWith('/secure-api/')).toBe(true);
	expect(sent.headers.get('x-public-id')).toBe(PUBLIC_ID);
	expect(sent.headers.get('x-secret-key')).toBe(SECRET_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

describe('companies', () => {
	it('lists with the filters and returns the envelope', async () => {
		respond(fetchMock, {
			success: true,
			message: null,
			data: [company],
			meta: { pagination, attributes: { 'abc-123': metaAttribute } },
		});

		const result = await invoke(Companies.list, {
			page: 1,
			orderBy: 'created:desc',
		});

		expectBothCredentials();
		expect(lastRequest(fetchMock).path).toBe('/secure-api/companies');
		expect(lastRequest(fetchMock).query).toEqual({
			page: '1',
			orderBy: 'created:desc',
		});
		expect(result).toMatchObject({ data: [company] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'suitedash.companies.list',
			{ count: 1 },
			'completed',
		);
	});

	it('gets one company by uid or name in the same path', async () => {
		respond(fetchMock, { success: true, message: null, data: company });

		const result = await invoke(Companies.get, {
			identifier: 'Schowalter-Parisian',
		});

		expect(lastRequest(fetchMock).path).toBe(
			'/secure-api/company/Schowalter-Parisian',
		);
		expect(result).toEqual({ success: true, message: null, data: company });
	});

	it('asks for the meta block when requested', async () => {
		respond(fetchMock, { success: true, message: null, data: company });

		await invoke(Companies.get, { identifier: 'abc-123', meta: true });

		expect(lastRequest(fetchMock).query).toEqual({ meta: 'true' });
	});

	it('creates a company with its required name and role', async () => {
		respond(fetchMock, { success: true, message: null, data: company }, 201);

		await invoke(Companies.create, { name: 'Microsoft', role: 'Client' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/secure-api/company');
		expect(sent.body).toEqual({ name: 'Microsoft', role: 'Client' });
	});

	it('rejects a company with a role the API does not accept', async () => {
		await expect(
			invoke(Companies.create, { name: 'Microsoft', role: 'Partner' }),
		).rejects.toThrow(/role/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a primary contact with create_primary_contact_if_not_exists but no email', async () => {
		await expect(
			invoke(Companies.create, {
				name: 'Microsoft',
				role: 'Client',
				primaryContact: {
					create_primary_contact_if_not_exists: true,
					first_name: 'Ada',
					last_name: 'Lovelace',
				},
			}),
		).rejects.toThrow(
			/email is required when create_primary_contact_if_not_exists is set/,
		);
	});

	it('accepts a primary contact that supplies every required field', async () => {
		respond(fetchMock, { success: true, message: null, data: company }, 201);

		await invoke(Companies.create, {
			name: 'Microsoft',
			role: 'Client',
			primaryContact: {
				create_primary_contact_if_not_exists: true,
				role: 'Client',
				first_name: 'Ada',
				last_name: 'Lovelace',
				email: 'ada@example.com',
			},
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			primaryContact: { email: 'ada@example.com' },
		});
	});

	it('updates with the identifier in the path only', async () => {
		respond(fetchMock, { success: true, message: null, data: company });

		await invoke(Companies.update, {
			identifier: 'e2c43cd3-eb1c-4269-a184-ffd9d26d6ef8',
			phone: '+1 555 0100',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe(
			'/secure-api/company/e2c43cd3-eb1c-4269-a184-ffd9d26d6ef8',
		);
		// Neither name nor role is required; role cannot be changed by an update.
		expect(sent.body).toEqual({ phone: '+1 555 0100' });
	});

	it('drops role from an update, which the API only takes on create', async () => {
		respond(fetchMock, { success: true, message: null, data: company });

		await invoke(Companies.update, {
			identifier: 'e2c43cd3-eb1c-4269-a184-ffd9d26d6ef8',
			name: 'Renamed',
			role: 'Client',
		});

		expect(lastRequest(fetchMock).body).toEqual({ name: 'Renamed' });
	});

	it('parses the meta map the live API returned', async () => {
		respond(fetchMock, companyMetaLive);

		const result = (await invoke(Companies.meta, {})) as Record<
			string,
			{ allowed_values?: string[] | null }
		>;

		expect(result.role?.allowed_values).toEqual(['Lead', 'Prospect', 'Client']);
	});

	it('reads the account meta attributes', async () => {
		respond(fetchMock, { 'abc-123': metaAttribute });

		const result = await invoke(Companies.meta, {});

		expect(lastRequest(fetchMock).path).toBe('/secure-api/company/meta');
		expect(result).toEqual({ 'abc-123': metaAttribute });
	});
});

describe('contacts', () => {
	it('lists contacts', async () => {
		respond(fetchMock, { success: true, message: null, data: [contact] });

		await invoke(Contacts.list, { createdMin: '2026-01-01T00:00:00+00:00' });

		expect(lastRequest(fetchMock).path).toBe('/secure-api/contacts');
		expect(lastRequest(fetchMock).query).toEqual({
			createdMin: '2026-01-01T00:00:00+00:00',
		});
	});

	it('gets one contact by uid or email', async () => {
		respond(fetchMock, { success: true, message: null, data: contact });

		await invoke(Contacts.get, { identifier: 'rhoda47@tromp.net' });

		expect(lastRequest(fetchMock).path).toBe(
			'/secure-api/contact/rhoda47%40tromp.net',
		);
	});

	it('creates a contact with the four required fields', async () => {
		respond(fetchMock, { success: true, message: null, data: contact }, 201);

		await invoke(Contacts.create, {
			first_name: 'Matilda',
			last_name: 'Walker',
			email: 'rhoda47@tromp.net',
			role: 'Prospect',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			first_name: 'Matilda',
			role: 'Prospect',
		});
	});

	it.each(['first_name', 'last_name', 'email', 'role'])(
		'rejects a create with no %s, which the spec requires',
		async (field) => {
			const input: Record<string, UnknownJson> = {
				first_name: 'Matilda',
				last_name: 'Walker',
				email: 'rhoda47@tromp.net',
				role: 'Prospect',
			};
			delete input[field];
			await expect(invoke(Contacts.create, input)).rejects.toThrow(
				new RegExp(field),
			);
		},
	);

	it('updates a contact and can send the welcome email', async () => {
		respond(fetchMock, { success: true, message: null, data: contact });

		await invoke(Contacts.update, {
			identifier: 'aa454efd-4074-3926-a370-e96cda162aa0',
			title: 'Manager',
			send_welcome_email: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ title: 'Manager', send_welcome_email: true });
	});

	it('reads the contact meta attributes', async () => {
		respond(fetchMock, { first_name: metaAttribute });

		await invoke(Contacts.meta, {});

		expect(lastRequest(fetchMock).path).toBe('/secure-api/contact/meta');
	});
});

describe('projects', () => {
	it('lists projects', async () => {
		respond(fetchMock, { success: true, message: null, data: [project] });

		await invoke(Projects.list, { page: 2 });

		expect(lastRequest(fetchMock).path).toBe('/secure-api/projects');
		expect(lastRequest(fetchMock).query).toEqual({ page: '2' });
	});

	it('puts the lookup mode in the path, not the query', async () => {
		respond(fetchMock, { success: true, message: null, data: project });

		await invoke(Projects.get, {
			type: 'contains_the_following',
			identifier: 'Digital',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(
			'/secure-api/project/contains_the_following/Digital',
		);
		expect(sent.query).toEqual({});
	});

	it('finds the most recent project with identifier true', async () => {
		respond(fetchMock, { success: true, message: null, data: project });

		await invoke(Projects.get, { type: 'most_recent', identifier: 'true' });

		expect(lastRequest(fetchMock).path).toBe(
			'/secure-api/project/most_recent/true',
		);
	});

	it('rejects a lookup mode the route does not define', async () => {
		await expect(
			invoke(Projects.get, { type: 'slug', identifier: 'x' }),
		).rejects.toThrow(/type/);
	});

	it('updates a project through the same lookup', async () => {
		respond(fetchMock, { success: true, message: null, data: project });

		await invoke(Projects.update, {
			type: 'uid',
			identifier: '2ff558c3-3eb0-48e1-a3bc-4c7f59dfb02f',
			status: 'Completed',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.body).toEqual({ status: 'Completed' });
	});

	it('reads the project meta attributes', async () => {
		respond(fetchMock, { first_name: metaAttribute });

		await invoke(Projects.meta, {});

		expect(lastRequest(fetchMock).path).toBe('/secure-api/project/meta');
	});
});

describe('worlds', () => {
	it('lists worlds, which answer a bare array with a top-level pagination', async () => {
		respond(fetchMock, {
			success: true,
			message: null,
			data: [
				{ uid: '072c3d2b-c71e-43fb-baa1-dee5cea76b05', key: 'Magic World' },
			],
			pagination,
		});

		const result = await invoke(Worlds.list, {});

		expect(lastRequest(fetchMock).path).toBe('/secure-api/worlds');
		expect(result).toMatchObject({
			data: [{ key: 'Magic World' }],
			pagination: { totalItems: 15 },
		});
	});
});

describe('marketing.subscribe', () => {
	it('posts a bare array of subscribers', async () => {
		respond(fetchMock, {
			success: true,
			message: null,
			data: [{ success: true }],
		});

		await invoke(Marketing.subscribe, {
			subscribers: [
				{ email: 'ada@example.com', first_name: 'Ada', audiences: [35, 485] },
			],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/secure-api/marketing/subscribe');
		expect(sent.body).toEqual([
			{ email: 'ada@example.com', first_name: 'Ada', audiences: [35, 485] },
		]);
	});

	it('reports a per-item failure even though the top-level answer is 200', async () => {
		respond(fetchMock, {
			success: false,
			message: 'One item failed',
			data: [
				{ success: true },
				{ success: false, errors: ['Unknown audience'] },
			],
		});

		// The client rejects a `success: false` envelope before the output parses,
		// which is the point: a partial failure must not look like success.
		await expect(
			invoke(Marketing.subscribe, {
				subscribers: [{ email: 'ada@example.com', audiences: [35] }],
			}),
		).rejects.toThrow(/One item failed/);
	});

	it('rejects a subscriber with no audiences', async () => {
		await expect(
			invoke(Marketing.subscribe, {
				subscribers: [{ email: 'ada@example.com', audiences: [] }],
			}),
		).rejects.toThrow(/audiences/);
	});
});

describe('client error handling', () => {
	it('turns a 200 carrying success:false into an error', async () => {
		respond(fetchMock, businessFailure);

		const error = await invoke(Companies.get, { identifier: 'nope' }).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(SuitedashAPIError);
		expect((error as Error).message).toContain('The company was not found');
	});

	it('reads a 401 and keeps both credentials out of util.inspect', async () => {
		respond(fetchMock, authProblem, 401);
		const util = await import('node:util');

		const error = await invoke(Companies.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const failure = error as ApiError;
		expect(failure).toBeInstanceOf(ApiError);
		expect(failure.status).toBe(401);
		expect(failure.message).toContain('X-Public-ID');
		const inspected = util.inspect(error);
		expect(inspected).not.toContain(PUBLIC_ID);
		expect(inspected).not.toContain(SECRET_KEY);
		expect(failure.message).not.toContain(SECRET_KEY);
	});

	it('reads a 429 as an exhausted monthly allowance', async () => {
		respond(
			fetchMock,
			{ success: false, message: 'Limit reached', data: [] },
			429,
		);

		const error = await invoke(Companies.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect((error as ApiError).status).toBe(429);
		// Monthly allowance: one call, no retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('masks the email a contact was addressed by in the error', async () => {
		respond(
			fetchMock,
			{ success: false, message: 'No contact jane@acme.com', data: [] },
			404,
		);

		const error = await invoke(Contacts.get, {
			identifier: 'jane@acme.com',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		const util = await import('node:util');
		for (const text of [
			(error as Error).message,
			util.inspect(error, { depth: 10 }),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain('jane@acme.com');
			expect(text).not.toContain('jane%40acme.com');
		}
	});
});

describe('credentials', () => {
	it('reads both credentials from ctx.key, never from options', async () => {
		respond(fetchMock, { success: true, message: null, data: [company] });

		await Companies.list(
			{
				key: JSON.stringify({
					publicId: 'from-key',
					secretKey: 'from-key-secret',
				}),
				options: { secretKey: 'from-options' },
				keys: { get_secret_key: jest.fn().mockResolvedValue('stored-secret') },
			} as never,
			{} as never,
		);

		expect(lastRequest(fetchMock).headers.get('x-public-id')).toBe('from-key');
		expect(lastRequest(fetchMock).headers.get('x-secret-key')).toBe(
			'from-key-secret',
		);
	});

	it('throws AuthMissingError when ctx.key carries no secret key', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core');

		await expect(
			Companies.list(
				{
					key: PUBLIC_ID,
					options: {},
					keys: { get_secret_key: jest.fn().mockResolvedValue(null) },
				} as never,
				{} as never,
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('segment', () => {
	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

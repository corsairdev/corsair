import { InboxkitAPIError, InboxkitError } from './client';
import { inboxkit } from './index';
import { API_KEY, jsonResponse, WORKSPACE } from './test-fixtures';
import { TEST_ROUTES } from './test-routes';

// unknown: endpoints read ctx.key and ctx.options; the rest is the runtime's.
const ctx = (options: Record<string, unknown> = {}) =>
	({
		key: API_KEY,
		options,
		$getAccountId: async () => 'account',
		logEvent: async () => undefined,
	}) as never;

// unknown: each operation's arguments are checked by its own schema at run time.
type AnyEndpoint = (ctx: never, input?: unknown) => Promise<unknown>;

const endpoints = inboxkit({ key: API_KEY }).endpoints as unknown as Record<
	string,
	Record<string, AnyEndpoint>
>;

const endpointFor = (operation: string): AnyEndpoint => {
	const [group = '', name = ''] = operation.split('.');
	const endpoint = endpoints[group]?.[name];
	if (!endpoint) throw new Error(`no endpoint for ${operation}`);
	return endpoint;
};

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

const callArgs = (index = 0) => {
	const [url, init] = fetchMock.mock.calls[index] as [URL, RequestInit];
	return { url: new URL(String(url)), init };
};

describe('every operation sends what the docs say', () => {
	it('covers all 181 routes, each once', () => {
		expect(TEST_ROUTES).toHaveLength(181);
		expect(new Set(TEST_ROUTES.map((route) => route.operation)).size).toBe(181);
	});

	it.each(TEST_ROUTES.map((route) => [route.operation, route] as const))(
		'%s',
		async (operation, route) => {
			fetchMock.mockResolvedValueOnce(jsonResponse({}));
			const input = {
				...route.input,
				...(route.workspace ? { workspaceId: WORKSPACE } : {}),
			};

			await endpointFor(operation)(ctx(), input);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			const { url, init } = callArgs();
			expect(url.origin).toBe('https://api.inboxkit.com');
			expect(url.pathname).toBe(route.path);
			expect(init.method).toBe(route.method);
			expect(init.redirect).toBe('error');

			const headers = init.headers as Record<string, string>;
			expect(headers.Authorization).toBe(`Bearer ${API_KEY}`);
			expect(headers['X-Workspace-Id']).toBe(
				route.workspace ? WORKSPACE : undefined,
			);

			expect(Object.fromEntries(url.searchParams)).toEqual(
				Object.fromEntries(
					Object.entries(route.query).map(([key, value]) => [
						key,
						String(value),
					]),
				),
			);
			if (route.hasBody) {
				expect(JSON.parse(String(init.body))).toEqual(route.body);
			} else {
				expect(init.body).toBeUndefined();
			}
		},
	);

	it.each(TEST_ROUTES.map((route) => [route.operation, route] as const))(
		// unknown: a test double; the real types add nothing to this check.
		'%s refuses an unknown field before sending anything',
		async (operation, route) => {
			await expect(
				endpointFor(operation)(ctx(), {
					...route.input,
					workspaceId: route.workspace ? WORKSPACE : undefined,
					not_a_field: true,
				}),
			).rejects.toThrow('not_a_field');
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('choosing the workspace', () => {
	const list = endpoints.domains?.list as AnyEndpoint;
	const buy = endpoints.mailboxes?.buy as AnyEndpoint;
	const purchase = {
		mailboxes: [
			{
				first_name: 'Jane',
				last_name: 'Doe',
				domain_name: 'example.com',
				username: 'jane',
				platform: 'GOOGLE',
			},
		],
	};

	it('uses the only workspace a team has, asking each time', async () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ workspaces: [{ uid: WORKSPACE }] }))
			.mockResolvedValueOnce(jsonResponse({ domains: [] }));
		await list(ctx(), {});
		expect(callArgs(0).url.pathname).toBe('/v1/api/workspaces/list');
		const second = callArgs(1).init.headers as Record<string, string>;
		expect(second['X-Workspace-Id']).toBe(WORKSPACE);
	});

	it('never guesses between several: nothing is bought', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				workspaces: [
					{ uid: 'one', name: 'First' },
					{ uid: 'two', name: 'Second' },
				],
			}),
		);
		await expect(buy(ctx(), purchase)).rejects.toMatchObject({
			name: 'InboxkitError',
			code: 'workspace_required',
		});
		await expect(Promise.resolve(fetchMock.mock.calls.length)).resolves.toBe(1);
		expect(callArgs(0).url.pathname).toBe('/v1/api/workspaces/list');
	});

	it('names the workspaces in that error', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				workspaces: [
					{ uid: 'one', name: 'First' },
					{ uid: 'two', name: 'Second' },
				],
			}),
		);
		await expect(list(ctx(), {})).rejects.toThrow('First (one), Second (two)');
	});

	it('refuses when the team has none', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ workspaces: [] }));
		await expect(list(ctx(), {})).rejects.toBeInstanceOf(InboxkitError);
	});

	it('takes the plugin option with no lookup', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [] }));
		await list(ctx({ workspaceId: 'from-option' }), {});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const headers = callArgs().init.headers as Record<string, string>;
		expect(headers['X-Workspace-Id']).toBe('from-option');
	});

	it('prefers the one named on the call', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [] }));
		await list(ctx({ workspaceId: 'from-option' }), { workspaceId: 'named' });
		const headers = callArgs().init.headers as Record<string, string>;
		expect(headers['X-Workspace-Id']).toBe('named');
	});

	it('keeps workspaceId out of the request body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ domains: [] }));
		await list(ctx(), { workspaceId: WORKSPACE, page: 2 });
		expect(JSON.parse(String(callArgs().init.body))).toEqual({ page: 2 });
	});

	it('leaves workspace_id alone where it is a field of the provider', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }));
		await endpointFor('sequencers.add')(ctx(), {
			workspaceId: WORKSPACE,
			name: 'Bison',
			platform: 'emailbison',
			sequencer_login: 'me',
			sequencer_password: 'pw',
			workspace_id: 'in-the-sequencer',
		});
		expect(JSON.parse(String(callArgs().init.body)).workspace_id).toBe(
			'in-the-sequencer',
		);
	});

	it('sends an API-key-only sequencer with no login or password', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ success: true }));
		await endpointFor('sequencers.add')(ctx(), {
			workspaceId: WORKSPACE,
			name: 'SendKit',
			platform: 'sendkit',
			api_key: 'sk',
		});
		expect(JSON.parse(String(callArgs().init.body))).toEqual({
			name: 'SendKit',
			platform: 'sendkit',
			api_key: 'sk',
		});
	});

	it('does not look anything up for team-level operations', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ uid: 'team' }));
		await endpointFor('account.get')(ctx(), {});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const headers = callArgs().init.headers as Record<string, string>;
		expect(headers['X-Workspace-Id']).toBeUndefined();
	});
});

describe('answers the docs get wrong', () => {
	it('takes numbers where the docs say strings', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				current_page: 1,
				limit: 10,
				domains: [{ uid: 'a', price: 0, assigned_mailboxes: 2 }],
			}),
		);
		const result = (await endpointFor('domains.list')(ctx(), {
			workspaceId: WORKSPACE,
			// unknown: a test double; the real types add nothing to this check.
		})) as Record<string, unknown>;
		expect(result.parse_warning).toBeUndefined();
		expect(result.current_page).toBe(1);
	});

	it('hands back a response it cannot read, and warns, instead of throwing', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ mailboxes: 'not a list', order_uid: 'order-1' }),
		);
		// unknown: the result's fields are each checked by the assertions below.
		const result = (await endpointFor('mailboxes.buy')(ctx(), {
			workspaceId: WORKSPACE,
			mailboxes: [],
		})) as Record<string, unknown>;
		expect(result.raw).toEqual({
			mailboxes: 'not a list',
			order_uid: 'order-1',
		});
		expect(result.parse_warning).toContain('Do not repeat mailboxes.buy');
		// A caller reading the usual field can't trip over the wrong shape.
		expect(result.mailboxes).toBeUndefined();
	});

	it('keeps fields the docs do not list', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ uid: 'team', added_later: 'kept' }),
		);
		const result = (await endpointFor('account.get')(ctx(), {})) as Record<
			string,
			// unknown: a test double; the real types add nothing to this check.
			unknown
		>;
		expect(result.added_later).toBe('kept');
	});

	it('copes with an empty answer', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));
		await expect(
			endpointFor('tags.delete')(ctx(), {
				workspaceId: WORKSPACE,
				uid: 'tag-1',
			}),
		).resolves.toEqual({});
	});
});

describe('path parameters', () => {
	it('encodes them', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await endpointFor('tags.delete')(ctx(), {
			workspaceId: WORKSPACE,
			uid: 'a/b c',
		});
		expect(callArgs().url.pathname).toBe('/v1/api/tags/a%2Fb%20c');
	});

	it.each(['..', '.', ''])(
		'refuses %j, which would change the route',
		async (uid) => {
			await expect(
				endpointFor('tags.delete')(ctx(), { workspaceId: WORKSPACE, uid }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('errors reach the caller', () => {
	it('with InboxKit’s own message', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ error: true, message: 'Mailbox not found' }, 404),
		);
		const error = await endpointFor('mailboxes.get')(ctx(), {
			workspaceId: WORKSPACE,
			uid: 'nope',
		}).catch((caught: Error) => caught);
		expect(error).toBeInstanceOf(InboxkitAPIError);
		expect((error as InboxkitAPIError).status).toBe(404);
		expect((error as Error).message).toContain('Mailbox not found');
	});
});

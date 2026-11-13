import { Contacts, Lists } from './endpoints';
import { GoDialEndpointInputSchemas } from './endpoints/types';
import type { GoDialContext } from './index';

const mockLoggedEvents: Array<{
	event: string;
	payload: Record<string, never>;
}> = [];

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: async (
		// unknown because the logging mock intentionally ignores execution context.
		_context: unknown,
		event: string,
		payload: Record<string, never>,
	) => {
		mockLoggedEvents.push({ event, payload });
	},
}));

const ctx = {
	key: 'test-token',
	options: {},
	db: {},
	endpoints: {
		lists: { list: async () => ({}) },
		contacts: { add: async () => ({}) },
	},
	$getAccountId: async () => 'test-account',
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_api_key: async () => 'test-token',
		get_webhook_signature: async () => null,
		set_api_key: async (_value: string | null) => undefined,
		set_webhook_signature: async (_value: string | null) => undefined,
	},
} satisfies GoDialContext;

describe('GoDial endpoints', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		mockLoggedEvents.length = 0;
	});

	it('lists GoDial lists using GET with access_token in the query', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('[{"id":"list-1"}]', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await expect(Lists.list(ctx, {})).resolves.toEqual([{ id: 'list-1' }]);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(requestUrl.href).toContain(
			'https://enterprise.godial.cc/meta/api/externals/lists/list',
		);
		expect(requestUrl.searchParams.get('access_token')).toBe('test-token');
		expect(fetchSpy.mock.calls[0]?.[1]?.method).toBe('GET');
		expect(fetchSpy.mock.calls[0]?.[1]?.body).toBeUndefined();
	});

	it('adds a contact as JSON and does not include personal data in event logs', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"success":true}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		const contact = {
			listId: 'list-1',
			name: 'Ada Lovelace',
			phone: '+15555550123',
		};

		await expect(Contacts.add(ctx, contact)).resolves.toEqual({
			success: true,
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const requestUrl = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(requestUrl.pathname).toBe('/meta/api/externals/contact/add');
		expect(requestUrl.searchParams.get('access_token')).toBe('test-token');
		expect(fetchSpy.mock.calls[0]?.[1]?.method).toBe('POST');
		expect(fetchSpy.mock.calls[0]?.[1]?.body).toBe(
			'{"name":"Ada Lovelace","phone":"+15555550123","listId":"list-1"}',
		);
		expect(mockLoggedEvents).toEqual([
			{ event: 'godial.contacts.add', payload: {} },
		]);
		expect(JSON.stringify(mockLoggedEvents)).not.toContain(contact.name);
		expect(JSON.stringify(mockLoggedEvents)).not.toContain(contact.phone);
	});

	it('rejects unknown input properties before network I/O', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');
		const invalidListInput = { unsupported: true };
		const invalidContactInput = {
			listId: 'list-1',
			webhookUrl: 'https://example.test',
		};

		expect(() =>
			GoDialEndpointInputSchemas.listsList.parse(invalidListInput),
		).toThrow();
		expect(() =>
			GoDialEndpointInputSchemas.contactsAdd.parse(invalidContactInput),
		).toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
	});
});

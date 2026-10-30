import { makeEsputnikRequest } from './client';
import { esputnikEndpointSchemas, esputnikEndpointsNested } from './index';

jest.mock('./client', () => ({ makeEsputnikRequest: jest.fn() }));

const request = jest.mocked(makeEsputnikRequest);

// Recursive traversal intentionally uses unknown because endpoint groups mix
// nested objects and callable leaves; every leaf is checked before use.
type EndpointTree = Record<string, unknown>;

function operationNames(tree: EndpointTree, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([name, value]) => {
		const operation = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [operation];
		return operationNames(value as EndpointTree, operation);
	});
}

describe('eSputnik endpoint registry', () => {
	beforeEach(() => {
		request.mockImplementation(async (_path, _key, _options) => undefined);
	});

	afterEach(() => jest.clearAllMocks());

	it('registers all 110 operations with schema contracts', () => {
		const operations = operationNames(esputnikEndpointsNested).sort();
		const schemaOperations = Object.keys(esputnikEndpointSchemas).sort();

		expect(operations).toHaveLength(110);
		expect(schemaOperations).toEqual(operations);
	});

	it('exposes callable handlers for every registered operation', () => {
		for (const operation of operationNames(esputnikEndpointsNested)) {
			const leaf = operation
				.split('.')
				.reduce<unknown>(
					(tree, name) => (tree as Record<string, unknown>)[name],
					esputnikEndpointsNested,
				);
			expect(typeof leaf).toBe('function');
		}
	});

	it('invokes every public operation through its schema boundary', async () => {
		const inputs: Record<string, unknown> = {
			getAccountInfo: {},
			getBalance: {},
			addContact: {
				channels: [{ type: 'email', value: 'person@example.com' }],
			},
			getContact: { id: 1 },
			updateContact: {
				id: 1,
				channels: [{ type: 'email', value: 'person@example.com' }],
			},
			deleteContactById: { id: 1 },
			deleteContactByExternalCustomerId: { externalCustomerId: 'customer-1' },
			searchContacts: {},
			getContactIdByToken: { app_uuid: 'app', token_id: 'token' },
			getEmailMessageViewLink: { id: 1 },
			getEmail: { id: 1 },
			deleteEmail: { id: 1 },
			deleteTranslatedEmail: { id: 1, language: 'en' },
			getMobilePushMessage: { id: 1 },
			deleteMobilePushMessage: { id: 1 },
			getViberMessage: { id: 1 },
			deleteViberMessage: { id: 1 },
			getAppInboxMessage: { id: 1 },
			deleteAppInboxMessage: { id: 1 },
			getTelegramBotMessage: { id: 1 },
			deleteTelegramBotMessage: { id: 1 },
			getSms: { id: 1 },
			deleteSmsMessage: { id: 1 },
			getBroadcast: { id: 1 },
			cancelBroadcast: { id: 1 },
			getDomains: {},
			deleteWebPushDomain: { domain: 'example.com' },
			getPreprocessorFileStatus: { sessionId: 'session-1' },
			updateTranslatedSmsMessage: { id: 1, language: 'en' },
			deleteTranslatedSmsMessage: { id: 1, language: 'en' },
		};

		for (const operation of operationNames(esputnikEndpointsNested)) {
			const name = operation.split('.').pop() as string;
			const input = inputs[name] ?? {};
			const endpoint = operation
				.split('.')
				.reduce<unknown>(
					(tree, part) => (tree as Record<string, unknown>)[part],
					esputnikEndpointsNested,
				);
			expect(endpoint).toEqual(expect.any(Function));
			if (typeof endpoint !== 'function')
				throw new Error(`Missing endpoint ${operation}`);
			await endpoint({ key: 'test-api-key' }, input);
			expect(request).toHaveBeenLastCalledWith(
				expect.any(String),
				'test-api-key',
				expect.any(Object),
			);
		}

		expect(request).toHaveBeenCalledTimes(110);
	});
});

import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	DialpadOperationDefinitions,
	DialpadOperationKeys,
} from './endpoints/definitions';
import { DialpadOperationCallers } from './endpoints/handlers';
import type { DialpadEndpointKey } from './endpoints/types';
import {
	DialpadEndpointInputSchemas,
	DialpadEndpointOutputSchemas,
} from './endpoints/types';
import type { DialpadContext } from './index';
import { DialpadOperationFixtures } from './operation-fixtures';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual<typeof import('./client')>('./client');
	return { ...actual, makeDialpadRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeDialpadRequest);
const mockedLog = jest.mocked(logEventFromContext);

function buildContext(): DialpadContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-company'),
		key: 'test-bearer-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-bearer-token'),
			set_api_key: async () => {},
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: async () => {},
			get_access_token: () => Promise.resolve('test-oauth-token'),
			set_access_token: async () => {},
			get_refresh_token: () => Promise.resolve(null),
			set_refresh_token: async () => {},
			get_expires_at: () => Promise.resolve(null),
			set_expires_at: async () => {},
			get_scope: () => Promise.resolve(null),
			set_scope: async () => {},
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: null,
					client_secret: null,
					redirect_url: null,
				}),
		},
		db: {},
	};
}

const ctx = buildContext();

// Unknown input is required to exercise the runtime schema boundary with invalid fixture data.
type UntrustedTestInput = unknown;

const callOperation = (key: DialpadEndpointKey, input: UntrustedTestInput) =>
	DialpadOperationCallers[key](ctx, input);

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('documented request/response operations', () => {
	for (const key of DialpadOperationKeys) {
		it(`${key} sends its documented request and parses its response`, async () => {
			const fixture = DialpadOperationFixtures[key];
			const parsedInput = DialpadEndpointInputSchemas[key].parse(fixture.input);
			const expectedOutput = 'output' in fixture ? fixture.output : undefined;
			mockedRequest.mockResolvedValue(expectedOutput);

			const result = await callOperation(key, fixture.input);

			expect(result).toEqual(
				DialpadEndpointOutputSchemas[key].parse(expectedOutput),
			);
			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				DialpadOperationDefinitions[key],
				parsedInput,
				{ apiKey: 'test-bearer-token', environment: undefined },
			);
			const definition = DialpadOperationDefinitions[key];
			expect(definition.path).toMatch(/^\//);
			expect(definition.method).toMatch(/^(GET|POST|PUT|PATCH|DELETE)$/);
			expect(definition.hasQuery).toBe(Object.hasOwn(parsedInput, 'query'));
			expect(definition.hasBody).toBe(Object.hasOwn(parsedInput, 'body'));
			expect(definition.pathParams.length > 0).toBe(
				Object.hasOwn(parsedInput, 'path'),
			);
			expect(mockedLog).toHaveBeenCalledTimes(1);
			const loggedPayload = mockedLog.mock.calls[0]?.[2];
			expect(loggedPayload).toEqual({ operation: key });
			expect(JSON.stringify(loggedPayload)).not.toContain('test-bearer-token');
		});

		it(`${key} rejects undocumented input before network I/O`, async () => {
			const fixture = DialpadOperationFixtures[key];
			const invalidInput = {
				...fixture.input,
				undocumentedCallbackUrl: 'https://corsair.dev/callback',
			};

			await expect(callOperation(key, invalidInput)).rejects.toThrow();

			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedLog).not.toHaveBeenCalled();
		});
	}
});

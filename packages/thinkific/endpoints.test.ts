import * as core from 'corsair/core';
import { THINKIFIC_API_BASE } from './client';
import { thinkificEndpointMeta, thinkificEndpointSchemas } from './index';
import { thinkificEndpointOperations } from './test-fixtures';

const endpointContext = {
	key: 'unit-test-api-key',
	keys: {
		get_subdomain: async () => 'unit-test-school',
	},
	$getAccountId: async () => 'unit-test-account',
};

// `unknown` because route fixtures are heterogeneous OpenAPI response data.
function responseFor(value: unknown, status: number): Response {
	if (value === undefined) {
		return new Response(null, { status });
	}
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Thinkific endpoints', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	for (const operation of thinkificEndpointOperations) {
		it(`${operation.key} sends the documented method, path, query, body, and auth`, async () => {
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					responseFor(operation.outputFixture, operation.successStatus),
				);

			// `unknown` because Reflect.apply permits testing the runtime schema boundary with the registry's varied endpoint types.
			const result: unknown = await Reflect.apply(
				operation.endpoint,
				undefined,
				[endpointContext, operation.inputFixture],
			);
			expect(result).toEqual(operation.outputFixture);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			const requestCall = fetchMock.mock.calls[0];
			if (!requestCall) throw new Error('Expected one Thinkific API request');
			const [requestUrlValue, requestInit] = requestCall;
			const requestUrl = new URL(String(requestUrlValue));
			const expectedUrl = new URL(
				`${THINKIFIC_API_BASE}${operation.expectedPath}`,
			);
			expect(`${requestUrl.origin}${requestUrl.pathname}`).toBe(
				`${expectedUrl.origin}${expectedUrl.pathname}`,
			);
			expect(requestInit?.method).toBe(operation.method);

			const actualQuery = Object.fromEntries(requestUrl.searchParams.entries());
			const expectedQuery = Object.fromEntries(
				Object.entries(operation.expectedQuery).map(([key, value]) => [
					key,
					String(value),
				]),
			);
			expect(actualQuery).toEqual(expectedQuery);

			const headers = new Headers(requestInit?.headers);
			expect(headers.get('X-Auth-API-Key')).toBe('unit-test-api-key');
			expect(headers.get('X-Auth-Subdomain')).toBe('unit-test-school');
			expect(headers.get('Content-Type')).toContain('application/json');
			expect(headers.get('Authorization')).toBeNull();

			const actualBody =
				requestInit?.body === undefined
					? undefined
					: JSON.parse(String(requestInit.body));
			expect(actualBody).toEqual(operation.expectedBody);
		});

		it(`${operation.key} rejects undocumented input before network I/O`, async () => {
			const fetchMock = jest.spyOn(globalThis, 'fetch');
			const invalidInput = {
				...operation.inputFixture,
				undocumented: 'not accepted',
			};
			// `unknown` because Reflect.apply intentionally bypasses the static endpoint input type for this runtime rejection test.
			const result: unknown = Reflect.apply(operation.endpoint, undefined, [
				endpointContext,
				invalidInput,
			]);

			await expect(result).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		});
	}

	it('keeps event logs free of request fields and customer data', async () => {
		const operation = thinkificEndpointOperations.find(
			(candidate) => candidate.key === 'users.create',
		);
		if (!operation) throw new Error('Expected the users.create operation');

		const logSpy = jest
			.spyOn(core, 'logEventFromContext')
			.mockResolvedValue(null);
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				responseFor(operation.outputFixture, operation.successStatus),
			);

		// `unknown` because this test intentionally passes customer data through the runtime-validated endpoint boundary.
		const result: unknown = await Reflect.apply(operation.endpoint, undefined, [
			endpointContext,
			{
				body: {
					first_name: 'Private',
					last_name: 'Learner',
					email: 'private@example.com',
				},
			},
		]);
		expect(result).toEqual(operation.outputFixture);
		expect(logSpy).toHaveBeenCalledWith(
			endpointContext,
			'thinkific.users.create',
			{},
			'completed',
		);
	});

	it('keeps endpoint metadata and schemas aligned with the route inventory', () => {
		const operationKeys = thinkificEndpointOperations.map(
			(operation) => operation.key,
		);
		expect(Object.keys(thinkificEndpointMeta).sort()).toEqual(
			operationKeys.sort(),
		);
		expect(Object.keys(thinkificEndpointSchemas).sort()).toEqual(
			operationKeys.sort(),
		);
	});
});

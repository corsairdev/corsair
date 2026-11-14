import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	apiBase,
	describeProabonoError,
	isCredentialRejection,
	makeProabonoRequest,
	ProabonoAPIError,
	readErrorCode,
	readValidationErrors,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CREDENTIALS = { account: '42', agentKey: 'agent-key', apiKey: 'api-key' };

/** An ApiError carrying one of ProAbono's error shapes. */
function apiError(
	status: number,
	// unknown: each route sends either the single error or a validation list.
	body: Untyped,
) {
	return new ApiError(
		{ method: 'GET', url: '/v1/Offers' },
		{
			url: `${apiBase('42')}/v1/Offers`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		'error',
	);
}

type Untyped = unknown; // unknown: see the note above.

beforeEach(() => {
	mockRequest.mockReset();
});

describe('ProAbono error bodies', () => {
	it('reads the single error shape', () => {
		const body = {
			Code: 'Error.AuthenticationFailed',
			Message: 'Authentication failed',
		};

		expect(readErrorCode(body)).toBe('Error.AuthenticationFailed');
		expect(describeProabonoError(401, body, 'fallback')).toBe(
			'ProAbono 401 Error.AuthenticationFailed: Authentication failed',
		);
	});

	it('reads the validation-error list a 422 carries', () => {
		const body = [
			{ Code: 'Error.Required', Message: 'ReferenceCustomer is required' },
			{ Code: 'Error.Invalid', Message: 'Email is invalid' },
		];

		expect(readValidationErrors(body)).toHaveLength(2);
		expect(describeProabonoError(422, body, 'fallback')).toBe(
			'ProAbono 422: Error.Required ReferenceCustomer is required; Error.Invalid Email is invalid',
		);
	});

	it('summarises at most three validation errors', () => {
		const body = Array.from({ length: 5 }, (_, index) => ({
			Code: 'Error.Invalid',
			Message: `field${index}`,
		}));

		const message = describeProabonoError(422, body, 'fallback');

		expect(message).toContain('field0');
		expect(message).toContain('field2');
		expect(message).not.toContain('field3');
	});

	it('treats the authentication code as a credential rejection', () => {
		expect(
			isCredentialRejection(401, {
				Code: 'Error.AuthenticationFailed',
				Message: 'Authentication failed',
			}),
		).toBe(true);
	});

	it('treats a bare 401 as one too, since the body may be absent', () => {
		expect(isCredentialRejection(401, undefined)).toBe(true);
	});

	it('does not treat a 403 as a broken key, which is a customer without payment info', () => {
		expect(
			isCredentialRejection(403, {
				Code: 'Error.CustomerNotBillable',
				Message: 'Customer has no valid payment information',
			}),
		).toBe(false);
	});
});

describe('apiBase', () => {
	it('builds the per-account host the docs use', () => {
		expect(apiBase('42')).toBe('https://api-42.proabono.com');
	});
});

describe('makeProabonoRequest', () => {
	it('sends the two keys as HTTP Basic, the agent key first', async () => {
		mockRequest.mockResolvedValue([]);

		await makeProabonoRequest(CREDENTIALS, {
			method: 'GET',
			path: '/v1/Offers',
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: apiBase('42'),
			USERNAME: 'agent-key',
			PASSWORD: 'api-key',
		});
		expect(options).toMatchObject({ method: 'GET', url: '/v1/Offers' });
	});

	it('throws AuthMissingError without a request when a key is blank', async () => {
		await expect(
			makeProabonoRequest(
				{ ...CREDENTIALS, agentKey: '  ' },
				{ method: 'GET', path: '/v1/Offers' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			makeProabonoRequest(
				{ ...CREDENTIALS, apiKey: '' },
				{ method: 'GET', path: '/v1/Offers' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when the account number is blank', async () => {
		// Without the account there is no host to call.
		await expect(
			makeProabonoRequest(
				{ ...CREDENTIALS, account: ' ' },
				{ method: 'GET', path: '/v1/Offers' },
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a key carrying a newline, which would break the header', async () => {
		await expect(
			makeProabonoRequest(
				{ ...CREDENTIALS, apiKey: 'key\nX-Injected: 1' },
				{ method: 'GET', path: '/v1/Offers' },
			),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports a rejected pair as a credential failure without echoing it', async () => {
		mockRequest.mockRejectedValue(
			apiError(401, {
				Code: 'Error.AuthenticationFailed',
				Message: 'Authentication failed',
			}),
		);

		const error = await captureError(
			makeProabonoRequest(CREDENTIALS, { method: 'GET', path: '/v1/Offers' }),
		);

		// Core's ApiError passes through, with the code still on its body.
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		expect(readErrorCode(error.body)).toBe('Error.AuthenticationFailed');
		// The keys rode in a header, so nothing on the error may repeat them.
		expect(JSON.stringify(error)).not.toContain('api-key');
		expect(JSON.stringify(error)).not.toContain('agent-key');
	});

	it('keeps the validation errors from a 422', async () => {
		mockRequest.mockRejectedValue(
			apiError(422, [
				{ Code: 'Error.Required', Message: 'ReferenceCustomer is required' },
			]),
		);

		const error = await captureError(
			makeProabonoRequest(CREDENTIALS, {
				method: 'POST',
				path: '/v1/Customer',
				body: {},
			}),
		);

		// The 422 list rides on the core error's body, where the handler reads it.
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(readValidationErrors(error.body)).toEqual([
			{ Code: 'Error.Required', Message: 'ReferenceCustomer is required' },
		]);
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makeProabonoRequest(CREDENTIALS, {
				method: 'POST',
				path: '/v1/Subscription',
				body: {},
			}),
		);

		expect(error).toBeInstanceOf(ProabonoAPIError);
		if (!(error instanceof ProabonoAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});

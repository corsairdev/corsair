import { ApiError } from 'corsair/http';
import { isOperationBusy } from './client';

const makeApiError = (
	status: number,
	body: unknown,
	message = 'Bad Request',
): ApiError =>
	new ApiError(
		{ method: 'POST', url: '/v1/emails:check' },
		{
			url: '/v1/emails:check',
			ok: false,
			status,
			statusText: 'Bad Request',
			body,
		},
		message,
	);

describe('isOperationBusy', () => {
	it('matches a 400 whose JSON body nests the busy message', () => {
		const error = makeApiError(400, {
			error: {
				code: 9,
				message: 'Please wait for the running operation to finish.',
			},
		});
		expect(isOperationBusy(error)).toBe(true);
	});

	it('matches a 400 whose body is the busy message string', () => {
		const error = makeApiError(400, 'wait for the running operation to finish');
		expect(isOperationBusy(error)).toBe(true);
	});

	it('matches the busy message in error.message alone', () => {
		const error = makeApiError(
			400,
			{ error: { message: 'other detail' } },
			'wait for the running operation to finish',
		);
		expect(isOperationBusy(error)).toBe(true);
	});

	it('does not match a 400 with an unrelated object body', () => {
		const error = makeApiError(400, {
			error: { code: 3, message: 'invalid email address' },
		});
		expect(isOperationBusy(error)).toBe(false);
	});

	it('does not match other statuses even with the busy message', () => {
		expect(
			isOperationBusy(makeApiError(429, 'wait for the running operation')),
		).toBe(false);
		expect(
			isOperationBusy(
				makeApiError(500, {
					error: { message: 'wait for the running operation' },
				}),
			),
		).toBe(false);
	});
});

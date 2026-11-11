import type { ApiError } from '../async-core/ApiError';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { request } from '../async-core/request';

const config: OpenAPIConfig = {
	BASE: 'https://gmail.googleapis.com/gmail/v1',
	VERSION: '1.0.0',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'omit',
	TOKEN: 'token',
	HEADERS: { 'Content-Type': 'application/json' },
};

function respondWith(status: number, body: unknown, statusText: string) {
	globalThis.fetch = jest.fn(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				statusText,
				headers: { 'content-type': 'application/json' },
			}),
	) as unknown as typeof fetch;
}

async function callAndCatch(): Promise<ApiError> {
	try {
		await request(config, { method: 'GET', url: '/users/me/messages' });
	} catch (error) {
		return error as ApiError;
	}
	throw new Error('expected the request to throw');
}

describe('provider error messages', () => {
	const realFetch = globalThis.fetch;
	afterEach(() => {
		globalThis.fetch = realFetch;
	});

	it("carries Google's reason, not the word Forbidden", async () => {
		respondWith(
			403,
			{
				error: {
					code: 403,
					message:
						'Gmail API has not been used in project 130238172610 before or it is disabled.',
					status: 'PERMISSION_DENIED',
				},
			},
			'Forbidden',
		);

		const error = await callAndCatch();

		expect(error.status).toBe(403);
		expect(error.message).toContain('Gmail API has not been used in project');
		expect(error.message).not.toBe('Forbidden');
	});

	it('carries a flat message from a 400', async () => {
		respondWith(
			400,
			{ message: 'Invalid query: label does not exist' },
			'Bad Request',
		);

		const error = await callAndCatch();

		expect(error.message).toContain('Invalid query: label does not exist');
	});

	it('carries a string error field', async () => {
		respondWith(401, { error: 'invalid_grant' }, 'Unauthorized');

		const error = await callAndCatch();

		expect(error.message).toContain('invalid_grant');
	});

	it('falls back to the status word when the body says nothing', async () => {
		respondWith(403, {}, 'Forbidden');

		const error = await callAndCatch();

		expect(error.message).toBe('Forbidden');
	});

	it('keeps the full body on the error for callers that forward it', async () => {
		respondWith(
			403,
			{ error: { message: 'disabled', status: 'PERMISSION_DENIED' } },
			'Forbidden',
		);

		const error = await callAndCatch();

		expect(error.body).toEqual({
			error: { message: 'disabled', status: 'PERMISSION_DENIED' },
		});
	});
});

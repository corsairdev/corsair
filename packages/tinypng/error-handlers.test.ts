import { AzureBlobError, TinypngAPIError } from './client';
import { errorHandlers } from './error-handlers';

function classify(error: Error) {
	return Object.entries(errorHandlers).find(([, h]) => h.match(error))?.[0];
}

describe('tinypng error handlers', () => {
	it.each<{
		error: Error;
		name: keyof typeof errorHandlers;
		retries: number;
	}>([
		{
			error: new TinypngAPIError('Too Many Requests', 429),
			name: 'RATE_LIMIT_ERROR',
			retries: 3,
		},
		{
			error: new TinypngAPIError('Credentials are invalid', 401),
			name: 'AUTH_ERROR',
			retries: 0,
		},
		{
			error: new TinypngAPIError('Temporary failure', 503),
			name: 'SERVER_ERROR',
			retries: 1,
		},
		{
			error: new TinypngAPIError('Too Many Requests', 429, undefined, true),
			name: 'DEFAULT',
			retries: 0,
		},
		{
			error: new TinypngAPIError('Input missing', 400),
			name: 'DEFAULT',
			retries: 0,
		},
		{
			error: new AzureBlobError('AuthenticationFailed', 403),
			name: 'DEFAULT',
			retries: 0,
		},
	])(
		'routes $error.name $error.status to $name',
		async ({ error, name, retries }) => {
			expect(classify(error)).toBe(name);
			const handler = errorHandlers[name];
			await expect(handler.handler()).resolves.toMatchObject({
				maxRetries: retries,
			});
		},
	);
});

import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax users endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('users.getMe sends GET /v1/users/me', async () => {
		request.mockResolvedValue({ _id: 'user-1', emailEmails: [] });
		const result = await endpoints.users.getMe(ctx, {});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/users/me', {
			method: 'GET',
		});
		expect(result).toEqual({ _id: 'user-1', emailEmails: [] });
	});

	it('userPreferences.get sends GET /v1/userpreferences/me with query', async () => {
		request.mockResolvedValue({});
		await endpoints.users.preferences.get(ctx, {
			fields: 'autoBccAddress',
			includeFinalDefaultCalendarUrl: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/userpreferences/me', {
			method: 'GET',
			query: {
				fields: 'autoBccAddress',
				includeFinalDefaultCalendarUrl: true,
			},
		});
	});

	it('userPreferences.update sends PATCH /v1/userpreferences/me with the preferences body', async () => {
		request.mockResolvedValue({});
		await endpoints.users.preferences.update(ctx, {
			autoBccAddress: 'bcc@example.com',
			undoSendEnabled: true,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/userpreferences/me', {
			method: 'PATCH',
			body: {
				autoBccAddress: 'bcc@example.com',
				undoSendEnabled: true,
			},
		});
	});

	it('userPreferences.autoBccExcludedEmails.list requires the email query', async () => {
		await expect(
			endpoints.users.preferences.autoBccExcludedEmails.list(
				ctx,
				// unknown: deliberately invalid input shape to prove the schema
				// boundary rejects it before transport.
				{} as never,
			),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		request.mockResolvedValue('OK');
		const result = await endpoints.users.preferences.autoBccExcludedEmails.list(
			ctx,
			{ email: 'jane@example.com' },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/userpreferences/me/autoBccExcludedEmails',
			{
				method: 'GET',
				query: { email: 'jane@example.com' },
			},
		);
		expect(result).toBe('OK');
	});

	it('userPreferences.autoBccExcludedEmails.add sends the documented body', async () => {
		request.mockResolvedValue({
			results: [{ email: 'a@b.com', success: true }],
		});
		const result = await endpoints.users.preferences.autoBccExcludedEmails.add(
			ctx,
			{ emails: ['a@b.com'] },
		);

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/userpreferences/me/autoBccExcludedEmails',
			{
				method: 'POST',
				body: { email: undefined, emails: ['a@b.com'] },
			},
		);
		expect(result).toEqual({
			results: [{ email: 'a@b.com', success: true }],
		});
	});

	it('userPreferences.autoBccExcludedEmails.exists posts the email list', async () => {
		request.mockResolvedValue([{ email: 'a@b.com', exists: true }]);
		const result =
			await endpoints.users.preferences.autoBccExcludedEmails.exists(ctx, {
				emails: ['a@b.com'],
			});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/userpreferences/me/autoBccExcludedEmails/exists',
			{
				method: 'POST',
				body: { emails: ['a@b.com'] },
			},
		);
		expect(result).toEqual([{ email: 'a@b.com', exists: true }]);
	});
});

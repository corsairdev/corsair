import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMailboxLayerRequest } from '../client';
import type { MailboxLayerContext } from '../index';
import { check } from './check';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return { ...actual, makeMailboxLayerRequest: jest.fn() };
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const mockRequest = makeMailboxLayerRequest as jest.MockedFunction<
	typeof makeMailboxLayerRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const CHECK_RESPONSE = {
	email: 'support@apilayer.net',
	did_you_mean: '',
	user: 'support',
	domain: 'apilayer.net',
	format_valid: true,
	mx_found: true,
	smtp_check: true,
	catch_all: false,
	role: true,
	disposable: false,
	free: false,
	score: 0.8,
};

const upsertByEntityId = jest.fn().mockResolvedValue(undefined);

function makeCtx(
	overrides: Partial<MailboxLayerContext> = {},
): MailboxLayerContext {
	return {
		key: 'test-key',
		options: {},
		db: { emailChecks: { upsertByEntityId } },
		...overrides,
	} as never;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
	upsertByEntityId.mockReset();
	upsertByEntityId.mockResolvedValue(undefined);
});

describe('email.check', () => {
	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			check(makeCtx({ key: undefined }), { email: 'support@apilayer.net' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a malformed email before calling the API', async () => {
		await expect(
			check(makeCtx(), { email: 'not-a-valid-email' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty email before calling the API', async () => {
		await expect(check(makeCtx(), { email: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('calls check with smtp=1 by default and persists the result', async () => {
		mockRequest.mockResolvedValue(CHECK_RESPONSE);

		const result = await check(makeCtx(), { email: 'support@apilayer.net' });

		expect(mockRequest).toHaveBeenCalledWith('check', 'test-key', {
			query: {
				email: 'support@apilayer.net',
				smtp: 1,
				format: 1,
			},
		});
		expect(result.email).toBe('support@apilayer.net');
		expect(upsertByEntityId).toHaveBeenCalledWith('support@apilayer.net', {
			email: 'support@apilayer.net',
			didYouMean: '',
			user: 'support',
			domain: 'apilayer.net',
			formatValid: true,
			mxFound: true,
			smtpCheck: true,
			catchAll: false,
			role: true,
			disposable: false,
			free: false,
			score: 0.8,
			checkedAt: expect.any(Date),
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'mailboxlayer.email.check',
			{ email: 's***@apilayer.net' },
			'completed',
		);
	});

	it('sends smtp=0 when smtp is false', async () => {
		mockRequest.mockResolvedValue(CHECK_RESPONSE);

		await check(makeCtx(), { email: 'support@apilayer.net', smtp: false });

		expect(mockRequest).toHaveBeenCalledWith(
			'check',
			'test-key',
			expect.objectContaining({
				query: expect.objectContaining({ smtp: 0 }),
			}),
		);
	});

	it('never forwards a useHttps option, even if a caller sets one', async () => {
		mockRequest.mockResolvedValue(CHECK_RESPONSE);

		await check(
			// @ts-expect-error — useHttps is no longer a supported plugin option;
			// this guards against it being silently reintroduced.
			makeCtx({ options: { useHttps: false } }),
			{ email: 'support@apilayer.net' },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			'check',
			'test-key',
			expect.not.objectContaining({ useHttps: expect.anything() }),
		);
	});

	it('does not fail the call when persistence throws', async () => {
		mockRequest.mockResolvedValue(CHECK_RESPONSE);
		upsertByEntityId.mockRejectedValueOnce(new Error('db unavailable'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await check(makeCtx(), { email: 'support@apilayer.net' });

		expect(result.email).toBe('support@apilayer.net');
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it('skips persist when db is missing', async () => {
		mockRequest.mockResolvedValue(CHECK_RESPONSE);

		const result = await check(makeCtx({ db: undefined }), {
			email: 'support@apilayer.net',
		});

		expect(result.email).toBe('support@apilayer.net');
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});
});

import { logEventFromContext } from 'corsair/core';
import { Account, Image } from './endpoints';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeKrakenRequest: jest.fn(),
	};
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { makeKrakenRequest } = jest.requireMock('./client') as {
	makeKrakenRequest: jest.Mock;
};
const mockLog = jest.mocked(logEventFromContext);

function createContext() {
	return { key: 'the-key:the-secret' };
}

describe('Kraken endpoint operations', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('account.checkStatus posts only auth to /user_status', async () => {
		makeKrakenRequest.mockResolvedValue({
			success: true,
			active: true,
			plan_name: 'Free',
			quota_total: 104857600,
			quota_used: 1000,
			quota_remaining: 104856600,
		});
		const ctx = createContext();

		const result = await Account.checkStatus(ctx as never, undefined as never);

		expect(makeKrakenRequest).toHaveBeenCalledWith('user_status', {
			apiKey: 'the-key',
			apiSecret: 'the-secret',
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'kraken.account.checkStatus',
			{},
			'completed',
		);
		expect(result.quota_remaining).toBe(104856600);
	});

	it('image.optimizeUrl forwards url/wait/lossy/filename/callback_url', async () => {
		makeKrakenRequest.mockResolvedValue({
			success: true,
			file_name: 'header.jpg',
			original_size: 324520,
			kraked_size: 165358,
			saved_bytes: 159162,
			kraked_url: 'http://dl.kraken.io/header.jpg',
		});
		const ctx = createContext();
		const input = {
			url: 'https://example.com/header.jpg',
			wait: true,
			lossy: true,
			filename: 'header.jpg',
		};

		const result = await Image.optimizeUrl(ctx as never, input as never);

		expect(makeKrakenRequest).toHaveBeenCalledWith(
			'v1/url',
			{ apiKey: 'the-key', apiSecret: 'the-secret' },
			{
				url: input.url,
				wait: true,
				lossy: true,
				filename: 'header.jpg',
				callback_url: undefined,
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'kraken.image.optimizeUrl',
			input,
			'completed',
		);
		expect(result.kraked_url).toBe('http://dl.kraken.io/header.jpg');
	});

	it('image.preserveMetadata forwards the preserve_meta array', async () => {
		makeKrakenRequest.mockResolvedValue({
			success: true,
			kraked_url: 'http://dl.kraken.io/x.jpg',
		});
		const ctx = createContext();
		const input = {
			url: 'https://example.com/x.jpg',
			preserve_meta: ['profile', 'geotag'],
			wait: true,
		};

		await Image.preserveMetadata(ctx as never, input as never);

		expect(makeKrakenRequest).toHaveBeenCalledWith(
			'v1/url',
			{ apiKey: 'the-key', apiSecret: 'the-secret' },
			{
				url: input.url,
				preserve_meta: ['profile', 'geotag'],
				wait: true,
				lossy: undefined,
				filename: undefined,
			},
		);
	});

	it('image.sandboxUpload always forces dev: true regardless of input', async () => {
		makeKrakenRequest.mockResolvedValue({
			success: true,
			kraked_url: 'http://dl.kraken.io/sandbox.jpg',
		});
		const ctx = createContext();

		// `dev` is intentionally not part of the public input type — cast
		// through `unknown` to prove a caller-supplied value can't override it.
		await Image.sandboxUpload(
			ctx as never,
			{
				url: 'https://example.com/sandbox.jpg',
				wait: true,
				dev: false,
			} as unknown as never,
		);

		expect(makeKrakenRequest).toHaveBeenCalledWith(
			'v1/url',
			{ apiKey: 'the-key', apiSecret: 'the-secret' },
			{
				url: 'https://example.com/sandbox.jpg',
				wait: true,
				filename: undefined,
				dev: true,
			},
		);
	});

	it('applies the schema default wait: true when the caller omits it', async () => {
		makeKrakenRequest.mockResolvedValue({
			success: true,
			kraked_url: 'http://dl.kraken.io/default-wait.jpg',
		});
		const ctx = createContext();

		await Image.optimizeUrl(
			ctx as never,
			{
				url: 'https://example.com/default-wait.jpg',
			} as never,
		);

		expect(makeKrakenRequest).toHaveBeenCalledWith(
			'v1/url',
			{ apiKey: 'the-key', apiSecret: 'the-secret' },
			expect.objectContaining({ wait: true }),
		);
	});

	it('rejects input before calling the API when preserve_meta is empty', async () => {
		const ctx = createContext();

		await expect(
			Image.preserveMetadata(
				ctx as never,
				{
					url: 'https://example.com/x.jpg',
					preserve_meta: [],
				} as never,
			),
		).rejects.toThrow();
		expect(makeKrakenRequest).not.toHaveBeenCalled();
	});

	it('rejects a malformed provider response instead of returning it untyped', async () => {
		// Missing the required `success` field.
		makeKrakenRequest.mockResolvedValue({ quota_remaining: 'not-a-number' });
		const ctx = createContext();

		await expect(
			Account.checkStatus(ctx as never, undefined as never),
		).rejects.toThrow();
	});
});

import * as client from '../client';
import { Approval, Delegation, Order, Quote, Swap, Transaction } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeUniswapApiRequest: jest.fn(),
}));

const mockedRequest = client.makeUniswapApiRequest as jest.MockedFunction<
	typeof client.makeUniswapApiRequest
>;

const ctx = {
	key: 'test-api-key',
	db: {},
} as any;

describe('Uniswap API endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	describe('approval', () => {
		it('checks token approval with correct path and body', async () => {
			const input = {
				token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				amount: '1000000',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
				chainId: 1,
			};

			await Approval.check(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/check_approval',
				ctx.key,
				{
					method: 'POST',
					body: {
						token: input.token,
						amount: input.amount,
						walletAddress: input.walletAddress,
						chainId: input.chainId,
					},
				},
			);
		});
	});

	describe('quote', () => {
		it('gets a quote with required fields', async () => {
			const input = {
				type: 'EXACT_INPUT' as const,
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
				tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				tokenOutChainId: 1,
				amount: '1000000',
				swapper: '0x1234567890abcdef1234567890abcdef12345678',
			};

			await Quote.get(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/quote', ctx.key, {
				method: 'POST',
				body: {
					type: 'EXACT_INPUT',
					tokenIn: input.tokenIn,
					tokenInChainId: 1,
					tokenOut: input.tokenOut,
					tokenOutChainId: 1,
					amount: '1000000',
					swapper: input.swapper,
				},
			});
		});

		it('includes optional fields when provided', async () => {
			const input = {
				type: 'EXACT_OUTPUT' as const,
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
				tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				tokenOutChainId: 1,
				amount: '500000000000000000',
				swapper: '0x1234567890abcdef1234567890abcdef12345678',
				slippageTolerance: 0.5,
				urgency: 'fast' as const,
				recipient: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			};

			await Quote.get(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/quote', ctx.key, {
				method: 'POST',
				body: expect.objectContaining({
					slippageTolerance: 0.5,
					urgency: 'fast',
					recipient: input.recipient,
				}),
			});
		});
	});

	describe('swap', () => {
		it('creates swap calldata from a quote', async () => {
			const quote = { quoteId: 'quote-123', tokenIn: '0xabc' };
			const input = {
				quote,
				signature: '0xsig',
			};

			await Swap.create(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swap', ctx.key, {
				method: 'POST',
				body: {
					quote,
					signature: '0xsig',
				},
			});
		});

		it('creates swap without optional fields', async () => {
			const quote = { quoteId: 'quote-456' };

			await Swap.create(ctx, { quote });

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swap', ctx.key, {
				method: 'POST',
				body: {
					quote,
				},
			});
		});

		it('gets swap status by tx hash and chain', async () => {
			const input = {
				txHash:
					'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				chainId: 1,
			};

			await Swap.getStatus(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swap_status', ctx.key, {
				method: 'GET',
				query: {
					txHash: input.txHash,
					chainId: 1,
				},
			});
		});
	});

	describe('order', () => {
		it('gets gasless order status by order ID', async () => {
			const input = {
				orderId: 'order-abc-123',
			};

			await Order.getStatus(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/orders', ctx.key, {
				method: 'GET',
				query: {
					orderId: 'order-abc-123',
				},
			});
		});
	});

	describe('output validation', () => {
		it('rejects malformed provider output before returning', async () => {
			mockedRequest.mockResolvedValueOnce({ chainId: '1' } as never);

			await expect(
				Swap.getStatus(ctx, {
					txHash:
						'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
					chainId: 1,
				}),
			).rejects.toThrow();
		});
	});

	describe('delegation', () => {
		it('checks wallet delegation across chains', async () => {
			const input = {
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
				chainIds: [1, 10, 8453],
			};

			await Delegation.check(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/check_delegation',
				ctx.key,
				{
					method: 'POST',
					body: {
						walletAddress: input.walletAddress,
						chainIds: [1, 10, 8453],
					},
				},
			);
		});
	});

	describe('transaction', () => {
		it('encodes 7702 batched transactions', async () => {
			const input = {
				transactions: [
					{ to: '0xabc', data: '0x1234', value: '0' },
					{ to: '0xdef', data: '0x5678' },
				],
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
				chainId: 1,
			};

			await Transaction.encode7702(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/encode_7702_transaction',
				ctx.key,
				{
					method: 'POST',
					body: {
						transactions: input.transactions,
						walletAddress: input.walletAddress,
						chainId: 1,
					},
				},
			);
		});
	});
});

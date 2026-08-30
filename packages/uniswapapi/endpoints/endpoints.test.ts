import { logEventFromContext } from 'corsair/core';
import * as client from '../client';
import {
	Approval,
	Delegation,
	Order,
	Quote,
	Swap,
	SwappableTokens,
	Transaction,
} from './index';
import type {
	CheckApprovalResponse,
	GetOrderStatusResponse,
	GetQuoteResponse,
	GetSwappableTokensResponse,
	GetSwapStatusResponse,
	UniswapApiEndpointContext,
} from './types';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

// Keep the real module shape so error-handlers can still reference
// UniswapApiAPIError; only the request function is replaced.
jest.mock('../client', () => ({
	...jest.requireActual<typeof import('../client')>('../client'),
	makeUniswapApiRequest: jest.fn(),
}));

const mockedRequest = client.makeUniswapApiRequest as jest.MockedFunction<
	typeof client.makeUniswapApiRequest
>;

const ctx: UniswapApiEndpointContext = {
	key: 'test-api-key',
	$getAccountId: async () => 'account-1',
};

const tx = {
	to: '0x1234567890abcdef1234567890abcdef12345678',
	data: '0x1234',
	value: '0',
	chainId: 1,
};

describe('Uniswap API endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('approval', () => {
		it('checks token approval with correct path and body', async () => {
			const response: CheckApprovalResponse = {
				requestId: 'req-1',
				approval: null,
			};
			mockedRequest.mockResolvedValueOnce(response);
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

		it('accepts an approval transaction when one is required', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-2',
				approval: { ...tx, from: '0xabc' },
				gasFee: '1000000000000000',
			});

			await expect(
				Approval.check(ctx, {
					token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					amount: '1000000',
					walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
					chainId: 1,
				}),
			).resolves.toMatchObject({
				requestId: 'req-2',
				gasFee: '1000000000000000',
			});
		});
	});

	describe('quote', () => {
		it('gets a quote with slippageTolerance mode', async () => {
			const response: GetQuoteResponse = {
				requestId: 'req-3',
				routing: 'CLASSIC',
				quote: { quoteId: 'quote-123' },
				permitData: null,
			};
			mockedRequest.mockResolvedValueOnce(response);
			const input = {
				type: 'EXACT_INPUT' as const,
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
				tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				tokenOutChainId: 1,
				amount: '1000000',
				swapper: '0x1234567890abcdef1234567890abcdef12345678',
				slippageTolerance: 0.5,
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
					slippageTolerance: 0.5,
				},
			});
		});

		it('forwards autoSlippage and optional fields when provided', async () => {
			const response: GetQuoteResponse = {
				requestId: 'req-4',
				routing: 'DUTCH_V2',
				quote: { quoteId: 'quote-456' },
				permitData: { domain: {} },
			};
			mockedRequest.mockResolvedValueOnce(response);
			const input = {
				type: 'EXACT_OUTPUT' as const,
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
				tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				tokenOutChainId: 1,
				amount: '500000000000000000',
				swapper: '0x1234567890abcdef1234567890abcdef12345678',
				autoSlippage: 'DEFAULT' as const,
				urgency: 'urgent' as const,
				recipient: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				protocols: ['V4'],
			};

			await Quote.get(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith('/v1/quote', ctx.key, {
				method: 'POST',
				body: expect.objectContaining({
					autoSlippage: 'DEFAULT',
					urgency: 'urgent',
					recipient: input.recipient,
					protocols: ['V4'],
				}),
			});
		});
	});

	describe('swap', () => {
		it('creates swap calldata from a quote without permit fields', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-5',
				swap: tx,
			});
			const quote = { quoteId: 'quote-123', tokenIn: '0xabc' };

			await Swap.create(ctx, { quote });

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swap', ctx.key, {
				method: 'POST',
				body: {
					quote,
				},
			});
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				'uniswapapi.swap.create',
				{ quote },
				'completed',
			);
		});

		it('sends permitData together with its signature', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-6',
				swap: tx,
			});
			const permitData = { domain: {}, values: {}, types: {} };

			await Swap.create(ctx, {
				quote: { quoteId: 'quote-456' },
				signature: '0xsig',
				permitData,
			});

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swap', ctx.key, {
				method: 'POST',
				body: {
					quote: { quoteId: 'quote-456' },
					signature: '0xsig',
					permitData,
				},
			});
		});

		it('queries /v1/swaps by transaction hashes', async () => {
			const response: GetSwapStatusResponse = {
				requestId: 'req-7',
				swaps: [{ status: 'SUCCESS', txHash: '0xdead' }],
			};
			mockedRequest.mockResolvedValueOnce(response);

			await Swap.getStatus(ctx, {
				txHashes: [
					'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				],
				chainId: 1,
			});

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swaps', ctx.key, {
				method: 'GET',
				query: {
					txHashes: [
						'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
					],
					userOpHashes: undefined,
					chainId: 1,
					swapper: undefined,
				},
			});
		});

		it('supports userOpHash queries and returns parsed rows', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-8',
				swaps: [
					{ status: 'PENDING', userOpHash: '0xbeef', hashType: 'USER_OP' },
				],
			});

			const result = await Swap.getStatus(ctx, {
				userOpHashes: ['0x1234567890abcdef'],
				chainId: 1,
			});

			expect(mockedRequest).toHaveBeenCalledWith('/v1/swaps', ctx.key, {
				method: 'GET',
				query: {
					txHashes: undefined,
					userOpHashes: ['0x1234567890abcdef'],
					chainId: 1,
					swapper: undefined,
				},
			});
			expect(result.swaps).toHaveLength(1);
		});

		it('rejects malformed provider output before returning', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-9',
				swaps: [{ status: 'UNKNOWN_STATUS' }],
			});

			await expect(
				Swap.getStatus(ctx, {
					txHashes: [
						'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
					],
					chainId: 1,
				}),
			).rejects.toThrow();
		});
	});

	describe('order', () => {
		it('gets gasless orders by order ID with pagination cursor', async () => {
			const orderId = `0x${'a'.repeat(64)}`;
			const response: GetOrderStatusResponse = {
				requestId: 'req-10',
				orders: [
					{
						orderId,
						orderStatus: 'filled',
						chainId: 1,
						type: 'Dutch_V2',
					},
				],
			};
			mockedRequest.mockResolvedValueOnce(response);

			const result = await Order.getStatus(ctx, {
				orderId,
				limit: 10,
				cursor: 'cursor-1',
			});

			expect(mockedRequest).toHaveBeenCalledWith('/v1/orders', ctx.key, {
				method: 'GET',
				query: {
					orderId,
					orderIds: undefined,
					orderStatus: undefined,
					swapper: undefined,
					filler: undefined,
					limit: 10,
					cursor: 'cursor-1',
					sortKey: undefined,
				},
			});
			expect(result.orders[0]?.orderStatus).toBe('filled');
		});

		it('filters by order status across multiple IDs', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-11',
				orders: [],
			});
			const orderIds = [`0x${'b'.repeat(64)}`, `0x${'c'.repeat(64)}`];

			await Order.getStatus(ctx, {
				orderIds,
				orderStatus: 'open',
			});

			expect(mockedRequest).toHaveBeenCalledWith('/v1/orders', ctx.key, {
				method: 'GET',
				query: expect.objectContaining({
					orderIds,
					orderStatus: 'open',
				}),
			});
		});
	});

	describe('delegation', () => {
		it('checks wallet delegation across chains on the wallet path', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-12',
				delegationDetails: {
					'0x1234567890abcdef1234567890abcdef12345678': {
						'1': {
							isWalletDelegatedToUniswap: true,
							currentDelegationAddress:
								'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
							latestDelegationAddress:
								'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
						},
					},
				},
			});
			const input = {
				walletAddresses: ['0x1234567890abcdef1234567890abcdef12345678'],
				chainIds: [1, 10, 8453],
			};

			const result = await Delegation.check(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/wallet/check_delegation',
				ctx.key,
				{
					method: 'POST',
					body: {
						walletAddresses: input.walletAddresses,
						chainIds: [1, 10, 8453],
					},
				},
			);
			expect(
				result.delegationDetails[input.walletAddresses[0] ?? '']?.['1']
					?.isWalletDelegatedToUniswap,
			).toBe(true);
		});

		it('accepts a null current delegation address', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-13',
				delegationDetails: {
					'0x1234567890abcdef1234567890abcdef12345678': {
						'8453': {
							isWalletDelegatedToUniswap: false,
							currentDelegationAddress: null,
							latestDelegationAddress:
								'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
						},
					},
				},
			});

			await expect(
				Delegation.check(ctx, {
					walletAddresses: ['0x1234567890abcdef1234567890abcdef12345678'],
					chainIds: [8453],
				}),
			).resolves.toBeTruthy();
		});
	});

	describe('transaction', () => {
		it('encodes 7702 calls on the wallet path', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-14',
				encoded: tx,
			});
			const input = {
				calls: [
					{ to: '0xabc', data: '0x12345678', value: '0x0', chainId: 1 },
					{ to: '0xdef', data: '0x56781234', value: '0x0', chainId: 1 },
				],
				smartContractDelegationAddress:
					'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
			};

			await Transaction.encode7702(ctx, input);

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/wallet/encode_7702',
				ctx.key,
				{
					method: 'POST',
					body: {
						calls: input.calls,
						smartContractDelegationAddress:
							'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
						walletAddress: input.walletAddress,
					},
				},
			);
		});
	});

	describe('swappableTokens', () => {
		it('lists destination tokens for a source token', async () => {
			const response: GetSwappableTokensResponse = {
				requestId: 'req-15',
				tokens: [
					{
						address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						chainId: 8453,
						name: 'Wrapped Ether',
						symbol: 'WETH',
						decimals: 18,
					},
				],
			};
			mockedRequest.mockResolvedValueOnce(response);

			const result = await SwappableTokens.get(ctx, {
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
			});

			expect(mockedRequest).toHaveBeenCalledWith(
				'/v1/swappable_tokens',
				ctx.key,
				{
					method: 'GET',
					query: {
						tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
						tokenInChainId: 1,
					},
				},
			);
			expect(result.tokens[0]?.symbol).toBe('WETH');
		});

		it('rejects token rows missing required metadata', async () => {
			mockedRequest.mockResolvedValueOnce({
				requestId: 'req-16',
				tokens: [{ address: '0xabc', chainId: 8453, name: 'Junk Token' }],
			});

			await expect(
				SwappableTokens.get(ctx, {
					tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					tokenInChainId: 1,
				}),
			).rejects.toThrow();
		});
	});
});

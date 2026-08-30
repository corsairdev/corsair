import {
	UniswapApiEndpointInputSchemas,
	UniswapApiEndpointOutputSchemas,
} from './types';

const transaction = {
	to: '0x1234567890abcdef1234567890abcdef12345678',
	data: '0x1234',
	value: '0x0',
	chainId: 1,
};

const quoteBase = {
	type: 'EXACT_INPUT' as const,
	tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	tokenInChainId: 1,
	tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	tokenOutChainId: 1,
	amount: '1000000',
	swapper: '0x1234567890abcdef1234567890abcdef12345678',
};

const ORDER_ID = `0x${'a'.repeat(64)}`;

const orderBase = {
	orderId: ORDER_ID,
	orderStatus: 'filled' as const,
	chainId: 1,
	type: 'Dutch_V2' as const,
};

describe('Uniswap API output schemas', () => {
	it.each([
		[
			'approvalCheck',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ requestId: 'req-1', approval: null },
		],
		[
			'approvalCheck transaction',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ requestId: 'req-1', approval: transaction },
		],
		[
			'quoteGet',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{
				requestId: 'req-1',
				routing: 'CLASSIC',
				quote: { quoteId: 'quote-1' },
				permitData: null,
			},
		],
		[
			'swapCreate',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1', swap: transaction },
		],
		[
			'swapGetStatus',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{
				requestId: 'req-1',
				swaps: [{ status: 'NOT_FOUND', txHash: '0xdead' }],
			},
		],
		[
			'orderGetStatus',
			UniswapApiEndpointOutputSchemas.orderGetStatus,
			{ requestId: 'req-1', orders: [orderBase], cursor: 'next' },
		],
		[
			'delegationCheck',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{
				requestId: 'req-1',
				delegationDetails: {
					'0x1234567890abcdef1234567890abcdef12345678': {
						'1': {
							isWalletDelegatedToUniswap: false,
							currentDelegationAddress: null,
							latestDelegationAddress:
								'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
						},
					},
				},
			},
		],
		[
			'delegationCheck with no delegated wallets',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{ requestId: 'req-1', delegationDetails: {} },
		],
		[
			'transactionEncode7702',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			{ requestId: 'req-1', encoded: transaction },
		],
		[
			'swappableTokensGet',
			UniswapApiEndpointOutputSchemas.swappableTokensGet,
			{
				requestId: 'req-1',
				tokens: [
					{
						address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
						chainId: 8453,
						name: 'Wrapped Ether',
						symbol: 'WETH',
						decimals: 18,
					},
				],
			},
		],
	])('accepts a complete %s response', (_name, schema, response) => {
		expect(schema.safeParse(response).success).toBe(true);
	});

	it.each([
		['approvalCheck', UniswapApiEndpointOutputSchemas.approvalCheck, {}],
		[
			'approvalCheck missing requestId',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ approval: null },
		],
		[
			'approvalCheck empty approval',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ requestId: 'req-1', approval: {} },
		],
		[
			'quoteGet missing routing',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{ requestId: 'req-1', quote: { a: 1 }, permitData: null },
		],
		[
			'quoteGet empty quote',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{ requestId: 'req-1', routing: 'CLASSIC', quote: {}, permitData: null },
		],
		[
			'swapCreate missing swap',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1' },
		],
		[
			'swapCreate partial transaction',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1', swap: { to: transaction.to, data: '0x1234' } },
		],
		[
			'swapGetStatus missing swaps',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{ requestId: 'req-1' },
		],
		[
			'swapGetStatus partial row',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{ requestId: 'req-1', swaps: [{ txHash: '0xdead' }] },
		],
		[
			'swapGetStatus unknown status',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{ requestId: 'req-1', swaps: [{ status: 'MAYBE' }] },
		],
		[
			'orderGetStatus empty orders item',
			UniswapApiEndpointOutputSchemas.orderGetStatus,
			{ requestId: 'req-1', orders: [{}] },
		],
		[
			'orderGetStatus unknown status',
			UniswapApiEndpointOutputSchemas.orderGetStatus,
			{
				requestId: 'req-1',
				orders: [{ ...orderBase, orderStatus: 'unknown' }],
			},
		],
		[
			'delegationCheck partial delegation',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{
				requestId: 'req-1',
				delegationDetails: {
					'0x1234567890abcdef1234567890abcdef12345678': { '1': {} },
				},
			},
		],
		[
			'transactionEncode7702 missing encoded',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			{ requestId: 'req-1' },
		],
		[
			'transactionEncode7702 empty calldata',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			{ requestId: 'req-1', encoded: { ...transaction, data: '0x' } },
		],
		[
			'swappableTokensGet partial token',
			UniswapApiEndpointOutputSchemas.swappableTokensGet,
			{
				requestId: 'req-1',
				tokens: [{ address: '0xabc', chainId: 8453, name: 'Junk Token' }],
			},
		],
	])('rejects an incomplete %s response', (_name, schema, response) => {
		expect(schema.safeParse(response).success).toBe(false);
	});
});

describe('Uniswap API input schemas', () => {
	it.each([
		['slippageTolerance mode', { ...quoteBase, slippageTolerance: 0.5 }],
		['autoSlippage mode', { ...quoteBase, autoSlippage: 'DEFAULT' }],
		[
			'urgent urgency',
			{ ...quoteBase, urgency: 'urgent', autoSlippage: 'DEFAULT' },
		],
	])('accepts a quote input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.quoteGet.safeParse(input).success,
		).toBe(true);
	});

	it.each([
		['neither slippage mode', quoteBase],
		[
			'both slippage modes',
			{ ...quoteBase, slippageTolerance: 0.5, autoSlippage: 'DEFAULT' },
		],
	])('rejects a quote input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.quoteGet.safeParse(input).success,
		).toBe(false);
	});

	it.each([
		[
			'signature and permitData together',
			{ quote: { a: 1 }, signature: '0xsig', permitData: { domain: {} } },
		],
		['no permit fields', { quote: { a: 1 } }],
		['refreshGasPrice flag', { quote: { a: 1 }, refreshGasPrice: true }],
	])('accepts a swap create input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.swapCreate.safeParse(input).success,
		).toBe(true);
	});

	it.each([
		['signature only', { quote: { a: 1 }, signature: '0xsig' }],
		['permitData only', { quote: { a: 1 }, permitData: { domain: {} } }],
		['empty quote', { quote: {} }],
	])('rejects a swap create input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.swapCreate.safeParse(input).success,
		).toBe(false);
	});

	it.each([
		['txHashes', { txHashes: ['0xdead'], chainId: 1 }],
		['userOpHashes', { userOpHashes: ['0xbeef'], chainId: 1 }],
		[
			'hashes plus swapper filter',
			{ txHashes: ['0xdead'], chainId: 1, swapper: '0xabc' },
		],
	])('accepts a swap status input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.swapGetStatus.safeParse(input).success,
		).toBe(true);
	});

	it('rejects a swap status input without the required chainId', () => {
		expect(
			UniswapApiEndpointInputSchemas.swapGetStatus.safeParse({
				txHashes: ['0xdead'],
			}).success,
		).toBe(false);
	});

	it.each([
		['no hashes', {}],
		['empty arrays', { txHashes: [], userOpHashes: [] }],
	])('rejects a swap status input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.swapGetStatus.safeParse(input).success,
		).toBe(false);
	});

	it.each([
		['orderId', { orderId: ORDER_ID }],
		[
			'orderIds plus status filter',
			{ orderIds: [ORDER_ID], orderStatus: 'open' },
		],
		[
			'orderId plus swapper and pagination',
			{ orderId: ORDER_ID, swapper: '0xabc', limit: 5, cursor: 'c' },
		],
	])('accepts an order status input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.orderGetStatus.safeParse(input).success,
		).toBe(true);
	});

	it.each([
		['no reference at all', {}],
		['orderStatus only', { orderStatus: 'open' }],
		['swapper only', { swapper: '0xabc' }],
		['filler only', { filler: '0xdef', limit: 5 }],
		['malformed orderId', { orderId: 'order-abc-123' }],
	])('rejects an order status input with %s', (_name, input) => {
		expect(
			UniswapApiEndpointInputSchemas.orderGetStatus.safeParse(input).success,
		).toBe(false);
	});

	it('accepts a delegation input and rejects empty arrays', () => {
		const schema = UniswapApiEndpointInputSchemas.delegationCheck;
		expect(
			schema.safeParse({
				walletAddresses: ['0x1234567890abcdef1234567890abcdef12345678'],
				chainIds: [1],
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ walletAddresses: [], chainIds: [1] }).success,
		).toBe(false);
	});

	it('requires calls, delegation address, and wallet for encode7702 input', () => {
		const schema = UniswapApiEndpointInputSchemas.transactionEncode7702;
		expect(
			schema.safeParse({
				calls: [{ ...transaction, data: '0x12345678' }],
				smartContractDelegationAddress:
					'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				calls: [],
				smartContractDelegationAddress:
					'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
			}).success,
		).toBe(false);
	});

	it('rejects encode7702 calls without a 4-byte selector or with decimal wei', () => {
		const schema = UniswapApiEndpointInputSchemas.transactionEncode7702;
		expect(
			schema.safeParse({
				calls: [{ ...transaction, data: '0x12' }],
				smartContractDelegationAddress:
					'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				calls: [
					{ ...transaction, data: '0x12345678', value: '1000000000000000000' },
				],
				smartContractDelegationAddress:
					'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
			}).success,
		).toBe(false);
	});

	it('requires tokenIn and tokenInChainId for swappable tokens input', () => {
		const schema = UniswapApiEndpointInputSchemas.swappableTokensGet;
		expect(
			schema.safeParse({
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				tokenInChainId: 1,
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			}).success,
		).toBe(false);
	});
});

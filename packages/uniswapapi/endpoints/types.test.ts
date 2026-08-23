import { UniswapApiEndpointOutputSchemas } from './types';

const transaction = {
	to: '0x1234567890abcdef1234567890abcdef12345678',
	data: '0x1234',
	value: '0',
	chainId: 1,
};

describe('Uniswap API output schemas', () => {
	it.each([
		[
			'approvalCheck',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ requestId: 'req-1', approval: null },
		],
		[
			'quoteGet',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{ requestId: 'req-1', routing: 'CLASSIC', quote: { quoteId: 'quote-1' } },
		],
		[
			'swapCreate',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1', swap: transaction },
		],
		[
			'swapGetStatus',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{ status: 'SUCCESS' },
		],
		[
			'orderGetStatus',
			UniswapApiEndpointOutputSchemas.orderGetStatus,
			{ orderStatus: 'filled' },
		],
		[
			'delegationCheck',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{ delegations: [{ chainId: 1, delegated: false }] },
		],
		[
			'transactionEncode7702',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			transaction,
		],
	])('accepts a complete %s response', (_name, schema, response) => {
		expect(schema.safeParse(response).success).toBe(true);
	});

	it.each([
		['approvalCheck', UniswapApiEndpointOutputSchemas.approvalCheck, {}],
		[
			'approvalCheck empty approval',
			UniswapApiEndpointOutputSchemas.approvalCheck,
			{ requestId: 'req-1', approval: {} },
		],
		[
			'quoteGet',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{ requestId: 'req-1', routing: 'CLASSIC' },
		],
		[
			'quoteGet empty quote',
			UniswapApiEndpointOutputSchemas.quoteGet,
			{ requestId: 'req-1', routing: 'CLASSIC', quote: {} },
		],
		[
			'swapCreate',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1' },
		],
		[
			'swapCreate partial transaction',
			UniswapApiEndpointOutputSchemas.swapCreate,
			{ requestId: 'req-1', swap: { to: transaction.to, data: '0x1234' } },
		],
		[
			'swapGetStatus',
			UniswapApiEndpointOutputSchemas.swapGetStatus,
			{
				txHash:
					'0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
			},
		],
		[
			'orderGetStatus',
			UniswapApiEndpointOutputSchemas.orderGetStatus,
			{ orderId: 'order-1' },
		],
		[
			'delegationCheck',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{ delegations: [] },
		],
		[
			'delegationCheck partial delegation',
			UniswapApiEndpointOutputSchemas.delegationCheck,
			{ delegations: [{ chainId: 1 }] },
		],
		[
			'transactionEncode7702',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			{ to: transaction.to, data: '0x1234', chainId: 1 },
		],
		[
			'transactionEncode7702 empty calldata',
			UniswapApiEndpointOutputSchemas.transactionEncode7702,
			{ ...transaction, data: '0x' },
		],
	])('rejects an incomplete %s response', (_name, schema, response) => {
		expect(schema.safeParse(response).success).toBe(false);
	});
});

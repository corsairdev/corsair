
import { alchemyEndpointSchemas } from './index';
import { AlchemyEndpointInputSchemas, AlchemyEndpointOutputSchemas } from './endpoints/types';
import { z } from 'zod';

describe('Alchemy API plugin schemas', () => {
	it('exports endpoint schemas correctly', () => {
		expect(alchemyEndpointSchemas['core.getBlockNumber']).toBeDefined();
		expect(alchemyEndpointSchemas['nft.getNftsForOwner']).toBeDefined();
		expect(alchemyEndpointSchemas['token.getTokenBalances']).toBeDefined();
		expect(alchemyEndpointSchemas['transfers.getAssetTransfers']).toBeDefined();
	});

	it('validates coreGetBlockNumber input successfully', () => {
		const inputSchema = AlchemyEndpointInputSchemas.coreGetBlockNumber;
		expect(() => inputSchema.parse({})).not.toThrow();
		expect(() => inputSchema.parse({ network: 'eth-mainnet' })).not.toThrow();
		expect(() => inputSchema.parse({ network: 'invalid-network' })).toThrow();
	});

	it('validates nftGetNftsForOwner input successfully', () => {
		const inputSchema = AlchemyEndpointInputSchemas.nftGetNftsForOwner;
		expect(() => inputSchema.parse({ owner: '0x123' })).not.toThrow();
		expect(() =>
			inputSchema.parse({ owner: '0x123', contractAddresses: ['0x456'] }),
		).not.toThrow();
		expect(() =>
			inputSchema.parse({ owner: 123 }),
		).toThrow();
	});

	it('validates tokenGetTokenBalances input successfully', () => {
		const inputSchema = AlchemyEndpointInputSchemas.tokenGetTokenBalances;
		expect(() => inputSchema.parse({ address: '0x123' })).not.toThrow();
		expect(() =>
			inputSchema.parse({ address: '0x123', tokenAddresses: ['0x456'] }),
		).not.toThrow();
	});

	it('validates transfersGetAssetTransfers input successfully', () => {
		const inputSchema = AlchemyEndpointInputSchemas.transfersGetAssetTransfers;
		expect(() => inputSchema.parse({ fromBlock: '0x0' })).not.toThrow();
		expect(() =>
			inputSchema.parse({ category: ['external', 'internal'] }),
		).not.toThrow();
	});

	it('validates core.getBlock response shape successfully', () => {
		const outputSchema = AlchemyEndpointOutputSchemas.coreGetBlock;
		const blockResponse = {
			number: '0x10d4f',
			hash: '0x...',
			parentHash: '0x...',
			nonce: '0x0000',
			sha3Uncles: '0x...',
			logsBloom: '0x...',
			transactionsRoot: '0x...',
			stateRoot: '0x...',
			receiptsRoot: '0x...',
			miner: '0x...',
			difficulty: '0x0',
			extraData: '0x',
			size: '0x123',
			gasLimit: '0x123',
			gasUsed: '0x12',
			timestamp: '0x...',
			transactions: ['0x1234'],
			uncles: [],
		};
		expect(() => outputSchema.parse(blockResponse)).not.toThrow();
	});
});

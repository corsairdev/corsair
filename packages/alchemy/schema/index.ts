import {
	AlchemyNft,
	AlchemyNftContract,
	AlchemyToken,
	AlchemyTokenBalance,
	AlchemyTokenPrice,
} from './database';

export const AlchemySchema = {
	version: '1.0.0',
	entities: {
		AlchemyNftContract,
		AlchemyNft,
		AlchemyToken,
		AlchemyTokenPrice,
		AlchemyTokenBalance,
	},
} as const;

export * from './database';

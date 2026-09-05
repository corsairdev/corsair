import {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from './database';

export const BlocknativeSchema = {
	version: '1.0.0',
	entities: {
		chains: BlocknativeChain,
		oracles: BlocknativeOracle,
		blockPrices: BlocknativeBlockPrices,
		baseFeeEstimates: BlocknativeBaseFeeEstimates,
		gasDistributions: BlocknativeGasDistribution,
	},
} as const;

export {
	BlocknativeBaseFeeEstimates,
	BlocknativeBlockPrice,
	BlocknativeBlockPrices,
	BlocknativeChain,
	BlocknativeEstimatedPrice,
	BlocknativeGasDistribution,
	BlocknativeOracle,
} from './database';
